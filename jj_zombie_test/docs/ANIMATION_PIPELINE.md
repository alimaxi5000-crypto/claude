# Animations-Pipeline: eigene Animationen erschaffen

Alle Animationen dieses Projekts sind **selbst erzeugt**: Sie werden als JavaScript-Quelltext
beschrieben (Posen über die Zeit), mathematisch auf das GTA-Ped-Skelett gelöst, geprüft und als
echte `.ycd`-Dateien geschrieben. Es wird kein Rockstar-Clip kopiert oder verändert.

```
 anims-src/clips/*.mjs ──► tools/build-anims.mjs ──┬─► Metriken (Fußrutschen, Gelenke, Durchdringung …) ── Fehler = Abbruch
  (Posen über die Zeit)     Rig/IK auf dem Skelett │
                                                   ├─► build/xml/*.ycd.xml ──► ycdtool (CodeWalker.Core) ──► jj_zombie_test/stream/*.ycd
                                                   │                                          │
                                                   │      eigener unabhängiger Leser (ycdreader.mjs) ◄──────┘ Rücklesen + Vergleich
                                                   ├─► jj_zombie_test/shared/clips_data.lua (Clip-Registry)
                                                   └─► animlab/data (Labor), build/report.json, build/registry.json
```

## 1. Werkzeuge, Versionen, Lizenzen, Orte

Alles liegt unter `jj_zombie_dev/`, nichts davon wird mit der Resource ausgeliefert.

| Werkzeug | Version / Stand | Lizenz | Ort | Wofür |
|---|---|---|---|---|
| Node.js | ≥ 18 (getestet 22.22) | MIT | System | Build, Labor, Tests |
| .NET SDK | 8.0 (getestet 8.0.132) | MIT | System | baut `tools/ycdtool` |
| CodeWalker.Core | Commit `485d56bec00262ed7fa472261cce7bbc6202b96e` | MIT (Notice.txt) | `tools/vendor/CodeWalker` (setup.sh) | schreibt/liest binäre `.ycd` |
| Sollumz `tools/BoneProperties.xml` | Commit `e124bddf…`, sha256 `6e482934…173be` | GPL-3.0 | `tools/vendor/sollumz` (setup.sh) | Referenz-Skelett (nur gelesen) |
| three.js | 0.169.0 (npm, sha512 im Lockfile) | MIT | `tools/node_modules` → ins Labor gebündelt | 3D im Labor |
| esbuild | 0.24.0 (npm) | MIT | `tools/node_modules` | bündelt das Labor (offline, keine CDNs) |
| citizenfx/natives | Commit `3432156872ba…` | ohne Lizenzdatei | `tools/vendor/fivem-ref/natives` | Native-Prüfung (nur gelesen) |
| citizenfx/fivem (ext/native-decls, ext/natives) | Commit `580b25c85d07…` | Rockstar Creator Platform License | `tools/vendor/fivem-ref/fx` | Native-Prüfung (nur gelesen) |
| Lua 5.4 | 5.4.6 | MIT | System | Lua-Tests |
| Playwright + Chromium | vorinstalliert in der Cloud-Umgebung; lokal optional | Apache-2.0 | – | NUI-/Labor-Screenshots |

Einrichtung (einmal): `bash jj_zombie_dev/tools/setup.sh` (Git Bash unter Windows). Das Skript
klont CodeWalker und die Native-Referenzen auf feste Commits, prüft den Hash der Referenz-Skelett-
Datei, baut `ycdtool` und installiert die npm-Pakete exakt nach Lockfile.

## 2. Skelette

Der Build nimmt pro Rolle (`male`, `female`, `zombie`) das beste vorhandene Skelett:

1. **Echt**: `anims-src/skeletons/real/<rolle>.json`, importiert aus deinen Spieldateien
   (empfohlen, siehe unten). Git-ignoriert, weil aus Rockstar-Daten abgeleitet.
2. **Referenz**: GTA-Ped-Skelett aus Sollumz' `BoneProperties.xml`. Für `female` gilt eine
   *Näherung* (Knochenlängen skaliert, Becken abgesenkt).
3. Platzhalter (nur für Tests ohne Setup, deutlich als PLACEHOLDER markiert).

Echtes Skelett importieren:
1. CodeWalker öffnen, `mp_m_freemode_01.yft` suchen (Suche im RPF-Explorer), Rechtsklick → **Export XML**.
   Dasselbe für `mp_f_freemode_01.yft` und `u_m_y_zombie_01.yft`.
2. `node tools/import-skeleton.mjs male  <pfad>/mp_m_freemode_01.yft.xml`
   `node tools/import-skeleton.mjs female <pfad>/mp_f_freemode_01.yft.xml`
   `node tools/import-skeleton.mjs zombie <pfad>/u_m_y_zombie_01.yft.xml`
   Das Werkzeug zeigt Knochenzahl, Höhe und die Abweichung zur Referenz.
3. `node tools/build-anims.mjs`: Alle Clips werden neu auf die echten Skelette gelöst.

Wurzel-Konvention: Im GTA-Bindpose ist `SKEL_ROOT` um 180° gedreht. Der Importer setzt die
neutrale Wurzel-Rotation auf Identität. `/ztestanim face` beweist das im Spiel: Der Klon muss
**dich ansehen**. Schaut er weg, `calib.rootNeutral` in der JSON auf `[0,0,1,0]` setzen.

## 3. Das Quelldatei-Format

Jede Datei in `anims-src/clips/` exportiert eine oder mehrere **Clip-Quellen**:

| Feld | Bedeutung |
|---|---|
| `dict` | Dictionary = Dateiname in `stream/` (nur `a-z 0-9 _`), oder Funktion `(variant) => name` |
| `name` | Registry-Name. Clip-Name = `name[_variante][_akteur]` |
| `duration`, `loop` | Sekunden; Loops werden auf Nahtsprünge geprüft |
| `actors` | Rollen → Skelett, z. B. `{ ped: 'male' }` oder `{ victim: 'male', zombie: 'zombie' }` |
| `variants` | optional, z. B. Geschlecht/Richtung: `{ suffix, skel: { rolle: skelett }, meta }` |
| `events` | `[{ name, t }]`: landen in der Registry, das Spiel reagiert darauf (Sound, Kamera, Ragdoll …) |
| `pose(t, ctx)` | liefert die Pose zur Zeit `t` (pro Akteur). `ctx.at(akteur, bone, offset)` gibt die **gelöste** Position eines Knochens des anderen Akteurs (Kontakte, Griffe) |
| `limits`, `actorLimits`, `airborne`, `noGround`, `allowSelfContact` | Metrik-Schwellen pro Clip (Begründung als Kommentar) |
| `contacts`, `allowTouch` | Pflichtkontakte (z. B. Hand auf Schulter ≤ 12 cm) und erlaubte Berührungen |
| `leadsTo`, `follows` | Übergänge, deren End-/Startposen der Build vergleicht |
| `playback` | Vorgaben für `TaskPlayAnim` (blendIn, blendOut, flags) |
| `only` | nur bestimmte Spuren exportieren (z. B. `['SKEL_ROOT:pos']`) |

Die Pose ist eine Beschreibung in **Steuergrößen**, nicht in Knochenrotationen:

| Steuerung | Inhalt |
|---|---|
| `mover` | `{ p:[x,y,z], yaw }`: Position/Drehung der Entität (Wurzelbewegung) |
| `root` | `{ p, bend, side, twist }`: Becken-Versatz und Neigung (Radiant; bend > 0 = vor) |
| `spine`, `chest`, `pelvis`, `neck`, `head` | `{ bend, side, twist }`, Wirbelsäule verteilt |
| `look` | `{ target:[x,y,z], weight }`: Kopf/Nacken zielen auf einen Punkt |
| `clav.L/R` | `{ up, fwd }`: Schulter heben / nach vorne |
| `arm.L/R` | `{ target, space: 'scene'|'body'|'shoulder', pole, wrist:{flex,dev,twist}, palm:{fingerDir,palmDir,weight}, fingers:{curl,claw,spread,thumbOpp} }`: Zwei-Knochen-IK |
| `leg.L/R` | `{ target, foot:{yaw,pitch,roll}, toe, pivot:{kind:'heel'|'toe', ax, ay}, swing }`: Bein-IK mit exakten Fersen-/Ballen-Drehpunkten |
| `rootReach` | `{ bone, offset, target, weight, max }`: verschiebt die Wurzel, bis ein Punkt (z. B. der Mund) ein Ziel erreicht |

Hilfen in `anims-src/lib/kit.mjs` und `tools/animcore/author.mjs`:
- `K([[t, wert, ease], …])` Keyframes mit Easing, `KC` Catmull-Rom (auch periodisch), `impulse`, `bump`, `wobble`
- `plantedFoot(plants)`: Füße setzen, mit Fersenaufsatz, Abrollen, Drehen auf dem Ballen und Schwungbogen; Positionen werden pro Skelett exakt aufgelöst
- `gait(cfg)`: periodischer Gang mit Mover (Schrittlänge, Standphase, Schwung, Wippen)
- `grip(kontakt, fingerRichtung, handflächenRichtung)`: Hand auf eine Oberfläche legen
- `mixPose(a, b, w)`: überblendet zwei Posen stufenlos (auch zwischen Zielräumen)
- Haltungs-Vokabular: `zombieSpine`, Finger `CLAW`, `GRAB`, `FIST`, `FLAT`, `LIMP`

## 4. Bauen, Prüfen, Ansehen

| Befehl | Was passiert |
|---|---|
| `node tools/build-anims.mjs` | alles bauen; Exit-Code 1 bei jedem Metrik-Fehler |
| `node tools/build-anims.mjs --only <name> --no-ycd` | schnell eine Quelle prüfen |
| `node tools/diag.mjs <name> [variante]` | pro Frame: schnellster Knochen, Fußhöhen, Handflächen-Warnungen |
| `node tools/build-lab.mjs`, dann `animlab/index.html` doppelklicken | Labor (offline) |
| `node tools/lab-capture.mjs --scene <name> --cams side,front --grid 4x3 [--source ycd]` | Kontaktbogen als PNG nach `captures/lab/` |
| `node tools/catalog.mjs` | `docs/ANIMATION_CATALOG.md` neu erzeugen |
| `bash tests/all.sh` | alle automatischen Prüfungen |

Geprüfte Metriken (Grenzen in `tools/animcore/metrics.mjs`, pro Clip änderbar):
Fußrutschen an Ferse und Ballen, Boden-Durchdringung, Schweben, Winkel- und Lineargeschwindigkeit
(Pop-Erkennung), Ellbogen/Knie-Überstreckung, Nacken, Wirbelsegmente, Handgelenk-Knick und
-Drehung, Selbstdurchdringung, Loop-Naht (Pose und Mover), Durchdringung zwischen den Akteuren
(Kapseln), Pflichtkontakte, Übergänge zwischen Clips. Zusätzlich warnt der Build, wenn eine
gewünschte Handflächen-Richtung unnatürlich wäre.

Rücklesen: Jede geschriebene `.ycd` wird mit dem eigenen Leser (`tools/animcore/ycdreader.mjs`,
unabhängig von CodeWalker) vollständig gelesen und gegen die Quelldaten verglichen (Clips,
Dauer, Frames, Flags, Bone-Tags, Rotationen ≤ 0,05°, Positionen ≤ 0,5 mm). Das Labor kann mit
**Quelle: .ycd** genau die Datei abspielen, die das Spiel lädt.

## 5. Ins Spiel bringen

- Der Build schreibt `stream/<dict>.ycd` (FiveM streamt den Ordner automatisch) und die Registry
  `shared/clips_data.lua`. Code spielt Clips nur über die Registry ab:
  `Anim.play(ped, 'name', variante, opts)` für Einzel-Clips, `Clips.entry(name, variante)` für Szenen.
- Ersetzen ohne Codeänderung: `Config.ClipOverrides['name'] = { dict = '…', clip = '…' }`.
- Nach einem Build die Resource neu starten (`ensure jj_zombie_test`). Neue `.ycd` lädt der
  Client erst nach einem Neustart der Resource (Streaming).

## 6. Durchgespieltes Beispiel: `smoke_nod` von null bis ins Spiel

Ziel: eine neue, einfache Animation, ein langsames Kopfnicken als Loop, abspielbar mit
`/ztestanim nod`. Schritte 1–5 wurden genau so durchgeführt, die Ausgaben stammen aus dem echten
Lauf. Schritt 6 ist die **erwartete** Ausgabe im Spiel; sie ist noch nicht im Spiel geprüft.

**Schritt 1: Quelldatei anlegen**, `jj_zombie_dev/anims-src/clips/example_nod.mjs`:

```js
import { K } from '../../tools/animcore/author.mjs';

const T = 2.0;                                  // seconds; the loop repeats every 2 s
// Nod curve over time: [time, value, ease]. Starts and ends at 0 -> seamless loop.
const nod = K([[0, 0], [0.35, 1, 'inOut'], [0.6, -0.2, 'inOut'], [0.85, 0.8, 'inOut'], [1.2, 0, 'inOut'], [T, 0]]);

export default {
  dict: 'jjz_test',                             // .ycd file name (stream/jjz_test.ycd)
  name: 'smoke_nod',                            // registry name = clip name (single actor)
  duration: T, loop: true,
  actors: { ped: 'male' },                      // one actor on the male skeleton
  playback: { blendIn: 4.0, blendOut: -4.0, flags: 1 },   // flags 1 = loop (TaskPlayAnim)
  pose: (t) => ({                               // rig controls in radians (bend > 0 = forward)
    neck: { bend: 0.25 * nod(t) },
    head: { bend: 0.35 * nod(t) },
    spine: { bend: 0.04 * nod(t) },
  }),
};
```

**Schritt 2: schnell prüfen**: `node tools/build-anims.mjs --only smoke_nod --no-ycd` → `0 problem(s)`.

**Schritt 3: bauen**: `node tools/build-anims.mjs`

```
  jjz_test.ycd: 8176 bytes, 4 clips, 4 animations
5 dictionaries, 74 clips, 48 scenes, 0 problem(s)
  jjz_test.ycd  8176 bytes  4 clips (read back OK)
```

Rücklesen von `smoke_nod`: größte Rotationsabweichung 0,024°, Loop-Naht 0.

**Schritt 4: ansehen** (aus der echten `.ycd`): `node tools/build-lab.mjs` und
`node tools/lab-capture.mjs --scene smoke_nod --cams side --grid 4x2 --source ycd`
→ `jj_zombie_dev/captures/lab/smoke_nod_side_ycd.png` (8 Bilder, der Kopf nickt zweimal).

**Schritt 5: im Spiel erreichbar machen**: `/ztestanim` kennt die Namen `bob|face|wave|nod`:
in `client/testanim.lua` und `server/commands.lua` `nod` zur erlaubten Liste hinzugefügt, Hilfetext
in `locales/locales.lua`. Bei einem eigenen Feature stattdessen einfach
`Anim.play(ped, 'smoke_nod')` aufrufen.

**Schritt 6: Resource neu starten** (`ensure jj_zombie_test`) und `/ztestanim nod` eingeben. Vor
dir erscheint eine Kopie deines Charakters und nickt; im Chat steht
`OK: jjz_test/smoke_nod läuft (Dauer 2.00 s, erwartet 2.00 s)`.

**Schritt 7: Ergebnis prüfen**: Sieht die Bewegung anders aus als im Labor, `/zcapture` bzw.
Screenshots machen und mit dem Kontaktbogen vergleichen (siehe INGAME_TEST.md).

## 7. Paar-Szenen und Ausrichtung

- Paar-Szenen (`fin_*`) werden in einem gemeinsamen Szenen-Rahmen gebaut (Opfer bei 0, Blick +Y). Kontakte
  werden gegen die **gelöste** Pose des anderen Akteurs gerechnet (`ctx.at`, drei Durchgänge pro
  Frame). Deshalb passen Griffe für männliche und weibliche Opfer automatisch.
- Feinjustierung pro Akteur: `anims-src/align.json`
  `{ "<szene>": { "<variante>" | "*": { "<akteur>": { "dx": 0, "dy": 0, "dz": 0, "dyaw": 0 } } } }`.
  Die Werte kommen aus dem Labor (Ausrichtungs-Editor → Export) oder aus `/zalign` im Spiel
  (Server-Konsole: `zalign result … x= y= z= yaw=`). Danach neu bauen. Die IK hält die Kontakte.
- `/zalign` im Modus "Szene" speichert zusätzlich einen Laufzeit-Versatz der ganzen Szene (KVP auf
  deinem Client), ohne Neubau.

## 8. Format-Details der `.ycd` (geschrieben über CodeWalker.Core)

- Spuren: 0 Knochen-Translation, 1 Knochen-Rotation, 5 Mover-Translation, 6 Mover-Rotation. BoneIds nach `boneId | (track << 16)` sortiert.
- Rotationen sind lokale Rotationen relativ zum Elternknochen, mit Vorzeichen-Kontinuität. Statische Spuren haben w ≥ 0.
- Paar-Szenen (mehr als ein Akteur): Jeder Clip beginnt bei der Identität. Die Bewegung relativ zum Mover in Bild 0 wird in `SKEL_ROOT` eingebacken (`root' = M(0)⁻¹ · M(t) · root(t)`), die Mover-Spuren sind konstant Identität. Der Mover in Bild 0 (Position + Gierwinkel im Szenen-Rahmen) steht als `origins[akteur] = { x, y, z, yaw }` im Register (`shared/clips_data.lua`), der Client startet den Akteur dort in einer eigenen Szene. Grund (Spieltests 1 und 2): GTA setzt einen Ped auf den Ursprung seiner Szene und ignoriert den Startversatz im Clip. Die Weltposen bleiben gleich: `S · M(t) · root(t) = (S · M(0)) · (M(0)⁻¹ · M(t) · root(t))`. Der Build prüft das an den dekodierten `.ycd`-Daten (Abweichung > 2 mm = Fehler) und dass Loops und ihre Nachfolger dieselben Startpunkte haben. Pro Quelle abschaltbar mit `rebaseMover: false`.
- Animations-Flag 16 = Wurzelbewegung vorhanden. `SequenceFrameLimit = Frames + 30`.
- Clip-/Dict-Namen klein, Hash `joaat` (kleingeschrieben). 30 fps.

## 9. Fehlersuche

| Symptom | Ursache / Lösung |
|---|---|
| `/ztestanim`: "dictionary … does not exist" | Datei fehlt in `stream/` oder die Resource wurde nach dem Build nicht neu gestartet |
| Figur schaut beim `face`-Test weg | Wurzel-Konvention: `calib.rootNeutral` (Abschnitt 2) |
| Arme/Beine verdreht | Bone-Tags passen nicht zum Skelett → echtes Skelett importieren (Abschnitt 2) |
| Build meldet `footSlide`/`angVel` | `node tools/diag.mjs <name>` zeigt Frame und Knochen; Schritte/Kurven anpassen |
| Hand "dreht durch" | Build-Warnung "implausible palm target": `tools/handprobe.mjs` zeigt die natürliche Handrichtung |
