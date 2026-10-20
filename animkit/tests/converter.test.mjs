// Converter tests: example documents -> .ycd -> independent read-back -> world pose, error
// cases with readable messages, studio job flow inbox -> outbox -> stream (+ pruning), fixes.
//   node animkit/tests/converter.test.mjs [--no-ycd]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSkeletons } from '../core/skeletons.mjs';
import { parseDocument, validateDocument, newDocument, MAX_BYTES } from '../core/doc.mjs';
import { buildDocument } from '../core/docbuild.mjs';
import { sampleDocument } from '../core/resolve.mjs';
import { evaluateChecks, measureDocument } from '../core/checks.mjs';
import { applyFix } from '../core/fixes.mjs';
import { ycdtoolStatus } from '../core/pipeline.mjs';
import { studioPaths, ensureFolders, processJobFile, KEEP_PREVIEWS } from '../cli/lib/jobs.mjs';
import { reportJson, reportMarkdown } from '../core/report.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EX = path.join(HERE, '..', 'examples');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'animkit-test-'));
const YCD = !process.argv.includes('--no-ycd') && ycdtoolStatus().ok;
let pass = 0, failN = 0;
const ok = (cond, msg) => { if (cond) pass++; else { failN++; console.log('  FAIL ' + msg); } };
const { skeletons, info } = loadSkeletons({ quiet: true });
const load = (f) => JSON.parse(fs.readFileSync(path.join(EX, f), 'utf8'));
const finding = (r, id) => r.findings.find((f) => f.id === id);

// ------------------------------------------------------------------ examples
for (const f of fs.readdirSync(EX).filter((x) => x.endsWith('.anim.json')).sort()) {
  const doc = load(f);
  ok(validateDocument(doc, { skeletonsFor: () => skeletons.male }).length === 0, `${f}: validates`);
  const r = buildDocument(doc, { skeletons, skelInfo: info, dict: `jjs_${doc.name}_v1`, workDir: path.join(TMP, doc.name), streamDir: path.join(TMP, 'stream'), convert: YCD });
  ok(r.ok, `${f}: builds (${r.errors.map((e) => e.msg).join(' | ')})`);
  ok(r.light !== 'error', `${f}: traffic light not red (${r.findings?.filter((x) => x.level === 'error').map((x) => x.text).join(' | ')})`);
  if (YCD && r.ok) {
    for (const [clip, v] of Object.entries(r.readback.clips)) {
      ok(v.maxRotDeg <= 0.05 && v.maxPosMm <= 0.5, `${f}/${clip}: read-back within tolerance`);
      if (doc.type === 'pair') ok(v.maxWorldMm != null && v.maxWorldMm <= 2, `${f}/${clip}: world pose at origin <= 2 mm (${v.maxWorldMm})`);
    }
    ok(fs.existsSync(path.join(TMP, 'stream', `jjs_${doc.name}_v1.ycd`)), `${f}: .ycd written`);
  }
  if (doc.loop) ok(finding(r, 'a.loop')?.level === 'ok', `${f}: clean loop seam`);
  if (doc.name === 'pair_shoulder') {
    const c = finding(r, 'contact.0');
    ok(c && c.level === 'ok' && c.value <= 0.03, `pair: stuck hand stays on the shoulder (${c?.value} m)`);
    ok(r.origins.b && Math.abs(r.origins.b.y - 0.42) < 1e-6 && Math.abs(r.origins.b.yaw - 180) < 1e-3, `pair: origin of b = (0, 0.42, 180 deg) ${JSON.stringify(r.origins.b)}`);
    const rep = reportMarkdown(reportJson(doc, r));
    ok(/NetworkCreateSynchronisedScene/.test(rep) && /ORIGINS/.test(rep) && /NetworkStartSynchronisedScene/.test(rep), 'pair report: networked scene snippet with origins');
  }
  if (doc.name === 'walk_cycle') {
    const fs_ = finding(r, 'a.footSlide');
    ok(fs_.value <= 0.3, `walk: feet do not slide (${fs_.value} m/s)`);
    ok(Math.abs(r.duration - 1) < 1e-9 && r.frames === 31, 'walk: 31 frames for 1.0 s');
  }
  if (doc.name === 'single_wave') {
    const rep = reportMarkdown(reportJson(doc, r));
    ok(/TaskPlayAnim\(ped, DICT, CLIP, 8\.0, -8\.0, -1, 1,/.test(rep), 'single report: TaskPlayAnim loop snippet');
  }
}

// Finger presets actually differ (fist curls more than open).
{
  const doc = load('fingers_demo.anim.json');
  const s = sampleDocument(doc, skeletons);
  const sk = s.skeletons.a, i = sk.idx('SKEL_L_Finger12');
  const tipY = (f) => s.frames.a[f].world.P[i];
  const open = tipY(30), fist = tipY(15);   // L: t=1.0 open, t=0.5 fist
  const pi = sk.idx('SKEL_L_Hand');
  const reach = (p, f) => Math.hypot(...p.map((x, k) => x - s.frames.a[f].world.P[pi][k]));
  ok(reach(open, 30) > reach(fist, 15) + 0.02, `fingers: open hand longer than fist (${reach(open, 30).toFixed(3)} vs ${reach(fist, 15).toFixed(3)})`);
}

// ------------------------------------------------------------------ error cases
const code = (text) => { const p = parseDocument(text); if (p.errors) return p.errors[0]; const e = validateDocument(p.doc, { skeletonsFor: () => skeletons.male }); return e[0] || null; };
{
  const good = load('single_wave.anim.json');
  const e1 = code('{"format": "jj-anim/1", "name": ');
  ok(e1?.code === 'json_invalid' && /kein gültiges JSON/.test(e1.msg), 'broken JSON -> json_invalid with German message');
  const e2 = code(JSON.stringify({ ...good, format: 'jj-anim/9' }));
  ok(e2?.code === 'version_unsupported' && /jj-anim\/9/.test(e2.msg), 'wrong version -> version_unsupported');
  const bad = JSON.parse(JSON.stringify(good)); bad.tracks.a.bones.SKEL_Tail = [{ t: 0, rot: [0, 0, 0] }];
  const e3 = code(JSON.stringify(bad));
  ok(e3?.code === 'unknown_bone' && /SKEL_Tail/.test(e3.msg), 'unknown bone -> unknown_bone');
  const big = JSON.stringify({ ...good, notes: 'x'.repeat(MAX_BYTES) });
  const e4 = code(big);
  ok(e4?.code === 'too_large' && /2 MB/.test(e4.msg), 'too large -> too_large');
  const e5 = code(JSON.stringify({ ...good, name: 'Bad Name!' }));
  ok(e5?.code === 'name_invalid' && /Kleinbuchstaben/.test(e5.msg), 'invalid name -> name_invalid');
  const e6 = code(JSON.stringify({ ...good, duration: 2, tracks: { a: { bones: { SKEL_Head: [{ t: 5, rot: [0, 0, 0] }] } } } }));
  ok(e6?.code === 'time_range', 'key after the end -> time_range');
  const e7 = code(JSON.stringify({ ...good, type: 'pair' }));
  ok(e7?.code === 'actor_count', 'pair with one actor -> actor_count');
  const e8 = code(JSON.stringify({ ...good, tracks: { a: { bones: { SKEL_Head: [{ t: 0, rot: [0, 0, 0] }, { t: 0, rot: [1, 0, 0] }] } } } }));
  ok(e8?.code === 'duplicate_key', 'two keys at the same time -> duplicate_key');
  const e9 = code(JSON.stringify({ ...good, contacts: [{ from: 'a.head', to: 'x.handL', t: [0, 1], stick: true }] }));
  ok(e9?.code === 'contact_invalid', 'contact with unknown actor / non-limb stick -> contact_invalid');
  const e10 = code(JSON.stringify({ ...good, extra: 1 }));
  ok(e10?.code === 'schema' && /unknown field/.test(e10.msg), 'unknown top-level field -> schema');
}

// ------------------------------------------------------------------ fixes
{
  // Pelvis slides sideways with FK legs -> feet slide; locking both feet removes it.
  const doc = newDocument({ name: 'slide_test', duration: 0.3 });
  doc.tracks.a.root = [{ t: 0, p: [0, 0, -0.04] }, { t: 0.3, p: [0, 0.1, -0.04] }];
  let s = sampleDocument(doc, skeletons);
  let f = evaluateChecks(doc, s, measureDocument(doc, s));
  const slide = f.find((x) => x.id === 'a.footSlide');
  ok(slide.level !== 'ok' && slide.fix?.kind === 'lockFeet', `fix: sliding feet detected (${slide.value} m/s) with lockFeet fix`);
  let d2 = applyFix(doc, { kind: 'lockFeet', actor: 'a', side: 'L', range: [0, 0.3] }, { sampled: s });
  d2 = applyFix(d2, { kind: 'lockFeet', actor: 'a', side: 'R', range: [0, 0.3] }, { sampled: s });
  s = sampleDocument(d2, skeletons);
  f = evaluateChecks(d2, s, measureDocument(d2, s));
  ok(f.find((x) => x.id === 'a.footSlide').value < 0.02, `fix: locked feet stay (${f.find((x) => x.id === 'a.footSlide').value} m/s)`);
  // Joint limits.
  const j = newDocument({ name: 'limit_test', duration: 1 });
  j.tracks.a.bones = { SKEL_Head: [{ t: 0, rot: [0, 0, 0] }, { t: 1, rot: [0, 0, 120] }] };
  s = sampleDocument(j, skeletons);
  f = evaluateChecks(j, s, measureDocument(j, s));
  const jf = f.find((x) => x.id === 'a.joints');
  ok(jf.level === 'error' && jf.fix?.kind === 'clampJoints', 'fix: joint over the limit detected');
  const j2 = applyFix(j, jf.fix, { sampled: s });
  ok(j2.tracks.a.bones.SKEL_Head[1].rot[2] === 60, `fix: head turn clamped to 60 deg (${j2.tracks.a.bones.SKEL_Head[1].rot[2]})`);
  // Loop seam.
  const l = newDocument({ name: 'loop_test', duration: 1 }); l.loop = true;
  l.tracks.a.bones = { SKEL_Head: [{ t: 0, rot: [0, 0, 0] }, { t: 1, rot: [20, 0, 0] }] };
  s = sampleDocument(l, skeletons);
  f = evaluateChecks(l, s, measureDocument(l, s));
  ok(f.find((x) => x.id === 'a.loop').level === 'error', 'fix: broken loop seam detected');
  const l2 = applyFix(l, { kind: 'closeLoop', actor: 'a' });
  s = sampleDocument(l2, skeletons);
  f = evaluateChecks(l2, s, measureDocument(l2, s));
  ok(f.find((x) => x.id === 'a.loop').level === 'ok', 'fix: closeLoop gives a clean seam');
  // Ground penetration with FK legs -> pelvis lifted locally.
  const g = newDocument({ name: 'ground_test', duration: 1 });
  g.tracks.a.root = [{ t: 0, p: [0, 0, 0] }, { t: 0.5, p: [0, 0, -0.08] }, { t: 1, p: [0, 0, 0] }];
  s = sampleDocument(g, skeletons);
  f = evaluateChecks(g, s, measureDocument(g, s));
  const gp = f.find((x) => x.id === 'a.groundPen');
  ok(gp.level === 'error' && gp.fix?.kind === 'snapGround', `fix: feet in the ground detected (${gp.value} m)`);
  const g2 = applyFix(g, gp.fix, { sampled: s });
  s = sampleDocument(g2, skeletons);
  f = evaluateChecks(g2, s, measureDocument(g2, s));
  ok(f.find((x) => x.id === 'a.groundPen').level !== 'error', `fix: snapGround lifts the feet out (${f.find((x) => x.id === 'a.groundPen').value} m)`);
}

// ------------------------------------------------------------------ studio job flow
{
  const studio = path.join(TMP, 'jj_animstudio'), stream = path.join(TMP, 'jj_animstudio_stream');
  fs.mkdirSync(studio, { recursive: true });
  fs.writeFileSync(path.join(studio, 'fxmanifest.lua'), "fx_version 'cerulean'\n");
  const P = studioPaths(studio, stream);
  ensureFolders(P);
  ok(fs.existsSync(path.join(stream, 'fxmanifest.lua')), 'jobs: stream resource manifest generated');
  const doc = load('single_wave.anim.json');
  const put = (name, obj) => { const f = path.join(P.inbox, `${name}.json`); fs.writeFileSync(f, typeof obj === 'string' ? obj : JSON.stringify(obj)); return f; };
  const opts = { skeletons, skelInfo: info, workRoot: path.join(TMP, 'work') };
  if (YCD) {
    for (let v = 1; v <= KEEP_PREVIEWS + 2; v++) {
      const r = processJobFile(P, put(`single_wave_v${v}`, { kind: 'preview', dict: `jjs_single_wave_v${v}`, project: 'single_wave', doc }), opts);
      ok(r.ok && r.restart === true, `jobs: preview v${v} ok (${r.errors.map((e) => e.msg).join(' | ')})`);
      const out = JSON.parse(fs.readFileSync(path.join(P.outbox, `single_wave_v${v}.json`), 'utf8'));
      ok(out.ok && out.clips.a === 'single_wave' && out.dict === `jjs_single_wave_v${v}`, `jobs: outbox v${v} written`);
      // Distinct modification times for the pruning order.
      const t = new Date(Date.now() - (KEEP_PREVIEWS + 3 - v) * 1000);
      fs.utimesSync(path.join(P.streamFiles, `jjs_single_wave_v${v}.ycd`), t, t);
    }
    const left = fs.readdirSync(P.streamFiles).filter((f) => f.startsWith('jjs_single_wave_v')).sort();
    ok(left.length === KEEP_PREVIEWS, `jobs: only the last ${KEEP_PREVIEWS} previews kept (${left.join(', ')})`);
    ok(fs.existsSync(path.join(P.streamFiles, `jjs_single_wave_v${KEEP_PREVIEWS + 2}.ycd`)), 'jobs: newest preview kept');
    const fin = processJobFile(P, put('single_wave_final', { kind: 'final', dict: 'jj_wave', targetResource: 'jj_emotes', doc }), opts);
    ok(fin.ok && fs.existsSync(path.join(P.final, 'jj_wave.ycd')) && fs.existsSync(path.join(P.streamFiles, 'jj_wave.ycd')), 'jobs: final .ycd in outbox/final and stream');
    ok(fs.existsSync(path.join(P.outbox, 'single_wave.report.md')) && fs.existsSync(path.join(P.outbox, 'single_wave.report.json')), 'jobs: report .md + .json written');
    ok(/jj_emotes/.test(fs.readFileSync(path.join(P.outbox, 'single_wave.report.md'), 'utf8')), 'jobs: report names the target resource');
  }
  const bad = processJobFile(P, put('bad_dict', { kind: 'preview', dict: '../evil', doc }), opts);
  ok(!bad.ok && bad.errors[0].code === 'name_invalid' && fs.existsSync(path.join(P.outbox, 'bad_dict.json')), 'jobs: path-like dict rejected with a message');
  const bad2 = processJobFile(P, put('bad_kind', { kind: 'rm', dict: 'x', doc }), opts);
  ok(!bad2.ok && bad2.errors[0].code === 'job_invalid', 'jobs: unknown kind rejected');
  const bad3 = processJobFile(P, put('bad_doc', { kind: 'preview', dict: 'jjs_x_v1', doc: { ...doc, format: 'nope' } }), opts);
  ok(!bad3.ok && bad3.errors[0].code === 'version_unsupported', 'jobs: wrong document version reported');
  const partial = put('partial', '{"kind": "pre');
  ok(processJobFile(P, partial, opts) === null && fs.existsSync(partial), 'jobs: fresh incomplete file waits');
  const old = new Date(Date.now() - 10000); fs.utimesSync(partial, old, old);
  const pr = processJobFile(P, partial, opts);
  ok(pr && !pr.ok && pr.errors[0].code === 'json_invalid' && !fs.existsSync(partial), 'jobs: stale broken file answered and removed');
  const evil = path.join(P.inbox, 'Evil..Name.json'); fs.writeFileSync(evil, '{}');
  const er = processJobFile(P, evil, opts);
  ok(er.dropped && !fs.existsSync(evil) && !fs.readdirSync(P.outbox).some((f) => /evil/i.test(f)), 'jobs: unsafe job file name dropped without an outbox file');
}

fs.rmSync(TMP, { recursive: true, force: true });
console.log(`converter tests: ${pass} passed, ${failN} failed${YCD ? '' : ' (YCD conversion skipped)'}`);
process.exit(failN ? 1 : 0);
