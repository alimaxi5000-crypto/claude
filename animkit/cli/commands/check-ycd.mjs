// animkit check-ycd <dir|file.ycd>...
// Parses every .ycd with the independent reader and fails on any structural error.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { parseYcd } from '../../core/ycdreader.mjs';

export default async function checkYcd(args) {
  if (!args.length) { console.error('usage: animkit check-ycd <dir|file.ycd>...'); return 2; }
  const files = [];
  for (const a of args) {
    if (fs.statSync(a).isDirectory()) for (const f of fs.readdirSync(a).filter((f) => f.endsWith('.ycd')).sort()) files.push(path.join(a, f));
    else files.push(a);
  }
  let clips = 0;
  for (const f of files) {
    const r = parseYcd(new Uint8Array(fs.readFileSync(f)), (b) => new Uint8Array(zlib.inflateRawSync(b)));
    if (r.errors.length) { console.error(path.basename(f), r.errors.join('; ')); return 1; }
    clips += r.clips.length;
  }
  console.log(`YCD reader OK (${files.length} files, ${clips} clips)`);
  return 0;
}
