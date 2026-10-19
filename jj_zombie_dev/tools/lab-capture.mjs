// Renders contact sheets from the animation lab in a headless browser (Playwright/Chromium)
// so the motion can be reviewed as images without opening the lab manually.
//
//   node tools/lab-capture.mjs [--scene name] [--variant v] [--seq name] [--cams front,side]
//                              [--source src|ycd] [--grid 4x3] [--out captures/lab]
//                              [--t0 s] [--t1 s] [--show capsules,labels] [--tag name]
// Prints the written files and fails on browser console errors.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { DEV } from './skeletons.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.js').catch(() => ({})));
}
if (!chromium) { console.error('playwright not available (npm i -g playwright)'); process.exit(2); }

const args = process.argv.slice(2);
const opt = (n, d = null) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const outDir = path.resolve(DEV, opt('--out', 'captures/lab'));
const cams = opt('--cams', 'front,side').split(',');
const source = opt('--source', 'src');
const [cols, rows] = opt('--grid', '4x3').split('x').map(Number);
fs.mkdirSync(outDir, { recursive: true });

const exe = fs.existsSync('/opt/pw-browsers/chromium') ? undefined : undefined;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'], executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('file://' + path.join(DEV, 'animlab', 'index.html'));
await page.waitForFunction(() => !!window.JJZ_LAB, null, { timeout: 30000 });

const scene = opt('--scene');
const seq = opt('--seq');
let jobs = [];
if (seq) jobs = [{ sequence: seq }];
else if (scene) jobs = [{ scene, variant: opt('--variant') }];
else {
  const keys = await page.evaluate(() => window.JJZ_LAB.scenes());
  jobs = keys.map((k) => { const [s, v] = k.split(':'); return { scene: s, variant: v || '' }; });
}
const written = [];
for (const job of jobs) {
  await page.evaluate((j) => window.JJZ_LAB.select({ ...j }), { ...job, source });
  for (const cam of cams) {
    const t0 = opt('--t0') != null ? +opt('--t0') : 0, t1 = opt('--t1') != null ? +opt('--t1') : null;
    for (const k of (opt('--show') || '').split(',').filter(Boolean)) await page.evaluate((key) => window.JJZ_LAB.setShow(key, true), k);
    const url = await page.evaluate((o) => window.JJZ_LAB.contactSheet(o), { cols, rows, cameraName: cam, t0, t1 });
    const tag = opt('--tag') ? '_' + opt('--tag') : '';
    const slug = (x) => x.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_|_$/g, '');
    const name = `${job.sequence ? 'seq_' + slug(job.sequence) : job.scene}${job.variant ? '_' + job.variant : ''}_${cam}_${source}${tag}.png`;
    const file = path.join(outDir, name);
    fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
    written.push(file);
  }
}
const live = await page.evaluate(() => window.JJZ_LAB.live());
await browser.close();
for (const f of written) console.log(path.relative(DEV, f));
if (live) for (const [a, m] of Object.entries(live.actors || {})) console.log(`live metrics ${a}: ${m.ok ? 'OK' : 'FAIL ' + Object.entries(m.items).filter(([, v]) => !v.pass).map(([k, v]) => `${k}=${v.value}`).join(' ')}`);
if (errors.length) { console.error('browser errors:\n' + errors.join('\n')); process.exit(1); }
