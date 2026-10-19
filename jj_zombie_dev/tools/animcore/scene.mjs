// Scene sampling: evaluates a clip source (one or more actors sharing a scene origin) at a
// fixed frame rate and solves every actor with the rig. Contacts between actors are resolved
// with a few fixed-point passes: pass 0 uses rest-pose estimates of the other actors, later
// passes use the previous pass' solution.

import { Rig, worldOf } from './rig.mjs';
import { qrot, qmul, qnorm, vadd, qconj } from './math.mjs';
import { animatedBoneNames } from './skeleton.mjs';

export const FPS = 30;
const PASSES = 3;

// Context handed to a clip's pose(t, ctx) function.
class Ctx {
  constructor(scene, prev, t, variant) {
    this.scene = scene;
    this.prev = prev; // actor -> solved world pose of previous pass (or null)
    this.t = t;
    this.v = variant;
    this.T = scene.duration;
    this.phase = scene.duration > 0 ? t / scene.duration : 0;
  }
  // World position of a bone of an actor, optionally offset in that bone's posed frame.
  // The offset is expressed in the REST MODEL frame (portable across skeletons) and rotated
  // by the bone's pose delta.
  at(actor, bone, offset = [0, 0, 0]) {
    const sol = this.prev?.[actor];
    const skel = this.scene.skeletons[actor];
    const i = skel.idx(bone);
    if (!sol) {
      // Rest estimate at the scene origin (pass 0).
      return vadd(skel.restP[i], offset);
    }
    const d = qnorm(qmul(sol.mover.q, sol.D[i]));
    return vadd(sol.world.P[i], qrot(d, offset));
  }
  // Mover (entity) position of an actor from the previous pass.
  moverOf(actor) {
    return this.prev?.[actor]?.mover ?? { p: [0, 0, 0], q: [0, 0, 0, 1] };
  }
  // Point given in an actor's body (entity) frame -> scene space.
  body(actor, p) {
    const m = this.moverOf(actor);
    return vadd(m.p, qrot(m.q, p));
  }
}

// Resolve a scene source + variant into per-actor frame arrays.
// source: { name, dict, duration, loop, actors: {role: skeletonKey}, pose(t, ctx) }
// skeletons: { key -> Skeleton }, variant: { suffix, skel: {role: key}, ... }
export function sampleScene(source, variant, skeletons) {
  const actors = Object.keys(source.actors);
  const skelFor = {};
  for (const a of actors) {
    const key = variant?.skel?.[a] ?? source.actors[a];
    const s = skeletons[key];
    if (!s) throw new Error(`${source.name}: skeleton '${key}' for actor '${a}' not loaded`);
    skelFor[a] = s;
  }
  const scene = { name: source.name, duration: source.duration, skeletons: skelFor };
  const rigs = Object.fromEntries(actors.map((a) => [a, new Rig(skelFor[a])]));
  const nFrames = Math.max(2, Math.round(source.duration * FPS) + 1);
  const frames = Object.fromEntries(actors.map((a) => [a, []]));
  for (let f = 0; f < nFrames; f++) {
    const t = f / FPS;
    let prev = null;
    let sols = null;
    for (let pass = 0; pass < PASSES; pass++) {
      const ctx = new Ctx(scene, prev, t, variant || {});
      const poses = source.pose(t, ctx);
      sols = {};
      for (const a of actors) {
        const pose = actors.length === 1 && !poses[a] ? poses : poses[a];
        const sol = rigs[a].solve(pose || {});
        sol.world = worldOf(sol);
        sols[a] = sol;
      }
      prev = sols;
      if (!source.contacts && actors.length === 1) break; // single actor: one pass is enough
    }
    for (const a of actors) frames[a].push(sols[a]);
  }
  const duration = (nFrames - 1) / FPS;
  return { scene, actors, skeletons: skelFor, frames, duration, nFrames };
}

// Convert solved frames of one actor into exportable tracks (by bone name).
export function tracksOf(skel, frames) {
  const names = animatedBoneNames(skel);
  const rot = {};
  for (const n of names) {
    const i = skel.idx(n);
    rot[n] = frames.map((s) => s.local[i]);
  }
  return {
    bones: names,
    rot,
    rootT: frames.map((s) => s.rootT),
    moverP: frames.map((s) => s.mover.p),
    moverQ: frames.map((s) => s.mover.q),
  };
}

export { qconj };

// Rebuild a full solved-frame object from local rotations (e.g. decoded from a .ycd) so the
// same metrics/visualisation code can run on file data. Bones missing in `local` keep rest.
export function solFromLocals(skel, local, rootT, mover) {
  const n = skel.bones.length;
  const P = new Array(n), Q = new Array(n), D = new Array(n), L = new Array(n);
  for (const i of skel.order) {
    const b = skel.bones[i];
    const lq = local[i] ?? b.r;
    L[i] = lq;
    if (b.parent < 0) {
      P[i] = (rootT ?? b.t).slice();
      Q[i] = lq.slice();
    } else {
      P[i] = vadd(P[b.parent], qrot(Q[b.parent], b.t));
      Q[i] = qnorm(qmul(Q[b.parent], lq));
    }
    D[i] = qnorm(qmul(Q[i], qconj(skel.restQ[i])));
  }
  const sol = { mover: { p: mover.p.slice(), q: mover.q.slice() }, rootT: P[skel.order[0]].slice(), P, Q, D, local: L };
  sol.world = {
    P: P.map((p) => vadd(sol.mover.p, qrot(sol.mover.q, p))),
    Q: Q.map((q) => qnorm(qmul(sol.mover.q, q))),
  };
  return sol;
}
