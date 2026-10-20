// Animation build: sources -> solved frames -> quality metrics -> ycd.xml -> binary .ycd
// (CodeWalker.Core via ycdtool) -> independent read-back + comparison -> Lua clip registry
// data + lab data + report. Exit code != 0 when any check fails.
//
//   node tools/build-anims.mjs [--only <sourceName>] [--no-ycd] [--report-only]

// The export steps (origin rebase, tracks, XML, ycdtool, read-back, Lua) are shared with the
// studio converter in animkit/core/pipeline.mjs.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadSkeletons, DEV } from './skeletons.mjs';
import { sampleScene, setAlignment, FPS } from '../../animkit/core/scene.mjs';
import { measureActor, measureScene, measureBlend } from '../../animkit/core/metrics.mjs';
import { rebaseToOrigin, clipTracks, writeDictionaries, convertDirectory, ycdtoolStatus, readBackDictionary, luaVal } from '../../animkit/core/pipeline.mjs';

const ROOT = path.resolve(DEV, '..');
const RES = path.join(ROOT, 'jj_zombie_test');
const OUT_STREAM = path.join(RES, 'stream');
const BUILD = path.join(DEV, 'build');
const XML_DIR = path.join(BUILD, 'xml');
const SRC_DIR = path.join(DEV, 'anims-src', 'clips');

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

function log(...a) { console.log(...a); }
const problems = [];
const fail = (msg) => { problems.push(msg); console.error('  FAIL ' + msg); };

// ------------------------------------------------------------------ load
const { skeletons, info: skelInfo } = loadSkeletons();
const ALIGN_FILE = path.join(DEV, 'anims-src', 'align.json');
setAlignment(fs.existsSync(ALIGN_FILE) ? JSON.parse(fs.readFileSync(ALIGN_FILE, 'utf8')) : {});
const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.mjs')).sort();
const sources = [];
for (const f of files) {
  const mod = await import(pathToFileURL(path.join(SRC_DIR, f)).href);
  const list = Array.isArray(mod.default) ? mod.default : [mod.default];
  for (const s of list) { s.file = f; sources.push(s); }
}
const only = opt('--only');

// ------------------------------------------------------------------ sample
const exportClips = [];          // flat list of clips per dictionary
const scenes = [];               // registry scenes
const sampledByKey = new Map();  // `${source}:${variant}` -> sampled
const t0 = Date.now();

function clipName(src, variant, actor, nActors) {
  if (src.clipName) return src.clipName(actor, variant);
  const parts = [src.name];
  if (variant.suffix) parts.push(variant.suffix);
  if (nActors > 1) parts.push(actor);
  return parts.join('_');
}

for (const src of sources) {
  if (only && src.name !== only) continue;
  const variants = src.variants || [{ suffix: '' }];
  for (const variant of variants) {
    const sampled = sampleScene(src, variant, skeletons);
    const key = `${src.name}:${variant.suffix || ''}`;
    sampledByKey.set(key, { src, variant, sampled });
    const dict = typeof src.dict === 'function' ? src.dict(variant) : src.dict;
    const sceneEntry = {
      key, name: src.name, variant: variant.suffix || '', dict, duration: +sampled.duration.toFixed(4),
      loop: !!src.loop, actors: {}, events: (typeof src.events === 'function' ? src.events(variant) : src.events) || [], meta: { ...(variant.meta || {}), ...(src.meta || {}) },
      playback: src.playback || {}, file: src.file, origins: {},
      // Metric settings of this clip source, so the lab's live metrics judge exactly like the build.
      checks: {
        limits: src.limits || {}, actorLimits: src.actorLimits || {}, airborne: src.airborne || {}, noGround: !!src.noGround,
        allowSelfContact: src.allowSelfContact || [], allowTouch: src.allowTouch || [],
        contacts: (typeof src.contacts === 'function' ? src.contacts(variant) : src.contacts) || [],
      },
    };
    for (const actor of sampled.actors) {
      const skel = sampled.skeletons[actor];
      const frames = sampled.frames[actor];
      const name = clipName(src, variant, actor, sampled.actors.length);
      // Paired scenes: every actor starts at its own origin (see animkit/core/pipeline.mjs).
      const rebase = src.rebaseMover ?? sampled.actors.length > 1;
      let out = frames;
      if (rebase) {
        const rb = rebaseToOrigin(skel, frames);
        for (const p of rb.problems) fail(`${name}: ${p}`);
        out = rb.frames;
        sceneEntry.origins[actor] = rb.origin;
      }
      const tracks = clipTracks(skel, out, { only: src.only, noMover: src.noMover });
      const metrics = measureActor(skel, frames, { loop: src.loop, limits: { ...(src.limits || {}), ...((src.actorLimits || {})[actor] || {}) }, airborne: (src.airborne || {})[actor], noGround: src.noGround, allowSelfContact: (src.allowSelfContact || []).includes(actor) });
      const clip = {
        dict, name, actor, scene: key, skeleton: skel.id, duration: sampled.duration, frames: frames.length,
        loop: !!src.loop, tracks, metrics, solved: frames, skel, origin: sceneEntry.origins[actor] || null,
      };
      exportClips.push(clip);
      sceneEntry.actors[actor] = name;
      if (!metrics.ok) for (const [k, v] of Object.entries(metrics.items)) if (!v.pass) fail(`${name}: ${k} = ${v.value} > ${v.limit} @frame ${v.frame} (${v.detail})`);
      const fadeFrames = frames.filter((s) => s.fades?.length).length;
      if (fadeFrames) log(`  WARN ${name}: implausible palm target faded in ${fadeFrames} frame(s)`);
    }
    if (sampled.actors.length > 1 || src.contacts) {
      const contacts = typeof src.contacts === 'function' ? src.contacts(variant) : src.contacts;
      sceneEntry.sceneMetrics = measureScene(sampled, { contacts, allowTouch: src.allowTouch, limits: src.limits });
      const sm = sceneEntry.sceneMetrics;
      if (!sm.ok) for (const [k, v] of Object.entries(sm.items)) if (!v.pass) fail(`${key}: ${k} = ${v.value} > ${v.limit} @frame ${v.frame} (${v.detail})`);
      for (const c of sm.contacts) if (!c.pass) fail(`${key}: contact ${c.detail} = ${c.value} > ${c.limit} @frame ${c.frame}`);
    }
    scenes.push(sceneEntry);
  }
}
log(`sampled ${exportClips.length} clips from ${sources.length} sources in ${Date.now() - t0} ms`);

// Declared transitions (pose continuity between consecutive clips of a sequence).
const blends = [];
for (const [key, { src, variant, sampled }] of sampledByKey) {
  // leadsTo: this clip's last frame must match the first frame of each listed clip.
  for (const next of (src.leadsTo ? src.leadsTo(variant) : [])) {
    const nextKey = `${next.name}:${next.variant ?? ''}`;
    const nx = sampledByKey.get(nextKey);
    if (!nx) { if (!only) fail(`${key}: leadsTo unknown ${nextKey}`); continue; }
    for (const actor of sampled.actors) {
      if (!nx.sampled.frames[actor]) continue;
      const m = measureBlend(sampled.skeletons[actor], sampled.frames[actor].at(-1), nx.sampled.frames[actor][0], { ...(src.limits || {}), ...(next.limits || {}) });
      blends.push({ from: key, to: nextKey, actor, ...m });
      if (!m.ok) for (const [k, v] of Object.entries(m.items)) if (!v.pass) fail(`blend ${key} -> ${nextKey} (${actor}): ${k} = ${v.value} > ${v.limit} (${v.detail})`);
    }
  }
  for (const prevName of src.follows || []) {
    const prevKey = `${prevName}:${variant.followSuffix?.[prevName] ?? variant.suffix ?? ''}`;
    const prev = sampledByKey.get(prevKey);
    if (!prev) { if (!only) fail(`${key}: follows unknown ${prevKey}`); continue; }
    for (const actor of sampled.actors) {
      if (!prev.sampled.frames[actor]) continue;
      const skel = sampled.skeletons[actor];
      const m = measureBlend(skel, prev.sampled.frames[actor].at(-1), sampled.frames[actor][0], src.limits);
      blends.push({ from: prevKey, to: key, actor, ...m });
      if (!m.ok) for (const [k, v] of Object.entries(m.items)) if (!v.pass) fail(`blend ${prevKey} -> ${key} (${actor}): ${k} = ${v.value} > ${v.limit} (${v.detail})`);
    }
  }
}

// Actor frames across transitions. The client blends between two scenes only when an actor keeps
// its origin (same entity frame); otherwise it switches instantly, which is seamless only at the
// matching end/start poses that leadsTo verifies. A looped clip can be left at any phase (struggle
// -> result), so all of its successors must keep every actor's origin.
const sceneByKey = new Map(scenes.map((s) => [s.key, s]));
const sameOrigin = (a, b) => !a || !b || (Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < 1e-3 && Math.abs(((a.yaw - b.yaw + 540) % 360) - 180) < 0.05);
for (const [key, { src, variant }] of sampledByKey) {
  if (!src.loop || !src.leadsTo) continue;
  const from = sceneByKey.get(key);
  for (const next of src.leadsTo(variant)) {
    const to = sceneByKey.get(`${next.name}:${next.variant ?? ''}`);
    if (!to) continue;
    for (const actor of Object.keys(from.origins)) {
      if (!sameOrigin(from.origins[actor], to.origins[actor])) fail(`${key} -> ${to.key} (${actor}): looped clip and successor have different origins ${JSON.stringify(from.origins[actor])} vs ${JSON.stringify(to.origins[actor])}`);
    }
  }
}

// ------------------------------------------------------------------ write xml + ycd
const written = writeDictionaries(XML_DIR, exportClips);
const dicts = written.dicts;
for (const p of written.problems) fail(p);
let readback = {};
if (!flag('--no-ycd')) {
  const st = ycdtoolStatus();
  if (!st.ok) { fail(st.reason); }
  else {
    fs.mkdirSync(OUT_STREAM, { recursive: true });
    if (!only) for (const f of fs.readdirSync(OUT_STREAM)) if (/^jjz_.*\.ycd$/.test(f)) fs.unlinkSync(path.join(OUT_STREAM, f));
    const r = convertDirectory(XML_DIR, OUT_STREAM);
    if (!r.ok) fail(r.error);
    else log(r.output.split(/\r?\n/).map((l) => '  ' + l.trim()).join('\n'));
    // Independent read-back and comparison with the source data.
    for (const [dict, clips] of dicts) {
      const rb = readBackDictionary(path.join(OUT_STREAM, `${dict}.ycd`), clips, dict);
      for (const p of rb.problems) fail(p);
      if (rb.info) readback[dict] = rb.info;
    }
  }
}

// ------------------------------------------------------------------ Lua registry data
const luaData = {
  build: { skeletons: skelInfo, fps: FPS, dicts: Object.fromEntries([...dicts].map(([d, c]) => [d, c.length])) },
  scenes: Object.fromEntries(scenes.map((s) => [s.variant ? `${s.name}:${s.variant}` : s.name, {
    name: s.name, variant: s.variant, dict: s.dict, duration: s.duration, loop: s.loop, actors: s.actors,
    events: s.events.map((e) => ({ name: e.name, t: e.t, phase: +(e.t / s.duration).toFixed(4), actor: e.actor })),
    meta: s.meta, playback: s.playback, origins: Object.keys(s.origins).length ? s.origins : undefined,
  }])),
};
if (!only) {
  const lua = `-- AUTO-GENERATED by jj_zombie_dev/tools/build-anims.mjs. Do not edit by hand:
-- change the clip sources in jj_zombie_dev/anims-src/clips and rebuild.
-- Skeletons used: ${Object.entries(skelInfo).map(([k, v]) => `${k}=${v}`).join(', ')}
ClipData = ${luaVal(luaData)}
`;
  fs.writeFileSync(path.join(RES, 'shared', 'clips_data.lua'), lua);
}

// ------------------------------------------------------------------ lab data + report
fs.mkdirSync(BUILD, { recursive: true });
const report = {
  skeletons: skelInfo,
  clips: exportClips.map((c) => ({ dict: c.dict, name: c.name, actor: c.actor, scene: c.scene, frames: c.frames, duration: +c.duration.toFixed(4), loop: c.loop, metrics: c.metrics, readback: c.readback })),
  scenes: scenes.map((s) => ({ key: s.key, dict: s.dict, duration: s.duration, file: s.file, sceneMetrics: s.sceneMetrics })),
  blends, readback, problems,
};
fs.writeFileSync(path.join(BUILD, 'report.json'), JSON.stringify(report, null, 1));
fs.writeFileSync(path.join(BUILD, 'registry.json'), JSON.stringify(luaData, null, 1));
if (!only) {
  const { writeLabData } = await import('./labdata.mjs');
  writeLabData({ skeletons, scenes, exportClips, sampledByKey, report, dicts, streamDir: OUT_STREAM });
}

log(`\n${dicts.size} dictionaries, ${exportClips.length} clips, ${scenes.length} scenes, ${problems.length} problem(s)`);
for (const [d, r] of Object.entries(readback)) log(`  ${d}.ycd  ${r.bytes} bytes  ${r.clips} clips (read back OK)`);
if (problems.length) process.exit(1);
