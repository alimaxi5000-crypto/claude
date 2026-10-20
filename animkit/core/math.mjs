// Core math for the animation pipeline.
// Conventions (GTA V model space): +X right, +Y forward, +Z up. Units: meters, radians.
// Vectors are [x, y, z]; quaternions are [x, y, z, w] (Hamilton, active rotation,
// column-vector convention: world = parent * local).

export const DEG = Math.PI / 180;
export const EPS = 1e-9;

// ---------------------------------------------------------------- vec3
export const v3 = (x = 0, y = 0, z = 0) => [x, y, z];
export const vadd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const vsub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const vscale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const vdot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const vcross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const vlen = (a) => Math.hypot(a[0], a[1], a[2]);
export const vdist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export function vnorm(a) {
  const l = vlen(a);
  return l > EPS ? [a[0] / l, a[1] / l, a[2] / l] : [0, 0, 0];
}
export const vlerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const vneg = (a) => [-a[0], -a[1], -a[2]];
// Component of a perpendicular to unit vector n.
export const vreject = (a, n) => vsub(a, vscale(n, vdot(a, n)));
export function vangle(a, b) {
  const d = vdot(vnorm(a), vnorm(b));
  return Math.acos(Math.max(-1, Math.min(1, d)));
}
// Any unit vector perpendicular to a (stable).
export function vperp(a) {
  const n = vnorm(a);
  const ref = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  return vnorm(vcross(n, ref));
}

// ---------------------------------------------------------------- quaternion
export const qid = () => [0, 0, 0, 1];
export function qmul(a, b) {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}
export const qconj = (q) => [-q[0], -q[1], -q[2], q[3]];
export function qnorm(q) {
  const l = Math.hypot(q[0], q[1], q[2], q[3]);
  return l > EPS ? [q[0] / l, q[1] / l, q[2] / l, q[3] / l] : [0, 0, 0, 1];
}
export const qdot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
export const qneg = (q) => [-q[0], -q[1], -q[2], -q[3]];
// Inverse of a unit quaternion.
export const qinv = qconj;

export function qaxis(axis, angle) {
  const n = vnorm(axis);
  const s = Math.sin(angle / 2);
  return [n[0] * s, n[1] * s, n[2] * s, Math.cos(angle / 2)];
}
export function qrot(q, v) {
  // v' = q v q*
  const [x, y, z, w] = q;
  const ix = w * v[0] + y * v[2] - z * v[1];
  const iy = w * v[1] + z * v[0] - x * v[2];
  const iz = w * v[2] + x * v[1] - y * v[0];
  const iw = -x * v[0] - y * v[1] - z * v[2];
  return [
    ix * w + iw * -x + iy * -z - iz * -y,
    iy * w + iw * -y + iz * -x - ix * -z,
    iz * w + iw * -z + ix * -y - iy * -x,
  ];
}
// Shortest rotation taking unit direction a onto unit direction b.
export function qfromTo(a, b) {
  const na = vnorm(a);
  const nb = vnorm(b);
  const d = vdot(na, nb);
  if (d > 1 - 1e-9) return qid();
  if (d < -1 + 1e-9) return qaxis(vperp(na), Math.PI);
  const c = vcross(na, nb);
  return qnorm([c[0], c[1], c[2], 1 + d]);
}
// Rotation matrix (columns are the rotated basis vectors) -> quaternion.
export function qfromMat(m) {
  // m[col][row]
  const m00 = m[0][0], m01 = m[1][0], m02 = m[2][0];
  const m10 = m[0][1], m11 = m[1][1], m12 = m[2][1];
  const m20 = m[0][2], m21 = m[1][2], m22 = m[2][2];
  const tr = m00 + m11 + m22;
  let x, y, z, w;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1) * 2;
    w = 0.25 * s; x = (m21 - m12) / s; y = (m02 - m20) / s; z = (m10 - m01) / s;
  } else if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    w = (m21 - m12) / s; x = 0.25 * s; y = (m01 + m10) / s; z = (m02 + m20) / s;
  } else if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    w = (m02 - m20) / s; x = (m01 + m10) / s; y = 0.25 * s; z = (m12 + m21) / s;
  } else {
    const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
    w = (m10 - m01) / s; x = (m02 + m20) / s; y = (m12 + m21) / s; z = 0.25 * s;
  }
  return qnorm([x, y, z, w]);
}
// Orthonormal frame from a primary axis and a secondary hint: returns quaternion whose
// rotated X axis = primary, rotated Y axis = secondary (orthogonalised).
export function qbasis(primary, secondary) {
  const x = vnorm(primary);
  let y = vreject(secondary, x);
  if (vlen(y) < 1e-6) y = vperp(x);
  y = vnorm(y);
  const z = vcross(x, y);
  return qfromMat([x, y, z]);
}
export function qslerp(a, b, t) {
  let bb = b;
  let d = qdot(a, b);
  if (d < 0) { bb = qneg(b); d = -d; }
  if (d > 0.9995) return qnorm([a[0] + (bb[0] - a[0]) * t, a[1] + (bb[1] - a[1]) * t, a[2] + (bb[2] - a[2]) * t, a[3] + (bb[3] - a[3]) * t]);
  const th = Math.acos(d);
  const s = Math.sin(th);
  const wa = Math.sin((1 - t) * th) / s;
  const wb = Math.sin(t * th) / s;
  return [a[0] * wa + bb[0] * wb, a[1] * wa + bb[1] * wb, a[2] * wa + bb[2] * wb, a[3] * wa + bb[3] * wb];
}
// Angle (radians) between two orientations.
export function qangle(a, b) {
  const d = Math.abs(qdot(qnorm(a), qnorm(b)));
  return 2 * Math.acos(Math.min(1, d));
}
// Euler helper in model frame: yaw about Z, pitch about X, roll about Y (applied yaw * pitch * roll).
export function qeuler(pitch = 0, roll = 0, yaw = 0) {
  return qmul(qaxis([0, 0, 1], yaw), qmul(qaxis([1, 0, 0], pitch), qaxis([0, 1, 0], roll)));
}
// Rotation vector (axis * angle) -> quaternion and back.
export function qfromRotvec(r) {
  const a = vlen(r);
  return a < EPS ? qid() : qaxis(r, a);
}
export function qtoRotvec(q) {
  let qq = qnorm(q);
  if (qq[3] < 0) qq = qneg(qq);
  const s = Math.sqrt(Math.max(0, 1 - qq[3] * qq[3]));
  const a = 2 * Math.acos(Math.min(1, qq[3]));
  return s < EPS ? [0, 0, 0] : [qq[0] / s * a, qq[1] / s * a, qq[2] / s * a];
}
// Swing-twist decomposition about unit axis: q = swing * twist.
export function qtwist(q, axis) {
  const p = vscale(axis, vdot([q[0], q[1], q[2]], axis));
  const t = qnorm([p[0], p[1], p[2], q[3]]);
  return t;
}
export function yawOf(q) {
  const f = qrot(q, [0, 1, 0]);
  return Math.atan2(-f[0], f[1]);
}

// ---------------------------------------------------------------- transforms
// Rigid transform { p: vec3, q: quat }.
export const tf = (p = [0, 0, 0], q = [0, 0, 0, 1]) => ({ p, q });
export const tmul = (a, b) => ({ p: vadd(a.p, qrot(a.q, b.p)), q: qnorm(qmul(a.q, b.q)) });
export function tinv(a) {
  const qi = qconj(a.q);
  return { p: vneg(qrot(qi, a.p)), q: qi };
}
export const tapply = (a, v) => vadd(a.p, qrot(a.q, v));
// Heading transform (yaw about Z) at position p. Heading 0 faces +Y (GTA convention).
export const theading = (p, headingRad) => ({ p, q: qaxis([0, 0, 1], headingRad) });

// ---------------------------------------------------------------- scalar helpers
export const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
export const remap = (x, a, b) => clamp((x - a) / (b - a), 0, 1);

// Easing library used by keyframe curves. All map [0,1] -> [0,1] except the
// overshoot curves which intentionally exceed 1 before settling.
export const Ease = {
  linear: (t) => t,
  in: (t) => t * t,
  out: (t) => 1 - (1 - t) * (1 - t),
  inOut: smooth,
  in3: (t) => t * t * t,
  out3: (t) => 1 - Math.pow(1 - t, 3),
  inOut3: smoother,
  out5: (t) => 1 - Math.pow(1 - t, 5),
  in5: (t) => Math.pow(t, 5),
  // Snappy strike: slow start, explosive middle, soft stop.
  strike: (t) => (t < 0.35 ? 0.15 * (t / 0.35) ** 2 : 0.15 + 0.85 * (1 - Math.pow(1 - (t - 0.35) / 0.65, 4))),
  // Overshoot and settle (follow-through).
  back: (t) => {
    const c = 1.70158, c3 = c + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  },
  elastic: (t) => (t === 0 || t === 1 ? t : Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
  hold: () => 0,
  step: (t) => (t < 1 ? 0 : 1),
};

// Deterministic smooth 1D noise (value noise with quintic interpolation).
export function makeNoise(seed = 1) {
  const tab = new Float64Array(256);
  let s = seed >>> 0 || 1;
  for (let i = 0; i < 256; i++) {
    s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    tab[i] = (s / 4294967295) * 2 - 1;
  }
  return (x) => {
    const i = Math.floor(x);
    const f = x - i;
    const a = tab[i & 255];
    const b = tab[(i + 1) & 255];
    return a + (b - a) * smoother(f);
  };
}
// Periodic noise for seamless loops: noise sampled on a circle of the given period.
export function makeLoopNoise(seed = 1, cycles = 3) {
  const nA = makeNoise(seed);
  const nB = makeNoise(seed * 7919 + 13);
  return (phase) => {
    const a = phase * Math.PI * 2;
    return 0.5 * (nA(Math.cos(a) * cycles + 50) + nB(Math.sin(a) * cycles + 50));
  };
}
