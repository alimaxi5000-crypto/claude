// Renders launcher/assets/icon.png (256x256) from the brand SVG with Chromium.
// usage: node tools/make_icon.mjs  (run from JaysProject/, needs launcher/node_modules)
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'launcher', 'package.json'));
const { chromium } = require('playwright-core');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="256" height="256">
<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b6cff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>
<rect x="2" y="2" width="44" height="44" rx="12" fill="url(#lg)"/>
<path d="M28 13v15.5a7 7 0 0 1-12.8 3.9" fill="none" stroke="#0d0f14" stroke-width="5" stroke-linecap="round"/></svg>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 256, height: 256 } });
await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
await page.screenshot({ path: path.join(root, 'launcher', 'assets', 'icon.png'), omitBackground: true });
await browser.close();
console.log('wrote launcher/assets/icon.png');
