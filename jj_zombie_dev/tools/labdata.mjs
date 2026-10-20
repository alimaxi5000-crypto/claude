// Writes animlab/data/build.js (generated, git-ignored): skeletons, solved clip frames,
// scene definitions, metrics and the produced .ycd files (base64) so the lab can play both
// the source data and exactly the bytes the game loads. Loaded via a classic <script> tag so
// the lab works when index.html is opened directly from disk.

import fs from 'node:fs';
import path from 'node:path';
import { DEV } from './skeletons.mjs';
import { animatedBoneNames } from './animcore/skeleton.mjs';

export function writeLabData({ skeletons, scenes, exportClips, report, dicts, streamDir }) {
  const out = path.join(DEV, 'animlab', 'data');
  fs.mkdirSync(out, { recursive: true });
  const skel = {};
  for (const [k, s] of Object.entries(skeletons)) skel[k] = { ...s.toJSON(), key: k };
  const clips = {};
  for (const c of exportClips) {
    const bones = animatedBoneNames(c.skel);
    const stride = bones.length * 4 + 10;
    const buf = new Float32Array(c.frames * stride);
    c.solved.forEach((s, f) => {
      let o = f * stride;
      for (const b of bones) { const q = s.local[c.skel.idx(b)]; buf[o++] = q[0]; buf[o++] = q[1]; buf[o++] = q[2]; buf[o++] = q[3]; }
      buf.set(s.rootT, o); o += 3;
      buf.set(s.mover.p, o); o += 3;
      buf.set(s.mover.q, o);
    });
    clips[c.name] = {
      dict: c.dict, actor: c.actor, scene: c.scene, skeletonKey: Object.keys(skeletons).find((k) => skeletons[k] === c.skel),
      frames: c.frames, duration: c.duration, loop: c.loop, bones, stride,
      data: Buffer.from(buf.buffer).toString('base64'),
      metrics: c.metrics, readback: c.readback || null,
    };
  }
  const ycd = {};
  for (const d of dicts.keys()) {
    const f = path.join(streamDir, `${d}.ycd`);
    if (fs.existsSync(f)) ycd[d] = fs.readFileSync(f).toString('base64');
  }
  // Playable chains of the finisher, as the game strings them together.
  const has = (k) => scenes.some((s) => s.key === k);
  const sequences = [];
  for (const g of ['m', 'f']) {
    const label = g === 'm' ? 'männlich' : 'weiblich';
    sequences.push({ name: `Finisher Erfolg (${label})`, items: [
      { key: `fin_grab:d0_${g}` }, { key: `fin_struggle_mid:${g}`, repeat: 2 }, { key: `fin_struggle_high:${g}`, repeat: 2 }, { key: `fin_shove:${g}` }] });
    sequences.push({ name: `Finisher Biss von hinten (${label})`, items: [
      { key: `fin_grab:d4_${g}` }, { key: `fin_struggle_mid:${g}` }, { key: `fin_struggle_low:${g}`, repeat: 2 }, { key: `fin_bite:${g}` }, { key: `fin_recover:${g}` }] });
  }
  sequences.push({ name: 'Zombie: Brüllen, Rennen, Treffer, Tod', items: [
    { key: 'zmove_alert_roar:' }, { key: 'zmove_runner_run:', repeat: 3 }, { key: 'zreact_hit_front:' }, { key: 'zreact_death_a:' }] });
  const data = {
    generated: new Date().toISOString(),
    sequences: sequences.map((q) => ({ ...q, items: q.items.filter((i) => has(i.key)).map((i) => ({ repeat: 1, ...i })) })).filter((q) => q.items.length),
    skeletons: skel,
    scenes: scenes.map((s) => ({ key: s.key, name: s.name, variant: s.variant, dict: s.dict, duration: s.duration, loop: s.loop, actors: s.actors, origins: s.origins || null, events: s.events, meta: s.meta, checks: s.checks || null, sceneMetrics: s.sceneMetrics || null })),
    clips, ycd,
    blends: report.blends, problems: report.problems,
  };
  fs.writeFileSync(path.join(out, 'build.js'), `window.JJZ_BUILD = ${JSON.stringify(data)};\n`);
}
