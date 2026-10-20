// Traffic-light checks ("Ampel") for clip documents: turns the metrics of a sampled document into
// a list of findings with German plain-text messages, the time to jump to and, where possible, a
// fix (see fixes.mjs). Used live in the studio NUI and by the converter/report, so both agree.

import { measureActor, measureScene, DEFAULT_LIMITS } from './metrics.mjs';
import { limitExcess } from './joints.mjs';
import { BODY } from './skeleton.mjs';
import { qmul, qnorm, qrot, vadd } from './math.mjs';

export const STUDIO_LIMITS = { contact: 0.03 };
const FPS = 30;
const cm = (m) => (m * 100).toFixed(1);
const f1 = (x) => (+x).toFixed(1);
const SIDE = { L: 'links', R: 'rechts' };
const PART = { heel: 'Ferse', toe: 'Ballen' };
const boneLabel = (b) => String(b || '').replace(/^SKEL_/, '').replace(/_/g, ' ');

// Measure a sampled document: { actors: {id: metrics}, scene: metrics | null }.
export function measureDocument(doc, sampled) {
  const limits = { ...STUDIO_LIMITS, ...(doc.limits || {}) };
  const actors = {};
  for (const id of sampled.actors) {
    actors[id] = measureActor(sampled.skeletons[id], sampled.frames[id], { loop: !!doc.loop, limits });
  }
  let scene = null;
  if (sampled.actors.length > 1 || (doc.contacts || []).length) {
    const { source } = sampled;
    // A declared contact means the touching limb may touch the other body (forearm on a
    // shoulder, shin against a leg): those capsule pairs do not count as interpenetration.
    const allowTouch = [];
    for (const c of doc.contacts || []) {
      const [fa, fh] = c.from.split('.'), [ta] = c.to.split('.');
      if (fa === ta) continue;
      const m = /^(hand|foot)([LR])$/.exec(fh);
      if (!m) continue;
      for (const cap of m[1] === 'hand' ? ['fore', 'upper'] : ['shin']) allowTouch.push([`${fa}.${cap}${m[2]}`, `${ta}.*`]);
    }
    scene = measureScene(sampled, { contacts: source?.contacts || [], limits, allowTouch });
  }
  return { actors, scene, limits: { ...DEFAULT_LIMITS, ...limits } };
}

// Window of frames around `frame` where the given foot contact point stays near the ground.
function plantedWindow(skel, frames, side, frame) {
  const ai = skel.idx(BODY.side[side].foot);
  const h = (f) => {
    const s = frames[f];
    const q = qnorm(qmul(s.mover.q, s.D[ai]));
    const heel = vadd(s.world.P[ai], qrot(q, [0, -0.05, -0.085]));
    return heel[2] - (skel.groundZ + s.mover.p[2]);
  };
  let a = frame, b = frame;
  while (a > 0 && h(a - 1) < 0.03) a--;
  while (b < frames.length - 1 && h(b + 1) < 0.03) b++;
  if (b - a < 3) { a = Math.max(0, frame - 6); b = Math.min(frames.length - 1, frame + 6); }
  return [+(a / FPS).toFixed(3), +(b / FPS).toFixed(3)];
}

// Findings: [{ id, category, level: 'ok'|'warn'|'error', title, text, value, limit, unit, t, actor, fix }]
export function evaluateChecks(doc, sampled, measured = measureDocument(doc, sampled)) {
  const out = [];
  const add = (x) => out.push({ fix: null, actor: null, t: null, ...x });
  const names = (id) => doc.actors[id]?.label || id;
  for (const id of sampled.actors) {
    const m = measured.actors[id].items;
    const skel = sampled.skeletons[id];
    const who = sampled.actors.length > 1 ? `${names(id)}: ` : '';
    const at = (it) => (it.frame >= 0 ? +(it.frame / FPS).toFixed(3) : null);
    // Foot slide.
    {
      const it = m.footSlide;
      const side = /^([LR])/.exec(it.detail)?.[1];
      const part = /(heel|toe)/.exec(it.detail)?.[1];
      const level = !it.pass ? 'error' : it.value > it.limit * 0.8 ? 'warn' : 'ok';
      add({
        id: `${id}.footSlide`, category: 'feet', level, actor: id, t: at(it), value: +it.value.toFixed(3), limit: it.limit, unit: 'm/s',
        title: 'Fußrutschen',
        text: level === 'ok' ? `${who}Die Füße stehen fest.` : `${who}Fuß ${SIDE[side] || ''} (${PART[part] || 'Fuß'}) rutscht mit ${it.value.toFixed(2)} m/s über den Boden (erlaubt ${it.limit} m/s).`,
        fix: level !== 'ok' && side ? { kind: 'lockFeet', actor: id, side, range: plantedWindow(skel, sampled.frames[id], side, Math.max(0, it.frame)), label: `Fuß ${SIDE[side]} festkleben` } : null,
      });
    }
    // Ground penetration.
    {
      const it = m.groundPen;
      const side = /^([LR])/.exec(it.detail)?.[1];
      const level = !it.pass ? 'error' : it.value > it.limit * 0.6 ? 'warn' : 'ok';
      add({
        id: `${id}.groundPen`, category: 'ground', level, actor: id, t: at(it), value: +it.value.toFixed(3), limit: it.limit, unit: 'm',
        title: 'Boden-Durchdringung',
        text: level === 'ok' ? `${who}Kein Fuß steckt im Boden.` : `${who}Fuß ${SIDE[side] || ''} steckt ${cm(it.value)} cm im Boden (erlaubt ${cm(it.limit)} cm).`,
        fix: level !== 'ok' && side ? { kind: 'snapGround', actor: id, side, t: at(it), depth: +it.value.toFixed(4), label: 'Auf den Boden setzen' } : null,
      });
    }
    // Joint limits: keyed rotations outside the joint range, plus solved-pose limits.
    {
      let worst = 0, wb = null, wt = null;
      for (const [b, keys] of Object.entries(doc.tracks[id]?.bones || {})) {
        if (!skel.has(b)) continue;
        for (const k of keys) { const e = limitExcess(skel, b, k.rot); if (e > worst) { worst = e; wb = b; wt = k.t; } }
      }
      const poseItems = ['elbowHyper', 'kneeHyper', 'neck', 'spineSeg', 'wrist', 'wristRoll'].map((k) => [k, m[k]]).filter(([, v]) => !v.pass);
      const level = worst > 0.5 || poseItems.length ? 'error' : 'ok';
      let text = `${who}Alle Gelenke im natürlichen Bereich.`;
      if (worst > 0.5) text = `${who}${boneLabel(wb)} ist ${f1(worst)}° über der Gelenkgrenze.`;
      else if (poseItems.length) {
        const [k, v] = poseItems[0];
        const what = { elbowHyper: 'Ellbogen überstreckt', kneeHyper: 'Knie überstreckt', neck: 'Kopf zu stark verdreht', spineSeg: 'Wirbelsäule zu stark gebogen', wrist: 'Handgelenk zu stark abgeknickt', wristRoll: 'Handgelenk zu stark verdreht' }[k];
        text = `${who}${what}: ${f1(v.value)}° (erlaubt ${v.limit}°, ${v.detail}).`;
        wt = at(v);
      }
      add({
        id: `${id}.joints`, category: 'joints', level, actor: id, t: wt, value: +(worst || (poseItems[0]?.[1].value ?? 0)).toFixed(2), limit: worst > 0.5 ? 0 : poseItems[0]?.[1].limit ?? null, unit: '°',
        title: 'Gelenkgrenzen', text,
        fix: worst > 0.5 ? { kind: 'clampJoints', actor: id, bone: wb, label: 'Winkel begrenzen' } : null,
      });
    }
    // Too fast rotations.
    {
      const it = m.angVel;
      const level = !it.pass ? 'error' : it.value > it.limit * 0.8 ? 'warn' : 'ok';
      add({
        id: `${id}.angVel`, category: 'speed', level, actor: id, t: at(it), value: Math.round(it.value), limit: it.limit, unit: '°/s',
        title: 'Zu schnelle Drehungen',
        text: level === 'ok' ? `${who}Alle Drehungen in normalem Tempo.` : `${who}${boneLabel(it.detail)} dreht sich mit ${Math.round(it.value)}°/s (höchstens ${it.limit}°/s). Keyframes weiter auseinander ziehen oder weichere Kurve wählen.`,
        fix: level !== 'ok' ? { kind: 'easeSmooth', actor: id, t: at(it), label: 'Kurven weich machen' } : null,
      });
    }
    // Arm inside own body (warning only: hands may touch the body on purpose).
    if (!m.selfPenetration.pass) {
      const it = m.selfPenetration;
      add({ id: `${id}.selfPen`, category: 'self', level: 'warn', actor: id, t: at(it), value: +it.value.toFixed(3), limit: it.limit, unit: 'm', title: 'Arm im eigenen Körper', text: `${who}${it.detail.replace('fore', 'Unterarm ').replace('vs', 'in')} (${cm(it.value)} cm). Gewollt? Sonst Arm etwas weiter weg.` });
    }
    if (!m.floatFeet.pass) {
      const it = m.floatFeet;
      add({ id: `${id}.floatFeet`, category: 'ground', level: 'warn', actor: id, t: at(it), value: +it.value.toFixed(3), limit: it.limit, unit: 'm', title: 'Beide Füße in der Luft', text: `${who}Beide Füße sind ${cm(it.value)} cm über dem Boden. Bei einem Sprung ist das richtig, sonst Becken absenken.` });
    }
    if (doc.loop) {
      const a = m.loopSeam, b = m.loopMover;
      const bad = !a.pass || !b.pass;
      add({
        id: `${id}.loop`, category: 'loop', level: bad ? 'error' : 'ok', actor: id, t: doc.duration, value: +a.value.toFixed(2), limit: a.limit, unit: '°', title: 'Loop-Naht',
        text: bad ? `${who}Ende und Anfang passen nicht zusammen (${!a.pass ? `${boneLabel(a.detail)} springt um ${f1(a.value)}°` : `Bewegung springt um ${cm(b.value)} cm`}).` : `${who}Ende = Anfang, die Naht ist sauber.`,
        fix: bad ? { kind: 'closeLoop', actor: id, label: 'Naht schließen' } : null,
      });
    }
  }
  const sc = measured.scene;
  if (sc) {
    if (sampled.actors.length > 1) {
      const it = sc.items.penetration;
      const level = !it.pass ? 'error' : it.value > it.limit * 0.7 ? 'warn' : 'ok';
      const other = sampled.actors[1];
      add({
        id: 'scene.penetration', category: 'actors', level, t: it.frame >= 0 ? +(it.frame / FPS).toFixed(3) : null, value: +it.value.toFixed(3), limit: it.limit, unit: 'm',
        title: 'Durchdringung zwischen Akteuren',
        text: level === 'ok' ? 'Die Akteure stecken nicht ineinander.' : `Die Körper stecken ${cm(it.value)} cm ineinander (${it.detail.replace(/\./g, ' ')}).`,
        fix: level === 'error' ? { kind: 'separate', actor: other, t: +(it.frame / FPS).toFixed(3), dist: +(it.value - it.limit + 0.01).toFixed(3), label: `${names(other)} wegschieben` } : null,
      });
    }
    (sc.contacts || []).forEach((c, k) => {
      const dc = doc.contacts[k];
      add({
        id: `contact.${k}`, category: 'contacts', level: c.pass ? 'ok' : 'error', t: c.frame >= 0 ? +(c.frame / FPS).toFixed(3) : dc.t[0], value: c.value, limit: c.limit, unit: 'm',
        title: 'Kontakt', text: c.pass ? `Kontakt ${dc.from} → ${dc.to} hält (${cm(c.value)} cm).` : `Kontakt ${dc.from} → ${dc.to} ist offen: ${cm(c.value)} cm Abstand (erlaubt ${cm(c.limit)} cm).`,
        fix: !c.pass && !dc.stick ? { kind: 'stick', index: k, label: 'Festkleben' } : null,
      });
    });
  }
  return out;
}

// Overall light: 'error' if any error, else 'warn' if any warning, else 'ok'.
export function overall(findings) {
  if (findings.some((f) => f.level === 'error')) return 'error';
  if (findings.some((f) => f.level === 'warn')) return 'warn';
  return 'ok';
}
