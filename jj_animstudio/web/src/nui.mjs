// Bridge to the Lua client: post(name, data) -> RegisterNUICallback, onMessage(type, fn) <- SendNUIMessage.
// In a normal browser (tests, development) a mock backend answers instead of the game, so the
// whole studio runs without FiveM (window.JJS_MOCK can preset skeletons/projects).
const handlers = new Map();
export const inGame = typeof window.GetParentResourceName === 'function';
const resource = inGame ? window.GetParentResourceName() : 'jj_animstudio';

export function onMessage(type, fn) {
  if (!handlers.has(type)) handlers.set(type, []);
  handlers.get(type).push(fn);
}
export function emit(msg) {
  for (const fn of handlers.get(msg?.type) || []) {
    try { fn(msg); } catch (e) { console.error('handler', msg.type, e); }
  }
}
window.addEventListener('message', (e) => { if (e.data && typeof e.data === 'object') emit(e.data); });

export async function post(name, data = {}) {
  if (!inGame) return mock(name, data);
  try {
    const r = await fetch(`https://${resource}/${name}`, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' }, body: JSON.stringify(data) });
    return await r.json();
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

// ------------------------------------------------------------------ browser mock
const M = { projects: {}, poses: {}, calls: [], preview: 0 };
window.JJS_MOCK_STATE = M;
const later = (msg, ms = 30) => setTimeout(() => emit(msg), ms);
function list() {
  return Object.entries(M.projects).map(([name, p]) => ({ name, title: p.title, type: p.type, updated: p.updated, size: p.text.length })).sort((a, b) => b.updated - a.updated);
}
function mock(name, data) {
  M.calls.push({ name, data });
  if (name === 'server') {
    const [a0, a1, a2, a3] = data.args || [];
    const reply = (op, ok, extra = {}) => later({ type: 'reply', data: { op, ok, ...extra } });
    switch (data.op) {
      case 'list': later({ type: 'projects', list: list() }); break;
      case 'load': if (M.projects[a0]) later({ type: 'project', name: a0, text: M.projects[a0].text }); else reply('load', false, { msg: 'missing' }); break;
      case 'save': {
        const doc = JSON.parse(a1);
        M.projects[a0] = { text: a1, title: doc.title || a0, type: doc.type, updated: Date.now() / 1000 };
        reply('save', true, { name: a0, msg: 'Gespeichert.' }); break;
      }
      case 'rename': case 'duplicate': {
        const p = M.projects[a0];
        if (!p || M.projects[a1]) { reply(data.op, false, { msg: 'exists/missing' }); break; }
        M.projects[a1] = { ...p, text: p.text.replace(`"name":"${a0}"`, `"name":"${a1}"`) };
        if (data.op === 'rename') delete M.projects[a0];
        reply(data.op, true, { name: a1, from: a0 }); later({ type: 'projects', list: list() }); break;
      }
      case 'delete': delete M.projects[a0]; reply('delete', true, { name: a0 }); later({ type: 'projects', list: list() }); break;
      case 'preview': case 'finalize': {
        const doc = JSON.parse(a1);
        M.projects[a0] = { text: a1, title: doc.title || a0, type: doc.type, updated: Date.now() / 1000 };
        const v = ++M.preview;
        const dict = data.op === 'preview' ? `jjs_${a0}_v${v}` : a2;
        reply(data.op, true, { job: `${a0}_v${v}`, dict, name: a0 });
        const ids = Object.keys(doc.actors);
        const clips = Object.fromEntries(ids.map((id) => [id, doc.type === 'pair' ? `${doc.name}_${id}` : doc.name]));
        later({ type: 'job', kind: 'result', result: {
          ok: true, job: `${a0}_v${v}`, kind: data.op === 'preview' ? 'preview' : 'final', dict, clips, duration: doc.duration, loop: !!doc.loop, type: doc.type,
          origins: doc.type === 'pair' ? Object.fromEntries(ids.map((id) => [id, { x: doc.tracks[id]?.mover?.[0]?.p?.[0] || 0, y: doc.tracks[id]?.mover?.[0]?.p?.[1] || 0, z: 0, yaw: doc.tracks[id]?.mover?.[0]?.yaw || 0 }])) : {},
          restarted: true, waitMs: 400, findings: [],
          report: data.op === 'finalize' ? { md: `data/outbox/${a0}.report.md`, json: `data/outbox/${a0}.report.json`, ycd: `data/outbox/final/${dict}.ycd`, text: `# Animation „${doc.title || a0}“ (${a0})\n\n(Bericht aus dem Browser-Test, kein echter Build)\n` } : undefined,
        } }, 200);
        break;
      }
      case 'poseSave': M.poses[a0] = a1; reply('poseSave', true, { name: a0 }); later({ type: 'poses', poses: { ...M.poses } }); break;
      case 'poseDelete': delete M.poses[a0]; reply('poseDelete', true, { name: a0 }); later({ type: 'poses', poses: { ...M.poses } }); break;
      default: break;
    }
    void a2; void a3;
    return Promise.resolve({ ok: true });
  }
  if (name === 'test' && data.action === 'start') later({ type: 'test:started', ok: true, dict: data.result?.dict }, 50);
  if (name === 'test' && data.action === 'stop') later({ type: 'test:stopped' }, 10);
  if (name === 'bones') return Promise.resolve({ ok: true, bones: (window.JJS_MOCK?.bones?.(data)) || [] });
  if (name === 'close') later({ type: 'close' }, 10);
  return Promise.resolve({ ok: true });
}
