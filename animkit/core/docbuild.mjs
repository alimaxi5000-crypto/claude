// Build one jj-anim/1 document into a .ycd (node only):
//   validate -> resolve + solve (resolve.mjs) -> metrics + traffic light (checks.mjs)
//   -> origin rebase for pairs -> tracks -> ycd.xml -> ycdtool -> independent read-back
//   (tracks and world pose at the origin, 2 mm) -> registry entry + report data.
// Returns a result object; it never throws for document problems (they end up in `errors`).

import fs from 'node:fs';
import path from 'node:path';
import { validateDocument, NAME_RE } from './doc.mjs';
import { sampleDocument } from './resolve.mjs';
import { measureDocument, evaluateChecks, overall } from './checks.mjs';
import { rebaseToOrigin, clipTracks, writeDictionaries, convertDirectory, readBackDictionary, ycdtoolStatus, READBACK } from './pipeline.mjs';
import { FPS } from './scene.mjs';
import { skeletonKeyFor } from './models.mjs';

export function clipNameOf(doc, actor) {
  return doc.type === 'pair' ? `${doc.name}_${actor}` : doc.name;
}

// Registry entry in the same shape as the zombie ClipData scenes (shared/clips_data.lua).
export function registryEntry(doc, dict, clips, origins) {
  return {
    name: doc.name, variant: '', dict, duration: +doc.duration.toFixed(4), loop: !!doc.loop, actors: clips,
    events: (doc.events || []).slice().sort((a, b) => a.t - b.t).map((e) => ({ name: e.name, t: e.t, phase: +(e.t / doc.duration).toFixed(4), duration: e.duration })),
    origins: Object.keys(origins).length ? origins : undefined,
    playback: { blendIn: 8.0, blendOut: -8.0, flags: doc.loop ? 1 : 0 },
    meta: { source: 'jj_animstudio', type: doc.type },
  };
}

// opts: { skeletons, skelInfo, dict, workDir, streamDir, convert = true }
export function buildDocument(doc, opts) {
  const t0 = Date.now();
  const result = { ok: false, name: doc?.name, dict: opts.dict, errors: [], warnings: [], clips: {}, origins: {}, timings: {} };
  const { skeletons, skelInfo = {} } = opts;
  if (!NAME_RE.test(String(opts.dict || ''))) { result.errors.push({ code: 'name_invalid', msg: `Ungültiger Dict-Name "${opts.dict}".` }); return result; }
  const pre = validateDocument(doc, { skeletonsFor: (id) => skeletons[skelKey(doc, id)] });
  if (pre.length) { result.errors.push(...pre); return result; }
  let sampled;
  try { sampled = sampleDocument(doc, skeletons); } catch (e) {
    result.errors.push({ code: 'solve_failed', msg: `Die Pose konnte nicht berechnet werden: ${e.message}` });
    return result;
  }
  result.timings.solveMs = Date.now() - t0;
  result.frames = sampled.nFrames;
  result.duration = +sampled.duration.toFixed(4);
  result.skeletons = Object.fromEntries(sampled.actors.map((id) => [id, {
    key: sampled.skelKeys[id], model: doc.actors[id].model, source: skelInfo[sampled.skelKeys[id]] || 'unknown',
    exact: sampled.skelExact[id],
  }]));
  for (const [id, s] of Object.entries(result.skeletons)) {
    if (!s.exact) result.warnings.push({ code: 'skeleton_approx', msg: `${id}: Für das Modell ${s.model} gibt es kein eigenes Skelett, es wird das männliche verwendet.` });
    if (s.source !== 'real') result.warnings.push({ code: 'skeleton_reference', msg: `${id}: gebaut auf dem Referenz-Skelett (${s.source}), nicht auf deinem echten Skelett.` });
  }
  const measured = measureDocument(doc, sampled);
  result.metrics = measured;
  result.findings = evaluateChecks(doc, sampled, measured);
  result.light = overall(result.findings);
  // Tracks per actor (pairs start at identity, motion in SKEL_ROOT, start transform as origin).
  const exportClips = [];
  for (const id of sampled.actors) {
    const skel = sampled.skeletons[id];
    const frames = sampled.frames[id];
    let out = frames, origin = null;
    if (doc.type === 'pair') {
      const rb = rebaseToOrigin(skel, frames);
      for (const p of rb.problems) result.errors.push({ code: 'rebase', msg: `${id}: ${p}` });
      out = rb.frames; origin = rb.origin; result.origins[id] = origin;
    }
    const name = clipNameOf(doc, id);
    result.clips[id] = name;
    exportClips.push({ dict: opts.dict, name, actor: id, duration: sampled.duration, frames: frames.length, tracks: clipTracks(skel, out), skel, solved: frames, origin });
  }
  result.registry = registryEntry(doc, opts.dict, result.clips, result.origins);
  if (opts.convert === false) { result.ok = !result.errors.length; result.timings.totalMs = Date.now() - t0; return result; }
  const st = ycdtoolStatus();
  if (!st.ok) { result.errors.push({ code: 'ycdtool_missing', msg: 'Der YCD-Konverter (ycdtool) ist nicht gebaut. Bitte animkit/setup.sh ausführen und "animkit doctor" prüfen.' }); return result; }
  const xmlDir = path.join(opts.workDir, 'xml');
  fs.rmSync(xmlDir, { recursive: true, force: true });
  const w = writeDictionaries(xmlDir, exportClips);
  for (const p of w.problems) result.errors.push({ code: 'xml', msg: p });
  if (result.errors.length) return result;
  const ycdDir = path.join(opts.workDir, 'ycd');
  fs.rmSync(ycdDir, { recursive: true, force: true });
  const t1 = Date.now();
  const conv = convertDirectory(xmlDir, ycdDir);
  result.timings.convertMs = Date.now() - t1;
  if (!conv.ok) { result.errors.push({ code: 'convert_failed', msg: `Umwandlung in .ycd fehlgeschlagen: ${conv.error}` }); return result; }
  const file = path.join(ycdDir, `${opts.dict}.ycd`);
  const rb = readBackDictionary(file, exportClips, opts.dict);
  for (const p of rb.problems) result.errors.push({ code: 'readback', msg: `Rücklese-Prüfung: ${p}` });
  result.readback = {
    ...rb.info,
    tolerances: READBACK,
    clips: Object.fromEntries(exportClips.map((c) => [c.name, c.readback ? { maxRotDeg: +c.readback.maxRotDeg.toFixed(5), maxPosMm: +(c.readback.maxPosM * 1000).toFixed(4), maxWorldMm: c.readback.maxWorldM != null ? +(c.readback.maxWorldM * 1000).toFixed(4) : null } : null])),
  };
  if (result.errors.length) return result;
  if (opts.streamDir) {
    fs.mkdirSync(opts.streamDir, { recursive: true });
    const dst = path.join(opts.streamDir, `${opts.dict}.ycd`);
    fs.copyFileSync(file, dst + '.tmp');
    fs.renameSync(dst + '.tmp', dst);
    result.ycdFile = dst;
  } else result.ycdFile = file;
  result.ycdBytes = fs.statSync(file).size;
  result.ok = true;
  result.timings.totalMs = Date.now() - t0;
  result.fps = FPS;
  return result;
}

function skelKey(doc, id) {
  const a = doc.actors?.[id];
  return a?.skeleton || skeletonKeyFor(a?.model).key;
}
