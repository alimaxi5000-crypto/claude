# Gesamtbericht jj_animstudio 0.1.x + animkit (Stand 2026-10-20)

Dieser Bericht fasst die erste Version zusammen. Eine neue Sitzung soll damit ohne Vorwissen weiterarbeiten können. Auftrag war `docs/MASTER_PROMPT_ANIMSTUDIO.md` (Phase 2 aus `docs/ANIM_SYSTEM_PLAN.md`).

## 1. Ziel in einem Satz

Der Server-Besitzer (kein Animator) baut eigene GTA-V-Animationen **im Spiel** an einem 3D-Skelett. Der Server wandelt sie automatisch in echte `.ycd`-Dateien um, sie sind sofort am echten Ped testbar, und am Ende entsteht ein Bericht, mit dem Claude sie in Scripts einbaut.

## 2. Stand in Kürze

| Bereich | Stand |
|---|---|
| Studio öffnen, Projekte anlegen, speichern | **im Spiel bestätigt** (nach zwei Fixes, siehe 7) |
| Umwandlung in echte `.ycd` (`animkit watch`) | **im Spiel bestätigt**: Dateien entstehen, werden gestreamt und abgespielt |
| Fertigstellen + Bericht | **im Spiel bestätigt** (Projekte `winkenee` → `jj_winkenee`, `rennen` → `mj_test`) |
| Abspielen über `/animtest` | **im Spiel bestätigt** |
| Alle automatischen Tests | grün (siehe 9) |
| Noch nicht bestätigt bzw. nicht gemeldet | Overlay-Genauigkeit (cm), Abgleich-Werte, Zeit Knopfdruck → Wiedergabe, Paar-Animationen mit 2 Peds, Mess-Overlay, Leistung (FPS/resmon), Kopieren-Knopf |

**Rückmeldung des Besitzers:** „Es funktioniert bis jetzt an sich schon richtig gut … die Animationen werden so, wie ich sie erstelle, gespeichert und als richtige Dateien konvertiert.“ Feinjustierung steht noch aus.

## 3. Wo alles liegt

| Was | Ort |
|---|---|
| Repository (öffentlich) | `C:\Games\claude`, GitHub `alimaxi5000-crypto/claude`, Branch **`claude/new-session-1dlslo`** (kein PR, nur auf Aufforderung) |
| Studio-Resource (Quelle) | `C:\Games\claude\jj_animstudio` |
| Werkzeug (Quelle) | `C:\Games\claude\animkit` |
| **Server (Live-Kopie)** | `C:\Users\PC\Desktop\JAYJAY SCRIPTS\DEVSERVER\txData\JJ CORESERVER\` |
| Studio auf dem Server | `resources\[jj]\jj_animstudio` |
| Stream-Resource (generiert) | `resources\[jj]\jj_animstudio_stream` (nur `fxmanifest.lua` + `stream\*.ycd`) |
| animkit auf dem Server | `txData\JJ CORESERVER\animkit` (mit `animkit.config.json`, `vendor\` ohne `fivem-ref`, `node_modules`, gebautem `ycdtool`) |
| Projekte / Berichte / fertige `.ycd` | `jj_animstudio\data\projects\`, `data\outbox\*.report.md`, `data\outbox\final\*.ycd` |
| server.cfg | Sicherung `server.cfg.before-animstudio`, neue Zeilen siehe 6 |
| Server-Log | `DEVSERVER\txData\default\logs\fxserver.log` |

**Wichtig beim Weiterentwickeln:**
- **Quelle vs. Server:** Gearbeitet wird im Repo, danach werden die geänderten Dateien auf den Server kopiert. Auf dem Server liegen nur Kopien.
- **NUI:** Nach Änderungen in `web/src` immer `node jj_animstudio/tools/build-web.mjs` ausführen und `web/studio.bundle.js` mitkopieren.
- **Neustart im Spiel:** `restart jj_animstudio` in F8 (du als Owner hast Befehlsrechte) oder in der txAdmin-Konsole.

## 4. Aufbau (Kurzfassung, Details in `ARCHITECTURE.md`)

```
NUI (three.js + animkit/core, gebündelt)  --post-->  client/main.lua  --(latent) event-->  server/main.lua
   Overlay, Solver, Ampel live                                                              guard: Recht + Sitzung + Rate-Limit
                                                                                            storage.lua: data/projects (+10 Sicherungen)
                                                                                            jobs.lua: data/inbox/<job>.json
animkit watch (eigener Node-Prozess) <-- inbox      baut + prüft + liest zurück --> jj_animstudio_stream/stream/<dict>.ycd
                                                                                --> data/outbox/<job>.json (+ Bericht bei final)
server/jobs.lua pollt outbox -> StopResource/StartResource(jj_animstudio_stream) -> Ergebnis an Client
client/playback.lua: wartet auf Dict, eine lokale Szene pro Akteur bei Rahmen * origin, Loop/Tempo/Phase, Messung
```

- **animkit:**
  - `core/`: Mathe, Skelett, Rig/IK, Sampler, Metriken, YCD-Schreiber und -Leser. Dazu das Clip-Dokument (`doc`, `schema/`, `joints`, `resolve`), Ampel (`checks`, `fixes`), `docbuild`, `report` und `pipeline`.
  - `converter/ycdtool`: C# mit CodeWalker.Core.
  - `cli/`: `build`, `watch`, `doctor`, `import-skeleton`, `check-ycd`, `check-natives`.
- **Clip-Dokument `jj-anim/1`** (`FORMAT.md`): Keyframes für Mover, Becken, Knochen (Grad in der Gelenk-Basis), IK für Hände und Füße (mit Pole und Gewicht), Finger-Vorlagen, Blick, Fuß-Sperren, Kontakte (festkleben) und Events. Kurven: smooth, fastIn, fastOut, linear, spring, step. Loop schließt der Auflöser selbst.
- **Szenen-Regel aus den Zombie-Spieltests:**
  - **Paare:** Paar-Clips beginnen bei der Identität. Jeder Akteur spielt in einer eigenen Szene bei Rahmen · `origins[akteur]`, beide werden im selben Frame gestartet.
  - **Einzel-Clips:** werden nicht umbasiert. Ein Startversatz wird von GTA ignoriert, die Ampel warnt davor.
- **Vorschau vs. final:** Vorschau-Dicts heißen `jjs_<projekt>_v<n>`, es bleiben die letzten 5. Finale Dicts haben einen freien Namen, dürfen aber nicht mit `jjs_` beginnen.
- **Clip-Namen:** Einzel `<projekt>`, Paar `<projekt>_<akteur>`.

## 5. Bedienung und Befehle

| Befehl | Wirkung |
|---|---|
| `/animstudio` | Studio öffnen (ESC fragt vor dem Schließen) |
| `/animstudio close` | Studio schließen |
| `/animtest <dict> [clip] [loop]` | Clip auf dem eigenen Ped abspielen. Ohne `clip` gilt der Dict-Name ohne `jj_`. |
| `/animtest` | laufenden Test stoppen |
| `node animkit/cli/animkit.mjs doctor` | Umgebung prüfen (kopierbare Zusammenfassung) |
| `animkit/start-watch.bat` | Konverter starten (Fenster offen lassen, startet sich bei Absturz neu) |
| `node animkit/cli/animkit.mjs build <datei.anim.json>` | Dokument von Hand bauen (gleiche Prüfungen) |

**Bisher erstellte Animationen:**

| Projekt | Dict / Clip | Befehl | Hinweis |
|---|---|---|---|
| `winkenee` | `jj_winkenee` / `winkenee` | `/animtest jj_winkenee winkenee` | erste Fassung war eine starre Pose (nur ein Keyframe pro Hand) |
| `rennen` (MJ-Pose) | `mj_test` / `rennen` | `/animtest mj_test rennen` | |

Bedienung im Detail: `BEDIENUNG.md`. Test-Checkliste: `INGAME_TEST.md`.

## 6. Installation auf dem DEVSERVER (erledigt)

- **Kopiert:** `jj_animstudio` → `resources/[jj]/`, `animkit` → `txData/JJ CORESERVER/animkit`.
- **`animkit.config.json`:** zeigt auf `../resources/[jj]/jj_animstudio` und `../resources/[jj]/jj_animstudio_stream`.
- **`animkit doctor`:** OK, nur der Hinweis, dass watch nicht lief. Der Konverter wird inzwischen über `start-watch.bat` gestartet. Er startet **nicht** automatisch mit Windows; dafür gibt es `animkit/service/install-task-windows.ps1`, noch nicht ausgeführt.
- **server.cfg-Zeilen** (Sicherung `server.cfg.before-animstudio`):
  ```
  ensure jj_animstudio_stream   # nach ensure jj_idle
  ensure jj_animstudio
  add_ace group.admin jj_animstudio.use allow
  add_ace group.jj_owner jj_animstudio.use allow
  add_ace group.jj_admin jj_animstudio.use allow
  ```
- **Zugang** zusätzlich über jj_core: `Config.JJCoreRole = 'admin'` nutzt `exports.jj_core:hasRole(src, 'admin')`, owner zählt mit.

## 7. In dieser Sitzung nach dem ersten Spieltest behoben

| Problem (im Spiel) | Ursache | Fix |
|---|---|---|
| „Du hast keine Berechtigung“ trotz Owner | Ursache im Log nicht eindeutig. ACE-Gruppen kommen von jj_core per `add_principal` zur Laufzeit | Zugang zusätzlich über die jj_core-Rolle (`Config.JJCoreRole = 'admin'`), `source` wird in eine Zahl umgewandelt, bei Ablehnung steht der Grund einmal in der Server-Konsole |
| „Speichern fehlgeschlagen (Schreibrechte)“ | `SaveResourceFile` liefert bei Erfolg keinen Boolean `true`; der Code prüfte `== true`. Außerdem legt `SaveResourceFile` keine Ordner an, `data/backups` und `data/poses` fehlten | Jeder wahre Rückgabewert zählt als Erfolg (Mock liefert jetzt `1` wie die echte Native). `animkit watch` legt alle Datenordner an. **Keine** `add_filesystem_permission` nötig: die braucht es nur beim Schreiben in eine fremde Resource (wie `jj_inventory` → `jj_inventory_img`) |
| Animation bewegte sich nicht | Nur ein Keyframe pro Spur, der gilt für die ganze Dauer | Der erste Keyframe einer Spur bei t > 0 setzt jetzt automatisch einen Start-Keyframe bei 0 s mit der alten Pose (IK mit Gewicht 0) |
| Kein schneller Test fertiger Clips | – | neuer Befehl `/animtest` (`client/testcmd.lua`) |

## 8. Offene Punkte / nächste Schritte

**Noch im Spiel zu prüfen** (`INGAME_TEST.md`, `-- VERIFY` im Code, Liste in `KNOWN_ISSUES.md`):
1. **Deckung Overlay ↔ Ped:** vorn, seitlich und am Bildrand. Bestätigt sie die Annahme „vertikales FOV“ der Skript-Kamera?
2. **„Abgleich messen“:** Werte in cm (Ziel ≤ 1 cm).
3. **Zeit Knopfdruck → Wiedergabe:** Ziel ≤ 15 s.
4. **Paar-Animation mit 2 Peds:** Startpunkte, kein 180°-Drehen, Kontakt-Messwerte. Die Messung setzt voraus, dass der `GET_PED_BONE_COORDS`-Versatz im Knochen-Achsensystem liegt.
5. **Leistung:** resmon bei geschlossenem Studio (soll 0,00 ms sein), FPS bei offenem Studio mit 2 Akteuren.
6. **Kleinkram:** Kopieren-Knopf (`execCommand('copy')` im CEF), ESC statt Pausemenü, Geist-Transparenz für andere Spieler sichtbar?
7. **Stream-Neustart:** Funktioniert er auch mit einem zweiten Spieler auf dem Server?

**Feinjustierung und Ideen für 0.2:**
- **Bedienung:** Erfahrungen des Besitzers sammeln, z. B. Ring-Empfindlichkeit, Griffgrößen, welche Panels fehlen oder stören.
- **Echte Skelette:** CodeWalker-XML-Exporte von `mp_m_freemode_01.yft`, `mp_f_freemode_01.yft` und `u_m_y_zombie_01.yft` importieren (`animkit import-skeleton`). Sie bleiben lokal, gitignored. Bisher läuft alles auf dem Referenz-Skelett, das weibliche ist nur angenähert.
- **Fertigstellen:** `.ycd` optional direkt in die Ziel-Resource kopieren. Das bräuchte `add_filesystem_permission jj_animstudio write <ziel>` und Zustimmung, weil es eine fremde Resource ändert. Optional auch eine `clips_data.lua` erzeugen.
- **Assistenten aus dem Plan (P2.6):** Gang-Zyklus, Paar-Griff, Übergang A → B. Dazu Prop-Interaktion.
- **NUI:** komplett englische Oberfläche (zurzeit nur die wichtigsten Texte). Live-Prüfung bei langen Paar-Clips (30 s ≈ 0,7 s) in einen Web-Worker verlagern.
- **Konverter:** als Windows-Aufgabe automatisch starten (`install-task-windows.ps1`).
- **Phase 1 aus dem Plan** (`jj_animtest`-Panel mit Gizmo, Kopierblock `#jjanim`) ist nicht gebaut. Teile davon gibt es im Studio (Test, Messung).

## 9. Tests und Qualität

Ein Befehl für alles (Git Bash funktioniert auf diesem PC):
```
bash jj_animstudio/tests/all.sh          # komplett (~65 s)
bash jj_animstudio/tests/all.sh --quick  # ohne .ycd und Browser
bash animkit/tests/all.sh                # Konverter + Beispiel-Builds
bash jj_zombie_dev/tests/all.sh          # Zombie-Pipeline (nutzt animkit, muss grün bleiben)
```

| Prüfung | Umfang |
|---|---|
| Lua-Syntax, JS-Syntax, Bundle aktuell | alle Dateien |
| Natives | jede gegen citizenfx/natives + native-decls (Name, Seite, Parameterzahl) |
| Konsistenz | Events, Locales de/en, Config-Pfade, Manifest, NUI-Nachrichten/-Callbacks, `guard()` zuerst |
| Server-Logik (Mocks) | 63 Prüfungen inkl. Fuzz mit 3000 zufälligen Events |
| Client-Logik (Stubs) | 33 Prüfungen (Fokus, Kamera-Rahmen, Partner-Whitelist, Szene pro Akteur) |
| Konverter | 77 Prüfungen: Beispiele → `.ycd` → Rücklesen → Weltpose ≤ 2 mm, Fehlerfälle, Auftragsfluss |
| Echter `animkit watch`-Prozess | 16 Prüfungen, Paar-Umwandlung ≈ 0,3 s |
| NUI (Playwright, Mock) | 145 Prüfungen: 4 Auflösungen, Overlay-Deckung, Klickpfad, Export baut |
| Kontaktbögen | `tools/contact-sheets.mjs` → `docs/img/sheet_*.png` |

**Umgebung auf diesem PC:**
- Node 24, .NET 8 Runtime + SDK 10, Lua 5.4 unter `C:\lua\lua.exe` / `luac54.exe` (wird automatisch gefunden).
- Playwright kommt aus `animkit/node_modules`. Fehlt der passende Browser, nimmt der Test die installierte Chromium-Version.

**Hinweis zum Zombie-Build:** Er schreibt die `.ycd` mit anderem Deflate neu (gleicher Inhalt). Vor einem Commit deshalb `git checkout -- jj_zombie_test/stream jj_zombie_dev/captures` ausführen.

## 10. Feste Regeln (aus dem Master-Prompt, gelten weiter)

- **Rockstar-Daten:** keine Rockstar-Dateien ins öffentliche Repo, echte Skelette nur lokal, keine Vanilla-Animationen als Vorlage.
- **Natives:** jede Native gegen die offizielle Quelle prüfen, Unsicheres mit `-- VERIFY:` markieren und in `KNOWN_ISSUES.md` eintragen.
- **Ehrlichkeit:** „ungetestet im Spiel“ klar benennen.
- **Fremde Resources:** nicht ändern. Falls nötig, Sicherung `<datei>.before-animstudio` anlegen und in `INTEGRATION_CHANGES.md` eintragen.
- **server.cfg:** Laut Master-Prompt eigentlich tabu. Auf ausdrücklichen Wunsch („packe die Scripts auf meinen Server und starte sie“) wurden die Zeilen mit Sicherung eingetragen.
- **Git:** nur auf dem Branch arbeiten, kein PR ohne Aufforderung. Antworten auf Deutsch, Code/Kommentare/Commits auf Englisch.

## 11. Commits auf dem Branch

| Commit | Inhalt |
|---|---|
| `7f72a75` | M1 animkit aus jj_zombie_dev herausgelöst |
| `e58036a` | M2 Clip-Dokument, Auflöser, build/watch/doctor |
| `8c926fc` | M3 Studio-Resource (Server, Kamera, Geist, NUI) |
| `199c30e` | M4–M7 Bearbeiten, Zeitleiste, Paare + Ampel, Test, Fertigstellen; Tests |
| `66b7dd0` | M8 Selbstprüfung (Overlay-View-Offset, Render-Stopp), Doku, Windows-Setup |
| `53f6a05` | Zugang über jj_core-Rolle, Ablehnungsgrund im Log |
| `beabe70` | Speichern-Fix (`SaveResourceFile`), Datenordner |
| `39f0c5c` | `/animtest`, automatischer Start-Keyframe |
| (dieser Bericht) | `docs/GESAMTBERICHT_0.1.md` |
