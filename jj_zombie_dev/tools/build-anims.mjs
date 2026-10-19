// Animation build: sources -> solved frames -> quality metrics -> ycd.xml -> binary .ycd
// (CodeWalker.Core via ycdtool) -> independent read-back + comparison -> Lua clip registry
// data + lab data + report. Exit code != 0 when any check fails.
//
//   node tools/build-anims.mjs [--only <sourceName>] [--no-ycd] [--report-only]

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { loadSkeletons, DEV } from './skeletons.mjs';
import { sampleScene, setAlignment, FPS } from './animcore/scene.mjs';
import { animatedBoneNames } from './animcore/skeleton.mjs';
import { dictionaryXml, continuous } from './animcore/ycdxml.mjs';
import { parseYcd } from './animcore/ycdreader.mjs';
import { measureActor, measureScene, measureBlend } from './animcore/metrics.mjs';
import { qangle, DEG } from './animcore/math.mjs';

const ROOT = path.resolve(DEV, '..');
const RES = path.join(ROOT, 'jj_zombie_test');
const OUT_STREAM = path.join(RES, 'stream');
const BUILD = path.join(DEV, 'build');
const XML_DIR = path.join(BUILD, 'xml');
const SRC_DIR = path.join(DEV, 'anims-src', 'clips');
const YCDTOOL = path.join(DEV, 'tools', 'ycdtool', 'out', 'ycdtool.dll');

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
const tag = (skel, name) => skel.bones[skel.idx(name)].tag;
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

function filterBones(src, skel) {
  const all = animatedBoneNames(skel);
  if (!src.only) return { rot: all, rootPos: true };
  const rot = [], set = new Set();
  let rootPos = false;
  for (const e of src.only) {
    const [b, kind] = e.split(':');
    if (kind === 'pos') { if (b === 'SKEL_ROOT') rootPos = true; continue; }
    if (skel.has(b) && !set.has(b)) { rot.push(b); set.add(b); }
    if (b === 'SKEL_ROOT' && kind !== 'rot') rootPos = true;
  }
  return { rot, rootPos };
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
      playback: src.playback || {},
    };
    for (const actor of sampled.actors) {
      const skel = sampled.skeletons[actor];
      const frames = sampled.frames[actor];
      const name = clipName(src, variant, actor, sampled.actors.length);
      const sel = filterBones(src, skel);
      const tracks = [];
      for (const b of sel.rot) {
        tracks.push({ boneId: tag(skel, b), track: 1, bone: b, series: continuous(frames.map((s) => s.local[skel.idx(b)])) });
      }
      if (sel.rootPos) tracks.push({ boneId: 0, track: 0, bone: 'SKEL_ROOT', series: frames.map((s) => s.rootT) });
      if (!src.noMover) {
        tracks.push({ boneId: 0, track: 5, bone: 'mover', series: frames.map((s) => s.mover.p) });
        tracks.push({ boneId: 0, track: 6, bone: 'mover', series: continuous(frames.map((s) => s.mover.q)) });
      }
      const metrics = measureActor(skel, frames, { loop: src.loop, limits: { ...(src.limits || {}), ...((src.actorLimits || {})[actor] || {}) }, airborne: (src.airborne || {})[actor], noGround: src.noGround, allowSelfContact: (src.allowSelfContact || []).includes(actor) });
      const clip = {
        dict, name, actor, scene: key, skeleton: skel.id, duration: sampled.duration, frames: frames.length,
        loop: !!src.loop, tracks, metrics, solved: frames, skel,
      };
      exportClips.push(clip);
      sceneEntry.actors[actor] = name;
      if (!metrics.ok) for (const [k, v] of Object.entries(metrics.items)) if (!v.pass) fail(`${name}: ${k} = ${v.value} > ${v.limit} @frame ${v.frame} (${v.detail})`);
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

// ------------------------------------------------------------------ write xml + ycd
const dicts = new Map();
for (const c of exportClips) {
  if (!dicts.has(c.dict)) dicts.set(c.dict, []);
  dicts.get(c.dict).push(c);
}
fs.mkdirSync(XML_DIR, { recursive: true });
for (const f of fs.readdirSync(XML_DIR)) fs.unlinkSync(path.join(XML_DIR, f));
for (const [dict, clips] of dicts) {
  if (!/^[a-z0-9_]+$/.test(dict)) fail(`dictionary name '${dict}' must be lowercase [a-z0-9_]`);
  fs.writeFileSync(path.join(XML_DIR, `${dict}.ycd.xml`), dictionaryXml(dict, clips));
}
let readback = {};
if (!flag('--no-ycd')) {
  if (!fs.existsSync(YCDTOOL)) { fail(`ycdtool not built (${YCDTOOL}); run tools/setup.sh`); }
  else {
    fs.mkdirSync(OUT_STREAM, { recursive: true });
    if (!only) for (const f of fs.readdirSync(OUT_STREAM)) if (/^jjz_.*\.ycd$/.test(f)) fs.unlinkSync(path.join(OUT_STREAM, f));
    const r = spawnSync('dotnet', [YCDTOOL, 'batch', XML_DIR, OUT_STREAM], { encoding: 'utf8' });
    if (r.status !== 0) fail(`ycdtool failed: ${r.stderr || r.stdout}`);
    else log(r.stdout.trim().split('\n').map((l) => '  ' + l).join('\n'));
    // Independent read-back and comparison with the source data.
    for (const [dict, clips] of dicts) {
      const file = path.join(OUT_STREAM, `${dict}.ycd`);
      if (!fs.existsSync(file)) { fail(`${dict}.ycd missing`); continue; }
      const bytes = fs.readFileSync(file);
      let parsed;
      try { parsed = parseYcd(bytes, (u8) => zlib.inflateRawSync(u8)); } catch (e) { fail(`${dict}.ycd: reader error: ${e.message}`); continue; }
      for (const e of parsed.errors) fail(`${dict}.ycd: ${e}`);
      readback[dict] = { bytes: bytes.length, clips: parsed.clips.length, sysSize: parsed.header.sysSize };
      const byName = new Map(parsed.clips.map((c) => [c.shortName, c]));
      if (parsed.clips.length !== clips.length) fail(`${dict}.ycd: ${parsed.clips.length} clips, expected ${clips.length}`);
      for (const c of clips) {
        const pc = byName.get(c.name);
        if (!pc) { fail(`${dict}.ycd: clip ${c.name} missing`); continue; }
        const a = pc.anim;
        if (!a) { fail(`${dict}/${c.name}: no animation`); continue; }
        if (a.frames !== c.frames) fail(`${dict}/${c.name}: frames ${a.frames} != ${c.frames}`);
        if (Math.abs(a.duration - c.duration) > 1e-4 || Math.abs(pc.end - c.duration) > 1e-4) fail(`${dict}/${c.name}: duration mismatch`);
        if (a.sequences.length !== 1) fail(`${dict}/${c.name}: expected 1 sequence, got ${a.sequences.length}`);
        const hasMover = c.tracks.some((t) => t.track >= 5);
        if (((a.flags & 16) !== 0) !== hasMover) fail(`${dict}/${c.name}: root motion flag mismatch`);
        const want = new Map(c.tracks.map((t) => [`${t.boneId}/${t.track}`, t]));
        if (a.tracks.length !== want.size) fail(`${dict}/${c.name}: ${a.tracks.length} tracks, expected ${want.size}`);
        let maxRot = 0, maxPos = 0;
        for (const t of a.tracks) {
          const src = want.get(`${t.boneId}/${t.track}`);
          if (!src) { fail(`${dict}/${c.name}: unexpected track ${t.boneId}/${t.track}`); continue; }
          for (let f = 0; f < c.frames; f++) {
            const v = t.values[f], s = src.series[f];
            if (t.track === 1 || t.track === 6) maxRot = Math.max(maxRot, qangle(v, s) / DEG);
            else maxPos = Math.max(maxPos, Math.hypot(v[0] - s[0], v[1] - s[1], v[2] - s[2]));
          }
        }
        c.readback = { maxRotDeg: maxRot, maxPosM: maxPos };
        if (maxRot > 0.05) fail(`${dict}/${c.name}: rotation read-back error ${maxRot.toFixed(4)} deg`);
        if (maxPos > 0.0005) fail(`${dict}/${c.name}: position read-back error ${(maxPos * 1000).toFixed(3)} mm`);
      }
    }
  }
}

// ------------------------------------------------------------------ Lua registry data
const luaStr = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const luaNum = (n) => (Number.isInteger(n) ? String(n) : (+n.toFixed(4)).toString());
function luaVal(v, ind = '') {
  if (v === null || v === undefined) return 'nil';
  if (typeof v === 'number') return luaNum(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'string') return luaStr(v);
  if (Array.isArray(v)) return `{ ${v.map((x) => luaVal(x, ind)).join(', ')} }`;
  const keys = Object.keys(v).sort();
  if (!keys.length) return '{}';
  const inner = keys.map((k) => `${ind}    ${/^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : `[${luaStr(k)}]`} = ${luaVal(v[k], ind + '    ')},`).join('\n');
  return `{\n${inner}\n${ind}}`;
}
const luaData = {
  build: { skeletons: skelInfo, fps: FPS, dicts: Object.fromEntries([...dicts].map(([d, c]) => [d, c.length])) },
  scenes: Object.fromEntries(scenes.map((s) => [s.variant ? `${s.name}:${s.variant}` : s.name, {
    name: s.name, variant: s.variant, dict: s.dict, duration: s.duration, loop: s.loop, actors: s.actors,
    events: s.events.map((e) => ({ name: e.name, t: e.t, phase: +(e.t / s.duration).toFixed(4), actor: e.actor })),
    meta: s.meta, playback: s.playback,
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
  scenes: scenes.map((s) => ({ key: s.key, dict: s.dict, duration: s.duration, sceneMetrics: s.sceneMetrics })),
  blends, readback, problems,
};
fs.writeFileSync(path.join(BUILD, 'report.json'), JSON.stringify(report, null, 1));
if (!only) {
  const { writeLabData } = await import('./labdata.mjs');
  writeLabData({ skeletons, scenes, exportClips, sampledByKey, report, dicts, streamDir: OUT_STREAM });
}

log(`\n${dicts.size} dictionaries, ${exportClips.length} clips, ${scenes.length} scenes, ${problems.length} problem(s)`);
for (const [d, r] of Object.entries(readback)) log(`  ${d}.ycd  ${r.bytes} bytes  ${r.clips} clips (read back OK)`);
if (problems.length) process.exit(1);
