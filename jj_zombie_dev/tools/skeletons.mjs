// Resolves the skeletons used by the build, in order of preference:
//   1. anims-src/skeletons/real/<key>.json   (imported from YOUR game files, tools/import-skeleton.mjs)
//   2. reference GTA ped skeleton from tools/vendor/sollumz/BoneProperties.xml (setup.sh)
//      -> male + zombie directly, female with scaled proportions
//   3. generated placeholders (tests only; clearly not GTA data)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Skeleton } from './animcore/skeleton.mjs';
import { parseBoneXml, skeletonFromBones, femaleFromMale } from './animcore/skelio.mjs';
import { buildPlaceholder } from './make-placeholder-skeletons.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DEV = path.resolve(HERE, '..');
export const REAL_DIR = path.join(DEV, 'anims-src', 'skeletons', 'real');
export const REF_XML = path.join(HERE, 'vendor', 'sollumz', 'BoneProperties.xml');

export function loadSkeletons({ allowPlaceholder = true, quiet = false } = {}) {
  const out = {};
  const info = {};
  let ref = null;
  if (fs.existsSync(REF_XML)) {
    ref = skeletonFromBones(parseBoneXml(fs.readFileSync(REF_XML, 'utf8')), {
      id: 'ref_male', model: 'mp_m_freemode_01 (reference)', source: 'sollumz-boneproperties@e124bdd',
    });
  }
  for (const key of ['male', 'female', 'zombie']) {
    const realFile = path.join(REAL_DIR, `${key}.json`);
    if (fs.existsSync(realFile)) {
      out[key] = new Skeleton(JSON.parse(fs.readFileSync(realFile, 'utf8')));
      info[key] = 'real';
      continue;
    }
    if (ref) {
      const json = key === 'female' ? femaleFromMale(ref) : { ...ref, id: `ref_${key}` };
      out[key] = new Skeleton(json);
      info[key] = key === 'female' ? 'reference (female proportions approximated)' : 'reference';
      continue;
    }
    if (!allowPlaceholder) throw new Error(`no skeleton for '${key}': run tools/setup.sh or import your own`);
    out[key] = new Skeleton(buildPlaceholder(key));
    info[key] = 'PLACEHOLDER';
  }
  if (!quiet) for (const k of Object.keys(info)) console.log(`skeleton ${k.padEnd(6)} -> ${info[k]} (${out[k].id}, height ${out[k].height().toFixed(2)} m)`);
  return { skeletons: out, info };
}
