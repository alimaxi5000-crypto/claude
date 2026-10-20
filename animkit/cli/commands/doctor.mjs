// animkit doctor [--studio dir] [--stream dir]
// Checks everything the converter needs and prints a summary to copy into a message:
// Node, .NET (SDK/runtime 8), CodeWalker build (ycdtool), skeletons, folders, write permissions,
// heartbeat of a running `animkit watch`, and a real test conversion.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadSkeletons, REF_XML, REAL_DIR, VENDOR, ANIMKIT } from '../../core/skeletons.mjs';
import { ycdtoolStatus } from '../../core/pipeline.mjs';
import { newDocument } from '../../core/doc.mjs';
import { buildDocument } from '../../core/docbuild.mjs';
import { resolvePaths } from '../lib/config.mjs';
import { VERSION } from '../lib/jobs.mjs';

export default async function doctor(args) {
  const rows = [];
  const add = (level, name, detail) => rows.push({ level, name, detail });
  const { studio, stream, config } = resolvePaths(args);
  // Node
  const nodeMajor = +process.versions.node.split('.')[0], nodeMinor = +process.versions.node.split('.')[1];
  add(nodeMajor > 20 || (nodeMajor === 20 && nodeMinor >= 10) ? 'OK' : 'FAIL', 'Node.js', `${process.version} (needs 20.10+)`);
  // .NET
  const dn = spawnSync('dotnet', ['--list-runtimes'], { encoding: 'utf8', windowsHide: true });
  if (dn.error || dn.status !== 0) add('FAIL', '.NET', 'dotnet not found (install the .NET 8 SDK)');
  else {
    const rts = dn.stdout.split(/\r?\n/).filter((l) => l.startsWith('Microsoft.NETCore.App ')).map((l) => l.split(' ')[1]);
    const has8 = rts.some((v) => v.startsWith('8.'));
    const sdk = spawnSync('dotnet', ['--list-sdks'], { encoding: 'utf8', windowsHide: true });
    const sdks = (sdk.stdout || '').split(/\r?\n/).filter(Boolean).map((l) => l.split(' ')[0]);
    add(has8 ? 'OK' : 'FAIL', '.NET runtime 8', `runtimes ${rts.join(', ') || 'none'}`);
    add(sdks.some((v) => +v.split('.')[0] >= 8) ? 'OK' : 'WARN', '.NET SDK', `${sdks.join(', ') || 'none'} (only needed to build ycdtool)`);
  }
  // Vendor + ycdtool
  add(fs.existsSync(path.join(VENDOR, 'CodeWalker', 'CodeWalker.Core')) ? 'OK' : 'FAIL', 'CodeWalker.Core', fs.existsSync(path.join(VENDOR, 'CodeWalker')) ? path.join(VENDOR, 'CodeWalker') : 'missing (run animkit/setup.sh)');
  const yt = ycdtoolStatus();
  add(yt.ok ? 'OK' : 'FAIL', 'ycdtool', yt.ok ? yt.path : yt.reason);
  // Skeletons
  add(fs.existsSync(REF_XML) ? 'OK' : 'WARN', 'reference skeleton', fs.existsSync(REF_XML) ? 'Sollumz BoneProperties.xml' : 'missing (run animkit/setup.sh); placeholder skeletons would be used');
  const { info } = loadSkeletons({ quiet: true });
  for (const [k, v] of Object.entries(info)) add(v === 'real' ? 'OK' : v === 'PLACEHOLDER' ? 'FAIL' : 'INFO', `skeleton ${k}`, v === 'real' ? `real (${path.join(REAL_DIR, k + '.json')})` : v);
  // Folders
  const writable = (dir) => {
    try { fs.mkdirSync(dir, { recursive: true }); const f = path.join(dir, `.doctor_${process.pid}`); fs.writeFileSync(f, 'x'); fs.unlinkSync(f); return true; } catch { return false; }
  };
  const hasStudio = fs.existsSync(path.join(studio, 'fxmanifest.lua'));
  add(hasStudio ? 'OK' : 'FAIL', 'jj_animstudio', hasStudio ? studio : `${studio} not found (use --studio or animkit.config.json)`);
  if (hasStudio) {
    for (const d of ['data/inbox', 'data/outbox', 'data/projects']) add(writable(path.join(studio, d)) ? 'OK' : 'FAIL', `write ${d}`, path.join(studio, d));
    const hb = path.join(studio, 'data', 'outbox', '_watch.json');
    let watchState = 'not running (start it with start-watch.bat / start-watch.sh)';
    let lvl = 'WARN';
    if (fs.existsSync(hb)) {
      try { const j = JSON.parse(fs.readFileSync(hb, 'utf8')); const age = (Date.now() - j.time) / 1000; watchState = age < 15 ? `running (pid ${j.pid}, ${age.toFixed(1)} s ago)` : `stale heartbeat (${age.toFixed(0)} s old)`; lvl = age < 15 ? 'OK' : 'WARN'; } catch { /* keep */ }
    }
    add(lvl, 'animkit watch', watchState);
  }
  if (fs.existsSync(stream)) add(writable(path.join(stream, 'stream')) ? 'OK' : 'FAIL', 'jj_animstudio_stream', stream);
  else if (fs.existsSync(path.dirname(stream))) add('INFO', 'jj_animstudio_stream', `${stream} (created by animkit watch on first start)`);
  else add('FAIL', 'jj_animstudio_stream', `${stream}: parent folder does not exist (use --stream or animkit.config.json)`);
  // Test conversion
  if (yt.ok) {
    const { skeletons } = loadSkeletons({ quiet: true });
    const doc = newDocument({ name: 'doctor_test', duration: 0.5 });
    doc.tracks.a.bones = { SKEL_Head: [{ t: 0, rot: [0, 0, 0] }, { t: 0.5, rot: [10, 0, 20] }] };
    const work = path.join(ANIMKIT, 'build', 'doctor');
    const r = buildDocument(doc, { skeletons, skelInfo: info, dict: 'jjs_doctor_test_v1', workDir: work, streamDir: null });
    fs.rmSync(work, { recursive: true, force: true });
    add(r.ok ? 'OK' : 'FAIL', 'test conversion', r.ok ? `${r.ycdBytes} bytes in ${r.timings.totalMs} ms, read back OK` : r.errors.map((e) => e.msg).join(' | '));
  }
  // Report
  const worst = rows.some((r) => r.level === 'FAIL') ? 'FAIL' : rows.some((r) => r.level === 'WARN') ? 'WARN' : 'OK';
  const lines = [
    `animkit doctor ${VERSION} - ${new Date().toISOString()}`,
    `system: ${os.platform()} ${os.release()} ${os.arch()}, animkit at ${ANIMKIT}${config ? `, config ${config}` : ''}`,
    ...rows.map((r) => `${r.level.padEnd(5)} ${r.name.padEnd(22)} ${r.detail}`),
    `RESULT: ${worst}`,
  ];
  console.log('----- copy from here -----');
  console.log(lines.join('\n'));
  console.log('----- copy until here -----');
  return worst === 'FAIL' ? 1 : 0;
}
