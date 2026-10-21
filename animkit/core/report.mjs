// Report for Claude (and humans) about one finished clip: data, checks, read-back, install
// steps and ready-to-paste Lua for a single clip (TaskPlayAnim) and a pair scene (one networked
// synced scene per actor at sceneFrame * origin, started in the same frame, dictionaries
// preloaded). Written next to the job result as <name>.report.md / <name>.report.json.

import { luaVal } from './pipeline.mjs';

const LIGHT = { ok: 'GRÜN', warn: 'GELB', error: 'ROT' };
const fmtT = (t) => (t == null ? '–' : `${(+t).toFixed(2)} s`);

export function reportJson(doc, result, meta = {}) {
  return {
    format: 'jj-anim-report/1',
    generated: meta.generated || new Date().toISOString(),
    name: doc.name, title: doc.title || doc.name, type: doc.type,
    dict: result.dict, clips: result.clips, duration: result.duration, frames: result.frames, fps: 30, loop: !!doc.loop,
    events: (doc.events || []).slice().sort((a, b) => a.t - b.t).map((e) => ({ name: e.name, t: e.t, phase: +(e.t / doc.duration).toFixed(4), duration: e.duration ?? null })),
    origins: result.origins,
    actors: Object.fromEntries(Object.entries(doc.actors).map(([id, a]) => [id, { model: a.model, label: a.label || id, clip: result.clips[id], skeleton: result.skeletons?.[id] }])),
    targetResource: meta.targetResource || doc.targetResource || null,
    checks: { light: result.light, findings: (result.findings || []).map((f) => ({ id: f.id, level: f.level, title: f.title, text: f.text, value: f.value, limit: f.limit, unit: f.unit, t: f.t })) },
    readback: result.readback || null,
    registry: result.registry,
    ycdBytes: result.ycdBytes ?? null,
    notes: doc.notes || '',
    warnings: result.warnings || [],
  };
}

export function luaSingle(r) {
  const [actor] = Object.keys(r.clips);
  const clip = r.clips[actor];
  const flags = r.loop ? 1 : 0;
  return `-- ${r.name}: single clip (dict ${r.dict}, ${r.duration} s${r.loop ? ', loop' : ''})
local DICT, CLIP = '${r.dict}', '${clip}'

local function loadDict(dict, timeoutMs)
    if not DoesAnimDictExist(dict) then return false end
    RequestAnimDict(dict)
    local deadline = GetGameTimer() + (timeoutMs or 3000)
    while not HasAnimDictLoaded(dict) do
        if GetGameTimer() > deadline then return false end
        Wait(0)
    end
    return true
end

function Play${pascal(r.name)}(ped)
    if not loadDict(DICT) then return false end
    -- blendIn 8.0, blendOut -8.0, duration -1 (whole clip), flags ${flags} (${r.loop ? '1 = loop' : '0 = play once'}), playbackRate 0.0
    TaskPlayAnim(ped, DICT, CLIP, 8.0, -8.0, -1, ${flags}, 0.0, false, false, false)
    RemoveAnimDict(DICT) -- the running task keeps the clip loaded
    return true
end
`;
}

export function luaPair(r) {
  const ids = Object.keys(r.clips);
  const o = Object.fromEntries(ids.map((id) => [id, r.origins[id] || { x: 0, y: 0, z: 0, yaw: 0 }]));
  const ev = (r.events || []).map((e) => `--   ${e.name} at ${e.t.toFixed(2)} s (phase ${e.phase})`).join('\n');
  return `-- ${r.name}: pair scene (dict ${r.dict}, ${r.duration} s${r.loop ? ', loop' : ''})
-- Rule: GTA puts a synced-scene ped at the origin of ITS scene and ignores the clip's start
-- offset. Every clip starts at identity, so every actor plays in its OWN networked scene at
-- sceneFrame * origin[actor]; both scenes are created and started in the same frame.
-- Events:
${ev || '--   (none)'}
local DICT = '${r.dict}'
local CLIPS = ${luaVal(r.clips)}
local ORIGINS = ${luaVal(o)}

local function loadDict(dict, timeoutMs)
    if not DoesAnimDictExist(dict) then return false end
    RequestAnimDict(dict)
    local deadline = GetGameTimer() + (timeoutMs or 3000)
    while not HasAnimDictLoaded(dict) do
        if GetGameTimer() > deadline then return false end
        Wait(0)
    end
    return true
end

-- Scene frame -> world (heading 0 = +Y, counter-clockwise).
local function place(frame, heading, org)
    local r = math.rad(heading)
    local c, s = math.cos(r), math.sin(r)
    return vector3(frame.x + org.x * c - org.y * s, frame.y + org.x * s + org.y * c, frame.z + org.z), (heading + org.yaw) % 360.0
end

-- peds = { ${ids.map((id) => `${id} = <ped>`).join(', ')} }; frame = vector3 of the scene frame (usually actor ${ids[0]}'s position), heading in degrees.
-- Remote peds: the server must allow it with SetEntityRemoteSyncedScenesAllowed(entity, true).
function Start${pascal(r.name)}(peds, frame, heading)
    if not loadDict(DICT) then return nil end
    local scenes = {}
    for actor, ped in pairs(peds) do
        local p, h = place(frame, heading, ORIGINS[actor])
        local scene = NetworkCreateSynchronisedScene(p.x, p.y, p.z, 0.0, 0.0, h, 2, ${r.loop ? 'false' : 'true'}, ${r.loop ? 'true' : 'false'}, 1.0, 0.0, 1.0)
        -- blendIn 8.0, blendOut -8.0, flags 4 (DONT_INTERRUPT), moverBlendInDelta 1000.0 (place at once)
        NetworkAddPedToSynchronisedScene(ped, scene, DICT, CLIPS[actor], 8.0, -8.0, 4, 0, 1000.0, 0)
        scenes[actor] = scene
    end
    for _, scene in pairs(scenes) do NetworkStartSynchronisedScene(scene) end
    RemoveAnimDict(DICT)
    return scenes   -- stop with NetworkStopSynchronisedScene(scene) for each entry
end
-- Transitions: blend normally only while an actor keeps its origin. If the origin changes, switch
-- in one frame (blendIn 1000.0) and only where the last and first poses match in the world.
`;
}

function pascal(s) {
  return String(s).split('_').filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
}

export function reportMarkdown(rep) {
  const L = [];
  const ids = Object.keys(rep.actors);
  L.push(`# Animation „${rep.title}“ (${rep.name})`, '');
  L.push(`Erzeugt: ${rep.generated} mit jj_animstudio / animkit. Format ${rep.format}.`, '');
  L.push('## Grunddaten', '');
  L.push('| Feld | Wert |', '|---|---|');
  L.push(`| Typ | ${rep.type === 'pair' ? 'Paar-Animation (2 Akteure)' : 'Einzel-Animation'} |`);
  L.push(`| Dict | \`${rep.dict}\` (Datei \`stream/${rep.dict}.ycd\`, ${rep.ycdBytes ?? '?'} Bytes) |`);
  for (const id of ids) {
    const a = rep.actors[id];
    L.push(`| Clip ${a.label} (\`${id}\`) | \`${a.clip}\` · Modell \`${a.model}\` · Skelett ${a.skeleton ? `${a.skeleton.key} (${a.skeleton.source}${a.skeleton.exact ? '' : ', nicht passend zum Modell'})` : '?'} |`);
  }
  L.push(`| Dauer | ${rep.duration} s (${rep.frames} Bilder, 30 fps) |`);
  L.push(`| Loop | ${rep.loop ? 'ja' : 'nein'} |`);
  L.push(`| Events | ${rep.events.length ? rep.events.map((e) => `\`${e.name}\` ${fmtT(e.t)} (Phase ${e.phase})${e.duration ? `, Dauer ${e.duration} s` : ''}`).join('; ') : 'keine'} |`);
  if (rep.type === 'pair') L.push(`| Startpunkte (\`origins\`) | ${ids.map((id) => `${id}: x ${rep.origins[id]?.x}, y ${rep.origins[id]?.y}, z ${rep.origins[id]?.z}, yaw ${rep.origins[id]?.yaw}°`).join(' · ')} |`);
  L.push(`| Ziel-Resource | ${rep.targetResource ? `\`${rep.targetResource}\`` : '(nicht angegeben)'} |`, '');
  L.push('## Prüfung', '');
  L.push(`Ampel gesamt: **${LIGHT[rep.checks.light] || rep.checks.light}**`, '');
  L.push('| Ampel | Prüfung | Ergebnis | Wert | Grenze | Zeit |', '|---|---|---|---|---|---|');
  for (const f of rep.checks.findings) L.push(`| ${LIGHT[f.level]} | ${f.title} | ${f.text} | ${f.value ?? '–'} ${f.unit || ''} | ${f.limit ?? '–'} | ${fmtT(f.t)} |`);
  L.push('');
  if (rep.readback) {
    L.push(`Rücklesen (unabhängiger YCD-Leser): ${rep.readback.clips != null ? Object.entries(rep.readback.clips).map(([c, v]) => `\`${c}\` Rotation ≤ ${v?.maxRotDeg}°, Position ≤ ${v?.maxPosMm} mm${v?.maxWorldMm != null ? `, Weltpose am Startpunkt ≤ ${v.maxWorldMm} mm` : ''}`).join('; ') : '–'}. Grenzen: ${rep.readback.tolerances.rotDeg}°, ${rep.readback.tolerances.posM * 1000} mm, Weltpose ${rep.readback.tolerances.worldM * 1000} mm.`, '');
  }
  if (rep.warnings.length) { L.push('Hinweise:', ''); for (const w of rep.warnings) L.push(`- ${w.msg}`); L.push(''); }
  L.push('## Einbau', '');
  L.push(`1. \`${rep.dict}.ycd\` in den \`stream/\`-Ordner der Ziel-Resource${rep.targetResource ? ` \`${rep.targetResource}\`` : ''} kopieren (Datei liegt in \`jj_animstudio/data/outbox/final/\`).`);
  L.push('2. Registry-Eintrag (für eine generierte `shared/clips_data.lua`, gleiches Format wie beim Zombie):', '');
  L.push('```lua', `ClipData.scenes[${luaQuote(rep.name)}] = ${luaVal(rep.registry)}`, '```', '');
  L.push('3. Abspielen:', '');
  L.push('```lua', rep.type === 'pair' ? luaPair(rep) : luaSingle(rep), '```', '');
  L.push('## Notizen aus dem Studio', '', rep.notes ? rep.notes : '(keine)', '');
  return L.join('\n');
}

const luaQuote = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
