'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULTS = Object.freeze({
	playerName: 'Player',
	serverAddress: '127.0.0.1:30120',
	localServerPort: 30120,
	logLevel: 'info',
	clientPath: '',
	serverPath: '',
	guid: '',
});

const ADDRESS_RE = /^[A-Za-z0-9.-]+:\d{1,5}$/;

function validate(input) {
	const s = { ...DEFAULTS, ...input };
	const errors = [];

	s.playerName = String(s.playerName).trim();
	if (s.playerName.length < 1 || s.playerName.length > 32) {
		errors.push('Player name must be 1-32 characters.');
	}

	s.serverAddress = String(s.serverAddress).trim();
	if (!isValidAddress(s.serverAddress)) {
		errors.push('Server address must look like host:port (port 1-65535).');
	}

	s.localServerPort = Number(s.localServerPort);
	if (!Number.isInteger(s.localServerPort) || s.localServerPort < 1 || s.localServerPort > 65535) {
		errors.push('Local server port must be between 1 and 65535.');
	}

	if (!['debug', 'info', 'warn', 'error'].includes(s.logLevel)) {
		errors.push('Log level must be debug, info, warn or error.');
	}

	s.clientPath = String(s.clientPath || '').trim();
	s.serverPath = String(s.serverPath || '').trim();
	s.guid = String(s.guid || '');
	return { settings: s, errors };
}

function isValidAddress(address) {
	if (!ADDRESS_RE.test(address)) {
		return false;
	}
	const port = Number(address.split(':').pop());
	return port >= 1 && port <= 65535;
}

class SettingsStore {
	constructor(dir) {
		this.file = path.join(dir, 'settings.json');
		this.current = { ...DEFAULTS };
	}

	load() {
		try {
			const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
			const { settings } = validate(raw);
			this.current = settings;
		} catch {
			this.current = { ...DEFAULTS };
		}
		if (!this.current.guid) {
			// stable per-installation id sent to servers as the client identifier
			this.current.guid = require('crypto').randomBytes(8).toString('hex');
			this.persist();
		}
		return this.current;
	}

	save(input) {
		const { settings, errors } = validate({ ...input, guid: this.current.guid });
		if (errors.length) {
			return { ok: false, errors };
		}
		this.current = settings;
		this.persist();
		return { ok: true, settings };
	}

	reset() {
		const guid = this.current.guid;
		this.current = { ...DEFAULTS, guid };
		this.persist();
		return this.current;
	}

	persist() {
		fs.mkdirSync(path.dirname(this.file), { recursive: true });
		fs.writeFileSync(this.file, JSON.stringify(this.current, null, 2));
	}
}

module.exports = { SettingsStore, validate, isValidAddress, DEFAULTS };
