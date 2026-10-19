// Native check for jj_zombie_test: every PascalCase global call in the resource's Lua files must
// be a documented native (citizenfx/natives + citizenfx/fivem ext/native-decls, cloned by
// tools/setup.sh into tools/vendor/fivem-ref), a CfxLua runtime function or a function the
// resource defines itself. Natives must be legal on the side the file runs on (client / server /
// shared; server files may also use the server RPC natives) and must not get more arguments than
// the declaration has.
//   node tools/check-natives.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(HERE, '..');
const RES = path.resolve(DEV, '..', 'jj_zombie_test');
const REF = path.join(HERE, 'vendor', 'fivem-ref');

const toLua = (upper) => {
  if (/^0x[0-9A-Fa-f]+$/.test(upper)) return 'N_' + upper.toLowerCase();
  return upper.replace(/^_+/, '').toLowerCase().split('_').filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
};

// ------------------------------------------------------------------ native database
function readDecls(dir, defaultApiset) {
  const out = new Map();
  const walk = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) { walk(p); continue; }
      if (!f.name.endsWith('.md') || f.name === 'README.md') continue;
      const txt = fs.readFileSync(p, 'utf8');
      const head = txt.match(/^## ([A-Z0-9_x]+)/m);
      if (!head) continue;
      const apiset = (txt.match(/^apiset:\s*(\w+)/m) || [])[1] || defaultApiset;
      // Signature: first declaration of the native in the first c block (cs_type(...) removed).
      let params = null;
      const block = txt.match(/```c\s*\n([\s\S]*?)```/);
      if (block) {
        const decl = block[1].replace(/cs_type\([^)]*\)/g, '').replace(/\/\/[^\n]*/g, '');
        const at = decl.indexOf(head[1] + '(') >= 0 ? decl.indexOf(head[1] + '(') : decl.search(/\b\w+\s*\(/);
        const open = decl.indexOf('(', at), close = decl.lastIndexOf(')');
        if (open >= 0 && close > open) params = decl.slice(open + 1, close).split(',').map((x) => x.trim()).filter((x) => x && x !== 'void');
      }
      const variadic = params ? params.some((x) => x.includes('...')) : true;
      // Pointer parameters are return values in Lua, never passed.
      const luaParams = params ? params.filter((x) => !x.includes('*') || /char\s*\*/.test(x)).length : null;
      const entry = { name: head[1], apisets: new Set([apiset]), params: luaParams, variadic, file: path.relative(REF, p) };
      const names = new Set([toLua(head[1]), f.name.replace(/\.md$/, '')]);
      const al = txt.match(/^aliases:\s*\[([^\]]*)\]/m);
      if (al) for (const a of al[1].split(',').map((x) => x.trim().replace(/^"|"$/g, '')).filter(Boolean)) names.add(toLua(a));
      for (const n of names) if (!out.has(n)) out.set(n, entry);
    }
  };
  walk(dir);
  return out;
}

export function loadNativeDb() {
  if (!fs.existsSync(path.join(REF, 'natives')) || !fs.existsSync(path.join(REF, 'fx', 'ext', 'native-decls'))) {
    throw new Error(`native reference missing: ${REF} (run tools/setup.sh)`);
  }
  // A name can exist on both sides (e.g. GET_ENTITY_COORDS: GTA client native + CFX server
  // native): merge the apisets, keep the larger parameter count per side-agnostic check.
  const db = readDecls(path.join(REF, 'natives'), 'client');
  for (const [n, e] of readDecls(path.join(REF, 'fx', 'ext', 'native-decls'), 'client')) {
    const have = db.get(n);
    if (!have) { db.set(n, e); continue; }
    db.set(n, { ...have, apisets: new Set([...have.apisets, ...e.apisets]), params: Math.max(have.params ?? 0, e.params ?? 0), variadic: have.variadic || e.variadic, file: have.file + ' + ' + e.file });
  }
  const rpc = new Set();
  const rpcFile = path.join(REF, 'fx', 'ext', 'natives', 'rpc_spec_natives.lua');
  for (const m of fs.readFileSync(rpcFile, 'utf8').matchAll(/^\s*\w+_rpc\s+'([A-Z0-9_]+)'/gm)) rpc.add(toLua(m[1]));
  return { db, rpc };
}

// CfxLua runtime / scheduler / event API (citizen-scripting-lua scheduler.lua), not natives.
const RUNTIME = new Set([
  'CreateThread', 'Wait', 'SetTimeout', 'ClearTimeout', 'RegisterNetEvent', 'AddEventHandler', 'RemoveEventHandler',
  'TriggerEvent', 'TriggerServerEvent', 'TriggerClientEvent', 'TriggerLatentServerEvent', 'TriggerLatentClientEvent',
  'RegisterNUICallback', 'SendNUIMessage', 'GetPlayers', 'GetPlayerIdentifiers', 'GetPlayerTokens', 'PerformHttpRequest',
  'Player', 'Entity', 'LocalPlayer', 'GlobalState', 'RegisterServerEvent', 'Await', 'MakeFunctionReference', 'Citizen', 'NewStateBag',
]);
// Lua 5.4 standard globals that start with an upper-case letter: none; listed for completeness.
const LUA_STD = new Set([]);

// ------------------------------------------------------------------ Lua scanning
function stripLua(src) {
  // Remove comments and string contents (keep quotes / line structure) so calls are found in code only.
  let out = '', i = 0;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (c === '-' && n === '-') {
      const lb = src.slice(i + 2).match(/^\[(=*)\[/);
      if (lb) { const end = src.indexOf(']' + lb[1] + ']', i); const stop = end < 0 ? src.length : end + lb[1].length + 2; out += src.slice(i, stop).replace(/[^\n]/g, ' '); i = stop; continue; }
      while (i < src.length && src[i] !== '\n') { out += ' '; i++; }
      continue;
    }
    if (c === '[' && /^\[(=*)\[/.test(src.slice(i))) {
      const eq = src.slice(i).match(/^\[(=*)\[/)[1];
      const end = src.indexOf(']' + eq + ']', i + 2);
      const stop = end < 0 ? src.length : end + eq.length + 2;
      out += '"' + src.slice(i + 1, stop - 1).replace(/[^\n]/g, ' ') + '"'; i = stop; continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const q = c; out += q; i++;
      while (i < src.length && src[i] !== q) { if (src[i] === '\\') { out += '  '; i += 2; continue; } out += src[i] === '\n' ? '\n' : ' '; i++; }
      out += q; i++; continue;
    }
    out += c; i++;
  }
  return out;
}

function argCount(code, open) {
  // open = index of '(' ; counts top-level arguments until the matching ')'. Anonymous
  // function bodies (function ... end) and other blocks inside the call count as nesting.
  let depth = 0, block = 0, n = 0, any = false;
  for (let i = open; i < code.length; i++) {
    const c = code[i];
    if (/[a-z]/.test(c) && !/[\w.:]/.test(code[i - 1] || '')) {
      const w = code.slice(i).match(/^[a-z]+/)[0];
      if (w === 'function' || w === 'if' || w === 'do' || w === 'repeat') { block++; any = true; }
      else if ((w === 'end' || w === 'until') && block > 0) block--;
      i += w.length - 1;
      if (depth === 1 && block === 0) any = true;
      continue;
    }
    if (block > 0) continue;
    if (c === '(' || c === '{' || c === '[') { depth++; if (depth > 1) any = true; continue; }
    if (c === ')' || c === '}' || c === ']') { depth--; if (depth === 0) return any ? n + 1 : 0; continue; }
    if (depth === 1) {
      if (c === ',') n++;
      else if (!/\s/.test(c)) any = true;
    }
  }
  return null;
}

function sideOf(rel, manifest) {
  if (manifest.server.has(rel)) return 'server';
  if (manifest.client.has(rel)) return 'client';
  if (manifest.shared.has(rel)) return 'shared';
  return null;
}

function readManifest() {
  const txt = stripLua(fs.readFileSync(path.join(RES, 'fxmanifest.lua'), 'utf8'));
  const raw = fs.readFileSync(path.join(RES, 'fxmanifest.lua'), 'utf8');
  const sets = { server: new Set(), client: new Set(), shared: new Set() };
  for (const [kind, key] of [['server', 'server_script'], ['client', 'client_script'], ['shared', 'shared_script']]) {
    const re = new RegExp(`${key}s?\\s*(\\{[^}]*\\}|'[^']*'|"[^"]*")`, 'g');
    for (const m of raw.matchAll(re)) for (const f of m[1].matchAll(/['"]([^'"]+)['"]/g)) if (!f[1].startsWith('@')) sets[kind].add(f[1]);
  }
  void txt;
  return sets;
}

export function checkNatives() {
  const { db, rpc } = loadNativeDb();
  const manifest = readManifest();
  const files = [...manifest.server, ...manifest.client, ...manifest.shared].filter((f) => f.endsWith('.lua'));
  // Functions / globals the resource defines itself (any file): function X(...), X = function, X = {.
  const own = new Set();
  const codes = {};
  for (const f of files) {
    const p = path.join(RES, f);
    if (!fs.existsSync(p)) continue;
    const code = stripLua(fs.readFileSync(p, 'utf8'));
    codes[f] = code;
    for (const m of code.matchAll(/(?:^|[^.:\w])(?:local\s+)?function\s+([A-Z]\w*)\s*\(/g)) own.add(m[1]);
    for (const m of code.matchAll(/(?:^|\n)\s*(?:local\s+)?([A-Z]\w*)\s*=\s*(?!=)/g)) own.add(m[1]);
    for (const m of code.matchAll(/local\s+([A-Z]\w*(?:\s*,\s*[A-Z]\w*)*)\s*=/g)) for (const n of m[1].split(',')) own.add(n.trim());
  }
  const errors = [], warnings = [], used = new Map();
  for (const [f, code] of Object.entries(codes)) {
    const side = sideOf(f, manifest);
    const lines = code.split('\n');
    let offset = 0;
    for (let ln = 0; ln < lines.length; ln++) {
      const line = lines[ln];
      for (const m of line.matchAll(/(^|[^.:\w])([A-Z][A-Za-z0-9_]*)\s*\(/g)) {
        const name = m[2];
        if (own.has(name) || RUNTIME.has(name) || LUA_STD.has(name)) continue;
        const where = `${f}:${ln + 1}`;
        const nat = db.get(name);
        if (!nat) { errors.push(`${where}: '${name}' is not a documented native, runtime function or own function`); continue; }
        used.set(name, (used.get(name) || 0) + 1);
        const sets = nat.apisets;
        const legal = sets.has('shared') || sets.has(side) || (side === 'server' && rpc.has(name));
        if (!legal) errors.push(`${where}: ${name} is ${[...sets].join('/')}-only but used in a ${side} file`);
        const open = offset + m.index + m[0].length - 1;
        const n = argCount(code, open);
        if (n != null && nat.params != null && !nat.variadic) {
          if (n > nat.params) errors.push(`${where}: ${name} called with ${n} args, declared ${nat.params} (${nat.file})`);
        }
      }
      offset += line.length + 1;
    }
  }
  return { errors, warnings, used: Object.fromEntries([...used].sort()), files: files.length, natives: db.size, rpc: rpc.size };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const r = checkNatives();
  if (process.argv.includes('--json')) { console.log(JSON.stringify(r, null, 1)); process.exit(r.errors.length ? 1 : 0); }
  console.log(`native db: ${r.natives} names, ${r.rpc} server RPC natives; ${r.files} Lua files; ${Object.keys(r.used).length} distinct natives used`);
  for (const w of r.warnings) console.log('  warn  ' + w);
  for (const e of r.errors) console.log('  ERROR ' + e);
  console.log(r.errors.length ? `${r.errors.length} error(s)` : 'natives OK');
  process.exit(r.errors.length ? 1 : 0);
}
