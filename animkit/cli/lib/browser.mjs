// Headless Chromium for tests and contact sheets (Playwright). Finds the playwright package
// (local node_modules, animkit/node_modules, NODE_PATH, global npm) and, when the browser build
// that matches this playwright version is not installed, falls back to the newest installed
// Playwright Chromium (or PLAYWRIGHT_CHROMIUM_PATH). Returns null when playwright is missing.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ANIMKIT = path.resolve(HERE, '..', '..');

export async function getChromium(callerUrl = import.meta.url) {
  const tries = [callerUrl, pathToFileURL(path.join(ANIMKIT, 'package.json')).href];
  for (const base of tries) {
    try { return createRequire(base)('playwright').chromium; } catch { /* next */ }
  }
  try {
    const root = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return createRequire(path.join(root, 'noop.js'))('playwright').chromium;
  } catch { /* next */ }
  const legacy = '/opt/node22/lib/node_modules/playwright/index.js';
  if (fs.existsSync(legacy)) return (await import(legacy)).chromium;
  return null;
}

function installedChromium() {
  if (process.env.PLAYWRIGHT_CHROMIUM_PATH && fs.existsSync(process.env.PLAYWRIGHT_CHROMIUM_PATH)) return process.env.PLAYWRIGHT_CHROMIUM_PATH;
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'ms-playwright'),
    path.join(os.homedir(), '.cache', 'ms-playwright'),
    path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright'),
    '/opt/pw-browsers',
  ].filter(Boolean);
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const dirs = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1]);
    for (const d of dirs) {
      for (const exe of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe', 'chrome-linux64/chrome', 'chrome-linux/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const p = path.join(root, d, exe);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return null;
}

export async function launchBrowser(opts = {}, callerUrl) {
  const chromium = await getChromium(callerUrl);
  if (!chromium) return null;
  try {
    return await chromium.launch(opts);
  } catch (e) {
    const exe = installedChromium();
    if (!exe || !/Executable doesn't exist|executable/i.test(String(e.message))) throw e;
    return chromium.launch({ ...opts, executablePath: exe });
  }
}
