// animkit import-skeleton <male|female|zombie> <model.yft.xml> [--dir <folder>]
// Imports a real ped skeleton from a CodeWalker "Export XML" of the ped model (.yft.xml or
// .ydd.xml; the <Skeleton><Bones> block written by CodeWalker's Bone.WriteXml is used) and
// stores it as <folder>/<key>.json (default animkit/skeletons/real). Every build then prefers it
// over the reference skeleton. The file stays local: the folder is git-ignored because it is
// derived from Rockstar game data. Never commit or share it.
import fs from 'node:fs';
import path from 'node:path';
import { parseBoneXml, skeletonFromBones, Skeleton } from '../../core/skelio.mjs';
import { REAL_DIR, referenceSkeletonJson, SKELETON_KEYS } from '../../core/skeletons.mjs';
import { animatedBoneNames } from '../../core/skeleton.mjs';

export const REQUIRED_BONES = ['SKEL_ROOT', 'SKEL_Pelvis', 'SKEL_Spine3', 'SKEL_Head', 'SKEL_L_Hand', 'SKEL_R_Foot'];

export default async function importSkeleton(args) {
  const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
  const [key, file] = pos;
  const dir = opt('--dir') || process.env.ANIMKIT_SKELETON_DIR || process.env.JJZ_SKELETON_DIR || REAL_DIR;
  if (!SKELETON_KEYS.includes(key) || !file) {
    console.error('usage: animkit import-skeleton <male|female|zombie> <model.yft.xml> [--dir folder]');
    return 2;
  }
  if (!fs.existsSync(file)) { console.error(`file not found: ${file}`); return 1; }
  const bones = parseBoneXml(fs.readFileSync(file, 'utf8'));
  const missing = REQUIRED_BONES.filter((n) => !bones.some((b) => b.name === n));
  if (missing.length) { console.error(`not a ped skeleton (missing ${missing.join(', ')})`); return 1; }
  const json = skeletonFromBones(bones, { id: `real_${key}`, model: path.basename(file).replace(/\.xml$/i, ''), source: `CodeWalker export ${path.basename(file)}` });
  const skel = new Skeleton(json);
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `${key}.json`);
  fs.writeFileSync(out, JSON.stringify(json, null, 1));
  console.log(`${out}: ${json.bones.length} bones (${animatedBoneNames(skel).length} animated), height ${skel.height().toFixed(3)} m, ground ${skel.groundZ.toFixed(3)}`);
  // Compare with the reference skeleton (how much the builds will change).
  const refJson = referenceSkeletonJson();
  if (refJson) {
    const ref = new Skeleton(refJson);
    let worst = 0, worstName = '', tagDiff = 0;
    for (const b of json.bones) {
      if (!ref.has(b.name)) continue;
      const r = ref.bones[ref.idx(b.name)];
      if (r.tag !== b.tag) tagDiff++;
      const d = Math.hypot(r.t[0] - b.t[0], r.t[1] - b.t[1], r.t[2] - b.t[2]);
      if (d > worst) { worst = d; worstName = b.name; }
    }
    console.log(`vs reference: largest bone offset difference ${(worst * 1000).toFixed(1)} mm (${worstName}), ${tagDiff} differing bone tags`);
  }
  console.log('Next: rebuild your clips (they now use the real skeleton).');
  return 0;
}
