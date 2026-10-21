// Static cross-checks for jj_animstudio (no game needed):
//   manifest <-> files, network events (registered on one side, triggered from the other),
//   locale keys (de <-> en, used <-> defined, placeholders), Config paths used in code <-> config
//   files, NUI messages (Lua SendNUIMessage <-> web onMessage) and NUI callbacks (web post <->
//   Lua RegisterNUICallback), server-only config never read by client files.
//   node tests/consistency.mjs
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RES = path.resolve(HERE, '..');
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const read = (rel) => fs.readFileSync(path.join(RES, rel), 'utf8');
const strip = (src) => src.replace(/--\[(=*)\[[\s\S]*?\]\1\]/g, '').replace(/--[^\n]*/g, '');

const dump = spawnSync(process.env.JJ_LUA || 'lua5.4', [path.join(HERE, 'lua', 'dump.lua'), RES], { encoding: 'utf8' });
if (dump.status !== 0) { console.error(dump.stderr || dump.error); process.exit(1); }
const D = JSON.parse(dump.stdout);

// ------------------------------------------------------------------ manifest
const manifest = read('fxmanifest.lua');
const listed = new Map();
for (const [key, side] of [['shared_scripts', 'shared'], ['server_scripts', 'server'], ['client_scripts', 'client'], ['files', 'files']]) {
  const m = manifest.match(new RegExp(`${key}\\s*(\\{[^}]*\\})`));
  if (!m) { err(`manifest: ${key} missing`); continue; }
  for (const f of m[1].matchAll(/'([^']+)'/g)) listed.set(f[1], side);
}
for (const f of listed.keys()) if (!fs.existsSync(path.join(RES, f))) err(`manifest lists missing file ${f}`);
const uiPage = (manifest.match(/ui_page\s+'([^']+)'/) || [])[1];
if (!uiPage || listed.get(uiPage) !== 'files') err(`ui_page ${uiPage} must be listed in files {}`);
const walk = (d) => fs.readdirSync(path.join(RES, d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name).split(path.sep).join('/')]));
const luaFiles = walk('.').map((f) => f.replace(/^\.\//, '')).filter((f) => f.endsWith('.lua') && !f.startsWith('tests/') && f !== 'fxmanifest.lua');
for (const f of luaFiles) if (!listed.has(f)) err(`Lua file not in the manifest: ${f}`);
for (const f of ['web/index.html', 'web/studio.css', 'web/studio.bundle.js']) if (listed.get(f) !== 'files') err(`NUI file not in files {}: ${f}`);
for (const f of listed.keys()) if (f.startsWith('data/')) err(`data/ must not be shipped to clients (${f} in the manifest)`);
const code = Object.fromEntries(luaFiles.map((f) => [f, strip(read(f))]));
const side = (s) => luaFiles.filter((f) => listed.get(f) === s);
const joined = (s) => side(s).map((f) => code[f]).join('\n');
const srv = joined('server'), cli = joined('client'), all = Object.values(code).join('\n');

// ------------------------------------------------------------------ events
for (const [key, name] of Object.entries(D.Events)) {
  const toServer = name.includes(':server:');
  if (!/^jj_animstudio:(server|client):[A-Za-z]+$/.test(name)) err(`event ${key}: name ${name} does not follow jj_animstudio:server|client:*`);
  const reg = new RegExp(`RegisterNetEvent\\(\\s*E\\.${key}\\b`).test(toServer ? srv : cli);
  let trig;
  if (toServer) trig = new RegExp(`E\\.${key}\\b`).test(cli);
  else trig = new RegExp(`Trigger(?:Latent)?ClientEvent\\(\\s*E\\.${key}\\b`).test(srv) || new RegExp(`Trigger(?:Latent)?ClientEvent\\(\\s*JJS\\.Events\\.${key}\\b`).test(srv);
  if (!reg) err(`event ${key} (${name}) has no RegisterNetEvent on the ${toServer ? 'server' : 'client'}`);
  if (!trig) err(`event ${key} (${name}) is never triggered from the ${toServer ? 'client' : 'server'}`);
}
for (const [f, src] of Object.entries(code)) {
  for (const m of src.matchAll(/'(jj_animstudio:[a-z]+:[A-Za-z]+)'/g)) if (f !== 'shared/constants.lua') err(`${f}: hard-coded event name ${m[1]} (use JJS.Events)`);
}
// Every server event handler checks permission + session first (guard) - except close.
for (const m of srv.matchAll(/RegisterNetEvent\(E\.(\w+), function\(([^)]*)\)\s*\n\s*local src = source\s*\n([^\n]*)/g)) {
  if (m[1] !== 'close' && !/guard\(src/.test(m[3])) err(`server event ${m[1]}: first statement after local src must be guard(src, ...)`);
}
const handlerCount = (srv.match(/RegisterNetEvent\(E\.\w+, function/g) || []).length;
const srcFirst = (srv.match(/RegisterNetEvent\(E\.\w+, function\([^)]*\)\s*\n\s*local src = source/g) || []).length;
if (handlerCount !== srcFirst) err(`every server net event must start with "local src = source" (${srcFirst}/${handlerCount})`);

// ------------------------------------------------------------------ locales
const de = D.Locales.de || {}, en = D.Locales.en || {};
for (const k of Object.keys(de)) if (!(k in en)) err(`locale key ${k} missing in en`);
for (const k of Object.keys(en)) if (!(k in de)) err(`locale key ${k} missing in de`);
const ph = (s) => (String(s).match(/%[-+ #0]*\d*(?:\.\d+)?[sdfiqx]/g) || []).join(',');
for (const k of Object.keys(de)) if (k in en && ph(de[k]) !== ph(en[k])) err(`locale ${k}: placeholders differ (de ${ph(de[k])} / en ${ph(en[k])})`);
const used = new Set();
for (const m of all.matchAll(/\bL\(\s*'([a-z0-9_]+)'/g)) used.add(m[1]);
for (const m of all.matchAll(/reply\([^,]+,\s*'[a-zA-Z]+',\s*(?:true|false),\s*'([a-z0-9_]+)'/g)) used.add(m[1]);
for (const m of all.matchAll(/return (?:false|nil), '([a-z0-9_]+)'/g)) used.add(m[1]);
for (const m of all.matchAll(/TriggerClientEvent\(E\.notice, [^,]+, '([a-z0-9_]+)'/g)) used.add(m[1]);
for (const k of used) if (!(k in de)) err(`locale key '${k}' used but not defined`);
for (const k of Object.keys(de)) if (!used.has(k) && !new RegExp(`['"]${k}['"]`).test(all)) warn(`locale key ${k} defined but not used`);

// ------------------------------------------------------------------ config paths
const resolvePath = (root, parts) => { let v = root; for (const p of parts) { if (v == null || typeof v !== 'object' || !(p in v)) return undefined; v = v[p]; } return v; };
for (const [f, src] of Object.entries(code)) {
  if (f.startsWith('config/')) continue;
  for (const m of src.matchAll(/\b(Config|ConfigServer)((?:\.[A-Za-z_][A-Za-z0-9_]*)+)/g)) {
    const root = m[1] === 'Config' ? D.Config : D.ConfigServer;
    const parts = m[2].slice(1).split('.');
    // RateLimits[kind] style lookups end at the table; methods on values are not config keys.
    if (resolvePath(root, parts) === undefined) err(`${f}: ${m[1]}${m[2]} does not exist in the config`);
  }
}
for (const f of [...side('client'), ...side('shared')]) if (/\bConfigServer\b/.test(code[f])) err(`${f}: reads ConfigServer (server-only)`);
// Every config key is read somewhere (no dead options).
const flat = (o, pre = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) && !/^\d/.test(Object.keys(v)[0] || '') ? [`${pre}${k}`, ...flat(v, `${pre}${k}.`)] : [`${pre}${k}`]));
const webSrc = fs.readdirSync(path.join(RES, 'web', 'src')).map((f) => read(`web/src/${f}`)).join('\n');
for (const key of flat(D.Config)) {
  const top = key.split('.')[0];
  if (!new RegExp(`Config\\.${key.replace(/\./g, '\\.')}\\b`).test(all) && !new RegExp(`Config\\.${top}\\b`).test(all)) err(`Config.${key} is never read`);
}
for (const key of flat(D.ConfigServer)) {
  const top = key.split('.')[0];
  if (!new RegExp(`ConfigServer\\.${top}\\b`).test(srv)) err(`ConfigServer.${key} is never read`);
}

// ------------------------------------------------------------------ NUI contract
const luaTypes = new Set();
for (const m of cli.matchAll(/(?:SendNUIMessage|nui)\(\{\s*type\s*=\s*'([a-z:]+)'/g)) luaTypes.add(m[1]);
const jsTypes = new Set([...webSrc.matchAll(/onMessage\('([a-z:]+)'/g)].map((m) => m[1]));
for (const t of luaTypes) if (!jsTypes.has(t)) err(`NUI message '${t}' sent by Lua but not handled in web/src`);
for (const t of jsTypes) if (!luaTypes.has(t)) warn(`NUI handler '${t}' has no Lua sender`);
const jsCbs = new Set([...webSrc.matchAll(/\bpost\('([a-zA-Z]+)'/g)].map((m) => m[1]));
const luaCbs = new Set([...cli.matchAll(/\bcb\('([a-zA-Z]+)'/g)].map((m) => m[1]));
for (const c of jsCbs) if (!luaCbs.has(c)) err(`NUI callback '${c}' posted by web/src but not registered in Lua`);
for (const c of luaCbs) if (!jsCbs.has(c)) warn(`NUI callback '${c}' registered in Lua but never posted`);
const ops = new Set([...cli.matchAll(/(\w+) = \{ E\.\w+/g)].map((m) => m[1]));
for (const m of webSrc.matchAll(/server\('([a-zA-Z]+)'/g)) if (!ops.has(m[1])) err(`server op '${m[1]}' used in web/src but not whitelisted in client/main.lua`);

for (const w of warnings) console.log('  warn  ' + w);
for (const e of errors) console.log('  ERROR ' + e);
console.log(errors.length ? `consistency: ${errors.length} error(s), ${warnings.length} warning(s)` : `consistency OK (${warnings.length} warning(s)): ${Object.keys(D.Events).length} events, ${Object.keys(de).length} locale keys, ${luaTypes.size} NUI message types, ${luaCbs.size} NUI callbacks`);
process.exit(errors.length ? 1 : 0);
