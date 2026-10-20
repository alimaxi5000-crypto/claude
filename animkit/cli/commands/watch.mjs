// animkit watch [--studio <jj_animstudio dir>] [--stream <jj_animstudio_stream dir>] [--once] [--interval ms]
// Job converter for the in-game studio. Runs as its own process next to the FXServer (started
// with the server: start-watch.bat / start-watch.sh). Polls jj_animstudio/data/inbox/, builds
// every job and writes the .ycd to jj_animstudio_stream/stream/ and the result to
// data/outbox/<job>.json. Every failure ends as a readable message in the outbox; a heartbeat
// (data/outbox/_watch.json) lets the studio show "converter not running" instead of waiting.
import fs from 'node:fs';
import path from 'node:path';
import { loadSkeletons, ANIMKIT } from '../../core/skeletons.mjs';
import { ycdtoolStatus } from '../../core/pipeline.mjs';
import { studioPaths, ensureFolders, processJobFile, writeHeartbeat, VERSION } from '../lib/jobs.mjs';
import { resolvePaths, opt } from '../lib/config.mjs';

const stamp = () => new Date().toISOString().replace('T', ' ').slice(0, 19);
const log = (...a) => console.log(`[animkit ${stamp()}]`, ...a);

export default async function watch(args) {
  const { studio, stream } = resolvePaths(args);
  if (!fs.existsSync(path.join(studio, 'fxmanifest.lua'))) {
    console.error(`jj_animstudio not found at ${studio}. Pass --studio <path> or set "studio" in animkit/animkit.config.json.`);
    return 1;
  }
  const P = studioPaths(studio, stream);
  ensureFolders(P);
  const st = ycdtoolStatus();
  if (!st.ok) log(`WARNING: ${st.reason}. Jobs will fail with a message until it is built.`);
  const { skeletons, info } = loadSkeletons({ quiet: true });
  const skelInfo = info;
  log(`animkit watch ${VERSION} | studio ${studio} | stream ${stream}`);
  log(`skeletons: ${Object.entries(info).map(([k, v]) => `${k}=${v}`).join(', ')}`);
  const workRoot = path.join(ANIMKIT, 'build', 'jobs');
  fs.mkdirSync(workRoot, { recursive: true });
  const interval = Math.max(100, +(opt(args, '--interval') || 250));
  const once = args.includes('--once');
  let lastBeat = 0, stop = false, busy = null;
  const beat = () => { try { writeHeartbeat(P, { busy, skeletons: info, ycdtool: st.ok }); } catch (e) { log('heartbeat failed:', e.message); } lastBeat = Date.now(); };
  process.on('SIGINT', () => { stop = true; });
  process.on('SIGTERM', () => { stop = true; });
  beat();
  do {
    let files = [];
    try { files = fs.readdirSync(P.inbox).filter((f) => f.endsWith('.json')).map((f) => path.join(P.inbox, f)); } catch (e) { log('inbox not readable:', e.message); }
    files.sort((a, b) => { try { return fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs; } catch { return 0; } });
    for (const f of files) {
      busy = path.basename(f, '.json');
      beat();
      const t0 = Date.now();
      let r;
      try { r = processJobFile(P, f, { skeletons, skelInfo, workRoot }); } catch (e) {
        log(`job ${busy}: unexpected error ${e.stack || e.message}`);
        try { fs.writeFileSync(path.join(P.outbox, `${busy}.json`), JSON.stringify({ job: busy, ok: false, errors: [{ code: 'internal', msg: `Interner Fehler im Konverter: ${e.message}` }] })); fs.unlinkSync(f); } catch { /* ignore */ }
      }
      if (r) log(`job ${r.job ?? busy}: ${r.ok ? 'OK' : 'FAILED'} ${r.dict || ''} in ${Date.now() - t0} ms${r.ok ? '' : ' - ' + (r.errors || []).map((e) => e.msg).join(' | ')}`);
      busy = null;
    }
    if (Date.now() - lastBeat > 3000) beat();
    if (once) break;
    await new Promise((res) => setTimeout(res, interval));
  } while (!stop);
  try { fs.unlinkSync(P.heartbeat); } catch { /* ignore */ }
  log('stopped');
  return 0;
}
