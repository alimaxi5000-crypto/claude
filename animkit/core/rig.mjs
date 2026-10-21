// Pose solver. Turns a high-level pose description (body angles, IK targets, finger curls,
// head aim) into model-space bone transforms for a given Skeleton, and from those into the
// parent-relative local rotations that GTA clips store (track 1).
//
// Key idea: every control is expressed as a rotation in the REST MODEL FRAME or as a target
// position/direction, never in bone-local axes. The resulting clips are therefore independent
// of the (unknown until imported) local axis conventions of the real GTA skeleton.
//
// Direct bone rotations (studio rotation rings): pose.bones = { SKEL_x: quat } is an extra
// rotation in the bone's parent-posed rest model frame, applied after the rig controls
// (D = Dparent * rigDelta * extra). Arm/leg IK specs take an optional weight 0..1 that blends the
// IK chain with the FK chain (weight 1 = IK only, the extra rotations of the chain are ignored).
//
// Angle conventions for body controls ({ bend, side, twist } in radians):
//   bend  > 0 : flex forward (head/torso tilt towards +Y)
//   side  > 0 : lean to the character's right (+X)
//   twist > 0 : turn to the character's left (yaw +Z)

import {
  qmul, qconj, qrot, qnorm, qaxis, qid, qfromTo, qbasis, qslerp, qdot,
  vadd, vsub, vscale, vnorm, vlen, vdot, vcross, vreject, vlerp, clamp, DEG,
} from './math.mjs';
import { BODY, localsFromModel } from './skeleton.mjs';

const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];

export function bodyRot(c) {
  if (!c) return qid();
  const bend = c.bend || 0, side = c.side || 0, twist = c.twist || 0;
  // twist first (outermost), then bend, then side.
  return qnorm(qmul(qaxis(Z, twist), qmul(qaxis(X, -bend), qaxis(Y, side))));
}

// Spine distribution weights (sum 1). Bones missing in a skeleton are skipped and the
// remaining weights renormalised.
const SPINE_W = { SKEL_Spine_Root: 0.08, SKEL_Spine0: 0.2, SKEL_Spine1: 0.26, SKEL_Spine2: 0.26, SKEL_Spine3: 0.2 };
const CHEST_W = { SKEL_Spine2: 0.45, SKEL_Spine3: 0.55 };

function scaleRot(c, w) {
  return c ? { bend: (c.bend || 0) * w, side: (c.side || 0) * w, twist: (c.twist || 0) * w } : null;
}
function addRot(a, b) {
  if (!a) return b; if (!b) return a;
  return { bend: (a.bend || 0) + (b.bend || 0), side: (a.side || 0) + (b.side || 0), twist: (a.twist || 0) + (b.twist || 0) };
}

export class Rig {
  constructor(skel) {
    this.skel = skel;
    const s = skel;
    this.n = s.bones.length;
    const has = (n) => s.has(n);
    let wsum = 0;
    for (const k of Object.keys(SPINE_W)) if (has(k)) wsum += SPINE_W[k];
    this.spineW = new Map(Object.keys(SPINE_W).filter(has).map((k) => [k, SPINE_W[k] / wsum]));
    let csum = 0;
    for (const k of Object.keys(CHEST_W)) if (has(k)) csum += CHEST_W[k];
    this.chestW = new Map(Object.keys(CHEST_W).filter(has).map((k) => [k, CHEST_W[k] / (csum || 1)]));
    // Per-side lookups.
    this.side = {};
    for (const sd of ['L', 'R']) {
      const S = BODY.side[sd];
      const fingers = S.fingers.map((chain) => chain.filter(has).map((n) => ({ name: n, i: s.idx(n), axis: s.fingerAxis(sd, n) })));
      this.side[sd] = {
        S,
        arm: s.limbs['arm' + sd],
        leg: s.limbs['leg' + sd],
        hand: s.limbs['hand' + sd],
        fingers,
        clavI: has(S.clav) ? s.idx(S.clav) : -1,
        upperI: s.idx(S.upper), lowerI: s.idx(S.lower), handI: s.idx(S.hand),
        thighI: s.idx(S.thigh), calfI: s.idx(S.calf), footI: s.idx(S.foot), toeI: has(S.toe) ? s.idx(S.toe) : -1,
      };
    }
    this.rootI = s.idx(BODY.root);
    this.neckI = has(BODY.neck) ? s.idx(BODY.neck) : -1;
    this.headI = s.idx(BODY.head);
    // Role of each bone for fast dispatch.
    this.role = new Array(this.n).fill(null);
    for (const [k] of this.spineW) this.role[s.idx(k)] = 'spine';
    if (has(BODY.pelvis)) this.role[s.idx(BODY.pelvis)] = 'pelvis';
    if (this.neckI >= 0) this.role[this.neckI] = 'neck';
    if (has('SKEL_Neck_2')) this.role[s.idx('SKEL_Neck_2')] = 'neck2';
    this.role[this.headI] = 'head';
    for (const sd of ['L', 'R']) {
      const d = this.side[sd];
      if (d.clavI >= 0) this.role[d.clavI] = 'clav' + sd;
      this.role[d.upperI] = 'upper' + sd;
      this.role[d.lowerI] = 'lower' + sd;
      this.role[d.handI] = 'hand' + sd;
      this.role[d.thighI] = 'thigh' + sd;
      this.role[d.calfI] = 'calf' + sd;
      this.role[d.footI] = 'foot' + sd;
      if (d.toeI >= 0) this.role[d.toeI] = 'toe' + sd;
      d.fingers.forEach((chain, k) => chain.forEach((f, j) => { this.role[f.i] = `finger${sd}${k}${j}`; }));
    }
    // Rest head forward is model +Y (characters face +Y in rest).
  }

  // Solve a pose. Returns { mover, rootT, P, Q, D, local } where P/Q are model-space bone
  // transforms, D the model-space deltas from rest and local the GTA local rotations.
  solve(pose = {}) {
    // Root reach: translate the root so that a point on a bone (e.g. the mouth) moves towards a
    // scene target. Translating the root moves every bone above the legs rigidly, so one extra
    // solve lands it exactly (limbs with scene targets re-solve against the new root).
    if (pose.rootReach && (pose.rootReach.weight ?? 1) > 0) {
      const rr = pose.rootReach;
      const first = this._solve(pose);
      const i = this.skel.idx(rr.bone);
      const qd = qnorm(qmul(first.mover.q, first.D[i]));
      const pt = vadd(vadd(first.mover.p, qrot(first.mover.q, first.P[i])), qrot(qd, rr.offset || [0, 0, 0]));
      let d = vscale(vsub(rr.target, pt), rr.weight ?? 1);
      if (rr.axes) d = [d[0] * rr.axes[0], d[1] * rr.axes[1], d[2] * rr.axes[2]];
      const len = vlen(d), max = rr.max ?? 0.25;
      if (len > max) d = vscale(d, max / len);
      const dBody = qrot(qconj(first.mover.q), d);
      const root = pose.root || {};
      const p0 = root.p || [0, 0, 0];
      const sol = this._solve({ ...pose, root: { ...root, p: vadd(p0, dBody) } });
      sol.reachOffset = d;
      return sol;
    }
    return this._solve(pose);
  }

  _solve(pose) {
    const s = this.skel;
    this.fades = [];
    const P = new Array(this.n), Q = new Array(this.n), D = new Array(this.n);
    const mover = {
      p: pose.mover?.p ? pose.mover.p.slice() : [0, 0, 0],
      q: qaxis(Z, pose.mover?.yaw || 0),
    };
    const moverInv = qconj(mover.q);
    const toBody = (v) => qrot(moverInv, vsub(v, mover.p)); // scene point -> body space
    const dirToBody = (v) => qrot(moverInv, v);

    // Pre-compute per-bone deltas from body controls.
    const spineCtl = pose.spine || null;
    const chestCtl = pose.chest || null;
    let neckCtl = pose.neck || null;
    let headCtl = pose.head || null;

    const solvedLimb = {}; // role -> model delta for IK bones
    const extra = pose.bones || null;
    const ex = (name) => (extra && extra[name]) || null;
    // IK (absolute) vs FK (parent * rig delta * extra) blend for limb bones.
    const blendIk = (fkD, ikD, w) => (w >= 1 ? ikD : w <= 0 ? fkD : qslerp(fkD, ikD, w));

    for (const i of s.order) {
      const b = s.bones[i];
      const role = this.role[i];
      const pD = b.parent >= 0 ? D[b.parent] : qid();
      let delta; // local delta in rest model frame
      if (i === this.rootI) {
        D[i] = bodyRot(pose.root);
        if (ex(b.name)) D[i] = qnorm(qmul(D[i], ex(b.name)));
        const off = pose.root?.p || [0, 0, 0];
        P[i] = vadd(b.t, off);
        Q[i] = qnorm(qmul(D[i], s.restQ[i]));
        continue;
      }
      // Position follows the posed parent.
      P[i] = vadd(P[b.parent], qrot(Q[b.parent], b.t));

      if (role === 'spine') {
        const w = this.spineW.get(b.name) || 0;
        const cw = this.chestW.get(b.name) || 0;
        delta = bodyRot(addRot(scaleRot(spineCtl, w), scaleRot(chestCtl, cw)));
      } else if (role === 'pelvis') {
        delta = bodyRot(pose.pelvis);
      } else if (role === 'neck' || role === 'neck2' || role === 'head') {
        if (role === 'neck' && pose.look && pose.look.target) {
          // Head aim: split between neck and head, evaluated in the chest frame.
          const headPosScene = vadd(mover.p, qrot(mover.q, P[i]));
          const dirScene = vsub(pose.look.target, headPosScene);
          const dirModel = dirToBody(dirScene);
          const local = qrot(qconj(pD), dirModel);
          const rawYaw = Math.atan2(-local[0], local[1]);
          const yaw = clamp(rawYaw, -80 * DEG, 80 * DEG);
          const pitch = clamp(Math.atan2(local[2], Math.hypot(local[0], local[1])), -55 * DEG, 45 * DEG);
          // Targets behind the head flip sides at +-180 deg: fade the aim out before that.
          const w = (pose.look.weight ?? 1) * clamp((165 * DEG - Math.abs(rawYaw)) / (45 * DEG), 0, 1);
          const aim = { bend: -pitch * w, twist: yaw * w, side: 0 };
          neckCtl = addRot(neckCtl, scaleRot(aim, 0.45));
          headCtl = addRot(headCtl, scaleRot(aim, 0.55));
        }
        delta = role === 'head' ? bodyRot(headCtl) : role === 'neck' ? bodyRot(neckCtl) : qid();
      } else if (role && role.startsWith('clav')) {
        const sd = role.slice(4);
        const c = pose.clav?.[sd];
        if (c) {
          const sx = sd === 'R' ? 1 : -1;
          // up: shrug (raise shoulder, rotate about the forward axis); fwd: protraction.
          delta = qmul(qaxis(Y, -sx * (c.up || 0)), qaxis(Z, sx * (c.fwd || 0)));
        } else delta = qid();
      } else if (role && role.startsWith('upper')) {
        const sd = role.slice(5);
        const spec = pose.arm?.[sd];
        if (spec && spec.target && (spec.weight ?? 1) > 0) {
          this._solveArm(sd, spec, P, pD, mover, toBody, dirToBody, solvedLimb);
          const w = solvedLimb['_w' + sd] = spec.weight ?? 1;
          const fk = w < 1 ? this._fkD(pD, spec?.fk ? bodyRot(spec.fk.shoulder) : qid(), ex(b.name)) : null;
          D[i] = blendIk(fk, solvedLimb['upper' + sd], w);
          Q[i] = qnorm(qmul(D[i], s.restQ[i]));
          continue;
        }
        delta = spec?.fk ? bodyRot(spec.fk.shoulder) : qid();
      } else if (role && role.startsWith('lower')) {
        const sd = role.slice(5);
        const spec = pose.arm?.[sd];
        const arm = this.side[sd].arm;
        if (solvedLimb['lower' + sd]) {
          const w = solvedLimb['_w' + sd];
          const fk = w < 1 ? this._fkD(pD, spec?.fk?.elbow ? qaxis(arm.hingeL, spec.fk.elbow) : qid(), ex(b.name)) : null;
          D[i] = blendIk(fk, solvedLimb['lower' + sd], w);
          Q[i] = qnorm(qmul(D[i], s.restQ[i]));
          continue;
        }
        delta = spec?.fk?.elbow ? qaxis(arm.hingeL, spec.fk.elbow) : qid();
      } else if (role && role.startsWith('hand')) {
        const sd = role.slice(4);
        D[i] = this._handDelta(sd, pose.arm?.[sd], pD, mover);
        if (ex(b.name)) D[i] = qnorm(qmul(D[i], ex(b.name)));
        Q[i] = qnorm(qmul(D[i], s.restQ[i]));
        continue;
      } else if (role && role.startsWith('thigh')) {
        const sd = role.slice(5);
        const spec = pose.leg?.[sd];
        if (spec && spec.target && (spec.weight ?? 1) > 0) {
          this._solveLeg(sd, spec, P, pD, mover, toBody, solvedLimb);
          const w = solvedLimb['_lw' + sd] = spec.weight ?? 1;
          const fk = w < 1 ? this._fkD(pD, spec?.fk ? bodyRot(spec.fk.hip) : qid(), ex(b.name)) : null;
          D[i] = blendIk(fk, solvedLimb['thigh' + sd], w);
          Q[i] = qnorm(qmul(D[i], s.restQ[i]));
          continue;
        }
        delta = spec?.fk ? bodyRot(spec.fk.hip) : qid();
      } else if (role && role.startsWith('calf')) {
        const sd = role.slice(4);
        const spec = pose.leg?.[sd];
        if (solvedLimb['calf' + sd]) {
          const w = solvedLimb['_lw' + sd];
          const fk = w < 1 ? this._fkD(pD, spec?.fk?.knee ? qaxis(this.side[sd].leg.hingeL, spec.fk.knee) : qid(), ex(b.name)) : null;
          D[i] = blendIk(fk, solvedLimb['calf' + sd], w);
          Q[i] = qnorm(qmul(D[i], s.restQ[i]));
          continue;
        }
        delta = spec?.fk?.knee ? qaxis(this.side[sd].leg.hingeL, spec.fk.knee) : qid();
      } else if (role && role.startsWith('foot')) {
        const sd = role.slice(4);
        const spec = pose.leg?.[sd];
        if (spec && (spec.target || spec.foot) && (spec.weight ?? 1) > 0) {
          const w = spec.weight ?? 1;
          D[i] = blendIk(w < 1 ? this._fkD(pD, qid(), ex(b.name)) : null, this._footDelta(sd, spec, pD, mover), w);
          Q[i] = qnorm(qmul(D[i], s.restQ[i]));
          continue;
        }
        delta = qid();
      } else if (role && role.startsWith('toe')) {
        const sd = role.slice(3);
        const toe = pose.leg?.[sd]?.toe || 0;
        const ax = vnorm(vcross(this._footFwdRest(sd), Z));
        delta = qaxis(ax, toe);
      } else if (role && role.startsWith('finger')) {
        delta = this._fingerDelta(role, pose.arm?.[role[6]]?.fingers);
      } else {
        delta = qid();
      }
      const e = ex(b.name);
      D[i] = qnorm(qmul(pD, e ? qmul(delta, e) : delta));
      Q[i] = qnorm(qmul(D[i], s.restQ[i]));
    }

    const local = localsFromModel(s, Q);
    return { mover, rootT: P[this.rootI].slice(), P, Q, D, local, fades: this.fades };
  }

  // FK model delta of a bone: parent * rig delta * extra rotation.
  _fkD(pD, delta, extra) {
    return qnorm(qmul(pD, extra ? qmul(delta, extra) : delta));
  }

  _footFwdRest(sd) {
    const d = this.side[sd];
    if (d.toeI < 0) return Y;
    const f = vsub(this.skel.restP[d.toeI], this.skel.restP[d.footI]);
    return vnorm([f[0], f[1], 0]);
  }

  // Two-bone IK for an arm. spec.target is a scene-space point for the WRIST (hand bone origin)
  // unless spec.space === 'body'. spec.pole: direction (body space) the elbow should point to.
  _solveArm(sd, spec, P, pD, mover, toBody, dirToBody, out) {
    const d = this.side[sd];
    const arm = d.arm;
    const S = P[d.upperI];
    // Target spaces: 'scene' (default), 'body' (entity frame), 'shoulder' (offset from the posed
    // shoulder joint, in body axes - independent of the torso posture).
    const resolve = (target, space) => (space === 'body' ? target : space === 'shoulder' ? vadd(S, target) : toBody(target));
    let T;
    if (spec.terms && spec.terms.length) {
      // Weighted sum of targets in mixed spaces (produced by mixPose): continuous under any blend.
      T = [0, 0, 0]; let ws = 0;
      for (const tm of spec.terms) { const r = resolve(tm.target, tm.space); T = vadd(T, [r[0] * tm.w, r[1] * tm.w, r[2] * tm.w]); ws += tm.w; }
      T = [T[0] / ws, T[1] / ws, T[2] / ws];
    } else T = resolve(spec.target, spec.space);
    // Optional cross-fade to a second target (possibly in another space) without popping.
    if (spec.blend && (spec.blend.w ?? 0) > 0) T = vlerp(T, resolve(spec.blend.target, spec.blend.space), Math.min(1, spec.blend.w));
    const sx = sd === 'R' ? 1 : -1;
    const pole = spec.pole ? (spec.poleSpace === 'scene' ? dirToBody(spec.pole) : spec.pole) : [sx * 0.45, -0.75, -0.5];
    const r = this._twoBone(S, T, arm.l1, arm.l2, pole, spec.reach ?? 0.995);
    out['_armE' + sd] = r.E;
    // Upper: map rest (dirU, hingeU) frame onto posed (u, h).
    const Du = qnorm(qmul(qbasis(r.u, r.h), qconj(qbasis(arm.dirU, arm.hingeU))));
    const Dl = qnorm(qmul(qbasis(r.f, r.h), qconj(qbasis(arm.dirL, arm.hingeL))));
    out['upper' + sd] = Du;
    out['lower' + sd] = Dl;
  }

  _solveLeg(sd, spec, P, pD, mover, toBody, out) {
    const d = this.side[sd];
    const leg = d.leg;
    const S = P[d.thighI];
    let T = spec.space === 'body' ? spec.target : toBody(spec.target);
    // Foot geometry of THIS skeleton: ankle -> contact point offset (rest model) and the contact
    // point's height above the ground when the foot is flat.
    const foot = this.skel.restP[d.footI];
    const geo = (kind) => {
      if (kind === 'toe' && d.toeI >= 0) {
        const toe = this.skel.restP[d.toeI];
        return { off: vsub(toe, foot), h: toe[2] - this.skel.groundZ };
      }
      return { off: [0, -0.05, -(foot[2] - this.skel.groundZ)], h: 0 };
    };
    const toB = (x, y) => (spec.space === 'body' ? [x, y, 0] : toBody([x, y, 0]));
    const footD = (f) => this._footDelta(sd, { ...spec, foot: f }, pD, mover);
    // Contact point (ground) of a flat foot whose ankle is at (ax, ay) with heading f.
    const contactFlat = (kind, ax, ay, f) => {
      const g = geo(kind);
      const A = toB(ax, ay); A[2] = foot[2];
      const p = vadd(A, qrot(footD({ ...f, pitch: 0, roll: 0 }), g.off));
      return [p[0], p[1], this.skel.groundZ + g.h];
    };
    const ankleOn = (kind, point, f) => vsub(point, qrot(footD(f), geo(kind).off));
    if (spec.pivot) {
      // Exact heel/toe roll: the ground point stays fixed and the ankle is derived from the foot
      // orientation and the skeleton's real foot geometry. With ax/ay the pivot is given as the
      // flat-planted ankle position, so the contact point itself comes from this skeleton too.
      const pv = spec.pivot;
      let point;
      // ayaw: heading of that flat foot when it differs from the current one (pivot turn).
      if (pv.ax != null) point = contactFlat(pv.kind, pv.ax, pv.ay, pv.ayaw != null ? { yaw: pv.ayaw } : spec.foot || {});
      else { const pt = toB(pv.x, pv.y); point = [pt[0], pt[1], this.skel.groundZ + geo(pv.kind).h]; }
      point[2] += pv.z || 0;
      T = ankleOn(pv.kind, point, spec.foot || {});
    } else if (spec.swing) {
      // Swing between the toe-off pose of plant a and the heel-strike pose of plant b, both
      // derived from this skeleton's geometry (continuous with the pivot phases above).
      const sw = spec.swing;
      const A0 = ankleOn('toe', contactFlat('toe', sw.a.x, sw.a.y, sw.a.ayaw != null ? { yaw: sw.a.ayaw } : sw.a.foot), { ...sw.a.foot, pitch: sw.a.pitch });
      const A1 = ankleOn('heel', contactFlat('heel', sw.b.x, sw.b.y, sw.b.foot), { ...sw.b.foot, pitch: sw.b.pitch });
      T = [A0[0] + (A1[0] - A0[0]) * sw.h, A0[1] + (A1[1] - A0[1]) * sw.h, A0[2] + (A1[2] - A0[2]) * sw.v + (sw.lift || 0)];
    }
    const sx = sd === 'R' ? 1 : -1;
    let pole = spec.pole;
    if (!pole) {
      // Knee follows the foot direction, slightly outwards.
      const fy = spec.foot?.yawBody ?? this._footYawBody(sd, spec, mover);
      pole = [-Math.sin(fy) + sx * 0.12, Math.cos(fy), 0.1];
    }
    const r = this._twoBone(S, T, leg.l1, leg.l2, pole, spec.reach ?? 0.998);
    out['_legE' + sd] = r.E;
    out['thigh' + sd] = qnorm(qmul(qbasis(r.u, r.h), qconj(qbasis(leg.dirU, leg.hingeU))));
    out['calf' + sd] = qnorm(qmul(qbasis(r.f, r.h), qconj(qbasis(leg.dirL, leg.hingeL))));
  }

  _footYawBody(sd, spec, mover) {
    const sx = sd === 'R' ? 1 : -1;
    if (spec.foot?.yaw != null) {
      // Scene-space yaw -> body space.
      const myaw = Math.atan2(-qrot(mover.q, Y)[0], qrot(mover.q, Y)[1]);
      return spec.foot.yaw - myaw;
    }
    return -sx * 6 * DEG + (spec.foot?.yawRel || 0);
  }

  // Foot orientation: planted flat (relative to rest) with a yaw, plus pitch/roll.
  _footDelta(sd, spec, pD, mover) {
    const f = spec.foot || {};
    if (f.inherit) {
      const c = bodyRot({ bend: f.pitch || 0, side: f.roll || 0 });
      return qnorm(qmul(pD, c));
    }
    const yaw = this._footYawBody(sd, spec, mover);
    // Pitch: positive lifts the toes (rotation about the foot's lateral axis).
    const fwd = qrot(qaxis(Z, yaw), this._footFwdRest(sd));
    const lat = vnorm(vcross(fwd, Z));
    let q = qaxis(Z, yaw);
    q = qmul(qaxis(lat, f.pitch || 0), q);
    q = qmul(qaxis(fwd, f.roll || 0), q);
    return qnorm(q);
  }

  // Wrist: relative rotation (flex/dev/twist) in the forearm frame, optionally blended towards
  // an absolute palm/finger direction given in scene space.
  _handDelta(sd, spec, pD, mover) {
    const h = this.side[sd].hand;
    const w = spec?.wrist || {};
    const sx = sd === 'R' ? 1 : -1;
    // Deviation axis = back-of-hand normal; positive dev turns the hand towards the thumb side.
    let rel = qmul(qaxis(h.fwd, (w.twist || 0) * sx), qmul(qaxis(h.flexAxis, w.flex || 0), qaxis(h.back, (w.dev || 0) * sx)));
    let Dh = qnorm(qmul(pD, rel));
    if (spec?.palm && (spec.palm.weight ?? 1) > 0) {
      const fwdB = qrot(qconj(mover.q), spec.palm.fingerDir);
      const palmB = qrot(qconj(mover.q), spec.palm.palmDir);
      const Dabs = qnorm(qmul(qbasis(fwdB, palmB), qconj(qbasis(h.fwd, h.palm))));
      // A palm target close to 180 deg away from the natural wrist is physically implausible and
      // its shortest slerp path flips sides between frames: fade its weight out instead.
      const ang = 2 * Math.acos(Math.min(1, Math.abs(qdot(Dh, Dabs))));
      const fade = clamp((175 * DEG - ang) / (45 * DEG), 0, 1);
      if (fade < 1) this.fades.push({ side: sd, angle: ang / DEG });
      Dh = qslerp(Dh, Dabs, (spec.palm.weight ?? 1) * fade);
    }
    return Dh;
  }

  // Finger curl. spec: { curl: 0..1 | [thumb,index,middle,ring,pinky], spread: -1..1, claw: 0..1 }
  _fingerDelta(role, spec) {
    const sd = role[6];
    const k = +role[7];
    const j = +role[8];
    if (!spec) return qid();
    const d = this.side[sd];
    const f = d.fingers[k]?.[j];
    if (!f) return qid();
    const curl = Array.isArray(spec.curl) ? spec.curl[k] ?? 0 : spec.curl ?? 0;
    const claw = spec.claw ?? 0; // claw: base straight/hyperextended, tips curled
    let ang;
    if (k === 0) {
      ang = [0.35, 0.55, 0.6][j] * curl;
    } else {
      const base = [1.3, 1.65, 1.0][j] * curl;
      const clawA = [-0.25, 1.1, 1.2][j] * claw;
      ang = base + clawA;
    }
    let q = qaxis(f.axis, ang);
    if (j === 0 && k > 0 && spec.spread) {
      const h = d.hand;
      const sx = sd === 'R' ? 1 : -1;
      const spreadAng = (k - 2.2) * 0.11 * spec.spread * sx;
      q = qmul(qaxis(h.back, -spreadAng), q);
    }
    if (j === 0 && k === 0 && spec.thumbOpp) {
      q = qmul(qaxis(d.hand.fwd, (sd === 'R' ? 1 : -1) * spec.thumbOpp), q);
    }
    return q;
  }

  // Analytic two-bone IK. Returns joint position E and unit segment directions u (S->E),
  // f (E->W) plus hinge axis h (same convention as Skeleton._limb).
  _twoBone(S, T, l1, l2, pole, reach) {
    let dv = vsub(T, S);
    let dist = vlen(dv);
    const maxD = (l1 + l2) * reach;
    const minD = Math.abs(l1 - l2) + 1e-3;
    const n = dist > 1e-6 ? vscale(dv, 1 / dist) : [0, 0, -1];
    dist = clamp(dist, minD, maxD);
    const cosA = clamp((l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist), -1, 1);
    const sinA = Math.sqrt(1 - cosA * cosA);
    let b = vreject(pole, n);
    if (vlen(b) < 1e-6) b = vreject([0, 0, -1], n);
    b = vnorm(b);
    const E = vadd(S, vadd(vscale(n, l1 * cosA), vscale(b, l1 * sinA)));
    const W = vadd(S, vscale(n, dist));
    const u = vnorm(vsub(E, S));
    const f = vnorm(vsub(W, E));
    const h = vnorm(vcross(b, n));
    return { E, W, u, f, h, n, b, dist };
  }
}

// Scene-space world transforms of all bones for a solved pose.
export function worldOf(sol) {
  const P = sol.P.map((p) => vadd(sol.mover.p, qrot(sol.mover.q, p)));
  const Q = sol.Q.map((q) => qnorm(qmul(sol.mover.q, q)));
  return { P, Q };
}

export { vlerp };
