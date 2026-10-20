// Pure editing operations on a jj-anim/1 document (the caller clones before mutating).
// Track reference: { actor, kind: 'mover'|'root'|'bone'|'ik'|'fingers'|'look', id }.
import { keyAt } from '../../../animkit/core/resolve.mjs';
import { mirrorName, mirrorRot, sideOf } from '../../../animkit/core/joints.mjs';

export const FPS = 30;
export const snapT = (t) => +(Math.round(t * FPS) / FPS).toFixed(4);
const r4 = (v) => (Array.isArray(v) ? v.map((x) => +(+x).toFixed(4)) : +(+v).toFixed(4));
const r2 = (v) => (Array.isArray(v) ? v.map((x) => +(+x).toFixed(2)) : +(+v).toFixed(2));

export const GROUP_ORDER = ['pos', 'torso', 'head', 'armL', 'armR', 'handL', 'handR', 'legL', 'legR'];
export const GROUP_LABEL = { pos: 'group_pos', torso: 'group_torso', head: 'group_head', armL: 'group_armL', armR: 'group_armR', handL: 'group_handL', handR: 'group_handR', legL: 'group_legL', legR: 'group_legR' };

export function groupOfBone(name) {
  if (/Neck|Head/.test(name)) return 'head';
  if (/Pelvis|Spine|ROOT/.test(name)) return 'torso';
  const s = sideOf(name);
  if (!s) return 'torso';
  if (/Clavicle|UpperArm|Forearm/.test(name)) return 'arm' + s;
  if (/Hand|Finger/.test(name)) return 'hand' + s;
  return 'leg' + s;
}
export function groupOf(ref) {
  switch (ref.kind) {
    case 'mover': case 'root': return 'pos';
    case 'look': return 'head';
    case 'bone': return groupOfBone(ref.id);
    case 'ik': return (ref.id.startsWith('hand') ? 'arm' : 'leg') + ref.id.slice(-1);
    case 'fingers': return 'hand' + ref.id;
    default: return 'pos';
  }
}

export function keysOf(doc, ref) {
  const tr = doc.tracks[ref.actor];
  if (!tr) return null;
  switch (ref.kind) {
    case 'mover': return tr.mover || null;
    case 'root': return tr.root || null;
    case 'look': return tr.look || null;
    case 'bone': return tr.bones?.[ref.id] || null;
    case 'ik': return tr.ik?.[ref.id] || null;
    case 'fingers': return tr.fingers?.[ref.id] || null;
    default: return null;
  }
}
function ensureKeys(doc, ref) {
  const tr = (doc.tracks[ref.actor] ||= {});
  switch (ref.kind) {
    case 'mover': return (tr.mover ||= []);
    case 'root': return (tr.root ||= []);
    case 'look': return (tr.look ||= []);
    case 'bone': return ((tr.bones ||= {})[ref.id] ||= []);
    case 'ik': return ((tr.ik ||= {})[ref.id] ||= []);
    case 'fingers': return ((tr.fingers ||= {})[ref.id] ||= []);
    default: throw new Error('bad ref');
  }
}
function setKeys(doc, ref, keys) {
  const tr = doc.tracks[ref.actor];
  if (!tr) return;
  const clean = (obj, k) => { if (!keys.length) { delete obj[k]; return true; } obj[k] = keys; return false; };
  switch (ref.kind) {
    case 'mover': case 'root': case 'look': clean(tr, ref.kind); break;
    case 'bone': if (tr.bones) { clean(tr.bones, ref.id); if (!Object.keys(tr.bones).length) delete tr.bones; } break;
    case 'ik': if (tr.ik) { clean(tr.ik, ref.id); if (!Object.keys(tr.ik).length) delete tr.ik; } break;
    case 'fingers': if (tr.fingers) { clean(tr.fingers, ref.id); if (!Object.keys(tr.fingers).length) delete tr.fingers; } break;
  }
}

export function allRefs(doc, actor) {
  const tr = doc.tracks[actor] || {};
  const out = [];
  if (tr.mover?.length) out.push({ actor, kind: 'mover' });
  if (tr.root?.length) out.push({ actor, kind: 'root' });
  if (tr.look?.length) out.push({ actor, kind: 'look' });
  for (const [id, k] of Object.entries(tr.bones || {})) if (k.length) out.push({ actor, kind: 'bone', id });
  for (const [id, k] of Object.entries(tr.ik || {})) if (k.length) out.push({ actor, kind: 'ik', id });
  for (const [id, k] of Object.entries(tr.fingers || {})) if (k.length) out.push({ actor, kind: 'fingers', id });
  return out;
}
export const refsInGroup = (doc, actor, group) => allRefs(doc, actor).filter((r) => groupOf(r) === group);

export function keyTimes(doc, actor, group) {
  const set = new Set();
  for (const r of group ? refsInGroup(doc, actor, group) : allRefs(doc, actor)) for (const k of keysOf(doc, r)) set.add(snapT(k.t));
  return [...set].sort((a, b) => a - b);
}

const closes = (doc, ref) => !!doc.loop && !(ref.kind === 'mover' && (doc.loopMover || 'closed') === 'travel');
export function valueAt(doc, ref, t) {
  const keys = keysOf(doc, ref);
  return keys && keys.length ? keyAt(keys, t, doc.duration, closes(doc, ref)) : null;
}

// Upsert a key at the frame nearest to t; fields are merged into an existing key there.
export function setKey(doc, ref, t, fields) {
  const keys = ensureKeys(doc, ref);
  const tt = Math.min(doc.duration, Math.max(0, snapT(t)));
  const clean = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue;
    if (k === 'rot' || k === 'yaw' || k === 'pitch' || k === 'roll') clean[k] = r2(v);
    else if (k === 'p' || k === 'target' || k === 'pole') clean[k] = r4(v);
    else if (k === 'weight' || k === 'curl' || k === 'spread') clean[k] = +(+v).toFixed(3);
    else clean[k] = v;
  }
  const i = keys.findIndex((k) => Math.abs(k.t - tt) < 0.5 / FPS);
  if (i >= 0) keys[i] = { ...keys[i], ...clean, t: tt };
  else { keys.push({ t: tt, ...clean }); keys.sort((a, b) => a.t - b.t); }
  return keys;
}

export function deleteKeysAt(doc, actor, group, t) {
  for (const r of refsInGroup(doc, actor, group)) setKeys(doc, r, keysOf(doc, r).filter((k) => Math.abs(k.t - t) > 0.5 / FPS));
}
export function moveKeys(doc, actor, group, from, to) {
  const tt = Math.min(doc.duration, Math.max(0, snapT(to)));
  for (const r of refsInGroup(doc, actor, group)) {
    const keys = keysOf(doc, r);
    const moving = keys.filter((k) => Math.abs(k.t - from) < 0.5 / FPS);
    if (!moving.length) continue;
    const rest = keys.filter((k) => Math.abs(k.t - from) >= 0.5 / FPS && Math.abs(k.t - tt) >= 0.5 / FPS);
    setKeys(doc, r, [...rest, ...moving.map((k) => ({ ...k, t: tt }))].sort((a, b) => a.t - b.t));
  }
}
export function setEaseAt(doc, actor, group, t, ease) {
  for (const r of refsInGroup(doc, actor, group)) for (const k of keysOf(doc, r)) if (Math.abs(k.t - t) < 0.5 / FPS) k.ease = ease;
}
// Copy keys of a group at time t -> clipboard [{ref, key}]; paste at another time.
export function copyKeysAt(doc, actor, group, t) {
  const out = [];
  for (const r of refsInGroup(doc, actor, group)) for (const k of keysOf(doc, r)) if (Math.abs(k.t - t) < 0.5 / FPS) out.push({ ref: r, key: JSON.parse(JSON.stringify(k)) });
  return out;
}
export function pasteKeys(doc, clip, t, actor = null) {
  for (const { ref, key } of clip) setKey(doc, actor ? { ...ref, actor } : ref, t, { ...key, t: undefined });
}

// Remove a whole track (e.g. "IK entfernen").
export function removeTrack(doc, ref) { setKeys(doc, ref, []); }

// ------------------------------------------------------------------ poses
// Snapshot of an actor's keyed controls at time t.
export function capturePose(doc, actor, t) {
  const pose = { bones: {}, ik: {}, fingers: {} };
  for (const r of allRefs(doc, actor)) {
    const v = valueAt(doc, r, t);
    if (!v) continue;
    if (r.kind === 'root') pose.root = { p: r4(v.p || [0, 0, 0]), rot: r2(v.rot || [0, 0, 0]) };
    else if (r.kind === 'bone') pose.bones[r.id] = r2(v.rot);
    else if (r.kind === 'ik') pose.ik[r.id] = { target: r4(v.target), pole: v.pole ? r4(v.pole) : undefined, weight: v.weight ?? 1, space: v.space || 'body', yaw: v.yaw, pitch: v.pitch, roll: v.roll };
    else if (r.kind === 'fingers') pose.fingers[r.id] = { preset: v.preset || 'relaxed', curl: v.curl ?? 1, spread: v.spread };
    else if (r.kind === 'look') pose.look = { target: r4(v.target), weight: v.weight ?? 1, space: v.space || 'body' };
  }
  return pose;
}

// Apply a pose at time t. Keyed bones missing in the pose go to 0, IK limbs missing in the pose
// fade to FK (weight 0), so a pose fully defines the actor's look at t.
export function applyPose(doc, actor, t, pose) {
  const has = (x) => x && Object.keys(x).length;
  setKey(doc, { actor, kind: 'root' }, t, { p: pose.root?.p || [0, 0, 0], rot: pose.root?.rot || [0, 0, 0] });
  const names = new Set([...Object.keys(doc.tracks[actor]?.bones || {}), ...Object.keys(pose.bones || {})]);
  for (const b of names) setKey(doc, { actor, kind: 'bone', id: b }, t, { rot: pose.bones?.[b] || [0, 0, 0] });
  const iks = new Set([...Object.keys(doc.tracks[actor]?.ik || {}), ...Object.keys(pose.ik || {})]);
  for (const h of iks) {
    const k = pose.ik?.[h];
    const ref = { actor, kind: 'ik', id: h };
    if (k) setKey(doc, ref, t, { ...k, weight: k.weight ?? 1 });
    else {
      const cur = valueAt(doc, ref, t);
      if (cur) setKey(doc, ref, t, { target: cur.target, space: cur.space, weight: 0 });
    }
  }
  if (has(pose.fingers)) for (const [s, f] of Object.entries(pose.fingers)) setKey(doc, { actor, kind: 'fingers', id: s }, t, f);
  if (pose.look) setKey(doc, { actor, kind: 'look' }, t, pose.look);
}

const mx = (v) => (v ? [-v[0], v[1], v[2]] : v);
// Mirror a pose left <-> right (bones swap sides, positions flip x, turns negate).
export function mirrorPose(pose) {
  const out = { bones: {}, ik: {}, fingers: {} };
  if (pose.root) out.root = { p: mx(pose.root.p), rot: mirrorRot('SKEL_ROOT', pose.root.rot) };
  for (const [b, rot] of Object.entries(pose.bones || {})) out.bones[mirrorName(b)] = mirrorRot(b, rot);
  for (const [h, k] of Object.entries(pose.ik || {})) {
    const o = h.endsWith('L') ? h.slice(0, -1) + 'R' : h.slice(0, -1) + 'L';
    out.ik[o] = { ...k, target: mx(k.target), pole: mx(k.pole), yaw: k.yaw != null ? -k.yaw : k.yaw, roll: k.roll != null ? -k.roll : k.roll };
  }
  for (const [s, f] of Object.entries(pose.fingers || {})) out.fingers[s === 'L' ? 'R' : 'L'] = { ...f };
  if (pose.look) out.look = { ...pose.look, target: mx(pose.look.target) };
  return out;
}
// Transfer one bone's rotation to the other side at time t.
export function mirrorBone(doc, actor, bone, t) {
  const v = valueAt(doc, { actor, kind: 'bone', id: bone }, t);
  const target = mirrorName(bone);
  if (!v || target === bone) return false;
  setKey(doc, { actor, kind: 'bone', id: target }, t, { rot: mirrorRot(bone, v.rot) });
  return true;
}

// ------------------------------------------------------------------ events, locks, contacts
export function addEvent(doc, name, t, duration) {
  doc.events ||= [];
  doc.events.push({ name, t: snapT(t), ...(duration ? { duration: +(+duration).toFixed(3) } : {}) });
  doc.events.sort((a, b) => a.t - b.t);
}
export function removeEvent(doc, i) { doc.events.splice(i, 1); }

export function addFootLock(doc, actor, side, range) {
  const tr = (doc.tracks[actor] ||= {});
  tr.feet ||= {}; tr.feet.lock ||= {};
  for (const s of side === 'both' ? ['L', 'R'] : [side]) {
    const list = [...(tr.feet.lock[s] || []), [snapT(range[0]), snapT(range[1])]].sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const r of list) {
      if (merged.length && r[0] <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]);
      else merged.push(r.slice());
    }
    tr.feet.lock[s] = merged;
  }
}
export function removeFootLock(doc, actor, side, i) {
  const l = doc.tracks[actor]?.feet?.lock?.[side];
  if (l) l.splice(i, 1);
}

export function addStick(doc, from, to, offset, range) {
  doc.contacts ||= [];
  const id = `c${doc.contacts.length + 1}_${Math.floor(Date.now() % 100000)}`.slice(0, 24);
  doc.contacts.push({ id, from, to, offset: r4(offset), t: [snapT(range[0]), snapT(range[1])], stick: true, max: 0.03 });
}
export function removeContact(doc, i) { doc.contacts.splice(i, 1); }

// Serialized with "format" and "name" first: the server's rename relies on that prefix.
export function serialize(doc) {
  const { format, name, ...rest } = doc;
  return JSON.stringify({ format, name, ...rest });
}
