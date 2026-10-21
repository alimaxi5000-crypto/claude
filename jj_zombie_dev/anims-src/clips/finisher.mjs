// Paired finisher scenes (dictionaries jjz_fin_m / jjz_fin_f, victim male or female).
// Scene frame: the victim stands at the origin facing +Y, the zombie faces -Y in front of him.
// Every clip of the sequence shares this frame, so grab -> struggle loops -> shove / bite chain
// without any repositioning. All struggle loops start and end in the same clinch pose (seam).
//
// Contacts are solved with IK against the OTHER actor's posed bones (ctx.at), so female and
// male victims get matching hand/mouth placement automatically.
import {
  plantedFoot, zombieSpine, merge, grip, CLAW, GRAB, FLAT, FIST, LIMP, K, KC, DEG, GROUND, ANKLE_H,
  toScene, rot2, dirYaw, vnorm, vadd, vsub, vscale, clamp, lerp, smooth, Ease,
} from '../lib/kit.mjs';
import { impulse, bump } from '../../tools/animcore/author.mjs';

const sin = Math.sin, cos = Math.cos, PI = Math.PI;
const ROOT_REST_Z = -0.019;

// ---------------------------------------------------------------- variants
const GENDERS = [{ g: 'm', skel: 'male' }, { g: 'f', skel: 'female' }];
const genderVariants = () => GENDERS.map(({ g, skel }) => ({ suffix: g, gender: g, skel: { victim: skel, zombie: 'zombie' }, meta: { gender: g } }));
const dictOf = (v) => `jjz_fin_${v.gender}`;

// ---------------------------------------------------------------- clinch geometry
export const CLINCH = {
  zombieY: 0.56,                 // zombie mover distance in front of the victim
  victimFeet: { L: [-0.14, 0.06, 8], R: [0.16, -0.28, -24] },   // x, y, yaw(deg) scene
  zombieFeet: { L: [-0.17, -0.30, 12], R: [0.13, 0.10, -6] },   // x, y, yawRel(deg) zombie body frame
};
const zMover = (y = CLINCH.zombieY, yawOff = 0, x = 0) => ({ p: [x, y, 0], yaw: PI + yawOff });

// Contact points (offsets in each bone's REST model frame: +X right, +Y front, +Z up).
const C = {
  victimShoulderTop: (side) => ['SKEL_' + side + '_UpperArm', [side === 'R' ? -0.03 : 0.03, -0.01, 0.075]],
  victimNeckLeft: ['SKEL_Neck_1', [-0.055, 0.02, 0.01]],
  victimNeckFront: ['SKEL_Neck_1', [-0.02, 0.06, 0.0]],
  zombieChest: (side) => ['SKEL_Spine3', [side === 'R' ? 0.1 : -0.1, 0.12, 0.07]],
  zombieThroat: ['SKEL_Neck_1', [0.0, 0.075, -0.015]],
  zombieJaw: ['SKEL_Head', [0.0, 0.085, -0.05]],
  zombieMouth: ['SKEL_Head', [0.0, 0.1, -0.02]],
  zombieTemple: ['SKEL_Head', [0.07, 0.03, 0.06]],
};
const at = (ctx, actor, [bone, off]) => ctx.at(actor, bone, off);

const env = (t, T) => sin(PI * t / T) ** 2;        // zero value + zero velocity at the seam

// Victim feet (planted, scene space).
function victimLegs(extra = {}) {
  const f = CLINCH.victimFeet;
  return {
    L: { target: [f.L[0], f.L[1], GROUND + ANKLE_H], foot: { yaw: f.L[2] * DEG }, ...(extra.L || {}) },
    R: { target: [f.R[0], f.R[1], GROUND + ANKLE_H], foot: { yaw: f.R[2] * DEG }, ...(extra.R || {}) },
  };
}
// Zombie feet given in its own frame at the clinch position, returned in scene space.
function zombieLegs(moverY = CLINCH.zombieY, extra = {}) {
  const f = CLINCH.zombieFeet;
  const m = zMover(moverY);
  const out = {};
  for (const s of ['L', 'R']) {
    const p = toScene(m, [f[s][0], f[s][1], GROUND + ANKLE_H]);
    out[s] = { target: p, foot: { yaw: PI + f[s][2] * DEG }, ...(extra[s] || {}) };
  }
  return out;
}

// The clinch: zombie grips both shoulders and drives its mouth towards the victim's neck; the
// victim braces, left hand against the zombie's chest, right hand jammed under its jaw.
// p: { zPush (m, + = zombie closer), vLean (+ = victim leans back more), mouth (0..1 closer),
//      headShake, vShake, zShake, armGive (0..1 elbows buckle), jaw (0..1 hand under jaw) }
function clinch(ctx, p = {}) {
  const zPush = p.zPush || 0, vLean = p.vLean || 0, give = p.armGive || 0;
  const zY = CLINCH.zombieY - zPush;
  // --- victim
  const vRoot = { p: [0.0 + (p.vShakeX || 0), -0.03 - 0.06 * vLean, ROOT_REST_Z * 0 - 0.075 - 0.02 * vLean], bend: -0.05 - 0.06 * vLean, twist: 0.1, side: -0.02 };
  const neck = at(ctx, 'victim', C.victimNeckLeft);
  // Mouth approach: the zombie's head aims at the neck; "mouth" pulls it closer.
  const mouthAim = neck;
  // Victim hands.
  const zChestL = at(ctx, 'zombie', C.zombieChest('R'));    // zombie's right chest = scene -X
  const zThroat = at(ctx, 'zombie', C.zombieThroat);
  const zJaw = at(ctx, 'zombie', C.zombieJaw);
  const rContact = vadd(vscale(zThroat, 1 - (p.jaw ?? 0.6)), vscale(zJaw, p.jaw ?? 0.6));
  const vL = grip(zChestL, [0.2, 0.15, 1], [0.1, 1, 0.1], { palmCenter: 0.07, weight: 0.75 });
  const vR = grip(rContact, [-0.35, 0.35, 0.85], [-0.8, 0.5, 0.3], { palmCenter: 0.06, weight: 0.6 });
  const victim = {
    mover: { p: [0, 0, 0], yaw: 0 },
    root: vRoot,
    pelvis: { twist: -0.06 },
    spine: { bend: -0.1 - 0.12 * vLean, twist: 0.08 + 0.05 * vLean, side: 0.03 },
    clav: { L: { up: 0.08 + 0.05 * give, fwd: 0.1 }, R: { up: 0.12, fwd: 0.16 } },
    look: { target: [0.85, 0.15, 0.62], weight: 0.55 },
    neck: { bend: -0.15 - 0.1 * vLean },
    head: { bend: -0.12 - 0.1 * vLean + (p.vHeadJerk || 0) },
    leg: victimLegs(),
    arm: {
      L: { ...vL, pole: [-0.55, -0.15, -0.8], fingers: GRAB, wrist: { flex: 0 } },
      R: { ...vR, pole: [0.65, -0.1, -0.75], fingers: FLAT },
    },
  };
  // --- zombie
  const zm = zMover(zY);
  const vShR = at(ctx, 'victim', C.victimShoulderTop('R'));  // gripped by the zombie's LEFT hand (scene +X)
  const vShL = at(ctx, 'victim', C.victimShoulderTop('L'));  // gripped by the zombie's RIGHT hand (scene -X)
  const zL = grip(vShR, [0.05, -0.75, -0.65], [0.0, -0.3, -0.95], { palmCenter: 0.07, weight: 0.7 });
  const zR = grip(vShL, [-0.05, -0.75, -0.65], [0.0, -0.3, -0.95], { palmCenter: 0.07, weight: 0.7 });
  const zombie = merge(zombieSpine(1.2, {
    bend: 0.12 + 0.08 * (p.mouth || 0), shrug: 0.12,
    neckBend: 0.15 + 0.15 * (p.mouth || 0) + (p.headLunge || 0), headBend: 0.08 + 0.5 * (p.headLunge || 0),
  }), {
    mover: zm,
    root: { p: [0.0 + (p.zShakeX || 0), -0.04, -0.06], bend: 0.18 + 0.05 * (p.mouth || 0), twist: 0.04 },
    look: { target: mouthAim, weight: 0.75 },
    head: { side: (p.headShake || 0), twist: -0.12 + 0.5 * (p.headShake || 0) },
    leg: zombieLegs(CLINCH.zombieY),   // feet stay planted; only the body pushes in and out
    arm: {
      L: { ...zL, pole: [-0.9, 0.0, -0.45], fingers: GRAB },
      R: { ...zR, pole: [0.9, 0.0, -0.45], fingers: GRAB },
    },
  });
  return { victim, zombie };
}

// Contacts checked by the build for every clinch-based clip.
const clinchContacts = (from, to) => [
  { actor: 'zombie', bone: 'SKEL_L_Hand', target: { actor: 'victim', bone: C.victimShoulderTop('R')[0], offset: C.victimShoulderTop('R')[1] }, from, to, max: 0.12 },
  { actor: 'zombie', bone: 'SKEL_R_Hand', target: { actor: 'victim', bone: C.victimShoulderTop('L')[0], offset: C.victimShoulderTop('L')[1] }, from, to, max: 0.12 },
  { actor: 'victim', bone: 'SKEL_L_Hand', target: { actor: 'zombie', bone: C.zombieChest('R')[0], offset: C.zombieChest('R')[1] }, from, to, max: 0.12 },
];
// Bodies in a clinch touch: arms against arms/chest are expected contact, not penetration.
const CLINCH_TOUCH = [
  ['zombie.foreL', 'victim.*'], ['zombie.foreR', 'victim.*'], ['zombie.upperL', 'victim.foreR'], ['zombie.upperR', 'victim.foreL'],
  ['victim.foreL', 'zombie.*'], ['victim.foreR', 'zombie.*'], ['victim.upperL', 'zombie.foreR'], ['victim.upperR', 'zombie.foreL'],
  ['zombie.head', 'victim.chest'], ['zombie.head', 'victim.neck'], ['zombie.head', 'victim.head'], ['zombie.head', 'victim.upperL'], ['zombie.head', 'victim.foreR'],
];

// ---------------------------------------------------------------- struggle loops
const ST_T = 36 / 30;
function struggle(name, kind) {
  return {
    dict: dictOf, name, duration: ST_T, loop: true,
    actors: { victim: 'male', zombie: 'zombie' },
    variants: genderVariants(),
    events: kind === 'high' ? [{ name: 'snap', t: 0.6 }] : kind === 'mid' ? [{ name: 'snap', t: 0.55 }] : [{ name: 'snap', t: 0.32 }, { name: 'snap', t: 0.86 }],
    contacts: () => clinchContacts(0, ST_T),
    allowTouch: CLINCH_TOUCH,
    leadsTo: (v) => ['fin_struggle_low', 'fin_struggle_mid', 'fin_struggle_high', 'fin_shove', 'fin_bite'].map((n) => ({ name: n, variant: v.suffix })),
    pose(t, ctx) {
      const e = env(t, ST_T);
      const w = 2 * PI * t / ST_T;
      let p;
      // Fast tremble of two bodies straining against each other (enveloped: zero at the seam).
      const tremV = 0.012 * sin(7 * w) * e, tremZ = 0.014 * sin(6 * w + 1.3) * e;
      if (kind === 'low') {
        // Zombie winning: it drives in and snaps twice, the victim's arms buckle, head turned away.
        const snap = Math.exp(-70 * (t - 0.32) ** 2) + Math.exp(-70 * (t - 0.86) ** 2);
        p = { zPush: 0.1 * e, vLean: 0.9 * e, mouth: 1.0 * e, armGive: 1.0 * e, headLunge: 0.32 * snap, jaw: 0.6 - 0.45 * e,
          vShakeX: tremV, zShakeX: tremZ, vHeadJerk: -0.12 * snap, headShake: 0.1 * sin(5 * w) * e };
      } else if (kind === 'high') {
        // Player winning: arms lock out, the zombie's head is shoved back, it claws and snarls.
        const snap = Math.exp(-70 * (t - 0.6) ** 2);
        p = { zPush: -0.075 * e, vLean: -0.6 * e, mouth: -0.9 * e, armGive: -0.45 * e, headLunge: 0.14 * snap - 0.3 * e, jaw: 0.6 + 0.4 * e,
          vShakeX: tremV, zShakeX: 1.4 * tremZ, headShake: 0.12 * sin(4 * w) * e };
      } else {
        // Even: shoving back and forth, one hard snap at the turning point.
        const snap = Math.exp(-70 * (t - 0.55) ** 2);
        p = { zPush: 0.055 * sin(w), vLean: 0.45 * sin(w), mouth: 0.5 * sin(w), armGive: 0.4 * sin(w), headLunge: 0.26 * snap,
          vShakeX: tremV, zShakeX: tremZ, headShake: 0.12 * sin(2 * w) * e, vHeadJerk: -0.08 * snap };
      }
      return clinch(ctx, p);
    },
  };
}

export default [
  struggle('fin_struggle_low', 'low'),
  struggle('fin_struggle_mid', 'mid'),
  struggle('fin_struggle_high', 'high'),
];
export { CLINCH_TOUCH, clinch, clinchContacts, genderVariants, dictOf, zMover, C, at, env, ST_T, victimLegs, zombieLegs };
export { plantedFoot, K, KC, impulse, bump, FIST, LIMP, CLAW, FLAT, GRAB, rot2, dirYaw, vnorm, vsub, clamp, lerp, smooth, Ease, cos };
