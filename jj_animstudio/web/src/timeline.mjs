// Timeline (canvas): ruler with playhead and range, one row per body-part group and actor with
// keyframe diamonds, foot-lock bars, contact bars and event markers.
//   click ruler = set time, Alt + drag ruler = select a range, click diamond = select,
//   Shift + click = add to selection, drag diamond = move keys, Del = delete selection.
import { S, changed, mutate, setTime, select, beginDrag, endDrag } from './store.mjs';
import { GROUP_ORDER, GROUP_LABEL, keyTimes, moveKeys, snapT } from './edit.mjs';
import { t as tr } from './i18n.mjs';

const ROW = 20, RULER = 24, LABEL = 118;
const COLORS = { bg: '#14171c', row: '#1b1f26', rowAlt: '#181b21', text: '#c9d1dc', dim: '#7c8796', key: '#ffd34d', keySel: '#ffffff', head: '#4f9dff', headB: '#ff9a3c', range: 'rgba(79,157,255,0.16)', lock: '#46e0c4', contact: '#b388ff', event: '#ff6b6b', play: '#ff4d4d' };

export function createTimeline(canvas, { onEdit }) {
  const ctx = canvas.getContext('2d');
  let rows = [];
  let dragging = null;
  let showAll = false;

  const dpr = () => Math.min(2, window.devicePixelRatio || 1);
  const width = () => canvas.clientWidth;
  const tToX = (t) => LABEL + (t / Math.max(1e-6, S.doc.duration)) * (width() - LABEL - 12);
  const xToT = (x) => Math.max(0, Math.min(S.doc.duration, ((x - LABEL) / Math.max(1, width() - LABEL - 12)) * S.doc.duration));

  function buildRows() {
    rows = [];
    if (!S.doc) return;
    const ids = Object.keys(S.doc.actors);
    for (const id of ids) {
      if (ids.length > 1) rows.push({ kind: 'header', actor: id, label: S.doc.actors[id].label || id });
      const selGroup = S.selGroup && S.actor === id ? S.selGroup : null;
      for (const g of GROUP_ORDER) {
        const times = keyTimes(S.doc, id, g);
        if (showAll || times.length || g === 'pos' || g === selGroup) rows.push({ kind: 'group', actor: id, group: g, label: tr(GROUP_LABEL[g]), times });
      }
      const locks = S.doc.tracks[id]?.feet?.lock || {};
      if (Object.values(locks).some((l) => l.length)) rows.push({ kind: 'locks', actor: id, label: tr('feet_locks'), locks });
    }
    if ((S.doc.contacts || []).length) rows.push({ kind: 'contacts', label: tr('contacts_row') });
    rows.push({ kind: 'events', label: tr('events') });
  }
  function height() { return RULER + rows.length * ROW + 4; }

  function draw() {
    if (!S.doc) return;
    buildRows();
    const w = width(), h = height();
    canvas.style.height = `${h}px`;
    const d = dpr();
    if (canvas.width !== Math.round(w * d) || canvas.height !== Math.round(h * d)) { canvas.width = Math.round(w * d); canvas.height = Math.round(h * d); }
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.fillStyle = COLORS.bg; ctx.fillRect(0, 0, w, h);
    ctx.font = '12px system-ui, sans-serif';
    // Ruler.
    const T = S.doc.duration;
    const step = T <= 2 ? 0.1 : T <= 6 ? 0.25 : T <= 15 ? 0.5 : 1;
    ctx.fillStyle = COLORS.dim; ctx.strokeStyle = '#2a2f38';
    for (let s = 0; s <= T + 1e-6; s += step) {
      const x = tToX(s), major = Math.abs(s / (step * 4) - Math.round(s / (step * 4))) < 1e-6;
      ctx.beginPath(); ctx.moveTo(x, major ? 4 : 12); ctx.lineTo(x, RULER); ctx.stroke();
      if (major) ctx.fillText(`${(+s.toFixed(2)).toString()}s`, x + 2, 12);
    }
    if (S.range) { ctx.fillStyle = COLORS.range; ctx.fillRect(tToX(S.range[0]), 0, tToX(S.range[1]) - tToX(S.range[0]), h); }
    // Rows.
    rows.forEach((r, i) => {
      const y = RULER + i * ROW;
      ctx.fillStyle = r.kind === 'header' ? '#222833' : i % 2 ? COLORS.row : COLORS.rowAlt;
      ctx.fillRect(0, y, w, ROW);
      ctx.fillStyle = r.kind === 'header' ? (r.actor === 'b' ? COLORS.headB : COLORS.head) : COLORS.text;
      ctx.fillText(r.label, 8, y + 14);
      if (r.kind === 'group') {
        for (const t of r.times) {
          const sel = S.selKeys.some((k) => k.actor === r.actor && k.group === r.group && Math.abs(k.t - t) < 1e-3);
          const x = dragging?.kind === 'key' && dragging.moved && sel ? tToX(snapT(t + dragging.dt)) : tToX(t);
          diamond(x, y + ROW / 2, sel ? COLORS.keySel : COLORS.key);
        }
      } else if (r.kind === 'locks') {
        for (const [side, list] of Object.entries(r.locks)) {
          list.forEach((rg) => {
            ctx.fillStyle = COLORS.lock; ctx.globalAlpha = 0.75;
            const yy = y + (side === 'L' ? 3 : 11);
            ctx.fillRect(tToX(rg[0]), yy, Math.max(2, tToX(rg[1]) - tToX(rg[0])), 6);
            ctx.globalAlpha = 1;
          });
        }
      } else if (r.kind === 'contacts') {
        (S.doc.contacts || []).forEach((c, k) => {
          ctx.fillStyle = S.selContact === k ? '#fff' : COLORS.contact; ctx.globalAlpha = 0.8;
          ctx.fillRect(tToX(c.t[0]), y + 5, Math.max(2, tToX(c.t[1]) - tToX(c.t[0])), 10);
          ctx.globalAlpha = 1;
        });
      } else if (r.kind === 'events') {
        (S.doc.events || []).forEach((e, k) => {
          const x = tToX(e.t);
          ctx.fillStyle = S.selEvent === k ? '#fff' : COLORS.event;
          ctx.beginPath(); ctx.moveTo(x, y + 3); ctx.lineTo(x + 6, y + 9); ctx.lineTo(x, y + 15); ctx.closePath(); ctx.fill();
          if (e.duration) ctx.fillRect(x, y + 15, tToX(e.t + e.duration) - x, 2);
          ctx.fillText(e.name, x + 8, y + 14);
        });
      }
    });
    // Playhead.
    const px = tToX(S.t);
    ctx.strokeStyle = COLORS.play; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke(); ctx.lineWidth = 1;
    // Test phase marker (real ped).
    if (S.test?.phase != null) {
      const x = tToX(S.test.phase * S.doc.duration);
      ctx.strokeStyle = '#46e0c4'; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); ctx.setLineDash([]);
    }
  }
  function diamond(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x + 6, y); ctx.lineTo(x, y + 6); ctx.lineTo(x - 6, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.stroke();
  }

  function hit(x, y) {
    if (y < RULER) return { kind: 'ruler' };
    const i = Math.floor((y - RULER) / ROW);
    const r = rows[i];
    if (!r) return null;
    if (r.kind === 'group') {
      for (const t of r.times) if (Math.abs(tToX(t) - x) <= 7) return { kind: 'key', row: r, t };
      return { kind: 'row', row: r };
    }
    if (r.kind === 'events') {
      const k = (S.doc.events || []).findIndex((e) => Math.abs(tToX(e.t) - x) <= 7);
      return k >= 0 ? { kind: 'event', index: k } : { kind: 'row', row: r };
    }
    if (r.kind === 'contacts') {
      const k = (S.doc.contacts || []).findIndex((c) => x >= tToX(c.t[0]) - 3 && x <= tToX(c.t[1]) + 3);
      return k >= 0 ? { kind: 'contact', index: k } : { kind: 'row', row: r };
    }
    if (r.kind === 'locks') {
      const side = y - (RULER + i * ROW) < ROW / 2 ? 'L' : 'R';
      const k = (r.locks[side] || []).findIndex((rg) => x >= tToX(rg[0]) - 3 && x <= tToX(rg[1]) + 3);
      return k >= 0 ? { kind: 'lock', actor: r.actor, side, index: k } : { kind: 'row', row: r };
    }
    return { kind: 'row', row: r };
  }

  canvas.addEventListener('mousedown', (e) => {
    if (!S.doc) return;
    const rc = canvas.getBoundingClientRect();
    const x = e.clientX - rc.left, y = e.clientY - rc.top;
    const h = hit(x, y);
    if (!h) return;
    if (h.kind === 'ruler' || (h.kind === 'row' && !e.shiftKey)) {
      if (e.altKey) { dragging = { kind: 'range', t0: snapT(xToT(x)) }; S.range = [dragging.t0, dragging.t0]; changed('range'); }
      else { dragging = { kind: 'scrub' }; setTime(snapT(xToT(x))); }
      if (h.kind === 'row' && h.row.kind === 'group') select({ selKeys: [], selEvent: null, selContact: null, selLock: null });
      return;
    }
    if (h.kind === 'key') {
      const k = { actor: h.row.actor, group: h.row.group, t: h.t };
      const already = S.selKeys.some((s) => s.actor === k.actor && s.group === k.group && Math.abs(s.t - k.t) < 1e-3);
      const list = e.shiftKey ? (already ? S.selKeys.filter((s) => !(s.actor === k.actor && s.group === k.group && Math.abs(s.t - k.t) < 1e-3)) : [...S.selKeys, k]) : (already ? S.selKeys : [k]);
      select({ selKeys: list, selEvent: null, selContact: null, selLock: null, actor: k.actor, selGroup: k.group });
      dragging = { kind: 'key', x0: x, dt: 0, moved: false };
      if (!e.shiftKey) setTime(h.t);
      return;
    }
    if (h.kind === 'event') { select({ selEvent: h.index, selKeys: [], selContact: null, selLock: null }); dragging = { kind: 'event', index: h.index, x0: x, t0: S.doc.events[h.index].t }; setTime(S.doc.events[h.index].t); return; }
    if (h.kind === 'contact') { select({ selContact: h.index, selKeys: [], selEvent: null, selLock: null }); return; }
    if (h.kind === 'lock') { select({ selLock: { actor: h.actor, side: h.side, index: h.index }, selKeys: [], selEvent: null, selContact: null }); }
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging || !S.doc) return;
    const rc = canvas.getBoundingClientRect();
    const x = e.clientX - rc.left;
    if (dragging.kind === 'scrub') setTime(snapT(xToT(x)));
    else if (dragging.kind === 'range') { const t1 = snapT(xToT(x)); S.range = [Math.min(dragging.t0, t1), Math.max(dragging.t0, t1)]; changed('range'); draw(); }
    else if (dragging.kind === 'key') {
      const dt = xToT(x) - xToT(dragging.x0);
      if (Math.abs(x - dragging.x0) > 3) dragging.moved = true;
      dragging.dt = dt; draw();
    } else if (dragging.kind === 'event') {
      const t = snapT(Math.max(0, Math.min(S.doc.duration, dragging.t0 + xToT(x) - xToT(dragging.x0))));
      if (!dragging.started) { beginDrag(); dragging.started = true; }
      mutate((d) => { d.events[dragging.index].t = t; }, { commit: false });
      setTime(t);
    }
  });
  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    const d = dragging;
    dragging = null;
    if (d.kind === 'key' && d.moved && S.selKeys.length) {
      const moves = S.selKeys.map((k) => ({ ...k, to: snapT(Math.max(0, Math.min(S.doc.duration, k.t + d.dt))) }));
      mutate((doc) => {
        // Move in an order that never overwrites a key that still has to move.
        const order = d.dt > 0 ? moves.slice().sort((a, b) => b.t - a.t) : moves.slice().sort((a, b) => a.t - b.t);
        for (const m of order) moveKeys(doc, m.actor, m.group, m.t, m.to);
      });
      select({ selKeys: moves.map((m) => ({ actor: m.actor, group: m.group, t: m.to })) });
      onEdit?.();
    }
    if (d.kind === 'event' && d.started) { endDrag(); onEdit?.(); }
    if (d.kind === 'range' && S.range && S.range[1] - S.range[0] < 1 / 30) { S.range = null; changed('range'); }
    draw();
  });

  return { draw, setShowAll(v) { showAll = v; draw(); }, get showAll() { return showAll; }, tToX, xToT };
}
