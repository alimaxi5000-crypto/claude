// Skeletons for the zombie build. The loader lives in animkit/core/skeletons.mjs; this project
// keeps its own folder for imported real skeletons (anims-src/skeletons/real, git-ignored).
//   1. anims-src/skeletons/real/<key>.json, then animkit/skeletons/real/<key>.json
//      (imported from YOUR game files with `animkit import-skeleton`)
//   2. reference GTA ped skeleton from animkit/vendor/sollumz/BoneProperties.xml (animkit/setup.sh)
//   3. generated placeholders (tests only; clearly not GTA data)

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSkeletons as load, REF_XML, REAL_DIR as KIT_REAL_DIR } from '../../animkit/core/skeletons.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DEV = path.resolve(HERE, '..');
export const REAL_DIR = path.join(DEV, 'anims-src', 'skeletons', 'real');
export { REF_XML };

export function loadSkeletons(opts = {}) {
  return load({ realDir: [REAL_DIR, KIT_REAL_DIR], ...opts });
}
