'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const CHANNELS = ['log', 'client-state', 'client-stats', 'client-exit', 'server-state', 'error'];

// Narrow API surface for the sandboxed renderer.
contextBridge.exposeInMainWorld('jays', {
	getInfo: () => ipcRenderer.invoke('info:get'),
	getSettings: () => ipcRenderer.invoke('settings:get'),
	saveSettings: (s) => ipcRenderer.invoke('settings:save', s),
	resetSettings: () => ipcRenderer.invoke('settings:reset'),
	getState: () => ipcRenderer.invoke('state:get'),
	getLogs: () => ipcRenderer.invoke('logs:get'),
	connect: (address, name) => ipcRenderer.invoke('client:connect', { address, name }),
	disconnect: () => ipcRenderer.invoke('client:disconnect'),
	sendCommand: (line) => ipcRenderer.invoke('client:command', line),
	probe: (address) => ipcRenderer.invoke('client:probe', address),
	startServer: () => ipcRenderer.invoke('server:start'),
	stopServer: () => ipcRenderer.invoke('server:stop'),
	serverCommand: (line) => ipcRenderer.invoke('server:command', line),
	exportLogs: () => ipcRenderer.invoke('logs:export'),
	saveReport: (context) => ipcRenderer.invoke('report:save', context),
	openFolder: (which) => ipcRenderer.invoke('shell:open-folder', which),
	reportError: (message) => ipcRenderer.send('renderer-error', message),
	on: (channel, cb) => {
		if (!CHANNELS.includes(channel)) {
			throw new Error(`unknown channel ${channel}`);
		}
		const listener = (_e, payload) => cb(payload);
		ipcRenderer.on(channel, listener);
		return () => ipcRenderer.removeListener(channel, listener);
	},
});
