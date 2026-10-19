// Per-frame diagnostics for one clip source / variant (debugging metric failures).
//   node tools/diag.mjs <sourceName> [variantSuffix] [--actor victim|zombie] [--bones a,b]
// Prints per frame: worst angular velocity bone, lowest foot height, both feet heights and
// optionally the angular velocity of the listed bones.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadSkeletons, DEV } from './skeletons.mjs';
import { sampleScene, setAlignment } from './animcore/scene.mjs';
import { qangle, DEG } from './animcore/math.mjs';
import { BODY } from './animcore/skeleton.mjs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const [name, suffix = ''] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const { skeletons } = loadSkeletons({ quiet: true });
const ALIGN = path.join(DEV, 'anims-src', 'align.json');
setAlignment(fs.existsSync(ALIGN) ? JSON.parse(fs.readFileSync(ALIGN, 'utf8')) : {});
const dir = path.join(DEV, 'anims-src', 'clips');
let src;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mjs'))) {
  const m = await import(pathToFileURL(path.join(dir, f)).href);
  for (const s of [].concat(m.default)) if (s.name === name) src = s;
}
if (!src) { console.error('unknown source ' + name); process.exit(1); }
const variant = (src.variants || [{ suffix: '' }]).find((v) => (v.suffix || '') === suffix);
if (!variant) { console.error('unknown variant ' + suffix); process.exit(1); }
const sampled = sampleScene(src, variant, skeletons);
const actors = opt('--actor') ? [opt('--actor')] : sampled.actors;
const bones = (opt('--bones') || '').split(',').filter(Boolean);
for (const actor of actors) {
  const skel = sampled.skeletons[actor], frames = sampled.frames[actor];
  console.log(`== ${name}:${suffix} ${actor}`);
  for (let f = 0; f < frames.length; f++) {
    const sol = frames[f], prev = frames[f - 1];
    let worst = 0, wb = '';
    const extra = [];
    if (prev) {
      for (const i of skel.order) {
        const bn = skel.bones[i].name;
        if (!bn.startsWith('SKEL_') || bn.includes('Finger')) continue;
        const av = qangle(sol.world.Q[i], prev.world.Q[i]) / DEG * 30;
        if (av > worst) { worst = av; wb = bn; }
        if (bones.includes(bn)) extra.push(`${bn}=${av.toFixed(0)}`);
      }
    }
    const gz = skel.groundZ + sol.mover.p[2];
    const h = ['L', 'R'].map((s) => {
      const a = sol.world.P[skel.idx(BODY.side[s].foot)][2] - (gz + 0.085);
      const tI = skel.has(BODY.side[s].toe) ? skel.idx(BODY.side[s].toe) : -1;
      const t = tI >= 0 ? sol.world.P[tI][2] - (gz + 0.025) : a;
      return Math.min(a, t);
    });
    const fades = (sol.fades || []).map((x) => `palmFade ${x.side} ${x.angle.toFixed(0)}`).join(' ');
    console.log(`${String(f).padStart(3)} t=${(f / 30).toFixed(2)} angVel ${worst.toFixed(0).padStart(5)} ${wb.padEnd(16)} feet L ${h[0].toFixed(3)} R ${h[1].toFixed(3)} ${extra.join(' ')} ${fades}`);
  }
}
