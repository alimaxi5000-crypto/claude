// NUI tests with Playwright (headless Chromium) on the browser preview (mock backend):
//  1. screenshots at 4 resolutions (projects dialog, editor with a pair, selection + gizmo),
//     layout inside the viewport, readable text sizes, no console errors
//  2. click path: create project -> rotate a bone (ring drag) -> drag an IK handle -> keyframe
//     at another time -> loop -> traffic light shows an error -> "Beheben" -> save
//  3. the exported document builds without errors with animkit (same checks as the studio)
//   node jj_animstudio/tests/nui.mjs   (needs tools/dev-data.mjs output and animkit/setup.sh)
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchBrowser } from '../../animkit/cli/lib/browser.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RES = path.resolve(HERE, '..');
const KIT = path.resolve(RES, '..', 'animkit');
const OUT = path.join(RES, 'docs', 'img');
const TMP = path.join(HERE, 'out');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });
spawnSync(process.execPath, [path.join(RES, 'tools', 'dev-data.mjs')], { stdio: 'ignore' });
const URL = pathToFileURL(path.join(RES, 'web', 'dev', 'index.html')).href;

const browser = await launchBrowser({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }, import.meta.url);
if (!browser) { console.error('playwright not available'); process.exit(2); }
const failures = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) failures.push(m); };

async function openPage(w, h, query = '?notut') {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(URL + query);
  await page.waitForFunction(() => !!window.JJS_STUDIO, null, { timeout: 20000 });
  return { page, errors };
}
const S = (page, fn, arg) => page.evaluate(fn, arg);
async function newProject(page, name, type = 'single') {
  await page.fill('#dialog input[type=text]', name);
  if (type === 'pair') await page.selectOption('#dialog select', 'pair');
  await page.click('#dialog .row.end .btn.accent');
  await page.waitForFunction((n) => window.JJS_STUDIO.S.name === n, name);
  await page.waitForTimeout(400);
}
async function layoutCheck(page, w, h, label) {
  const r = await page.evaluate(() => {
    const box = (s) => { const e = document.querySelector(s); if (!e || e.offsetParent === null) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
    const fs = parseFloat(getComputedStyle(document.querySelector('.btn')).fontSize);
    return { top: box('#top'), left: box('#left'), right: box('#right'), bottom: box('#bottom'), view: box('#view'), dialog: box('#dialog'), fs, scrollW: document.documentElement.scrollWidth, scrollH: document.documentElement.scrollHeight };
  });
  for (const k of ['top', 'left', 'right', 'bottom', 'view']) {
    const b = r[k];
    ok(!!b, `${label}: #${k} visible`);
    if (b) ok(b.x >= -0.5 && b.y >= -0.5 && b.x + b.w <= w + 0.5 && b.y + b.h <= h + 0.5, `${label}: #${k} inside the viewport ${JSON.stringify(b)}`);
  }
  if (r.view) ok(r.view.w > w * 0.35 && r.view.h > h * 0.4, `${label}: 3D view big enough ${JSON.stringify(r.view)}`);
  if (r.dialog) ok(r.dialog.y >= 0 && r.dialog.y + r.dialog.h <= h + 0.5, `${label}: dialog fits ${JSON.stringify(r.dialog)}`);
  ok(r.fs >= 12, `${label}: button text readable (${r.fs}px)`);
  ok(r.scrollW <= w + 1 && r.scrollH <= h + 1, `${label}: no page scrolling (${r.scrollW}x${r.scrollH})`);
}

// ------------------------------------------------------------------ 1. resolutions
for (const [w, h] of [[1366, 768], [1920, 1080], [2560, 1440], [3840, 2160]]) {
  const { page, errors } = await openPage(w, h);
  await page.waitForTimeout(300);
  await layoutCheck(page, w, h, `${w}x${h} projects`);
  await page.screenshot({ path: path.join(OUT, `studio_${w}x${h}_projects.png`) });
  await newProject(page, 'paar_demo', 'pair');
  await S(page, () => window.JJS_STUDIO.select('b', 'SKEL_Head'));
  await page.waitForTimeout(300);
  await layoutCheck(page, w, h, `${w}x${h} editor`);
  ok(!!(await S(page, () => window.JJS_STUDIO.gizmo())), `${w}x${h}: rotation rings shown for the selected bone`);
  // Overlay = sub-rectangle of the full-screen game frustum: the camera target is the screen centre.
  const c = await S(page, () => window.JJS_STUDIO.screenOf(window.JJS_STUDIO.view().cam.target));
  ok(Math.abs(c.x - w / 2) < 1.5 && Math.abs(c.y - h / 2) < 1.5, `${w}x${h}: overlay aligned with the full-screen game camera (target at ${c.x.toFixed(1)}, ${c.y.toFixed(1)})`);
  await page.screenshot({ path: path.join(OUT, `studio_${w}x${h}_editor.png`) });
  ok(!errors.length, `${w}x${h}: console errors: ${errors.join(' | ')}`);
  await page.close();
}
// Tutorial screenshot (first start).
{
  const { page, errors } = await openPage(1920, 1080, '');
  await page.waitForTimeout(300);
  ok(await page.isVisible('#tutorial'), 'tutorial shown on first start');
  await page.click('#dialog .btn.accent').catch(() => {});
  await page.screenshot({ path: path.join(OUT, 'studio_tutorial.png') });
  for (let i = 0; i < 5; i++) await page.click('#tut-next');
  ok(!(await page.isVisible('#tutorial')), 'tutorial closes after 5 steps');
  ok(!errors.length, `tutorial: console errors: ${errors.join(' | ')}`);
  await page.close();
}

// ------------------------------------------------------------------ 2. click path
const { page, errors } = await openPage(1920, 1080);
const docOf = () => S(page, () => JSON.parse(window.JJS_STUDIO.serialize()));
await newProject(page, 'klick_test');
ok((await docOf()).name === 'klick_test', 'click path: project created');
// Select the right forearm by clicking its joint in the 3D view.
await S(page, () => window.JJS_STUDIO.setTime(0.5));
await page.waitForTimeout(150);
const elbow = await S(page, () => { const st = window.JJS_STUDIO; const sol = st.solveAt(st.S.t).a; const sk = st.S.skeletons.male; return st.screenOf(sol.world.P[sk.idx('SKEL_R_Forearm')]); });
await page.mouse.click(elbow.x, elbow.y);
await page.waitForTimeout(150);
ok((await S(page, () => window.JJS_STUDIO.S.selBone)) === 'SKEL_R_Forearm', 'click path: forearm selected by clicking the joint');
// Rotate it by dragging the first ring (bend).
const p0 = await S(page, () => window.JJS_STUDIO.ringScreen(0, 20));
const p1 = await S(page, () => window.JJS_STUDIO.ringScreen(0, 80));
ok(!!p0 && !!p1, 'click path: gizmo ring present');
await page.mouse.move(p0.x, p0.y); await page.mouse.down();
for (let i = 1; i <= 8; i++) await page.mouse.move(p0.x + (p1.x - p0.x) * i / 8, p0.y + (p1.y - p0.y) * i / 8);
await page.mouse.up();
await page.waitForTimeout(150);
let doc = await docOf();
const rk = doc.tracks.a.bones?.SKEL_R_Forearm?.find((k) => Math.abs(k.t - 0.5) < 1e-3);
ok(rk && Math.abs(rk.rot[0] - 12) > 5, `click path: ring drag rotated the forearm (${JSON.stringify(rk)})`);
// Drag the left hand handle (IK).
const hand = await S(page, () => window.JJS_STUDIO.handleScreen('a', 'handL'));
await page.mouse.move(hand.x, hand.y); await page.mouse.down();
for (let i = 1; i <= 6; i++) await page.mouse.move(hand.x - 10 * i, hand.y - 18 * i);
await page.mouse.up();
await page.waitForTimeout(150);
doc = await docOf();
const hl = doc.tracks.a.ik?.handL || [];
ok(hl.length === 2 && hl[0].t === 0 && hl[0].weight === 0 && Math.abs(hl[1].t - 0.5) < 1e-3 && hl[1].weight === 1, `click path: IK key at 0.5 s plus automatic start key at 0 s (${JSON.stringify(doc.tracks.a.ik)})`);
const lhand = await S(page, () => { const st = window.JJS_STUDIO; const sol = st.solveAt(st.S.t).a; return sol.world.P[st.S.skeletons.male.idx('SKEL_L_Hand')]; });
ok(lhand[2] > -0.2, `click path: left hand moved up by IK (${lhand.map((x) => x.toFixed(2))})`);
// Keyframe at another time: click the timeline ruler at 1.5 s, rotate the head.
const x15 = await page.evaluate(() => { const c = document.getElementById('timeline').getBoundingClientRect(); const T = window.JJS_STUDIO.S.doc.duration; return c.left + 118 + (1.5 / T) * (c.width - 118 - 12); });
const tl = await page.evaluate(() => document.getElementById('timeline').getBoundingClientRect().top);
await page.mouse.click(x15, tl + 10);
await page.waitForTimeout(100);
ok(Math.abs((await S(page, () => window.JJS_STUDIO.S.t)) - 1.5) < 0.04, 'click path: timeline ruler sets the time');
await S(page, () => window.JJS_STUDIO.select('a', 'SKEL_Head'));
await page.waitForTimeout(100);
const h0 = await S(page, () => window.JJS_STUDIO.ringScreen(2, 10));
const h1 = await S(page, () => window.JJS_STUDIO.ringScreen(2, 50));
await page.mouse.move(h0.x, h0.y); await page.mouse.down();
for (let i = 1; i <= 8; i++) await page.mouse.move(h0.x + (h1.x - h0.x) * i / 8, h0.y + (h1.y - h0.y) * i / 8);
await page.mouse.up();
doc = await docOf();
const hk = doc.tracks.a.bones?.SKEL_Head?.find((k) => Math.abs(k.t - 1.5) < 0.02);
ok(hk && Math.abs(hk.rot[2]) > 5, `click path: head key at 1.5 s (${JSON.stringify(doc.tracks.a.bones?.SKEL_Head)})`);
// Undo / redo.
const nHist = await S(page, () => window.JJS_STUDIO.S.history.length);
ok(nHist >= 3, `click path: history has the steps (${nHist})`);
await page.keyboard.press('Control+z');
ok(!(await docOf()).tracks.a.bones?.SKEL_Head?.some((k) => Math.abs(k.t - 1.5) < 0.02), 'click path: Ctrl+Z removes the head key');
await page.keyboard.press('Control+y');
ok((await docOf()).tracks.a.bones?.SKEL_Head?.some((k) => Math.abs(k.t - 1.5) < 0.02), 'click path: Ctrl+Y restores it');
// Loop on: the head key at 1.5 s differs from t = 0 -> the resolver closes the seam itself.
await page.click('#chk-loop');
ok((await docOf()).loop === true, 'click path: loop switched on');
// Make the traffic light red: pelvis moves sideways fast -> sliding feet.
await S(page, () => window.JJS_STUDIO.setTime(0.3));
await page.waitForTimeout(100);
const root = await S(page, () => window.JJS_STUDIO.handleScreen('a', 'root'));
await page.mouse.move(root.x, root.y); await page.mouse.down();
for (let i = 1; i <= 8; i++) await page.mouse.move(root.x + 14 * i, root.y + 2 * i);
await page.mouse.up();
await S(page, () => window.JJS_STUDIO.runChecks());
await page.waitForTimeout(150);
const slide = await S(page, () => window.JJS_STUDIO.S.findings.find((f) => f.id === 'a.footSlide'));
ok(slide && slide.level === 'error' && slide.fix, `click path: traffic light reports sliding feet (${slide?.text})`);
const fixBtn = await page.$('#checks .finding.error .btn.accent');
ok(!!fixBtn, 'click path: "Beheben" button shown');
if (fixBtn) await fixBtn.click();
await S(page, () => window.JJS_STUDIO.runChecks());
await page.waitForTimeout(150);
const slide2 = await S(page, () => window.JJS_STUDIO.S.findings.find((f) => f.id === 'a.footSlide'));
ok(slide2 && slide2.value < slide.value * 0.5, `click path: "Beheben" reduced the foot slide (${slide.value} -> ${slide2?.value} m/s)`);
await page.screenshot({ path: path.join(OUT, 'studio_clickpath.png') });
// Save.
await page.keyboard.press('Control+s');
await page.waitForFunction(() => !window.JJS_STUDIO.S.dirty, null, { timeout: 5000 }).catch(() => {});
ok(!(await S(page, () => window.JJS_STUDIO.S.dirty)), 'click path: saved (Ctrl+S)');
const saved = await page.evaluate(() => window.JJS_MOCK_STATE.projects.klick_test?.text);
ok(saved && saved.startsWith('{"format":"jj-anim/1","name":"klick_test"'), 'click path: saved text starts with format + name (server rename prefix)');
// Test in game (mock): result -> playback started.
await page.click('#btn-test');
await page.click('#dialog .btn.accent');
await page.waitForFunction(() => window.JJS_STUDIO.S.test?.stage === 'playing', null, { timeout: 5000 }).catch(() => {});
ok((await S(page, () => window.JJS_STUDIO.S.test?.stage)) === 'playing', 'click path: "Im Spiel testen" reaches playback (mock)');
await page.screenshot({ path: path.join(OUT, 'studio_test.png') });
ok(!errors.length, `click path: console errors: ${errors.join(' | ')}`);
fs.writeFileSync(path.join(TMP, 'klick_test.anim.json'), saved || '{}');
// Closing stops the render loop (0 cost while closed).
await S(page, () => window.postMessage({ type: 'close' }, '*'));
await page.waitForTimeout(100);
ok((await S(page, () => window.JJS_STUDIO.running())) === false, 'closed studio: render loop stopped');
await page.close();
await browser.close();

// ------------------------------------------------------------------ 3. exported document builds
const b = spawnSync(process.execPath, [path.join(KIT, 'cli', 'animkit.mjs'), 'build', path.join(TMP, 'klick_test.anim.json'), '--out', path.join(TMP, 'build')], { encoding: 'utf8' });
ok(b.status === 0, `exported document builds with animkit:\n${b.stdout}\n${b.stderr}`);
ok(/read back OK/.test(b.stdout) || /--no-ycd|checks done/.test(b.stdout), 'exported document: .ycd read back OK');

for (const f of failures) console.log('  FAIL ' + f);
console.log(failures.length ? `NUI: ${failures.length} of ${checks} checks failed` : `NUI OK: ${checks} checks, screenshots in docs/img/`);
process.exit(failures.length ? 1 : 0);
