// Generates PLACEHOLDER skeletons (approximate human proportions, GTA bone names/tags).
// They are NOT the real GTA rest poses. They exist so the pipeline, the lab and all
// tests run before the real skeletons are imported (see animkit import-skeleton).
// Bone tags come from the official GET_PED_BONE_INDEX documentation (citizenfx/natives).
//
// Usage: node animkit/core/placeholder.mjs [--out anims-src/skeletons]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  vadd, vsub, vscale, vnorm, vcross, qaxis, qrot, qmul, qconj, qnorm, DEG,
} from './math.mjs';

export const TAGS = {
  SKEL_ROOT: 0x0, SKEL_Pelvis: 0x2E28, SKEL_Spine_Root: 0xE0FD,
  SKEL_L_Thigh: 0xE39F, SKEL_L_Calf: 0xF9BB, SKEL_L_Foot: 0x3779, SKEL_L_Toe0: 0x83C,
  SKEL_R_Thigh: 0xCA72, SKEL_R_Calf: 0x9000, SKEL_R_Foot: 0xCC4D, SKEL_R_Toe0: 0x512D,
  SKEL_Spine0: 0x5C01, SKEL_Spine1: 0x60F0, SKEL_Spine2: 0x60F1, SKEL_Spine3: 0x60F2,
  SKEL_L_Clavicle: 0xFCD9, SKEL_L_UpperArm: 0xB1C5, SKEL_L_Forearm: 0xEEEB, SKEL_L_Hand: 0x49D9,
  SKEL_L_Finger00: 0x67F2, SKEL_L_Finger01: 0xFF9, SKEL_L_Finger02: 0xFFA,
  SKEL_L_Finger10: 0x67F3, SKEL_L_Finger11: 0x1049, SKEL_L_Finger12: 0x104A,
  SKEL_L_Finger20: 0x67F4, SKEL_L_Finger21: 0x1059, SKEL_L_Finger22: 0x105A,
  SKEL_L_Finger30: 0x67F5, SKEL_L_Finger31: 0x1029, SKEL_L_Finger32: 0x102A,
  SKEL_L_Finger40: 0x67F6, SKEL_L_Finger41: 0x1039, SKEL_L_Finger42: 0x103A,
  SKEL_R_Clavicle: 0x29D2, SKEL_R_UpperArm: 0x9D4D, SKEL_R_Forearm: 0x6E5C, SKEL_R_Hand: 0xDEAD,
  SKEL_R_Finger00: 0xE5F2, SKEL_R_Finger01: 0xFA10, SKEL_R_Finger02: 0xFA11,
  SKEL_R_Finger10: 0xE5F3, SKEL_R_Finger11: 0xFA60, SKEL_R_Finger12: 0xFA61,
  SKEL_R_Finger20: 0xE5F4, SKEL_R_Finger21: 0xFA70, SKEL_R_Finger22: 0xFA71,
  SKEL_R_Finger30: 0xE5F5, SKEL_R_Finger31: 0xFA40, SKEL_R_Finger32: 0xFA41,
  SKEL_R_Finger40: 0xE5F6, SKEL_R_Finger41: 0xFA50, SKEL_R_Finger42: 0xFA51,
  SKEL_Neck_1: 0x9995, SKEL_Head: 0x796E,
};

// Builds model-space joint positions for a body with the given proportions.
function body(p) {
  const J = {}; // name -> { parent, pos }
  const add = (name, parent, pos) => { J[name] = { parent, pos }; };
  const s = p.scale;
  add('SKEL_ROOT', null, [0, 0, 0]);
  add('SKEL_Pelvis', 'SKEL_ROOT', [0, 0, p.pelvisZ]);
  add('SKEL_Spine_Root', 'SKEL_ROOT', [0, 0, p.pelvisZ]);
  const sp = [0.05, 0.16, 0.28, 0.41].map((z) => z * s + p.pelvisZ);
  add('SKEL_Spine0', 'SKEL_Spine_Root', [0, -0.005, sp[0]]);
  add('SKEL_Spine1', 'SKEL_Spine0', [0, -0.012, sp[1]]);
  add('SKEL_Spine2', 'SKEL_Spine1', [0, -0.010, sp[2]]);
  add('SKEL_Spine3', 'SKEL_Spine2', [0, 0.000, sp[3]]);
  add('SKEL_Neck_1', 'SKEL_Spine3', [0, 0.012, p.pelvisZ + 0.545 * s]);
  add('SKEL_Head', 'SKEL_Neck_1', [0, 0.022, p.pelvisZ + 0.645 * s]);
  for (const side of ['L', 'R']) {
    const sx = side === 'R' ? 1 : -1;
    // Legs (knee bent 4 degrees forward so the hinge is inferable).
    const hip = [sx * p.hipW, 0, p.pelvisZ - 0.06 * s];
    const kneeZ = hip[2] - p.thigh;
    const knee = [sx * (p.hipW - 0.005), 0.012, kneeZ];
    const ankle = [sx * (p.hipW - 0.01), -0.01, kneeZ - p.shin];
    add(`SKEL_${side}_Thigh`, 'SKEL_Pelvis', hip);
    add(`SKEL_${side}_Calf`, `SKEL_${side}_Thigh`, knee);
    add(`SKEL_${side}_Foot`, `SKEL_${side}_Calf`, ankle);
    add(`SKEL_${side}_Toe0`, `SKEL_${side}_Foot`, [ankle[0] + sx * 0.01, ankle[1] + p.foot, p.groundZ + 0.025]);
    // Arms in an A-pose, palms facing down/inwards, elbow slightly flexed.
    const clav = [sx * 0.03, 0.035, p.pelvisZ + 0.50 * s];
    const shoulder = [sx * p.shoulderW, -0.005, p.pelvisZ + 0.475 * s];
    const down = p.armDown * DEG;
    const armDir = [sx * Math.cos(down), 0, -Math.sin(down)];
    // Elbow hinge: forearm flexes forward (+Y); elbow points backward (-Y).
    const hinge = vnorm(vcross([0, -1, 0], armDir));
    const foreDir = qrot(qaxis(hinge, 6 * DEG), armDir);
    const elbow = vadd(shoulder, vscale(armDir, p.upperArm));
    const wrist = vadd(elbow, vscale(foreDir, p.foreArm));
    add(`SKEL_${side}_Clavicle`, 'SKEL_Spine3', clav);
    add(`SKEL_${side}_UpperArm`, `SKEL_${side}_Clavicle`, shoulder);
    add(`SKEL_${side}_Forearm`, `SKEL_${side}_UpperArm`, elbow);
    add(`SKEL_${side}_Hand`, `SKEL_${side}_Forearm`, wrist);
    // Hand: palm normal perpendicular to the forearm, pointing down/inwards.
    const palm = vnorm([-sx * Math.sin(down), 0, -Math.cos(down)]);
    const across = [0, 1, 0]; // index side is forward
    const fingers = [
      // [base offset along hand, across offset, palm offset, segment lengths, extra dir]
      { k: 0, along: 0.025, acr: 0.028, pal: 0.012, segs: [0.042, 0.032, 0.028], thumb: true },
      { k: 1, along: 0.088, acr: 0.022, pal: 0.0, segs: [0.044, 0.026, 0.021] },
      { k: 2, along: 0.092, acr: 0.003, pal: 0.0, segs: [0.048, 0.030, 0.022] },
      { k: 3, along: 0.088, acr: -0.016, pal: 0.0, segs: [0.044, 0.028, 0.021] },
      { k: 4, along: 0.080, acr: -0.032, pal: 0.002, segs: [0.034, 0.021, 0.019] },
    ];
    for (const f of fingers) {
      const fs = p.handScale;
      let pos = vadd(wrist, vadd(vscale(foreDir, f.along * fs), vadd(vscale(across, f.acr * fs), vscale(palm, f.pal * fs))));
      const dir = f.thumb ? vnorm(vadd(vscale(foreDir, 0.55), vadd(vscale(across, 0.75), vscale(palm, 0.35)))) : foreDir;
      let parent = `SKEL_${side}_Hand`;
      for (let j = 0; j < 3; j++) {
        const name = `SKEL_${side}_Finger${f.k}${j}`;
        add(name, parent, pos);
        parent = name;
        pos = vadd(pos, vscale(dir, f.segs[j] * fs));
      }
    }
  }
  return J;
}

// Convert model-space joints into local t/r. restRotation(name) gives the model-space rest
// orientation of each bone (identity for the plain placeholder, random for invariance tests).
export function toSkeletonJson(id, model, J, groundZ, restRotation = () => [0, 0, 0, 1]) {
  const bones = [];
  const modelQ = {};
  for (const [name, j] of Object.entries(J)) modelQ[name] = qnorm(restRotation(name));
  for (const [name, j] of Object.entries(J)) {
    let t, r;
    if (!j.parent) {
      t = j.pos.slice();
      r = modelQ[name];
    } else {
      const pq = modelQ[j.parent];
      t = qrot(qconj(pq), vsub(j.pos, J[j.parent].pos));
      r = qnorm(qmul(qconj(pq), modelQ[name]));
    }
    bones.push({ name, tag: TAGS[name], parent: j.parent, t: t.map((v) => +v.toFixed(6)), r: r.map((v) => +v.toFixed(7)) });
  }
  return {
    id, model, source: 'placeholder',
    note: 'PLACEHOLDER: approximate proportions, not the GTA rest pose. Replace via animkit import-skeleton.',
    calib: { groundZ },
    bones,
  };
}

export const PROPORTIONS = {
  male: { scale: 1.0, pelvisZ: 0.0, hipW: 0.095, thigh: 0.44, shin: 0.43, foot: 0.135, shoulderW: 0.185, upperArm: 0.29, foreArm: 0.255, handScale: 1.0, armDown: 42, groundZ: -0.98 },
  female: { scale: 0.94, pelvisZ: -0.045, hipW: 0.098, thigh: 0.415, shin: 0.405, foot: 0.12, shoulderW: 0.165, upperArm: 0.265, foreArm: 0.235, handScale: 0.9, armDown: 42, groundZ: -0.98 },
};
// Female legs are shorter; keep the ground at the same entity-relative height by moving the hips.
PROPORTIONS.female.pelvisZ = PROPORTIONS.female.groundZ + 0.08 + 0.405 + 0.415 + 0.06 * 0.94;
PROPORTIONS.male.pelvisZ = PROPORTIONS.male.groundZ + 0.08 + 0.43 + 0.44 + 0.06;

export function buildPlaceholder(kind, restRotation) {
  const p = PROPORTIONS[kind === 'female' ? 'female' : 'male'];
  const J = body(p);
  const model = kind === 'female' ? 'mp_f_freemode_01' : kind === 'zombie' ? 'u_m_y_zombie_01' : 'mp_m_freemode_01';
  return toSkeletonJson(`placeholder_${kind}`, model, J, p.groundZ, restRotation);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const outIdx = process.argv.indexOf('--out');
  const out = outIdx > 0 ? process.argv[outIdx + 1] : process.cwd();
  fs.mkdirSync(out, { recursive: true });
  for (const k of ['male', 'female', 'zombie']) {
    const json = buildPlaceholder(k);
    fs.writeFileSync(path.join(out, `placeholder_${k}.json`), JSON.stringify(json, null, 1));
    console.log(`wrote placeholder_${k}.json (${json.bones.length} bones)`);
  }
}
