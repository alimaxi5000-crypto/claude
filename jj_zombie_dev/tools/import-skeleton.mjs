// Imports a real ped skeleton from a CodeWalker "Export XML" of the ped model (.yft.xml or
// .ydd.xml; the <Skeleton><Bones> block written by CodeWalker's Bone.WriteXml is used) and
// stores it as anims-src/skeletons/real/<key>.json. The build then prefers it over the
// reference skeleton. The file stays local: anims-src/skeletons/real/ is git-ignored because it
// is derived from Rockstar game data.
//   node tools/import-skeleton.mjs <male|female|zombie> <path/to/model.yft.xml>
import fs from 'node:fs';
import path from 'node:path';
import { parseBoneXml, skeletonFromBones, Skeleton } from './animcore/skelio.mjs';
import { REAL_DIR as REAL_DEFAULT, REF_XML } from './skeletons.mjs';
import { animatedBoneNames } from './animcore/skeleton.mjs';

const [key, file] = process.argv.slice(2);
const REAL_DIR = process.env.JJZ_SKELETON_DIR || REAL_DEFAULT;   // override for tests
if (!['male', 'female', 'zombie'].includes(key) || !file) {
  console.error('usage: node tools/import-skeleton.mjs <male|female|zombie> <model.yft.xml>');
  process.exit(2);
}
const xml = fs.readFileSync(file, 'utf8');
const bones = parseBoneXml(xml);
const missing = ['SKEL_ROOT', 'SKEL_Pelvis', 'SKEL_Spine3', 'SKEL_Head', 'SKEL_L_Hand', 'SKEL_R_Foot'].filter((n) => !bones.some((b) => b.name === n));
if (missing.length) { console.error(`not a ped skeleton (missing ${missing.join(', ')})`); process.exit(1); }
const json = skeletonFromBones(bones, { id: `real_${key}`, model: path.basename(file).replace(/\.xml$/i, ''), source: `CodeWalker export ${path.basename(file)}` });
const skel = new Skeleton(json);
fs.mkdirSync(REAL_DIR, { recursive: true });
const out = path.join(REAL_DIR, `${key}.json`);
fs.writeFileSync(out, JSON.stringify(json, null, 1));
console.log(`${out}: ${json.bones.length} bones (${animatedBoneNames(skel).length} animated), height ${skel.height().toFixed(3)} m, ground ${skel.groundZ.toFixed(3)}`);
// Compare with the reference skeleton (how much the build will change).
if (fs.existsSync(REF_XML)) {
  const ref = new Skeleton(skeletonFromBones(parseBoneXml(fs.readFileSync(REF_XML, 'utf8')), { id: 'ref', model: 'ref', source: 'ref' }));
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
console.log('Next: node tools/build-anims.mjs  (rebuilds every clip on the real skeleton)');
