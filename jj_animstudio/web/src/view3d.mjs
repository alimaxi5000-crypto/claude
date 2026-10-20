// 3D view: three.js overlay over the game picture. All positions are in the studio's scene frame
// (GTA axes: +X right, +Y forward, +Z up; origin = actor a's entity when the studio opened).
// The view owns the camera state and is the SOURCE of the game camera (main.mjs sends it to Lua),
// so game picture and overlay use identical position, rotation and (vertical) field of view.
import * as THREE from 'three';
import { capsulesOf } from '../../../animkit/core/metrics.mjs';
import { jointBasis } from '../../../animkit/core/joints.mjs';
import { qmul, qnorm, qrot, DEG } from '../../../animkit/core/math.mjs';

const ACTOR_COLOR = { a: 0x4f9dff, b: 0xff9a3c };
const AXIS_COLOR = [0xff4d4d, 0x4dff6a, 0x4d8dff];
const HANDLE_COLOR = { hand: 0xffe14d, foot: 0x46e0c4, root: 0xff5ce1, look: 0xffffff, pole: 0xb388ff, mover: 0x9be15d };
const Z = new THREE.Vector3(0, 0, 1);
const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
const v3 = (p) => new THREE.Vector3(p[0], p[1], p[2]);

export function createView(el, { inGame, onCamera }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: !inGame });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setClearColor(0x000000, 0);
  el.append(renderer.domElement);
  const scene = new THREE.Scene();
  if (!inGame) scene.background = new THREE.Color(0x20232a);
  // GTA space is Z-up; the world group maps (x, y, z) -> three (x, z, -y).
  const world = new THREE.Group();
  world.rotation.x = -Math.PI / 2;
  scene.add(world);
  scene.add(new THREE.HemisphereLight(0xeef3ff, 0x404048, 1.4));
  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.set(2, 5, 3);
  scene.add(sun);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 200);

  // Ground helpers (always a faint grid; a solid floor only outside the game).
  const groundZ = -0.993;
  const grid = new THREE.GridHelper(8, 32, 0x7a8394, 0x4a505c);
  grid.rotation.x = Math.PI / 2; grid.position.z = groundZ + 0.001;
  grid.material.transparent = true; grid.material.opacity = inGame ? 0.25 : 0.6;
  world.add(grid);
  if (!inGame) {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: 0x2b2f37, roughness: 1 }));
    floor.position.z = groundZ - 0.002;
    world.add(floor);
  }

  // ---------------------------------------------------------------- camera state (scene frame)
  const cam = { target: [0, 0, 0.1], yaw: 180, pitch: -6, dist: 3.2, fov: 45 };
  const limits = { min: 0.4, max: 12 };
  function camPos() {
    const y = cam.yaw * DEG, p = cam.pitch * DEG;
    const dir = [-Math.sin(y) * Math.cos(p), Math.cos(y) * Math.cos(p), Math.sin(p)];
    return [cam.target[0] - dir[0] * cam.dist, cam.target[1] - dir[1] * cam.dist, cam.target[2] - dir[2] * cam.dist];
  }
  function applyCamera() {
    const p = camPos();
    camera.position.set(p[0], p[2], -p[1]);
    camera.up.set(0, 1, 0);
    camera.lookAt(cam.target[0], cam.target[2], -cam.target[1]);
    camera.fov = cam.fov;
    camera.updateProjectionMatrix();
    onCamera?.({ p, yaw: cam.yaw, pitch: cam.pitch, fov: cam.fov });
  }
  function setPreset(name, focus = [0, 0, 0.1]) {
    const P = { front: [180, -6, 3.2], side: [90, -6, 3.2], top: [180, -88, 4.2], shoulder: [0, -14, 1.3], back: [0, -6, 3.2] }[name];
    if (!P) return;
    cam.yaw = P[0]; cam.pitch = P[1]; cam.dist = P[2];
    cam.target = name === 'shoulder' ? [focus[0] + 0.35, focus[1] + 0.9, focus[2] + 0.35] : focus.slice();
    applyCamera();
  }
  function focusOn(p, dist = 1.2) { cam.target = p.slice(); cam.dist = Math.max(limits.min, dist); applyCamera(); }

  function resize() {
    const r = el.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / Math.max(1, r.height);
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  // ---------------------------------------------------------------- actor visuals
  const actors = {};
  const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 8, 1); unitCyl.rotateX(Math.PI / 2);
  const pickGeo = new THREE.SphereGeometry(1, 8, 6);
  function buildActor(id, skel) {
    if (actors[id]) { world.remove(actors[id].group); world.remove(actors[id].onion[0]); world.remove(actors[id].onion[1]); }
    const color = ACTOR_COLOR[id] ?? 0xcccccc;
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, depthTest: true });
    const selMat = new THREE.MeshStandardMaterial({ color: 0xffe14d, emissive: 0x554400, roughness: 0.4 });
    const capMat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, transparent: true, opacity: 0.22, depthWrite: false });
    const jointMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const pickMat = new THREE.MeshBasicMaterial({ visible: false });
    const vis = { id, skel, group: g, segs: [], joints: [], picks: [], caps: {}, mat, selMat, jointMat };
    for (const b of skel.bones) {
      if (b.parent < 0 || !b.name.startsWith('SKEL_')) continue;
      const pn = skel.bones[b.parent].name;
      const finger = b.name.includes('Finger');
      if (pn.startsWith('SKEL_') && pn !== 'SKEL_ROOT') {
        const m = new THREE.Mesh(unitCyl, mat);
        m.userData = { a: b.parent, b: b.index, r: finger ? 0.004 : 0.012 };
        g.add(m); vis.segs.push(m);
      }
      const j = new THREE.Mesh(pickGeo, jointMat);
      const jr = finger ? 0.006 : 0.018;
      j.scale.setScalar(jr);
      j.userData = { i: b.index, name: b.name, r: jr };
      g.add(j); vis.joints.push(j);
      const pk = new THREE.Mesh(pickGeo, pickMat);
      pk.scale.setScalar(finger ? 0.012 : 0.04);
      pk.userData = { pick: 'bone', actor: id, bone: b.name, i: b.index };
      g.add(pk); vis.picks.push(pk);
    }
    for (const k of ['torso', 'chest', 'neck', 'head', 'upperL', 'upperR', 'foreL', 'foreR', 'thighL', 'thighR', 'shinL', 'shinR']) {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(1, 1, 4, 12), capMat);
      m.userData.k = k; g.add(m); vis.caps[k] = m;
    }
    world.add(g);
    // Onion skins: previous / next key pose as line skeletons.
    vis.onion = [0x8fb3ff, 0xffc58f].map((c) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(skel.bones.length * 6), 3));
      const l = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.55 }));
      l.visible = false; world.add(l); return l;
    });
    actors[id] = vis;
    return vis;
  }
  function placeSeg(m, a, b, r) {
    tmpA.set(a[0], a[1], a[2]); tmpB.set(b[0], b[1], b[2]);
    const len = tmpA.distanceTo(tmpB);
    m.position.copy(tmpA).add(tmpB).multiplyScalar(0.5);
    m.scale.set(r, r, Math.max(len, 1e-4));
    m.quaternion.setFromUnitVectors(Z, tmpB.sub(tmpA).normalize());
  }
  const Yv = new THREE.Vector3(0, 1, 0);
  function placeCap(m, c) {
    tmpA.set(c.a[0], c.a[1], c.a[2]); tmpB.set(c.b[0], c.b[1], c.b[2]);
    const len = Math.max(1e-3, tmpA.distanceTo(tmpB));
    m.position.copy(tmpA).add(tmpB).multiplyScalar(0.5);
    // CapsuleGeometry(radius 1, length 1): scale radius in x/z, length along y.
    m.scale.set(c.r, (len + 2 * c.r) / 3, c.r);
    m.quaternion.setFromUnitVectors(Yv, tmpB.sub(tmpA).normalize());
  }
  function updateActor(id, sol, selBone) {
    const vis = actors[id];
    if (!vis) return;
    const P = sol.world.P;
    for (const m of vis.segs) placeSeg(m, P[m.userData.a], P[m.userData.b], m.userData.r);
    for (const j of vis.joints) { j.position.set(...P[j.userData.i]); j.material = j.userData.name === selBone ? vis.selMat : vis.jointMat; j.scale.setScalar(j.userData.name === selBone ? j.userData.r * 1.6 : j.userData.r); }
    for (const p of vis.picks) p.position.set(...P[p.userData.i]);
    const caps = capsulesOf(vis.skel, sol);
    for (const [k, m] of Object.entries(vis.caps)) { const c = caps[k]; m.visible = !!c && showBody; if (c) placeCap(m, c); }
  }
  function updateOnion(id, k, sol) {
    const vis = actors[id];
    if (!vis) return;
    const line = vis.onion[k];
    if (!sol) { line.visible = false; return; }
    const arr = line.geometry.attributes.position.array;
    let o = 0;
    for (const b of vis.skel.bones) {
      if (b.parent < 0 || vis.skel.bones[b.parent].name === 'SKEL_ROOT') { arr.fill(0, o, o + 6); o += 6; continue; }
      const a = sol.world.P[b.parent], c = sol.world.P[b.index];
      arr[o++] = a[0]; arr[o++] = a[1]; arr[o++] = a[2]; arr[o++] = c[0]; arr[o++] = c[1]; arr[o++] = c[2];
    }
    line.geometry.attributes.position.needsUpdate = true;
    line.visible = true;
  }
  let showBody = true;

  // ---------------------------------------------------------------- gizmo (rotation rings)
  const gizmo = new THREE.Group();
  gizmo.visible = false;
  world.add(gizmo);
  const rings = [0, 1, 2].map((k) => {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.018, 8, 64), new THREE.MeshBasicMaterial({ color: AXIS_COLOR[k], depthTest: false, transparent: true, opacity: 0.9 }));
    const pick = new THREE.Mesh(new THREE.TorusGeometry(1, 0.09, 6, 48), new THREE.MeshBasicMaterial({ visible: false }));
    pick.userData = { pick: 'ring', k };
    const arc = new THREE.Mesh(new THREE.TorusGeometry(1, 0.045, 6, 48, Math.PI), new THREE.MeshBasicMaterial({ color: AXIS_COLOR[k], depthTest: false, transparent: true, opacity: 0.35 }));
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false }));
    marker.position.set(1, 0, 0);
    ring.renderOrder = arc.renderOrder = marker.renderOrder = 10;
    g.add(ring, pick, arc, marker);
    gizmo.add(g);
    return { g, ring, pick, arc, marker, k };
  });
  // axesWorld: unit axes (scene frame); rot: current values (deg); lim: [[min,max]x3] | null
  function showGizmo(pos, axesWorld, rot, lim, scale) {
    gizmo.visible = true;
    gizmo.position.set(pos[0], pos[1], pos[2]);
    gizmo.scale.setScalar(scale);
    for (const r of rings) {
      const ax = v3(axesWorld[r.k]).normalize();
      r.g.quaternion.setFromUnitVectors(Z, ax);
      if (lim) {
        const [mn, mx] = lim[r.k];
        const span = Math.max(1, mx - mn) * DEG;
        r.arc.geometry.dispose();
        r.arc.geometry = new THREE.TorusGeometry(1, 0.045, 6, 48, Math.min(span, Math.PI * 2));
        r.arc.rotation.z = (mn - rot[r.k]) * DEG;
        r.arc.visible = true;
      } else r.arc.visible = false;
    }
  }
  function hideGizmo() { gizmo.visible = false; }

  // ---------------------------------------------------------------- handles
  const handleGroup = new THREE.Group();
  world.add(handleGroup);
  const handles = new Map();      // key `${actor}.${name}` -> mesh
  function handleMesh(key, kind) {
    let m = handles.get(key);
    if (!m) {
      const geo = kind === 'mover' ? new THREE.TorusGeometry(0.28, 0.012, 6, 40) : new THREE.SphereGeometry(kind === 'pole' ? 0.022 : 0.035, 14, 10);
      m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: HANDLE_COLOR[kind], depthTest: false, transparent: true, opacity: 0.85 }));
      m.renderOrder = 11;
      const [actor, name] = key.split('.');
      m.userData = { pick: 'handle', actor, name, kind };
      handleGroup.add(m);
      handles.set(key, m);
    }
    return m;
  }
  // list: [{ actor, name, kind, p, active }]
  function setHandles(list) {
    const keep = new Set();
    for (const h of list) {
      const key = `${h.actor}.${h.name}`;
      keep.add(key);
      const m = handleMesh(key, h.kind);
      m.position.set(h.p[0], h.p[1], h.p[2]);
      m.material.opacity = h.active ? 1 : 0.55;
      m.scale.setScalar(h.selected ? 1.5 : 1);
      m.visible = true;
    }
    for (const [k, m] of handles) if (!keep.has(k)) m.visible = false;
  }

  // ---------------------------------------------------------------- contact / measure lines
  const lineGroup = new THREE.Group();
  world.add(lineGroup);
  function setLines(list) {     // [{ a, b, color }]
    while (lineGroup.children.length) { const c = lineGroup.children.pop(); c.geometry.dispose(); }
    for (const l of list) {
      const geo = new THREE.BufferGeometry().setFromPoints([v3(l.a), v3(l.b)]);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: l.color ?? 0xffffff, depthTest: false }));
      line.renderOrder = 12;
      lineGroup.add(line);
    }
  }

  // ---------------------------------------------------------------- picking / projection
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function rayAt(x, y) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    return ray;
  }
  function pick(x, y) {
    rayAt(x, y);
    if (gizmo.visible) {
      const hit = ray.intersectObjects(rings.map((r) => r.pick), false)[0];
      if (hit) return hit.object.userData;
    }
    const hh = ray.intersectObjects([...handles.values()].filter((m) => m.visible), false)[0];
    if (hh) return hh.object.userData;
    const picks = Object.values(actors).flatMap((a) => (a.group.visible ? a.picks : []));
    const hb = ray.intersectObjects(picks, false);
    if (hb.length) {
      // Prefer non-finger joints unless a finger is clearly closer.
      hb.sort((a, b) => a.distance - b.distance);
      return hb[0].object.userData;
    }
    return null;
  }
  const toGta = (v) => [v.x, -v.z, v.y];
  // Intersection of the mouse ray with a plane (scene frame point + normal).
  function planePoint(x, y, point, normal) {
    rayAt(x, y);
    const n = new THREE.Vector3(normal[0], normal[2], -normal[1]).normalize();
    const p = new THREE.Vector3(point[0], point[2], -point[1]);
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(n, p);
    const out = new THREE.Vector3();
    return ray.ray.intersectPlane(plane, out) ? toGta(out) : null;
  }
  function viewDir() {
    const y = cam.yaw * DEG, p = cam.pitch * DEG;
    return [-Math.sin(y) * Math.cos(p), Math.cos(y) * Math.cos(p), Math.sin(p)];
  }
  // Scene-frame point -> screen pixels relative to the view element ({x, y, behind}).
  function project(p) {
    const v = new THREE.Vector3(p[0], p[2], -p[1]).project(camera);
    const r = renderer.domElement.getBoundingClientRect();
    return { x: (v.x * 0.5 + 0.5) * r.width, y: (-v.y * 0.5 + 0.5) * r.height, behind: v.z > 1 };
  }
  function camDistanceTo(p) { const c = camPos(); return Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]); }

  // ---------------------------------------------------------------- mouse camera control
  let drag = null;
  const dom = renderer.domElement;
  dom.addEventListener('contextmenu', (e) => e.preventDefault());
  dom.addEventListener('wheel', (e) => {
    e.preventDefault();
    cam.dist = Math.min(limits.max, Math.max(limits.min, cam.dist * Math.pow(1.0015, e.deltaY)));
    applyCamera();
  }, { passive: false });
  const api = {
    renderer, camera, cam, limits, actors, setPreset, focusOn, applyCamera, resize, buildActor, updateActor, updateOnion,
    showGizmo, hideGizmo, setHandles, setLines, pick, planePoint, viewDir, project, camDistanceTo, rings,
    setBodyVisible(on) { showBody = on; }, setVisible(id, on) { if (actors[id]) actors[id].group.visible = on; },
    removeActor(id) { const a = actors[id]; if (!a) return; world.remove(a.group); a.onion.forEach((l) => world.remove(l)); delete actors[id]; },
    // Orbit / pan handlers used by main.mjs when no gizmo or handle is grabbed.
    beginOrbit(x, y, mode) { drag = { x, y, mode }; },
    moveOrbit(x, y) {
      if (!drag) return;
      const dx = x - drag.x, dy = y - drag.y;
      drag.x = x; drag.y = y;
      if (drag.mode === 'orbit') {
        cam.yaw = (cam.yaw - dx * 0.3 + 360) % 360;
        cam.pitch = Math.max(-89, Math.min(89, cam.pitch + dy * 0.25));
      } else {
        const y0 = cam.yaw * DEG;
        const right = [Math.cos(y0), Math.sin(y0), 0];
        const k = cam.dist * 0.0016;
        cam.target = [cam.target[0] - right[0] * dx * k, cam.target[1] - right[1] * dx * k, cam.target[2] + dy * k];
      }
      applyCamera();
    },
    endOrbit() { drag = null; },
    render() { renderer.render(scene, camera); },
    // World axes (scene frame) of a bone's joint basis for the gizmo: mover * Dparent * axis.
    boneAxes(skel, sol, bone) {
      const i = skel.idx(bone);
      const p = skel.bones[i].parent;
      const q = qnorm(qmul(sol.mover.q, p >= 0 ? sol.D[p] : [0, 0, 0, 1]));
      const b = jointBasis(skel, bone);
      return { axes: b.axes.map((a) => qrot(q, a)), basis: b };
    },
  };
  resize();
  applyCamera();
  return api;
}
