// Cross-consistency checks for jj_zombie_test (static, no game needed):
//   manifest <-> files, network events (registered on one side, triggered from the other),
//   locale keys (used <-> defined, de <-> en), Config paths used in code <-> config files,
//   clip registry <-> stream/*.ycd <-> clip names used in code, NUI messages <-> handlers.
//   node tests/consistency.mjs
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(HERE, '..');
const RES = path.resolve(DEV, '..', 'jj_zombie_test');
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const arr = (x) => (Array.isArray(x) ? x : []);   // empty Lua tables arrive as {}

const dump = spawnSync('lua5.4', [path.join(HERE, 'lua', 'dump.lua'), RES], { encoding: 'utf8' });
if (dump.status !== 0) { console.error(dump.stderr); process.exit(1); }
const D = JSON.parse(dump.stdout);

const read = (rel) => fs.readFileSync(path.join(RES, rel), 'utf8');
const strip = (src) => src.replace(/--\[(=*)\[[\s\S]*?\]\1\]/g, '').replace(/--[^\n]*/g, '');

// ------------------------------------------------------------------ manifest
const manifest = read('fxmanifest.lua');
const listed = new Set();
for (const key of ['shared_scripts', 'server_scripts', 'client_scripts', 'files']) {
  const m = manifest.match(new RegExp(`${key}\\s*(\\{[^}]*\\})`));
  if (!m) continue;
  for (const f of m[1].matchAll(/'([^']+)'/g)) if (!f[1].startsWith('@')) listed.add(f[1]);
}
const uiPage = (manifest.match(/ui_page\s+'([^']+)'/) || [])[1];
for (const f of listed) if (!fs.existsSync(path.join(RES, f))) err(`manifest lists missing file ${f}`);
if (uiPage && !listed.has(uiPage)) err(`ui_page ${uiPage} not in files {}`);
const walk = (d) => fs.readdirSync(path.join(RES, d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const allFiles = walk('.').map((f) => f.replace(/^\.\//, ''));
const luaFiles = allFiles.filter((f) => f.endsWith('.lua') && f !== 'fxmanifest.lua');
for (const f of luaFiles) if (!listed.has(f)) err(`Lua file not in the manifest: ${f}`);
for (const f of allFiles.filter((x) => x.startsWith('html/') && x !== 'html/dev.html')) if (!listed.has(f)) err(`NUI file not in files {}: ${f}`);
const sideOf = {};
for (const [key, side] of [['shared_scripts', 'shared'], ['server_scripts', 'server'], ['client_scripts', 'client']]) {
  const m = manifest.match(new RegExp(`${key}\\s*(\\{[^}]*\\})`));
  for (const f of m[1].matchAll(/'([^']+)'/g)) sideOf[f[1]] = side;
}
const code = Object.fromEntries(luaFiles.map((f) => [f, strip(read(f))]));
const filesOf = (side) => luaFiles.filter((f) => sideOf[f] === side);
const joined = (side) => filesOf(side).map((f) => code[f]).join('\n');

// ------------------------------------------------------------------ events
const srv = joined('server'), cli = joined('client');
for (const [key, name] of Object.entries(D.Events)) {
  const ref = new RegExp(`(?:JJZ\\.)?Events\\.${key}\\b`);
  const toServer = name.includes(':server:');
  const regSide = toServer ? srv : cli, trigSide = toServer ? cli : srv;
  const reg = new RegExp(`RegisterNetEvent\\(\\s*(?:JJZ\\.)?Events\\.${key}\\b`).test(regSide);
  const trig = new RegExp(toServer ? `TriggerServerEvent\\(\\s*(?:JJZ\\.)?Events\\.${key}\\b` : `(?:TriggerClientEvent|sendToOwner\\([^,]+,|TriggerLatentClientEvent)\\(?\\s*(?:JJZ\\.)?Events\\.${key}\\b`).test(trigSide)
    || (!toServer && new RegExp(`Own\\.sendToOwner\\([^)]*Events\\.${key}\\b`).test(trigSide));
  if (!reg && !trig) { warn(`event ${key} (${name}) is declared but never used`); continue; }
  if (!reg) err(`event ${key} is triggered but has no RegisterNetEvent on the ${toServer ? 'server' : 'client'}`);
  if (!trig) err(`event ${key} is registered but never triggered from the ${toServer ? 'client' : 'server'}`);
  if (!ref.test(srv + cli)) warn(`event ${key} unused`);
}
for (const [key, name] of Object.entries(D.LocalEvents)) {
  if (new RegExp(`RegisterNetEvent\\([^)]*LocalEvents\\.${key}`).test(srv + cli)) err(`server-internal event ${key} must not be a net event`);
  void name;
}
// Raw event name strings in code must come from constants (except framework / game events).
for (const [f, src] of Object.entries(code)) {
  for (const m of src.matchAll(/'(jj_zombie:[a-z]+:[A-Za-z]+)'/g)) if (f !== 'shared/constants.lua') err(`${f}: hard-coded event name ${m[1]}`);
}

// ------------------------------------------------------------------ locales
const de = D.Locales.de || {}, en = D.Locales.en || {};
for (const k of Object.keys(de)) if (!(k in en)) err(`locale key ${k} missing in en`);
for (const k of Object.keys(en)) if (!(k in de)) err(`locale key ${k} missing in de`);
const usedKeys = new Set();
const all = Object.values(code).join('\n');
for (const m of all.matchAll(/\bL\(\s*'([a-z0-9_]+)'/g)) usedKeys.add(m[1]);
for (const m of all.matchAll(/notify\(\s*[^,()]+,\s*'([a-z0-9_]+)'/g)) usedKeys.add(m[1]);
for (const m of all.matchAll(/'(reason_[a-z0-9_]+)'/g)) usedKeys.add(m[1]);
for (const m of all.matchAll(/\b(help_[a-z0-9_]+)'/g)) usedKeys.add(m[1]);
for (const m of all.matchAll(/'(help_[a-z0-9_]+)'/g)) usedKeys.add(m[1]);
for (const k of usedKeys) if (!(k in de)) err(`locale key '${k}' used but not defined`);
for (const k of Object.keys(de)) if (!usedKeys.has(k) && !new RegExp(`['"]${k}['"]`).test(all)) warn(`locale key ${k} defined but not used`);
// Placeholder counts must match between languages.
const ph = (s) => (String(s).match(/%[-+ #0]*\d*(?:\.\d+)?[sdfiqx]/g) || []).join(',');
for (const k of Object.keys(de)) if (k in en && ph(de[k]) !== ph(en[k])) err(`locale ${k}: placeholders differ (de ${ph(de[k])} / en ${ph(en[k])})`);

// ------------------------------------------------------------------ config paths
const resolvePath = (root, parts) => { let v = root; for (const p of parts) { if (v == null || typeof v !== 'object' || !(p in v)) return undefined; v = v[p]; } return v; };
for (const [f, src] of Object.entries(code)) {
  if (f.startsWith('config/')) continue;
  for (const m of src.matchAll(/\b(Config|ConfigServer)((?:\.[A-Za-z_][A-Za-z0-9_]*)+)/g)) {
    const parts = m[2].slice(1).split('.');
    // Stop at methods / dynamic access; check the longest static prefix.
    const root = m[1] === 'Config' ? D.Config : D.ConfigServer;
    if (resolvePath(root, parts) === undefined) {
      // Optional settings are read with `or` defaults; tolerate only if followed by ' or '.
      const after = src.slice(m.index + m[0].length, m.index + m[0].length + 6);
      if (/^\s*or\b/.test(after) || /^\s*(~=|==)\s*nil/.test(after)) { warn(`${f}: optional ${m[1]}${m[2]} not in config (default used)`); continue; }
      err(`${f}: ${m[1]}${m[2]} does not exist in the config`);
    }
  }
}
if (m_side_check()) void 0;
function m_side_check() {
  // ConfigServer must never be read by client or shared files (it is not sent to clients).
  for (const f of [...filesOf('client'), ...filesOf('shared')]) if (/\bConfigServer\b/.test(code[f])) err(`${f}: reads ConfigServer (server-only)`);
  return true;
}

// ------------------------------------------------------------------ clip registry
const scenes = D.ClipData?.scenes || {};
const dicts = new Set(Object.values(scenes).map((s) => s.dict));
for (const d of dicts) if (!fs.existsSync(path.join(RES, 'stream', `${d}.ycd`))) err(`stream/${d}.ycd missing for registry dictionary ${d}`);
for (const f of fs.readdirSync(path.join(RES, 'stream'))) {
  const d = f.replace(/\.ycd$/, '');
  if (f.endsWith('.ycd') && !dicts.has(d)) err(`stream/${f} is not referenced by the registry`);
}
const names = new Set(Object.values(scenes).map((s) => s.name));
for (const [f, src] of Object.entries(code)) {
  if (f === 'shared/clips_data.lua') continue;
  for (const m of src.matchAll(/'((?:fin|zmove|zreact|smoke)_[a-z0-9_]+)'/g)) if (!names.has(m[1])) err(`${f}: clip '${m[1]}' not in the registry`);
}
for (const [key, s] of Object.entries(scenes)) {
  for (const ev of arr(s.events)) if (!(ev.phase >= 0 && ev.phase <= 1)) err(`registry ${key}: event ${ev.name} phase out of range`);
  if (!(s.duration > 0)) err(`registry ${key}: duration ${s.duration}`);
}
// Every event name a clip carries must be handled by the client (finisher onClipEvent).
const finCli = code['client/finisher.lua'] || '';
const evNames = new Set(Object.values(scenes).filter((s) => s.name.startsWith('fin_')).flatMap((s) => arr(s.events).map((e) => e.name)));
for (const n of evNames) if (!new RegExp(`name == '${n}'`).test(finCli)) err(`clip event '${n}' has no handler in client/finisher.lua`);

// ------------------------------------------------------------------ NUI contract
const js = fs.readFileSync(path.join(RES, 'html', 'finisher.js'), 'utf8') + fs.readFileSync(path.join(RES, 'html', 'sound.js'), 'utf8');
const sentTypes = new Set();
for (const m of all.matchAll(/type\s*=\s*'([a-z]+(?::[a-z]+)?)'/g)) sentTypes.add(m[1]);
for (const t of sentTypes) {
  if (['info', 'error', 'success', 'warn'].includes(t)) continue;
  if (!js.includes(`'${t}'`)) err(`NUI message type '${t}' sent from Lua but not handled in html/*.js`);
}
const sounds = new Set();
for (const m of all.matchAll(/ZSound\.(?:play|loop)\(\s*'([a-z]+)'/g)) sounds.add(m[1]);
for (const s of sounds) if (!new RegExp(`\\b${s}\\s*[:(]|=== '${s}'`).test(js)) err(`sound '${s}' used in Lua but not defined in html/sound.js`);

// ------------------------------------------------------------------ report
for (const w of warnings) console.log('  warn  ' + w);
for (const e of errors) console.log('  ERROR ' + e);
console.log(errors.length ? `consistency: ${errors.length} error(s), ${warnings.length} warning(s)` : `consistency OK (${warnings.length} warning(s)): ${Object.keys(D.Events).length} events, ${Object.keys(de).length} locale keys, ${Object.keys(scenes).length} registry scenes, ${dicts.size} dictionaries, ${sentTypes.size} NUI message types, ${sounds.size} sounds`);
process.exit(errors.length ? 1 : 0);
