'use strict';

const { spawn, execFile } = require('child_process');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const EXE = process.platform === 'win32' ? '.exe' : '';

// Locates jays-client / jays-server: settings override, packaged resources, then the dev build tree.
function resolveBinary(name, override, app) {
	const candidates = [];
	if (override) {
		candidates.push(override);
	}
	if (app && app.isPackaged) {
		candidates.push(path.join(process.resourcesPath, 'bin', name + EXE));
	}
	const projectRoot = path.resolve(__dirname, '..', '..');
	candidates.push(path.join(projectRoot, 'build', 'bin', name + EXE));
	candidates.push(path.join(projectRoot, 'build', 'bin', 'Release', name + EXE));
	candidates.push(path.join(projectRoot, 'build', 'bin', 'Debug', name + EXE));

	for (const c of candidates) {
		try {
			if (fs.statSync(c).isFile()) {
				return c;
			}
		} catch {
			// try next
		}
	}
	return null;
}

function resolveServerData(app) {
	if (app && app.isPackaged) {
		return path.join(process.resourcesPath, 'server-data');
	}
	return path.resolve(__dirname, '..', '..', 'server', 'data');
}

function getVersion(binary) {
	return new Promise((resolve) => {
		if (!binary) {
			resolve(null);
			return;
		}
		execFile(binary, ['--version'], { timeout: 5000 }, (err, stdout) => {
			resolve(err ? null : stdout.trim());
		});
	});
}

// Spawns a jays binary with JSON logging and re-emits each record.
class ManagedProcess extends EventEmitter {
	constructor(kind) {
		super();
		this.kind = kind;
		this.child = null;
		this.buffer = '';
	}

	get running() {
		return this.child !== null;
	}

	start(binary, args) {
		if (this.child) {
			throw new Error(`${this.kind} is already running`);
		}
		if (!binary) {
			throw new Error(`${this.kind} executable not found. Build the project (tools/build) or set the path in Settings.`);
		}

		const child = spawn(binary, ['--log-format', 'json', ...args], {
			stdio: ['pipe', 'pipe', 'pipe'],
			windowsHide: true,
		});
		this.child = child;
		this.buffer = '';

		child.stdout.setEncoding('utf8');
		child.stdout.on('data', (chunk) => this.onData(chunk));
		child.stderr.setEncoding('utf8');
		child.stderr.on('data', (chunk) => {
			for (const line of chunk.split(/\r?\n/).filter(Boolean)) {
				this.emit('log', { level: 'ERROR', component: 'stderr', msg: line, t: null });
			}
		});
		child.on('error', (err) => {
			this.emit('log', { level: 'ERROR', component: 'launcher', msg: `${this.kind} failed to start: ${err.message}` });
		});
		child.on('exit', (code, signal) => {
			if (this.buffer.trim()) {
				this.onLine(this.buffer);
			}
			this.child = null;
			this.emit('exit', { code, signal });
		});
	}

	onData(chunk) {
		this.buffer += chunk;
		let idx;
		while ((idx = this.buffer.indexOf('\n')) >= 0) {
			const line = this.buffer.slice(0, idx).replace(/\r$/, '');
			this.buffer = this.buffer.slice(idx + 1);
			if (line) {
				this.onLine(line);
			}
		}
	}

	onLine(line) {
		let rec;
		try {
			rec = JSON.parse(line);
		} catch {
			rec = { level: 'INFO', component: 'stdout', msg: line, t: null };
		}
		this.emit('log', rec);
	}

	write(line) {
		if (!this.child) {
			return false;
		}
		this.child.stdin.write(line.replace(/[\r\n]+/g, ' ') + '\n');
		return true;
	}

	stop(gracefulCommand) {
		if (!this.child) {
			return Promise.resolve();
		}
		const child = this.child;
		return new Promise((resolve) => {
			const timer = setTimeout(() => {
				child.kill();
			}, 3000);
			child.once('exit', () => {
				clearTimeout(timer);
				resolve();
			});
			if (gracefulCommand) {
				this.write(gracefulCommand);
			} else {
				child.kill();
			}
		});
	}
}

module.exports = { resolveBinary, resolveServerData, getVersion, ManagedProcess };
