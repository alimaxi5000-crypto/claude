// Generates the example clip documents in this folder (committed; rerun after format changes):
//   node animkit/examples/make-examples.mjs
//   single_wave.anim.json    single actor: arm wave with rotation keys, IK hand, look-at, event
//   pair_shoulder.anim.json  pair: A puts a hand on B's shoulder (stuck contact), B reacts
//   walk_cycle.anim.json     walking loop with travelling mover, body-space foot IK, clean seam
//   fingers_demo.anim.json   all finger presets on both hands + per-joint finger rotation
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GZ = -0.993 + 0.085;   // ankle height of a flat foot on the reference skeleton (body space)
const r3 = (v) => v.map((x) => +x.toFixed(4));
// Natural stand for arms that are not animated (the bind pose is an A-pose).
const STAND_ARM = { UpperArm: [4, 36, 0], Forearm: [12, 0, 0] };
const standArms = (sides = ['L', 'R']) => Object.fromEntries(sides.flatMap((s) => [[`SKEL_${s}_UpperArm`, [{ t: 0, rot: STAND_ARM.UpperArm }]], [`SKEL_${s}_Forearm`, [{ t: 0, rot: STAND_ARM.Forearm }]]]));
const write = (name, doc) => fs.writeFileSync(path.join(HERE, `${name}.anim.json`), JSON.stringify(doc, null, 1) + '\n');

write('single_wave', {
  format: 'jj-anim/1', name: 'single_wave', title: 'Winken', type: 'single', fps: 30, duration: 2.4, loop: true,
  actors: { a: { model: 'mp_m_freemode_01', label: 'Spieler' } },
  tracks: {
    a: {
      mover: [{ t: 0, p: [0, 0, 0], yaw: 0 }],
      bones: {
        ...standArms(['L']),
        SKEL_R_UpperArm: [{ t: 0, rot: STAND_ARM.UpperArm }, { t: 0.5, rot: [20, -100, 10] }, { t: 1.9, rot: [20, -100, 10] }],
        SKEL_R_Forearm: [{ t: 0, rot: STAND_ARM.Forearm }, { t: 0.5, rot: [70, 0, 0] }, { t: 0.8, rot: [40, 0, 0] }, { t: 1.1, rot: [70, 0, 0] }, { t: 1.4, rot: [40, 0, 0] }, { t: 1.7, rot: [70, 0, 0] }, { t: 1.9, rot: [70, 0, 0] }],
        SKEL_Head: [{ t: 0, rot: [0, 0, 0] }, { t: 0.6, rot: [-8, 0, -25] }, { t: 1.9, rot: [-8, 0, -25] }],
        SKEL_Spine2: [{ t: 0, rot: [0, 0, 0] }, { t: 0.6, rot: [0, -4, -6] }, { t: 1.9, rot: [0, -4, -6] }],
      },
      fingers: { R: [{ t: 0, preset: 'relaxed' }, { t: 0.5, preset: 'open' }, { t: 1.9, preset: 'open' }], L: [{ t: 0, preset: 'relaxed' }] },
      look: [{ t: 0, target: [0, 2, 0.6], space: 'body', weight: 0.5 }],
    },
  },
  contacts: [], events: [{ name: 'wave_peak', t: 0.8 }], notes: 'Beispiel: Winken mit rechtem Arm (Loop).',
});

write('pair_shoulder', {
  format: 'jj-anim/1', name: 'pair_shoulder', title: 'Hand auf Schulter', type: 'pair', fps: 30, duration: 2.0, loop: false,
  actors: { a: { model: 'mp_m_freemode_01', label: 'Akteur A' }, b: { model: 'mp_f_freemode_01', label: 'Akteur B' } },
  tracks: {
    a: {
      mover: [{ t: 0, p: [0, 0, 0], yaw: 0 }],
      ik: { handR: [{ t: 0, target: [0.3, 0.05, -0.28], pole: [0.6, -0.5, -0.6] }, { t: 0.7, target: [0.18, 0.4, 0.3], pole: [0.8, -0.4, -0.4], ease: 'fastIn' }] },
      bones: { ...standArms(['L']), SKEL_Spine2: [{ t: 0, rot: [0, 0, 0] }, { t: 0.8, rot: [-8, 0, 4] }] },
      fingers: { R: [{ t: 0, preset: 'relaxed' }, { t: 0.7, preset: 'grab', curl: 0.6 }] },
      look: [{ t: 0, target: [0, 0.6, 0.55], space: 'body', weight: 0.8 }],
    },
    b: {
      mover: [{ t: 0, p: [0, 0.42, 0], yaw: 180 }],
      bones: { ...standArms(), SKEL_Head: [{ t: 0, rot: [0, 0, 0] }, { t: 0.9, rot: [0, 0, 0] }, { t: 1.4, rot: [-5, 0, -30] }], SKEL_Spine1: [{ t: 0.9, rot: [0, 0, 0] }, { t: 1.4, rot: [0, 0, -6] }] },
    },
  },
  contacts: [{ id: 'hand_shoulder', from: 'a.handR', to: 'b.SKEL_L_UpperArm', offset: [0, 0, 0.07], t: [0.75, 2.0], stick: true, max: 0.03 }],
  events: [{ name: 'touch', t: 0.75 }], notes: 'Beispiel: A legt B die Hand auf die Schulter, B dreht den Kopf.',
});

// Walking cycle: 1.0 s, stride 1.3 m (two steps), stance 60 %, feet in body space so the loop
// closes in the body frame while the mover travels.
const S = 1.3, A = S * 0.6 / 2, W = 0.1;
const footKeys = (x, phase) => {
  const base = [
    [0.0, [x, A, GZ], 'linear'], [0.6, [x, -A, GZ], 'linear'], [0.65, [x, -A - 0.05, GZ + 0.045], 'linear'],
    [0.8, [x, 0.1, GZ + 0.1], 'smooth'], [0.93, [x, A + 0.08, GZ + 0.03], 'smooth'],
  ];
  // Shift by phase (cycles), wrapping into [0, 1); add the stance value at t = 0 for the shifted foot.
  if (!phase) return base.map(([t, p, e]) => ({ t, target: r3(p), space: 'body', ease: e }));
  const shifted = base.map(([t, p, e]) => [((t + phase) % 1 + 1) % 1, p, e]).sort((a, b) => a[0] - b[0]);
  const y0 = A - S * phase;   // mid-stance at t = 0 (0.5 cycle after heel strike)
  return [{ t: 0, target: r3([x, y0, GZ]), space: 'body', ease: 'linear' }, ...shifted.map(([t, p, e]) => ({ t: +t.toFixed(3), target: r3(p), space: 'body', ease: e }))];
};
write('walk_cycle', {
  format: 'jj-anim/1', name: 'walk_cycle', title: 'Gehen (Loop)', type: 'single', fps: 30, duration: 1.0, loop: true, loopMover: 'travel',
  actors: { a: { model: 'mp_m_freemode_01', label: 'Geher' } },
  tracks: {
    a: {
      mover: [{ t: 0, p: [0, 0, 0], yaw: 0, ease: 'linear' }, { t: 1.0, p: [0, S, 0], yaw: 0, ease: 'linear' }],
      root: [{ t: 0, p: [0, 0, -0.045] }, { t: 0.25, p: [0, 0, -0.028] }, { t: 0.5, p: [0, 0, -0.045] }, { t: 0.75, p: [0, 0, -0.028] }],
      ik: { footL: footKeys(-W, 0), footR: footKeys(W, 0.5) },
      bones: {
        SKEL_L_UpperArm: [{ t: 0, rot: [-14, 0, 0] }, { t: 0.5, rot: [14, 0, 0] }],
        SKEL_R_UpperArm: [{ t: 0, rot: [14, 0, 0] }, { t: 0.5, rot: [-14, 0, 0] }],
        SKEL_L_Forearm: [{ t: 0, rot: [12, 0, 0] }, { t: 0.5, rot: [22, 0, 0] }],
        SKEL_R_Forearm: [{ t: 0, rot: [22, 0, 0] }, { t: 0.5, rot: [12, 0, 0] }],
        SKEL_Spine2: [{ t: 0, rot: [4, 0, -4] }, { t: 0.5, rot: [4, 0, 4] }],
      },
      fingers: { L: [{ t: 0, preset: 'relaxed' }], R: [{ t: 0, preset: 'relaxed' }] },
    },
  },
  contacts: [], events: [{ name: 'step_l', t: 0 }, { name: 'step_r', t: 0.5 }], notes: 'Beispiel: Gang-Zyklus, 1,3 m/s, Loop mit Bewegung nach vorn.',
});

const presets = ['relaxed', 'fist', 'open', 'grab', 'point', 'claw'];
write('fingers_demo', {
  format: 'jj-anim/1', name: 'fingers_demo', title: 'Finger-Vorlagen', type: 'single', fps: 30, duration: 3.0, loop: true,
  actors: { a: { model: 'mp_m_freemode_01', label: 'Hände' } },
  tracks: {
    a: {
      mover: [{ t: 0, p: [0, 0, 0], yaw: 0 }],
      ik: { handL: [{ t: 0, target: [-0.22, 0.34, 0.3], pole: [-0.8, -0.3, -0.5] }], handR: [{ t: 0, target: [0.22, 0.34, 0.3], pole: [0.8, -0.3, -0.5] }] },
      fingers: {
        L: presets.map((p, i) => ({ t: +(i * 0.5).toFixed(2), preset: p, spread: p === 'open' ? 0.8 : undefined })).map((k) => JSON.parse(JSON.stringify(k))),
        R: presets.slice().reverse().map((p, i) => ({ t: +(i * 0.5).toFixed(2), preset: p, curl: 0.9 })),
      },
      bones: { SKEL_R_Finger11: [{ t: 0, rot: [0, 0, 0] }, { t: 1.5, rot: [40, 0, 0] }] },
    },
  },
  contacts: [], events: [], notes: 'Beispiel: alle Finger-Vorlagen nacheinander, dazu ein einzeln gedrehtes Fingerglied.',
});
console.log('examples written');
