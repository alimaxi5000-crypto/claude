// Studio state: document, history (undo/redo), selection, time, solver cache, change events.
import { documentSource, sampleDocument } from '../../../animkit/core/resolve.mjs';
import { Rig, worldOf } from '../../../animkit/core/rig.mjs';
import { measureDocument, evaluateChecks, overall } from '../../../animkit/core/checks.mjs';
import { qmul, qnorm, qrot, vadd } from '../../../animkit/core/math.mjs';
import { serialize } from './edit.mjs';

export const S = {
  doc: null, name: null, dirty: false, savedAt: null, version: 0,
  t: 0, playing: false, speed: 1, onion: false, limitsOn: true, overlay: true,
  actor: 'a', selBone: null, selHandle: null, selKeys: [], range: null,
  history: [], future: [], undoMax: 150,
  skeletons: {}, skeletonSource: 'none', config: {}, frame: null, partners: [],
  clipboardPose: null, clipboardKeys: null,
  findings: [], light: 'ok', checking: false, checkError: null,
  poses: {}, projects: [], watch: { alive: false }, test: null, lastResult: null,
};

const listeners = new Map();
export function on(what, fn) { if (!listeners.has(what)) listeners.set(what, []); listeners.get(what).push(fn); }
export function changed(...what) {
  for (const w of [...what, '*']) for (const fn of listeners.get(w) || []) { try { fn(w); } catch (e) { console.error(w, e); } }
}

// ------------------------------------------------------------------ document + history
let dragBase = null;
export function loadDoc(doc, name) {
  S.doc = doc; S.name = name; S.dirty = false; S.history = []; S.future = []; S.version++;
  S.t = Math.min(S.t, doc.duration); S.selKeys = []; S.range = null;
  invalidate();
  changed('doc', 'time', 'history', 'selection', 'project');
}
export function setDoc(doc, { commit = true } = {}) {
  if (commit && !dragBase) pushHistory(serialize(S.doc));
  S.doc = doc; S.dirty = true; S.version++;
  invalidate();
  changed('doc', 'history');
}
export function mutate(fn, opts) {
  const d = structuredClone(S.doc);
  fn(d);
  setDoc(d, opts);
}
function pushHistory(text) {
  S.history.push(text);
  if (S.history.length > S.undoMax) S.history.shift();
  S.future = [];
}
// Drags: one history step for the whole drag.
export function beginDrag() { if (!dragBase) dragBase = serialize(S.doc); }
export function endDrag() {
  if (!dragBase) return;
  const base = dragBase;
  dragBase = null;
  if (base !== serialize(S.doc)) { pushHistory(base); changed('history'); }
}
export function undo() {
  if (!S.history.length) return;
  S.future.push(serialize(S.doc));
  S.doc = JSON.parse(S.history.pop()); S.dirty = true; S.version++;
  invalidate(); changed('doc', 'history');
}
export function redo() {
  if (!S.future.length) return;
  S.history.push(serialize(S.doc));
  S.doc = JSON.parse(S.future.pop()); S.dirty = true; S.version++;
  invalidate(); changed('doc', 'history');
}

// ------------------------------------------------------------------ solving
let cache = { version: -1, source: null, rigs: null };
function invalidate() { cache.version = -1; scheduleChecks(); }

export function source() {
  if (cache.version !== S.version) {
    const r = documentSource(S.doc, S.skeletons);
    const rigs = {};
    for (const id of Object.keys(S.doc.actors)) rigs[id] = new Rig(S.skeletons[r.skelKeys[id]]);
    cache = { version: S.version, source: r.source, skelKeys: r.skelKeys, rigs, frames: new Map() };
  }
  return cache;
}
export function skeletonOf(actor) { const c = source(); return S.skeletons[c.skelKeys[actor]]; }

// Solve all actors at time t (with the same fixed-point passes as the build for contacts).
export function solveAt(t) {
  const c = source();
  const key = Math.round(t * 1000);
  if (c.frames.has(key)) return c.frames.get(key);
  const ids = Object.keys(S.doc.actors);
  const passes = c.source.contacts ? 3 : 1;
  let prev = null, sols = null;
  for (let pass = 0; pass < passes; pass++) {
    const ctx = {
      at(actor, bone, offset = [0, 0, 0]) {
        const sk = skeletonOf(actor);
        const i = sk.idx(bone);
        const sol = prev?.[actor];
        if (!sol) return vadd(sk.restP[i], offset);
        return vadd(sol.world.P[i], qrot(qnorm(qmul(sol.mover.q, sol.D[i])), offset));
      },
    };
    const poses = c.source.pose(t, ctx);
    sols = {};
    for (const id of ids) {
      const sol = c.rigs[id].solve(poses[id] || {});
      sol.world = worldOf(sol);
      sol.pose = poses[id];
      sols[id] = sol;
    }
    prev = sols;
  }
  if (c.frames.size > 400) c.frames.clear();
  c.frames.set(key, sols);
  return sols;
}

// ------------------------------------------------------------------ live checks (debounced)
let checkTimer = null;
export let lastSampled = null;
function scheduleChecks() {
  clearTimeout(checkTimer);
  if (!S.doc) return;
  S.checking = true;
  checkTimer = setTimeout(runChecks, 350);
}
export function runChecks() {
  clearTimeout(checkTimer);
  if (!S.doc) return;
  try {
    const sampled = sampleDocument(S.doc, S.skeletons);
    lastSampled = sampled;
    S.findings = evaluateChecks(S.doc, sampled, measureDocument(S.doc, sampled));
    S.light = overall(S.findings);
    S.checkError = null;
  } catch (e) {
    S.findings = []; S.light = 'error'; S.checkError = e.message;
    console.error('checks', e);
  }
  S.checking = false;
  changed('checks');
}

export function setTime(t) {
  const T = S.doc ? S.doc.duration : 0;
  S.t = Math.max(0, Math.min(T, t));
  changed('time');
}
export function select(sel) { Object.assign(S, sel); changed('selection'); }
