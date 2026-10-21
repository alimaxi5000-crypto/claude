// Authoring kit shared by all clip sources: scene-space helpers, foot planting with heel/toe
// roll, procedural gait cycles, contact grips and the zombie/victim posture vocabulary.
// Scene frame: +X right, +Y forward, +Z up (GTA). Heights relative to the entity origin
// (~1 m above ground); the ground plane is skeleton.groundZ.

import { K, KC, Ease } from '../../tools/animcore/author.mjs';
import { DEG, clamp, lerp, smooth, vnorm, vadd, vsub, vscale, vcross } from '../../tools/animcore/math.mjs';

export { K, KC, Ease, DEG, clamp, lerp, smooth };

export const GROUND = -0.993;    // reference skeleton ground (both genders, see skelio femaleFromMale)
export const ANKLE_H = 0.085;    // ankle joint height above the ground
export const TOE_FWD = 0.153;    // ankle -> toe joint (ball of the foot), horizontal
export const TAU = Math.PI * 2;

export function rot2(x, y, yaw) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  return [x * c - y * s, x * s + y * c];
}
// Body-frame point of an actor (mover {p, yaw}) -> scene.
export function toScene(mover, p) {
  const [x, y] = rot2(p[0], p[1], mover.yaw || 0);
  return [mover.p[0] + x, mover.p[1] + y, mover.p[2] + p[2]];
}
// Scene direction -> rotated by yaw.
export function dirYaw(d, yaw) {
  const [x, y] = rot2(d[0], d[1], yaw);
  return [x, y, d[2]];
}

// ---------------------------------------------------------------- feet
// Ankle position for a foot rotated by (yaw, pitch) that rests on a pivot point. Mirrors the
// rig's exact pivot (Rig._solveLeg) with reference foot geometry so swing paths start and end
// exactly where the rig's toe-off / heel-strike poses are.
const TOE_VEC = [0, 0.153, -0.05];   // ankle -> toe joint (rest, foot frame)
const HEEL_VEC = [0, -0.05, -0.085]; // ankle -> heel contact point
export function ankleFromPivot(kind, px, py, yaw, pitch) {
  const v = kind === 'toe' ? TOE_VEC : HEEL_VEC;
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const y1 = v[1] * cp - v[2] * sp, z1 = v[1] * sp + v[2] * cp;  // rotation about the lateral axis
  const [ox, oy] = rot2(v[0], y1, yaw);
  const pz = GROUND + (kind === 'toe' ? ANKLE_H + TOE_VEC[2] : 0);
  return [px - ox, py - oy, pz - z1];
}

// A foot plant: { t0, t1, x, y, yaw } = the foot rests flat at (x, y) with heading yaw (scene)
// from t0 to t1. Between plants the foot swings on an arc. Heel strike / toe-off roll is added
// around the plant boundaries. Optional pivot turn while planted: { turnTo, ts, te } rotates the
// foot to heading turnTo between ts and te on the ball of the foot (heel slightly raised).
// Planted phases and swings are emitted as anchor pivots / swing specs that the rig resolves
// with each skeleton's real foot geometry. Returns a function t -> leg spec for the rig.
export function plantedFoot(plants, opts = {}) {
  const lift = opts.lift ?? 0.09;
  const roll = opts.roll ?? 1.0;              // 0 = no heel/toe roll
  const HEEL = 14 * DEG * roll, PUSH = 30 * DEG * roll;
  const HEEL_T = 0.12, PUSH_T = 0.14;
  const ps = plants.slice().sort((a, b) => a.t0 - b.t0);
  const yawEnd = (p) => (p.turnTo ?? p.yaw ?? 0);
  return (t) => {
    // First plant that has not ended yet; before its start we are swinging towards it.
    let j = 0;
    while (j < ps.length - 1 && t > ps[j].t1) j++;
    const swinging = j > 0 && t < ps[j].t0;
    const i = swinging ? j - 1 : j;
    const a = ps[i];
    const yawA = a.yaw ?? 0;
    const turned = a.turnTo != null;
    if (!swinging) {
      // Planted: flat, with heel strike after arriving and toe-off before leaving.
      const sinceStrike = t - a.t0;
      const untilLift = a.t1 - t;
      const ground = [a.x, a.y, GROUND + ANKLE_H];
      if (roll && i > 0 && sinceStrike >= 0 && sinceStrike < HEEL_T) {
        const pitch = HEEL * (1 - Ease.out(sinceStrike / HEEL_T));
        return { target: ground, foot: { yaw: yawA, pitch }, toe: 0, pivot: { kind: 'heel', ax: a.x, ay: a.y } };
      }
      if (roll && i < ps.length - 1 && untilLift >= 0 && untilLift < PUSH_T) {
        const u = 1 - untilLift / PUSH_T;
        const pitch = -PUSH * Ease.in(u);
        return { target: ground, foot: { yaw: yawEnd(a), pitch }, toe: PUSH * Ease.in(u), pivot: { kind: 'toe', ax: a.x, ay: a.y, ayaw: yawA } };
      }
      if (turned) {
        const u = clamp((t - a.ts) / Math.max(1e-6, a.te - a.ts), 0, 1);
        const yaw = lerp(yawA, a.turnTo, Ease.inOut(u));
        const pitch = -(a.heelUp ?? 12) * DEG * Math.sin(Math.PI * u);
        return { target: ground, foot: { yaw, pitch }, toe: -pitch, pivot: { kind: 'toe', ax: a.x, ay: a.y, ayaw: yawA } };
      }
      return { target: ground, foot: { yaw: yawA, pitch: 0 }, toe: 0 };
    }
    // Swing from the toe-off pose of plant a to the heel-strike pose of plant b.
    const b = ps[i + 1];
    const yawB = b.yaw ?? 0;
    const yawA1 = yawEnd(a);
    const [fx, fy] = rot2(0, 1, yawA);
    const [gx, gy] = rot2(0, 1, yawB);
    const u = clamp((t - a.t1) / Math.max(1e-6, b.t0 - a.t1), 0, 1);
    // Approximate (reference foot) path; the rig recomputes it exactly from `swing`.
    const toeX = a.x + fx * TOE_FWD, toeY = a.y + fy * TOE_FWD;
    const A0 = roll ? ankleFromPivot('toe', toeX, toeY, yawA1, -PUSH) : [a.x, a.y, GROUND + ANKLE_H];
    const A1 = roll ? ankleFromPivot('heel', b.x - gx * 0.05, b.y - gy * 0.05, yawB, HEEL) : [b.x, b.y, GROUND + ANKLE_H];
    const hor = Ease.inOut(clamp((u - 0.12) / 0.74, 0, 1));
    const yaw = lerp(yawA1, yawB, hor);
    const zBase = lerp(A0[2], A1[2], smooth(u));
    const h = Math.sin(Math.PI * u) * lift * (opts.liftCurve ? opts.liftCurve(u) : 1);
    const pitch = -PUSH * (1 - Ease.out(clamp(u / 0.45, 0, 1))) + HEEL * Ease.in(clamp((u - 0.55) / 0.45, 0, 1));
    const toe = PUSH * (1 - Ease.out(clamp(u * 3, 0, 1)));
    const swing = roll ? { a: { x: a.x, y: a.y, foot: { yaw: yawA1 }, ayaw: yawA, pitch: -PUSH }, b: { x: b.x, y: b.y, foot: { yaw: yawB }, pitch: HEEL }, h: hor, v: smooth(u), lift: h } : undefined;
    return { target: [lerp(A0[0], A1[0], hor), lerp(A0[1], A1[1], hor), zBase + h], foot: { yaw, pitch }, toe, swing };
  };
}

// ---------------------------------------------------------------- gait
// Periodic gait in body frame + mover. Returns t -> { mover, leg: {L,R}, root, phase }.
// cfg: period (s/cycle), stride (m/cycle), stance (fraction), width (half distance between
// feet), lift, bob, sway, twist, toeOut (deg), legs: { L: {...overrides}, R: {...} }, drag
export function gait(cfg) {
  const T = cfg.period, v = cfg.stride / T;
  const legs = {};
  for (const s of ['L', 'R']) {
    const o = { ...cfg, ...(cfg.legs?.[s] || {}) };
    const sx = s === 'R' ? 1 : -1;
    const offset = (o.phaseOffset ?? (s === 'L' ? 0 : 0.5));
    const stance = o.stance;
    const a = cfg.stride * stance / 2;              // half stance travel in body frame
    const HEEL = (o.heel ?? 14) * DEG, PUSH = (o.pushOff ?? 30) * DEG;
    const yaw = -(o.toeOut ?? 6) * DEG * sx;        // body-frame foot heading (toes out)
    const [fx, fy] = rot2(0, 1, yaw);
    const x = sx * (o.width ?? 0.11);
    legs[s] = (t) => {
      // Plant k starts at world time tk = (k - offset) * T at world y = v * tk + a. The swing
      // travels in WORLD space from the toe-off pose of plant k to the heel strike of plant
      // k+1, so planted feet never slide and lift-off / touchdown are continuous.
      const cyc = t / T + offset;
      const k = Math.floor(cyc);
      const ph = cyc - k;
      const tk = (k - offset) * T;
      const plantY = v * tk + a + (o.yShift ?? 0);
      const shift = -v * t;                         // world -> body (mover moves along +Y)
      const out = { foot: { yawRel: yaw + 6 * DEG * sx, pitch: 0 }, toe: 0, space: 'body', stance: ph < stance, ph };
      if (ph < stance) {
        const u = ph / stance;
        out.target = [x, plantY + shift, GROUND + ANKLE_H];
        if (u < 0.15) {
          out.foot.pitch = HEEL * (1 - Ease.out(u / 0.15));
          out.pivot = { kind: 'heel', ax: x, ay: plantY + shift };
        } else if (u > 0.82) {
          const w = (u - 0.82) / 0.18;
          out.foot.pitch = -PUSH * Ease.in(w);
          out.toe = PUSH * Ease.in(w);
          out.pivot = { kind: 'toe', ax: x, ay: plantY + shift };
        }
        return out;
      }
      const u = (ph - stance) / (1 - stance);
      const nextY = plantY + cfg.stride;
      const A0 = ankleFromPivot('toe', x + fx * TOE_FWD, plantY + fy * TOE_FWD, yaw, -PUSH);
      const A1 = ankleFromPivot('heel', x - fx * 0.05, nextY - fy * 0.05, yaw, HEEL);
      // Horizontal travel starts once the foot is off the ground and ends before touchdown.
      const hor = Ease.inOut(clamp((u - 0.15) / 0.7, 0, 1));
      const h = Math.sin(Math.PI * u) ** (o.liftPow ?? 1) * (o.lift ?? 0.1);
      out.target = [lerp(A0[0], A1[0], hor), lerp(A0[1], A1[1], hor) + shift, lerp(A0[2], A1[2], smooth(u)) + h];
      const fr = { yawRel: out.foot.yawRel };
      out.swing = { a: { x, y: plantY + shift, foot: fr, pitch: -PUSH }, b: { x, y: nextY + shift, foot: fr, pitch: HEEL }, h: hor, v: smooth(u), lift: h };
      out.foot.pitch = -PUSH * (1 - Ease.out(clamp(u / 0.45, 0, 1))) + HEEL * Ease.in(clamp((u - 0.55) / 0.45, 0, 1))
        - (o.dragToe ? o.dragToe * DEG * Math.sin(Math.PI * u) : 0);
      out.toe = PUSH * (1 - Ease.out(clamp(u * 3, 0, 1)));
      return out;
    };
  }
  return (t) => {
    const ph = ((t / T) % 1 + 1) % 1;
    const w = TAU * ph;
    return {
      ph, v,
      mover: { p: [0, v * t, 0], yaw: 0 },
      leg: { L: legs.L(t), R: legs.R(t) },
      // Pelvis: two bobs per cycle, sway towards the stance leg, twist with the swing leg.
      bob: -(cfg.bob ?? 0.02) * Math.cos(2 * w - (cfg.bobPhase ?? 0)),
      sway: (cfg.sway ?? 0.02) * Math.sin(w + (cfg.swayPhase ?? 0)),
      twist: (cfg.twist ?? 5 * DEG) * Math.sin(w),
      drop: (cfg.drop ?? 3 * DEG) * Math.sin(w),
    };
  };
}

// ---------------------------------------------------------------- hands
// Wrist target + palm orientation for a hand resting on a contact point. fingerDir: where the
// fingers point, palmDir: direction the palm faces (towards the surface).
export function grip(contact, fingerDir, palmDir, { palmCenter = 0.075, thickness = 0.022, weight = 1 } = {}) {
  const f = vnorm(fingerDir), n = vnorm(palmDir);
  const target = vsub(vsub(contact, vscale(f, palmCenter)), vscale(n, thickness));
  return { target, palm: { fingerDir: f, palmDir: n, weight } };
}

// ---------------------------------------------------------------- posture vocabulary
// Zombie base posture (hunched, head pushed forward, shoulders rolled in).
export function zombieSpine(intensity = 1, extra = {}) {
  return {
    spine: { bend: 0.22 * intensity + (extra.bend || 0), side: extra.side || 0, twist: extra.twist || 0 },
    neck: { bend: -0.10 * intensity + (extra.neckBend || 0), twist: extra.neckTwist || 0, side: extra.neckSide || 0 },
    head: { bend: 0.05 + (extra.headBend || 0), twist: extra.headTwist || 0, side: extra.headSide || 0 },
    clav: { L: { up: 0.12 + (extra.shrug || 0), fwd: 0.18 }, R: { up: 0.12 + (extra.shrug || 0), fwd: 0.18 } },
  };
}
export const CLAW = { curl: [0.35, 0.25, 0.3, 0.35, 0.4], claw: 0.55, spread: 0.8 };
export const LIMP = { curl: [0.3, 0.45, 0.5, 0.55, 0.6], spread: 0.15 };
export const FLAT = { curl: [0.15, 0.08, 0.06, 0.08, 0.1], spread: 0.55 };
export const GRAB = { curl: [0.55, 0.62, 0.66, 0.7, 0.72], claw: 0.25, spread: 0.35 };
export const FIST = { curl: [0.7, 1.0, 1.0, 1.0, 1.0], thumbOpp: 0.4 };

// Merge pose fragments (later wins per top-level key; nested objects merged one level deep).
export function merge(...parts) {
  const out = {};
  for (const p of parts) {
    if (!p) continue;
    for (const [k, v] of Object.entries(p)) {
      if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) out[k] = { ...out[k], ...v };
      else out[k] = v;
    }
  }
  return out;
}

// Add body-control deltas ({bend, side, twist}).
export function addRot(...rs) {
  const o = { bend: 0, side: 0, twist: 0 };
  for (const r of rs) if (r) { o.bend += r.bend || 0; o.side += r.side || 0; o.twist += r.twist || 0; }
  return o;
}

export { vnorm, vadd, vsub, vscale, vcross };

// ---------------------------------------------------------------- pose blending
// Blend two pose specs continuously for every w in [0, 1]:
//   numbers/arrays lerp; a control present on one side only blends towards its neutral value
//   (0, palm/look weight 0, reach 0.995); arm targets in different spaces become weighted
//   `terms` that the rig sums after resolving each space (no popping at any weight).
const NEUTRAL = { reach: 0.995 };
const KEEP = new Set(['pole', 'poleSpace', 'fk']);     // no neutral value: keep the defined one
export function mixPose(a, b, w) {
  if (!a || w >= 1) return b;
  if (!b || w <= 0) return a;
  return mixVal(a, b, w, '');
}
function termsOf(spec) {
  let terms;
  if (spec.terms) terms = spec.terms.map((t) => ({ ...t }));
  else terms = [{ target: spec.target, space: spec.space || 'scene', w: 1 }];
  if (spec.blend && (spec.blend.w ?? 0) > 0) {
    const bw = Math.min(1, spec.blend.w);
    for (const t of terms) t.w *= 1 - bw;
    terms.push({ target: spec.blend.target, space: spec.blend.space || 'scene', w: bw });
  }
  return terms;
}
function mergeTerms(ta, tb, w) {
  const by = new Map();
  for (const [list, k] of [[ta, 1 - w], [tb, w]]) {
    for (const t of list) {
      const wt = t.w * k;
      if (wt <= 0) continue;
      const e = by.get(t.space);
      if (!e) by.set(t.space, { space: t.space, w: wt, sum: [t.target[0] * wt, t.target[1] * wt, t.target[2] * wt] });
      else { e.w += wt; for (let i = 0; i < 3; i++) e.sum[i] += t.target[i] * wt; }
    }
  }
  return [...by.values()].map((e) => ({ space: e.space, w: e.w, target: e.sum.map((v) => v / e.w) }));
}
function neutralOf(key, v) {
  if (key in NEUTRAL) return NEUTRAL[key];
  if (typeof v === 'number') return 0;
  if (Array.isArray(v)) return v.map((x) => neutralOf('', x));
  if (key === 'palm' || key === 'look') return { ...v, weight: 0 };
  if (v && typeof v === 'object') return {};
  return v;
}
function mixVal(a, b, w, key) {
  if (a === undefined && b === undefined) return undefined;
  if (a === undefined || b === undefined) {
    const v = a === undefined ? b : a;
    if (KEEP.has(key) || typeof v === 'string' || typeof v === 'boolean') return v;
    return a === undefined ? mixVal(neutralOf(key, b), b, w, key) : mixVal(a, neutralOf(key, a), w, key);
  }
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * w;
  if (key === 'curl' && (Array.isArray(a) || Array.isArray(b))) {
    const A = Array.isArray(a) ? a : [a, a, a, a, a], B = Array.isArray(b) ? b : [b, b, b, b, b];
    return A.map((v, i) => v + (B[i] - v) * w);
  }
  if (Array.isArray(a) && Array.isArray(b)) return a.map((v, i) => mixVal(v, b[i], w, ''));
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (key === 'palm' || key === 'look') { a = { weight: 1, ...a }; b = { weight: 1, ...b }; }
    const out = {};
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (k === 'target' || k === 'space' || k === 'blend' || k === 'terms') continue;
      if (key === 'look' && k === 'target') continue;
      out[k] = mixVal(a[k], b[k], w, k);
    }
    if ('target' in a || 'target' in b || a.terms || b.terms) {
      if (key === 'look' || !('target' in a && 'target' in b)) {
        // look targets / one-sided targets: lerp when both exist, else keep the defined one
        const ta = a.target, tb = b.target;
        out.target = ta && tb ? mixVal(ta, tb, w, '') : (ta || tb);
        if (a.space || b.space) out.space = (ta ? a.space : b.space);
      } else {
        const terms = mergeTerms(termsOf(a), termsOf(b), w);
        const main = terms.reduce((m, t) => (t.w > m.w ? t : m), terms[0]);
        out.target = main.target; out.space = main.space;
        if (terms.length > 1) out.terms = terms;
      }
    }
    return out;
  }
  return w < 0.5 ? a : b;
}
