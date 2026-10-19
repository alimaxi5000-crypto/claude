// NUI test: loads the real html/index.html headless at 4 resolutions, drives it with the same
// messages the Lua client sends, checks layout (inside the viewport, no overflow, readable
// sizes) and console errors, and writes screenshots to captures/nui/.
//   node tests/nui.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(HERE, '..');
const RES = path.resolve(DEV, '..', 'jj_zombie_test');
const OUT = path.join(DEV, 'captures', 'nui');
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.js').catch(() => ({})));
}
if (!chromium) { console.error('playwright not available'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });

const RESOLUTIONS = [[1280, 720], [1920, 1080], [2560, 1440], [3840, 2160]];
const STATES = [
  { name: 'struggle', msgs: [{ type: 'fin:open', key: 'E', progress: 55, timeLimit: 7, text: { press: 'DRÜCKEN', push: 'Drück ihn weg!' }, ui: { Position: 'bottom' }, thresholds: { ZombieWinsBelow: 35, PlayerWinsAbove: 70 } }, { type: 'fin:time', remainingMs: 4200 }] },
  { name: 'danger', msgs: [{ type: 'fin:open', key: 'E', progress: 12, timeLimit: 7, text: { press: 'DRÜCKEN', push: 'Drück ihn weg!' }, ui: { Position: 'bottom' }, thresholds: { ZombieWinsBelow: 35, PlayerWinsAbove: 70 } }, { type: 'fin:progress', value: 12, danger: 0.88 }, { type: 'fin:time', remainingMs: 1100 }] },
  { name: 'center', msgs: [{ type: 'fin:open', key: 'F', progress: 80, timeLimit: 7, text: { press: 'PRESS', push: 'Push it away!' }, ui: { Position: 'center' }, thresholds: { ZombieWinsBelow: 35, PlayerWinsAbove: 70 } }] },
  { name: 'result_success', msgs: [{ type: 'fin:result', result: 'success', text: 'Losgerissen!' }] },
  { name: 'result_bite', msgs: [{ type: 'fin:result', result: 'bite', text: 'Gebissen!' }] },
];

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const failures = [];
let shots = 0;
for (const [w, h] of RESOLUTIONS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('file://' + path.join(RES, 'html', 'index.html'));
  // Game-like backdrop (in game the NUI page is transparent over the 3D scene).
  await page.addStyleTag({ content: 'html,body{background:#4b5563 linear-gradient(160deg,#55606d,#1f2329) !important;}' });
  for (const st of STATES) {
    for (const m of st.msgs) await page.evaluate((msg) => window.postMessage(msg, '*'), m);
    // Sound messages must be accepted without errors (no audio output in headless).
    await page.evaluate(() => { window.postMessage({ type: 'sfx', name: 'grab', volume: 0.5, pitch: 1 }, '*'); window.postMessage({ type: 'loop', name: 'heartbeat', on: true, intensity: 0.5, volume: 0.5 }, '*'); });
    await page.waitForTimeout(st.name.startsWith('result') ? 250 : 120);
    const layout = await page.evaluate(() => {
      const box = (id) => { const e = document.getElementById(id); if (!e || e.classList.contains('hidden')) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
      const fs = (sel) => { const e = document.querySelector(sel); return e ? parseFloat(getComputedStyle(e).fontSize) : 0; };
      const over = [...document.querySelectorAll('#fin *, #result')].filter((e) => e.offsetParent && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible').map((e) => e.id || e.className);
      return { fin: box('fin'), result: box('result'), textSize: fs('#fin-text'), keySize: fs('#fin-key'), resultSize: fs('#result'), overflow: over };
    });
    const vis = st.name.startsWith('result') ? layout.result : layout.fin;
    if (!vis) failures.push(`${w}x${h} ${st.name}: element not visible`);
    else {
      if (vis.x < 0 || vis.y < 0 || vis.x + vis.w > w + 0.5 || vis.y + vis.h > h + 0.5) failures.push(`${w}x${h} ${st.name}: outside the viewport ${JSON.stringify(vis)}`);
      if (vis.w > w * 0.6) failures.push(`${w}x${h} ${st.name}: too wide (${Math.round(vis.w)} px)`);
    }
    if (!st.name.startsWith('result') && layout.textSize < 13) failures.push(`${w}x${h} ${st.name}: text too small (${layout.textSize}px)`);
    if (layout.overflow.length) failures.push(`${w}x${h} ${st.name}: overflowing ${layout.overflow.join(', ')}`);
    await page.screenshot({ path: path.join(OUT, `nui_${w}x${h}_${st.name}.png`) });
    shots++;
    await page.evaluate(() => window.postMessage({ type: 'fin:close' }, '*'));
  }
  if (errors.length) failures.push(`${w}x${h}: console errors: ${errors.join(' | ')}`);
  await page.close();
}
await browser.close();
for (const f of failures) console.log('  FAIL ' + f);
console.log(failures.length ? `NUI: ${failures.length} problem(s)` : `NUI OK: ${shots} screenshots in ${path.relative(DEV, OUT)}/ (${RESOLUTIONS.map((r) => r.join('x')).join(', ')})`);
process.exit(failures.length ? 1 : 0);
