// Smoke-test clips for /ztestanim (dictionary jjz_test).
//  smoke_bob  : only the SKEL_ROOT translation moves (independent of any skeleton assumption).
//               Proves: file streams, dictionary loads, clip plays, loop works.
//  smoke_face : the body held in the skeleton's bind pose (arms in an A-pose).
//               Proves the root convention: the ped must FACE FORWARD (where it looked before).
//               If it faces backwards, set calib.rootNeutral to [0,0,1,0] (see ANIMATION_PIPELINE.md).
//  smoke_wave : right arm raises and waves, head follows the hand.
//               Proves rotation tracks map to the right bones (bone tags) and the IK solve.
import { K, KC, sine } from '../../tools/animcore/author.mjs';
import { DEG } from '../../tools/animcore/math.mjs';

const bob = {
  dict: 'jjz_test', name: 'smoke_bob', duration: 1.0, loop: true,
  actors: { ped: 'male' },
  only: ['SKEL_ROOT:pos'], // export only the root translation (+ mover)
  noGround: true, // the bob intentionally lifts/sinks the feet
  playback: { blendIn: 4.0, blendOut: -4.0, flags: 1 },
  pose: (t) => ({ root: { p: [0, 0, 0.18 * Math.sin(2 * Math.PI * t)] } }),
};

const face = {
  dict: 'jjz_test', name: 'smoke_face', duration: 2.0, loop: true,
  actors: { ped: 'male' },
  playback: { blendIn: 2.0, blendOut: -2.0, flags: 1 },
  pose: () => ({}),
};

// Right hand target in body space (meters, +X right, +Y forward, +Z up; origin ~ pelvis).
const handPath = KC([
  [0.0, [0.42, 0.05, -0.30]],
  [0.5, [0.45, 0.18, 0.55]],
  [0.8, [0.40, 0.22, 0.78]],
  [2.2, [0.40, 0.22, 0.78]],
  [2.7, [0.45, 0.18, 0.55]],
  [3.0, [0.42, 0.05, -0.30]],
], 3.0);
const raise = K([[0, 0], [0.7, 1], [2.3, 1, 'hold'], [3.0, 0]]);
const wave = (t) => raise(t) * Math.sin(2 * Math.PI * 2.2 * t) * 22 * DEG;
const wave_ = {
  dict: 'jjz_test', name: 'smoke_wave', duration: 3.0, loop: true,
  actors: { ped: 'male' },
  playback: { blendIn: 4.0, blendOut: -4.0, flags: 1 },
  pose: (t) => ({
    spine: { side: -0.05 * raise(t), twist: 0.06 * raise(t) },
    clav: { R: { up: 0.25 * raise(t), fwd: 0.05 } },
    arm: {
      R: {
        target: handPath(t), space: 'body',
        pole: [0.9, -0.2, -0.4],
        wrist: { dev: wave(t), flex: -0.2 * raise(t) },
        fingers: { curl: 0.12, spread: 0.6 * raise(t) },
      },
      L: { target: [-0.36, 0.02, -0.33], space: 'body', fingers: { curl: 0.3 } },
    },
    head: { twist: -0.35 * raise(t), bend: -0.12 * raise(t) },
  }),
};

export default [bob, face, wave_];
export { sine };
