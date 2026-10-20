// Writes the browser preview of the studio (no FiveM needed, a mock replaces the game):
//   web/dev/skeletons.js  skeleton data (git-ignored: derived from data that must not be committed)
//   web/dev/index.html    the shipped web/index.html markup + skeletons + the real bundle
// Open web/dev/index.html in a browser (add ?notut to skip the tutorial).
//   node jj_animstudio/tools/dev-data.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSkeletons } from '../../animkit/core/skeletons.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(HERE, '..', 'web');
const OUT = path.join(WEB, 'dev');
const { skeletons, info } = loadSkeletons({ quiet: true });
fs.mkdirSync(OUT, { recursive: true });
const data = Object.fromEntries(Object.entries(skeletons).map(([k, s]) => [k, s.toJSON()]));
fs.writeFileSync(path.join(OUT, 'skeletons.js'), `window.JJS_MOCK = Object.assign(window.JJS_MOCK || {}, { skeletons: ${JSON.stringify(data)}, skeletonInfo: ${JSON.stringify(info)} });\n`);
const NL = '\n';
const html = fs.readFileSync(path.join(WEB, 'index.html'), 'utf8')
  .replace('href="studio.css"', 'href="../studio.css"')
  .replace('<script src="studio.bundle.js"></script>', `<script>if (location.search.includes('notut')) window.JJS_MOCK.tutorial = false;</script>${NL}<script src="../studio.bundle.js"></script>`)
  .replace('<body>', `<body>${NL}<script src="skeletons.js"></script>`);
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('web/dev/index.html + skeletons.js', Object.entries(info).map(([k, v]) => `${k}=${v}`).join(', '));
