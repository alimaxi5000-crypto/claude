// Native check for jj_zombie_test. The checker lives in animkit/cli/check-natives.mjs.
//   node tools/check-natives.mjs [--json]
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RES = path.resolve(HERE, '..', '..', 'jj_zombie_test');
const r = spawnSync(process.execPath, [path.resolve(HERE, '..', '..', 'animkit', 'cli', 'check-natives.mjs'), RES, ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
