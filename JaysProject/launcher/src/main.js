'use strict';

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { SettingsStore, isValidAddress } = require('./settings');
const { resolveBinary, resolveServerData, getVersion, ManagedProcess } = require('./processes');

// Tests point the launcher at an isolated profile directory.
if (process.env.JAYS_USER_DATA) {
	app.setPath('userData', process.env.JAYS_USER_DATA);
}

const LAUNCHER_VERSION = require('../package.json').version;
const MAX_LOG_RECORDS = 5000;

const settings = new SettingsStore(app.getPath('userData'));
const client = new ManagedProcess('client');
const server = new ManagedProcess('server');
const logRecords = [];
let mainWindow = null;
let clientState = { state: 'idle', detail: '' };
let serverState = { state: 'stopped', detail: '' };
let info = null;

function send(channel, payload) {
	if (mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.webContents.send(channel, payload);
	}
}

function addLog(source, rec) {
	const entry = {
		source,
		time: new Date().toISOString(),
		level: String(rec.level || 'INFO').toUpperCase(),
		component: rec.component || source,
		msg: String(rec.msg ?? ''),
	};
	logRecords.push(entry);
	if (logRecords.length > MAX_LOG_RECORDS) {
		logRecords.splice(0, logRecords.length - MAX_LOG_RECORDS);
	}
	send('log', entry);
}

function launcherLog(level, msg) {
	addLog('launcher', { level, component: 'launcher', msg });
}

function setClientState(state, detail = '') {
	clientState = { state, detail };
	send('client-state', clientState);
}

function setServerState(state, detail = '') {
	serverState = { state, detail };
	send('server-state', serverState);
}

client.on('log', (rec) => {
	addLog('client', rec);
	if (rec.component === 'state') {
		const sep = rec.msg.indexOf(':');
		const state = sep >= 0 ? rec.msg.slice(0, sep) : rec.msg;
		const detail = sep >= 0 ? rec.msg.slice(sep + 1).trim() : '';
		setClientState(state, detail);
	} else if (rec.component === 'stats') {
		const m = /ping=(-?\d+)ms/.exec(rec.msg);
		if (m) {
			send('client-stats', { ping: Number(m[1]) });
		}
	}
});

const EXIT_MEANINGS = {
	0: 'exited normally',
	2: 'invalid arguments',
	3: 'could not connect',
	4: 'rejected by server',
	5: 'disconnected',
	6: 'protocol error',
};

client.on('exit', ({ code, signal }) => {
	const meaning = EXIT_MEANINGS[code] || (signal ? `killed (${signal})` : `exit code ${code}`);
	launcherLog(code === 0 ? 'INFO' : 'WARN', `client process ended: ${meaning}`);
	if (code !== 0 && code !== null) {
		send('error', { title: 'Connection ended', message: `${meaning}: ${clientState.detail || 'see logs'}` });
		if (clientState.state !== 'disconnected') {
			setClientState('disconnected', meaning);
		}
	} else if (clientState.state !== 'disconnected') {
		setClientState('disconnected', meaning);
	}
	send('client-exit', { code, meaning });
});

server.on('log', (rec) => {
	addLog('server', rec);
	if (rec.component === 'server' && rec.msg.includes(' ready')) {
		setServerState('running', `127.0.0.1:${settings.current.localServerPort}`);
	}
});

server.on('exit', ({ code }) => {
	launcherLog(code === 0 ? 'INFO' : 'ERROR', `local server exited with code ${code}`);
	if (code !== 0 && code !== null) {
		send('error', { title: 'Local server stopped', message: 'The local test server exited unexpectedly. Check the logs.' });
	}
	setServerState('stopped', code === 0 ? '' : `exit code ${code}`);
});

async function collectInfo() {
	const s = settings.current;
	const clientBin = resolveBinary('jays-client', s.clientPath, app);
	const serverBin = resolveBinary('jays-server', s.serverPath, app);
	const [clientVersion, serverVersion] = await Promise.all([getVersion(clientBin), getVersion(serverBin)]);
	info = {
		launcherVersion: LAUNCHER_VERSION,
		clientVersion,
		serverVersion,
		clientPath: clientBin,
		serverPath: serverBin,
		serverData: resolveServerData(app),
		platform: `${os.type()} ${os.release()} (${process.arch})`,
		electron: process.versions.electron,
		userData: app.getPath('userData'),
	};
	return info;
}

function registerIpc() {
	ipcMain.handle('info:get', () => collectInfo());

	ipcMain.handle('settings:get', () => settings.current);
	ipcMain.handle('settings:save', async (_e, input) => {
		const res = settings.save(input);
		if (res.ok) {
			launcherLog('INFO', 'settings saved');
			await collectInfo();
		}
		return res;
	});
	ipcMain.handle('settings:reset', () => settings.reset());

	ipcMain.handle('state:get', () => ({ client: clientState, server: serverState }));
	ipcMain.handle('logs:get', () => logRecords);

	ipcMain.handle('client:connect', async (_e, { address, name }) => {
		if (!isValidAddress(String(address || ''))) {
			return { ok: false, error: 'Enter a server address as host:port, e.g. 127.0.0.1:30120.' };
		}
		if (client.running) {
			return { ok: false, error: 'Already connected. Disconnect first.' };
		}
		const s = settings.current;
		const playerName = String(name || s.playerName).trim().slice(0, 32) || 'Player';
		const bin = resolveBinary('jays-client', s.clientPath, app);
		try {
			setClientState('starting', address);
			client.start(bin, ['--connect', address, '--name', playerName, '--guid', s.guid, '--log-level', s.logLevel]);
			launcherLog('INFO', `starting client: ${bin} --connect ${address}`);
			return { ok: true };
		} catch (err) {
			setClientState('idle');
			launcherLog('ERROR', err.message);
			return { ok: false, error: err.message };
		}
	});

	ipcMain.handle('client:disconnect', async () => {
		if (!client.running) {
			return { ok: false, error: 'Not connected.' };
		}
		await client.stop('disconnect');
		return { ok: true };
	});

	ipcMain.handle('client:command', (_e, line) => {
		const text = String(line || '').trim();
		if (!text) {
			return { ok: false, error: 'Empty command.' };
		}
		if (!client.write(text)) {
			return { ok: false, error: 'The client is not running.' };
		}
		return { ok: true };
	});

	ipcMain.handle('client:probe', (_e, address) => {
		if (!isValidAddress(String(address || ''))) {
			return { ok: false, error: 'Enter a server address as host:port.' };
		}
		const bin = resolveBinary('jays-client', settings.current.clientPath, app);
		if (!bin) {
			return { ok: false, error: 'jays-client executable not found.' };
		}
		return new Promise((resolve) => {
			execFile(bin, ['--probe', address, '--timeout', '2000', '--log-level', 'error'], { timeout: 15000 },
				(err, stdout) => {
					const lines = String(stdout || '').trim().split(/\r?\n/);
					try {
						const data = JSON.parse(lines[lines.length - 1]);
						launcherLog('INFO', `probe ${address}: ${err ? 'no response' : 'ok'}`);
						resolve({ ok: !err, data, error: err ? 'The server did not respond.' : undefined });
					} catch {
						resolve({ ok: false, error: 'The server did not respond.' });
					}
				});
		});
	});

	ipcMain.handle('server:start', async () => {
		if (server.running) {
			return { ok: false, error: 'The local server is already running.' };
		}
		const s = settings.current;
		const data = resolveServerData(app);
		const bin = resolveBinary('jays-server', s.serverPath, app);
		try {
			setServerState('starting');
			server.start(bin, [
				'--config', path.join(data, 'server.cfg'),
				'--resources', path.join(data, 'resources'),
				'--endpoint', `127.0.0.1:${s.localServerPort}`,
				'--log-level', s.logLevel,
			]);
			launcherLog('INFO', `starting local server on 127.0.0.1:${s.localServerPort}`);
			return { ok: true };
		} catch (err) {
			setServerState('stopped');
			launcherLog('ERROR', err.message);
			return { ok: false, error: err.message };
		}
	});

	ipcMain.handle('server:stop', async () => {
		if (!server.running) {
			return { ok: false, error: 'The local server is not running.' };
		}
		await server.stop('quit');
		return { ok: true };
	});

	ipcMain.handle('server:command', (_e, line) => {
		const text = String(line || '').trim();
		return text && server.write(text) ? { ok: true } : { ok: false, error: 'The local server is not running.' };
	});

	ipcMain.handle('logs:export', () => {
		const dir = path.join(app.getPath('userData'), 'logs');
		fs.mkdirSync(dir, { recursive: true });
		const file = path.join(dir, `jays-${timestamp()}.log`);
		const text = logRecords.map((r) => `${r.time} [${r.level}] [${r.source}/${r.component}] ${r.msg}`).join('\n');
		fs.writeFileSync(file, text + '\n');
		launcherLog('INFO', `logs exported to ${file}`);
		return { ok: true, path: file };
	});

	ipcMain.handle('report:save', async (_e, context) => {
		const dir = path.join(app.getPath('userData'), 'reports');
		fs.mkdirSync(dir, { recursive: true });
		const file = path.join(dir, `error-report-${timestamp()}.json`);
		const report = {
			createdAt: new Date().toISOString(),
			context: String(context || '').slice(0, 2000),
			info: info || (await collectInfo()),
			clientState,
			serverState,
			settings: { ...settings.current, guid: '(redacted)' },
			recentLogs: logRecords.slice(-300),
		};
		fs.writeFileSync(file, JSON.stringify(report, null, 2));
		launcherLog('INFO', `error report saved to ${file}`);
		return { ok: true, path: file };
	});

	ipcMain.handle('shell:open-folder', (_e, which) => {
		const dir = path.join(app.getPath('userData'), which === 'reports' ? 'reports' : 'logs');
		fs.mkdirSync(dir, { recursive: true });
		return shell.openPath(dir);
	});

	ipcMain.on('renderer-error', (_e, message) => {
		launcherLog('ERROR', `renderer error: ${String(message).slice(0, 500)}`);
	});
}

function timestamp() {
	return new Date().toISOString().replace(/[:.]/g, '-');
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1180,
		height: 760,
		minWidth: 900,
		minHeight: 600,
		title: 'Jays Project',
		backgroundColor: '#0d0f14',
		show: false,
		icon: path.join(__dirname, '..', 'assets', 'icon.png'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
		},
	});
	mainWindow.setMenuBarVisibility(false);
	mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
	mainWindow.once('ready-to-show', () => mainWindow.show());

	// external links open in the system browser, never inside the launcher
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		if (/^https:\/\//.test(url)) {
			shell.openExternal(url);
		}
		return { action: 'deny' };
	});
	mainWindow.webContents.on('will-navigate', (e) => e.preventDefault());
}

process.on('uncaughtException', (err) => {
	launcherLog('ERROR', `launcher error: ${err.stack || err.message}`);
	send('error', { title: 'Launcher error', message: err.message });
});

app.whenReady().then(async () => {
	settings.load();
	registerIpc();
	await collectInfo();
	launcherLog('INFO', `Jays Project launcher ${LAUNCHER_VERSION} started (client: ${info.clientPath || 'not found'})`);
	createWindow();
});

app.on('window-all-closed', async () => {
	await Promise.all([client.stop('quit'), server.stop('quit')]);
	app.quit();
});
