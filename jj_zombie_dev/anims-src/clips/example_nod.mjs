// Worked example from jj_zombie_test/docs/ANIMATION_PIPELINE.md: a slow nod, as a loop.
// Dictionary jjz_test (shared with the smoke tests); in game: /ztestanim nod
import { K } from '../../tools/animcore/author.mjs';

const T = 2.0;                                  // seconds; the loop repeats every 2 s
// Nod curve over time: [time, value, ease]. Starts and ends at 0 -> seamless loop.
const nod = K([[0, 0], [0.35, 1, 'inOut'], [0.6, -0.2, 'inOut'], [0.85, 0.8, 'inOut'], [1.2, 0, 'inOut'], [T, 0]]);

export default {
  dict: 'jjz_test',                             // .ycd file name (stream/jjz_test.ycd)
  name: 'smoke_nod',                            // registry name = clip name (single actor)
  duration: T, loop: true,
  actors: { ped: 'male' },                      // one actor on the male skeleton
  playback: { blendIn: 4.0, blendOut: -4.0, flags: 1 },   // flags 1 = loop (TaskPlayAnim)
  pose: (t) => ({                               // rig controls in radians (bend > 0 = forward)
    neck: { bend: 0.25 * nod(t) },
    head: { bend: 0.35 * nod(t) },
    spine: { bend: 0.04 * nod(t) },
  }),
};
