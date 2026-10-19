// Bundles animlab/src/lab.mjs (+ three.js, MIT) into animlab/lab.bundle.js so the lab opens
// directly from disk (file://) without a web server or CDN.
import { build } from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.resolve(HERE, '..', 'animlab');
await build({
  entryPoints: [path.join(LAB, 'src', 'lab.mjs')],
  nodePaths: [path.join(HERE, 'node_modules')],
  bundle: true, format: 'iife', target: 'es2020', minify: true, legalComments: 'eof',
  outfile: path.join(LAB, 'lab.bundle.js'), logLevel: 'warning',
});
const lic = fs.readFileSync(path.join(HERE, 'node_modules', 'three', 'LICENSE'), 'utf8');
fs.writeFileSync(path.join(LAB, 'THIRD_PARTY_LICENSES.txt'), `lab.bundle.js contains three.js r169 (MIT):\n\n${lic}`);
console.log('lab.bundle.js', (fs.statSync(path.join(LAB, 'lab.bundle.js')).size / 1024).toFixed(0), 'KiB');
