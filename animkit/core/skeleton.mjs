// Skeleton model: rest pose, hierarchy and anatomical calibration.
//
// Skeleton JSON format (see docs/ANIMATION_PIPELINE.md):
// {
//   "id": "placeholder_male", "model": "mp_m_freemode_01",
//   "source": "placeholder" | "gta-xml",
//   "bones": [ { "name": "SKEL_ROOT", "tag": 0, "parent": null, "t": [x,y,z], "r": [x,y,z,w] }, ... ],
//   "calib": { "groundZ": -0.98, "hinges": { "SKEL_R_UpperArm": [hx,hy,hz] (bone-local hinge axis) } }
// }
// "t"/"r" are the LOCAL rest translation/rotation relative to the parent bone, exactly as
// stored in the GTA skeleton. Nothing here assumes particular local axis conventions:
// all posing happens in model space and is converted back to local rotations at the end.

import {
  qmul, qconj, qrot, qnorm, vadd, vsub, vnorm, vcross, vlen, vdot, vreject, vscale, qid, vperp,
} from './math.mjs';

// Logical body parts used by the rig. Missing optional bones are tolerated.
export const BODY = {
  root: 'SKEL_ROOT',
  pelvis: 'SKEL_Pelvis',
  spineRoot: 'SKEL_Spine_Root',
  spine: ['SKEL_Spine0', 'SKEL_Spine1', 'SKEL_Spine2', 'SKEL_Spine3'],
  neck: 'SKEL_Neck_1',
  head: 'SKEL_Head',
  side: {
    L: {
      clav: 'SKEL_L_Clavicle', upper: 'SKEL_L_UpperArm', lower: 'SKEL_L_Forearm', hand: 'SKEL_L_Hand',
      thigh: 'SKEL_L_Thigh', calf: 'SKEL_L_Calf', foot: 'SKEL_L_Foot', toe: 'SKEL_L_Toe0',
      fingers: [
        ['SKEL_L_Finger00', 'SKEL_L_Finger01', 'SKEL_L_Finger02'],
        ['SKEL_L_Finger10', 'SKEL_L_Finger11', 'SKEL_L_Finger12'],
        ['SKEL_L_Finger20', 'SKEL_L_Finger21', 'SKEL_L_Finger22'],
        ['SKEL_L_Finger30', 'SKEL_L_Finger31', 'SKEL_L_Finger32'],
        ['SKEL_L_Finger40', 'SKEL_L_Finger41', 'SKEL_L_Finger42'],
      ],
    },
    R: {
      clav: 'SKEL_R_Clavicle', upper: 'SKEL_R_UpperArm', lower: 'SKEL_R_Forearm', hand: 'SKEL_R_Hand',
      thigh: 'SKEL_R_Thigh', calf: 'SKEL_R_Calf', foot: 'SKEL_R_Foot', toe: 'SKEL_R_Toe0',
      fingers: [
        ['SKEL_R_Finger00', 'SKEL_R_Finger01', 'SKEL_R_Finger02'],
        ['SKEL_R_Finger10', 'SKEL_R_Finger11', 'SKEL_R_Finger12'],
        ['SKEL_R_Finger20', 'SKEL_R_Finger21', 'SKEL_R_Finger22'],
        ['SKEL_R_Finger30', 'SKEL_R_Finger31', 'SKEL_R_Finger32'],
        ['SKEL_R_Finger40', 'SKEL_R_Finger41', 'SKEL_R_Finger42'],
      ],
    },
  },
};

// Bones the exporter writes rotation tracks for (when present in the skeleton).
// Roll bones (RB_*), helpers (MH_*, PH_*, IK_*) and facial bones are left to the game's
// expressions and are deliberately not animated.
export function animatedBoneNames(skel) {
  const names = [BODY.root, BODY.pelvis, BODY.spineRoot, ...BODY.spine, BODY.neck, 'SKEL_Neck_2', BODY.head];
  for (const s of ['L', 'R']) {
    const S = BODY.side[s];
    names.push(S.clav, S.upper, S.lower, S.hand, S.thigh, S.calf, S.foot, S.toe, ...S.fingers.flat());
  }
  return names.filter((n) => skel.has(n));
}

export class Skeleton {
  constructor(json) {
    this.id = json.id || 'unnamed';
    this.model = json.model || '';
    this.source = json.source || 'unknown';
    this.calib = json.calib || {};
    this.bones = json.bones.map((b, i) => ({
      index: i,
      name: b.name,
      tag: b.tag,
      parentName: b.parent ?? null,
      t: b.t.slice(),
      r: qnorm(b.r),
    }));
    this.byName = new Map(this.bones.map((b) => [b.name, b]));
    this.byTag = new Map(this.bones.map((b) => [b.tag, b]));
    for (const b of this.bones) {
      b.parent = b.parentName == null ? -1 : (typeof b.parentName === 'number' ? b.parentName : this.byName.get(b.parentName)?.index ?? -1);
      if (b.parentName != null && b.parent < 0) throw new Error(`skeleton ${this.id}: parent '${b.parentName}' of ${b.name} not found`);
    }
    // Topological order (parents before children).
    this.order = [];
    const seen = new Set();
    const visit = (b) => {
      if (seen.has(b.index)) return;
      if (b.parent >= 0) visit(this.bones[b.parent]);
      seen.add(b.index);
      this.order.push(b.index);
    };
    this.bones.forEach(visit);
    this.children = this.bones.map(() => []);
    for (const b of this.bones) if (b.parent >= 0) this.children[b.parent].push(b.index);
    // Rest model-space transforms.
    this.restP = new Array(this.bones.length);
    this.restQ = new Array(this.bones.length);
    for (const i of this.order) {
      const b = this.bones[i];
      if (b.parent < 0) {
        this.restP[i] = b.t.slice();
        this.restQ[i] = b.r.slice();
      } else {
        this.restP[i] = vadd(this.restP[b.parent], qrot(this.restQ[b.parent], b.t));
        this.restQ[i] = qnorm(qmul(this.restQ[b.parent], b.r));
      }
    }
    this.groundZ = this.calib.groundZ ?? this._inferGroundZ();
    this.limbs = {};
    for (const s of ['L', 'R']) {
      const S = BODY.side[s];
      this.limbs['arm' + s] = this._limb(s, S.upper, S.lower, S.hand, 'arm');
      this.limbs['leg' + s] = this._limb(s, S.thigh, S.calf, S.foot, 'leg');
      this.limbs['hand' + s] = this._handFrame(s);
    }
  }

  has(name) { return this.byName.has(name); }
  idx(name) {
    const b = this.byName.get(name);
    if (!b) throw new Error(`skeleton ${this.id}: bone '${name}' missing`);
    return b.index;
  }
  restPos(name) { return this.restP[this.idx(name)]; }
  restRot(name) { return this.restQ[this.idx(name)]; }
  // Rest-pose length between a bone and one of its descendants.
  len(a, b) { return vlen(vsub(this.restPos(b), this.restPos(a))); }
  height() {
    return this.restPos(BODY.head)[2] + 0.12 - this.groundZ;
  }

  _inferGroundZ() {
    let z = Infinity;
    for (const n of ['SKEL_L_Toe0', 'SKEL_R_Toe0', 'SKEL_L_Foot', 'SKEL_R_Foot']) {
      if (this.has(n)) z = Math.min(z, this.restPos(n)[2] - (n.includes('Toe') ? 0.025 : 0.085));
    }
    return Number.isFinite(z) ? z : -1.0;
  }

  // Two-bone limb with its rest hinge axis in model space.
  _limb(side, upper, lower, end, kind) {
    if (!this.has(upper) || !this.has(lower) || !this.has(end)) return null;
    const pU = this.restPos(upper), pL = this.restPos(lower), pE = this.restPos(end);
    const dirU = vnorm(vsub(pL, pU));
    const dirL = vnorm(vsub(pE, pL));
    const l1 = vlen(vsub(pL, pU));
    const l2 = vlen(vsub(pE, pL));
    // Hinge axis: 1) explicit calibration (bone-local axis), 2) rest pose bend, 3) anatomical default.
    let hinge = null;
    const cal = this.calib.hinges?.[upper];
    if (cal) hinge = vnorm(qrot(this.restRot(upper), cal));
    if (!hinge) {
      const c = vcross(dirU, dirL);
      if (vlen(c) > Math.sin(3 * Math.PI / 180)) hinge = vnorm(c);
    }
    if (!hinge) {
      // Anatomical default: elbows point backwards (-Y), knees point forwards (+Y).
      // hinge = cross(jointPointDir, limbDir) matches the IK solver convention.
      const jointDir = kind === 'arm' ? [0, -1, 0] : [0, 1, 0];
      hinge = vnorm(vcross(jointDir, dirU));
      if (vlen(hinge) < 1e-6) hinge = vperp(dirU);
    }
    // Make hinge orthogonal to both rest segment directions as well as possible.
    const hingeU = vnorm(vreject(hinge, dirU));
    const hingeL = vnorm(vreject(hinge, dirL));
    return { side, kind, upper, lower, end, l1, l2, dirU, dirL, hingeU, hingeL };
  }

  // Anatomical hand frame from rest geometry (finger bases and wrist).
  _handFrame(side) {
    const S = BODY.side[side];
    if (!this.has(S.hand)) return null;
    const wrist = this.restPos(S.hand);
    const fingerBase = (k) => (this.has(S.fingers[k][0]) ? this.restPos(S.fingers[k][0]) : null);
    const idx = fingerBase(1), mid = fingerBase(2), pinky = fingerBase(4);
    const fwd = mid ? vnorm(vsub(mid, wrist)) : this.limbs['arm' + side]?.dirL ?? [side === 'L' ? -1 : 1, 0, 0];
    let across = idx && pinky ? vnorm(vsub(idx, pinky)) : vperp(fwd);
    across = vnorm(vreject(across, fwd));
    // Back-of-hand normal; mirror sign so it points out of the back of the hand on both sides.
    const sign = side === 'R' ? 1 : -1;
    const back = vscale(vnorm(vcross(fwd, across)), sign);
    const palm = vscale(back, -1);
    // Wrist axes: flexion bends fingers towards the palm.
    const flexAxis = vnorm(vcross(fwd, palm));
    return { side, fwd, across, back, palm, flexAxis, wrist };
  }

  // Curl axis for a finger bone (rotates the finger towards the palm).
  fingerAxis(side, boneName) {
    const hf = this.limbs['hand' + side];
    const i = this.idx(boneName);
    const kids = this.children[i];
    const tip = kids.length ? this.restP[kids[0]] : vadd(this.restP[i], vsub(this.restP[i], this.restP[this.bones[i].parent]));
    const dir = vnorm(vsub(tip, this.restP[i]));
    let axis = vcross(dir, hf.palm);
    if (vlen(axis) < 1e-6) axis = hf.flexAxis;
    return vnorm(axis);
  }

  toJSON() {
    return {
      id: this.id, model: this.model, source: this.source, calib: this.calib,
      bones: this.bones.map((b) => ({ name: b.name, tag: b.tag, parent: b.parentName, t: b.t, r: b.r })),
    };
  }
}

// Local rotations from posed model rotations (parent-relative, as stored in GTA clips).
export function localsFromModel(skel, modelQ) {
  const out = new Array(skel.bones.length);
  for (const i of skel.order) {
    const p = skel.bones[i].parent;
    out[i] = p < 0 ? modelQ[i].slice() : qnorm(qmul(qconj(modelQ[p]), modelQ[i]));
  }
  return out;
}

// Forward kinematics from local rotations (+ optional root translation override).
export function fk(skel, localQ, rootT = null) {
  const P = new Array(skel.bones.length);
  const Q = new Array(skel.bones.length);
  for (const i of skel.order) {
    const b = skel.bones[i];
    const lq = localQ[i] ?? b.r;
    if (b.parent < 0) {
      P[i] = (rootT ?? b.t).slice();
      Q[i] = lq.slice();
    } else {
      P[i] = vadd(P[b.parent], qrot(Q[b.parent], b.t));
      Q[i] = qnorm(qmul(Q[b.parent], lq));
    }
  }
  return { P, Q };
}

export { qid, vdot };
