// Contact sheets of clip documents rendered by the studio NUI itself (same solver as the
// converter), for reviewing motion as images:
//   node jj_animstudio/tools/contact-sheets.mjs [file.anim.json ...] [--cams side,front] [--grid 4x2] [--out docs/img]
// Default: every animkit/examples/*.anim.json. Fails on browser console errors.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchBrowser } from '../../animkit/cli/lib/browser.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RES = path.resolve(HERE, '..');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const files = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const EX = path.resolve(RES, '..', 'animkit', 'examples');
const list = files.length ? files : fs.readdirSync(EX).filter((f) => f.endsWith('.anim.json')).map((f) => path.join(EX, f));
const cams = opt('--cams', 'side,front').split(',');
const [cols, rows] = opt('--grid', '4x2').split('x').map(Number);
const out = path.resolve(RES, opt('--out', 'docs/img'));
fs.mkdirSync(out, { recursive: true });
spawnSync(process.execPath, [path.join(HERE, 'dev-data.mjs')], { stdio: 'ignore' });
const browser = await launchBrowser({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }, import.meta.url);
if (!browser) { console.error('playwright not available'); process.exit(2); }
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(pathToFileURL(path.join(RES, 'web', 'dev', 'index.html')).href + '?notut');
await page.waitForFunction(() => !!window.JJS_STUDIO);
for (const f of list) {
  const doc = JSON.parse(fs.readFileSync(f, 'utf8'));
  await page.evaluate((d) => window.JJS_STUDIO.openDocument(d, d.name), doc);
  for (const cam of cams) {
    const url = await page.evaluate((o) => window.JJS_STUDIO.contactSheet(o), { cols, rows, cam });
    const file = path.join(out, `sheet_${doc.name}_${cam}.png`);
    fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
    console.log(path.relative(RES, file));
  }
}
await browser.close();
if (errors.length) { console.error('browser errors:\n' + errors.join('\n')); process.exit(1); }
