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
  const data = {
    generated: new Date().toISOString(),
    skeletons: skel,
    scenes: scenes.map((s) => ({ key: s.key, name: s.name, variant: s.variant, dict: s.dict, duration: s.duration, loop: s.loop, actors: s.actors, events: s.events, meta: s.meta, sceneMetrics: s.sceneMetrics || null })),
    clips, ycd,
    blends: report.blends, problems: report.problems,
  };
  fs.writeFileSync(path.join(out, 'build.js'), `window.JJZ_BUILD = ${JSON.stringify(data)};\n`);
}
