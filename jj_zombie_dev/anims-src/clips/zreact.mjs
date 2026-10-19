// Zombie reactions (dictionary jjz_react): hit flinches, staggers, deaths, reaching (upper body
// while closing in), swipe (fallback attack) and custom get-ups after being knocked down.
import { plantedFoot, zombieSpine, merge, addRot, CLAW, LIMP, K, KC, DEG, GROUND, ANKLE_H } from '../lib/kit.mjs';
import { impulse, loopWobble } from '../../tools/animcore/author.mjs';

const DICT = 'jjz_react';
const sin = Math.sin;
const STAND = {
  L: { target: [-0.15, 0.06, GROUND + ANKLE_H], foot: { yaw: 10 * DEG } },
  R: { target: [0.14, -0.1, GROUND + ANKLE_H], foot: { yaw: -16 * DEG } },
};
const ROOT_REST_Z = -0.019;
// Root offset that puts the pelvis at height h above the ground.
const rootZ = (h) => GROUND + h - ROOT_REST_Z;

// ---------------------------------------------------------------- flinches (upper body overlays)
function flinch(name, dir) {
  const jolt = K([[0, 0], [0.07, 1, 'out3'], [0.5, 0, 'inOut3']]);
  const wob = impulse(0.07, 0.12, 7, 9);
  return {
    dict: DICT, name, duration: 0.5, loop: false,
    actors: { zombie: 'zombie' },
    playback: { blendIn: 8.0, blendOut: -4.0, flags: 48 },
    limits: { angVel: 2200 },
    pose(t) {
      const j = jolt(t);
      return merge(zombieSpine(1.1, { bend: -dir * 0.32 * j + wob(t) * dir, neckBend: -dir * 0.25 * j, headBend: -dir * 0.2 * j, shrug: 0.15 * j }), {
        leg: STAND,
        arm: {
          L: { target: [-0.08 - 0.1 * j, 0.24 - 0.1 * j * dir, -0.28 + 0.2 * j], space: 'shoulder', pole: [-0.6, -0.4, -0.6], fingers: CLAW },
          R: { target: [0.08 + 0.1 * j, 0.24 - 0.1 * j * dir, -0.28 + 0.2 * j], space: 'shoulder', pole: [0.6, -0.4, -0.6], fingers: CLAW },
        },
      });
    },
  };
}

// ---------------------------------------------------------------- staggers (full body, moves)
function stagger(name, dir) {
  // dir = +1: hit from the front -> stumbles backwards; -1: hit from behind -> forwards.
  const back = -dir;
  const T = 1.0;
  const footL = plantedFoot([
    { t0: 0, t1: 0.12, x: -0.15, y: 0.06, yaw: 10 * DEG },
    { t0: 0.3, t1: 0.55, x: -0.17, y: 0.06 + back * 0.32, yaw: 12 * DEG },
    { t0: 0.75, t1: T, x: -0.15, y: 0.06 + back * 0.5, yaw: 10 * DEG },
  ], { lift: 0.08 });
  const footR = plantedFoot([
    { t0: 0, t1: 0.22, x: 0.14, y: -0.1, yaw: -16 * DEG },
    { t0: 0.42, t1: T, x: 0.15, y: -0.1 + back * 0.5, yaw: -16 * DEG },
  ], { lift: 0.07 });
  const travel = K([[0, 0], [0.12, 0.08, 'out'], [0.6, 0.42, 'inOut'], [T, 0.5, 'inOut']]);
  const tilt = K([[0, 0], [0.08, 1, 'out3'], [0.45, 0.6, 'inOut'], [T, 0, 'inOut']]);
  const flail = K([[0, 0], [0.18, 1, 'inOut'], [0.55, 0.7, 'inOut'], [T, 0, 'inOut']]); // arms follow through later
  return {
    dict: DICT, name, duration: T, loop: false,
    actors: { zombie: 'zombie' },
    playback: { blendIn: 8.0, blendOut: -3.0, flags: 0 },
    limits: { angVel: 2200 },
    pose(t) {
      const k = tilt(t), a = flail(t);
      return merge(zombieSpine(1.1, { bend: -dir * 0.4 * k, side: 0.12 * k * sin(9 * t), neckBend: -dir * 0.3 * k, headBend: -dir * 0.25 * k }), {
        mover: { p: [0, back * travel(t), 0], yaw: 0 },
        root: { p: [0.02 * sin(12 * t) * k, 0, -0.05 - 0.04 * k], bend: -dir * 0.08 * k },
        leg: { L: footL(t), R: footR(t) },
        arm: {
          L: { target: [-0.06 - 0.25 * a, 0.24 - 0.3 * a * dir, -0.28 + 0.38 * a], space: 'shoulder', pole: [-0.7, -0.3, -0.5], fingers: CLAW },
          R: { target: [0.06 + 0.25 * a, 0.24 - 0.3 * a * dir, -0.28 + 0.32 * a], space: 'shoulder', pole: [0.7, -0.3, -0.5], fingers: CLAW },
        },
      });
    },
  };
}

// ---------------------------------------------------------------- deaths
// a: knees buckle, falls to the knees, slumps forwards (ragdoll finishes the fall).
const DA_T = 1.6;
const da = {
  dict: DICT, name: 'zreact_death_a', duration: DA_T, loop: false,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 6.0, blendOut: -1.0, flags: 2 },
  allowSelfContact: ['zombie'],
  limits: { angVel: 1600, floatFeet: 0.2 },
  airborne: { zombie: [[0.5, 1.0]] },
  pose(t) {
    const drop = K([[0, 0], [0.15, 0.05, 'in'], [0.75, 1, 'in3'], [0.85, 0.96, 'out'], [DA_T, 1, 'inOut']])(t);
    const slump = K([[0, 0], [0.6, 0.15], [1.0, 0.5, 'inOut'], [DA_T, 1.1, 'in']])(t);
    const kneelH = 0.52; // pelvis height when kneeling upright
    const z = rootZ(0.97 - (0.97 - kneelH) * drop);
    return merge(zombieSpine(1.0, { bend: 0.5 * slump, neckBend: 0.35 * slump, headBend: 0.3 * slump, side: 0.08 * drop }), {
      root: { p: [0, 0.34 * drop, z], bend: 0.35 * slump },
      leg: {
        // Kneeling: the feet stay where they are and roll onto the toes, the knees drop forward.
        L: { target: [-0.15, 0.06, GROUND + ANKLE_H], foot: { yaw: 10 * DEG, pitch: -55 * DEG * drop }, pivot: { kind: 'toe', x: -0.15 + 0.025, y: 0.06 + 0.15 }, pole: [0, 1, 0.2] },
        R: { target: [0.14, -0.1, GROUND + ANKLE_H], foot: { yaw: -16 * DEG, pitch: -55 * DEG * drop }, pivot: { kind: 'toe', x: 0.14 - 0.04, y: -0.1 + 0.145 }, pole: [0, 1, 0.2] },
      },
      arm: {
        L: { target: [-0.12, 0.1 + 0.15 * slump, -0.5 + 0.1 * drop], space: 'shoulder', pole: [-0.4, -1, 0], fingers: LIMP },
        R: { target: [0.12, 0.08 + 0.15 * slump, -0.5 + 0.1 * drop], space: 'shoulder', pole: [0.4, -1, 0], fingers: LIMP },
      },
    });
  },
};

// b: thrown backwards, stumbles, sits down hard, upper body falls back.
const DB_T = 1.4;
const db = {
  dict: DICT, name: 'zreact_death_b', duration: DB_T, loop: false,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 6.0, blendOut: -1.0, flags: 2 },
  allowSelfContact: ['zombie'],
  limits: { angVel: 1800, floatFeet: 0.2 },
  pose(t) {
    const sit = K([[0, 0], [0.25, 0.1], [0.75, 1, 'in3'], [0.85, 0.95, 'out'], [DB_T, 1, 'inOut']])(t);
    const fall = K([[0, 0], [0.12, 0.25, 'out3'], [0.7, 0.35], [DB_T, 1.05, 'in']])(t);
    const z = rootZ(0.97 - (0.97 - 0.14) * sit);
    return merge(zombieSpine(0.6, { bend: -0.25 * fall, neckBend: -0.15 * fall, headBend: -0.3 * fall }), {
      root: { p: [0, -0.5 * sit, z], bend: -0.45 * fall },
      leg: {
        // Feet stay planted, the hips drop behind them; heels pivot as the knees come up.
        L: { target: [-0.16, 0.06, GROUND + ANKLE_H], foot: { yaw: 12 * DEG, pitch: 12 * DEG * sit }, pivot: { kind: 'heel', x: -0.16 - 0.01, y: 0.06 - 0.05 }, pole: [-0.2, 1, 0.3] },
        R: { target: [0.17, -0.08, GROUND + ANKLE_H], foot: { yaw: -14 * DEG, pitch: 16 * DEG * sit }, pivot: { kind: 'heel', x: 0.17 + 0.012, y: -0.08 - 0.048 }, pole: [0.2, 1, 0.3] },
      },
      arm: {
        L: { target: [-0.3, 0.05 - 0.2 * sit, -0.1 + 0.2 * fall], space: 'shoulder', pole: [-0.6, -0.6, -0.3], fingers: CLAW },
        R: { target: [0.3, 0.05 - 0.2 * sit, -0.1 + 0.25 * fall], space: 'shoulder', pole: [0.6, -0.6, -0.3], fingers: CLAW },
      },
    });
  },
};

// ---------------------------------------------------------------- reach (upper body loop while closing in)
const RE_T = 0.8;
const reN = loopWobble(61, RE_T, 2, 1);
const reach = {
  dict: DICT, name: 'zreact_reach', duration: RE_T, loop: true,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 4.0, blendOut: -4.0, flags: 49 },
  pose(t) {
    const w = 2 * Math.PI * t / RE_T;
    const snap = Math.max(0, sin(w)) ** 4;
    return merge(zombieSpine(1.25, { bend: 0.06 * snap, neckBend: 0.12 * snap, headBend: 0.1 * snap + 0.04 * reN(t), shrug: 0.08 }), {
      leg: STAND,
      arm: {
        L: { target: [-0.02, 0.48 + 0.04 * sin(w), 0.02 + 0.05 * sin(w + 1)], space: 'shoulder', pole: [-0.8, -0.2, -0.5], fingers: { ...CLAW, curl: [0.35, 0.2 + 0.35 * snap, 0.25 + 0.35 * snap, 0.3 + 0.35 * snap, 0.35 + 0.3 * snap] }, wrist: { flex: -0.1 } },
        R: { target: [0.02, 0.48 + 0.04 * sin(w + 2), 0.02 + 0.05 * sin(w + 3)], space: 'shoulder', pole: [0.8, -0.2, -0.5], fingers: { ...CLAW, curl: [0.35, 0.2 + 0.35 * snap, 0.25 + 0.35 * snap, 0.3 + 0.35 * snap, 0.35 + 0.3 * snap] }, wrist: { flex: -0.1 } },
      },
    });
  },
};

// ---------------------------------------------------------------- swipe (blocked-space fallback attack)
const SW_T = 0.9;
const swipe = {
  dict: DICT, name: 'zreact_swipe', duration: SW_T, loop: false,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 8.0, blendOut: -4.0, flags: 0 },
  events: [{ name: 'hit', t: 0.42 }],
  limits: { angVel: 2400, linVel: 10 },
  pose(t) {
    const wind = K([[0, 0], [0.3, 1, 'out'], [0.42, -1, 'strike'], [0.65, -0.7, 'out'], [SW_T, 0, 'inOut']])(t);
    const lean = K([[0, 0], [0.3, -0.1], [0.42, 0.25, 'out3'], [SW_T, 0, 'inOut']])(t);
    const fR = plantedFoot([
      { t0: 0, t1: 0.25, x: 0.14, y: -0.1, yaw: -16 * DEG },
      { t0: 0.4, t1: SW_T, x: 0.15, y: 0.22, yaw: -8 * DEG },
    ], { lift: 0.07 });
    return merge(zombieSpine(1.2, { bend: lean, twist: 0.35 * wind, neckTwist: -0.2 * wind }), {
      root: { p: [0, 0.08 * Math.max(0, -wind), -0.07], twist: 0.2 * wind },
      leg: { L: STAND.L, R: fR(t) },
      arm: {
        R: { target: [0.28 * wind + 0.05, 0.3 + 0.2 * (1 - Math.abs(wind)), 0.12 - 0.1 * Math.max(0, -wind)], space: 'shoulder', pole: [0.8, -0.4, -0.3], fingers: CLAW, wrist: { flex: -0.3 } },
        L: { target: [-0.1, 0.32, -0.15], space: 'shoulder', pole: [-0.7, -0.3, -0.6], fingers: CLAW },
      },
    });
  },
};

// ---------------------------------------------------------------- get-ups
// From lying on the back (head towards -Y): stiff sit-up, pull the feet in, lean over the
// feet, rise into the hunched stance. The mover follows the body so it ends centred.
const GB_T = 2.2;
const gbBend = K([[0, -1.48], [0.6, -0.15, 'inOut'], [1.2, 0.75, 'inOut'], [1.75, 0.45, 'inOut'], [GB_T, 0.12, 'inOut']]);
const gbH = K([[0, 0.12], [0.6, 0.13], [1.0, 0.2, 'inOut'], [1.6, 0.62, 'inOut'], [GB_T, 0.93, 'inOut']]);
const gbY = K([[0, 0], [0.6, 0.0], [1.2, 0.3, 'inOut'], [GB_T, 0.42, 'inOut']]);
const gbFeet = K([[0, 0.85], [0.6, 0.85], [1.05, 0.38, 'inOut'], [GB_T, 0.38]]);
const getupBack = {
  dict: DICT, name: 'zreact_getup_back', duration: GB_T, loop: false,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 2.0, blendOut: -3.0, flags: 0 },
  allowSelfContact: ['zombie'],
  limits: { floatFeet: 0.35, spineSeg: 45 },
  noGround: true,
  pose(t) {
    const bend = gbBend(t), y = gbY(t);
    const fy = gbFeet(t);
    const hands = K([[0, 1], [0.55, 1], [0.8, 0.6], [1.4, 0.0, 'inOut'], [GB_T, 0, 'hold']])(t);
    return merge(zombieSpine(0.7 + 0.4 * Math.max(0, bend), { bend: 0.15 * Math.max(0, bend), headBend: -0.25 * Math.min(0, bend) }), {
      mover: { p: [0, y, 0], yaw: 0 },
      root: { p: [0, -y * 0.0, rootZ(gbH(t))], bend },
      leg: {
        L: { target: [-0.15, fy, GROUND + ANKLE_H], foot: { yaw: 8 * DEG, pitch: 60 * DEG * Math.min(1, Math.max(0, (fy - 0.4) / 0.45)) }, space: 'body', pole: [-0.15, 1, 0.6] },
        R: { target: [0.15, fy - 0.05, GROUND + ANKLE_H], foot: { yaw: -10 * DEG, pitch: 60 * DEG * Math.min(1, Math.max(0, (fy - 0.4) / 0.45)) }, space: 'body', pole: [0.15, 1, 0.6] },
      },
      arm: {
        // Hands push on the ground, then cross-fade into the hanging zombie arms.
        L: { target: [-0.34, -0.12 + 0.3 * (1 - hands), GROUND + 0.1], space: 'body', blend: { target: [-0.06, 0.3, -0.35], space: 'shoulder', w: 1 - hands }, pole: [-0.6, -0.6, 0.1], fingers: hands > 0.5 ? LIMP : CLAW },
        R: { target: [0.34, -0.12 + 0.3 * (1 - hands), GROUND + 0.1], space: 'body', blend: { target: [0.06, 0.3, -0.35], space: 'shoulder', w: 1 - hands }, pole: [0.6, -0.6, 0.1], fingers: hands > 0.5 ? LIMP : CLAW },
      },
    });
  },
};

// From lying face down (head towards +Y): push up on the arms, knees under, rise.
const GF_T = 2.0;
const gfBend = K([[0, 1.5], [0.5, 1.25, 'inOut'], [1.0, 1.0, 'inOut'], [1.5, 0.6, 'inOut'], [GF_T, 0.18, 'inOut']]);
const gfH = K([[0, 0.12], [0.5, 0.28, 'inOut'], [1.0, 0.45, 'inOut'], [1.5, 0.62, 'inOut'], [GF_T, 0.93, 'inOut']]);
const gfKnee = K([[0, -0.9], [0.5, -0.75], [1.0, -0.15, 'inOut'], [GF_T, 0.0, 'inOut']]);
const getupFront = {
  dict: DICT, name: 'zreact_getup_front', duration: GF_T, loop: false,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 2.0, blendOut: -3.0, flags: 0 },
  allowSelfContact: ['zombie'],
  limits: { floatFeet: 0.35, spineSeg: 45 },
  noGround: true,
  pose(t) {
    const kneeY = gfKnee(t);
    const handsDown = K([[0, 1], [1.1, 1], [1.5, 0, 'inOut']])(t);
    return merge(zombieSpine(0.9, { neckBend: -0.35 * handsDown, headBend: -0.2 * handsDown }), {
      root: { p: [0, -0.05, rootZ(gfH(t))], bend: gfBend(t) },
      leg: {
        L: { target: [-0.14, kneeY, GROUND + ANKLE_H], foot: { yaw: 8 * DEG, pitch: -70 * DEG * Math.max(0, -kneeY) }, space: 'body', pole: [0, 1, -0.3] },
        R: { target: [0.15, kneeY - 0.05, GROUND + ANKLE_H], foot: { yaw: -8 * DEG, pitch: -70 * DEG * Math.max(0, -kneeY) }, space: 'body', pole: [0, 1, -0.3] },
      },
      arm: {
        L: { target: [-0.24, 0.42 - 0.2 * (1 - handsDown), GROUND + 0.09], space: 'body', blend: { target: [-0.06, 0.28, -0.35], space: 'shoulder', w: 1 - handsDown }, pole: [-0.5, -0.8, 0.3], fingers: handsDown > 0.5 ? LIMP : CLAW, palm: { fingerDir: [-0.3, 1, 0], palmDir: [0, 0, -1], weight: 0.65 * handsDown } },
        R: { target: [0.24, 0.42 - 0.2 * (1 - handsDown), GROUND + 0.09], space: 'body', blend: { target: [0.06, 0.28, -0.35], space: 'shoulder', w: 1 - handsDown }, pole: [0.5, -0.8, 0.3], fingers: handsDown > 0.5 ? LIMP : CLAW, palm: { fingerDir: [0.3, 1, 0], palmDir: [0, 0, -1], weight: 0.65 * handsDown } },
      },
    });
  },
};

export default [
  flinch('zreact_hit_front', 1), flinch('zreact_hit_back', -1),
  stagger('zreact_stagger_front', 1), stagger('zreact_stagger_back', -1),
  da, db, reach, swipe, getupBack, getupFront,
];
export { KC, addRot };
