// Natural hand orientation probe: solves a clip frame with the palm weights of the chosen arm
// set to 0 and prints the hand's finger / palm directions in scene space, next to the requested
// palm spec (helps author plausible grips).
//   node tools/handprobe.mjs <sourceName> <variant> <actor> <side L|R> <t>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadSkeletons, DEV } from './skeletons.mjs';
import { sampleScene } from './animcore/scene.mjs';
import { qrot, qmul, qnorm, vnorm, DEG, vdot } from './animcore/math.mjs';
import { BODY } from './animcore/skeleton.mjs';

const [name, suffix, actor, side, tStr, poleStr] = process.argv.slice(2);
const poleOverride = poleStr ? poleStr.split(',').map(Number) : null;
const { skeletons } = loadSkeletons({ quiet: true });
const dir = path.join(DEV, 'anims-src', 'clips');
let src;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mjs'))) {
  const m = await import(pathToFileURL(path.join(dir, f)).href);
  for (const s of [].concat(m.default)) if (s.name === name) src = s;
}
const variant = (src.variants || [{ suffix: '' }]).find((v) => (v.suffix || '') === (suffix === '-' ? '' : suffix));
let requested = null;
const probe = { ...src, pose(t, ctx) {
  const p = src.pose(t, ctx);
  const pa = p[actor] || p;
  const arm = pa.arm?.[side];
  if (arm?.palm) { requested = arm.palm; arm.palm = { ...arm.palm, weight: 0 }; }
  if (arm && poleOverride) arm.pole = poleOverride;
  if (Math.round(t * 30) === Math.round(+tStr * 30)) console.log('spec', JSON.stringify({ target: arm?.target, space: arm?.space, terms: arm?.terms, pole: arm?.pole }));
  return p;
} };
const sampled = sampleScene(probe, variant, skeletons);
const skel = sampled.skeletons[actor] || sampled.skeletons[Object.keys(sampled.skeletons)[0]];
const frames = sampled.frames[actor] || sampled.frames[Object.keys(sampled.frames)[0]];
const f = Math.min(frames.length - 1, Math.round(+tStr * 30));
const sol = frames[f];
const hi = skel.idx(BODY.side[side].hand);
const q = qnorm(qmul(sol.mover.q, sol.D[hi]));
const hf = skel.limbs['hand' + side];
const fmt = (v) => '[' + v.map((x) => x.toFixed(2)).join(', ') + ']';
const fwd = qrot(q, hf.fwd), palm = qrot(q, hf.palm);
console.log(`frame ${f}: natural fingerDir ${fmt(fwd)} palmDir ${fmt(palm)}`);
if (requested) {
  const rf = vnorm(requested.fingerDir), rp = vnorm(requested.palmDir);
  console.log(`requested fingerDir ${fmt(rf)} palmDir ${fmt(rp)} (weight ${requested.weight})`);
  console.log(`angle fingers ${(Math.acos(Math.max(-1, Math.min(1, vdot(fwd, rf)))) / DEG).toFixed(0)} deg, palms ${(Math.acos(Math.max(-1, Math.min(1, vdot(palm, rp)))) / DEG).toFixed(0)} deg`);
}
const P = (b) => sol.world.P[skel.idx(b)];
const S = BODY.side[side];
console.log('shoulder', fmt(P(S.upper)), 'elbow', fmt(P(S.lower)), 'wrist', fmt(P(S.hand)), 'neck', fmt(P('SKEL_Neck_1')));
