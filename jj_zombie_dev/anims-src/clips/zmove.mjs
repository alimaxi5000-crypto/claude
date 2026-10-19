// Zombie locomotion and idles (dictionary jjz_move). Played through
// SET_PED_ALTERNATE_MOVEMENT_ANIM (idle / walk / run stances) and as one-shot clips.
// Walk/run clips carry their forward speed in the mover track (constant velocity), feet are
// planted in world space during stance (no foot sliding), loops are periodic in every channel.
import { gait, zombieSpine, merge, CLAW, LIMP, K, KC, DEG, TAU, clamp } from '../lib/kit.mjs';
import { loopWobble, sine, impulse, bump } from '../../tools/animcore/author.mjs';

const DICT = 'jjz_move';
const sin = Math.sin, cos = Math.cos;

// ---------------------------------------------------------------- shamble walk (schlurfer)
// Right leg drags (short, low swing, toe scrapes close to the ground), body lists to the
// bad side, left arm half raised and reaching, right arm hangs and swings like dead weight.
const SH_T = 1.6;
const shGait = gait({
  period: SH_T, stride: 1.02, stance: 0.62, width: 0.115, bob: 0.024, sway: 0.032, twist: 6 * DEG, drop: 4 * DEG,
  legs: {
    L: { lift: 0.085, toeOut: 8 },
    R: { lift: 0.058, liftPow: 1.0, stance: 0.68, phaseOffset: 0.5, toeOut: 14, pushOff: 14, heel: 6, dragToe: 7 },
  },
});
const shNoise = loopWobble(11, SH_T, 2, 1);
const shNoise2 = loopWobble(23, SH_T, 3, 1);
const shamble = {
  dict: DICT, name: 'zmove_shamble_walk', duration: SH_T, loop: true,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 4.0, blendOut: -4.0, flags: 1 },
  limits: { footSlide: 0.35 },
  pose(t) {
    const g = shGait(t);
    const w = TAU * g.ph;
    const lurch = 0.5 + 0.5 * sin(w - 0.4);           // weight falls onto the bad leg
    return merge(zombieSpine(1.15, {
      side: 0.07 + 0.05 * lurch, twist: -g.twist * 0.6,
      neckSide: 0.18 + 0.05 * shNoise(t), neckTwist: 0.12 * shNoise2(t), headBend: 0.06 * sin(2 * w + 0.6),
    }), {
      mover: g.mover,
      root: { p: [g.sway * 1.3 + 0.012, -0.03, g.bob - 0.04 - 0.02 * lurch], bend: 0.06, side: g.drop * 0.6, twist: g.twist },
      pelvis: { side: -g.drop, twist: g.twist * 0.5 },
      leg: g.leg,
      arm: {
        L: { target: [-0.05 + 0.03 * sin(w), 0.36 + 0.05 * sin(w + 1), -0.12 + 0.04 * sin(2 * w)], space: 'shoulder', pole: [-0.7, -0.2, -0.7], fingers: CLAW, wrist: { flex: 0.35, dev: 0.15 } },
        R: { target: [0.08 + 0.02 * sin(w), 0.08 + 0.13 * sin(w + 0.5), -0.5], space: 'shoulder', pole: [0.4, -1, -0.2], fingers: LIMP, wrist: { flex: 0.5 } },
      },
    });
  },
};

// ---------------------------------------------------------------- shamble idle
const SI_T = 3.2;
const siN = loopWobble(5, SI_T, 2, 1), siN2 = loopWobble(7, SI_T, 3, 1), siN3 = loopWobble(9, SI_T, 5, 1);
const shambleIdle = {
  dict: DICT, name: 'zmove_shamble_idle', duration: SI_T, loop: true,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 3.0, blendOut: -3.0, flags: 1 },
  pose(t) {
    const w = TAU * t / SI_T;
    const shift = sin(w);                               // weight shift left/right
    const breath = sin(2 * w * 2);
    return merge(zombieSpine(1.1, {
      side: 0.05 * shift + 0.04, bend: 0.02 * breath, twist: 0.05 * siN(t),
      neckSide: 0.2 + 0.12 * siN2(t), neckTwist: 0.2 * siN(t), headBend: 0.08 + 0.06 * siN3(t), shrug: 0.03 * breath,
    }), {
      root: { p: [0.025 * shift, -0.02, -0.05 + 0.006 * breath], side: -0.03 * shift },
      pelvis: { side: 0.05 * shift },
      leg: {
        L: { target: [-0.14, 0.06, -0.908 + 0.0], foot: { yaw: 10 * DEG } },
        R: { target: [0.13, -0.08, -0.908], foot: { yaw: -18 * DEG } },
      },
      arm: {
        L: { target: [-0.06 + 0.02 * siN(t), 0.12 + 0.03 * shift, -0.47], space: 'shoulder', pole: [-0.5, -1, 0], fingers: LIMP, wrist: { flex: 0.4 } },
        R: { target: [0.07, 0.1 - 0.03 * shift, -0.47 + 0.02 * siN2(t)], space: 'shoulder', pole: [0.5, -1, 0], fingers: { ...CLAW, curl: [0.4, 0.4, 0.45, 0.5, 0.5] }, wrist: { flex: 0.45 } },
      },
    });
  },
};

// ---------------------------------------------------------------- runner walk (laeufer, agitated)
const RW_T = 1.0;
const rwGait = gait({ period: RW_T, stride: 1.42, stance: 0.58, width: 0.12, bob: 0.03, sway: 0.025, twist: 8 * DEG, drop: 3 * DEG, legs: { L: { lift: 0.1 }, R: { lift: 0.1 } } });
const rwN = loopWobble(31, RW_T, 3, 1);
const runnerWalk = {
  dict: DICT, name: 'zmove_runner_walk', duration: RW_T, loop: true,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 4.0, blendOut: -4.0, flags: 1 },
  pose(t) {
    const g = rwGait(t);
    const w = TAU * g.ph;
    return merge(zombieSpine(1.35, { twist: -g.twist * 0.8, neckTwist: 0.15 * rwN(t), headSide: 0.08 * sin(w), headBend: 0.05 * sin(2 * w) }), {
      mover: g.mover,
      root: { p: [g.sway, 0.0, g.bob - 0.05], bend: 0.12, side: g.drop * 0.5, twist: g.twist },
      pelvis: { side: -g.drop, twist: g.twist * 0.4 },
      leg: g.leg,
      arm: {
        L: { target: [-0.02, 0.4 + 0.08 * sin(w), -0.05 + 0.06 * sin(w + 0.4)], space: 'shoulder', pole: [-0.8, -0.1, -0.6], fingers: CLAW, wrist: { flex: 0.25 } },
        R: { target: [0.02, 0.4 - 0.08 * sin(w), -0.05 - 0.06 * sin(w + 0.4)], space: 'shoulder', pole: [0.8, -0.1, -0.6], fingers: CLAW, wrist: { flex: 0.25 } },
      },
    });
  },
};

// ---------------------------------------------------------------- runner sprint
const RR_T = 20 / 30; // periods must be whole frames (30 fps) for seamless loops
const rrGait = gait({
  period: RR_T, stride: 2.6, stance: 0.33, width: 0.1, bob: 0.045, bobPhase: 0.6, sway: 0.018, twist: 10 * DEG, drop: 4 * DEG,
  legs: { L: { lift: 0.22, liftPow: 0.8, heel: 4, pushOff: 38 }, R: { lift: 0.22, liftPow: 0.8, heel: 4, pushOff: 38 } },
});
const rrN = loopWobble(41, RR_T, 2, 1);
const runnerRun = {
  dict: DICT, name: 'zmove_runner_run', duration: RR_T, loop: true,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 4.0, blendOut: -4.0, flags: 1 },
  airborne: { zombie: [[0, RR_T]] }, // flight phases are expected while sprinting
  limits: { angVel: 1900, linVel: 13.5 }, // sprinting swing feet reach ~3x body speed
  pose(t) {
    const g = rrGait(t);
    const w = TAU * g.ph;
    return merge(zombieSpine(1.2, { bend: 0.18, twist: -g.twist, neckBend: -0.1, neckTwist: 0.1 * rrN(t), headBend: 0.04 * sin(2 * w) }), {
      mover: g.mover,
      root: { p: [g.sway, 0.05, g.bob - 0.06], bend: 0.22, side: g.drop * 0.5, twist: g.twist },
      pelvis: { twist: g.twist * 0.5 },
      leg: g.leg,
      arm: {
        // Arms thrown forward and flailing, out of sync with the legs (unnatural on purpose).
        L: { target: [-0.06, 0.38 + 0.14 * sin(w + 0.9), 0.02 + 0.16 * sin(w + 0.2)], space: 'shoulder', pole: [-0.9, -0.2, -0.4], fingers: CLAW, wrist: { flex: 0.2 } },
        R: { target: [0.06, 0.38 - 0.14 * sin(w + 0.9), 0.02 - 0.16 * sin(w + 0.2)], space: 'shoulder', pole: [0.9, -0.2, -0.4], fingers: CLAW, wrist: { flex: 0.2 } },
      },
    });
  },
};

// ---------------------------------------------------------------- runner idle (twitchy, panting)
const RI_T = 2.0;
const riN = loopWobble(51, RI_T, 4, 1), riN2 = loopWobble(53, RI_T, 6, 1);
const twitch = (t) => {
  // Two sharp head twitches per loop (periodic).
  const a = Math.exp(-40 * ((t - 0.55) ** 2)) - Math.exp(-40 * ((t - 1.45) ** 2)) * 0.8;
  return a;
};
const runnerIdle = {
  dict: DICT, name: 'zmove_runner_idle', duration: RI_T, loop: true,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 3.0, blendOut: -3.0, flags: 1 },
  pose(t) {
    const pant = sin(TAU * t * 3 / RI_T);
    return merge(zombieSpine(1.3, { bend: 0.03 * pant, neckTwist: 0.35 * twitch(t) + 0.1 * riN(t), headSide: 0.15 * twitch(t), headBend: 0.05 * riN2(t), shrug: 0.04 * pant }), {
      root: { p: [0.01 * riN(t), 0.0, -0.08 + 0.005 * pant] },
      leg: {
        L: { target: [-0.16, 0.08, -0.908], foot: { yaw: 12 * DEG } },
        R: { target: [0.15, -0.12, -0.908], foot: { yaw: -14 * DEG } },
      },
      arm: {
        L: { target: [-0.02, 0.26 + 0.02 * riN(t), -0.3], space: 'shoulder', pole: [-0.8, -0.3, -0.5], fingers: { ...CLAW, curl: [0.35, 0.25 + 0.2 * riN2(t), 0.3, 0.35, 0.4] }, wrist: { flex: 0.2 } },
        R: { target: [0.02, 0.24, -0.32 + 0.02 * riN2(t)], space: 'shoulder', pole: [0.8, -0.3, -0.5], fingers: CLAW, wrist: { flex: 0.2 } },
      },
    });
  },
};

// ---------------------------------------------------------------- alert roar (one-shot)
const AR_T = 1.7;
const rear = K([[0, 0], [0.32, 1, 'out3'], [1.05, 1, 'hold'], [1.45, -0.2, 'inOut'], [1.7, 0, 'inOut']]);
const spread = K([[0, 0], [0.3, 1, 'out3'], [1.1, 1, 'hold'], [1.5, 0, 'inOut']]);
const shake = (t) => (t > 0.4 && t < 1.1 ? 0.05 * sin(TAU * 9 * t) * sin(Math.PI * (t - 0.4) / 0.7) : 0);
const alertRoar = {
  dict: DICT, name: 'zmove_alert_roar', duration: AR_T, loop: false,
  actors: { zombie: 'zombie' },
  playback: { blendIn: 6.0, blendOut: -3.0, flags: 0 },
  events: [{ name: 'roar', t: 0.35 }],
  pose(t) {
    const r = rear(t), s = spread(t);
    const crouch = 0.6 * s + 0.2;
    return merge(zombieSpine(1.2 - 0.9 * r, { bend: -0.16 * r, neckBend: -0.22 * r + shake(t), headBend: -0.38 * r, shrug: 0.32 * s }), {
      root: { p: [0, -0.04 * r, -0.05 - 0.07 * crouch + 0.03 * r], bend: -0.04 * r },
      leg: {
        L: { target: [-0.19, 0.1, -0.908], foot: { yaw: 14 * DEG } },
        R: { target: [0.18, -0.14, -0.908], foot: { yaw: -18 * DEG } },
      },
      arm: {
        // Arms open wide but forward, elbows bent, claws raised - a threat, not a T-pose.
        L: { target: [-0.06 - 0.26 * s, 0.24 + 0.06 * s, -0.3 + 0.36 * s], space: 'shoulder', pole: [-0.5, -0.4, -0.8], fingers: CLAW, wrist: { flex: -0.45 * s, dev: 0.2 * s } },
        R: { target: [0.06 + 0.26 * s, 0.24 + 0.06 * s, -0.3 + 0.36 * s], space: 'shoulder', pole: [0.5, -0.4, -0.8], fingers: CLAW, wrist: { flex: -0.45 * s, dev: 0.2 * s } },
      },
    });
  },
};

export default [shamble, shambleIdle, runnerWalk, runnerRun, runnerIdle, alertRoar];
export { sine, impulse, bump, KC, clamp, cos };
