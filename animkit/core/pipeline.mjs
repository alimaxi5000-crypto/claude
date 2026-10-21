// Export pipeline shared by every build (zombie clip sources, studio documents):
//   solved frames -> (optional) origin rebase -> tracks -> ycd.xml -> binary .ycd (ycdtool,
//   CodeWalker.Core) -> independent read-back + track and world-pose comparison -> Lua registry.
// Every function reports problems as plain strings; callers decide how to fail.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { animatedBoneNames } from './skeleton.mjs';
import { solFromLocals } from './scene.mjs';
import { dictionaryXml, continuous } from './ycdxml.mjs';
import { parseYcd } from './ycdreader.mjs';
import { qangle, qaxis, qmul, qnorm, qrot, qconj, yawOf, vadd, vsub, DEG } from './math.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const YCDTOOL = path.resolve(HERE, '..', 'converter', 'ycdtool', 'out', 'ycdtool.dll');

// Read-back tolerances (float32 + 16-bit quantisation stays far below these).
export const READBACK = { rotDeg: 0.05, posM: 0.0005, worldM: 0.002 };

export const NAME_RE = /^[a-z0-9_]+$/;

// Bones (rotation tracks) and root translation exported for a clip. only: optional list of
// 'BONE' / 'BONE:rot' / 'BONE:pos' entries (SKEL_ROOT:pos = root translation).
export function exportSelection(skel, only) {
  const all = animatedBoneNames(skel);
  if (!only) return { rot: all, rootPos: true };
  const rot = [], set = new Set();
  let rootPos = false;
  for (const e of only) {
    const [b, kind] = e.split(':');
    if (kind === 'pos') { if (b === 'SKEL_ROOT') rootPos = true; continue; }
    if (skel.has(b) && !set.has(b)) { rot.push(b); set.add(b); }
    if (b === 'SKEL_ROOT' && kind !== 'rot') rootPos = true;
  }
  return { rot, rootPos };
}

// Paired scenes: every actor starts at its own origin. The clip's mover becomes constant identity
// and the whole motion relative to the actor's frame-0 mover lives in SKEL_ROOT; the frame-0
// mover (position + yaw in the scene frame) is returned as the actor's origin, and the client
// starts each actor in its own synced scene at sceneFrame * origin. Reason (in-game tests): GTA
// puts a synced-scene ped at the scene origin and ignores the clip's initial mover offset.
// World poses are unchanged: world = S * M(t) * root(t) = (S * M(0)) * (M(0)^-1 * M(t) * root(t)).
export function rebaseToOrigin(skel, frames) {
  const problems = [];
  const rootI = skel.bones.findIndex((b) => b.parent === null || b.parent < 0);
  const m0 = frames[0].mover;
  const upv = qrot(m0.q, [0, 0, 1]);
  if (Math.hypot(upv[0], upv[1], upv[2] - 1) > 1e-6) problems.push('frame-0 mover is not a pure yaw (origin needs x, y, z, yaw)');
  const qi = qconj(m0.q);
  const out = frames.map((s) => {
    const local = s.local.slice();
    local[rootI] = qnorm(qmul(qi, qmul(s.mover.q, s.local[rootI])));
    const rootT = qrot(qi, vsub(vadd(s.mover.p, qrot(s.mover.q, s.rootT)), m0.p));
    return { ...s, local, rootT, mover: { p: [0, 0, 0], q: [0, 0, 0, 1] } };
  });
  const r = (x, n = 4) => +x.toFixed(n);
  const origin = { x: r(m0.p[0]), y: r(m0.p[1]), z: r(m0.p[2]), yaw: r(yawOf(m0.q) / DEG, 3) };
  return { frames: out, origin, problems };
}

// Track list of one clip: rotation tracks (1), root translation (0) and mover (5/6).
export function clipTracks(skel, frames, { only = null, noMover = false } = {}) {
  const tag = (name) => skel.bones[skel.idx(name)].tag;
  const sel = exportSelection(skel, only);
  const tracks = [];
  for (const b of sel.rot) tracks.push({ boneId: tag(b), track: 1, bone: b, series: continuous(frames.map((s) => s.local[skel.idx(b)])) });
  if (sel.rootPos) tracks.push({ boneId: 0, track: 0, bone: 'SKEL_ROOT', series: frames.map((s) => s.rootT) });
  if (!noMover) {
    tracks.push({ boneId: 0, track: 5, bone: 'mover', series: frames.map((s) => s.mover.p) });
    tracks.push({ boneId: 0, track: 6, bone: 'mover', series: continuous(frames.map((s) => s.mover.q)) });
  }
  return tracks;
}

// Group clips by dictionary and write <dict>.ycd.xml files. Returns { dicts: Map, problems }.
export function writeDictionaries(xmlDir, clips, { clean = true } = {}) {
  const problems = [];
  const dicts = new Map();
  for (const c of clips) {
    if (!dicts.has(c.dict)) dicts.set(c.dict, []);
    dicts.get(c.dict).push(c);
  }
  fs.mkdirSync(xmlDir, { recursive: true });
  if (clean) for (const f of fs.readdirSync(xmlDir)) if (f.endsWith('.ycd.xml')) fs.unlinkSync(path.join(xmlDir, f));
  for (const [dict, list] of dicts) {
    if (!NAME_RE.test(dict)) { problems.push(`dictionary name '${dict}' must be lowercase [a-z0-9_]`); continue; }
    try { fs.writeFileSync(path.join(xmlDir, `${dict}.ycd.xml`), dictionaryXml(dict, list)); } catch (e) { problems.push(`${dict}: ${e.message}`); }
  }
  return { dicts, problems };
}

// ycdtool availability (built by animkit/setup.sh).
export function ycdtoolStatus() {
  if (!fs.existsSync(YCDTOOL)) return { ok: false, reason: `ycdtool not built (${YCDTOOL}); run animkit/setup.sh` };
  return { ok: true, path: YCDTOOL };
}

// Converts every *.ycd.xml in xmlDir into outDir/<dict>.ycd. Returns { ok, output, error }.
export function convertDirectory(xmlDir, outDir, { timeoutMs = 120000 } = {}) {
  const st = ycdtoolStatus();
  if (!st.ok) return { ok: false, error: st.reason };
  fs.mkdirSync(outDir, { recursive: true });
  const r = spawnSync('dotnet', [YCDTOOL, 'batch', xmlDir, outDir], { encoding: 'utf8', timeout: timeoutMs, windowsHide: true });
  if (r.error) return { ok: false, error: `ycdtool could not run: ${r.error.message}` };
  if (r.status !== 0) return { ok: false, error: `ycdtool failed: ${(r.stderr || r.stdout || '').trim()}` };
  return { ok: true, output: r.stdout.trim() };
}

// Independent read-back of one written dictionary against the source clips. Each clip needs
// { name, frames, duration, tracks, origin?, skel?, solved? }. Fills clip.readback and returns
// { info, problems }.
export function readBackDictionary(file, clips, dict = path.basename(file, '.ycd')) {
  const problems = [];
  const fail = (m) => problems.push(m);
  if (!fs.existsSync(file)) { fail(`${dict}.ycd missing`); return { info: null, problems }; }
  const bytes = fs.readFileSync(file);
  let parsed;
  try { parsed = parseYcd(bytes, (u8) => zlib.inflateRawSync(u8)); } catch (e) { fail(`${dict}.ycd: reader error: ${e.message}`); return { info: null, problems }; }
  for (const e of parsed.errors) fail(`${dict}.ycd: ${e}`);
  const info = { bytes: bytes.length, clips: parsed.clips.length, sysSize: parsed.header.sysSize };
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
    // World-space read-back: the decoded tracks placed at the exported origin must give the
    // solved source pose (proves the origin rebase changes nothing in the world).
    let maxWorld = 0;
    if (c.origin && c.skel && c.solved) {
      maxWorld = worldDeviation(c.skel, a, c.frames, c.origin, c.solved);
      if (maxWorld > READBACK.worldM) fail(`${dict}/${c.name}: world pose at origin differs from the source by ${(maxWorld * 1000).toFixed(2)} mm`);
    }
    c.readback = { maxRotDeg: maxRot, maxPosM: maxPos, maxWorldM: c.origin ? maxWorld : undefined };
    if (maxRot > READBACK.rotDeg) fail(`${dict}/${c.name}: rotation read-back error ${maxRot.toFixed(4)} deg`);
    if (maxPos > READBACK.posM) fail(`${dict}/${c.name}: position read-back error ${(maxPos * 1000).toFixed(3)} mm`);
  }
  return { info, problems };
}

// Largest bone distance (m) between decoded animation `a` played at `origin` and solved frames.
export function worldDeviation(skel, a, nFrames, origin, solved) {
  const byTag = new Map(skel.bones.map((b, i) => [b.tag, i]));
  const oq = qaxis([0, 0, 1], origin.yaw * DEG), op = [origin.x, origin.y, origin.z];
  let maxWorld = 0;
  for (let f = 0; f < nFrames; f++) {
    const local = [];
    let rootT = null, mp = [0, 0, 0], mq = [0, 0, 0, 1];
    for (const t of a.tracks) {
      const v = t.values[f];
      if (t.track === 1 && byTag.has(t.boneId)) local[byTag.get(t.boneId)] = v;
      else if (t.track === 0 && t.boneId === 0) rootT = v;
      else if (t.track === 5) mp = v;
      else if (t.track === 6) mq = v;
    }
    const sol = solFromLocals(skel, local, rootT, { p: vadd(op, qrot(oq, mp)), q: qnorm(qmul(oq, mq)) });
    const ref = solved[f].world.P;
    for (let i = 0; i < ref.length; i++) maxWorld = Math.max(maxWorld, Math.hypot(sol.world.P[i][0] - ref[i][0], sol.world.P[i][1] - ref[i][1], sol.world.P[i][2] - ref[i][2]));
  }
  return maxWorld;
}

// ------------------------------------------------------------------ Lua serialisation
export const luaStr = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '\\r').replace(/\n/g, '\\n')}'`;
const luaNum = (n) => (Number.isInteger(n) ? String(n) : (+n.toFixed(4)).toString());
export function luaVal(v, ind = '') {
  if (v === null || v === undefined) return 'nil';
  if (typeof v === 'number') return Number.isFinite(v) ? luaNum(v) : '0';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'string') return luaStr(v);
  if (Array.isArray(v)) return `{ ${v.map((x) => luaVal(x, ind)).join(', ')} }`;
  const keys = Object.keys(v).sort();
  if (!keys.length) return '{}';
  const inner = keys.map((k) => `${ind}    ${/^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : `[${luaStr(k)}]`} = ${luaVal(v[k], ind + '    ')},`).join('\n');
  return `{\n${inner}\n${ind}}`;
}
