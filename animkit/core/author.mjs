// Authoring helpers for procedural clips: keyframe tracks, loop-safe noise, impulses,
// follow-through (lag) and small vector utilities. Every helper returns a pure function of
// time so a clip can be re-sampled at any rate and stays deterministic.

import { Ease, makeNoise, makeLoopNoise, clamp, lerp } from './math.mjs';

const isArr = Array.isArray;
const mix = (a, b, t) => (isArr(a) ? a.map((v, i) => v + (b[i] - v) * t) : a + (b - a) * t);
const addv = (a, b) => (isArr(a) ? a.map((v, i) => v + b[i]) : a + b);
const subv = (a, b) => (isArr(a) ? a.map((v, i) => v - b[i]) : a - b);
const mulv = (a, s) => (isArr(a) ? a.map((v) => v * s) : a * s);

// Pose-to-pose keyframes. keys: [[time, value, easeName?], ...]; the ease of a key shapes the
// segment arriving at it (default 'inOut'). Values may be numbers or arrays.
export function K(keys) {
  const ks = keys.map(([t, v, e]) => ({ t, v, e: Ease[e || 'inOut'] || Ease.inOut })).sort((a, b) => a.t - b.t);
  return (t) => {
    if (t <= ks[0].t) return ks[0].v;
    for (let i = 1; i < ks.length; i++) {
      if (t <= ks[i].t) {
        const a = ks[i - 1], b = ks[i];
        const u = (t - a.t) / Math.max(1e-9, b.t - a.t);
        return mix(a.v, b.v, b.e(u));
      }
    }
    return ks[ks.length - 1].v;
  };
}

// Smooth keyframes (Catmull-Rom through all keys). Optionally periodic with the given period:
// then the first key must be at t=0 and the curve wraps seamlessly.
export function KC(keys, period = null) {
  const ks = keys.map(([t, v]) => ({ t, v })).sort((a, b) => a.t - b.t);
  const n = ks.length;
  const get = (i) => {
    if (period == null) return ks[clamp(i, 0, n - 1)];
    const k = ((i % n) + n) % n;
    const wraps = Math.floor(i / n);
    return { t: ks[k].t + wraps * period, v: ks[k].v };
  };
  return (t) => {
    let tt = t;
    if (period != null) tt = ((t % period) + period) % period;
    if (period == null && tt <= ks[0].t) return ks[0].v;
    if (period == null && tt >= ks[n - 1].t) return ks[n - 1].v;
    let i = 0;
    while (i < n - 1 && tt > ks[i + 1].t) i++;
    if (period != null && tt > ks[n - 1].t) i = n - 1;
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const u = (tt - p1.t) / Math.max(1e-9, p2.t - p1.t);
    // Non-uniform Catmull-Rom tangents (finite differences in time).
    const m1 = mulv(subv(p2.v, p0.v), (p2.t - p1.t) / Math.max(1e-9, p2.t - p0.t));
    const m2 = mulv(subv(p3.v, p1.v), (p2.t - p1.t) / Math.max(1e-9, p3.t - p1.t));
    const u2 = u * u, u3 = u2 * u;
    const h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
    return addv(addv(mulv(p1.v, h00), mulv(m1, h10)), addv(mulv(p2.v, h01), mulv(m2, h11)));
  };
}

// Constant value as a track.
export const C = (v) => () => v;

// Smooth non-repeating noise in [-amp, amp].
export function wobble(seed, freq, amp) {
  const n = makeNoise(seed);
  return (t) => n(t * freq + seed * 0.37) * amp;
}
// Seamless noise for loops of the given period.
export function loopWobble(seed, period, cycles, amp) {
  const n = makeLoopNoise(seed, cycles);
  return (t) => n(t / period) * amp * 1.6;
}

// Damped oscillation after time t0 (impacts, recoil, flesh jiggle).
export function impulse(t0, amp, freq = 6, decay = 7) {
  return (t) => {
    if (t < t0) return 0;
    const u = t - t0;
    return amp * Math.exp(-decay * u) * Math.sin(2 * Math.PI * freq * u);
  };
}
// Smooth bump from t0 to t1 (sin^2 window), peak amp at the middle.
export function bump(t0, t1, amp) {
  return (t) => (t <= t0 || t >= t1 ? 0 : amp * Math.sin(Math.PI * (t - t0) / (t1 - t0)) ** 2);
}
// Follow-through: the same track evaluated with a delay.
export const lag = (track, delay) => (t) => track(Math.max(0, t - delay));
// Sum of tracks (numbers or arrays).
export const sum = (...tracks) => (t) => tracks.reduce((acc, f) => (acc === null ? f(t) : addv(acc, f(t))), null);
// Scale track output.
export const scale = (track, s) => (t) => mulv(track(t), typeof s === 'function' ? s(t) : s);
// Blend between two tracks with a weight track.
export const blend = (a, b, w) => (t) => mix(a(t), b(t), clamp(typeof w === 'function' ? w(t) : w, 0, 1));
// Periodic sine helper for loops: phase offset in cycles.
export const sine = (period, amp, phase = 0, harmonic = 1) => (t) => amp * Math.sin(2 * Math.PI * (t / period * harmonic + phase));
// Window weight rising over [a0,a1] and falling over [b0,b1].
export function window(a0, a1, b0 = Infinity, b1 = Infinity) {
  return (t) => {
    if (t < a0 || t > b1) return 0;
    if (t < a1) return Ease.inOut((t - a0) / Math.max(1e-9, a1 - a0));
    if (t <= b0) return 1;
    return 1 - Ease.inOut((t - b0) / Math.max(1e-9, b1 - b0));
  };
}

export const V = { mix, add: addv, sub: subv, mul: mulv };
export { Ease, lerp, clamp };
