'use strict';

const $ = (sel) => document.querySelector(sel);
const api = window.jays;

const STEPS = ['connecting', 'handshaking', 'downloading', 'loading', 'active'];
const BUSY = new Set(['starting', 'connecting', 'handshaking', 'downloading', 'loading']);
const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const MAX_ROWS = 2000;

const ui = {
	settings: null,
	info: null,
	clientState: 'idle',
	sessionStart: null,
	errorCount: 0,
	logs: [],
	lastErrorContext: '',
};

window.addEventListener('error', (e) => api.reportError(`${e.message} @ ${e.filename}:${e.lineno}`));
window.addEventListener('unhandledrejection', (e) => api.reportError(String(e.reason)));

// ---- navigation --------------------------------------------------------------

function showPage(name) {
	document.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.page === name));
	document.querySelectorAll('.page').forEach((p) => p.classList.toggle('active', p.id === `page-${name}`));
	if (name === 'logs') {
		renderLogs();
	}
}

document.querySelectorAll('.nav-item').forEach((b) => b.addEventListener('click', () => showPage(b.dataset.page)));

// ---- feedback ----------------------------------------------------------------

let toastTimer = null;
function toast(text) {
	const el = $('#toast');
	el.textContent = text;
	el.classList.remove('hidden');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => el.classList.add('hidden'), 4000);
}

function showError(title, message) {
	$('#error-title').textContent = title;
	$('#error-message').textContent = message;
	$('#error-banner').classList.remove('hidden');
	ui.lastErrorContext = `${title}: ${message}`;
}

$('#error-dismiss').addEventListener('click', () => $('#error-banner').classList.add('hidden'));
$('#error-report').addEventListener('click', async () => {
	const res = await api.saveReport(ui.lastErrorContext);
	toast(`Error report saved: ${res.path}`);
});

// ---- connection state --------------------------------------------------------

function renderClientState(state, detail) {
	ui.clientState = state;
	const pill = $('#state-pill');
	pill.dataset.state = state;
	pill.textContent = state;
	const failed = state === 'disconnected' && /fail|reject|error|timed out|closed/i.test(detail || '');
	pill.classList.toggle('failed', failed);
	$('#state-detail').textContent = detail || (state === 'idle' ? 'Not connected' : '');

	const idx = STEPS.indexOf(state);
	document.querySelectorAll('#stepper li').forEach((li, i) => {
		li.classList.toggle('done', idx > i || state === 'active');
		li.classList.toggle('current', i === idx && state !== 'active');
	});

	const running = state !== 'idle' && state !== 'disconnected';
	$('#connect-btn').classList.toggle('hidden', running);
	$('#disconnect-btn').classList.toggle('hidden', !running);
	$('#address').disabled = running;
	$('#player-name').disabled = running;

	if (state === 'active') {
		ui.sessionStart = Date.now();
	} else if (!running) {
		ui.sessionStart = null;
		$('#stat-ping').textContent = '—';
	}

	const dot = $('#side-dot');
	dot.className = 'dot' + (state === 'active' ? ' active' : BUSY.has(state) ? ' busy' : failed ? ' error' : '');
	$('#side-state').textContent = state === 'active' ? 'In session' : state;
}

setInterval(() => {
	if (!ui.sessionStart) {
		$('#stat-session').textContent = '—';
		return;
	}
	const s = Math.floor((Date.now() - ui.sessionStart) / 1000);
	$('#stat-session').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}, 1000);

$('#connect-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	$('#connect-error').textContent = '';
	const address = $('#address').value.trim();
	const name = $('#player-name').value.trim();
	const res = await api.connect(address, name);
	if (!res.ok) {
		$('#connect-error').textContent = res.error;
		return;
	}
	$('#feed').textContent = '';
});

$('#disconnect-btn').addEventListener('click', async () => {
	const res = await api.disconnect();
	if (!res.ok) {
		toast(res.error);
	}
});

$('#probe-btn').addEventListener('click', async () => {
	const address = $('#address').value.trim();
	const box = $('#server-info');
	box.className = 'server-info empty';
	box.textContent = `Querying ${address}…`;
	const res = await api.probe(address);
	if (!res.ok) {
		box.textContent = res.error;
		return;
	}
	renderServerInfo(res.data);
});

function renderServerInfo(d) {
	const box = $('#server-info');
	box.className = 'server-info';
	box.textContent = '';
	const gi = d.getinfo || {};
	const title = document.createElement('div');
	title.className = 'title';
	title.textContent = gi.hostname || (d.dynamic && d.dynamic.hostname) || d.address;
	const meta = document.createElement('div');
	meta.className = 'meta';
	const players = gi.clients ?? (d.dynamic && d.dynamic.clients) ?? '?';
	const max = gi.sv_maxclients ?? (d.dynamic && d.dynamic.sv_maxclients) ?? '?';
	const server = (d.info && d.info.server) || gi.gamename || 'unknown server';
	meta.textContent = `${players}/${max} players · ${server}${gi.gametype ? ' · ' + gi.gametype : ''}`;
	const chips = document.createElement('div');
	chips.className = 'chips';
	for (const r of (d.info && d.info.resources) || []) {
		const c = document.createElement('span');
		c.className = 'chip';
		c.textContent = r;
		chips.appendChild(c);
	}
	box.append(title, meta, chips);
}

$('#command-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const input = $('#command');
	const line = input.value.trim();
	if (!line) {
		return;
	}
	const res = await api.sendCommand(line);
	if (!res.ok) {
		toast(res.error);
		return;
	}
	input.value = '';
});

function appendFeed(el, text, muted) {
	const row = document.createElement('div');
	row.textContent = text;
	if (muted) {
		row.className = 'muted';
	}
	el.appendChild(row);
	while (el.childElementCount > 300) {
		el.firstChild.remove();
	}
	el.scrollTop = el.scrollHeight;
}

// ---- local server ---------------------------------------------------------------

function renderServerState(state, detail) {
	const pill = $('#server-pill');
	pill.dataset.state = state;
	pill.textContent = state;
	$('#server-detail').textContent = detail || '';
	const running = state === 'running' || state === 'starting';
	$('#server-start').disabled = running;
	$('#server-stop').disabled = !running;
}

$('#server-start').addEventListener('click', async () => {
	$('#server-feed').textContent = '';
	const res = await api.startServer();
	if (!res.ok) {
		showError('Local server', res.error);
	}
});
$('#server-stop').addEventListener('click', () => api.stopServer());
$('#server-use').addEventListener('click', () => {
	$('#address').value = `127.0.0.1:${ui.settings.localServerPort}`;
	showPage('play');
});
$('#server-command-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const input = $('#server-command');
	const res = await api.serverCommand(input.value);
	if (!res.ok) {
		toast(res.error);
		return;
	}
	input.value = '';
});

// ---- logs ----------------------------------------------------------------------------

function logMatches(r) {
	const src = $('#log-source').value;
	const lvl = Number($('#log-level').value);
	const q = $('#log-search').value.toLowerCase();
	return (!src || r.source === src) && (LEVELS[r.level] ?? 1) >= lvl &&
		(!q || r.msg.toLowerCase().includes(q) || r.component.toLowerCase().includes(q));
}

function logRow(r) {
	const row = document.createElement('div');
	row.className = `log-row lv-${r.level}`;
	const t = document.createElement('span');
	t.className = 't';
	t.textContent = r.time.slice(11, 23);
	const l = document.createElement('span');
	l.className = 'l';
	l.textContent = r.level;
	const c = document.createElement('span');
	c.className = 'c';
	c.textContent = `${r.source}/${r.component}`;
	c.title = c.textContent;
	const m = document.createElement('span');
	m.className = 'm';
	m.textContent = r.msg;
	row.append(t, l, c, m);
	return row;
}

function renderLogs() {
	const list = $('#log-list');
	list.textContent = '';
	const rows = ui.logs.filter(logMatches).slice(-MAX_ROWS);
	const frag = document.createDocumentFragment();
	rows.forEach((r) => frag.appendChild(logRow(r)));
	list.appendChild(frag);
	if ($('#log-follow').checked) {
		list.scrollTop = list.scrollHeight;
	}
}

function addLog(r) {
	ui.logs.push(r);
	if (ui.logs.length > 5000) {
		ui.logs.splice(0, ui.logs.length - 5000);
	}
	if (r.level === 'ERROR') {
		ui.errorCount++;
		const badge = $('#log-error-count');
		badge.textContent = String(ui.errorCount);
		badge.classList.remove('hidden');
		$('#stat-errors').textContent = String(ui.errorCount);
	}

	if ($('#page-logs').classList.contains('active') && logMatches(r)) {
		const list = $('#log-list');
		list.appendChild(logRow(r));
		while (list.childElementCount > MAX_ROWS) {
			list.firstChild.remove();
		}
		if ($('#log-follow').checked) {
			list.scrollTop = list.scrollHeight;
		}
	}

	// script output, chat and console echo go to the play feed
	if (r.source === 'client' && (r.component.startsWith('script:') || ['chat', 'console', 'connect'].includes(r.component))) {
		appendFeed($('#feed'), r.msg, r.component === 'console');
	}
	if (r.source === 'server' && r.level !== 'DEBUG') {
		appendFeed($('#server-feed'), `[${r.component}] ${r.msg}`, false);
	}
}

['#log-source', '#log-level'].forEach((s) => $(s).addEventListener('change', renderLogs));
$('#log-search').addEventListener('input', renderLogs);
$('#log-clear').addEventListener('click', () => {
	ui.logs = [];
	renderLogs();
});
$('#log-export').addEventListener('click', async () => {
	const res = await api.exportLogs();
	toast(`Logs exported: ${res.path}`);
});

// ---- settings ----------------------------------------------------------------------

function fillSettings(s) {
	const form = $('#settings-form');
	for (const [k, v] of Object.entries(s)) {
		if (form.elements[k]) {
			form.elements[k].value = v;
		}
	}
}

$('#settings-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const form = e.target;
	const data = {};
	for (const el of form.elements) {
		if (el.name) {
			data[el.name] = el.value;
		}
	}
	const res = await api.saveSettings(data);
	if (!res.ok) {
		$('#settings-error').textContent = res.errors.join(' ');
		return;
	}
	$('#settings-error').textContent = '';
	ui.settings = res.settings;
	$('#player-name').value = res.settings.playerName;
	await loadInfo();
	toast('Settings saved');
});

$('#settings-reset').addEventListener('click', async () => {
	ui.settings = await api.resetSettings();
	fillSettings(ui.settings);
	toast('Settings reset to defaults');
});

// ---- about -----------------------------------------------------------------------------

async function loadInfo() {
	ui.info = await api.getInfo();
	const i = ui.info;
	$('#launcher-version').textContent = i.launcherVersion;
	$('#client-version').textContent = i.clientVersion || 'not found';
	const kv = $('#about-info');
	kv.textContent = '';
	const rows = [
		['Launcher', i.launcherVersion],
		['Client', i.clientVersion ? `${i.clientVersion} — ${i.clientPath}` : 'not found (build the project)'],
		['Server', i.serverVersion ? `${i.serverVersion} — ${i.serverPath}` : 'not found (build the project)'],
		['Server data', i.serverData],
		['Electron', i.electron],
		['Platform', i.platform],
		['Profile', i.userData],
	];
	for (const [k, v] of rows) {
		const dt = document.createElement('dt');
		dt.textContent = k;
		const dd = document.createElement('dd');
		dd.textContent = v;
		kv.append(dt, dd);
	}
	if (!i.clientPath) {
		showError('Client not found', 'jays-client was not found. Build it with tools/build.ps1 (Windows) or tools/build.sh, or set its path in Settings.');
	}
}

$('#about-report').addEventListener('click', async () => {
	const res = await api.saveReport('manual diagnostic report');
	toast(`Report saved: ${res.path}`);
});
$('#about-open-reports').addEventListener('click', () => api.openFolder('reports'));

// ---- wiring -----------------------------------------------------------------------------

api.on('log', addLog);
api.on('client-state', ({ state, detail }) => renderClientState(state, detail));
api.on('client-stats', ({ ping }) => {
	$('#stat-ping').textContent = ping > 0 ? `${ping} ms` : ping === 0 ? '<1 ms' : '—';
});
api.on('server-state', ({ state, detail }) => renderServerState(state, detail));
api.on('error', ({ title, message }) => showError(title, message));

(async function init() {
	ui.settings = await api.getSettings();
	fillSettings(ui.settings);
	$('#address').value = ui.settings.serverAddress;
	$('#player-name').value = ui.settings.playerName;
	(await api.getLogs()).forEach(addLog);
	const st = await api.getState();
	renderClientState(st.client.state, st.client.detail);
	renderServerState(st.server.state, st.server.detail);
	await loadInfo();
	document.body.dataset.ready = 'true';
})();
