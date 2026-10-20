// Skeleton resolution shared by every animkit user (zombie build, studio converter, tests).
// Order of preference per key:
//   1. <realDir>/<key>.json   imported from YOUR game files (animkit import-skeleton); never committed
//   2. reference GTA ped skeleton (Sollumz tools/BoneProperties.xml, fetched by animkit/setup.sh)
//      -> male + zombie directly, female with scaled proportions
//   3. generated placeholders (tests only; clearly not GTA data)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Skeleton } from './skeleton.mjs';
import { parseBoneXml, skeletonFromBones, femaleFromMale } from './skelio.mjs';
import { buildPlaceholder } from './placeholder.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ANIMKIT = path.resolve(HERE, '..');
export const VENDOR = path.join(ANIMKIT, 'vendor');
export const REF_XML = path.join(VENDOR, 'sollumz', 'BoneProperties.xml');
export const REAL_DIR = path.join(ANIMKIT, 'skeletons', 'real');
export { SKELETON_KEYS, MODEL_KEYS, skeletonKeyFor } from './models.mjs';
import { SKELETON_KEYS } from './models.mjs';

export function referenceSkeletonJson(refXml = REF_XML) {
  if (!fs.existsSync(refXml)) return null;
  return skeletonFromBones(parseBoneXml(fs.readFileSync(refXml, 'utf8')), {
    id: 'ref_male', model: 'mp_m_freemode_01 (reference)', source: 'sollumz-boneproperties@e124bdd',
  });
}

// realDir: one folder or a list (first match wins).
export function loadSkeletons({ realDir = REAL_DIR, refXml = REF_XML, allowPlaceholder = true, quiet = false, log = console.log } = {}) {
  const out = {};
  const info = {};
  const ref = referenceSkeletonJson(refXml);
  for (const key of SKELETON_KEYS) {
    const realFile = [].concat(realDir).map((d) => path.join(d, `${key}.json`)).find((f) => fs.existsSync(f));
    if (realFile) {
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
    if (!allowPlaceholder) throw new Error(`no skeleton for '${key}': run animkit/setup.sh or import your own`);
    out[key] = new Skeleton(buildPlaceholder(key));
    info[key] = 'PLACEHOLDER';
  }
  if (!quiet) for (const k of Object.keys(info)) log(`skeleton ${k.padEnd(6)} -> ${info[k]} (${out[k].id}, height ${out[k].height().toFixed(2)} m)`);
  return { skeletons: out, info };
}
