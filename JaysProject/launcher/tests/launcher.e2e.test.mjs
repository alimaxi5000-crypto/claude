// End-to-end test of the real launcher: Electron + jays-server + jays-client processes.
// Run: npm test (needs a display; on Linux CI use `xvfb-run -a npm test`).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { _electron } = require('playwright-core');
const electronPath = require('electron');

const launcherDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = process.env.JAYS_EVIDENCE_DIR || '';

function freePort() {
	return new Promise((resolve, reject) => {
		const srv = net.createServer();
		srv.listen(0, '127.0.0.1', () => {
			const { port } = srv.address();
			srv.close(() => resolve(port));
		});
		srv.on('error', reject);
	});
}

async function shot(page, name) {
	if (evidenceDir) {
		fs.mkdirSync(evidenceDir, { recursive: true });
		await page.screenshot({ path: path.join(evidenceDir, `${name}.png`) });
	}
}

test('launcher drives a real local server and client session', { timeout: 120000 }, async () => {
	const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'jays-launcher-'));
	const port = await freePort();

	const app = await _electron.launch({
		executablePath: electronPath,
		args: [...(process.getuid && process.getuid() === 0 ? ['--no-sandbox'] : []), launcherDir],
		env: { ...process.env, JAYS_USER_DATA: profile },
	});

	try {
		const page = await app.firstWindow();
		await page.waitForSelector('body[data-ready="true"]');

		// branding and versions
		assert.equal(await page.title(), 'Jays Project');
		// (selector waits only: the launcher's CSP forbids the eval that waitForFunction polling needs)
		await page.waitForSelector('#client-version:has-text("0.1.0-alpha")');
		assert.match(await page.textContent('[data-testid=version-label]'), /Launcher v0\.1\.0-alpha · Client 0\.1\.0-alpha/);
		await shot(page, '01-play-idle');

		// settings validation and persistence
		await page.click('[data-testid=nav-settings]');
		await page.fill('[data-testid=set-port]', '70000');
		await page.click('[data-testid=settings-save]');
		await page.waitForSelector('[data-testid=settings-error]:has-text("between 1 and 65535")');
		await page.fill('[data-testid=set-port]', String(port));
		await page.fill('[data-testid=set-player-name]', 'LauncherTester');
		await page.click('[data-testid=settings-save]');
		await page.waitForSelector('[data-testid=toast]:has-text("Settings saved")');
		const saved = JSON.parse(fs.readFileSync(path.join(profile, 'settings.json'), 'utf8'));
		assert.equal(saved.localServerPort, port);
		assert.equal(saved.playerName, 'LauncherTester');

		// start the local test server
		await page.click('[data-testid=nav-server]');
		await page.click('[data-testid=server-start]');
		await page.waitForSelector('[data-testid=server-state][data-state="running"]', { timeout: 15000 });
		await page.waitForSelector('[data-testid=server-feed]:has-text("Started resource jays-chat")');
		await shot(page, '02-server-running');
		await page.click('[data-testid=server-use]');

		// query server info
		await page.click('[data-testid=probe]');
		await page.waitForSelector('[data-testid=server-info]:has-text("Jays Project Dev Server")', { timeout: 15000 });
		assert.match(await page.textContent('[data-testid=server-info]'), /jays-basic/);

		// connect and reach an active session
		assert.equal(await page.inputValue('[data-testid=address]'), `127.0.0.1:${port}`);
		await page.click('[data-testid=connect]');
		await page.waitForSelector('[data-testid=client-state][data-state="active"]', { timeout: 20000 });
		await page.waitForSelector('[data-testid=feed]:has-text("[welcome] Hello, LauncherTester!")');

		// run client commands through the console
		await page.fill('[data-testid=command]', 'say hello from the launcher');
		await page.click('[data-testid=send-command]');
		await page.waitForSelector('[data-testid=feed]:has-text("[chat] LauncherTester: hello from the launcher")');
		await page.fill('[data-testid=command]', 'ping');
		await page.press('[data-testid=command]', 'Enter');
		await page.waitForSelector('[data-testid=feed]:has-text("[ping] event round trip")');
		await page.waitForSelector('[data-testid=stat-ping]:text-matches("^(<1|[0-9]+) ms$")', { timeout: 10000 });
		await shot(page, '03-play-active');

		// server-side view of the player
		await page.click('[data-testid=nav-server]');
		await page.fill('[data-testid=server-command]', 'status');
		await page.press('[data-testid=server-command]', 'Enter');
		await page.waitForSelector('[data-testid=server-feed]:has-text("LauncherTester")');

		// logs page with filtering and export
		await page.click('[data-testid=nav-logs]');
		await page.fill('[data-testid=log-search]', 'joined');
		await page.waitForSelector('[data-testid=log-list]:has-text("Player LauncherTester (id 1) joined")');
		await shot(page, '04-logs');
		await page.click('[data-testid=log-export]');
		await page.waitForSelector('[data-testid=toast]:has-text("Logs exported")');
		const logFiles = fs.readdirSync(path.join(profile, 'logs'));
		assert.equal(logFiles.length, 1);
		assert.match(fs.readFileSync(path.join(profile, 'logs', logFiles[0]), 'utf8'), /state.*active: joined as id 1/);

		// disconnect
		await page.click('[data-testid=nav-play]');
		await page.click('[data-testid=disconnect]');
		await page.waitForSelector('[data-testid=client-state][data-state="disconnected"]', { timeout: 10000 });

		// failure path: invalid address is rejected in the UI
		await page.fill('[data-testid=address]', 'not an address');
		await page.click('[data-testid=connect]');
		await page.waitForSelector('[data-testid=connect-error]:has-text("host:port")');

		// failure path: unreachable server surfaces an error banner and a report can be saved
		await page.fill('[data-testid=address]', `127.0.0.1:${await freePort()}`);
		await page.click('[data-testid=connect]');
		await page.waitForSelector('[data-testid=error-banner]:has-text("could not connect")', { timeout: 15000 });
		await shot(page, '05-connect-error');
		await page.click('[data-testid=error-report]');
		await page.waitForSelector('[data-testid=toast]:has-text("Error report saved")');
		const reports = fs.readdirSync(path.join(profile, 'reports'));
		assert.equal(reports.length, 1);
		const report = JSON.parse(fs.readFileSync(path.join(profile, 'reports', reports[0]), 'utf8'));
		assert.equal(report.settings.guid, '(redacted)');
		assert.match(report.context, /could not connect/);

		// stop the server from the UI
		await page.click('[data-testid=nav-server]');
		await page.click('[data-testid=server-stop]');
		await page.waitForSelector('[data-testid=server-state][data-state="stopped"]', { timeout: 10000 });
	} finally {
		await app.close();
		fs.rmSync(profile, { recursive: true, force: true });
	}
});
