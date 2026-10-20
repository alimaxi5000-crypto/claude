// Keyframe resolver: jj-anim/1 document -> clip source for scene.mjs (sampleScene), i.e.
// keyframes -> per-frame rig poses -> (Rig/IK solver) -> solved frames. Used by the converter
// and by the studio NUI, so the editor shows exactly what the build exports.
//
// Interpolation is pose to pose: a key's `ease` shapes the segment ARRIVING at that key
// (smooth = ease in/out, fastIn = fast start then slowing down, fastOut = slow start then fast,
// linear, spring = overshoot and settle, step = hold until the key). Before the first key the
// first value holds, after the last key the last value holds. With loop: true every track is
// closed with a virtual key at t = duration that repeats the first key, shaped by the first key's
// ease (the mover only when loopMover is 'closed', the default; 'travel' keeps walking cycles
// moving forward).

import { Ease, DEG, clamp, qaxis, qmul, qnorm, qrot, qconj, vadd, vsub, vlerp, yawOf, smooth } from './math.mjs';
import { rotToQuat } from './joints.mjs';
import { Rig, worldOf } from './rig.mjs';
import { HANDLES, endpoint } from './doc.mjs';
import { skeletonKeyFor } from './models.mjs';
import { sampleScene } from './scene.mjs';

export const EASE_FN = { smooth: Ease.inOut, fastIn: Ease.out, fastOut: Ease.in, linear: Ease.linear, spring: Ease.back, step: Ease.step };
export const BLEND_S = 0.15;      // blend time at the edges of foot locks and stuck contacts

// Finger presets: curl per finger [thumb, index, middle, ring, pinky] 0..1, spread -1..1.
export const FINGER_PRESETS = {
  relaxed: { curl: [0.3, 0.32, 0.38, 0.44, 0.5], spread: 0.15, claw: 0, thumbOpp: 0.1 },
  fist: { curl: [0.7, 1.0, 1.0, 1.0, 1.0], spread: 0, claw: 0, thumbOpp: 0.4 },
  open: { curl: [0.05, 0.02, 0.02, 0.03, 0.05], spread: 0.6, claw: 0, thumbOpp: 0 },
  grab: { curl: [0.55, 0.62, 0.66, 0.7, 0.72], spread: 0.35, claw: 0.25, thumbOpp: 0.3 },
  point: { curl: [0.6, 0.02, 1.0, 1.0, 1.0], spread: 0.1, claw: 0, thumbOpp: 0.35 },
  claw: { curl: [0.35, 0.25, 0.3, 0.35, 0.4], spread: 0.8, claw: 0.55, thumbOpp: 0 },
};
export function fingerVector(key) {
  const p = FINGER_PRESETS[key.preset] || FINGER_PRESETS.relaxed;
  const m = key.curl ?? 1;
  return [...p.curl.map((c) => clamp(c * m, 0, 1.2)), key.spread ?? p.spread, p.claw * Math.min(1, m), p.thumbOpp];
}
const fingerSpec = (v) => ({ curl: v.slice(0, 5), spread: v[5], claw: v[6], thumbOpp: v[7] });

const lerpN = (a, b, u) => a + (b - a) * u;
const lerpA = (a, b, u) => a.map((x, i) => x + (b[i] - x) * u);

// Sorted keys of a track, optionally closed for loops. Returns [] for no keys.
function prepare(keys, duration, close) {
  if (!keys || !keys.length) return [];
  const ks = keys.slice().sort((a, b) => a.t - b.t);
  // The loop-back segment (last key -> t = duration) uses the ease of the FIRST key.
  if (close && ks.length && Math.abs(ks[ks.length - 1].t - duration) > 1e-6) ks.push({ ...ks[0], t: duration, ease: ks[0].ease || 'smooth', virtual: true });
  return ks;
}
// Segment lookup: { a, b, u } with eased u (a === b outside the keyed range).
function segment(ks, t) {
  if (t <= ks[0].t) return { a: ks[0], b: ks[0], u: 0 };
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i].t) {
      const a = ks[i - 1], b = ks[i];
      const raw = (t - a.t) / Math.max(1e-9, b.t - a.t);
      return { a, b, u: (EASE_FN[b.ease] || EASE_FN.smooth)(raw) };
    }
  }
  const l = ks[ks.length - 1];
  return { a: l, b: l, u: 0 };
}

// Interpolated key of one track at time t (same rules as the solver): numbers and number arrays
// are blended with the arriving key's ease, other fields come from the nearer key. Returns null
// for an empty track. close: loop-close the track (see prepare).
export function keyAt(keys, t, duration, close = false) {
  const ks = prepare(keys, duration, close);
  if (!ks.length) return null;
  const { a, b, u } = segment(ks, t);
  const out = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (k === 't' || k === 'virtual') continue;
    const va = a[k] ?? b[k], vb = b[k] ?? a[k];
    if (typeof va === 'number' && typeof vb === 'number') out[k] = lerpN(va, vb, u);
    else if (Array.isArray(va) && Array.isArray(vb) && va.length === vb.length && va.every((x) => typeof x === 'number')) out[k] = lerpA(va, vb, u);
    else out[k] = u < 0.5 ? va : vb;
  }
  out.t = t;
  return out;
}

// Resolve every keyframe track of one actor into a function t -> partial rig pose (without
// stuck contacts and foot locks, which need solved positions).
function actorBase(doc, id, skel) {
  const tr = doc.tracks[id] || {};
  const T = doc.duration, loop = !!doc.loop;
  const mover = prepare(tr.mover, T, loop && (doc.loopMover || 'closed') === 'closed');
  const root = prepare(tr.root, T, loop);
  const look = prepare(tr.look, T, loop);
  const bones = Object.entries(tr.bones || {}).filter(([b]) => skel.has(b)).map(([b, k]) => [b, prepare(k, T, loop)]).filter(([, k]) => k.length);
  const ik = Object.fromEntries(Object.entries(tr.ik || {}).map(([h, k]) => [h, prepare(k, T, loop)]).filter(([, k]) => k.length));
  const fingers = Object.fromEntries(Object.entries(tr.fingers || {}).map(([s, k]) => [s, prepare(k, T, loop)]).filter(([, k]) => k.length));
  const groundAnkle = skel.groundZ + 0.085;
  const moverAt = (t) => {
    if (!mover.length) return { p: [0, 0, 0], yaw: 0 };
    const { a, b, u } = segment(mover, t);
    return { p: lerpA(a.p || [0, 0, 0], b.p || a.p || [0, 0, 0], u), yaw: lerpN(a.yaw || 0, b.yaw ?? a.yaw ?? 0, u) * DEG };
  };
  const toScene = (m, p) => { const q = qaxis([0, 0, 1], m.yaw); return vadd(m.p, qrot(q, p)); };
  const toBody = (m, p) => qrot(qaxis([0, 0, 1], -m.yaw), vsub(p, m.p));
  const bodyTarget = (k, m) => ((k.space || 'body') === 'scene' ? toBody(m, k.target) : k.target);
  return {
    moverAt, toScene, toBody, groundAnkle, hasIk: (h) => !!ik[h],
    pose(t) {
      const m = moverAt(t);
      const pose = { mover: { p: m.p, yaw: m.yaw }, bones: {}, arm: {}, leg: {} };
      if (root.length) {
        const { a, b, u } = segment(root, t);
        pose.root = { p: lerpA(a.p || [0, 0, 0], b.p || a.p || [0, 0, 0], u) };
        const ra = a.rot || [0, 0, 0], rb = b.rot || a.rot || [0, 0, 0];
        if (ra.some(Boolean) || rb.some(Boolean)) pose.bones.SKEL_ROOT = rotToQuat(skel, 'SKEL_ROOT', lerpA(ra, rb, u));
      }
      for (const [bone, ks] of bones) {
        const { a, b, u } = segment(ks, t);
        pose.bones[bone] = rotToQuat(skel, bone, lerpA(a.rot, b.rot, u));
      }
      for (const [h, ks] of Object.entries(ik)) {
        const { a, b, u } = segment(ks, t);
        const side = h.endsWith('L') ? 'L' : 'R';
        const w = lerpN(a.weight ?? 1, b.weight ?? 1, u);
        // Targets are resolved in the body (entity) frame, so keys in different spaces blend.
        const spec = { target: lerpA(bodyTarget(a, m), bodyTarget(b, m), u), space: 'body', weight: w };
        const pa = a.pole, pb = b.pole;
        if (pa || pb) spec.pole = pa && pb ? lerpA(pa, pb, u) : (pa || pb);
        if (h.startsWith('hand')) pose.arm[side] = spec;
        else {
          const yaw = (a.yaw != null || b.yaw != null) ? lerpN(a.yaw ?? b.yaw, b.yaw ?? a.yaw, u) : null;
          spec.foot = { pitch: lerpN(a.pitch || 0, b.pitch || 0, u) * DEG, roll: lerpN(a.roll || 0, b.roll || 0, u) * DEG };
          // Foot yaw: body-space keys are relative to the actor's heading; the rig wants scene yaw.
          if (yaw != null) spec.foot.yaw = ((b.space || 'body') === 'scene' ? 0 : m.yaw) + yaw * DEG;
          pose.leg[side] = spec;
        }
      }
      for (const [s, ks] of Object.entries(fingers)) {
        const { a, b, u } = segment(ks, t);
        const spec = fingerSpec(lerpA(fingerVector(a), fingerVector(b), u));
        pose.arm[s] = { ...(pose.arm[s] || {}), fingers: spec };
      }
      if (look.length) {
        const { a, b, u } = segment(look, t);
        const sa = a.space || 'body', sb = b.space || 'body';
        const ta = sa === 'scene' ? a.target : toScene(m, a.target), tb = sb === 'scene' ? b.target : toScene(m, b.target);
        pose.look = { target: lerpA(ta, tb, u), weight: lerpN(a.weight ?? 1, b.weight ?? 1, u) };
      }
      return pose;
    },
  };
}

// Edge weight of a range [t0, t1]: 1 inside, ramps down over BLEND_S after t1 (and up over
// BLEND_S before t0 when rampIn is set).
function rangeWeight(t, r, rampIn) {
  if (t >= r[0] && t <= r[1]) return 1;
  if (t > r[1] && t < r[1] + BLEND_S) return 1 - smooth((t - r[1]) / BLEND_S);
  if (rampIn && t < r[0] && t > r[0] - BLEND_S) return smooth(1 - (r[0] - t) / BLEND_S);
  return 0;
}

// Blend a limb spec towards a body-space target with weight w: towards the limb's own IK target
// when it has IK keys, else from FK (IK weight ramps with w).
function pullLimb(spec, target, w, hasOwnIk) {
  if (w <= 0) return spec;
  if (hasOwnIk && spec && spec.target) return { ...spec, target: lerpA(spec.target, target, w), space: 'body' };
  return { ...(spec || {}), target, space: 'body', weight: w };
}

// Build the scene source. skeletons: { male, female, zombie } (Skeleton). Returns
// { source, skelKeys: {actor: key}, skelExact: {actor: bool} }.
export function documentSource(doc, skeletons) {
  const ids = Object.keys(doc.actors);
  const skelKeys = {}, skelExact = {};
  for (const id of ids) {
    const a = doc.actors[id];
    const r = a.skeleton ? { key: a.skeleton, exact: true } : skeletonKeyFor(a.model);
    skelKeys[id] = r.key; skelExact[id] = r.exact;
  }
  const base = Object.fromEntries(ids.map((id) => [id, actorBase(doc, id, skeletons[skelKeys[id]])]));
  // Foot locks: the ankle stays where it was at the start of the lock (scene space, flat foot).
  const locks = {};
  for (const id of ids) {
    const skel = skeletons[skelKeys[id]];
    const rig = new Rig(skel);
    const tr = doc.tracks[id] || {};
    locks[id] = [];
    for (const side of ['L', 'R']) {
      for (const r of (tr.feet?.lock?.[side] || []).slice().sort((x, y) => x[0] - y[0])) {
        const pose = base[id].pose(r[0]);
        // Earlier locks of the same foot apply to this solve too.
        applyLocks(pose, locks[id].filter((l) => l.side === side), r[0], base[id]);
        const sol = rig.solve(pose);
        const w = worldOf(sol);
        const fi = skel.idx(HANDLES['foot' + side]);
        const ankle = w.P[fi];
        const yaw = yawOf(qnorm(qmul(sol.mover.q, sol.D[fi])));
        locks[id].push({ side, range: r, ankle, yaw });
      }
    }
  }
  const sticks = (doc.contacts || []).filter((c) => c.stick).map((c) => {
    const from = endpoint(c.from), to = endpoint(c.to);
    return { from, to, offset: c.offset || [0, 0, 0], t: c.t };
  });
  const contacts = (doc.contacts || []).map((c) => {
    const from = endpoint(c.from), to = endpoint(c.to);
    return { actor: from.actor, bone: from.bone, from: c.t[0], to: c.t[1], max: c.max ?? 0.03, target: { actor: to.actor, bone: to.bone, offset: c.offset || [0, 0, 0] }, id: c.id };
  });
  const source = {
    name: doc.name, duration: doc.duration, loop: !!doc.loop,
    actors: Object.fromEntries(ids.map((id) => [id, skelKeys[id]])),
    contacts: contacts.length ? contacts : undefined,
    pose(t, ctx) {
      const out = {};
      for (const id of ids) {
        const pose = base[id].pose(t);
        applyLocks(pose, locks[id], t, base[id]);
        for (const s of sticks) {
          if (s.from.actor !== id) continue;
          const w = rangeWeight(t, s.t, true);
          if (w <= 0) continue;
          if (!ctx) continue;
          const target = base[id].toBody(base[id].moverAt(t), ctx.at(s.to.actor, s.to.bone, s.offset));
          const side = s.from.handle.endsWith('L') ? 'L' : 'R';
          const limb = s.from.handle.startsWith('hand') ? 'arm' : 'leg';
          pose[limb][side] = pullLimb(pose[limb][side], target, w, base[id].hasIk(s.from.handle));
        }
        out[id] = pose;
      }
      return out;
    },
  };
  return { source, skelKeys, skelExact };
}

// Resolve + solve a whole document: sampleScene result plus { source, skelKeys, skelExact }.
export function sampleDocument(doc, skeletons) {
  const r = documentSource(doc, skeletons);
  const sampled = sampleScene(r.source, {}, skeletons);
  return Object.assign(sampled, r);
}

function applyLocks(pose, list, t, base) {
  for (const l of list) {
    const w = rangeWeight(t, l.range, false);
    if (w <= 0) continue;
    const prev = pose.leg[l.side];
    const spec = pullLimb(prev, base.toBody(base.moverAt(t), l.ankle), w, base.hasIk('foot' + l.side));
    const fy = prev?.foot?.yaw;
    spec.foot = { ...(prev?.foot || {}), pitch: (prev?.foot?.pitch || 0) * (1 - w), roll: (prev?.foot?.roll || 0) * (1 - w), yaw: fy != null ? fy + angleDelta(fy, l.yaw) * w : l.yaw };
    pose.leg[l.side] = spec;
  }
}
const angleDelta = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));

export { vsub, vlerp, qconj };
