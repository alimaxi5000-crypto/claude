// jj-anim/1 clip documents: parsing, migration of older/alias fields, JSON-Schema validation and
// semantic checks (actors, bones, times, contacts). Every problem is returned as
// { code, path, msg } with a German message for the studio and a stable English code for tools.
// Shared by animkit (build/watch), the studio NUI (live checks) and the tests.

import { validateSchema } from './jsonschema.mjs';
import SCHEMA from './schema/jj-anim-1.schema.json' with { type: 'json' };

export { SCHEMA };
export const FORMAT = 'jj-anim/1';
export const FPS = 30;
export const MAX_BYTES = 2 * 1024 * 1024;     // per document (matches the studio server limit)
export const NAME_RE = /^[a-z0-9_]{1,40}$/;
export const HANDLES = { handL: 'SKEL_L_Hand', handR: 'SKEL_R_Hand', footL: 'SKEL_L_Foot', footR: 'SKEL_R_Foot', head: 'SKEL_Head', pelvis: 'SKEL_Pelvis' };
export const LIMB_HANDLES = ['handL', 'handR', 'footL', 'footR'];
export const EASES = ['smooth', 'fastIn', 'fastOut', 'linear', 'spring', 'step'];

const MSG = {
  json_invalid: (d) => `Die Datei ist kein gültiges JSON (${d}).`,
  too_large: (d) => `Das Projekt ist zu groß (${d}). Erlaubt sind höchstens 2 MB.`,
  version_unsupported: (d) => `Unbekannte Format-Version "${d}". Erwartet wird "${FORMAT}".`,
  schema: (d) => `Ungültiger Eintrag: ${d}.`,
  name_invalid: (d) => `Ungültiger Name "${d}". Erlaubt sind nur Kleinbuchstaben, Ziffern und _ (höchstens 40 Zeichen).`,
  actor_count: (d) => `Falsche Anzahl Akteure: ${d}.`,
  actor_unknown: (d) => `Spur für unbekannten Akteur "${d}".`,
  unknown_bone: (d) => `Unbekannter Knochen "${d}" (gibt es im Skelett nicht).`,
  time_range: (d) => `Zeitpunkt außerhalb der Animation: ${d}.`,
  duplicate_key: (d) => `Zwei Keyframes zur selben Zeit: ${d}.`,
  contact_invalid: (d) => `Ungültiger Kontakt: ${d}.`,
  range_invalid: (d) => `Ungültiger Bereich: ${d}.`,
};
export function problem(code, path, detail) {
  return { code, path, msg: (MSG[code] || ((d) => d))(detail) };
}

// Text -> { doc } | { errors }. Checks the byte size before parsing.
export function parseDocument(text) {
  const bytes = typeof text === 'string' ? utf8Length(text) : text.length;
  if (bytes > MAX_BYTES) return { errors: [problem('too_large', '', `${(bytes / 1048576).toFixed(2)} MB`)] };
  let raw;
  try { raw = JSON.parse(typeof text === 'string' ? text : new TextDecoder().decode(text)); } catch (e) {
    return { errors: [problem('json_invalid', '', e.message.slice(0, 120))] };
  }
  return migrate(raw);
}
function utf8Length(s) {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    n += c < 0x80 ? 1 : c < 0x800 ? 2 : c >= 0xd800 && c <= 0xdbff ? (i++, 4) : 3;
  }
  return n;
}

// Older spellings -> current jj-anim/1 fields. Returns { doc, migrated: [notes] } or { errors }.
// Accepted: the plan draft (tracks.*.lookAt, feet.lock as [[t0,t1]] for both feet, fingers with
// 'curl' arrays are not part of v1), missing fps/type/loop.
export function migrate(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { errors: [problem('schema', '', 'Dokument muss ein Objekt sein')] };
  const migrated = [];
  const doc = JSON.parse(JSON.stringify(raw));
  if (doc.format !== FORMAT) return { errors: [problem('version_unsupported', 'format', String(doc.format ?? '(fehlt)').slice(0, 40))] };
  if (doc.fps == null) doc.fps = FPS;
  if (doc.loop == null) doc.loop = false;
  if (doc.type == null && doc.actors && typeof doc.actors === 'object') { doc.type = Object.keys(doc.actors).length > 1 ? 'pair' : 'single'; migrated.push('type'); }
  for (const tr of Object.values(doc.tracks && typeof doc.tracks === 'object' ? doc.tracks : {})) {
    if (!tr || typeof tr !== 'object') continue;
    if (tr.lookAt && !tr.look) { tr.look = tr.lookAt; delete tr.lookAt; migrated.push('lookAt -> look'); }
    if (tr.feet && Array.isArray(tr.feet.lock)) { const r = tr.feet.lock; tr.feet.lock = { L: r.map((x) => x.slice()), R: r.map((x) => x.slice()) }; migrated.push('feet.lock -> {L,R}'); }
  }
  // Plan draft: actors.<id>.skeleton held a model name.
  for (const a of Object.values(doc.actors && typeof doc.actors === 'object' ? doc.actors : {})) {
    if (a && !a.model && typeof a.skeleton === 'string' && /_/.test(a.skeleton)) { a.model = a.skeleton; delete a.skeleton; migrated.push('actor.skeleton(model) -> model'); }
  }
  return { doc, migrated };
}

const isFiniteNum = (x) => typeof x === 'number' && Number.isFinite(x);

// Full validation. skeletonsFor(actorId) -> Skeleton (optional) enables the bone checks.
export function validateDocument(doc, { skeletonsFor = null } = {}) {
  const errors = [];
  for (const e of validateSchema(SCHEMA, doc)) {
    if (e.path === 'name' || /\.name$/.test(e.path) && e.keyword === 'pattern') errors.push(problem('name_invalid', e.path, String(get(doc, e.path)).slice(0, 60)));
    else errors.push(problem('schema', e.path, `${e.path || 'Dokument'}: ${e.message}`));
  }
  if (errors.length) return errors;
  const actors = Object.keys(doc.actors);
  if (doc.type === 'single' && actors.length !== 1) errors.push(problem('actor_count', 'actors', `Einzel-Animation braucht genau 1 Akteur, hat ${actors.length}`));
  if (doc.type === 'pair' && actors.length !== 2) errors.push(problem('actor_count', 'actors', `Paar-Animation braucht genau 2 Akteure, hat ${actors.length}`));
  const T = doc.duration + 1e-6;
  const checkTime = (t, path) => { if (!isFiniteNum(t) || t < 0 || t > T) errors.push(problem('time_range', path, `${path} = ${t} s (Dauer ${doc.duration} s)`)); };
  const checkKeys = (keys, path) => {
    const seen = new Set();
    (keys || []).forEach((k, i) => {
      checkTime(k.t, `${path}[${i}].t`);
      const q = Math.round(k.t * 1000);
      if (seen.has(q)) errors.push(problem('duplicate_key', `${path}[${i}]`, `${path} bei ${k.t.toFixed(3)} s`));
      seen.add(q);
    });
  };
  for (const [id, tr] of Object.entries(doc.tracks)) {
    if (!doc.actors[id]) { errors.push(problem('actor_unknown', `tracks.${id}`, id)); continue; }
    const skel = skeletonsFor ? skeletonsFor(id) : null;
    checkKeys(tr.mover, `tracks.${id}.mover`);
    checkKeys(tr.root, `tracks.${id}.root`);
    checkKeys(tr.look, `tracks.${id}.look`);
    for (const [b, keys] of Object.entries(tr.bones || {})) {
      if (b === 'SKEL_ROOT') errors.push(problem('schema', `tracks.${id}.bones.SKEL_ROOT`, 'SKEL_ROOT wird über die Spur "root" gedreht'));
      else if (skel && !skel.has(b)) errors.push(problem('unknown_bone', `tracks.${id}.bones.${b}`, b));
      checkKeys(keys, `tracks.${id}.bones.${b}`);
    }
    for (const [h, keys] of Object.entries(tr.ik || {})) checkKeys(keys, `tracks.${id}.ik.${h}`);
    for (const [s, keys] of Object.entries(tr.fingers || {})) checkKeys(keys, `tracks.${id}.fingers.${s}`);
    for (const [s, ranges] of Object.entries(tr.feet?.lock || {})) {
      const sorted = ranges.slice().sort((a, b) => a[0] - b[0]);
      sorted.forEach((r, i) => {
        checkTime(r[0], `tracks.${id}.feet.lock.${s}[${i}]`); checkTime(r[1], `tracks.${id}.feet.lock.${s}[${i}]`);
        if (!(r[1] > r[0])) errors.push(problem('range_invalid', `tracks.${id}.feet.lock.${s}[${i}]`, `Fuß ${s}: Ende muss nach dem Anfang liegen`));
        if (i > 0 && r[0] < sorted[i - 1][1]) errors.push(problem('range_invalid', `tracks.${id}.feet.lock.${s}`, `Fuß ${s}: Bereiche überlappen`));
      });
    }
  }
  (doc.contacts || []).forEach((c, i) => {
    const path = `contacts[${i}]`;
    const [fa, fh] = c.from.split('.'), [ta, th] = c.to.split('.');
    if (!doc.actors[fa]) errors.push(problem('contact_invalid', path, `unbekannter Akteur "${fa}"`));
    if (!doc.actors[ta]) errors.push(problem('contact_invalid', path, `unbekannter Akteur "${ta}"`));
    if (c.from === c.to) errors.push(problem('contact_invalid', path, 'Start und Ziel sind gleich'));
    if (c.stick && !LIMB_HANDLES.includes(fh)) errors.push(problem('contact_invalid', path, 'festkleben geht nur mit einer Hand oder einem Fuß als Start'));
    for (const [a, h] of [[fa, fh], [ta, th]]) {
      const skel = skeletonsFor && doc.actors[a] ? skeletonsFor(a) : null;
      const bone = HANDLES[h] || h;
      if (skel && !skel.has(bone)) errors.push(problem('unknown_bone', path, bone));
    }
    checkTime(c.t[0], `${path}.t`); checkTime(c.t[1], `${path}.t`);
    if (!(c.t[1] > c.t[0])) errors.push(problem('range_invalid', `${path}.t`, 'Kontakt: Ende muss nach dem Anfang liegen'));
  });
  (doc.events || []).forEach((e, i) => checkTime(e.t, `events[${i}].t`));
  return errors;
}

function get(o, path) {
  return path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean).reduce((x, k) => (x == null ? x : x[k]), o);
}

// Endpoint 'actor.handle|bone' -> { actor, bone }.
export function endpoint(s) {
  const i = s.indexOf('.');
  const actor = s.slice(0, i), h = s.slice(i + 1);
  return { actor, handle: h, bone: HANDLES[h] || h };
}

// A new empty document (what the studio creates).
export function newDocument({ name, type = 'single', duration = 2, models = {} } = {}) {
  const actors = type === 'pair'
    ? { a: { model: models.a || 'mp_m_freemode_01', label: 'Akteur A' }, b: { model: models.b || 'mp_m_freemode_01', label: 'Akteur B' } }
    : { a: { model: models.a || 'mp_m_freemode_01', label: 'Akteur A' } };
  const tracks = { a: { mover: [{ t: 0, p: [0, 0, 0], yaw: 0 }] } };
  if (type === 'pair') tracks.b = { mover: [{ t: 0, p: [0, 0.9, 0], yaw: 180 }] };
  return { format: FORMAT, name, type, fps: FPS, duration, loop: false, actors, tracks, contacts: [], events: [], notes: '' };
}
