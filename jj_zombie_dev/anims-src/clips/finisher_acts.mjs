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

// Zombie foot plant (its own frame at mover y) -> scene plant.
function zPlant(t0, t1, moverY, fx, fy, yawRelDeg, moverX = 0) {
  const p = toScene(zMover(moverY, 0, moverX), [fx, fy, 0]);
  return { t0, t1, x: p[0], y: p[1], yaw: PI + yawRelDeg * DEG };
}

// ================================================================ GRAB
const GR_T = 36 / 30;
const IMPACT = 0.3;
function grabScene() {
  const variants = [];
  for (let k = 0; k < 8; k++) {
    for (const gv of genderVariants()) variants.push({ ...gv, suffix: `d${k}_${gv.gender}`, dir: k, meta: { gender: gv.gender, dir: k } });
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
      const k = ctx.v.dir;
      const alphaDeg = k <= 4 ? k * 45 : (k - 8) * 45;      // victim yaw in the scene at t=0
      const alpha = alphaDeg * DEG;
      const behind = Math.abs(alphaDeg) >= 135;
      // ---- timing curves
      const lunge = K([[0, 0], [0.08, 0.05, 'in'], [IMPACT, 1, 'out3'], [0.9, 1.08, 'inOut'], [GR_T, 1.0, 'inOut']])(t);
      const turnStart = behind ? IMPACT + 0.02 : 0.2;
      const turn = K([[0, 0], [turnStart, 0.0], [behind ? 0.85 : 0.75, 1, 'inOut3'], [GR_T, 1]])(t);
      const toClinch = K([[0, 0], [IMPACT, 0], [0.92, 1, 'inOut']])(t);
      const startle = K([[0, 0], [0.12, 0], [0.26, 1, 'out3'], [0.6, 0.6, 'inOut'], [GR_T, 0]])(t);
      const jolt = impulse(IMPACT, 1.0, 3.2, 6.5)(t);
      const yaw = alpha * (1 - turn);
      // ---- victim feet: initial stance rotated by alpha, two pivot steps into the clinch stance
      const init = (x, y) => rot2(x, y, alpha);
      const mid = (x, y) => rot2(x, y, alpha * 0.45);
      const [l0x, l0y] = init(-0.11, 0.02), [r0x, r0y] = init(0.11, -0.02);
      const [r1x, r1y] = mid(0.15, -0.16);
      const step1 = behind ? [IMPACT + 0.05, IMPACT + 0.25] : [0.34, 0.52];
      const step2 = behind ? [0.62, 0.84] : [0.55, 0.74];
      const footR = plantedFoot([
        { t0: 0, t1: step1[0], x: r0x, y: r0y, yaw: alpha },
        { t0: step1[1], t1: step2[0] + 0.05, x: r1x, y: r1y - 0.06, yaw: alpha * 0.45 - 10 * DEG },
        { t0: step2[1] + 0.1, t1: GR_T, x: VF.R[0], y: VF.R[1], yaw: VF.R[2] * DEG },
      ], { lift: 0.08 })(t);
      const footL = plantedFoot([
        { t0: 0, t1: step2[0], x: l0x, y: l0y, yaw: alpha },
        { t0: step2[1], t1: GR_T, x: VF.L[0], y: VF.L[1], yaw: VF.L[2] * DEG },
      ], { lift: 0.08 })(t);
      // ---- victim body
      const zHead = at(ctx, 'zombie', C.zombieMouth);
      const vEarly = {
        mover: { p: [0, 0, 0], yaw },
        root: { p: [0, -0.07 * jolt, -0.02 - 0.05 * startle], bend: -0.12 * jolt, twist: 0, side: 0 },
        spine: { bend: -0.25 * jolt - 0.05 * startle, twist: 0.0, side: 0 },
        clav: { L: { up: 0.25 * startle, fwd: 0.1 }, R: { up: 0.25 * startle, fwd: 0.1 } },
        look: { target: zHead, weight: 0.9 * startle },
        neck: { bend: -0.2 * jolt }, head: { bend: -0.1 * jolt },
        arm: {
          L: { target: [-0.05 - 0.1 * startle, 0.08 + 0.32 * startle, -0.48 + 0.42 * startle], space: 'shoulder', pole: [-0.6, -0.4, -0.7], fingers: { curl: 0.35 + 0.2 * startle, spread: 0.4 * startle } },
          R: { target: [0.05 + 0.1 * startle, 0.08 + 0.32 * startle, -0.48 + 0.42 * startle], space: 'shoulder', pole: [0.6, -0.4, -0.7], fingers: { curl: 0.35 + 0.2 * startle, spread: 0.4 * startle } },
        },
      };
      const cl = clinch(ctx, {});
      const victim = mixPose(vEarly, cl.victim, toClinch);
      victim.mover = { p: [0, 0, 0], yaw };
      victim.leg = { L: footL, R: footR };
      // ---- zombie: lunge from 1.0 m, both hands slam onto the shoulders at the impact
      const zY = lerp(1.0, CLINCH.zombieY, Math.min(1, lunge));
      const zm = zMover(zY + (lunge > 1 ? -(lunge - 1) * 0.5 : 0));
      const zStepR = plantedFoot([
        zPlant(0, 0.06, 1.0, ZF.R[0], -0.02, ZF.R[2]),
        zPlant(0.24, GR_T, CLINCH.zombieY, ZF.R[0], ZF.R[1], ZF.R[2]),
      ], { lift: 0.12 })(t);
      const zStepL = plantedFoot([
        zPlant(0, 0.3, 1.0, ZF.L[0], -0.12, ZF.L[2]),
        zPlant(0.52, GR_T, CLINCH.zombieY, ZF.L[0], ZF.L[1], ZF.L[2]),
      ], { lift: 0.09 })(t);
      // Hands: reach (before impact) -> grip the shoulders (front grip, or from behind first).
      const reachW = K([[0, 0.15], [IMPACT - 0.04, 1, 'out']])(t);
      let zArmsEarly;
      if (behind) {
        // Grabs the back of the shoulders first, lets go while the victim spins, re-grips in front.
        const backR = at(ctx, 'victim', ['SKEL_R_UpperArm', [-0.02, -0.1, 0.05]]);
        const backL = at(ctx, 'victim', ['SKEL_L_UpperArm', [0.02, -0.1, 0.05]]);
        // Victim faces away: his LEFT shoulder is on the zombie's left side (scene +X).
        const leftTarget = alphaDeg > 0 ? backL : backR;
        const rightTarget = alphaDeg > 0 ? backR : backL;
        zArmsEarly = {
          L: { ...grip(leftTarget, [0.1, 0.6, -0.75], [0, 0.4, -0.9], { weight: 0.6 }), pole: [-0.9, 0, -0.45], fingers: GRAB },
          R: { ...grip(rightTarget, [-0.1, 0.6, -0.75], [0, 0.4, -0.9], { weight: 0.6 }), pole: [0.9, 0, -0.45], fingers: GRAB },
        };
      } else {
        zArmsEarly = {
          L: { ...cl.zombie.arm.L, fingers: CLAW },
          R: { ...cl.zombie.arm.R, fingers: CLAW },
        };
      }
      const zEarly = merge(zombieSpine(1.3, { bend: 0.15 - 0.1 * reachW, neckBend: 0.1, headBend: 0.1, shrug: 0.2 }), {
        mover: zm,
        root: { p: [0, 0.03, -0.1 + 0.05 * reachW], bend: 0.28 },
        look: { target: at(ctx, 'victim', C.victimNeckLeft), weight: 0.6 },
        arm: zArmsEarly,
      });
      const zWeight = behind ? K([[0, 0], [0.5, 0.0], [0.95, 1, 'inOut']])(t) : toClinch;
      const zombie = mixPose(zEarly, cl.zombie, zWeight);
      zombie.mover = zm;
      zombie.leg = { L: zStepL, R: zStepR };
      return { victim, zombie };
    },
  };
}

// ================================================================ SHOVE (success)
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
    const gather = K([[0, 0], [0.28, 1, 'inOut'], [SH_IMPACT, 0, 'out3']])(t);
    const drive = K([[0, 0], [0.26, 0], [SH_IMPACT, 1, 'strike'], [0.6, 0.7, 'out'], [1.1, 0.0, 'inOut']])(t);
    const cl = clinch(ctx, { zPush: 0.04 * gather, vLean: 0.3 * gather, mouth: 0.5 * gather, armGive: 0.6 * gather });
    // ---- victim
    const vFootL = plantedFoot([
      { t0: 0, t1: 0.3, x: VF.L[0], y: VF.L[1], yaw: VF.L[2] * DEG },
      { t0: 0.44, t1: SH_T, x: -0.15, y: 0.3, yaw: 6 * DEG },
    ], { lift: 0.07 })(t);
    const vFootR = plantedFoot([
      { t0: 0, t1: 0.75, x: VF.R[0], y: VF.R[1], yaw: VF.R[2] * DEG },
      { t0: 0.95, t1: SH_T, x: 0.17, y: -0.12, yaw: -20 * DEG },
    ], { lift: 0.06 })(t);
    const zChest = at(ctx, 'zombie', ['SKEL_Spine3', [0, 0.12, 0.04]]);
    const handsOn = K([[0, 1], [0.48, 1], [0.62, 0, 'inOut']])(t);
    const guard = K([[0, 0], [0.55, 0], [0.95, 1, 'inOut']])(t);
    const push = (side) => {
      const sx = side === 'R' ? 1 : -1;
      const c = vadd(zChest, [sx * 0.11, 0, 0.02]);
      const g = grip(c, [sx * 0.15, 0.1, 1], [0, 1, 0.1], { palmCenter: 0.07, weight: 0.7 });
      const guardT = [sx * -0.06, 0.32, -0.08];
      return { ...g, blend: { target: guardT, space: 'shoulder', w: guard }, pole: [sx * 0.6, -0.3, -0.75], fingers: guard > 0.5 ? FIST : FLAT };
    };
    const victimDrive = {
      mover: { p: [0, 0, 0], yaw: 0 },
      root: { p: [0, -0.04 * gather + 0.17 * drive, -0.1 * gather - 0.04 * drive - 0.06], bend: -0.05 * gather + 0.12 * drive, twist: 0.12 * gather - 0.05 * drive },
      spine: { bend: -0.18 * gather + 0.2 * drive, twist: 0.1 * gather - 0.08 * drive },
      clav: { L: { up: 0.05, fwd: 0.05 - 0.1 * gather + 0.3 * drive }, R: { up: 0.05, fwd: 0.05 - 0.1 * gather + 0.3 * drive } },
      look: { target: at(ctx, 'zombie', ['SKEL_Head', [0, 0, 0]]), weight: 0.8 },
      neck: { bend: 0.05 }, head: { bend: 0.05 },
      arm: { L: push('L'), R: push('R') },
    };
    const victim = mixPose(cl.victim, victimDrive, K([[0, 0], [0.18, 1, 'inOut']])(t));
    victim.arm = handsOn > 0.001 ? mixPose(victim.arm, victimDrive.arm, K([[0, 0], [0.2, 1, 'inOut']])(t)) : victimDrive.arm;
    victim.leg = { L: vFootL, R: vFootR };
    // ---- zombie: thrown backwards at the impact (ragdoll takes over in game; this is the fallback)
    const fly = K([[0, 0], [SH_IMPACT, 0], [0.62, 0.7, 'out'], [1.0, 1.1, 'out'], [SH_T, 1.25, 'out']])(t);
    const whip = K([[0, 0], [SH_IMPACT, 0], [0.5, 1, 'out3'], [0.9, 0.8], [SH_T, 1.3, 'in']])(t);
    const fall = K([[0, 0], [0.8, 0], [SH_T, 1, 'in3']])(t);
    const zY = CLINCH.zombieY - 0.04 * gather + fly;
    const zm = zMover(zY);
    const zFootR = plantedFoot([
      zPlant(0, 0.48, CLINCH.zombieY, ZF.R[0], ZF.R[1], ZF.R[2]),
      zPlant(0.66, SH_T, CLINCH.zombieY + 0.75, 0.16, -0.05, -10),
    ], { lift: 0.12 })(t);
    const zFootL = plantedFoot([
      zPlant(0, 0.56, CLINCH.zombieY, ZF.L[0], ZF.L[1], ZF.L[2]),
      zPlant(0.8, SH_T, CLINCH.zombieY + 1.1, -0.2, -0.1, 18),
    ], { lift: 0.1 })(t);
    const flail = (side) => {
      const sx = side === 'R' ? 1 : -1;
      return { target: [sx * (0.1 + 0.2 * whip), 0.3 - 0.1 * whip, 0.1 + 0.3 * whip], space: 'shoulder', pole: [sx * 0.8, -0.3, -0.4], fingers: CLAW };
    };
    const zThrown = merge(zombieSpine(1.0 - 0.8 * whip, { bend: -0.45 * whip, neckBend: -0.3 * whip, headBend: -0.35 * whip, shrug: 0.2 * whip }), {
      mover: zm,
      root: { p: [0, -0.3 * fall, rootZ(0.95 - 0.8 * fall)], bend: -0.3 * whip - 1.0 * fall },
      arm: { L: flail('L'), R: flail('R') },
      look: { target: [0, 0, 0.6], weight: 0 },
    });
    const zombie = mixPose(cl.zombie, zThrown, K([[0, 0], [SH_IMPACT - 0.03, 0], [0.5, 1, 'out']])(t));
    zombie.mover = zm;
    zombie.leg = { L: zFootL, R: zFootR };
    return { victim, zombie };
  },
};

// ================================================================ BITE (failure)
const BI_T = 84 / 30;
const BITE = 0.5, HOOK = 1.68;
const bite = {
  dict: dictOf, name: 'fin_bite', duration: BI_T, loop: false,
  actors: { victim: 'male', zombie: 'zombie' },
  variants: genderVariants(),
  events: [{ name: 'bite', t: BITE }, { name: 'impact', t: HOOK }, { name: 'release', t: 2.5 }],
  contacts: () => [
    { actor: 'zombie', bone: 'SKEL_Head', target: { actor: 'victim', bone: C.victimNeckLeft[0], offset: C.victimNeckLeft[1] }, from: BITE, to: 1.25, max: 0.17 },
    ...clinchContacts(0, 0.3).slice(0, 2),
  ],
  allowTouch: [...CLINCH_TOUCH, ['zombie.head', 'victim.*'], ['victim.foreR', 'zombie.head']],
  limits: { angVel: 2300, linVel: 11, footSlide: 0.35, floatFeet: 0.2, penetration: 0.05 },
  actorLimits: { zombie: { floatFeet: 1.0, groundPen: 0.06, spineSeg: 45 } },
  allowSelfContact: ['victim', 'zombie'],
  airborne: { zombie: [[HOOK, BI_T]] },
  leadsTo: (v) => [{ name: 'fin_recover', variant: v.gender }],
  pose(t, ctx) {
    const surge = K([[0, 0], [0.42, 1, 'in3'], [1.3, 1], [1.62, 0.4, 'inOut'], [HOOK, 0]])(t);
    const tear = (t > BITE && t < 1.35) ? sin(2 * PI * 3.2 * (t - BITE)) * Math.exp(-1.2 * (t - BITE)) : 0;
    const cl = clinch(ctx, {
      zPush: 0.12 * surge, vLean: 1.1 * surge, mouth: 1.4 * surge, armGive: 1.5 * surge, jaw: 0.6 - 0.6 * surge,
      headLunge: 0.35 * bump(0.35, 0.62, 1)(t), headShake: 0.32 * tear, vShakeX: 0.02 * tear, zShakeX: 0.02 * tear,
    });
    // ---- victim: scream (head thrown back), then the hook, then a hand on the bitten neck.
    const scream = K([[0, 0], [BITE, 0.2], [0.65, 1, 'out3'], [1.3, 0.8], [1.5, 0, 'inOut']])(t);
    const cock = K([[0, 0], [1.3, 0], [1.58, 1, 'inOut'], [HOOK, 0, 'strike']])(t);
    const hookT = K([[0, 0], [1.56, 0], [HOOK, 1, 'strike'], [1.85, 1], [2.1, 0, 'inOut']])(t);
    const clutch = K([[0, 0], [1.9, 0], [2.25, 1, 'inOut']])(t);
    const after = K([[0, 0], [HOOK, 0], [2.3, 1, 'inOut']])(t);
    const zTemple = at(ctx, 'zombie', C.zombieTemple);
    const zFace = at(ctx, 'zombie', ['SKEL_Head', [-0.02, 0.08, 0.05]]);
    const ownNeck = at(ctx, 'victim', ['SKEL_Neck_1', [-0.07, 0.04, -0.01]]);
    const rArm = (() => {
      if (t < 1.3) {
        // Claws at the zombie's face, trying to tear it off the neck.
        const g = grip(zFace, [-0.2, 0.3, 0.9], [0, 1, 0.2], { palmCenter: 0.06, weight: 0.5 });
        return mixPose(cl.victim.arm.R, { ...g, pole: [0.6, -0.2, -0.8], fingers: CLAW }, K([[0, 0], [0.6, 0], [0.85, 1, 'inOut']])(t));
      }
      // Cock back, then a hook to the zombie's left temple, then guard.
      const cocked = { target: [0.12, -0.12, 0.02], space: 'shoulder', pole: [0.8, -0.6, -0.2], fingers: FIST };
      const hit = { target: vadd(zTemple, [0.06, -0.06, 0]), pole: [0.9, 0.2, -0.3], fingers: FIST, wrist: { flex: 0.2 } };
      const guardR = { target: [-0.05, 0.3, -0.1], space: 'shoulder', pole: [0.6, -0.4, -0.7], fingers: FIST };
      let a = mixPose({ ...cl.victim.arm.R, fingers: CLAW }, cocked, clamp((t - 1.3) / 0.25, 0, 1));
      a = mixPose(a, hit, hookT);
      return mixPose(a, guardR, after * (1 - hookT));
    })();
    const lArm = (() => {
      const shove = { ...grip(at(ctx, 'zombie', C.zombieJaw), [0.3, 0.3, 0.9], [0, 1, 0.3], { weight: 0.5 }), pole: [-0.6, -0.2, -0.8], fingers: FLAT };
      let a = mixPose(cl.victim.arm.L, shove, K([[0, 0], [1.28, 0], [1.5, 1, 'inOut'], [HOOK, 0.3, 'inOut']])(t));
      const neckHold = { ...grip(ownNeck, [0.4, 0.3, 0.6], [0.6, -0.2, 0.0], { palmCenter: 0.05, weight: 0.5 }), pole: [-0.7, -0.4, -0.5], fingers: { curl: 0.35, spread: 0.3 } };
      return mixPose(a, neckHold, clutch);
    })();
    const vFootR = plantedFoot([
      { t0: 0, t1: 1.4, x: VF.R[0], y: VF.R[1], yaw: VF.R[2] * DEG },
      { t0: 1.56, t1: 2.05, x: 0.2, y: -0.12, yaw: -30 * DEG },
      { t0: 2.25, t1: BI_T, x: 0.17, y: -0.3, yaw: -18 * DEG },
    ], { lift: 0.06 })(t);
    const vFootL = plantedFoot([
      { t0: 0, t1: 1.95, x: VF.L[0], y: VF.L[1], yaw: VF.L[2] * DEG },
      { t0: 2.15, t1: BI_T, x: -0.15, y: -0.08, yaw: 10 * DEG },
    ], { lift: 0.06 })(t);
    const victim = merge(cl.victim, {
      root: { p: [0.02 * cl.victim.root.p[0] - 0.03 * hookT, cl.victim.root.p[1] + 0.06 * hookT - 0.08 * after, cl.victim.root.p[2] - 0.04 * clutch], bend: cl.victim.root.bend + 0.12 * hookT + 0.1 * clutch, twist: cl.victim.root.twist + 0.35 * cock - 0.55 * hookT },
      spine: { bend: cl.victim.spine.bend - 0.25 * scream + 0.3 * hookT + 0.25 * clutch, twist: 0.08 + 0.4 * cock - 0.6 * hookT, side: 0.03 + 0.15 * clutch },
      look: { target: [0.9, -0.4, 1.0], weight: 0.5 * scream + 0.3 * (1 - after) },
      neck: { bend: -0.15 - 0.35 * scream + 0.2 * clutch, side: 0.25 * clutch },
      head: { bend: -0.12 - 0.35 * scream + 0.15 * clutch },
      arm: { L: lArm, R: rArm },
      leg: { L: vFootL, R: vFootR },
    });
    // ---- zombie: dives to the neck, tears, then is knocked away by the hook.
    const knocked = K([[0, 0], [HOOK, 0], [1.9, 0.6, 'out3'], [BI_T, 1, 'out']])(t);
    const fall = K([[0, 0], [2.0, 0], [BI_T, 1, 'in3']])(t);
    const zm = zMover(CLINCH.zombieY - 0.12 * surge + 0.75 * knocked, 0.5 * knocked, -0.45 * knocked);
    const zKnock = merge(zombieSpine(0.9, { bend: -0.2 * knocked, side: -0.5 * knocked, neckTwist: -0.6, neckSide: -0.5, headBend: -0.2, shrug: 0.25 }), {
      mover: zm,
      root: { p: [0, -0.3 * fall, rootZ(0.95 - 0.78 * fall)], bend: -0.25 * knocked - 1.0 * fall, side: -0.3 * knocked },
      arm: {
        L: { target: [-0.3, 0.1, 0.2], space: 'shoulder', pole: [-0.8, -0.3, -0.4], fingers: CLAW },
        R: { target: [0.25, 0.25, -0.05], space: 'shoulder', pole: [0.8, -0.3, -0.4], fingers: CLAW },
      },
    });
    const zombie = mixPose(cl.zombie, zKnock, K([[0, 0], [HOOK - 0.02, 0], [1.82, 1, 'out']])(t));
    zombie.mover = zm;
    zombie.leg = {
      L: plantedFoot([
        zPlant(0, 1.75, CLINCH.zombieY, ZF.L[0], ZF.L[1], ZF.L[2]),
        zPlant(2.0, BI_T, CLINCH.zombieY + 0.6, -0.25, -0.05, 25, -0.4),
      ], { lift: 0.1 })(t),
      R: plantedFoot([
        zPlant(0, 0.3, CLINCH.zombieY, ZF.R[0], ZF.R[1], ZF.R[2]),
        zPlant(0.45, 1.8, CLINCH.zombieY - 0.12, ZF.R[0], ZF.R[1] + 0.05, ZF.R[2]),
        zPlant(2.15, BI_T, CLINCH.zombieY + 0.75, 0.15, 0.05, -20, -0.45),
      ], { lift: 0.1 })(t),
    };
    return { victim, zombie };
  },
};

// ================================================================ RECOVER (victim only)
const RC_T = 42 / 30;
const recover = {
  dict: dictOf, name: 'fin_recover', duration: RC_T, loop: false,
  actors: { victim: 'male' },
  variants: genderVariants().map((v) => ({ ...v, skel: { victim: v.skel.victim } })),
  playback: { blendIn: 4.0, blendOut: -2.0, flags: 0 },
  allowSelfContact: ['victim'],
  limits: { footSlide: 0.35 },
  pose(t, ctx) {
    const hold = K([[0, 1], [0.8, 1], [RC_T, 0, 'inOut']])(t);
    const straighten = K([[0, 0], [0.4, 0.1], [RC_T, 1, 'inOut']])(t);
    const ownNeck = at(ctx, 'victim', ['SKEL_Neck_1', [-0.07, 0.04, -0.01]]);
    const footL = plantedFoot([
      { t0: 0, t1: 0.35, x: -0.15, y: -0.08, yaw: 10 * DEG },
      { t0: 0.6, t1: RC_T, x: -0.12, y: 0.12, yaw: 6 * DEG },
    ], { lift: 0.07 })(t);
    const footR = plantedFoot([
      { t0: 0, t1: 0.75, x: 0.17, y: -0.3, yaw: -18 * DEG },
      { t0: 1.0, t1: RC_T, x: 0.12, y: 0.0, yaw: -8 * DEG },
    ], { lift: 0.07 })(t);
    const neckHand = { ...grip(ownNeck, [0.4, 0.3, 0.6], [0.6, -0.2, 0.0], { palmCenter: 0.05, weight: 0.5 }), pole: [-0.7, -0.4, -0.5], fingers: { curl: 0.35, spread: 0.3 } };
    const relaxedL = { target: [0.0, 0.05, -0.5], space: 'shoulder', pole: [-0.3, -1, 0], fingers: { curl: 0.3 } };
    return {
      root: { p: [0.01 * (1 - straighten), 0.06 * straighten, -0.1 + 0.08 * straighten], bend: 0.15 * (1 - straighten) },
      spine: { bend: 0.3 * (1 - straighten), side: 0.15 * (1 - straighten), twist: 0.05 },
      neck: { bend: 0.15 * (1 - straighten), side: 0.25 * hold },
      head: { bend: 0.1 * (1 - straighten) },
      leg: { L: footL, R: footR },
      arm: {
        L: mixPose(neckHand, relaxedL, 1 - hold),
        R: { target: [0.02, 0.1 - 0.05 * straighten, -0.47], space: 'shoulder', pole: [0.3, -1, 0], fingers: { curl: 0.35 } },
      },
    };
  },
};

export default [grabScene(), shove, bite, recover];
export { ROOT_REST_Z, rootZ, sin, cos, KC, LIMP, rot2, vnorm, vsub, smooth, Ease, vscale };
