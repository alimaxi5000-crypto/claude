// animkit build <file.anim.json> [--dict name] [--out dir] [--no-ycd]
// Builds one clip document by hand with exactly the checks the studio uses: validation,
// solve, traffic light, .ycd conversion, independent read-back and world pose. Writes
// <out>/<dict>.ycd, <out>/<name>.report.md and <out>/<name>.report.json. Exit 1 on errors.
import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from '../../core/doc.mjs';
import { buildDocument } from '../../core/docbuild.mjs';
import { reportJson, reportMarkdown } from '../../core/report.mjs';
import { loadSkeletons, ANIMKIT } from '../../core/skeletons.mjs';
import { opt } from '../lib/config.mjs';

const LIGHT = { ok: 'GREEN', warn: 'YELLOW', error: 'RED' };

export default async function build(args) {
  const file = args.find((a, i) => !a.startsWith('--') && !(i > 0 && ['--dict', '--out'].includes(args[i - 1])));
  if (!file) { console.error('usage: animkit build <file.anim.json> [--dict name] [--out dir] [--no-ycd]'); return 2; }
  let text;
  try { text = fs.readFileSync(file); } catch (e) { console.error(`cannot read ${file}: ${e.message}`); return 1; }
  const parsed = parseDocument(text);
  if (parsed.errors) { for (const e of parsed.errors) console.error(`ERROR [${e.code}] ${e.msg}`); return 1; }
  const doc = parsed.doc;
  for (const m of parsed.migrated) console.log(`migrated: ${m}`);
  const dict = opt(args, '--dict') || doc.dict || doc.name;
  const out = path.resolve(opt(args, '--out') || path.join(ANIMKIT, 'build', 'manual', String(doc.name || 'clip').replace(/[^a-z0-9_]/g, '_')));
  fs.mkdirSync(out, { recursive: true });
  const { skeletons, info } = loadSkeletons({ quiet: true });
  const r = buildDocument(doc, { skeletons, skelInfo: info, dict, workDir: path.join(out, '_work'), streamDir: args.includes('--no-ycd') ? null : out, convert: !args.includes('--no-ycd') });
  fs.rmSync(path.join(out, '_work'), { recursive: true, force: true });
  for (const w of r.warnings) console.log(`warn  ${w.msg}`);
  for (const f of r.findings || []) console.log(`${(LIGHT[f.level] || f.level).padEnd(6)} ${f.title}: ${f.text}${f.t != null ? ` @${f.t}s` : ''}`);
  if (!r.ok) { for (const e of r.errors) console.error(`ERROR [${e.code}] ${e.msg}`); return 1; }
  if (r.ycdFile) {
    const rep = reportJson(doc, r);
    fs.writeFileSync(path.join(out, `${doc.name}.report.json`), JSON.stringify(rep, null, 1));
    fs.writeFileSync(path.join(out, `${doc.name}.report.md`), reportMarkdown(rep));
    console.log(`${dict}.ycd ${r.ycdBytes} bytes, read back OK (${Object.entries(r.readback.clips).map(([c, v]) => `${c}: rot ${v.maxRotDeg} deg${v.maxWorldMm != null ? `, world ${v.maxWorldMm} mm` : ''}`).join('; ')})`);
    console.log(`written to ${out}`);
  } else console.log('checks done (no .ycd written: --no-ycd)');
  console.log(`build ${doc.name}: ${LIGHT[r.light]} in ${r.timings.totalMs ?? '?'} ms`);
  return 0;
}
