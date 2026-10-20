// Bundles the studio NUI (web/src/*.mjs + three.js + animkit core) into web/studio.bundle.js so
// the resource ships without a build step on the server. Run after changing web/src:
//   node jj_animstudio/tools/build-web.mjs     (needs animkit/setup.sh: esbuild + three)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RES = path.resolve(HERE, '..');
const KIT = path.resolve(RES, '..', 'animkit');
const { build } = createRequire(path.join(KIT, 'package.json'))('esbuild');
await build({
  entryPoints: [path.join(RES, 'web', 'src', 'main.mjs')],
  nodePaths: [path.join(KIT, 'node_modules')],
  bundle: true, format: 'iife', target: 'chrome100', minify: true, legalComments: 'eof',
  outfile: path.join(RES, 'web', 'studio.bundle.js'), logLevel: 'warning',
});
const lic = fs.readFileSync(path.join(KIT, 'node_modules', 'three', 'LICENSE'), 'utf8');
fs.writeFileSync(path.join(RES, 'web', 'THIRD_PARTY_LICENSES.txt'), `studio.bundle.js contains three.js r169 (MIT):\n\n${lic}`);
console.log('studio.bundle.js', (fs.statSync(path.join(RES, 'web', 'studio.bundle.js')).size / 1024).toFixed(0), 'KiB');
