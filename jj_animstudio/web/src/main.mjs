// jj_animstudio NUI entry: boot, rendering loop, mouse editing (rings, handles), panels,
// projects, test in game, finish, tutorial, shortcuts. Bundled by tools/build-web.mjs.
import { Skeleton } from '../../../animkit/core/skeleton.mjs';
import { buildPlaceholder } from '../../../animkit/core/placeholder.mjs';
import { newDocument, migrate, validateDocument, HANDLES, endpoint } from '../../../animkit/core/doc.mjs';
import { jointBasis, clampRot, editableBones, sideOf, AXIS_LABELS } from '../../../animkit/core/joints.mjs';
import { applyFix } from '../../../animkit/core/fixes.mjs';
import { FINGER_PRESETS } from '../../../animkit/core/resolve.mjs';
import { qconj, qmul, qnorm, qrot, vsub, vadd, yawOf, DEG } from '../../../animkit/core/math.mjs';
import { BODY } from '../../../animkit/core/skeleton.mjs';
import { S, on, loadDoc, mutate, setDoc, beginDrag, endDrag, undo, redo, solveAt, skeletonOf, setTime, select, runChecks, lastSampled } from './store.mjs';
import { createView } from './view3d.mjs';
import { createTimeline } from './timeline.mjs';
import { setKey, valueAt, keysOf, groupOf, groupOfBone, deleteKeysAt, setEaseAt, copyKeysAt, pasteKeys, capturePose, applyPose, mirrorPose, mirrorBone, removeTrack, addEvent, removeEvent, addFootLock, removeFootLock, addStick, removeContact, serialize, keyTimes, snapT, FPS } from './edit.mjs';
import { BUILTIN_POSES } from './poses.mjs';
import { post, onMessage, inGame, emit } from './nui.mjs';
import { t, setLocale } from './i18n.mjs';

const $ = (s) => document.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (k === 'html') e.innerHTML = v; else e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c);
  return e;
};
const fmt = (x, n = 2) => (+x).toFixed(n).replace('.', ',');
const ACTORS = () => Object.keys(S.doc?.actors || {});
const groundAnkle = (actor) => skeletonOf(actor).groundZ + 0.085;

// ------------------------------------------------------------------ toasts, tooltips, dialogs
function toast(msg, level = 'info', ms = 3800) {
  if (!msg) return;
  const el = h('div', { class: `toast ${level}` }, msg);
  $('#toasts').append(el);
  setTimeout(() => el.remove(), ms);
}
function initTooltips() {
  const tip = $('#tooltip');
  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest?.('[data-tip]');
    if (!el) { tip.classList.add('hidden'); return; }
    tip.textContent = t(el.dataset.tip);
    tip.classList.remove('hidden');
    const r = el.getBoundingClientRect();
    tip.style.left = `${Math.min(window.innerWidth - tip.offsetWidth - 8, Math.max(8, r.left))}px`;
    tip.style.top = `${r.bottom + 6 + tip.offsetHeight > window.innerHeight ? r.top - tip.offsetHeight - 6 : r.bottom + 6}px`;
  });
}
function translateStatic() {
  for (const el of document.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t);
}
let modalClose = null, projectsOpen = false;
function dialog(title, body, buttons = [], { onClose } = {}) {
  const d = $('#dialog');
  d.innerHTML = '';
  d.append(h('h2', {}, title), body, h('div', { class: 'row end' }, buttons));
  $('#modal').classList.remove('hidden');
  modalClose = onClose || null;
  const first = d.querySelector('input,select,textarea');
  if (first) setTimeout(() => first.focus(), 30);
}
// dismiss = closed without an answer (Escape, close button): runs the dialog's onClose.
function closeDialog(dismiss = true) { $('#modal').classList.add('hidden'); projectsOpen = false; const f = modalClose; modalClose = null; if (dismiss) f?.(); }
const isModal = () => !$('#modal').classList.contains('hidden');
function confirmBox(text) {
  return new Promise((res) => dialog(t('app_title'), h('p', {}, text), [
    h('button', { class: 'btn', onclick: () => { closeDialog(false); res(false); } }, t('no')),
    h('button', { class: 'btn accent', onclick: () => { closeDialog(false); res(true); } }, t('yes')),
  ], { onClose: () => res(false) }));
}
function promptBox(text, value = '', hint = '') {
  return new Promise((res) => {
    const input = h('input', { type: 'text', value, style: 'width:100%' });
    const ok = () => { const v = input.value.trim(); closeDialog(false); res(v || null); };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') ok(); });
    dialog(text, h('div', {}, input, hint ? h('div', { class: 'hint' }, hint) : null), [
      h('button', { class: 'btn', onclick: () => { closeDialog(false); res(null); } }, t('cancel')),
      h('button', { class: 'btn accent', onclick: ok }, t('ok')),
    ], { onClose: () => res(null) });
  });
}

// ------------------------------------------------------------------ boot
let view, timeline;
function skeletonsFrom(payload) {
  const out = {};
  let missing = 0;
  for (const key of ['male', 'female', 'zombie']) {
    let json = null;
    const raw = payload?.skeletons?.[key];
    if (raw) { try { json = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { json = null; } }
    if (!json && window.JJS_MOCK?.skeletons?.[key]) json = window.JJS_MOCK.skeletons[key];
    if (!json) { json = buildPlaceholder(key); missing++; }
    out[key] = new Skeleton(json);
  }
  S.skeletonSource = missing ? 'placeholder' : 'server';
  return out;
}

function open(data) {
  setLocale(data.locale);
  translateStatic();
  S.config = data.config || {};
  S.undoMax = Math.max(100, S.config.undo || 150);
  S.frame = data.frame;
  S.partners = S.config.partners || [];
  S.skeletons = skeletonsFrom(data.server);
  S.projects = data.server?.projects || [];
  S.poses = data.server?.poses || {};
  S.watch = data.server?.watch || { alive: false };
  $('#app').classList.remove('hidden');
  if (!view) {
    view = createView($('#view'), { inGame, onCamera: sendCamera });
    const cc = S.config.camera || {};
    view.limits.min = cc.MinDistance || 0.4; view.limits.max = cc.MaxDistance || 12;
    view.cam.fov = cc.Fov || 45;
    timeline = createTimeline($('#timeline'), { onEdit: () => {} });
    bindView();
    bindUi();
  }
  view.resize();
  view.setPreset('front');
  const warn = [];
  if (S.skeletonSource === 'placeholder') warn.push(t('warn_no_skeleton'));
  if (!S.watch.alive) warn.push(t('watch_down'));
  $('#warn').textContent = warn.join(' ');
  $('#warn').classList.toggle('hidden', !warn.length);
  setTimeout(() => $('#warn').classList.add('hidden'), 12000);
  showProjects();
  maybeTutorial();
}
onMessage('open', (m) => { open(m.data || {}); startLoop(); });
// Closed studio: no rendering, no timers (the NUI page stays loaded in the game).
onMessage('close', () => { $('#app').classList.add('hidden'); S.doc = null; S.test = null; running = false; });

// ------------------------------------------------------------------ camera + entity sync
let camTimer = 0, camPending = null;
function sendCamera(c) {
  camPending = c;
  const gap = 1000 / Math.min(30, (S.config.camera?.UpdatesPerSecond) || 30);
  const now = performance.now();
  if (now - camTimer >= gap) { camTimer = now; post('camera', camPending); camPending = null; }
}
let placeTimer = 0, lastPlace = '';
function sendPlacement(sols) {
  if (S.test) return;
  const now = performance.now();
  if (now - placeTimer < 100) return;
  const actors = {};
  for (const id of ACTORS()) { const m = sols[id].mover; actors[id] = { p: m.p.map((x) => +x.toFixed(4)), yaw: +(yawOf(m.q) / DEG).toFixed(2) }; }
  const key = JSON.stringify(actors);
  if (key === lastPlace) return;
  placeTimer = now; lastPlace = key;
  post('place', { actors });
}

// ------------------------------------------------------------------ render loop
let lastFrame = performance.now(), needTimeline = true, running = false;
on('*', () => { needTimeline = true; });
function startLoop() { if (running) return; running = true; lastFrame = performance.now(); requestAnimationFrame(frame); }
function frame(now) {
  if (!running) return;
  requestAnimationFrame(frame);
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  if (camPending && now - camTimer > 34) { camTimer = now; post('camera', camPending); camPending = null; }
  if (!S.doc || !view) { view?.render(); return; }
  if (S.playing) {
    let tt = S.t + dt * S.speed;
    if (tt >= S.doc.duration) { if (S.doc.loop) tt %= S.doc.duration; else { tt = S.doc.duration; S.playing = false; updateTransport(); } }
    S.t = tt; needTimeline = true; updateTimeOut();
  }
  if (S.test?.follow && S.test.phase != null) S.t = S.test.phase * S.doc.duration;
  let sols;
  try { sols = solveAt(S.t); } catch (e) { console.error(e); view.render(); return; }
  for (const id of ACTORS()) { view.updateActor(id, sols[id], S.actor === id ? S.selBone : null); view.setVisible(id, S.overlay); }
  updateOnion();
  updateGizmo(sols);
  updateHandles(sols);
  updateLabels(sols);
  sendPlacement(sols);
  view.render();
  if (needTimeline) { timeline.draw(); needTimeline = false; }
}

function updateOnion() {
  for (const id of ACTORS()) {
    if (!S.onion || S.playing) { view.updateOnion(id, 0, null); view.updateOnion(id, 1, null); continue; }
    const times = keyTimes(S.doc, id, null);
    const prev = times.filter((x) => x < S.t - 1e-3).pop();
    const next = times.find((x) => x > S.t + 1e-3);
    view.updateOnion(id, 0, prev != null ? solveAt(prev)[id] : null);
    view.updateOnion(id, 1, next != null ? solveAt(next)[id] : null);
  }
}

// ------------------------------------------------------------------ selection helpers
function ikHandleOfBone(bone) {
  const m = /^SKEL_([LR])_(UpperArm|Forearm|Thigh|Calf)$/.exec(bone);
  if (!m) return null;
  return (m[2] === 'UpperArm' || m[2] === 'Forearm' ? 'hand' : 'foot') + m[1];
}
function ikWeightAt(actor, handle, tt = S.t) {
  const v = valueAt(S.doc, { actor, kind: 'ik', id: handle }, tt);
  return v ? (v.weight ?? 1) : 0;
}
function boneRotAt(actor, bone) {
  if (bone === 'SKEL_ROOT') return valueAt(S.doc, { actor, kind: 'root' }, S.t)?.rot || [0, 0, 0];
  return valueAt(S.doc, { actor, kind: 'bone', id: bone }, S.t)?.rot || [0, 0, 0];
}
function setBoneRot(doc, actor, bone, rot) {
  if (bone === 'SKEL_ROOT') {
    const cur = valueAt(doc, { actor, kind: 'root' }, S.t);
    setKey(doc, { actor, kind: 'root' }, S.t, { p: cur?.p || [0, 0, 0], rot });
  } else setKey(doc, { actor, kind: 'bone', id: bone }, S.t, { rot });
}
function selectBone(actor, bone) {
  select({ actor, selBone: bone, selHandle: null, selGroup: bone ? groupOfBone(bone) : null });
  renderTree(); renderInspector();
}

// ------------------------------------------------------------------ gizmo
let gizmoState = null;
function updateGizmo(sols) {
  const bone = S.selBone, actor = S.actor;
  if (!bone || !sols[actor] || S.test || S.playing) { view.hideGizmo(); gizmoState = null; return; }
  const skel = skeletonOf(actor);
  if (!skel.has(bone)) { view.hideGizmo(); return; }
  const ik = ikHandleOfBone(bone);
  if (ik && ikWeightAt(actor, ik) > 0) { view.hideGizmo(); gizmoState = null; return; }
  const sol = sols[actor];
  const p = sol.world.P[skel.idx(bone)];
  const { axes, basis } = view.boneAxes(skel, sol, bone);
  const rot = boneRotAt(actor, bone);
  const scale = Math.max(0.05, view.camDistanceTo(p) * 0.11);
  view.showGizmo(p, axes, rot, S.limitsOn ? basis.limits : null, scale);
  gizmoState = { actor, bone, p, axes, rot, basis };
}

// ------------------------------------------------------------------ handles
function handleList(sols) {
  const list = [];
  if (S.test) return list;
  for (const id of ACTORS()) {
    const skel = skeletonOf(id), sol = sols[id];
    const P = (b) => sol.world.P[skel.idx(b)];
    const sel = (name) => S.selHandle && S.selHandle.actor === id && S.selHandle.name === name;
    for (const hd of ['handL', 'handR', 'footL', 'footR']) {
      const active = ikWeightAt(id, hd) > 0;
      list.push({ actor: id, name: hd, kind: hd.startsWith('hand') ? 'hand' : 'foot', p: P(HANDLES[hd]), active, selected: sel(hd) });
      if (active) {
        const s = hd.slice(-1);
        const jb = hd.startsWith('hand') ? BODY.side[s].lower : BODY.side[s].calf;
        list.push({ actor: id, name: 'pole' + hd, kind: 'pole', p: P(jb), active: true, selected: sel('pole' + hd) });
      }
    }
    list.push({ actor: id, name: 'root', kind: 'root', p: P('SKEL_ROOT'), active: !!keysOf(S.doc, { actor: id, kind: 'root' })?.length, selected: sel('root') });
    const head = P('SKEL_Head');
    const look = sol.pose?.look;
    const fwd = qrot(qnorm(qmul(sol.mover.q, sol.D[skel.idx('SKEL_Head')])), [0, 0.8, 0]);
    list.push({ actor: id, name: 'look', kind: 'look', p: look ? look.target : vadd(head, fwd), active: !!look, selected: sel('look') });
    list.push({ actor: id, name: 'mover', kind: 'mover', p: [sol.mover.p[0], sol.mover.p[1], skel.groundZ + sol.mover.p[2] + 0.005], active: true, selected: sel('mover') });
  }
  return list;
}
function updateHandles(sols) { view.setHandles(S.overlay ? handleList(sols) : []); }

// Distance labels: measured points of the real peds during a test, otherwise the declared
// contacts of the document at the current time (overlay values).
let labelNodes = [], lastLineKey = '';
function updateLabels(sols) {
  const items = [], lines = [];
  if (S.test?.points?.length) {
    for (const p of S.test.points) items.push({ p: [(p.a[0] + p.b[0]) / 2, (p.a[1] + p.b[1]) / 2, (p.a[2] + p.b[2]) / 2], text: `${fmt(p.cm, 1)} cm`, red: p.red });
  } else if (!S.test) {
    for (const c of S.doc.contacts || []) {
      if (S.t < c.t[0] - 1e-3 || S.t > c.t[1] + 1e-3) continue;
      const a = endpoint(c.from), b = endpoint(c.to);
      const sa = sols[a.actor], sb = sols[b.actor];
      if (!sa || !sb) continue;
      const ka = skeletonOf(a.actor), kb = skeletonOf(b.actor);
      if (!ka.has(a.bone) || !kb.has(b.bone)) continue;
      const pa = sa.world.P[ka.idx(a.bone)];
      const ib = kb.idx(b.bone);
      const pb = vadd(sb.world.P[ib], qrot(qnorm(qmul(sb.mover.q, sb.D[ib])), c.offset || [0, 0, 0]));
      const cm = Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]) * 100;
      const red = cm > (S.config.contactRedCm || 3);
      items.push({ p: [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2, (pa[2] + pb[2]) / 2], text: `${fmt(cm, 1)} cm`, red });
      lines.push({ a: pa, b: pb, color: red ? 0xff4b4b : 0xb388ff });
    }
    const key = JSON.stringify(lines.map((l) => [l.a, l.b, l.color].flat().map((x) => +(+x).toFixed(3))));
    if (key !== lastLineKey) { lastLineKey = key; view.setLines(lines); }
  }
  const layer = $('#labels');
  while (labelNodes.length < items.length) { const n = h('div', { class: 'mlabel' }); layer.append(n); labelNodes.push(n); }
  labelNodes.forEach((n, i) => {
    const it = items[i];
    if (!it) { n.style.display = 'none'; return; }
    const s = view.project(it.p);
    n.style.display = s.behind ? 'none' : 'block';
    n.style.left = `${s.x}px`; n.style.top = `${s.y}px`;
    n.textContent = it.text;
    n.className = `mlabel ${it.red ? 'red' : ''}`;
  });
}

// ------------------------------------------------------------------ mouse editing
function bindView() {
  const dom = view.renderer.domElement;
  let op = null;
  dom.addEventListener('mousedown', (e) => {
    if (!S.doc) return;
    const hit = e.button === 0 ? view.pick(e.clientX, e.clientY) : null;
    if (e.button !== 0) { view.beginOrbit(e.clientX, e.clientY, e.button === 2 && !e.shiftKey ? 'pan' : 'orbit'); op = { kind: 'cam' }; return; }
    if (hit?.pick === 'ring' && gizmoState) {
      beginDrag();
      const c = view.project(gizmoState.p);
      const r = dom.getBoundingClientRect();
      op = { kind: 'ring', k: hit.k, cx: c.x + r.left, cy: c.y + r.top, a0: Math.atan2(-(e.clientY - (c.y + r.top)), e.clientX - (c.x + r.left)), rot0: gizmoState.rot.slice(), g: { ...gizmoState } };
      // Rotation sense: counter-clockwise on screen is + when the axis points to the camera.
      const vd = view.viewDir();
      op.sign = (gizmoState.axes[hit.k][0] * -vd[0] + gizmoState.axes[hit.k][1] * -vd[1] + gizmoState.axes[hit.k][2] * -vd[2]) >= 0 ? 1 : -1;
      return;
    }
    if (hit?.pick === 'handle') {
      beginDrag();
      const sols = solveAt(S.t);
      const sol = sols[hit.actor];
      const hl = handleList(sols).find((x) => x.actor === hit.actor && x.name === hit.name);
      select({ selHandle: { actor: hit.actor, name: hit.name }, actor: hit.actor, selBone: null, selGroup: hit.name.startsWith('hand') || hit.name.startsWith('polehand') ? 'arm' + hit.name.slice(-1) : hit.name.includes('foot') ? 'leg' + hit.name.slice(-1) : hit.name === 'look' ? 'head' : 'pos' });
      renderInspector(); renderTree();
      const vd = view.viewDir();
      op = {
        kind: 'handle', actor: hit.actor, name: hit.name, start: hl.p.slice(), normal: hit.name === 'mover' || e.shiftKey ? [0, 0, 1] : [-vd[0], -vd[1], -vd[2]],
        vertical: e.altKey, rotate: hit.name === 'mover' && e.shiftKey, mover0: { p: sol.mover.p.slice(), yaw: yawOf(sol.mover.q) / DEG },
        root0: (valueAt(S.doc, { actor: hit.actor, kind: 'root' }, S.t)?.p || [0, 0, 0]).slice(), sol,
      };
      if (op.vertical) { op.normal = [vd[0], vd[1], 0]; }
      return;
    }
    if (hit?.pick === 'bone') { op = { kind: 'click', hit, x: e.clientX, y: e.clientY }; return; }
    view.beginOrbit(e.clientX, e.clientY, 'orbit');
    op = { kind: 'cam', click: true, x: e.clientX, y: e.clientY };
  });
  window.addEventListener('mousemove', (e) => {
    if (!op) return;
    if (op.kind === 'cam') { view.moveOrbit(e.clientX, e.clientY); return; }
    if (op.kind === 'click' && Math.hypot(e.clientX - op.x, e.clientY - op.y) > 4) { view.beginOrbit(op.x, op.y, 'orbit'); op = { kind: 'cam' }; return; }
    if (op.kind === 'ring') {
      const a1 = Math.atan2(-(e.clientY - op.cy), e.clientX - op.cx);
      let d = (a1 - op.a0) / DEG;
      d = ((d + 540) % 360) - 180;
      op.a0 = a1;
      op.acc = (op.acc || 0) + d * op.sign;
      const rot = op.rot0.slice();
      rot[op.k] = op.rot0[op.k] + op.acc;
      const final = S.limitsOn ? clampRot(skeletonOf(op.g.actor), op.g.bone, rot).rot : rot;
      mutate((doc) => setBoneRot(doc, op.g.actor, op.g.bone, final), { commit: false });
      renderInspector();
      return;
    }
    if (op.kind === 'handle') { dragHandle(op, e); }
  });
  window.addEventListener('mouseup', () => {
    if (!op) return;
    const o = op;
    op = null;
    if (o.kind === 'cam') { view.endOrbit(); if (o.click) selectBone(S.actor, null); return; }
    if (o.kind === 'click') { selectBone(o.hit.actor, o.hit.bone); return; }
    endDrag();
    renderInspector(); renderTree();
  });
}

function toBody(sol, p) { return qrot(qconj(sol.mover.q), vsub(p, sol.mover.p)); }
function dragHandle(o, e) {
  const pt = view.planePoint(e.clientX, e.clientY, o.start, o.normal);
  if (!pt) return;
  let p = pt;
  if (o.vertical) p = [o.start[0], o.start[1], pt[2]];
  const { actor, name } = o;
  mutate((doc) => {
    const sol = o.sol;
    if (name === 'mover') {
      const ref = { actor, kind: 'mover' };
      if (o.rotate) {
        const a0 = Math.atan2(o.start[1] - o.mover0.p[1], o.start[0] - o.mover0.p[0]);
        const a1 = Math.atan2(pt[1] - o.mover0.p[1], pt[0] - o.mover0.p[0]);
        setKey(doc, ref, S.t, { p: o.mover0.p, yaw: o.mover0.yaw + (a1 - a0) / DEG });
      } else setKey(doc, ref, S.t, { p: [o.mover0.p[0] + pt[0] - o.start[0], o.mover0.p[1] + pt[1] - o.start[1], o.mover0.p[2]], yaw: o.mover0.yaw });
      return;
    }
    if (name === 'root') {
      const d = qrot(qconj(sol.mover.q), vsub(p, o.start));
      const cur = valueAt(doc, { actor, kind: 'root' }, S.t);
      setKey(doc, { actor, kind: 'root' }, S.t, { p: [o.root0[0] + d[0], o.root0[1] + d[1], o.root0[2] + d[2]], rot: cur?.rot || [0, 0, 0] });
      return;
    }
    if (name === 'look') { setKey(doc, { actor, kind: 'look' }, S.t, { target: toBody(sol, p), space: 'body', weight: valueAt(doc, { actor, kind: 'look' }, S.t)?.weight ?? 1 }); return; }
    if (name.startsWith('pole')) {
      const hd = name.slice(4), s = hd.slice(-1);
      const skel = skeletonOf(actor);
      const a = sol.world.P[skel.idx(hd.startsWith('hand') ? BODY.side[s].upper : BODY.side[s].thigh)];
      const w = sol.world.P[skel.idx(HANDLES[hd])];
      const mid = [(a[0] + w[0]) / 2, (a[1] + w[1]) / 2, (a[2] + w[2]) / 2];
      const pole = qrot(qconj(sol.mover.q), vsub(p, mid));
      const cur = valueAt(doc, { actor, kind: 'ik', id: hd }, S.t);
      setKey(doc, { actor, kind: 'ik', id: hd }, S.t, { target: cur?.target, space: 'body', weight: cur?.weight ?? 1, pole });
      return;
    }
    // Hands and feet: body-space IK target. Starting IK on an FK limb takes the current elbow /
    // knee direction as pole so the limb does not flip.
    const ref = { actor, kind: 'ik', id: name };
    const cur = valueAt(doc, ref, S.t);
    const fields = { target: toBody(sol, p), space: 'body', weight: 1 };
    if (!cur || (cur.weight ?? 1) <= 0) {
      const skel = skeletonOf(actor), s = name.slice(-1);
      const root = sol.world.P[skel.idx(name.startsWith('hand') ? BODY.side[s].upper : BODY.side[s].thigh)];
      const joint = sol.world.P[skel.idx(name.startsWith('hand') ? BODY.side[s].lower : BODY.side[s].calf)];
      const w = sol.world.P[skel.idx(HANDLES[name])];
      fields.pole = qrot(qconj(sol.mover.q), vsub(joint, [(root[0] + w[0]) / 2, (root[1] + w[1]) / 2, (root[2] + w[2]) / 2]));
      if (name.startsWith('foot')) fields.yaw = yawOf(qnorm(sol.D[skel.idx(HANDLES[name])])) / DEG;
    } else if (cur.pole) fields.pole = cur.pole;
    if (name.startsWith('foot') && cur?.yaw != null) fields.yaw = cur.yaw;
    setKey(doc, ref, S.t, fields);
  }, { commit: false });
}

// ------------------------------------------------------------------ left panel: actors + bone tree
const TREE = [
  ['group_pos', ['SKEL_ROOT']],
  ['group_torso', ['SKEL_Pelvis', 'SKEL_Spine_Root', 'SKEL_Spine0', 'SKEL_Spine1', 'SKEL_Spine2', 'SKEL_Spine3']],
  ['group_head', ['SKEL_Neck_1', 'SKEL_Neck_2', 'SKEL_Head']],
  ['group_armL', ['SKEL_L_Clavicle', 'SKEL_L_UpperArm', 'SKEL_L_Forearm', 'SKEL_L_Hand']],
  ['group_armR', ['SKEL_R_Clavicle', 'SKEL_R_UpperArm', 'SKEL_R_Forearm', 'SKEL_R_Hand']],
  ['group_legL', ['SKEL_L_Thigh', 'SKEL_L_Calf', 'SKEL_L_Foot', 'SKEL_L_Toe0']],
  ['group_legR', ['SKEL_R_Thigh', 'SKEL_R_Calf', 'SKEL_R_Foot', 'SKEL_R_Toe0']],
];
const label = (b) => b.replace(/^SKEL_/, '').replace(/_/g, ' ');
function renderTree() {
  if (!S.doc) return;
  const tabs = $('#actor-tabs');
  tabs.innerHTML = '';
  for (const id of ACTORS()) tabs.append(h('button', { class: `btn ${S.actor === id ? 'on' : ''}`, onclick: () => { selectBone(id, null); } }, S.doc.actors[id].label || id));
  const pr = $('#partner-row');
  pr.classList.toggle('hidden', S.doc.type !== 'pair');
  const sel = $('#partner-model');
  if (S.doc.type === 'pair' && sel.options.length !== S.partners.length) {
    sel.innerHTML = '';
    for (const p of S.partners) sel.append(h('option', { value: p.model }, p.label || p.model));
  }
  if (S.doc.type === 'pair') sel.value = S.doc.actors.b.model;
  const tree = $('#bone-tree');
  tree.innerHTML = '';
  const skel = skeletonOf(S.actor);
  const fingers = $('#chk-fingers').checked;
  const groups = TREE.map(([g, list]) => [g, list]);
  if (fingers) {
    groups.push(['hand_l', BODY.side.L.fingers.flat()]);
    groups.push(['hand_r', BODY.side.R.fingers.flat()]);
  }
  for (const [g, list] of groups) {
    const box = h('div', { class: 'tree-group' }, h('div', { class: 'tg-title' }, t(g)));
    for (const b of list) {
      if (!skel.has(b)) continue;
      const keyed = b === 'SKEL_ROOT' ? !!keysOf(S.doc, { actor: S.actor, kind: 'root' })?.length : !!keysOf(S.doc, { actor: S.actor, kind: 'bone', id: b })?.length;
      box.append(h('button', { class: `bone ${S.selBone === b ? 'sel' : ''} ${keyed ? 'keyed' : ''}`, onclick: () => selectBone(S.actor, b) }, b === 'SKEL_ROOT' ? t('root') : label(b)));
    }
    tree.append(box);
  }
}

// ------------------------------------------------------------------ right panel: inspector
function renderInspector() {
  const box = $('#inspector');
  box.innerHTML = '';
  if (!S.doc) return;
  if (S.selHandle) {
    const { actor, name } = S.selHandle;
    box.append(h('div', {}, h('b', {}, `${S.doc.actors[actor].label || actor}: ${handleLabel(name)}`)));
    if (/^(hand|foot)[LR]$/.test(name) && ikWeightAt(actor, name) > 0) {
      const v = valueAt(S.doc, { actor, kind: 'ik', id: name }, S.t);
      box.append(h('div', { class: 'info' }, `IK ${v.target.map((x) => fmt(x, 3)).join(' / ')} m`));
      box.append(slider('IK-Gewicht', v.weight ?? 1, 0, 1, 0.05, (w) => mutate((d) => setKey(d, { actor, kind: 'ik', id: name }, S.t, { target: v.target, space: 'body', weight: w }), { commit: false }), () => endDrag(), () => beginDrag()));
      box.append(h('button', { class: 'btn block', 'data-tip': 'tip_remove_ik', onclick: () => { mutate((d) => removeTrack(d, { actor, kind: 'ik', id: name })); renderInspector(); } }, t('remove_ik')));
    }
    if (name === 'look' && keysOf(S.doc, { actor, kind: 'look' })?.length) {
      const v = valueAt(S.doc, { actor, kind: 'look' }, S.t);
      box.append(slider('Blick-Gewicht', v.weight ?? 1, 0, 1, 0.05, (w) => mutate((d) => setKey(d, { actor, kind: 'look' }, S.t, { target: v.target, space: v.space || 'body', weight: w }), { commit: false }), () => endDrag(), () => beginDrag()));
    }
    return;
  }
  if (!S.selBone) { box.append(h('div', { class: 'info' }, t('none_selected'))); return; }
  const actor = S.actor, bone = S.selBone, skel = skeletonOf(actor);
  box.append(h('div', {}, h('b', {}, bone === 'SKEL_ROOT' ? t('root') : label(bone))));
  const ik = ikHandleOfBone(bone);
  if (ik && ikWeightAt(actor, ik) > 0) {
    box.append(h('div', { class: 'info' }, t('ik_controlled')));
    box.append(h('button', { class: 'btn block', 'data-tip': 'tip_remove_ik', onclick: () => { mutate((d) => removeTrack(d, { actor, kind: 'ik', id: ik })); renderInspector(); } }, t('remove_ik')));
    return;
  }
  const basis = jointBasis(skel, bone);
  const rot = boneRotAt(actor, bone);
  basis.labels.forEach((nm, k) => {
    const lim = S.limitsOn && basis.limits ? basis.limits[k] : [-180, 180];
    const set = (v) => { const r = rot.slice(); r[k] = +v; const final = S.limitsOn ? clampRot(skel, bone, r).rot : r; mutate((d) => setBoneRot(d, actor, bone, final), { commit: false }); };
    const rng = h('input', { type: 'range', min: lim[0], max: lim[1], step: 0.5, value: rot[k] });
    const num = h('input', { type: 'number', min: lim[0], max: lim[1], step: 1, value: (+rot[k]).toFixed(1) });
    rng.addEventListener('pointerdown', () => beginDrag());
    rng.addEventListener('input', () => { num.value = rng.value; set(rng.value); });
    rng.addEventListener('change', () => endDrag());
    num.addEventListener('change', () => { set(num.value); renderInspector(); });
    box.append(h('div', { class: `axis ax${k}` }, h('span', { class: 'nm' }, nm || AXIS_LABELS.centre[k]), rng, num));
  });
  box.append(h('div', { class: 'row' },
    h('label', { class: 'check', 'data-tip': 'tip_limits' }, h('input', { type: 'checkbox', checked: S.limitsOn, onchange: (e) => { S.limitsOn = e.target.checked; renderInspector(); } }), t('limits')),
    h('button', { class: 'btn small', 'data-tip': 'tip_reset_bone', onclick: () => mutate((d) => setBoneRot(d, actor, bone, [0, 0, 0])) }, t('reset_bone')),
  ));
}
function handleLabel(name) {
  return { handL: t('hand_l'), handR: t('hand_r'), footL: 'Fuß links', footR: 'Fuß rechts', root: t('root'), look: t('look'), mover: t('mover') }[name] || (name.startsWith('pole') ? (name.includes('hand') ? 'Ellbogen-Richtung' : 'Knie-Richtung') : name);
}
function slider(text, value, min, max, step, onInput, onEnd, onStart) {
  const r = h('input', { type: 'range', min, max, step, value });
  const o = h('output', {}, fmt(value));
  r.addEventListener('pointerdown', () => onStart?.());
  r.addEventListener('input', () => { o.textContent = fmt(r.value); onInput(+r.value); });
  r.addEventListener('change', () => onEnd?.());
  return h('label', { class: 'slider row' }, h('span', {}, text), r, o);
}

// ------------------------------------------------------------------ fingers
function renderFingers() {
  const box = $('#fingers');
  box.innerHTML = '';
  if (!S.doc) return;
  for (const side of ['L', 'R']) {
    const ref = { actor: S.actor, kind: 'fingers', id: side };
    const v = valueAt(S.doc, ref, S.t) || { preset: 'relaxed', curl: 1 };
    const presetNow = v.preset || 'relaxed';
    box.append(h('div', { class: 'tg-title' }, t(side === 'L' ? 'hand_l' : 'hand_r')));
    box.append(h('div', { class: 'presets' }, Object.keys(FINGER_PRESETS).map((p) => h('button', {
      class: `btn small ${presetNow === p ? 'on' : ''}`,
      onclick: () => { mutate((d) => setKey(d, ref, S.t, { preset: p, curl: v.curl ?? 1, spread: undefined })); renderFingers(); },
    }, t(`preset_${p}`)))));
    box.append(slider(t('curl'), v.curl ?? 1, 0, 1.5, 0.05, (x) => mutate((d) => setKey(d, ref, S.t, { preset: presetNow, curl: x, spread: v.spread }), { commit: false }), () => endDrag(), () => beginDrag()));
    box.append(slider(t('spread'), v.spread ?? FINGER_PRESETS[presetNow].spread, -1, 1, 0.05, (x) => mutate((d) => setKey(d, ref, S.t, { preset: presetNow, curl: v.curl ?? 1, spread: x }), { commit: false }), () => endDrag(), () => beginDrag()));
  }
}

// ------------------------------------------------------------------ helpers panel
function renderHelpers() {
  const box = $('#helpers');
  box.innerHTML = '';
  if (!S.doc) return;
  const b = (key, tip, fn, extra = {}) => h('button', { class: 'btn block', 'data-tip': tip, onclick: fn, ...extra }, t(key));
  box.append(
    b('mirror_all', 'tip_mirror_all', mirrorAll),
    b('mirror_sel', 'tip_mirror_sel', () => { if (S.selBone) mutate((d) => mirrorBone(d, S.actor, S.selBone, S.t)); }, { disabled: !S.selBone || !sideOf(S.selBone || '') }),
    h('div', { class: 'row' }, b('copy_pose', 'tip_copy_pose', copyPose), b('paste_pose', 'tip_paste_pose', pastePose, { disabled: !S.clipboardPose })),
    b('snap_ground', 'tip_snap_ground', snapGround),
    b('lock_feet', 'tip_lock_feet', lockFeet),
  );
  if (S.doc.type === 'pair') box.append(b('stick_hand', 'tip_stick_hand', stickHand));
  if (S.selContact != null && S.doc.contacts?.[S.selContact]) box.append(b('unstick', 'tip_stick_hand', () => { mutate((d) => removeContact(d, S.selContact)); select({ selContact: null }); }));
  box.append(h('div', { class: 'hint' }, S.range ? `${t('range')}: ${fmt(S.range[0])}–${fmt(S.range[1])} s` : t('no_range')));
  box.append(h('div', { class: 'tg-title' }, t('notes')));
  const ta = h('textarea', { rows: 3, placeholder: t('notes_hint') }, S.doc.notes || '');
  ta.addEventListener('change', () => mutate((d) => { d.notes = ta.value.slice(0, 4000); }));
  box.append(ta);
}
function mirrorAll() { mutate((d) => applyPose(d, S.actor, S.t, mirrorPose(capturePose(d, S.actor, S.t)))); toast(t('mirror_all'), 'ok', 1500); }
function copyPose() { S.clipboardPose = capturePose(S.doc, S.actor, S.t); renderHelpers(); toast(t('copy_pose'), 'ok', 1500); }
function pastePose() { if (S.clipboardPose) mutate((d) => applyPose(d, S.actor, S.t, S.clipboardPose)); }
function snapGround() {
  const actor = S.actor;
  const sols = solveAt(S.t), sol = sols[actor], skel = skeletonOf(actor);
  const sides = S.selHandle?.name === 'footL' ? ['L'] : S.selHandle?.name === 'footR' ? ['R'] : ['L', 'R'];
  mutate((d) => {
    for (const s of sides) {
      const ref = { actor, kind: 'ik', id: 'foot' + s };
      const cur = valueAt(d, ref, S.t);
      const ankle = toBody(sol, sol.world.P[skel.idx(HANDLES['foot' + s])]);
      const target = [cur && (cur.weight ?? 1) > 0 ? cur.target[0] : ankle[0], cur && (cur.weight ?? 1) > 0 ? cur.target[1] : ankle[1], groundAnkle(actor)];
      setKey(d, ref, S.t, { target, space: 'body', weight: 1, pitch: 0, roll: 0, yaw: cur?.yaw ?? yawOf(qnorm(sol.D[skel.idx(HANDLES['foot' + s])])) / DEG, pole: cur?.pole });
    }
  });
}
function lockFeet() {
  if (!S.range) return toast(t('no_range'), 'warn');
  const side = S.selHandle?.name === 'footL' ? 'L' : S.selHandle?.name === 'footR' ? 'R' : 'both';
  mutate((d) => addFootLock(d, S.actor, side, S.range));
  toast(t('lock_feet'), 'ok', 1500);
}
const PARTS = { part_head: 'SKEL_Head', part_neck: 'SKEL_Neck_1', part_chest: 'SKEL_Spine3', part_pelvis: 'SKEL_Pelvis', part_shoulderL: 'SKEL_L_UpperArm', part_shoulderR: 'SKEL_R_UpperArm', part_armL: 'SKEL_L_Forearm', part_armR: 'SKEL_R_Forearm', part_handL: 'SKEL_L_Hand', part_handR: 'SKEL_R_Hand' };
function stickHand() {
  if (S.doc.type !== 'pair') return toast(t('pair_only'), 'warn');
  const hd = S.selHandle && /^(hand|foot)[LR]$/.test(S.selHandle.name) ? S.selHandle : null;
  if (!hd) return toast(t('select_hand_first'), 'warn');
  const other = ACTORS().find((a) => a !== hd.actor);
  const sel = h('select', {}, Object.entries(PARTS).map(([k, b]) => h('option', { value: b }, t(k))));
  dialog(t('stick_hand'), h('div', {}, h('label', {}, t('stick_target')), sel), [
    h('button', { class: 'btn', onclick: closeDialog }, t('cancel')),
    h('button', { class: 'btn accent', onclick: () => {
      const bone = sel.value;
      const sols = solveAt(S.t);
      const so = sols[other], sk = skeletonOf(other), ib = sk.idx(bone);
      const from = sols[hd.actor].world.P[skeletonOf(hd.actor).idx(HANDLES[hd.name])];
      const offset = qrot(qconj(qnorm(qmul(so.mover.q, so.D[ib]))), vsub(from, so.world.P[ib]));
      const range = S.range || [S.t, S.doc.duration];
      mutate((d) => addStick(d, `${hd.actor}.${hd.name}`, `${other}.${bone}`, offset, range));
      closeDialog();
    } }, t('ok')),
  ]);
}

// ------------------------------------------------------------------ pose library
function renderPoses() {
  const box = $('#poses');
  box.innerHTML = '';
  if (!S.doc) return;
  box.append(h('div', { class: 'tg-title' }, t('builtin')));
  box.append(h('div', { class: 'presets' }, Object.keys(BUILTIN_POSES).map((k) => h('button', { class: 'btn small', onclick: () => mutate((d) => applyPose(d, S.actor, S.t, BUILTIN_POSES[k])) }, t(k)))));
  box.append(h('div', { class: 'tg-title' }, t('my_poses')));
  const names = Object.keys(S.poses).sort();
  for (const n of names) {
    box.append(h('div', { class: 'row' },
      h('button', { class: 'btn small', style: 'flex:1;text-align:left', onclick: () => { try { const p = JSON.parse(S.poses[n]); mutate((d) => applyPose(d, S.actor, S.t, p)); } catch { toast(t('pose_invalid'), 'error'); } } }, n),
      h('button', { class: 'btn small danger', onclick: () => server('poseDelete', [n]) }, '✕')));
  }
  box.append(h('button', { class: 'btn block', 'data-tip': 'tip_save_pose', onclick: async () => {
    const n = await promptBox(t('pose_name_prompt'), '', t('name_hint'));
    if (!n) return;
    if (!/^[a-z0-9_]{1,32}$/.test(n)) return toast(t('name_hint'), 'error');
    server('poseSave', [n, JSON.stringify(capturePose(S.doc, S.actor, S.t))]);
  } }, t('save_pose')));
}

// ------------------------------------------------------------------ checks (traffic light)
function renderChecks() {
  const box = $('#checks');
  const light = $('#light');
  light.className = `light ${S.light}`;
  light.textContent = S.checking ? t('check_running') : t(`light_${S.light}`);
  box.innerHTML = '';
  if (S.checkError) box.append(h('div', { class: 'err' }, S.checkError));
  const list = S.findings.slice().sort((a, b) => ({ error: 0, warn: 1, ok: 2 }[a.level] - { error: 0, warn: 1, ok: 2 }[b.level]));
  for (const f of list) {
    const row = h('div', { class: `finding ${f.level}` }, h('div', { class: 'ft' }, f.title), h('div', { class: 'fx' }, f.text));
    const btns = h('div', { class: 'row' });
    if (f.level !== 'ok' && f.t != null) btns.append(h('button', { class: 'btn small', onclick: () => { setTime(f.t); if (f.actor) select({ actor: f.actor }); } }, t('jump')));
    if (f.fix) btns.append(h('button', { class: 'btn small accent', onclick: () => { const fixed = applyFix(S.doc, f.fix, { sampled: lastSampled }); setDoc(fixed); toast(`${t('fix')}: ${f.fix.label || f.title}`, 'ok', 1800); } }, f.fix.label || t('fix')));
    if (btns.children.length) row.append(btns);
    box.append(row);
  }
}

// ------------------------------------------------------------------ transport + timeline toolbar
function updateTimeOut() {
  if (!S.doc) return;
  const f = Math.round(S.t * FPS), n = Math.round(S.doc.duration * FPS);
  $('#time-out').textContent = `${fmt(S.t)} s · ${t('frame', f, n)}`;
}
function updateTransport() {
  $('#btn-play').textContent = S.playing ? '❚❚' : '▶';
  if (!S.doc) return;
  $('#chk-loop').checked = !!S.doc.loop;
  $('#duration').value = S.doc.duration;
  $('#range-out').textContent = S.range ? `${t('range')} ${fmt(S.range[0])}–${fmt(S.range[1])} s` : '';
  $('#btn-undo').disabled = !S.history.length;
  $('#btn-redo').disabled = !S.future.length;
}
function updateHeader() {
  $('#project-name').textContent = S.doc ? `${S.doc.title || S.name} (${S.doc.type === 'pair' ? t('pair') : t('single')})` : t('no_project');
  $('#save-state').textContent = !S.doc ? '' : S.saving ? t('saving') : S.dirty ? t('unsaved') : S.savedAt ? t('saved_at', new Date(S.savedAt).toLocaleTimeString().slice(0, 5)) : '';
}

// ------------------------------------------------------------------ server ops
function server(op, args) { return post('server', { op, args }); }
function save() {
  if (!S.doc || !S.name || S.saving) return;
  S.saving = true; S.saveVersion = S.version;
  updateHeader();
  server('save', [S.name, serialize(S.doc)]);
}
onMessage('reply', ({ data }) => {
  if (!data) return;
  if (data.op === 'save') {
    S.saving = false;
    if (data.ok) { if (S.saveVersion === S.version) S.dirty = false; S.savedAt = Date.now(); } else toast(data.msg, 'error');
    updateHeader();
    return;
  }
  if (data.op === 'preview' || data.op === 'finalize') {
    if (!data.ok) { toast(data.msg, 'error', 6000); if (data.op === 'preview') { S.test = null; renderTest(); } else finishError(data.msg); }
    return;
  }
  if (data.op === 'rename' && data.ok && S.name === data.from) { S.name = data.name; mutate((d) => { d.name = data.name; }); }
  if (data.msg) toast(data.msg, data.ok ? 'ok' : 'error');
});
onMessage('projects', ({ list }) => { S.projects = list || []; if (isModal() && projectsOpen) showProjects(); });
onMessage('poses', ({ poses }) => { S.poses = poses || {}; renderPoses(); });
onMessage('notice', ({ key, text }) => toast(text || t(key), 'warn', 3000));
onMessage('project', ({ name, text }) => {
  let doc;
  try { const m = migrate(JSON.parse(text)); if (m.errors) throw new Error(m.errors[0].msg); doc = m.doc; } catch (e) { return toast(`${t('project_invalid') || t('err')}: ${e.message}`, 'error'); }
  const errs = validateDocument(doc);
  if (errs.length) toast(errs[0].msg, 'warn', 6000);
  openDoc(doc, name);
});

function openDoc(doc, name) {
  S.t = 0; S.playing = false;
  for (const id of Object.keys(view.actors)) view.removeActor(id);
  loadDoc(doc, name);
  for (const id of ACTORS()) view.buildActor(id, skeletonOf(id));
  select({ actor: 'a', selBone: null, selHandle: null });
  if (doc.type === 'pair') spawnPartner(); else post('partner', { model: null });
  closeDialog();
  camPreset(doc.type === 'pair' ? 'side' : 'front');
  renderAll();
  runChecks();
}
async function spawnPartner() {
  const m0 = valueAt(S.doc, { actor: 'b', kind: 'mover' }, 0) || { p: [0, 0.9, 0], yaw: 180 };
  const r = await post('partner', { model: S.doc.actors.b.model, p: m0.p, yaw: m0.yaw });
  if (r && r.ok === false && r.error) toast(t('partner_spawn_failed', r.error), 'error');
}

// ------------------------------------------------------------------ projects dialog
function showProjects() {
  projectsOpen = true;
  let selected = S.name;
  const listEl = h('div', { class: 'plist' });
  const fill = () => {
    listEl.innerHTML = '';
    if (!S.projects.length) listEl.append(h('div', { class: 'pitem' }, h('span', { class: 'pm' }, '—')));
    for (const p of S.projects) {
      listEl.append(h('div', { class: `pitem ${p.name === selected ? 'sel' : ''}`, onclick: () => { selected = p.name; fill(); }, ondblclick: () => server('load', [p.name]) },
        h('span', { class: 'pn' }, p.title && p.title !== p.name ? `${p.title} (${p.name})` : p.name),
        h('span', { class: 'pm' }, p.type === 'pair' ? t('pair') : t('single')),
        h('span', { class: 'pm' }, p.updated ? new Date(p.updated * 1000).toLocaleString().slice(0, 16) : '')));
    }
  };
  fill();
  const nameIn = h('input', { type: 'text', placeholder: 'winken_01' });
  const typeSel = h('select', {}, h('option', { value: 'single' }, t('single')), h('option', { value: 'pair' }, t('pair')));
  const partner = h('select', {}, S.partners.map((p) => h('option', { value: p.model }, p.label || p.model)));
  const dur = h('input', { type: 'number', min: 0.2, max: 30, step: 0.1, value: S.config.duration || 2 });
  const partnerRow = h('div', { class: 'row hidden' }, h('label', {}, t('partner_model')), partner);
  typeSel.addEventListener('change', () => partnerRow.classList.toggle('hidden', typeSel.value !== 'pair'));
  const create = () => {
    const name = nameIn.value.trim();
    if (!/^[a-z0-9_]{1,40}$/.test(name)) return toast(t('name_hint'), 'error');
    if (S.projects.some((p) => p.name === name)) return toast(`${name}: existiert schon`, 'error');
    const doc = newDocument({ name, type: typeSel.value, duration: Math.max(0.2, Math.min(30, +dur.value || 2)), models: { a: 'mp_m_freemode_01', b: partner.value } });
    doc.title = name;
    // Start from a natural stand instead of the A-shaped bind pose.
    for (const id of Object.keys(doc.actors)) applyPose(doc, id, 0, BUILTIN_POSES.pose_stand);
    openDoc(doc, name);
    S.dirty = true;
    save();
    server('list', []);
  };
  const act = (fn) => () => { if (!selected) return toast(t('none_selected'), 'warn'); fn(selected); };
  const body = h('div', {},
    listEl,
    h('div', { class: 'row' },
      h('button', { class: 'btn accent', onclick: act((n) => server('load', [n])) }, t('open')),
      h('button', { class: 'btn', onclick: act(async (n) => { const to = await promptBox(t('new_name_prompt'), n, t('name_hint')); if (to) server('rename', [n, to]); setTimeout(showProjects, 200); }) }, t('rename')),
      h('button', { class: 'btn', onclick: act(async (n) => { const to = await promptBox(t('new_name_prompt'), `${n}_kopie`, t('name_hint')); if (to) server('duplicate', [n, to]); setTimeout(showProjects, 200); }) }, t('duplicate')),
      h('button', { class: 'btn danger', onclick: act(async (n) => { if (await confirmBox(t('confirm_delete', n))) server('delete', [n]); setTimeout(showProjects, 200); }) }, t('delete'))),
    h('h3', {}, t('new_project')),
    h('div', { class: 'row' }, h('label', {}, t('name')), nameIn), h('div', { class: 'hint' }, t('name_hint')),
    h('div', { class: 'row' }, typeSel, h('label', {}, t('duration_s')), dur), partnerRow);
  dialog(t('projects'), body, [
    S.doc ? h('button', { class: 'btn', onclick: closeDialog }, t('close')) : null,
    h('button', { class: 'btn accent', onclick: create }, t('create')),
  ]);
}

// ------------------------------------------------------------------ test in game
function contactSpecs() {
  const tagOf = (actor, bone) => { const sk = skeletonOf(actor); return sk.has(bone) ? sk.bones[sk.idx(bone)].tag : null; };
  return (S.doc.contacts || []).map((c) => {
    const a = endpoint(c.from), b = endpoint(c.to);
    const sk = skeletonOf(b.actor);
    // GET_PED_BONE_COORDS offsets are in the bone's own frame; contact offsets are in the bone's
    // rest model frame -> rotate by the inverse rest rotation (VERIFY in game with the measure).
    const off = sk.has(b.bone) ? qrot(qconj(sk.restQ[sk.idx(b.bone)]), c.offset || [0, 0, 0]) : [0, 0, 0];
    return { id: c.id || `${c.from}>${c.to}`, a: { actor: a.actor, tag: tagOf(a.actor, a.bone), offset: [0, 0, 0] }, b: { actor: b.actor, tag: tagOf(b.actor, b.bone), offset: off } };
  }).filter((c) => c.a.tag != null && c.b.tag != null);
}
let noticeShown = false;
async function startTest() {
  if (!S.doc || !S.name) return;
  if (!noticeShown) { if (!(await confirmBox(t('test_notice')))) return; noticeShown = true; }
  S.playing = false;
  S.test = { stage: 'converting', t0: performance.now(), points: [], follow: true };
  renderTest();
  server('preview', [S.name, serialize(S.doc)]);
  S.dirty = false; S.savedAt = Date.now(); updateHeader();
}
onMessage('job', ({ result }) => {
  if (!result) return;
  if (result.kind === 'final') return finishResult(result);
  if (!S.test) return;
  if (!result.ok) { S.test = { ...S.test, stage: 'failed', errors: result.errors || [] }; renderTest(); return; }
  S.test.stage = 'loading';
  S.test.result = result;
  S.lastResult = result;
  renderTest();
  post('test', { action: 'start', result: { dict: result.dict, clips: result.clips, origins: result.origins, duration: result.duration }, loop: !!S.doc.loop, rate: 1, phase: 0, contacts: contactSpecs() });
});
onMessage('test:started', ({ ok, error }) => {
  if (!S.test) return;
  if (!ok) { S.test.stage = 'failed'; S.test.errors = [{ msg: error }]; renderTest(); return; }
  S.test.stage = 'playing';
  S.test.elapsed = (performance.now() - S.test.t0) / 1000;
  renderTest();
});
onMessage('test:state', (m) => {
  if (!S.test) return;
  S.test.phase = m.phase;
  S.test.points = m.points || [];
  needTimeline = true;
  updateMeasure();
});
// After a test the entities go back to the editing positions (placement is re-sent).
onMessage('test:stopped', () => { S.test = null; lastPlace = ''; renderTest(); view?.setLines([]); });
function stopTest() { post('test', { action: 'stop' }); S.test = null; lastPlace = ''; renderTest(); view.setLines([]); }

function renderTest() {
  const sec = $('#sec-test'), box = $('#test');
  sec.classList.toggle('hidden', !S.test);
  box.innerHTML = '';
  if (!S.test) return;
  const st = S.test;
  const stageText = { converting: t('test_converting'), loading: t('test_loading'), playing: t('test_playing', fmt(st.elapsed || 0, 1)), failed: t('test_failed') }[st.stage];
  box.append(h('div', { class: `stage ${st.stage === 'failed' ? 'err' : ''}` }, stageText));
  for (const e of st.errors || []) box.append(h('div', { class: 'err' }, e.msg || String(e)));
  if (st.stage === 'playing') {
    box.append(h('div', { class: 'row' },
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: !!S.doc.loop, onchange: (e) => post('test', { action: 'loop', loop: e.target.checked }) }), t('loop')),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: S.overlay, onchange: (e) => { S.overlay = e.target.checked; } }), t('overlay'))));
    box.append(slider(t('speed'), 1, 0, 2, 0.05, (x) => post('test', { action: 'rate', rate: x })));
    box.append(slider(t('phase'), st.phase || 0, 0, 0.999, 0.001, (x) => { post('test', { action: 'rate', rate: 0 }); post('test', { action: 'phase', phase: x }); }));
    box.append(h('button', { class: 'btn block', 'data-tip': 'tip_calibrate', onclick: calibrate }, t('calibrate')));
    if (st.calib) box.append(h('div', { class: st.calib.max <= 1 ? 'info' : 'err' }, t('calib_result', fmt(st.calib.max, 1), fmt(st.calib.mean, 1), st.calib.n)));
    box.append(h('div', { class: 'tg-title' }, t('contacts')), h('table', { class: 'mtable', id: 'measure' }));
    updateMeasure();
  }
  box.append(h('button', { class: 'btn block', onclick: stopTest }, t('stop')));
}
function updateMeasure() {
  const tb = document.getElementById('measure');
  if (!tb || !S.test) return;
  tb.innerHTML = '';
  for (const p of S.test.points || []) tb.append(h('tr', {}, h('td', {}, p.id), h('td', { class: p.red ? 'red' : '' }, `${fmt(p.cm, 1)} cm`)));
  view.setLines((S.test.points || []).map((p) => ({ a: p.a, b: p.b, color: p.red ? 0xff4b4b : 0x46e0c4 })));
}
async function calibrate() {
  if (!S.test || S.test.stage !== 'playing') return toast(t('calib_need_test'), 'warn');
  post('test', { action: 'rate', rate: 0 });
  await new Promise((r) => setTimeout(r, 300));
  const tt = (S.test.phase || 0) * S.doc.duration;
  const sols = solveAt(tt);
  let max = 0, sum = 0, n = 0;
  for (const id of ACTORS()) {
    const sk = skeletonOf(id);
    const names = editableBones(sk).filter((b) => !b.includes('Finger') && b !== 'SKEL_ROOT');
    const r = await post('bones', { actor: id, list: names.map((b) => ({ tag: sk.bones[sk.idx(b)].tag, id: b })) });
    for (const b of r?.bones || []) {
      const ref = sols[id].world.P[sk.idx(b.id)];
      const d = Math.hypot(b.p[0] - ref[0], b.p[1] - ref[1], b.p[2] - ref[2]) * 100;
      max = Math.max(max, d); sum += d; n++;
    }
  }
  S.test.calib = { max, mean: n ? sum / n : 0, n };
  renderTest();
}

// ------------------------------------------------------------------ finish
let finishBox = null;
function showFinish() {
  if (!S.doc || !S.name) return;
  const title = h('input', { type: 'text', value: S.doc.title || S.name, style: 'width:100%' });
  const target = h('input', { type: 'text', value: S.doc.targetResource || '', placeholder: 'jj_emotes' });
  const dict = h('input', { type: 'text', value: S.doc.dict || `jj_${S.name}`.slice(0, 48) });
  const notes = h('textarea', { rows: 3, placeholder: t('notes_hint') }, S.doc.notes || '');
  finishBox = h('div', { id: 'finish-out' });
  const go = () => {
    const d = dict.value.trim(), tr = target.value.trim();
    if (!/^[a-z0-9_]{1,48}$/.test(d) || d.startsWith('jjs_')) return toast(t('dict_invalid') || t('name_hint'), 'error');
    if (tr && !/^[A-Za-z0-9_-]{1,64}$/.test(tr)) return toast(t('target_invalid') || t('err'), 'error');
    mutate((doc) => { doc.title = title.value.slice(0, 80); doc.notes = notes.value.slice(0, 4000); doc.dict = d; if (tr) doc.targetResource = tr; else delete doc.targetResource; });
    finishBox.innerHTML = '';
    finishBox.append(h('div', { class: 'stage' }, t('test_converting')));
    server('finalize', [S.name, serialize(S.doc), d, tr]);
    S.dirty = false; S.savedAt = Date.now(); updateHeader();
  };
  dialog(t('finish_title'), h('div', {},
    h('div', { class: 'row' }, h('label', {}, t('name')), title),
    h('div', { class: 'row' }, h('label', {}, t('target_resource')), target, h('label', {}, t('dict_name')), dict),
    h('div', { class: 'tg-title' }, t('notes')), notes, finishBox), [
    h('button', { class: 'btn', onclick: closeDialog }, t('close')),
    h('button', { class: 'btn accent', onclick: go }, t('convert')),
  ]);
}
function finishError(msg) { if (finishBox) { finishBox.innerHTML = ''; finishBox.append(h('div', { class: 'err' }, msg)); } }
function finishResult(r) {
  if (!finishBox) return;
  finishBox.innerHTML = '';
  if (!r.ok) { for (const e of r.errors || []) finishBox.append(h('div', { class: 'err' }, e.msg)); return; }
  const ta = h('textarea', { class: 'report', readonly: true }, r.report?.text || '');
  finishBox.append(h('div', { class: 'tg-title' }, t('report')), ta,
    h('div', { class: 'row' }, h('button', { class: 'btn accent', onclick: () => copyText(ta) }, t('copy')),
      h('span', { class: 'hint' }, t('report_files', [r.report?.md, r.report?.json, r.report?.ycd].filter(Boolean).join(', ')))));
}
function copyText(ta) {
  ta.removeAttribute('readonly'); ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  ta.setAttribute('readonly', '');
  if (!ok && navigator.clipboard) navigator.clipboard.writeText(ta.value).then(() => toast(t('copied'), 'ok'), () => toast(t('copy_failed'), 'warn'));
  else toast(ok ? t('copied') : t('copy_failed'), ok ? 'ok' : 'warn');
}

// ------------------------------------------------------------------ tutorial
function maybeTutorial(force = false) {
  let done = false;
  try { done = localStorage.getItem('jjs_tutorial_done') === '1'; } catch { done = false; }
  if (!force && (done || S.config.tutorial === false)) return;
  let step = 0;
  const show = () => {
    $('#tutorial').classList.remove('hidden');
    $('#tut-step').textContent = `${step + 1} / 5`;
    $('#tut-text').textContent = t(`tut${step + 1}`);
    $('#tut-next').textContent = step === 4 ? t('tutorial_done') : t('tutorial_next');
  };
  const end = () => { $('#tutorial').classList.add('hidden'); try { localStorage.setItem('jjs_tutorial_done', '1'); } catch { /* private mode */ } };
  $('#tut-next').onclick = () => { if (step >= 4) end(); else { step++; show(); } };
  $('#tut-skip').onclick = end;
  show();
}

// ------------------------------------------------------------------ UI bindings + shortcuts
function renderAll() {
  renderTree(); renderInspector(); renderFingers(); renderHelpers(); renderPoses(); renderChecks(); renderTest();
  updateTransport(); updateTimeOut(); updateHeader();
}
function bindUi() {
  initTooltips();
  on('doc', () => { renderInspector(); renderFingers(); updateTransport(); updateHeader(); renderTreeLater(); });
  on('time', () => { updateTimeOut(); renderInspectorLater(); });
  on('selection', () => { renderHelpers(); needTimeline = true; });
  on('history', updateTransport);
  on('range', () => { updateTransport(); renderHelpers(); });
  on('checks', renderChecks);
  $('#btn-projects').onclick = () => { server('list', []); showProjects(); };
  $('#btn-undo').onclick = undo;
  $('#btn-redo').onclick = redo;
  $('#btn-save').onclick = save;
  $('#btn-test').onclick = startTest;
  $('#btn-finish').onclick = showFinish;
  $('#btn-help').onclick = () => maybeTutorial(true);
  $('#btn-close').onclick = askClose;
  for (const b of document.querySelectorAll('[data-cam]')) b.onclick = () => camPreset(b.dataset.cam);
  $('#btn-play').onclick = togglePlay;
  $('#chk-loop').onchange = (e) => mutate((d) => { d.loop = e.target.checked; });
  $('#speed').oninput = (e) => { S.speed = +e.target.value; $('#speed-out').textContent = `${fmt(S.speed, 1)}×`; };
  $('#chk-onion').onchange = (e) => { S.onion = e.target.checked; };
  $('#chk-allrows').onchange = (e) => timeline.setShowAll(e.target.checked);
  $('#chk-fingers').onchange = renderTree;
  $('#partner-model').onchange = (e) => { mutate((d) => { d.actors.b.model = e.target.value; }); spawnPartner(); };
  $('#duration').onchange = (e) => {
    const v = Math.max(0.2, Math.min(30, +e.target.value || 2));
    mutate((d) => {
      d.duration = +v.toFixed(3);
      // Keys and ranges after the new end move to the end.
      const clampKeys = (ks) => { for (const k of ks || []) k.t = Math.min(k.t, d.duration); };
      for (const tr of Object.values(d.tracks)) {
        clampKeys(tr.mover); clampKeys(tr.root); clampKeys(tr.look);
        for (const ks of Object.values(tr.bones || {})) clampKeys(ks);
        for (const ks of Object.values(tr.ik || {})) clampKeys(ks);
        for (const ks of Object.values(tr.fingers || {})) clampKeys(ks);
        for (const ls of Object.values(tr.feet?.lock || {})) for (const r of ls) { r[0] = Math.min(r[0], d.duration); r[1] = Math.min(r[1], d.duration); }
        for (const [k, ks] of Object.entries(tr.bones || {})) tr.bones[k] = dedupe(ks);
      }
      for (const c of d.contacts || []) { c.t[0] = Math.min(c.t[0], d.duration); c.t[1] = Math.min(c.t[1], d.duration); }
      for (const ev of d.events || []) ev.t = Math.min(ev.t, d.duration);
    });
    setTime(Math.min(S.t, v));
  };
  for (const b of document.querySelectorAll('[data-ease]')) b.onclick = () => {
    if (!S.selKeys.length) return toast(t('none_selected'), 'warn', 1500);
    mutate((d) => { for (const k of S.selKeys) setEaseAt(d, k.actor, k.group, k.t, b.dataset.ease); });
  };
  $('#btn-key-del').onclick = deleteSelection;
  $('#btn-event').onclick = () => {
    const name = h('input', { type: 'text', value: 'impact' });
    const dur = h('input', { type: 'number', min: 0, max: 30, step: 0.05, value: 0 });
    dialog(t('add_event'), h('div', {}, h('div', { class: 'row' }, h('label', {}, t('event_name')), name), h('div', { class: 'hint' }, t('name_hint')),
      h('div', { class: 'row' }, h('label', {}, t('event_duration')), dur)), [
      h('button', { class: 'btn', onclick: () => closeDialog(false) }, t('cancel')),
      h('button', { class: 'btn accent', onclick: () => {
        const n = name.value.trim();
        if (!/^[a-z0-9_]{1,24}$/.test(n)) return toast(t('name_hint'), 'error');
        const d0 = Math.max(0, Math.min(S.doc.duration - S.t, +dur.value || 0));
        mutate((d) => addEvent(d, n, S.t, d0 > 0 ? d0 : undefined));
        closeDialog(false);
      } }, t('ok')),
    ]);
  };
  window.addEventListener('keydown', onKey);
  setInterval(() => { if (running && S.dirty && !S.test) save(); }, Math.max(10, S.config.autosave || 30) * 1000);
}
const dedupe = (ks) => { const seen = new Set(); return ks.filter((k) => { const q = Math.round(k.t * 1000); if (seen.has(q)) return false; seen.add(q); return true; }); };
let treeT = 0, inspT = 0;
function renderTreeLater() { clearTimeout(treeT); treeT = setTimeout(renderTree, 120); }
function renderInspectorLater() { clearTimeout(inspT); inspT = setTimeout(() => { renderInspector(); renderFingers(); }, 60); }
function togglePlay() { if (!S.doc) return; if (!S.playing && S.t >= S.doc.duration - 1e-3 && !S.doc.loop) S.t = 0; S.playing = !S.playing; updateTransport(); }
function camPreset(name) {
  if (!S.doc) return view.setPreset(name);
  const sols = solveAt(S.t);
  const sol = sols[S.actor];
  const sk = skeletonOf(S.actor);
  const focus = sol.world.P[sk.idx('SKEL_Spine2')];
  if (name === 'focus') {
    const b = S.selBone || (S.selHandle ? HANDLES[S.selHandle.name] : null);
    return view.focusOn(b && sk.has(b) ? sol.world.P[sk.idx(b)] : focus, 1.1);
  }
  view.setPreset(name, focus);
}
function deleteSelection() {
  if (S.selKeys.length) { mutate((d) => { for (const k of S.selKeys) deleteKeysAt(d, k.actor, k.group, k.t); }); select({ selKeys: [] }); return; }
  if (S.selEvent != null) { mutate((d) => removeEvent(d, S.selEvent)); select({ selEvent: null }); return; }
  if (S.selContact != null) { mutate((d) => removeContact(d, S.selContact)); select({ selContact: null }); return; }
  if (S.selLock) { const l = S.selLock; mutate((d) => removeFootLock(d, l.actor, l.side, l.index)); select({ selLock: null }); }
}
async function askClose() {
  if (await confirmBox(t('confirm_close'))) {
    if (S.dirty) save();
    setTimeout(() => post('close'), S.dirty ? 300 : 0);
  }
}
function onKey(e) {
  if (e.key === 'Escape') { e.preventDefault(); if (!$('#tutorial').classList.contains('hidden')) { $('#tut-skip').click(); return; } if (isModal()) { if (S.doc) closeDialog(); return; } askClose(); return; }
  if (isModal() || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
  if (!S.doc) return;
  const k = e.key.toLowerCase();
  if (e.ctrlKey && k === 'z') { e.preventDefault(); undo(); return; }
  if (e.ctrlKey && (k === 'y' || (e.shiftKey && k === 'z'))) { e.preventDefault(); redo(); return; }
  if (e.ctrlKey && k === 's') { e.preventDefault(); save(); return; }
  if (e.ctrlKey && k === 'c') { if (S.selKeys.length) S.clipboardKeys = S.selKeys.flatMap((s) => copyKeysAt(S.doc, s.actor, s.group, s.t).map((x) => ({ ...x, dt: s.t - S.selKeys[0].t }))); else copyPose(); return; }
  if (e.ctrlKey && k === 'v') {
    if (S.clipboardKeys?.length) mutate((d) => { for (const c of S.clipboardKeys) pasteKeys(d, [c], S.t + c.dt); });
    else pastePose();
    return;
  }
  if (k === ' ') { e.preventDefault(); togglePlay(); return; }
  if (k === 'delete' || k === 'backspace') { deleteSelection(); return; }
  if (k === 'm') { mirrorAll(); return; }
  if (k === 'o') { S.onion = !S.onion; $('#chk-onion').checked = S.onion; return; }
  if (k === 'l') { S.limitsOn = !S.limitsOn; renderInspector(); return; }
  if (k === 'f') { camPreset('focus'); return; }
  if (['1', '2', '3', '4'].includes(k)) { camPreset(['front', 'side', 'top', 'shoulder'][+k - 1]); return; }
  if (k === 'arrowleft' || k === 'arrowright') {
    const dir = k === 'arrowright' ? 1 : -1;
    if (e.shiftKey) {
      const times = keyTimes(S.doc, S.actor, null);
      const n = dir > 0 ? times.find((x) => x > S.t + 1e-3) : times.filter((x) => x < S.t - 1e-3).pop();
      if (n != null) setTime(n);
    } else setTime(snapT(S.t + dir / FPS));
    e.preventDefault();
  }
}

// ------------------------------------------------------------------ browser preview (no game)
if (!inGame) {
  window.addEventListener('DOMContentLoaded', () => {
    const m = window.JJS_MOCK || {};
    if (m.autoOpen === false) return;
    emit({ type: 'open', data: { locale: 'de', frame: { x: 0, y: 0, z: 0, heading: 0 }, config: { autosave: 30, undo: 150, duration: 2, tutorial: m.tutorial ?? true, partners: [{ model: 'mp_m_freemode_01', label: 'Mann (Freemode)' }, { model: 'mp_f_freemode_01', label: 'Frau (Freemode)' }, { model: 'u_m_y_zombie_01', label: 'Zombie' }], camera: { Fov: 45, MinDistance: 0.4, MaxDistance: 12, UpdatesPerSecond: 30 } }, server: { projects: [], skeletons: m.skeletons || {}, poses: {}, watch: { alive: true } } } });
  });
}

// Test hooks (Playwright): state access without touching internals elsewhere.
window.JJS_STUDIO = {
  S, solveAt, runChecks, serialize: () => serialize(S.doc), setTime, select: selectBone, view: () => view, groupOf,
  // Page coordinates of a scene-frame point / of a handle / of a point on a gizmo ring.
  screenOf(p) { const s = view.project(p); const r = view.renderer.domElement.getBoundingClientRect(); return { x: s.x + r.left, y: s.y + r.top }; },
  handleScreen(actor, name) { const hd = handleList(solveAt(S.t)).find((x) => x.actor === actor && x.name === name); return hd ? this.screenOf(hd.p) : null; },
  ringScreen(k, angleDeg) {
    const g = gizmoState;
    if (!g) return null;
    const ax = g.axes[k];
    const ref = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    const u = [ax[1] * ref[2] - ax[2] * ref[1], ax[2] * ref[0] - ax[0] * ref[2], ax[0] * ref[1] - ax[1] * ref[0]];
    const ul = Math.hypot(...u); const uu = u.map((x) => x / ul);
    const v = [ax[1] * uu[2] - ax[2] * uu[1], ax[2] * uu[0] - ax[0] * uu[2], ax[0] * uu[1] - ax[1] * uu[0]];
    const s = Math.max(0.05, view.camDistanceTo(g.p) * 0.11), a = angleDeg * DEG;
    return this.screenOf(g.p.map((x, i) => x + s * (Math.cos(a) * uu[i] + Math.sin(a) * v[i])));
  },
  gizmo: () => gizmoState,
  // Contact sheet of the current document: cols x rows frames over the clip from one camera
  // preset (panels hidden), returned as a PNG data URL. Used by tools/contact-sheets.mjs.
  async contactSheet({ cols = 4, rows = 2, cam = 'side', width = 360, height = 300, t0 = 0, t1 = null } = {}) {
    const app = document.getElementById('app');
    app.classList.add('sheet');
    view.resize();
    const out = document.createElement('canvas');
    out.width = cols * width; out.height = rows * height;
    const g = out.getContext('2d');
    g.fillStyle = '#20232a'; g.fillRect(0, 0, out.width, out.height);
    const n = cols * rows, T1 = t1 ?? S.doc.duration;
    for (let i = 0; i < n; i++) {
      const tt = t0 + (T1 - t0) * (n > 1 ? i / (n - 1) : 0);
      S.t = tt; S.selBone = null; S.selHandle = null;
      camPreset(cam);
      const sols = solveAt(tt);
      for (const id of ACTORS()) view.updateActor(id, sols[id], null);
      view.setHandles([]); view.hideGizmo();
      view.render();
      const c = view.renderer.domElement;
      const s = Math.min(width / c.width, height / c.height);
      g.drawImage(c, (i % cols) * width + (width - c.width * s) / 2, Math.floor(i / cols) * height + (height - c.height * s) / 2, c.width * s, c.height * s);
      g.fillStyle = '#ffffff'; g.font = '16px sans-serif'; g.fillText(`${tt.toFixed(2)} s`, (i % cols) * width + 8, Math.floor(i / cols) * height + 20);
    }
    app.classList.remove('sheet');
    view.resize();
    return out.toDataURL('image/png');
  },
  openDocument(doc, name) { openDoc(doc, name); },
  running: () => running,
};
