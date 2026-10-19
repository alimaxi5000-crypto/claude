// Finisher acts built on the clinch (see finisher.mjs):
//   fin_grab   8 approach directions x 2 victim genders: lunge, slam onto the shoulders, the
//              victim is yanked around to face the zombie and braces into the clinch.
//   fin_shove  success: anticipation, explosive two-handed shove, zombie thrown back.
//   fin_bite   failure: arms buckle, bite into the neck, tearing, enraged hook to the head.
//   fin_recover victim only: hand on the bitten neck, stumble, straighten up.
import {
  clinch, clinchContacts, CLINCH_TOUCH, genderVariants, dictOf, zMover, C, at, CLINCH, victimLegs,
  plantedFoot, K, KC, impulse, bump, FIST, LIMP, CLAW, FLAT, GRAB, rot2, vnorm, vsub, clamp, lerp, smooth, Ease,
} from './finisher.mjs';
import { mixPose, merge, zombieSpine, grip, toScene, DEG, GROUND, ANKLE_H, vadd, vscale } from '../lib/kit.mjs';

const PI = Math.PI, sin = Math.sin, cos = Math.cos;
const ROOT_REST_Z = -0.019;
const rootZ = (h) => GROUND + h - ROOT_REST_Z;
const LOOPS = ['fin_struggle_low', 'fin_struggle_mid', 'fin_struggle_high'];
const VF = CLINCH.victimFeet, ZF = CLINCH.zombieFeet;
// Left hand clamped on the left side of the victim's own (bitten) neck: fingers towards the nape.
const NECK_SPOT = ['SKEL_Neck_1', [-0.075, 0.0, 0.0]];
const neckHold = (ctx, w = 0.6) => ({
  ...grip(at(ctx, 'victim', NECK_SPOT), [0.15, -0.35, 0.9], [0.9, 0.1, -0.1], { palmCenter: 0.05, weight: w }),
  pole: [-0.45, 0.75, -0.5], fingers: { curl: [0.2, 0.3, 0.35, 0.4, 0.45], spread: 0.25 },
});

// Zombie foot plant (its own frame at mover y) -> scene plant.
function zPlant(t0, t1, moverY, fx, fy, yawRelDeg, moverX = 0) {
  const p = toScene(zMover(moverY, 0, moverX), [fx, fy, 0]);
  return { t0, t1, x: p[0], y: p[1], yaw: PI + yawRelDeg * DEG };
}

// ================================================================ GRAB
// The victim may face any of 8 directions relative to the zombie (dir k: victim yaw alpha in the
// scene, the zombie always comes from +Y). The zombie lunges, both hands slam onto the victim's
// shoulder girdle (wherever it is closest), it yanks him around by the shoulders while he
// pivots on his feet, and both end in the shared clinch pose.
const GR_T = 36 / 30;
const IMPACT = 0.3;
const dirYawDeg = (k) => (k <= 4 ? k * 45 : (k - 8) * 45);

// Shoulder girdle of the victim: an ellipse around the upper chest at shoulder height, in
// SKEL_Spine3's rest model frame. theta 0 = right shoulder, 90 = chest, 180 = left, 270 = back.
function girdle(ctx) {
  const sk = ctx.scene.skeletons.victim;
  const sp = sk.restP[sk.idx('SKEL_Spine3')], up = sk.restP[sk.idx('SKEL_R_UpperArm')];
  const a = Math.abs(up[0] - sp[0]) - 0.03, b = 0.6 * a, top = up[2] - sp[2] + 0.07;
  return {
    a, b,
    local: (th) => [a * cos(th), b * sin(th), top - 0.05 * sin(th) ** 2],
    normal: (th) => vnorm([b * cos(th), a * sin(th), 0]),     // outward, local
  };
}
// Point of the girdle closest to a scene anchor, for a victim facing `yaw` (continuous in yaw
// because the anchors lie far outside the ellipse's evolute).
function closestTheta(g, yaw, anchor) {
  let best = 0, bd = Infinity;
  const test = (th) => {
    const l = g.local(th);
    const [x, y] = rot2(l[0], l[1], yaw);
    const d = (x - anchor[0]) ** 2 + (y - anchor[1]) ** 2;
    if (d < bd) { bd = d; best = th; }
  };
  for (let i = 0; i < 360; i++) test((i / 360) * 2 * PI);
  let step = (2 * PI) / 360;
  for (let r = 0; r < 12; r++) { const c = best; test(c - step / 2); test(c + step / 2); step /= 2; }
  return best;
}
const ANCHOR = { L: [0.62, 0.32], R: [-0.62, 0.32] };   // zombie hands come from these sides

function grabScene() {
  const variants = [];
  for (let k = 0; k < 8; k++) {
    for (const gv of genderVariants()) variants.push({ ...gv, suffix: `d${k}_${gv.gender}`, dir: k, meta: { gender: gv.gender, dir: k, yaw: dirYawDeg(k) } });
  }
  return {
    dict: dictOf, name: 'fin_grab', duration: GR_T, loop: false,
    actors: { victim: 'male', zombie: 'zombie' },
    variants,
    events: [{ name: 'grab_impact', t: IMPACT }],
    contacts: () => clinchContacts(0.95, GR_T),
    allowTouch: CLINCH_TOUCH,
    limits: { angVel: 1700, linVel: 9.5, footSlide: 0.35 },
    leadsTo: (v) => LOOPS.map((n) => ({ name: n, variant: v.gender })),
    pose(t, ctx) {
      const alphaDeg = dirYawDeg(ctx.v.dir);
      const alpha = alphaDeg * DEG;
      const absA = Math.abs(alphaDeg);
      const front = absA <= 45;
      // ---- timing
      const tsTurn = front ? 0.2 : IMPACT + 0.02, teTurn = front ? 0.75 : 0.9;
      const turnK = K([[0, 0], [tsTurn, 0], [teTurn, 1, 'inOut3'], [GR_T, 1]]);
      const yawAt = (tt) => alpha * (1 - turnK(tt));
      const yaw = yawAt(t);
      const lunge = K([[0, 0], [0.06, 0.03, 'in'], [IMPACT, 1, 'in'], [0.62, 1.03, 'out'], [GR_T, 1.0, 'inOut']])(t);
      const toClinch = K([[0, 0], [IMPACT, 0], [0.95, 1, 'inOut']])(t);
      const startle = K([[0, 0], [0.08, 0], [0.3, 1, 'out'], [0.62, 0.6, 'inOut'], [GR_T, 0]])(t);
      const jolt = impulse(IMPACT, 1.0, 3.0, 6.0)(t);
      // ---- victim feet: neutral stance at alpha -> three staggered steps into the clinch stance
      const stance = (x, y, yw, psi) => { const [px, py] = rot2(x, y, psi); return { x: px, y: py, yaw: yw * DEG + psi }; };
      const S1 = front ? [0.3, 0.46] : [0.36, 0.52];
      const S2 = front ? [0.46, 0.64] : [0.54, 0.72];
      const S3 = front ? [0.66, 0.84] : [0.74, 0.92];
      const midR = stance(lerp(0.11, VF.R[0], 0.5), lerp(-0.02, VF.R[1], 0.5), lerp(0, VF.R[2], 0.5), yawAt(S1[1] + 0.12));
      // Short shuffles lift the foot less than real steps.
      const liftFor = (p, q) => clamp(0.6 * Math.hypot(q.x - p.x, q.y - p.y), 0.03, 0.08);
      const r0 = stance(0.11, -0.02, 0, alpha), rEnd = stance(VF.R[0], VF.R[1], VF.R[2], 0);
      const footR = plantedFoot([
        { t0: 0, t1: S1[0], ...r0 },
        { t0: S1[1], t1: S3[0], ...midR },
        { t0: S3[1], t1: GR_T, ...rEnd },
      ], { lift: t < S2[0] ? liftFor(r0, midR) : liftFor(midR, rEnd) })(t);
      // The left foot pivots on its ball while the body starts turning, then steps.
      const l0 = stance(-0.11, 0.02, 0, alpha);
      const lEnd = stance(VF.L[0], VF.L[1], VF.L[2], 0);
      const footL = plantedFoot([
        { t0: 0, t1: S2[0], ...l0, turnTo: l0.yaw + 0.35 * (yawAt(S2[0]) - alpha), ts: tsTurn + 0.04, te: S2[0] - 0.15 },
        { t0: S2[1], t1: GR_T, ...lEnd },
      ], { lift: liftFor(l0, lEnd) })(t);
      // ---- victim body: jolted in the push direction (scene -Y), startled, turned into the clinch
      const [pdx, pdy] = rot2(0, -1, -yaw);                    // push direction in his body frame
      const zHead = at(ctx, 'zombie', C.zombieMouth);
      const vEarly = {
        mover: { p: [0, 0, 0], yaw },
        root: { p: [0.07 * jolt * pdx, 0.07 * jolt * pdy, -0.02 - 0.06 * startle - 0.03 * jolt], bend: 0.12 * jolt * pdy, side: 0.12 * jolt * pdx, twist: 0 },
        spine: { bend: 0.25 * jolt * pdy - 0.05 * startle, side: 0.22 * jolt * pdx, twist: 0 },
        clav: { L: { up: 0.25 * startle, fwd: 0.1 }, R: { up: 0.25 * startle, fwd: 0.1 } },
        look: { target: zHead, weight: 0.9 * startle },
        neck: { bend: 0.2 * jolt * pdy, side: 0.15 * jolt * pdx }, head: { bend: 0.1 * jolt * pdy },
        arm: {
          L: { target: [-0.05 - 0.12 * startle, 0.08 + 0.3 * startle, -0.48 + 0.42 * startle], space: 'shoulder', pole: [-0.6, -0.4, -0.7], fingers: { curl: 0.35 + 0.2 * startle, spread: 0.4 * startle } },
          R: { target: [0.05 + 0.12 * startle, 0.08 + 0.3 * startle, -0.48 + 0.42 * startle], space: 'shoulder', pole: [0.6, -0.4, -0.7], fingers: { curl: 0.35 + 0.2 * startle, spread: 0.4 * startle } },
        },
      };
      const cl = clinch(ctx, {});
      const victim = mixPose(vEarly, cl.victim, toClinch);
      // His hands only find the zombie's chest / jaw once he is mostly turned towards it.
      const armW = front ? toClinch : Math.min(toClinch, smooth(clamp((turnK(t) - 0.35) / 0.6, 0, 1)));
      victim.arm = mixPose(vEarly.arm, cl.victim.arm, armW);
      victim.mover = { p: [0, 0, 0], yaw };
      victim.leg = { L: footL, R: footR };
      // ---- zombie: lunge from 1.0 m; distance keeps clear of the turned victim's shoulders
      const clearance = (yw) => Math.hypot(0.33 * sin(yw), 0.12 * cos(yw)) - 0.12 + 0.04 * (1 - cos(yw)) / 2;
      const zClinchY = CLINCH.zombieY + clearance(yaw);
      const zY = lerp(1.0, zClinchY, Math.min(1, lunge)) - Math.max(0, lunge - 1) * 0.5;
      const zm = zMover(zY);
      const zStepR = plantedFoot([
        zPlant(0, 0.05, 1.0, ZF.R[0], -0.02, ZF.R[2]),
        zPlant(0.25, GR_T, CLINCH.zombieY, ZF.R[0], ZF.R[1], ZF.R[2]),
      ], { lift: 0.13 })(t);
      const zStepL = plantedFoot([
        zPlant(0, 0.26, 1.0, ZF.L[0], -0.12, ZF.L[2]),
        zPlant(0.5, GR_T, CLINCH.zombieY, ZF.L[0], ZF.L[1], ZF.L[2]),
      ], { lift: 0.09 })(t);
      // Hands: claws forward, then slam onto the girdle point nearest to each side, then slide
      // with the victim's turn into the clinch grips on top of the shoulders.
      const g = girdle(ctx);
      const reachW = K([[0, 0], [0.06, 0.05], [IMPACT, 1, 'in']])(t);
      const handOn = (side) => {
        const th = closestTheta(g, yaw, ANCHOR[side]);
        const contact = at(ctx, 'victim', ['SKEL_Spine3', g.local(th)]);
        const nl = g.normal(th);
        const [nx, ny] = rot2(nl[0], nl[1], yaw);
        const fingerDir = [-0.25 * nx, -0.75 - 0.25 * ny, -0.6];
        const palmDir = [-0.35 * nx, -0.25 - 0.35 * ny, -0.9];
        const sx = side === 'R' ? 1 : -1;   // zombie R hand is on scene -X
        return { ...grip(contact, fingerDir, palmDir, { palmCenter: 0.07, weight: 0.6 }), pole: [sx * 0.9, 0, -0.45], fingers: GRAB };
      };
      const ready = (side) => {
        const sx = side === 'R' ? 1 : -1;
        return { target: [sx * 0.12, 0.42, 0.02], space: 'shoulder', pole: [sx * 0.8, -0.2, -0.5], fingers: CLAW, wrist: { flex: -0.3 } };
      };
      const zArm = (side) => {
        const on = mixPose(ready(side), handOn(side), reachW);
        const fin = mixPose(on, { ...cl.zombie.arm[side] }, toClinch);
        return { ...fin, fingers: mixPose(CLAW, GRAB, K([[0, 0], [IMPACT - 0.03, 0], [IMPACT + 0.06, 1, 'out']])(t)) };
      };
      const zEarly = merge(zombieSpine(1.3, { bend: 0.2 - 0.12 * reachW, neckBend: 0.12, headBend: 0.1, shrug: 0.22 }), {
        mover: zm,
        root: { p: [0, -0.03, -0.1 + 0.04 * reachW], bend: 0.32 - 0.1 * reachW },
        look: { target: at(ctx, 'victim', C.victimNeckLeft), weight: 0.6 },
      });
      const zombie = mixPose(zEarly, { ...cl.zombie, arm: undefined }, toClinch);
      zombie.arm = { L: zArm('L'), R: zArm('R') };
      zombie.mover = zm;
      zombie.leg = { L: zStepL, R: zStepR };
      return { victim, zombie };
    },
  };
}

// ================================================================ SHOVE (success)
// Load (crouch, elbows in, palms onto its chest), explode: both arms lock out from the legs up,
// the rear heel drives off the ground; the zombie is launched backwards at the impact (it
// ragdolls in game from there; the rest of the clip is the fallback), the victim follows
// through with a step and comes up into a guard.
const SH_T = 42 / 30;
const SH_IMPACT = 0.4;
const shove = {
  dict: dictOf, name: 'fin_shove', duration: SH_T, loop: false,
  actors: { victim: 'male', zombie: 'zombie' },
  variants: genderVariants(),
  events: [{ name: 'impact', t: SH_IMPACT }, { name: 'release', t: 0.86 }],
  contacts: () => clinchContacts(0, 0.25),
  allowTouch: CLINCH_TOUCH,
  limits: { angVel: 2300, linVel: 10, footSlide: 0.35, floatFeet: 0.2 },
  actorLimits: { zombie: { floatFeet: 1.0, groundPen: 0.06, spineSeg: 45 } },
  allowSelfContact: ['zombie'],
  noGround: false,
  airborne: { zombie: [[0.4, SH_T]] },
  pose(t, ctx) {
    const gather = K([[0, 0], [0.26, 1, 'inOut'], [SH_IMPACT, 0, 'in']])(t);
    const drive = K([[0, 0], [0.24, 0], [SH_IMPACT, 1, 'in'], [0.62, 0.75, 'out'], [1.1, 0.0, 'inOut']])(t);
    const cl = clinch(ctx, { zPush: 0.03 * gather, vLean: 0.25 * gather, mouth: 0.4 * gather, armGive: 0.7 * gather });
    // ---- zombie trajectory first (the victim's hands follow its chest until the impact)
    const shoved = K([[0, 0], [0.28, 0], [SH_IMPACT, 0.13, 'in'], [0.62, 0.62, 'out'], [1.0, 0.98, 'out'], [SH_T, 1.12, 'out']])(t);
    const zY = CLINCH.zombieY - 0.03 * gather + shoved;
    const zm = zMover(zY);
    // ---- victim
    const vFootL = plantedFoot([
      { t0: 0, t1: 0.42, x: VF.L[0], y: VF.L[1], yaw: VF.L[2] * DEG },
      { t0: 0.6, t1: SH_T, x: -0.15, y: 0.3, yaw: 6 * DEG },
    ], { lift: 0.07 })(t);
    const vFootRBase = plantedFoot([
      { t0: 0, t1: 0.78, x: VF.R[0], y: VF.R[1], yaw: VF.R[2] * DEG },
      { t0: 0.98, t1: SH_T, x: 0.17, y: -0.12, yaw: -20 * DEG },
    ], { lift: 0.06 })(t);
    // Rear heel drives off the ground through the push.
    const heel = K([[0, 0], [0.24, 0], [SH_IMPACT, 1, 'out'], [0.6, 0, 'inOut']])(t);
    const vFootR = heel > 1e-4 && t < 0.6
      ? { ...vFootRBase, foot: { yaw: VF.R[2] * DEG, pitch: -24 * DEG * heel }, toe: 24 * DEG * heel, pivot: { kind: 'toe', ax: VF.R[0], ay: VF.R[1] } }
      : vFootRBase;
    const zChestNow = at(ctx, 'zombie', ['SKEL_Spine3', [0, 0.12, 0.04]]);
    const zChest = freezeAt(ctx, 'shove.chest', SH_IMPACT, zChestNow);
    const follow = K([[0, 0], [SH_IMPACT, 0], [0.52, 1, 'out']])(t);
    const guard = K([[0, 0], [0.55, 0], [0.95, 1, 'inOut']])(t);
    const push = (side) => {
      const sx = side === 'R' ? 1 : -1;
      // Palms on its chest; after the impact the hands follow through 12 cm and stay there.
      const c = vadd(zChest, [sx * 0.11, -0.04 + 0.12 * follow, 0.02]);
      const g = grip(c, [sx * 0.15, 0.1, 1], [0, 1, 0.1], { palmCenter: 0.07, weight: 0.7 });
      return { ...g, pole: [sx * 0.6, -0.3, -0.75], fingers: FLAT };
    };
    const guardArm = (side) => {
      const sx = side === 'R' ? 1 : -1;
      return { target: [sx * -0.06, 0.32, -0.08], space: 'shoulder', pole: [sx * 0.6, -0.4, -0.7], fingers: FIST };
    };
    const victimDrive = {
      mover: { p: [0, 0, 0], yaw: 0 },
      root: { p: [0, -0.04 * gather + 0.09 * drive, -0.1 * gather - 0.03 * drive - 0.06], bend: -0.05 * gather + 0.12 * drive, twist: 0.1 * gather - 0.04 * drive, side: 0 },
      spine: { bend: -0.16 * gather + 0.2 * drive, twist: 0.08 * gather - 0.06 * drive, side: 0 },
      clav: { L: { up: 0.05, fwd: 0.05 - 0.1 * gather + 0.3 * drive }, R: { up: 0.05, fwd: 0.05 - 0.1 * gather + 0.3 * drive } },
      look: { target: at(ctx, 'zombie', ['SKEL_Head', [0, 0, 0]]), weight: 0.8 },
      neck: { bend: 0.05 }, head: { bend: 0.05 },
      arm: {
        L: mixPose(push('L'), guardArm('L'), guard),
        R: mixPose(push('R'), guardArm('R'), guard),
      },
    };
    const victim = mixPose(cl.victim, victimDrive, K([[0, 0], [0.2, 1, 'inOut']])(t));
    victim.leg = { L: vFootL, R: vFootR };
    // ---- zombie: launched backwards (ragdoll in game), head whips, arms fly up, falls
    const whip = K([[0, 0], [SH_IMPACT - 0.04, 0], [0.56, 1, 'out'], [0.95, 0.8, 'inOut'], [SH_T, 1.2, 'in']])(t);
    const fall = K([[0, 0], [0.8, 0], [SH_T, 1, 'in3']])(t);
    const zFootR = plantedFoot([
      zPlant(0, 0.46, CLINCH.zombieY, ZF.R[0], ZF.R[1], ZF.R[2]),
      zPlant(0.68, SH_T, CLINCH.zombieY + 0.75, 0.16, -0.05, -10),
    ], { lift: 0.12 })(t);
    const zFootL = plantedFoot([
      zPlant(0, 0.54, CLINCH.zombieY, ZF.L[0], ZF.L[1], ZF.L[2]),
      zPlant(0.82, SH_T, CLINCH.zombieY + 1.05, -0.2, -0.1, 18),
    ], { lift: 0.1 })(t);
    const flail = (side) => {
      const sx = side === 'R' ? 1 : -1;
      return { target: [sx * (0.1 + 0.2 * whip), 0.3 - 0.1 * whip, 0.1 + 0.3 * whip], space: 'shoulder', pole: [sx * 0.8, -0.3, -0.4], fingers: CLAW };
    };
    const zThrown = merge(zombieSpine(1.0 - 0.8 * whip, { bend: -0.4 * whip, neckBend: -0.25 * whip, headBend: -0.3 * whip, shrug: 0.2 * whip }), {
      mover: zm,
      root: { p: [0, -0.3 * fall, rootZ(0.95 - 0.8 * fall)], bend: -0.3 * whip - 1.0 * fall, side: 0, twist: 0 },
      arm: { L: flail('L'), R: flail('R') },
      look: { target: [0, 0, 0.6], weight: 0 },
    });
    const zombie = mixPose(cl.zombie, zThrown, K([[0, 0], [SH_IMPACT - 0.06, 0], [0.56, 1, 'out']])(t));
    zombie.mover = zm;
    zombie.leg = { L: zFootL, R: zFootR };
    return { victim, zombie };
  },
};

// ================================================================ helpers
// Value captured at a time and held afterwards (frames are sampled in order), e.g. the spot a
// punch lands on, so the follow-through does not chase the target flying away.
const FROZEN = new Map();
function freezeAt(ctx, key, tf, value) {
  const k = `${key}:${ctx.v.suffix || ''}`;
  if (ctx.t <= tf + 1e-9 || !FROZEN.has(k)) { FROZEN.set(k, value); return value; }
  return FROZEN.get(k);
}

// ================================================================ RECOVER pose (victim only)
// Shared by the end of fin_bite and fin_recover, so the hand-over is exact.
const RC_T = 42 / 30;
function recoverVictim(t, ctx) {
  const hold = K([[0, 1], [0.8, 1], [RC_T, 0, 'inOut']])(t);
  const straighten = K([[0, 0], [0.4, 0.1], [RC_T, 1, 'inOut']])(t);
  const footL = plantedFoot([
    { t0: 0, t1: 0.35, x: -0.15, y: -0.08, yaw: 10 * DEG },
    { t0: 0.6, t1: RC_T, x: -0.12, y: 0.12, yaw: 6 * DEG },
  ], { lift: 0.07 })(t);
  const footR = plantedFoot([
    { t0: 0, t1: 0.75, x: 0.17, y: -0.3, yaw: -18 * DEG },
    { t0: 1.0, t1: RC_T, x: 0.12, y: 0.0, yaw: -8 * DEG },
  ], { lift: 0.07 })(t);
  const relaxedL = { target: [0.0, 0.05, -0.5], space: 'shoulder', pole: [-0.3, -1, 0], fingers: { curl: 0.3 } };
  return {
    mover: { p: [0, 0, 0], yaw: 0 },
    root: { p: [0.01 * (1 - straighten), 0.06 * straighten - 0.02 * (1 - straighten), -0.1 + 0.08 * straighten], bend: 0.15 * (1 - straighten), side: 0, twist: 0 },
    spine: { bend: 0.3 * (1 - straighten), side: 0.15 * (1 - straighten), twist: 0.05 },
    neck: { bend: 0.15 * (1 - straighten), side: 0.25 * hold },
    head: { bend: 0.1 * (1 - straighten) },
    look: { target: [0.6, 1.2, 0.5], weight: 0 },
    leg: { L: footL, R: footR },
    arm: {
      L: mixPose(neckHold(ctx), relaxedL, 1 - hold),
      R: { target: [0.02, 0.1 - 0.05 * straighten, -0.47], space: 'shoulder', pole: [0.3, -1, 0], fingers: { curl: 0.35 } },
    },
  };
}

// ================================================================ BITE (failure)
// The arms buckle, the zombie's teeth sink into the left side of the neck and tear; the victim
// screams, claws at its face, then lands an enraged right hook on its left temple (impact: the
// zombie ragdolls in game; the clip continues as a fallback) and clutches his neck.
const BI_T = 84 / 30;
const BITE = 0.5, HOOK = 1.68;
const bite = {
  dict: dictOf, name: 'fin_bite', duration: BI_T, loop: false,
  actors: { victim: 'male', zombie: 'zombie' },
  variants: genderVariants(),
  events: [{ name: 'bite', t: BITE }, { name: 'impact', t: HOOK }, { name: 'release', t: 2.5 }],
  contacts: () => [
    { actor: 'zombie', bone: 'SKEL_Head', offset: C.zombieMouth[1], target: { actor: 'victim', bone: C.victimNeckLeft[0], offset: C.victimNeckLeft[1] }, from: BITE, to: 1.2, max: 0.06 },
    ...clinchContacts(0, 0.3).slice(0, 2),
  ],
  // Face buried in the neck: head / neck capsules of both touch by design during the bite.
  allowTouch: [...CLINCH_TOUCH, ['zombie.head', 'victim.*'], ['zombie.neck', 'victim.head'], ['zombie.neck', 'victim.neck'], ['victim.foreR', 'zombie.head']],
  limits: { angVel: 2300, linVel: 11, footSlide: 0.35, floatFeet: 0.2, penetration: 0.05 },
  // The hook accelerates into the impact: one frame of ~2700 deg/s at the arm is a real punch
  // (boxing hooks peak at 2000-3000 deg/s at the shoulder), not a pop.
  actorLimits: { zombie: { floatFeet: 1.0, groundPen: 0.06, spineSeg: 45 }, victim: { angVel: 2800 } },
  allowSelfContact: ['victim', 'zombie'],
  airborne: { zombie: [[HOOK, BI_T]] },
  leadsTo: (v) => [{ name: 'fin_recover', variant: v.gender }],
  pose(t, ctx) {
    const surge = K([[0, 0], [0.42, 1, 'in3'], [1.26, 1], [1.6, 0.4, 'inOut'], [HOOK, 0]])(t);
    const tear = (t > BITE && t < 1.35) ? sin(2 * PI * 3.2 * (t - BITE)) * Math.exp(-1.2 * (t - BITE)) * smooth(clamp((t - BITE) / 0.08, 0, 1)) : 0;
    const cl = clinch(ctx, {
      zPush: 0.22 * surge, vLean: 0.1 * surge, mouth: 0.2 * surge, armGive: 1.5 * surge, jaw: 0.6 - 0.6 * surge, headLunge: 0.35 * surge,
      headShake: 0.3 * tear, vShakeX: 0.02 * tear, zShakeX: 0.02 * tear,
    });
    // ---- victim: scream (head thrown up and away), claw, cock, hook, clutch the neck
    const scream = K([[0, 0], [BITE, 0.15], [0.68, 1, 'out3'], [1.3, 0.8], [1.5, 0, 'inOut']])(t);
    const cock = K([[0, 0], [1.22, 0], [1.46, 1, 'inOut'], [HOOK, 0, 'in']])(t);
    const hookT = K([[0, 0], [1.46, 0], [HOOK, 1, 'in'], [1.84, 1.12, 'out']])(t);
    const clutch = K([[0, 0], [1.9, 0], [2.3, 1, 'inOut']])(t);
    const after = K([[0, 0], [HOOK, 0], [2.3, 1, 'inOut']])(t);
    const toRecover = K([[0, 0], [2.2, 0], [BI_T, 1, 'inOut']])(t);
    const zFace = at(ctx, 'zombie', ['SKEL_Head', [-0.02, 0.08, 0.05]]);
    // The hook lands where the temple is at the impact; the fist then follows through to -X.
    const temple = freezeAt(ctx, 'bite.temple', HOOK, at(ctx, 'zombie', C.zombieTemple));
    const rArm = (() => {
      // Claws at the zombie's face, trying to tear it off the neck.
      const g = grip(zFace, [-0.2, 0.3, 0.9], [-0.5, 0.8, 0.2], { palmCenter: 0.06, weight: 0.5 });
      const claw = mixPose(cl.victim.arm.R, { ...g, pole: [0.6, -0.2, -0.8], fingers: CLAW }, K([[0, 0], [0.6, 0], [0.85, 1, 'inOut'], [1.3, 1], [1.5, 0, 'inOut']])(t));
      // Wind-up: fist pulled back low beside the ribs, elbow back (clear of the zombie's arm).
      const COCK = [0.07, -0.02, -0.16], COCK_POLE = [0.45, -0.85, -0.25], HIT_POLE = [0.95, -0.1, 0.25];
      const cocked = { target: COCK, space: 'shoulder', pole: COCK_POLE, fingers: FIST };
      if (t <= 1.46) return mixPose(claw, cocked, cock);
      // The hook swings on a sphere around the shoulder (never through it) from the wind-up to
      // the temple and on past it (follow-through), then the fist comes back up into a guard.
      const S = at(ctx, 'victim', ['SKEL_R_UpperArm', [0, 0, 0]]);
      const end = vsub(vadd(temple, [0.05, -0.06, 0.0]), S);
      const u = hookT;
      const da = vnorm(COCK), db = vnorm(end);
      const om = Math.acos(clamp(da[0] * db[0] + da[1] * db[1] + da[2] * db[2], -1, 1));
      const so = Math.sin(om);
      const dir = vadd(vscale(da, Math.sin((1 - u) * om) / so), vscale(db, Math.sin(u * om) / so));
      const len = lerp(Math.hypot(...COCK), Math.hypot(...end), Math.min(1, u));
      const pw = smooth(clamp(u * 1.6, 0, 1));
      const swing = { target: vadd(S, vscale(vnorm(dir), len)), pole: vnorm(vadd(vscale(COCK_POLE, 1 - pw), vscale(HIT_POLE, pw))), fingers: FIST, wrist: { flex: 0.15 * pw } };
      const guardR = { target: [-0.06, 0.3, -0.1], space: 'shoulder', pole: [0.6, -0.4, -0.7], fingers: FIST };
      return mixPose(swing, guardR, K([[0, 0], [1.84, 0], [2.2, 1, 'inOut']])(t));
    })();
    const lArm = (() => {
      const shove = { ...grip(at(ctx, 'zombie', C.zombieJaw), [0.3, 0.3, 0.9], [0.4, 0.9, 0.2], { weight: 0.5 }), pole: [-0.6, -0.2, -0.8], fingers: FLAT };
      const a = mixPose(cl.victim.arm.L, shove, K([[0, 0], [1.28, 0], [1.5, 1, 'inOut'], [HOOK, 0.3, 'inOut']])(t));
      return mixPose(a, neckHold(ctx), clutch);
    })();
    const vFootR = plantedFoot([
      { t0: 0, t1: 1.4, x: VF.R[0], y: VF.R[1], yaw: VF.R[2] * DEG },
      { t0: 1.56, t1: 2.05, x: 0.2, y: -0.12, yaw: -30 * DEG },
      { t0: 2.25, t1: BI_T, x: 0.17, y: -0.3, yaw: -18 * DEG },
    ], { lift: 0.06 })(t);
    // Driven back by the surge: the left foot steps back, out of the zombie's way.
    const vFootL = plantedFoot([
      { t0: 0, t1: 0.1, x: VF.L[0], y: VF.L[1], yaw: VF.L[2] * DEG },
      { t0: 0.3, t1: 1.95, x: -0.23, y: -0.2, yaw: 16 * DEG },
      { t0: 2.15, t1: BI_T, x: -0.15, y: -0.08, yaw: 10 * DEG },
    ], { lift: 0.06 })(t);
    const screamLook = { target: [0.9, -0.3, 1.0], weight: 0.35 };
    const victimFight = merge(cl.victim, {
      root: { p: [cl.victim.root.p[0] - 0.03 * hookT, cl.victim.root.p[1] + 0.05 * Math.min(1, hookT) - 0.06 * after, cl.victim.root.p[2] - 0.03 * clutch], bend: cl.victim.root.bend + 0.12 * Math.min(1, hookT) + 0.1 * clutch, twist: cl.victim.root.twist + 0.25 * cock - 0.4 * Math.min(1, hookT) },
      spine: { bend: cl.victim.spine.bend + 0.06 * surge + 0.25 * Math.min(1, hookT) + 0.22 * clutch, twist: cl.victim.spine.twist + 0.3 * cock - 0.45 * Math.min(1, hookT), side: cl.victim.spine.side + 0.12 * clutch },
      look: mixPose(cl.victim.look, screamLook, scream),
      neck: { bend: cl.victim.neck.bend - 0.12 * scream + 0.2 * clutch, side: 0.2 * scream + 0.25 * clutch, twist: 0.25 * scream },
      head: { bend: cl.victim.head.bend - 0.12 * scream + 0.12 * clutch, side: 0.12 * scream },
      arm: { L: lArm, R: rArm },
    });
    const victim = mixPose(victimFight, recoverVictim(0, ctx), toRecover);
    victim.leg = { L: vFootL, R: vFootR };
    // ---- zombie: drives its mouth into the neck (root reach), tears, is knocked away by the hook
    const knocked = K([[0, 0], [HOOK, 0], [1.9, 0.6, 'out3'], [BI_T, 1, 'out']])(t);
    const whip = impulse(HOOK, 1, 2.2, 5)(t);
    const fall = K([[0, 0], [2.0, 0], [BI_T, 1, 'in3']])(t);
    // Comes in from the victim's left (scene -X), turned towards the neck: chests stay clear.
    const zm = zMover(CLINCH.zombieY - 0.22 * surge + 0.95 * knocked, 0.3 * surge + 0.5 * knocked, -0.17 * surge - 0.45 * knocked);
    const zKnock = merge(zombieSpine(0.9, { bend: -0.2 * knocked, side: -0.5 * knocked, neckTwist: -0.6 * whip, neckSide: -0.5 * whip, headBend: -0.2, shrug: 0.25 }), {
      mover: zm,
      root: { p: [0, -0.3 * fall, rootZ(0.95 - 0.78 * fall)], bend: -0.25 * knocked - 1.0 * fall, side: -0.3 * knocked, twist: 0 },
      arm: {
        L: { target: [-0.3, 0.1, 0.2], space: 'shoulder', pole: [-0.8, -0.3, -0.4], fingers: CLAW },
        R: { target: [0.25, 0.25, -0.05], space: 'shoulder', pole: [0.8, -0.3, -0.4], fingers: CLAW },
      },
    });
    const zombie = mixPose(cl.zombie, zKnock, K([[0, 0], [HOOK - 0.06, 0], [1.95, 1, 'out']])(t));
    zombie.mover = zm;
    // Its grip loosens while the victim shoves its jaw away and winds up.
    const loosen = 1 - 0.5 * K([[0, 0], [1.15, 0], [1.4, 1, 'inOut']])(t);
    for (const sd of ['L', 'R']) if (zombie.arm?.[sd]?.palm) zombie.arm[sd] = { ...zombie.arm[sd], palm: { ...zombie.arm[sd].palm, weight: (zombie.arm[sd].palm.weight ?? 1) * loosen } };
    // Mouth on the neck from the bite until the hook (root reach towards the bitten spot).
    zombie.rootReach = {
      bone: 'SKEL_Head', offset: C.zombieMouth[1], target: at(ctx, 'victim', C.victimNeckLeft),
      weight: K([[0, 0], [0.3, 0], [BITE, 1, 'in'], [1.2, 1], [1.5, 0, 'inOut']])(t), max: 0.3,
    };
    // Footwork: the right foot steps in outside the victim's left foot, the left follows.
    const ZB = CLINCH.zombieY - 0.22;
    zombie.leg = {
      L: plantedFoot([
        zPlant(0, 0.5, CLINCH.zombieY, ZF.L[0], ZF.L[1], ZF.L[2]),
        zPlant(0.72, HOOK - 0.02, ZB, -0.17, -0.27, 14),
        zPlant(2.0, BI_T, ZB + 0.7, -0.25, -0.05, 25, -0.4),
      ], { lift: 0.08 })(t),
      R: plantedFoot([
        zPlant(0, 0.22, CLINCH.zombieY, ZF.R[0], ZF.R[1], ZF.R[2]),
        zPlant(0.42, 1.8, ZB, 0.32, 0.02, -18),
        zPlant(2.15, BI_T, ZB + 0.85, 0.15, 0.05, -20, -0.45),
      ], { lift: 0.08 })(t),
    };
    return { victim, zombie };
  },
};

// ================================================================ RECOVER (victim only)
const recover = {
  dict: dictOf, name: 'fin_recover', duration: RC_T, loop: false,
  actors: { victim: 'male' },
  variants: genderVariants().map((v) => ({ ...v, skel: { victim: v.skel.victim } })),
  playback: { blendIn: 4.0, blendOut: -2.0, flags: 0 },
  allowSelfContact: ['victim'],
  limits: { footSlide: 0.35 },
  pose: (t, ctx) => recoverVictim(t, ctx),
};

export default [grabScene(), shove, bite, recover];
export { ROOT_REST_Z, rootZ, sin, cos, KC, LIMP, rot2, vnorm, vsub, smooth, Ease, vscale };
