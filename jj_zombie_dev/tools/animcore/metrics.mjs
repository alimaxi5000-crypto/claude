// Automatic animation quality measurements. Shared by the build (pass/fail thresholds) and
// the browser lab (live red/green display). All inputs are solved frames (see scene.mjs).

import { vsub, vlen, vdot, vnorm, vcross, vadd, vscale, qangle, qmul, qconj, qrot, qnorm, DEG, clamp } from './math.mjs';
import { BODY } from './skeleton.mjs';

export const DEFAULT_LIMITS = {
  footSlide: 0.30,        // m/s horizontal speed of a planted foot
  groundPen: 0.025,       // m below ground
  floatFeet: 0.06,        // m: at least one foot within this height of the ground (unless airborne allowed)
  angVel: 1500,           // deg/s per bone (impacts may raise it per clip)
  linVel: 9.0,            // m/s of any joint in body space
  loopSeam: 0.6,          // deg max local rotation difference first/last frame for loops
  loopMover: 0.01,        // m mover discontinuity at the seam (after removing the stride)
  elbowHyper: 4,          // deg of elbow hyperextension allowed
  kneeHyper: 4,
  neck: 85,               // deg head+neck relative to chest
  spineSeg: 38,           // deg per spine segment
  wrist: 88,              // deg wrist relative to forearm
  penetration: 0.035,     // m capsule penetration between actors
  selfPenetration: 0.03,  // m own forearm/hand vs own torso
  contact: 0.07,          // m default max distance for declared contacts
  blendAngle: 6,          // deg max pose jump between consecutive clips
  blendMover: 0.03,       // m max mover jump between consecutive clips
};

// Capsules for interpenetration tests: [from bone, to bone, radius].
const CAPSULES = {
  torso: ['SKEL_Spine0', 'SKEL_Spine3', 0.13],
  chest: ['SKEL_Spine2', 'SKEL_Neck_1', 0.12],
  head: ['SKEL_Neck_1', 'SKEL_Head', 0.105, [0, 0.02, 0.1]],
  upperL: ['SKEL_L_UpperArm', 'SKEL_L_Forearm', 0.052],
  upperR: ['SKEL_R_UpperArm', 'SKEL_R_Forearm', 0.052],
  foreL: ['SKEL_L_Forearm', 'SKEL_L_Hand', 0.042],
  foreR: ['SKEL_R_Forearm', 'SKEL_R_Hand', 0.042],
  thighL: ['SKEL_L_Thigh', 'SKEL_L_Calf', 0.075],
  thighR: ['SKEL_R_Thigh', 'SKEL_R_Calf', 0.075],
  shinL: ['SKEL_L_Calf', 'SKEL_L_Foot', 0.052],
  shinR: ['SKEL_R_Calf', 'SKEL_R_Foot', 0.052],
};
export const CAPSULE_NAMES = Object.keys(CAPSULES);

export function capsulesOf(skel, sol) {
  const out = {};
  for (const [k, [a, b, r, off]] of Object.entries(CAPSULES)) {
    if (!skel.has(a) || !skel.has(b)) continue;
    const pa = sol.world.P[skel.idx(a)];
    let pb = sol.world.P[skel.idx(b)];
    if (off) {
      const d = qnorm(qmul(sol.mover.q, sol.D[skel.idx(b)]));
      pb = vadd(pb, qrot(d, off));
    }
    out[k] = { a: pa, b: pb, r };
  }
  return out;
}

// Closest distance between segments p1-q1 and p2-q2.
export function segDist(p1, q1, p2, q2) {
  const d1 = vsub(q1, p1), d2 = vsub(q2, p2), r = vsub(p1, p2);
  const a = vdot(d1, d1), e = vdot(d2, d2), f = vdot(d2, r);
  let s, t;
  if (a <= 1e-12 && e <= 1e-12) return vlen(r);
  if (a <= 1e-12) { s = 0; t = clamp(f / e, 0, 1); } else {
    const c = vdot(d1, r);
    if (e <= 1e-12) { t = 0; s = clamp(-c / a, 0, 1); } else {
      const b = vdot(d1, d2), den = a * e - b * b;
      s = den !== 0 ? clamp((b * f - c * e) / den, 0, 1) : 0;
      t = (b * s + f) / e;
      if (t < 0) { t = 0; s = clamp(-c / a, 0, 1); } else if (t > 1) { t = 1; s = clamp((b - c) / a, 0, 1); }
    }
  }
  return vlen(vsub(vadd(p1, vscale(d1, s)), vadd(p2, vscale(d2, t))));
}

const worst = () => ({ value: 0, frame: -1, detail: '' });
const upd = (w, v, f, d = '') => { if (v > w.value) { w.value = v; w.frame = f; w.detail = d; } };

// Per-actor clip metrics.
export function measureActor(skel, frames, opts = {}) {
  const L = { ...DEFAULT_LIMITS, ...(opts.limits || {}) };
  const fps = opts.fps || 30;
  const n = frames.length;
  const res = {
    footSlide: worst(), groundPen: worst(), floatFeet: worst(), angVel: worst(), linVel: worst(),
    elbowHyper: worst(), kneeHyper: worst(), neck: worst(), spineSeg: worst(), wrist: worst(),
    selfPenetration: worst(), loopSeam: worst(), loopMover: worst(),
  };
  const ground = skel.groundZ;
  const feet = ['L', 'R'].map((s) => ({ s, ankle: skel.idx(BODY.side[s].foot), toe: skel.has(BODY.side[s].toe) ? skel.idx(BODY.side[s].toe) : -1 }));
  const allowAir = opts.airborne || [];
  for (let f = 0; f < n; f++) {
    const sol = frames[f];
    const gz = ground + sol.mover.p[2];
    // Ground penetration / floating.
    let minH = Infinity;
    for (const ft of feet) {
      const hA = sol.world.P[ft.ankle][2] - (gz + 0.085);
      const hT = ft.toe >= 0 ? sol.world.P[ft.toe][2] - (gz + 0.025) : hA;
      if (!opts.noGround) upd(res.groundPen, -Math.min(hA, hT), f, `${ft.s} foot`);
      minH = Math.min(minH, hA, hT);
    }
    const airborne = allowAir.some(([a, b]) => f / fps >= a && f / fps <= b);
    if (!airborne && !opts.noGround) upd(res.floatFeet, minH, f, 'lowest foot above ground');
    // Foot slide (contact = toe or ankle near the ground).
    if (f > 0 && !opts.noGround) {
      const prev = frames[f - 1];
      for (const ft of feet) {
        for (const [j, h0] of [[ft.ankle, 0.085], [ft.toe, 0.025]]) {
          if (j < 0) continue;
          const h = sol.world.P[j][2] - (gz + h0);
          const hp = prev.world.P[j][2] - (gz + h0);
          if (h < 0.03 && hp < 0.03) {
            const dx = sol.world.P[j][0] - prev.world.P[j][0];
            const dy = sol.world.P[j][1] - prev.world.P[j][1];
            upd(res.footSlide, Math.hypot(dx, dy) * fps, f, `${ft.s} ${j === ft.toe ? 'toe' : 'ankle'}`);
          }
        }
      }
    }
    // Velocities.
    if (f > 0) {
      const prev = frames[f - 1];
      for (const i of skel.order) {
        const name = skel.bones[i].name;
        if (!name.startsWith('SKEL_') || name.includes('Finger')) continue;
        const av = qangle(sol.world.Q[i], prev.world.Q[i]) / DEG * fps;
        upd(res.angVel, av, f, name);
        const lv = vlen(vsub(sol.world.P[i], prev.world.P[i])) * fps;
        upd(res.linVel, lv, f, name);
      }
    }
    // Joint limits.
    for (const s of ['L', 'R']) {
      const S = BODY.side[s];
      const arm = skel.limbs['arm' + s], leg = skel.limbs['leg' + s];
      for (const [lim, key, a, b, c] of [[arm, 'elbowHyper', S.upper, S.lower, S.hand], [leg, 'kneeHyper', S.thigh, S.calf, S.foot]]) {
        if (!lim) continue;
        const pa = sol.P[skel.idx(a)], pb = sol.P[skel.idx(b)], pc = sol.P[skel.idx(c)];
        const u = vnorm(vsub(pb, pa)), w = vnorm(vsub(pc, pb));
        const hinge = qrot(sol.D[skel.idx(a)], lim.hingeU);
        const bendSigned = Math.atan2(vdot(vcross(u, w), hinge), vdot(u, w));
        upd(res[key], -bendSigned / DEG, f, `${s}`);
      }
      // Wrist relative to forearm (delta beyond the forearm's delta).
      const dRel = qangle(sol.D[skel.idx(S.hand)], sol.D[skel.idx(S.lower)]) / DEG;
      upd(res.wrist, dRel, f, s);
    }
    // Neck/head relative to chest.
    const chest = skel.has('SKEL_Spine3') ? skel.idx('SKEL_Spine3') : skel.idx(BODY.root);
    upd(res.neck, qangle(sol.D[skel.idx(BODY.head)], sol.D[chest]) / DEG, f, 'head vs chest');
    for (const sp of BODY.spine) {
      if (!skel.has(sp)) continue;
      const i = skel.idx(sp);
      const p = skel.bones[i].parent;
      upd(res.spineSeg, qangle(sol.D[i], sol.D[p]) / DEG, f, sp);
    }
    // Self penetration: own forearms vs own torso (hands may touch the body when intended).
    if (!opts.allowSelfContact) {
      const caps = capsulesOf(skel, sol);
      for (const k of ['foreL', 'foreR']) {
        for (const body of ['torso', 'thighL', 'thighR']) {
          if (!caps[k] || !caps[body]) continue;
          if ((k === 'foreL' && body === 'thighL') || (k === 'foreR' && body === 'thighR')) continue;
          const d = segDist(caps[k].a, caps[k].b, caps[body].a, caps[body].b);
          upd(res.selfPenetration, caps[k].r + caps[body].r - d, f, `${k} vs ${body}`);
        }
      }
    }
  }
  if (opts.loop && n > 2) {
    const a = frames[0], b = frames[n - 1];
    for (const i of skel.order) upd(res.loopSeam, qangle(a.local[i], b.local[i]) / DEG, n - 1, skel.bones[i].name);
    // Mover continuity: velocity across the seam should match velocity inside the clip.
    const v0 = vsub(frames[1].mover.p, frames[0].mover.p);
    const v1 = vsub(frames[n - 1].mover.p, frames[n - 2].mover.p);
    upd(res.loopMover, vlen(vsub(v0, v1)), n - 1, 'mover velocity across seam');
    upd(res.loopSeam, qangle(frames[0].mover.q, frames[n - 1].mover.q) / DEG, n - 1, 'mover rotation');
  }
  return judge(res, L);
}

// Scene metrics between actors (interpenetration, declared contacts).
export function measureScene(sampled, opts = {}) {
  const L = { ...DEFAULT_LIMITS, ...(opts.limits || {}) };
  const res = { penetration: worst(), contact: worst() };
  const actors = sampled.actors;
  const allow = new Set((opts.allowTouch || []).flatMap(([a, b]) => [`${a}|${b}`, `${b}|${a}`]));
  const n = sampled.nFrames;
  const fps = opts.fps || 30;
  const contacts = opts.contacts || [];
  const perContact = contacts.map(() => worst());
  for (let f = 0; f < n; f++) {
    const caps = {};
    for (const a of actors) caps[a] = capsulesOf(sampled.skeletons[a], sampled.frames[a][f]);
    for (let i = 0; i < actors.length; i++) {
      for (let j = i + 1; j < actors.length; j++) {
        const A = actors[i], B = actors[j];
        for (const [ka, ca] of Object.entries(caps[A])) {
          for (const [kb, cb] of Object.entries(caps[B])) {
            if (allow.has(`${A}.${ka}|${B}.${kb}`) || allow.has(`${A}.*|${B}.${kb}`) || allow.has(`${A}.${ka}|${B}.*`)) continue;
            const d = segDist(ca.a, ca.b, cb.a, cb.b);
            upd(res.penetration, ca.r + cb.r - d, f, `${A}.${ka} vs ${B}.${kb}`);
          }
        }
      }
    }
    contacts.forEach((c, k) => {
      const t = f / fps;
      if (t < c.from || t > c.to) return;
      const sa = sampled.skeletons[c.actor];
      const pa = sampled.frames[c.actor][f].world.P[sa.idx(c.bone)];
      const sb = sampled.skeletons[c.target.actor];
      const solB = sampled.frames[c.target.actor][f];
      const ib = sb.idx(c.target.bone);
      const d = qnorm(qmul(solB.mover.q, solB.D[ib]));
      const pb = vadd(solB.world.P[ib], qrot(d, c.target.offset || [0, 0, 0]));
      const dist = vlen(vsub(pa, pb));
      const label = `${c.actor}.${c.bone} -> ${c.target.actor}.${c.target.bone}`;
      upd(perContact[k], dist, f, label);
      upd(res.contact, dist - (c.max ?? L.contact), f, label);
    });
  }
  // res.contact holds the worst excess over each contact's own limit.
  const out = judge(res, { ...L, contact: 0 });
  out.contacts = perContact.map((w, k) => ({ ...w, value: +w.value.toFixed(4), limit: contacts[k].max ?? L.contact, pass: w.value <= (contacts[k].max ?? L.contact) }));
  return out;
}

// Pose jump between the end of one clip and the start of the next (same skeleton).
export function measureBlend(skel, endFrame, startFrame, L0 = {}) {
  const L = { ...DEFAULT_LIMITS, ...L0 };
  const res = { blendAngle: worst(), blendMover: worst() };
  for (const i of skel.order) {
    const n = skel.bones[i].name;
    if (!n.startsWith('SKEL_')) continue;
    upd(res.blendAngle, qangle(endFrame.local[i], startFrame.local[i]) / DEG, 0, n);
  }
  upd(res.blendMover, vlen(vsub(endFrame.mover.p, startFrame.mover.p)), 0, 'mover position');
  upd(res.blendAngle, qangle(endFrame.mover.q, startFrame.mover.q) / DEG, 0, 'mover rotation');
  return judge(res, L);
}

function judge(res, L) {
  const out = { ok: true, items: {} };
  for (const [k, w] of Object.entries(res)) {
    const lim = L[k];
    const pass = lim == null || w.value <= lim + 1e-9;
    out.items[k] = { value: +w.value.toFixed(4), limit: lim, pass, frame: w.frame, detail: w.detail };
    if (!pass) out.ok = false;
  }
  return out;
}
