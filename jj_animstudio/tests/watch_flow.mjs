// End-to-end job flow with the real converter process (no game): the server's job files are
// written like server/jobs.lua does, `animkit watch --once` builds them, and the outbox, the
// stream resource, the skeleton export and the report are checked. Also measures the
// conversion time (part of the "button to playback <= 15 s" budget).
//   node jj_animstudio/tests/watch_flow.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseYcd } from '../../animkit/core/ycdreader.mjs';
import { ycdtoolStatus } from '../../animkit/core/pipeline.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RES = path.resolve(HERE, '..');
const KIT = path.resolve(RES, '..', 'animkit');
let pass = 0, failN = 0;
const ok = (c, m) => { if (c) pass++; else { failN++; console.log('  FAIL ' + m); } };
if (!ycdtoolStatus().ok) { console.log('watch flow: SKIPPED (ycdtool not built)'); process.exit(0); }

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'jjs-flow-'));
const studio = path.join(TMP, 'jj_animstudio'), stream = path.join(TMP, 'jj_animstudio_stream');
fs.mkdirSync(path.join(studio, 'data', 'inbox'), { recursive: true });
fs.copyFileSync(path.join(RES, 'fxmanifest.lua'), path.join(studio, 'fxmanifest.lua'));
const ex = (n) => fs.readFileSync(path.join(KIT, 'examples', `${n}.anim.json`), 'utf8');
// Same text layout as Jobs.submit (document embedded unchanged).
const job = (id, kind, dict, name, text, target = null) => fs.writeFileSync(path.join(studio, 'data', 'inbox', `${id}.json`),
  `{"kind":"${kind}","dict":"${dict}","project":"${name}","targetResource":${target ? `"${target}"` : 'null'},"doc":${text}}`);
job('pair_shoulder_v1', 'preview', 'jjs_pair_shoulder_v1', 'pair_shoulder', ex('pair_shoulder'));
job('single_wave_final_1', 'final', 'jj_wave', 'single_wave', ex('single_wave'), 'jj_emotes');
const bad = JSON.parse(ex('single_wave')); bad.tracks.a.bones.SKEL_Tail = [{ t: 0, rot: [0, 0, 0] }];
job('bad_v1', 'preview', 'jjs_bad_v1', 'single_wave', JSON.stringify(bad));
const t0 = Date.now();
const r = spawnSync(process.execPath, [path.join(KIT, 'cli', 'animkit.mjs'), 'watch', '--studio', studio, '--stream', stream, '--once'], { encoding: 'utf8', timeout: 120000 });
const totalMs = Date.now() - t0;
ok(r.status === 0, `watch --once exits 0 (${r.stderr})`);
const out = (id) => { try { return JSON.parse(fs.readFileSync(path.join(studio, 'data', 'outbox', `${id}.json`), 'utf8')); } catch { return null; } };
const pr = out('pair_shoulder_v1');
ok(pr?.ok === true && pr.restart === true && pr.clips?.a === 'pair_shoulder_a' && pr.clips?.b === 'pair_shoulder_b', 'pair preview built (outbox ok, restart requested)');
ok(pr?.origins?.b && Math.abs(pr.origins.b.y - 0.42) < 1e-6 && Math.abs(pr.origins.b.yaw - 180) < 1e-3, 'pair result carries the origins');
ok(pr?.readback && Object.values(pr.readback.clips).every((c) => c.maxWorldMm <= 2), 'pair read-back: world pose at origin <= 2 mm');
const ycd = path.join(stream, 'stream', 'jjs_pair_shoulder_v1.ycd');
ok(fs.existsSync(ycd), 'preview .ycd in jj_animstudio_stream/stream');
if (fs.existsSync(ycd)) {
  const p = parseYcd(new Uint8Array(fs.readFileSync(ycd)), (b) => new Uint8Array(zlib.inflateRawSync(b)));
  ok(!p.errors.length && p.clips.length === 2, 'streamed .ycd parses with the independent reader (2 clips)');
}
ok(fs.existsSync(path.join(stream, 'fxmanifest.lua')) && /jj_animstudio_stream/.test(fs.readFileSync(path.join(stream, 'fxmanifest.lua'), 'utf8')), 'stream resource manifest generated');
const fin = out('single_wave_final_1');
ok(fin?.ok === true && fin.kind === 'final' && fin.dict === 'jj_wave', 'final job built');
ok(fs.existsSync(path.join(studio, 'data', 'outbox', 'final', 'jj_wave.ycd')), 'final .ycd in data/outbox/final');
const md = fs.existsSync(path.join(studio, 'data', 'outbox', 'single_wave.report.md')) ? fs.readFileSync(path.join(studio, 'data', 'outbox', 'single_wave.report.md'), 'utf8') : '';
ok(/jj_emotes/.test(md) && /TaskPlayAnim/.test(md) && /Skelett/.test(md) && /Ampel/.test(md) && /Rücklesen/.test(md), 'report: target resource, Lua snippet, skeleton, checks, read-back');
ok(fin?.report?.text?.length > 200, 'report text included in the result for the studio');
const br = out('bad_v1');
ok(br?.ok === false && /SKEL_Tail/.test(br.errors?.[0]?.msg || ''), `broken document answered with a readable message (${br?.errors?.[0]?.msg})`);
ok(fs.readdirSync(path.join(studio, 'data', 'inbox')).length === 0, 'inbox emptied');
ok(['male', 'female', 'zombie'].every((k) => fs.existsSync(path.join(studio, 'data', 'skeletons', `${k}.json`))), 'skeletons exported for the studio');
ok(!fs.existsSync(path.join(studio, 'data', 'outbox', '_watch.json')), 'heartbeat removed when watch stops');
const per = (pr?.timings?.totalMs ?? 0);
ok(per > 0 && per < 8000, `one conversion takes ${per} ms (budget for button -> playback is 15 s)`);
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`watch flow: ${pass} passed, ${failN} failed (3 jobs in ${totalMs} ms incl. process start, pair conversion ${per} ms)`);
process.exit(failN ? 1 : 0);
