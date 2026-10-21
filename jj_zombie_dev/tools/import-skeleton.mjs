// Imports a real ped skeleton for the zombie build into anims-src/skeletons/real (git-ignored).
// The importer lives in animkit (animkit/cli/commands/import-skeleton.mjs).
//   node tools/import-skeleton.mjs <male|female|zombie> <path/to/model.yft.xml>
import importSkeleton from '../../animkit/cli/commands/import-skeleton.mjs';
import { REAL_DIR } from './skeletons.mjs';

const dir = process.env.JJZ_SKELETON_DIR || REAL_DIR;
process.exitCode = await importSkeleton([...process.argv.slice(2), '--dir', dir]);
