#!/usr/bin/env node
// animkit command line. Run `node animkit/cli/animkit.mjs help` for the list of commands.
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const COMMANDS = {
  build: 'build <file.anim.json> [--out dir] [--dict name] [--no-ycd]   convert one clip document (same checks as the studio)',
  watch: 'watch [--studio <jj_animstudio dir>] [--stream <jj_animstudio_stream dir>] [--once]   job converter for the in-game studio',
  doctor: 'doctor [--studio dir] [--stream dir]   check Node, .NET, ycdtool, skeletons, folders and write permissions',
  'import-skeleton': 'import-skeleton <male|female|zombie> <model.yft.xml> [--dir dir]   import a real ped skeleton (stays local)',
  'check-ycd': 'check-ycd <dir|file.ycd>...   parse .ycd files with the independent reader',
  'check-natives': 'check-natives <resourceDir> [--json]   verify every native call of a resource',
};

const [cmd, ...args] = process.argv.slice(2);
if (!cmd || cmd === 'help' || cmd === '--help' || !COMMANDS[cmd]) {
  console.log('animkit - animation toolkit (jj-anim/1 clip documents -> GTA V .ycd)\n');
  for (const [k, v] of Object.entries(COMMANDS)) console.log(`  animkit ${v.replace(/^\S+/, k)}`);
  process.exit(cmd && cmd !== 'help' && cmd !== '--help' ? 2 : 0);
}
if (cmd === 'check-natives') {
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, [path.join(HERE, 'check-natives.mjs'), ...args], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}
const mod = await import(pathToFileURL(path.join(HERE, 'commands', `${cmd}.mjs`)).href);
const code = await mod.default(args);
process.exitCode = typeof code === 'number' ? code : 0;
