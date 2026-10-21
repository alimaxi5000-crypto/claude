// Skeleton import from CodeWalker bone XML. Accepts either
//  * a CodeWalker "Export XML" of a ped model (mp_m_freemode_01.yft.xml / .ydd.xml), whose
//    <Skeleton><Bones><Item>... list is used, or
//  * a plain <Bones><Item>... list (e.g. Sollumz tools/BoneProperties.xml).
// Only the humanoid body bones (SKEL_*) and their ancestors are kept.
//
// Root convention: the GTA bind pose stores SKEL_ROOT rotated 180 degrees about Z (the mesh is
// authored facing -Y). In-game the ped faces the entity's +Y, so the animation-neutral root
// rotation is identity. The importer therefore replaces the root rotation by calib.rootNeutral
// (default identity). /ztestanim "face" verifies this in game (see docs/INGAME_TEST.md).

import { Skeleton } from './skeleton.mjs';
import { vscale } from './math.mjs';

function attr(block, tag, keys) {
  const m = block.match(new RegExp(`<${tag}\\s+([^/>]*)/?>`));
  if (!m) return null;
  const out = {};
  for (const a of m[1].matchAll(/(\w+)="([^"]*)"/g)) out[a[1]] = a[2];
  return keys.map((k) => +out[k]);
}

export function parseBoneXml(xml) {
  // Prefer the <Skeleton> block of a model export.
  let src = xml;
  const sk = xml.match(/<Skeleton>([\s\S]*?)<\/Skeleton>/);
  if (sk) src = sk[1];
  const bonesBlock = src.match(/<Bones>([\s\S]*?)<\/Bones>/);
  if (!bonesBlock) throw new Error('no <Bones> list found');
  const items = [...bonesBlock[1].matchAll(/<Item>([\s\S]*?)<\/Item>/g)].map((m) => m[1]);
  return items.map((s) => ({
    name: (s.match(/<Name>(.*?)<\/Name>/) || [])[1],
    tag: attr(s, 'Tag', ['value'])[0],
    index: attr(s, 'Index', ['value'])[0],
    parentIndex: attr(s, 'ParentIndex', ['value'])[0],
    t: attr(s, 'Translation', ['x', 'y', 'z']),
    r: attr(s, 'Rotation', ['x', 'y', 'z', 'w']),
  }));
}

export function skeletonFromBones(list, { id, model, source, keep = (n) => n.startsWith('SKEL_'), calib = {} }) {
  const byIdx = new Map(list.map((b) => [b.index, b]));
  const keepSet = new Set();
  for (const b of list) {
    if (!keep(b.name)) continue;
    let c = b;
    while (c) { keepSet.add(c.name); c = c.parentIndex >= 0 ? byIdx.get(c.parentIndex) : null; }
  }
  const rootNeutral = calib.rootNeutral ?? [0, 0, 0, 1];
  const bones = list.filter((b) => keepSet.has(b.name)).map((b) => ({
    name: b.name,
    tag: b.tag,
    parent: b.parentIndex >= 0 ? byIdx.get(b.parentIndex).name : null,
    t: b.t,
    r: b.parentIndex >= 0 ? b.r : rootNeutral,
  }));
  return { id, model, source, calib: { ...calib, rootNeutral, bindRoot: list.find((b) => b.parentIndex < 0)?.r }, bones };
}

// Approximate female proportions from a male skeleton (used only until the real
// mp_f_freemode_01 skeleton is imported). Rotations are kept: GTA plays the same clips on all
// humanoid peds, so local rotation conventions are shared; only bone lengths differ.
const FEMALE_SCALE = [
  [/Thigh|Calf|Foot/, 0.955],
  [/Toe/, 0.9],
  [/Spine|Neck|Head/, 0.94],
  [/Clavicle/, 0.88],
  [/UpperArm|Forearm/, 0.925],
  [/Hand|Finger/, 0.88],
];
export function femaleFromMale(json) {
  const out = JSON.parse(JSON.stringify(json));
  out.id = json.id.replace('male', 'female');
  out.model = 'mp_f_freemode_01';
  out.source = json.source + '+female-scaled';
  for (const b of out.bones) {
    let s = 1;
    for (const [re, f] of FEMALE_SCALE) if (re.test(b.name)) { s = f; break; }
    if (/_L_Thigh|_R_Thigh/.test(b.name)) s = 1.04; // wider hips
    b.t = vscale(b.t, s);
  }
  // Lower the pelvis so the feet stay on the same ground plane.
  const male = new Skeleton(json), fem = new Skeleton(out);
  const dz = male.groundZ - fem.groundZ;
  const root = out.bones.find((b) => b.parent === null);
  root.t = [root.t[0], root.t[1], root.t[2] + dz];
  out.calib = { ...out.calib, groundZ: male.groundZ };
  return out;
}

export { Skeleton };
