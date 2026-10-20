// "Beheben" actions for the traffic-light findings (checks.mjs). Each fix is a pure function
// doc -> new doc; `sampled` (current solve) gives positions where a fix needs them.

import { clampRot } from './joints.mjs';
import { BODY } from './skeleton.mjs';
import { qrot, qconj, vsub, yawOf, qnorm, DEG, clamp } from './math.mjs';

const copy = (x) => JSON.parse(JSON.stringify(x));
const T3 = (t) => +(+t).toFixed(3);

function mergeRanges(list) {
  const s = list.map((r) => r.slice()).sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const r of s) {
    if (out.length && r[0] <= out[out.length - 1][1] + 1e-6) out[out.length - 1][1] = Math.max(out[out.length - 1][1], r[1]);
    else out.push(r);
  }
  return out;
}

// Insert or replace a key at time t in a key list (keys are matched within 1 ms).
export function upsertKey(keys, key) {
  const i = keys.findIndex((k) => Math.abs(k.t - key.t) < 1e-3);
  if (i >= 0) keys[i] = { ...keys[i], ...key };
  else { keys.push(key); keys.sort((a, b) => a.t - b.t); }
  return keys;
}

// Body-space position + body yaw (deg) of a bone in frame f of a sampled actor.
function bodyPose(sampled, actor, bone, f) {
  const skel = sampled.skeletons[actor];
  const s = sampled.frames[actor][Math.max(0, Math.min(sampled.frames[actor].length - 1, f))];
  const i = skel.idx(bone);
  const qi = qconj(s.mover.q);
  const p = qrot(qi, vsub(s.world.P[i], s.mover.p));
  const yaw = yawOf(qnorm(s.D[i])) / DEG;
  return { p, yaw, skel };
}

// Linear value of root keys at t (enough to place helper keys without changing the motion much).
function rootAt(keys, t) {
  const ks = keys.slice().sort((a, b) => a.t - b.t);
  if (!ks.length) return { p: [0, 0, 0], rot: [0, 0, 0] };
  let a = ks[0], b = ks[0];
  if (t >= ks[ks.length - 1].t) a = b = ks[ks.length - 1];
  else for (let i = 1; i < ks.length; i++) if (t <= ks[i].t) { a = ks[i - 1]; b = ks[i]; break; }
  const u = b.t > a.t ? clamp((t - a.t) / (b.t - a.t), 0, 1) : 0;
  const pa = a.p || [0, 0, 0], pb = b.p || pa, ra = a.rot || [0, 0, 0], rb = b.rot || ra;
  return { p: pa.map((x, i) => x + (pb[i] - x) * u), rot: ra.map((x, i) => x + (rb[i] - x) * u) };
}

// Per-frame depth (m) of the lowest foot point below the ground (same points as the metrics).
function groundDepths(sampled, actor) {
  const skel = sampled.skeletons[actor];
  const feet = ['L', 'R'].map((sd) => ({ a: skel.idx(BODY.side[sd].foot), t: skel.has(BODY.side[sd].toe) ? skel.idx(BODY.side[sd].toe) : -1 }));
  return sampled.frames[actor].map((s) => {
    const gz = skel.groundZ + s.mover.p[2];
    let d = 0;
    for (const ft of feet) {
      d = Math.max(d, -(s.world.P[ft.a][2] - (gz + 0.085)));
      if (ft.t >= 0) d = Math.max(d, -(s.world.P[ft.t][2] - (gz + 0.025)));
    }
    return d;
  });
}

export function applyFix(doc, fix, { sampled } = {}) {
  const d = copy(doc);
  const tr = fix.actor ? (d.tracks[fix.actor] ||= {}) : null;
  switch (fix.kind) {
    case 'lockFeet': {
      tr.feet ||= {}; tr.feet.lock ||= {};
      const r = [clamp(T3(fix.range[0]), 0, d.duration), clamp(T3(fix.range[1]), 0, d.duration)];
      if (r[1] - r[0] < 0.05) r[1] = Math.min(d.duration, r[0] + 0.1);
      tr.feet.lock[fix.side] = mergeRanges([...(tr.feet.lock[fix.side] || []), r]);
      return d;
    }
    case 'snapGround': {
      const h = 'foot' + fix.side;
      const skel = sampled?.skeletons?.[fix.actor];
      const groundAnkle = (skel ? skel.groundZ : -0.993) + 0.085;
      if (tr.ik?.[h]?.length) {
        for (const k of tr.ik[h]) if ((k.space || 'body') === 'body' && k.target[2] < groundAnkle) k.target[2] = +groundAnkle.toFixed(4);
        return d;
      }
      // FK legs: lift the pelvis exactly where the feet are in the ground. Existing root keys inside
      // the penetration are raised by the depth at their time; the deepest frame gets a key too.
      const pen = sampled ? groundDepths(sampled, fix.actor) : [];
      tr.root ||= [];
      const at = (t) => rootAt(tr.root, t);
      const fr = (t) => Math.max(0, Math.min(pen.length - 1, Math.round(t * 30)));
      const lift = 0.004;
      if (!pen.length) {
        const t = clamp(fix.t ?? 0, 0, d.duration), cur = at(t);
        upsertKey(tr.root, { t: T3(t), p: [cur.p[0], cur.p[1], +(cur.p[2] + (fix.depth || 0) + lift).toFixed(4)], rot: cur.rot });
        return d;
      }
      let peak = 0;
      for (let f = 1; f < pen.length; f++) if (pen[f] > pen[peak]) peak = f;
      const inside = pen.map((x) => x > 0.002);
      if (!tr.root.length) {
        let a = peak, b = peak;
        while (a > 0 && inside[a - 1]) a--;
        while (b < pen.length - 1 && inside[b + 1]) b++;
        const ta = Math.max(0, a - 3) / 30, tb = Math.min(pen.length - 1, b + 3) / 30;
        for (const t of [ta, tb]) upsertKey(tr.root, { t: T3(t), p: [0, 0, 0], rot: [0, 0, 0] });
      }
      const before = tr.root.map((k) => ({ ...k, p: (k.p || [0, 0, 0]).slice() }));
      const peakT = peak / 30;
      const peakVal = rootAt(before, peakT);
      for (const k of tr.root) {
        const dz = pen[fr(k.t)];
        if (dz > 0.001) k.p = [(k.p || [0, 0, 0])[0], (k.p || [0, 0, 0])[1], +((k.p || [0, 0, 0])[2] + dz + lift).toFixed(4)];
      }
      if (!tr.root.some((k) => Math.abs(k.t - peakT) < 0.05)) upsertKey(tr.root, { t: T3(peakT), p: [peakVal.p[0], peakVal.p[1], +(peakVal.p[2] + pen[peak] + lift).toFixed(4)], rot: peakVal.rot });
      return d;
    }
    case 'clampJoints': {
      const skel = sampled?.skeletons?.[fix.actor];
      if (!skel) return d;
      for (const [b, keys] of Object.entries(tr.bones || {})) {
        if (fix.bone && fix.bone !== b && fix.all !== true) continue;
        if (!skel.has(b)) continue;
        for (const k of keys) k.rot = clampRot(skel, b, k.rot).rot.map((x) => +x.toFixed(2));
      }
      return d;
    }
    case 'easeSmooth': {
      const near = (k) => Math.abs(k.t - fix.t) <= 0.35;
      const visit = (keys) => { for (const k of keys || []) if (near(k)) k.ease = 'smooth'; };
      visit(tr.mover); visit(tr.root); visit(tr.look);
      for (const ks of Object.values(tr.bones || {})) visit(ks);
      for (const ks of Object.values(tr.ik || {})) visit(ks);
      for (const ks of Object.values(tr.fingers || {})) visit(ks);
      return d;
    }
    case 'separate': {
      // Push the actor away from the other along the line between the pelvises at time t.
      const other = Object.keys(d.actors).find((a) => a !== fix.actor);
      let dir = [0, 1, 0];
      if (sampled && other) {
        const f = Math.round((fix.t || 0) * 30);
        const pa = sampled.frames[fix.actor][f].world.P[sampled.skeletons[fix.actor].idx(BODY.pelvis)];
        const pb = sampled.frames[other][f].world.P[sampled.skeletons[other].idx(BODY.pelvis)];
        const v = [pa[0] - pb[0], pa[1] - pb[1], 0];
        const l = Math.hypot(v[0], v[1]);
        if (l > 1e-4) dir = [v[0] / l, v[1] / l, 0];
      }
      const dist = fix.dist || 0.02;
      tr.mover ||= [{ t: 0, p: [0, 0, 0], yaw: 0 }];
      for (const k of tr.mover) { const p = k.p || [0, 0, 0]; k.p = [+(p[0] + dir[0] * dist).toFixed(4), +(p[1] + dir[1] * dist).toFixed(4), p[2]]; }
      return d;
    }
    case 'stick': {
      if (d.contacts?.[fix.index]) d.contacts[fix.index].stick = true;
      return d;
    }
    case 'closeLoop': {
      // The resolver closes loops itself; keys at the very end that differ from t = 0 break the seam.
      const drop = (keys) => (keys && keys.length > 1 ? keys.filter((k) => k.t < d.duration - 1e-3) : keys);
      const moverToo = (d.loopMover || 'closed') === 'closed';
      if (moverToo) tr.mover = drop(tr.mover);
      tr.root = drop(tr.root); tr.look = drop(tr.look);
      for (const k of Object.keys(tr.bones || {})) tr.bones[k] = drop(tr.bones[k]);
      for (const k of Object.keys(tr.ik || {})) tr.ik[k] = drop(tr.ik[k]);
      for (const k of Object.keys(tr.fingers || {})) tr.fingers[k] = drop(tr.fingers[k]);
      d.loop = true;
      return d;
    }
    default:
      return d;
  }
}

export { bodyPose };
