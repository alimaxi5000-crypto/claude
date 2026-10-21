// Joint bases and limits for direct bone rotations (studio rotation rings, clip documents).
//
// A bone rotation in a clip document is `rot: [a, b, c]` in degrees: the components of a rotation
// vector in the bone's JOINT BASIS (three unit axes in the rest model frame). The rig applies it
// as an extra rotation after the parent (D = Dparent * extra), so the same values mean the same
// motion on every skeleton.
//   centre bones (spine, neck, head, pelvis, root): model axes  X = nod (+ = back), Y = roll, Z = turn (+ = left)
//   arms/legs (upper arm, thigh, clavicle, foot, toe): model axes
//   elbow / knee: (hinge, bone direction, third)      hinge + = bend
//   hand: (flex axis, finger direction, back normal)  flex + = towards the palm
//   finger: (curl axis, finger direction, third)      curl + = towards the palm
// Left-side bases are the mirror images (as rotation axes) of the right side, so mirroring a pose
// is a plain swap of the values between L and R bones; centre bones negate b and c.

import { vnorm, vcross, vsub, vscale, vdot, qfromRotvec, qtoRotvec, qrot, DEG, clamp } from './math.mjs';
import { BODY } from './skeleton.mjs';

const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
const MIRROR = (a) => [a[0], -a[1], -a[2]];      // mirror of a rotation axis across the YZ plane

// Limits in degrees per basis component [min, max] for RIGHT-side and centre bones.
const LIMITS = {
  SKEL_ROOT: null,
  SKEL_Pelvis: [[-30, 30], [-30, 30], [-40, 40]],
  SKEL_Spine_Root: [[-25, 35], [-20, 20], [-25, 25]],
  SKEL_Spine0: [[-25, 35], [-20, 20], [-25, 25]],
  SKEL_Spine1: [[-25, 35], [-20, 20], [-25, 25]],
  SKEL_Spine2: [[-25, 35], [-20, 20], [-25, 25]],
  SKEL_Spine3: [[-25, 35], [-20, 20], [-25, 25]],
  SKEL_Neck_1: [[-45, 45], [-30, 30], [-45, 45]],
  SKEL_Neck_2: [[-30, 30], [-20, 20], [-30, 30]],
  SKEL_Head: [[-45, 45], [-35, 35], [-60, 60]],
  clav: [[-15, 15], [-20, 20], [-25, 25]],
  upper: [[-120, 120], [-110, 110], [-110, 110]],
  lower: [[-5, 150], [-85, 85], [-8, 8]],
  hand: [[-80, 80], [-60, 60], [-35, 35]],
  thigh: [[-35, 125], [-50, 25], [-45, 45]],
  calf: [[-3, 150], [-20, 20], [-5, 5]],
  foot: [[-50, 50], [-30, 30], [-35, 35]],
  toe: [[-60, 40], [-5, 5], [-5, 5]],
  finger: [[-20, 110], [-15, 15], [-25, 25]],
  thumb: [[-30, 90], [-40, 40], [-40, 40]],
};
export const AXIS_LABELS = {
  centre: ['Nicken', 'Kippen', 'Drehen'],
  limb: ['Heben vor/zurück', 'Kippen', 'Drehen'],
  hinge: ['Beugen', 'Verdrehen', 'Seitlich'],
  hand: ['Beugen', 'Verdrehen', 'Abknicken'],
  finger: ['Krümmen', 'Verdrehen', 'Spreizen'],
};

export function sideOf(name) {
  const m = /^SKEL_([LR])_/.exec(name);
  return m ? m[1] : null;
}
export function mirrorName(name) {
  const s = sideOf(name);
  if (!s) return name;
  return name.replace(`SKEL_${s}_`, `SKEL_${s === 'L' ? 'R' : 'L'}_`);
}

function kindOf(name) {
  if (/Finger0\d$/.test(name)) return 'thumb';
  if (/Finger\d\d$/.test(name)) return 'finger';
  const m = /^SKEL_[LR]_(\w+)$/.exec(name);
  if (!m) return 'centre';
  return { Clavicle: 'clav', UpperArm: 'upper', Forearm: 'lower', Hand: 'hand', Thigh: 'thigh', Calf: 'calf', Foot: 'foot', Toe0: 'toe' }[m[1]] || 'centre';
}

// Basis of a RIGHT-side or centre bone from the skeleton's rest geometry.
function rightBasis(skel, name) {
  const kind = kindOf(name);
  if (kind === 'lower' || kind === 'calf') {
    const limb = skel.limbs[kind === 'lower' ? 'armR' : 'legR'];
    if (limb) {
      const h = limb.hingeL, d = limb.dirL;
      return { kind: 'hinge', axes: [h, d, vnorm(vcross(h, d))] };
    }
  }
  if (kind === 'hand') {
    const hf = skel.limbs.handR;
    if (hf) return { kind: 'hand', axes: [hf.flexAxis, hf.fwd, hf.back] };
  }
  if (kind === 'finger' || kind === 'thumb') {
    if (skel.limbs.handR && skel.has(name)) {
      const c = skel.fingerAxis('R', name);
      const i = skel.idx(name);
      const kids = skel.children[i];
      const tip = kids.length ? skel.restP[kids[0]] : vsub(vscale(skel.restP[i], 2), skel.restP[skel.bones[i].parent]);
      let d = vnorm(vsub(tip, skel.restP[i]));
      d = vnorm(vsub(d, vscale(c, vdot(d, c))));
      return { kind: 'finger', axes: [c, d, vnorm(vcross(c, d))] };
    }
  }
  return { kind: kind === 'centre' ? 'centre' : 'limb', axes: [X, Y, Z] };
}

const cache = new WeakMap();
// { kind, axes: [3 unit vectors, rest model frame], limits: [[min,max] x3] | null, labels }
export function jointBasis(skel, name) {
  let m = cache.get(skel);
  if (!m) { m = new Map(); cache.set(skel, m); }
  if (m.has(name)) return m.get(name);
  const side = sideOf(name);
  const rName = side === 'L' ? mirrorName(name) : name;
  let b = skel.has(rName) ? rightBasis(skel, rName) : rightBasis(skel, name);
  if (side === 'L') b = { kind: b.kind, axes: b.axes.map(MIRROR) };
  const kind = kindOf(name);
  const limits = kind === 'centre' ? (name in LIMITS ? LIMITS[name] : LIMITS.SKEL_Spine2) : LIMITS[kind];
  const out = { ...b, limits: limits || null, labels: AXIS_LABELS[b.kind] || AXIS_LABELS.centre };
  m.set(name, out);
  return out;
}

// Degrees in the joint basis -> extra rotation quaternion (rest model frame).
export function rotToQuat(skel, name, rot) {
  const { axes } = jointBasis(skel, name);
  const r = [0, 0, 0];
  for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) r[j] += axes[k][j] * (rot[k] || 0) * DEG;
  return qfromRotvec(r);
}
// Extra rotation quaternion -> degrees in the joint basis (bases are orthonormal).
export function quatToRot(skel, name, q) {
  const { axes } = jointBasis(skel, name);
  const r = qtoRotvec(q);
  return axes.map((a) => vdot(r, a) / DEG);
}
// Clamp degrees to the joint limits. Returns { rot, clamped }.
export function clampRot(skel, name, rot) {
  const { limits } = jointBasis(skel, name);
  if (!limits) return { rot: rot.slice(), clamped: false };
  let clamped = false;
  const out = rot.map((v, k) => {
    const c = clamp(v, limits[k][0], limits[k][1]);
    if (Math.abs(c - v) > 1e-6) clamped = true;
    return c;
  });
  return { rot: out, clamped };
}
// Worst limit excess (degrees) of a rotation, 0 when inside.
export function limitExcess(skel, name, rot) {
  const { limits } = jointBasis(skel, name);
  if (!limits) return 0;
  let w = 0;
  for (let k = 0; k < 3; k++) w = Math.max(w, limits[k][0] - rot[k], rot[k] - limits[k][1]);
  return Math.max(0, w);
}
// Mirror a rotation of `name` onto mirrorName(name).
export function mirrorRot(name, rot) {
  return sideOf(name) ? rot.slice() : [rot[0], -rot[1], -rot[2]];
}

// Bones the studio lets you rotate directly (when present in the skeleton).
export function editableBones(skel) {
  const names = [BODY.root, BODY.pelvis, BODY.spineRoot, ...BODY.spine, BODY.neck, 'SKEL_Neck_2', BODY.head];
  for (const s of ['L', 'R']) {
    const S = BODY.side[s];
    names.push(S.clav, S.upper, S.lower, S.hand, S.thigh, S.calf, S.foot, S.toe, ...S.fingers.flat());
  }
  return names.filter((n) => skel.has(n));
}

export { qrot };
