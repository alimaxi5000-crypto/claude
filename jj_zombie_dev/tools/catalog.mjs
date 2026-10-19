// Generates jj_zombie_test/docs/ANIMATION_CATALOG.md from the last animation build
// (build/registry.json + build/report.json). Run after tools/build-anims.mjs.
//   node tools/catalog.mjs
import fs from 'node:fs';
import path from 'node:path';
import { DEV } from './skeletons.mjs';

const RES = path.resolve(DEV, '..', 'jj_zombie_test');
const reg = JSON.parse(fs.readFileSync(path.join(DEV, 'build', 'registry.json'), 'utf8'));
const report = JSON.parse(fs.readFileSync(path.join(DEV, 'build', 'report.json'), 'utf8'));

// What each clip shows and where the game uses it (German, for the catalog).
const DESC = {
  smoke_bob: ['Smoke-Test: nur die Root-Position wippt 3 cm.', '/ztestanim bob'],
  smoke_face: ['Smoke-Test: Bindpose, prüft die Blickrichtung (Root-Konvention).', '/ztestanim face'],
  smoke_wave: ['Smoke-Test: rechter Arm winkt.', '/ztestanim wave'],
  zmove_shamble_walk: ['Schlurfer-Gang: vorgebeugt, rechtes Bein schleift, Arme hängen, Kopf pendelt.', 'Bewegung Schlurfer (alternate walk)'],
  zmove_shamble_idle: ['Schlurfer-Stand: Gewichtsverlagerung, Kopfrucken, Fingerzucken.', 'Bewegung Schlurfer (alternate idle)'],
  zmove_runner_walk: ['Läufer-Gang: schneller, aggressiver, Arme halb vorne.', 'Bewegung Läufer (alternate walk)'],
  zmove_runner_run: ['Läufer-Sprint: weite Schritte mit Flugphase, Klauen nach vorn, Oberkörper weit vorgeneigt.', 'Bewegung Läufer (alternate run)'],
  zmove_runner_idle: ['Läufer-Stand: lauernd, schnelles Atmen, Kopf ruckt.', 'Bewegung Läufer (alternate idle)'],
  zmove_alert_roar: ['Bemerkt den Spieler: reißt Arme und Kopf hoch, Brüllen nach vorn.', 'KI Alerted'],
  zreact_hit_front: ['Treffer von vorn (Oberkörper-Overlay).', 'leichter Treffer'],
  zreact_hit_back: ['Treffer von hinten (Oberkörper-Overlay).', 'leichter Treffer'],
  zreact_stagger_front: ['Schwerer Treffer von vorn: taumelt zwei Schritte zurück.', 'schwerer Treffer'],
  zreact_stagger_back: ['Schwerer Treffer von hinten: taumelt nach vorn.', 'schwerer Treffer'],
  zreact_death_a: ['Tod: sackt auf die Knie (Fußballen) und kippt vornüber.', 'Körpertreffer-Tod (Variante A)'],
  zreact_death_b: ['Tod: setzt sich nach hinten (Fersen) und fällt auf den Rücken.', 'Körpertreffer-Tod (Variante B)'],
  zreact_reach: ['Greifen im Laufen (Oberkörper-Loop), Klauen nach vorn.', 'KI Ready (Ausfallschritt)'],
  zreact_swipe: ['Klauenhieb, Event "hit".', 'Fallback ohne Platz für den Finisher'],
  zreact_getup_back: ['Aufstehen aus Rückenlage nach dem Wegstoßen.', 'eigenes Getup nach Ragdoll'],
  zreact_getup_front: ['Aufstehen aus Bauchlage.', 'eigenes Getup nach Ragdoll'],
  fin_grab: ['Zombie springt aus 1 m an, schlägt beide Hände auf den Schultergürtel (wo er am nächsten ist), reißt das Opfer herum; das Opfer dreht sich mit drei Schritten in den Clinch. 8 Richtungen x m/w.', 'Finisher Start'],
  fin_struggle_low: ['Zombie gewinnt: drückt rein, schnappt zweimal, Arme des Opfers knicken ein.', 'Kampf-Loop (Fortschritt < 35 %)'],
  fin_struggle_mid: ['Ausgeglichen: Hin-und-Her-Drücken, ein harter Schnapper.', 'Kampf-Loop (35-70 %)'],
  fin_struggle_high: ['Spieler gewinnt: Arme durchgestreckt, Zombiekopf nach hinten gedrückt.', 'Kampf-Loop (> 70 %)'],
  fin_shove: ['Erfolg: Ausholen, explosiver Stoß aus den Beinen (Ferse hebt ab), Zombie fliegt zurück (Ragdoll ab "impact"), Opfer schwingt nach und geht in Deckung.', 'Finisher Erfolg'],
  fin_bite: ['Niederlage: Arme knicken ein, Biss in die linke Halsseite mit Reißen, Schrei, Haken an die Schläfe (Zombie fliegt weg ab "impact"), Hand an den Hals.', 'Finisher Niederlage'],
  fin_recover: ['Nur Opfer: Hand am Hals, taumelt, richtet sich auf. Erstes Bild = letztes Bild von fin_bite.', 'nach dem Biss'],
};

const clipsByScene = {};
for (const c of report.clips) (clipsByScene[c.scene] ||= []).push(c);
const sceneMetrics = Object.fromEntries(report.scenes.map((s) => [s.key, s.sceneMetrics]));
const groups = {};
for (const [key, s] of Object.entries(reg.scenes)) (groups[s.name] ||= []).push({ key, ...s });

const fmt = (x, d = 2) => (typeof x === 'number' ? x.toFixed(d) : '-');
const worstOf = (key) => {
  const out = {};
  for (const c of clipsByScene[`${key.includes(':') ? key : key + ':'}`] || clipsByScene[key] || []) {
    for (const [k, v] of Object.entries(c.metrics?.items || {})) {
      const r = v.limit ? v.value / v.limit : 0;
      if (!out[k] || r > out[k].r) out[k] = { r, v: v.value, limit: v.limit, actor: c.actor };
    }
  }
  return out;
};
const sheets = fs.existsSync(path.join(DEV, 'captures', 'lab')) ? fs.readdirSync(path.join(DEV, 'captures', 'lab')) : [];

let md = `# Animationskatalog

Automatisch erzeugt von \`jj_zombie_dev/tools/catalog.mjs\` aus dem letzten Build
(${report.clips.length} Clips, ${Object.keys(reg.scenes).length} Szenen/Varianten, ${Object.keys(reg.build.dicts).length} Dictionaries).
Skelette beim Build: ${Object.entries(reg.build.skeletons).map(([k, v]) => `${k} = ${v}`).join(', ')}.

Alle Clips sind selbst erstellt (Quelltext in \`jj_zombie_dev/anims-src/clips\`), es gibt keinen
Rockstar-Clip in diesem Projekt. Status "Metriken" heißt: alle automatischen Prüfungen des
Builds bestanden (Fußrutschen, Bodenkontakt, Gelenkgrenzen, Geschwindigkeiten, Durchdringung,
Kontaktpunkte, Loop-Nähte, Übergänge). Ob es **im Spiel** gut aussieht, ist damit noch nicht
gesagt: das ist erst nach \`/ztestanim\`, \`/zcapture\` bzw. eigenem Anschauen bestätigt.

| Dictionary | Clips |
|---|---|
${Object.entries(reg.build.dicts).map(([d, n]) => `| \`${d}\` | ${n} |`).join('\n')}

`;
for (const [name, list] of Object.entries(groups)) {
  const first = list[0];
  const [desc, use] = DESC[name] || ['', ''];
  md += `## ${name}\n\n${desc}\n\n- Verwendung: ${use || '-'}\n- Dictionary: \`${[...new Set(list.map((s) => s.dict))].join('`, `')}\`\n`;
  md += `- Dauer: ${fmt(first.duration)} s${first.loop ? ' (Loop)' : ''}; Varianten: ${list.length > 1 || first.variant ? list.map((s) => s.variant || '-').join(', ') : '-'}\n`;
  const evs = Array.isArray(first.events) ? first.events : [];
  if (evs.length) md += `- Events: ${evs.map((e) => `\`${e.name}\` @ ${fmt(e.t)} s`).join(', ')}\n`;
  const actors = Object.entries(first.actors || {}).map(([role, clip]) => `${role}: \`${clip}\``).join(', ');
  md += `- Clips (erste Variante): ${actors}\n`;
  if (first.playback && Object.keys(first.playback).length) md += `- Abspielwerte: ${Object.entries(first.playback).map(([k, v]) => `${k}=${v}`).join(', ')}\n`;
  const w = worstOf(first.key);
  const crit = Object.entries(w).filter(([, v]) => v.limit).sort((a, b) => b[1].r - a[1].r).slice(0, 3);
  if (crit.length) md += `- Knappste Metriken (erste Variante): ${crit.map(([k, v]) => `${k} ${fmt(v.v, 3)} / ${v.limit} (${v.actor})`).join('; ')}\n`;
  const pics = sheets.filter((f) => f.startsWith(name + '_')).slice(0, 4);
  if (pics.length) md += `- Kontaktbögen: ${pics.map((f) => `[${f}](../../jj_zombie_dev/captures/lab/${f})`).join(', ')}\n`;
  md += '\n';
}
md += `## Übergänge (geprüft)\n\n| von | nach | Akteur | max. Winkel | Mover |\n|---|---|---|---|---|\n`;
for (const b of report.blends) md += `| ${b.from} | ${b.to} | ${b.actor} | ${fmt(b.items?.blendAngle?.value)}° | ${fmt(b.items?.blendMover?.value, 3)} m |\n`;
fs.mkdirSync(path.join(RES, 'docs'), { recursive: true });
fs.writeFileSync(path.join(RES, 'docs', 'ANIMATION_CATALOG.md'), md);
console.log(`docs/ANIMATION_CATALOG.md: ${Object.keys(groups).length} clip groups, ${report.blends.length} transitions`);
