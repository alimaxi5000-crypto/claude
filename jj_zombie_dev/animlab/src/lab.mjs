// jj_zombie animation lab. Plays the solved source frames AND the produced .ycd files (decoded
// with the independent reader) on the same skeletons the build used, measures them live and
// exports alignment data and contact sheets. Bundled by tools/build-lab.mjs into lab.bundle.js.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Skeleton } from '../../tools/animcore/skeleton.mjs';
import { solFromLocals } from '../../tools/animcore/scene.mjs';
import { parseYcd, joaatLower } from '../../tools/animcore/ycdreader.mjs';
import { measureActor, measureScene, capsulesOf, DEFAULT_LIMITS } from '../../tools/animcore/metrics.mjs';
import { qslerp, vlerp, qaxis, qmul, qnorm, qrot, vadd, DEG } from '../../tools/animcore/math.mjs';

const FPS = 30;
const DATA = window.JJZ_BUILD;
const $ = (s) => document.querySelector(s);
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
  }
  for (const c of kids) e.append(c);
  return e;
};

if (!DATA) {
  document.body.innerHTML = '<div class="nodata"><h1>Keine Build-Daten</h1><p>Erst <code>node tools/build-anims.mjs</code> im Ordner <code>jj_zombie_dev</code> ausführen, dann diese Seite neu laden.</p></div>';
  throw new Error('no build data');
}

// ------------------------------------------------------------------ data
const skeletons = {};
for (const [k, j] of Object.entries(DATA.skeletons)) skeletons[k] = new Skeleton(j);

function b64ToBytes(b64) {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

// Source frames: { local: Map(boneIndex->quat), rootT, mover }
const srcCache = new Map();
function sourceFrames(clipName) {
  if (srcCache.has(clipName)) return srcCache.get(clipName);
  const c = DATA.clips[clipName];
  const skel = skeletons[c.skeletonKey];
  const f32 = new Float32Array(b64ToBytes(c.data).buffer);
  const idx = c.bones.map((b) => skel.idx(b));
  const frames = [];
  for (let f = 0; f < c.frames; f++) {
    let o = f * c.stride;
    const local = [];
    for (const i of idx) { local[i] = [f32[o], f32[o + 1], f32[o + 2], f32[o + 3]]; o += 4; }
    const rootT = [f32[o], f32[o + 1], f32[o + 2]]; o += 3;
    const mp = [f32[o], f32[o + 1], f32[o + 2]]; o += 3;
    const mq = [f32[o], f32[o + 1], f32[o + 2], f32[o + 3]];
    frames.push({ local, rootT, mover: { p: mp, q: mq } });
  }
  srcCache.set(clipName, frames);
  return frames;
}

// .ycd frames decoded by the independent reader.
const ycdCache = new Map();
async function inflateRaw(u8) {
  const ds = new DecompressionStream('deflate-raw');
  const stream = new Blob([u8]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
async function loadDict(dict) {
  if (ycdCache.has(dict)) return ycdCache.get(dict);
  const bytes = b64ToBytes(DATA.ycd[dict]);
  const inflated = await inflateRaw(bytes.subarray(16));
  const parsed = parseYcd(bytes, () => inflated);
  ycdCache.set(dict, parsed);
  return parsed;
}
async function ycdFrames(clipName) {
  const key = 'ycd:' + clipName;
  if (srcCache.has(key)) return srcCache.get(key);
  const c = DATA.clips[clipName];
  const skel = skeletons[c.skeletonKey];
  const parsed = await loadDict(c.dict);
  const clip = parsed.clips.find((x) => x.hash === joaatLower(clipName));
  if (!clip?.anim) throw new Error(`clip ${clipName} not found in ${c.dict}.ycd`);
  const a = clip.anim;
  const frames = [];
  for (let f = 0; f < a.frames; f++) {
    const local = [];
    let rootT = null, mp = [0, 0, 0], mq = [0, 0, 0, 1];
    for (const t of a.tracks) {
      const v = t.values[f];
      if (t.track === 1) { const b = skel.byTag.get(t.boneId); if (b) local[b.index] = v; }
      else if (t.track === 0 && t.boneId === 0) rootT = v;
      else if (t.track === 5) mp = v;
      else if (t.track === 6) mq = v;
    }
    frames.push({ local, rootT, mover: { p: mp, q: mq } });
  }
  srcCache.set(key, frames);
  return frames;
}

// ------------------------------------------------------------------ state
const state = {
  sceneName: null, variant: null, source: 'src', t: 0, playing: true, speed: 1, loop: true,
  show: { capsules: true, names: false, trails: true, axes: true, seam: false, joints: true, follow: true },
  align: {}, // actor -> {dx,dy,dz,dyaw}
  camera: 'orbit', sequence: null,
};
const sceneGroups = {};
for (const s of DATA.scenes) (sceneGroups[s.name] ||= []).push(s);

// Current playback: list of segments [{ scene, start, frames: {actor: frames[]} }]
let playback = null;

async function buildPlayback() {
  const segs = [];
  const list = state.sequence ? state.sequence : [{ key: currentScene().key, repeat: 1 }];
  let start = 0;
  for (const item of list) {
    const scene = DATA.scenes.find((s) => s.key === item.key);
    if (!scene) continue;
    for (let r = 0; r < (item.repeat || 1); r++) {
      const frames = {};
      for (const [actor, clip] of Object.entries(scene.actors)) {
        frames[actor] = state.source === 'ycd' ? await ycdFrames(clip) : sourceFrames(clip);
      }
      segs.push({ scene, start, frames, duration: scene.duration });
      start += scene.duration;
    }
  }
  playback = { segs, duration: start, actors: [...new Set(segs.flatMap((s) => Object.keys(s.frames)))] };
  state.t = Math.min(state.t, playback.duration);
  rebuildActors();
  computeLive();
  drawTimeline();
}
function currentScene() {
  const g = sceneGroups[state.sceneName];
  return g.find((s) => s.variant === state.variant) || g[0];
}

// Evaluate one actor at playback time t -> solved frame (scene space).
function evalActor(actor, t) {
  const seg = playback.segs.find((s) => t >= s.start && t <= s.start + s.duration + 1e-6) || playback.segs[playback.segs.length - 1];
  const frames = seg.frames[actor];
  if (!frames) return null;
  const clip = DATA.clips[seg.scene.actors[actor]];
  const skel = skeletons[clip.skeletonKey];
  const ft = Math.max(0, Math.min(frames.length - 1, (t - seg.start) * FPS));
  const f0 = Math.floor(ft), f1 = Math.min(frames.length - 1, f0 + 1), u = ft - f0;
  const A = frames[f0], B = frames[f1];
  const local = [];
  for (let i = 0; i < skel.bones.length; i++) {
    if (A.local[i]) local[i] = u > 0 ? qslerp(A.local[i], B.local[i], u) : A.local[i];
  }
  const rootT = A.rootT ? (u > 0 ? vlerp(A.rootT, B.rootT, u) : A.rootT) : null;
  const mover = { p: vlerp(A.mover.p, B.mover.p, u), q: qslerp(A.mover.q, B.mover.q, u) };
  const al = state.align[actor];
  if (al) {
    mover.p = vadd(mover.p, [al.dx || 0, al.dy || 0, al.dz || 0]);
    mover.q = qnorm(qmul(qaxis([0, 0, 1], (al.dyaw || 0) * DEG), mover.q));
  }
  return { sol: solFromLocals(skel, local, rootT, mover), skel, seg };
}

// ------------------------------------------------------------------ three.js scene
const view = $('#view');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.shadowMap.enabled = true;
view.append(renderer.domElement);
const scene3 = new THREE.Scene();
scene3.background = new THREE.Color(0x1b1d22);
// GTA space is Z-up; three.js is Y-up. Root group converts (x, y, z) -> (x, z, -y).
const world = new THREE.Group();
world.rotation.x = -Math.PI / 2;
scene3.add(world);
const camera = new THREE.PerspectiveCamera(40, 1, 0.02, 100);
camera.position.set(2.4, 1.2, 2.6);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.0, 0);
controls.enableDamping = true;
scene3.add(new THREE.HemisphereLight(0xdfe8ff, 0x30302c, 1.1));
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(2.5, 5, 3);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -3; sun.shadow.camera.right = 3; sun.shadow.camera.top = 3; sun.shadow.camera.bottom = -3;
scene3.add(sun);
const groundZ = -0.993;
const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.95 }));
floor.position.z = groundZ - 0.001;
floor.receiveShadow = true;
world.add(floor);
const grid = new THREE.GridHelper(14, 28, 0x4a505c, 0x343842);
grid.rotation.x = Math.PI / 2;
grid.position.z = groundZ;
world.add(grid);
const axes = new THREE.AxesHelper(0.5);
axes.position.z = groundZ + 0.002;
world.add(axes);

const ACTOR_COLORS = { victim: 0x5b8def, zombie: 0x7fb069, ped: 0xd0a85c };
const actorVis = {};

function makeActorVisual(actor) {
  const color = ACTOR_COLORS[actor] ?? 0xcccccc;
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05 });
  const capMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6, transparent: true, opacity: 0.32, depthWrite: false });
  const jointMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const vis = { group: g, segs: [], caps: {}, joints: [], labels: [], trail: null, color };
  const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 10, 1);
  unitCyl.rotateX(Math.PI / 2); // cylinder along Z
  vis.unitCyl = unitCyl;
  vis.mat = mat; vis.capMat = capMat; vis.jointMat = jointMat;
  world.add(g);
  return vis;
}

function rebuildActors() {
  for (const v of Object.values(actorVis)) world.remove(v.group);
  for (const k of Object.keys(actorVis)) delete actorVis[k];
  for (const actor of playback.actors) {
    const vis = makeActorVisual(actor);
    const seg = playback.segs.find((s) => s.frames[actor]);
    const skel = skeletons[DATA.clips[seg.scene.actors[actor]].skeletonKey];
    vis.skel = skel;
    // Thin segments for every SKEL bone with a SKEL parent (fingers included).
    for (const b of skel.bones) {
      if (b.parent < 0 || !b.name.startsWith('SKEL_')) continue;
      const pn = skel.bones[b.parent].name;
      if (!pn.startsWith('SKEL_') || pn === 'SKEL_ROOT') continue;
      const finger = b.name.includes('Finger');
      const m = new THREE.Mesh(vis.unitCyl, vis.mat);
      m.castShadow = true;
      m.userData = { a: b.parent, b: b.index, r: finger ? 0.006 : 0.016 };
      vis.group.add(m);
      vis.segs.push(m);
      if (!finger) {
        const j = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), vis.jointMat);
        j.userData = { i: b.index };
        vis.group.add(j);
        vis.joints.push(j);
      }
    }
    // Body volume capsules (same as the metrics); bone lengths are constant, so the geometry
    // is built once from the first frame.
    const first = evalActor(actor, seg.start);
    const caps0 = capsulesOf(skel, first.sol);
    for (const [k, c] of Object.entries(caps0)) {
      const len = Math.hypot(c.b[0] - c.a[0], c.b[1] - c.a[1], c.b[2] - c.a[2]);
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(c.r, len, 6, 14), vis.capMat);
      m.userData.k = k;
      vis.group.add(m);
      vis.caps[k] = m;
    }
    // Mover trail.
    const pts = [];
    for (let t = 0; t <= playback.duration; t += 1 / FPS) { const e = evalActor(actor, t); if (e) pts.push(new THREE.Vector3(...e.sol.mover.p).setZ(groundZ + 0.004)); }
    vis.trail = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: vis.color }));
    world.add(vis.trail);
    vis.ghost = null;
    actorVis[actor] = vis;
  }
}

const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), up = new THREE.Vector3(0, 0, 1);
function placeSegment(mesh, a, b, r) {
  tmpA.set(...a); tmpB.set(...b);
  const len = tmpA.distanceTo(tmpB);
  mesh.position.copy(tmpA).add(tmpB).multiplyScalar(0.5);
  mesh.scale.set(r, r, Math.max(len, 1e-4));
  const dir = tmpB.sub(tmpA).normalize();
  mesh.quaternion.setFromUnitVectors(up, dir);
}
function placeCapsule(mesh, a, b) {
  tmpA.set(...a); tmpB.set(...b);
  mesh.position.copy(tmpA).add(tmpB).multiplyScalar(0.5);
  const dir = tmpB.sub(tmpA).normalize();
  mesh.quaternion.setFromUnitVectors(Y_AXIS, dir);
}
const Y_AXIS = new THREE.Vector3(0, 1, 0);

// Follow mode: keep the first actor's mover centred (locomotion clips walk out of frame
// otherwise). The ground grid moves instead, which also shows the speed.
function applyFollow(t) {
  world.position.set(0, 0, 0);
  if (!state.show.follow || !playback) return;
  const a = playback.actors[0];
  const e = evalActor(a, t);
  if (!e) return;
  world.position.set(-e.sol.mover.p[0], 0, e.sol.mover.p[1]);
}

let lastPoses = {};
function updateActors(t) {
  applyFollow(t);
  lastPoses = {};
  for (const [actor, vis] of Object.entries(actorVis)) {
    const e = evalActor(actor, t);
    if (!e) { vis.group.visible = false; continue; }
    vis.group.visible = true;
    lastPoses[actor] = e;
    const P = e.sol.world.P;
    for (const m of vis.segs) placeSegment(m, P[m.userData.a], P[m.userData.b], m.userData.r);
    for (const j of vis.joints) j.position.set(...P[j.userData.i]);
    const caps = capsulesOf(e.skel, e.sol);
    for (const [k, m] of Object.entries(vis.caps)) {
      const c = caps[k];
      m.visible = state.show.capsules && !!c;
      if (c) placeCapsule(m, c.a, c.b);
    }
    for (const j of vis.joints) j.visible = state.show.joints;
    vis.trail.visible = state.show.trails;
  }
  axes.visible = state.show.axes;
  updateLabels();
  updateHud(t);
}

// Bone name labels (HTML overlay).
const labelLayer = $('#labels');
function updateLabels() {
  labelLayer.innerHTML = '';
  if (!state.show.names) return;
  const v = new THREE.Vector3();
  const rect = renderer.domElement.getBoundingClientRect();
  for (const [actor, e] of Object.entries(lastPoses)) {
    for (const b of e.skel.bones) {
      if (!b.name.startsWith('SKEL_') || b.name.includes('Finger')) continue;
      const p = e.sol.world.P[b.index];
      v.set(p[0], p[2], -p[1]).project(camera);
      if (v.z > 1) continue;
      const x = (v.x * 0.5 + 0.5) * rect.width, y = (-v.y * 0.5 + 0.5) * rect.height;
      labelLayer.append(el('span', { class: 'blabel', style: `left:${x}px;top:${y}px` }, b.name.replace('SKEL_', '')));
    }
  }
}

function resize() {
  const r = view.getBoundingClientRect();
  renderer.setSize(r.width, r.height, false);
  camera.aspect = r.width / Math.max(1, r.height);
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', () => { resize(); drawTimeline(); });

// Camera presets around the scene origin (three space: x right, y up, z = -gtaY).
const CAMS = {
  front: { pos: [0.0, 0.05, -3.9], target: [0, -0.12, -0.3] },
  side: { pos: [3.7, 0.05, -0.35], target: [0, -0.12, -0.35] },
  back: { pos: [0.0, 0.2, 3.3], target: [0, -0.12, -0.3] },
  top: { pos: [0.001, 4.2, -0.35], target: [0, -0.9, -0.35] },
  shoulder: { pos: [0.55, 0.62, 1.0], target: [0, 0.15, -0.7] },
  wide: { pos: [3.4, 1.5, -3.8], target: [0, -0.3, -0.4] },
  close: { pos: [1.35, 0.45, -1.45], target: [0, 0.25, -0.3] },
};
function setCamera(name) {
  state.camera = name;
  const c = CAMS[name];
  if (!c) return;
  camera.position.set(...c.pos);
  controls.target.set(...c.target);
  controls.update();
}

// ------------------------------------------------------------------ live metrics
let live = null;
function computeLive() {
  if (!playback) return;
  live = { actors: {}, scene: null };
  const n = Math.round(playback.duration * FPS) + 1;
  const sampled = { actors: playback.actors, skeletons: {}, frames: {}, nFrames: n };
  for (const actor of playback.actors) {
    const frames = [];
    let skel = null;
    for (let f = 0; f < n; f++) { const e = evalActor(actor, f / FPS); skel = e.skel; frames.push(e.sol); }
    sampled.skeletons[actor] = skel;
    sampled.frames[actor] = frames;
    const scene = playback.segs[0].scene;
    live.actors[actor] = measureActor(skel, frames, { loop: playback.segs.length === 1 && scene.loop, noGround: false });
  }
  if (playback.actors.length > 1) live.scene = measureScene(sampled, {});
  renderMetrics();
}

// ------------------------------------------------------------------ UI
function renderLeft() {
  const left = $('#left');
  left.innerHTML = '';
  left.append(el('h2', {}, 'Clips & Szenen'));
  const list = el('div', { class: 'list' });
  for (const [name, group] of Object.entries(sceneGroups)) {
    const item = el('button', { class: 'item' + (name === state.sceneName && !state.sequence ? ' on' : ''), onclick: () => { state.sequence = null; state.sceneName = name; state.variant = group[0].variant; state.t = 0; state.align = {}; refresh(); } },
      el('b', {}, name), el('small', {}, `${group.length} Variante(n) · ${group[0].duration.toFixed(2)} s${group[0].loop ? ' · Schleife' : ''}`));
    list.append(item);
  }
  left.append(list);
  const g = sceneGroups[state.sceneName];
  if (g && g.length > 1 && !state.sequence) {
    left.append(el('h3', {}, 'Variante'));
    const sel = el('select', { onchange: (e) => { state.variant = e.target.value; refresh(); } });
    for (const s of g) { const o = el('option', { value: s.variant }, s.variant || '(Standard)'); if (s.variant === state.variant) o.selected = true; sel.append(o); }
    left.append(sel);
  }
  if (DATA.sequences?.length) {
    left.append(el('h3', {}, 'Sequenzen'));
    for (const seq of DATA.sequences) {
      left.append(el('button', { class: 'item' + (state.sequence === seq.items ? ' on' : ''), onclick: () => { state.sequence = seq.items; state.t = 0; refresh(); } }, el('b', {}, seq.name), el('small', {}, seq.items.map((i) => i.key + (i.repeat > 1 ? '×' + i.repeat : '')).join(' → '))));
    }
  }
  left.append(el('h3', {}, 'Datenquelle'));
  const src = el('div', { class: 'seg' });
  for (const [k, label] of [['src', 'Quelle'], ['ycd', '.ycd (Spiel)']]) {
    src.append(el('button', { class: state.source === k ? 'on' : '', onclick: async () => { state.source = k; await buildPlayback(); renderLeft(); } }, label));
  }
  left.append(src);
  left.append(el('p', { class: 'hint' }, state.source === 'ycd' ? 'Zeigt exakt die Bytes aus stream/*.ycd, dekodiert mit dem unabhängigen Leser.' : 'Zeigt die gelösten Quelldaten (vor dem YCD-Export).'));
  left.append(el('h3', {}, 'Skelette'));
  for (const [k, s] of Object.entries(skeletons)) left.append(el('div', { class: 'kv' }, el('span', {}, k), el('span', {}, `${s.source.split('@')[0]} · ${s.height().toFixed(2)} m`)));
}

function renderMetrics() {
  const box = $('#metrics');
  box.innerHTML = '';
  const row = (k, v) => el('tr', { class: v.pass ? 'ok' : 'bad' }, el('td', {}, k), el('td', {}, String(v.value)), el('td', {}, v.limit == null ? '' : '≤ ' + v.limit), el('td', { class: 'det' }, v.frame >= 0 ? `f${v.frame} ${v.detail || ''}` : ''));
  for (const [actor, m] of Object.entries(live?.actors || {})) {
    box.append(el('h3', {}, `${actor} ${m.ok ? '✓' : '✗'}`));
    const tb = el('table');
    for (const [k, v] of Object.entries(m.items)) tb.append(row(k, v));
    box.append(tb);
  }
  if (live?.scene) {
    box.append(el('h3', {}, `Szene ${live.scene.ok ? '✓' : '✗'}`));
    const tb = el('table');
    for (const [k, v] of Object.entries(live.scene.items)) tb.append(row(k, v));
    box.append(tb);
  }
  const sc = playback?.segs[0]?.scene;
  if (sc?.sceneMetrics?.contacts?.length) {
    box.append(el('h3', {}, 'Kontakte (Build)'));
    const tb = el('table');
    for (const c of sc.sceneMetrics.contacts) tb.append(row(c.detail, c));
    box.append(tb);
  }
}

function renderAlign() {
  const box = $('#align');
  box.innerHTML = '';
  if (!playback) return;
  for (const actor of playback.actors) {
    const a = (state.align[actor] ||= { dx: 0, dy: 0, dz: 0, dyaw: 0 });
    box.append(el('h3', {}, actor));
    for (const [k, min, max, step, unit] of [['dx', -0.3, 0.3, 0.005, 'm'], ['dy', -0.3, 0.3, 0.005, 'm'], ['dz', -0.15, 0.15, 0.005, 'm'], ['dyaw', -30, 30, 0.5, '°']]) {
      const out = el('output', {}, `${a[k]}${unit}`);
      const inp = el('input', { type: 'range', min, max, step, value: a[k], oninput: (e) => { a[k] = +e.target.value; out.textContent = `${a[k]}${unit}`; updateActors(state.t); }, onchange: () => computeLive() });
      box.append(el('label', { class: 'slider' }, el('span', {}, k), inp, out));
    }
  }
  box.append(el('div', { class: 'row' },
    el('button', { onclick: () => { state.align = {}; renderAlign(); computeLive(); updateActors(state.t); } }, 'Zurücksetzen'),
    el('button', { onclick: exportAlign }, 'Export JSON + Lua')));
}

function exportAlign() {
  const sc = playback.segs[0].scene;
  const json = { scene: sc.name, variant: sc.variant, offsets: state.align };
  const lua = `-- jj_zombie alignment export (${new Date().toISOString()})\n-- Paste into jj_zombie_dev/anims-src/align.json via the build, or send to the developer.\nreturn ${JSON.stringify(json, null, 2).replace(/"(\w+)":/g, '$1 =').replace(/\[/g, '{').replace(/\]/g, '}')}\n`;
  download(`align_${sc.name}_${sc.variant || 'default'}.json`, JSON.stringify(json, null, 2));
  download(`align_${sc.name}_${sc.variant || 'default'}.lua`, lua);
}
function download(name, text) {
  const a = el('a', { href: URL.createObjectURL(new Blob([text], { type: 'text/plain' })), download: name });
  document.body.append(a); a.click(); a.remove();
}

// Timeline with event markers.
const tl = $('#tl');
function drawTimeline() {
  if (!playback) return;
  const r = tl.getBoundingClientRect();
  tl.width = r.width * devicePixelRatio; tl.height = r.height * devicePixelRatio;
  const g = tl.getContext('2d');
  g.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  g.clearRect(0, 0, r.width, r.height);
  const W = r.width - 20, X0 = 10;
  const x = (t) => X0 + (t / playback.duration) * W;
  g.fillStyle = '#23262d'; g.fillRect(X0, 18, W, r.height - 26);
  for (const s of playback.segs) {
    g.fillStyle = s.scene.loop ? '#2f4a3a' : '#2e3a52';
    g.fillRect(x(s.start) + 1, 18, x(s.start + s.duration) - x(s.start) - 2, 14);
    g.fillStyle = '#c7cbd3'; g.font = '11px system-ui';
    g.fillText(s.scene.key.replace(':', ' '), x(s.start) + 4, 29);
    for (const ev of s.scene.events || []) {
      const ex = x(s.start + ev.t);
      g.strokeStyle = '#ff6b5b'; g.beginPath(); g.moveTo(ex, 34); g.lineTo(ex, r.height - 8); g.stroke();
      g.fillStyle = '#ff9d8f'; g.fillText(ev.name, ex + 3, r.height - 10);
    }
  }
  g.strokeStyle = '#4d5462';
  for (let t = 0; t <= playback.duration + 1e-6; t += 0.1) {
    const xx = x(t); g.beginPath(); g.moveTo(xx, 12); g.lineTo(xx, Math.abs(t - Math.round(t)) < 1e-6 ? 2 : 8); g.stroke();
  }
  g.fillStyle = '#ffd34d'; g.fillRect(x(state.t) - 1, 0, 2, r.height);
}
let dragging = false;
const scrub = (e) => {
  const r = tl.getBoundingClientRect();
  state.t = Math.max(0, Math.min(playback.duration, ((e.clientX - r.left - 10) / (r.width - 20)) * playback.duration));
  state.playing = false;
  syncButtons();
};
tl.addEventListener('pointerdown', (e) => { dragging = true; scrub(e); });
window.addEventListener('pointermove', (e) => { if (dragging) scrub(e); });
window.addEventListener('pointerup', () => { dragging = false; });

function updateHud(t) {
  const f = Math.round(t * FPS);
  $('#hud').textContent = `${state.sequence ? 'Sequenz' : currentScene().key}  ·  ${t.toFixed(3)} s  ·  Frame ${f}  ·  ${state.source === 'ycd' ? 'YCD' : 'Quelle'}  ·  ${state.speed}×`;
}

function syncButtons() {
  $('#play').textContent = state.playing ? '❚❚' : '▶';
  for (const b of document.querySelectorAll('[data-toggle]')) b.classList.toggle('on', state.show[b.dataset.toggle]);
  for (const b of document.querySelectorAll('[data-cam]')) b.classList.toggle('on', state.camera === b.dataset.cam);
}

function bindToolbar() {
  $('#play').onclick = () => { state.playing = !state.playing; syncButtons(); };
  $('#prev').onclick = () => { state.playing = false; state.t = Math.max(0, state.t - 1 / FPS); syncButtons(); };
  $('#next').onclick = () => { state.playing = false; state.t = Math.min(playback.duration, state.t + 1 / FPS); syncButtons(); };
  $('#speed').onchange = (e) => { state.speed = +e.target.value; };
  for (const b of document.querySelectorAll('[data-toggle]')) b.onclick = () => { state.show[b.dataset.toggle] = !state.show[b.dataset.toggle]; syncButtons(); updateActors(state.t); };
  for (const b of document.querySelectorAll('[data-cam]')) b.onclick = () => { setCamera(b.dataset.cam); syncButtons(); };
  $('#shot').onclick = () => download2png(renderer.domElement.toDataURL('image/png'), `jjz_${Date.now()}.png`);
  $('#sheet').onclick = async () => download2png(await contactSheet({}), `jjz_sheet_${Date.now()}.png`);
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.code === 'Space') { state.playing = !state.playing; syncButtons(); e.preventDefault(); }
    if (e.code === 'ArrowLeft') $('#prev').click();
    if (e.code === 'ArrowRight') $('#next').click();
  });
}
function download2png(url, name) {
  const a = el('a', { href: url, download: name }); document.body.append(a); a.click(); a.remove();
}

// ------------------------------------------------------------------ contact sheet
async function contactSheet({ cols = 4, rows = 3, cell = [480, 360], cameraName = null, t0 = 0, t1 = null } = {}) {
  const n = cols * rows;
  const end = t1 ?? playback.duration;
  const canvas = document.createElement('canvas');
  canvas.width = cols * cell[0]; canvas.height = rows * cell[1] + 28;
  const g = canvas.getContext('2d');
  g.fillStyle = '#111317'; g.fillRect(0, 0, canvas.width, canvas.height);
  const prevSize = renderer.getSize(new THREE.Vector2());
  const prevCam = state.camera;
  if (cameraName) setCamera(cameraName);
  renderer.setSize(cell[0], cell[1], false);
  camera.aspect = cell[0] / cell[1]; camera.updateProjectionMatrix();
  for (let i = 0; i < n; i++) {
    const t = t0 + (end - t0) * (n === 1 ? 0 : i / (n - 1));
    updateActors(t);
    renderer.render(scene3, camera);
    const cx = (i % cols) * cell[0], cy = Math.floor(i / cols) * cell[1] + 28;
    g.drawImage(renderer.domElement, cx, cy, cell[0], cell[1]);
    g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(cx, cy, 150, 20);
    g.fillStyle = '#fff'; g.font = '13px system-ui';
    g.fillText(`${t.toFixed(2)} s · f${Math.round(t * FPS)}`, cx + 6, cy + 14);
    const seg = playback.segs.find((s) => t >= s.start && t <= s.start + s.duration + 1e-6);
    const near = (seg?.scene.events || []).filter((ev) => Math.abs(seg.start + ev.t - t) < (end - t0) / n / 2);
    if (near.length) { g.fillStyle = '#ff7b6b'; g.fillText(near.map((e) => e.name).join(', '), cx + 6, cy + cell[1] - 8); }
    g.strokeStyle = '#000'; g.strokeRect(cx + 0.5, cy + 0.5, cell[0] - 1, cell[1] - 1);
  }
  g.fillStyle = '#e8e8e8'; g.font = 'bold 15px system-ui';
  g.fillText(`${state.sequence ? 'Sequenz' : currentScene().key.replace(/:$/, '')} · ${state.source === 'ycd' ? '.ycd' : 'Quelle'} · Kamera ${state.camera}`, 10, 19);
  renderer.setSize(prevSize.x, prevSize.y, false);
  resize();
  if (cameraName) setCamera(prevCam);
  updateActors(state.t);
  return canvas.toDataURL('image/png');
}

// ------------------------------------------------------------------ main loop
let lastTs = performance.now();
function frame(ts) {
  const dt = Math.min(0.1, (ts - lastTs) / 1000);
  lastTs = ts;
  if (playback && state.playing) {
    state.t += dt * state.speed;
    if (state.t > playback.duration) state.t = state.loop ? state.t % Math.max(1e-6, playback.duration) : playback.duration;
  }
  if (playback) { updateActors(state.t); drawTimeline(); }
  controls.update();
  renderer.render(scene3, camera);
  requestAnimationFrame(frame);
}

async function refresh() {
  renderLeft();
  await buildPlayback();
  renderAlign();
}

// Automation API (used by tools/lab-capture.mjs through a headless browser).
window.JJZ_LAB = {
  async select({ scene, variant = null, source = 'src', sequence = null }) {
    state.sequence = sequence ? DATA.sequences.find((s) => s.name === sequence)?.items ?? null : null;
    if (scene) { state.sceneName = scene; state.variant = variant ?? sceneGroups[scene][0].variant; }
    state.source = source;
    state.playing = false;
    state.t = 0;
    await refresh();
    return { duration: playback.duration, actors: playback.actors };
  },
  contactSheet,
  setCamera,
  setShow(k, v) { state.show[k] = v; updateActors(state.t); },
  setTime(t) { state.t = t; updateActors(t); renderer.render(scene3, camera); },
  live: () => live,
  scenes: () => DATA.scenes.map((s) => s.key),
  sequences: () => (DATA.sequences || []).map((s) => s.name),
  limits: DEFAULT_LIMITS,
};

state.sceneName = Object.keys(sceneGroups)[0];
state.variant = sceneGroups[state.sceneName][0].variant;
bindToolbar();
resize();
setCamera('wide');
syncButtons();
refresh().then(() => requestAnimationFrame(frame));
if (DATA.problems?.length) {
  $('#problems').innerHTML = `<b>${DATA.problems.length} Build-Problem(e):</b><br>` + DATA.problems.map((p) => p.replace(/</g, '&lt;')).join('<br>');
  $('#problems').hidden = false;
}
