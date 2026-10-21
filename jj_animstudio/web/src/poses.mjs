// Built-in base poses (made for this studio, not taken from any game animation). Values are
// joint-basis degrees (see animkit/core/joints.mjs) and body-space IK targets in metres
// (entity frame: +X right, +Y forward, +Z up; the ground is at about z = -0.99).
const GZ = -0.993 + 0.085;   // ankle height of a flat foot (reference skeleton)

export const BUILTIN_POSES = {
  // Natural stand: arms down beside the body (the skeleton's bind pose is an A-pose).
  pose_stand: {
    root: { p: [0, 0, 0], rot: [0, 0, 0] },
    bones: { SKEL_L_UpperArm: [4, 36, 0], SKEL_R_UpperArm: [4, 36, 0], SKEL_L_Forearm: [12, 0, 0], SKEL_R_Forearm: [12, 0, 0] },
    ik: {}, fingers: { L: { preset: 'relaxed' }, R: { preset: 'relaxed' } },
  },
  pose_crouch: {
    root: { p: [0, -0.1, -0.42], rot: [0, 0, 0] },
    bones: { SKEL_Spine0: [-14, 0, 0], SKEL_Spine2: [-10, 0, 0], SKEL_Head: [16, 0, 0], SKEL_L_UpperArm: [28, 0, 0], SKEL_R_UpperArm: [28, 0, 0], SKEL_L_Forearm: [35, 0, 0], SKEL_R_Forearm: [35, 0, 0] },
    ik: { footL: { target: [-0.13, 0.06, GZ], space: 'body', pole: [-0.2, 1, 0.2] }, footR: { target: [0.13, 0.06, GZ], space: 'body', pole: [0.2, 1, 0.2] } },
    fingers: { L: { preset: 'relaxed' }, R: { preset: 'relaxed' } },
  },
  pose_fight: {
    root: { p: [0, 0, -0.08], rot: [0, 0, -18] },
    bones: { SKEL_Spine2: [-6, 0, 10], SKEL_Head: [6, 0, 14] },
    ik: {
      footL: { target: [-0.14, 0.2, GZ], space: 'body', yaw: 10 }, footR: { target: [0.17, -0.16, GZ], space: 'body', yaw: -25 },
      handL: { target: [-0.1, 0.33, 0.42], space: 'body', pole: [-0.7, -0.3, -0.7] }, handR: { target: [0.1, 0.24, 0.38], space: 'body', pole: [0.7, -0.3, -0.7] },
    },
    fingers: { L: { preset: 'fist' }, R: { preset: 'fist' } },
  },
  pose_reach: {
    root: { p: [0, 0.03, -0.03], rot: [0, 0, 0] },
    bones: { SKEL_Spine1: [-8, 0, 0], SKEL_Spine2: [-6, 0, 0], SKEL_Head: [-4, 0, 0] },
    ik: { handL: { target: [-0.17, 0.55, 0.22], space: 'body', pole: [-0.8, -0.2, -0.6] }, handR: { target: [0.17, 0.55, 0.22], space: 'body', pole: [0.8, -0.2, -0.6] } },
    fingers: { L: { preset: 'grab' }, R: { preset: 'grab' } },
  },
};
