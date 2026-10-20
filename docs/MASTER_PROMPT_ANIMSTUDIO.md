# Master-Prompt: `jj_animstudio` Version 1 (Animations-Studio im Spiel)

> Diesen gesamten Text in eine neue Claude-Code-Sitzung auf diesem Repository einfügen.

---

Du bist Senior-FiveM-Entwickler und Animations-Pipeline-Ingenieur. Baue die **erste lauffähige Version** von `jj_animstudio`: ein Animations-Studio **im Spiel**. Damit erstelle ich (Server-Besitzer, kein Animator) eigene GTA-V-Animationen. Diese werden auf meinem Server automatisch in echte `.ycd`-Dateien umgewandelt, sind sofort am echten Ped testbar, und am Ende entsteht ein kurzer Bericht für Claude zum Einbinden in Scripts.

Antworte mir auf **Deutsch**. Code, Kommentare und Commit-Nachrichten auf **Englisch**.

## 1. Lies zuerst (Pflicht, bevor du etwas schreibst)

1. `docs/ANIM_SYSTEM_PLAN.md`: Gesamtplan, Phase 2 ist dein Auftrag. Abweichungen nur mit Begründung.
2. `jj_zombie_dev/`: funktionierende Animations-Pipeline. Wiederverwenden, nicht neu erfinden:
   - `tools/animcore/` (Mathe, Skelett, Rig/IK, Metriken, YCD-XML, unabhängiger YCD-Leser);
   - `tools/build-anims.mjs` (Build, Rücklesen, Weltpose-Prüfung, Registry);
   - `tools/ycdtool/` (C#, CodeWalker.Core: XML → `.ycd`), `tools/setup.sh`, `tools/import-skeleton.mjs`;
   - `animlab/` (three.js-Labor), `tests/` (Mocks, `all.sh`).
3. `jj_zombie_test/`: Beispiel einer fertigen Resource, die eigene Clips nutzt (Registry `shared/clips_data.lua`, `client/anim.lua`, `client/finisher.lua` für Paar-Szenen). Dazu `docs/ARCHITECTURE.md` (Abschnitt „Szenen-Rahmen und Startpunkte“), `docs/ANIMATION_PIPELINE.md`, `docs/KNOWN_ISSUES.md` und `CHANGELOG.md`.
4. Offizielle Quellen für **jede** Native: `github.com/citizenfx/natives`, `citizenfx/fivem` → `ext/native-decls`, `docs.fivem.net`. Keine Native, Parameter-Reihenfolge oder Export erfinden. Nicht verifizierbares mit `-- VERIFY:` markieren und in `KNOWN_ISSUES.md` aufführen.

## 2. Harte Regeln

- `server.cfg` änderst du nicht. Nötige Zeilen schreibst du mir in die Anleitung.
- Keine Rockstar-Dateien weiterverbreiten oder in neue Dateien kopieren. Das Repository ist **öffentlich**:
  - **Erlaubt:** echte Skelettdaten (aus meinen CodeWalker-Exporten) lokal lesen.
  - **Nicht ins Repo:** solche Daten nie committen (`.gitignore`). Auch keine Vanilla-Animationen als Vorlage übernehmen.
- Ehrlichkeit vor Ehrgeiz: Was du nicht im Spiel prüfen kannst, nennst du „ungetestet im Spiel“. Nichts als funktionierend bezeichnen, was nur vermutet ist.
- Keine Fremd-Resources ändern. Falls unvermeidbar: Backup `<datei>.before-animstudio` und Eintrag in `INTEGRATION_CHANGES.md`.
- Nur auf dem vorgegebenen Branch entwickeln und pushen. Keine Pull Requests ohne meine Aufforderung.

## 3. Grundlagen, die in der Praxis bewiesen wurden (nicht wieder falsch machen)

1. **Es gibt keine Native, um Ped-Knochen zur Laufzeit zu setzen.** Es gibt nur Getter: `GET_PED_BONE_COORDS`, `GET_ENTITY_BONE_ROTATION`, `GET_PED_BONE_MATRIX`, `GET_ENTITY_BONE_INDEX_BY_NAME`. Deshalb wird im **NUI an einem eigenen 3D-Skelett** bearbeitet, und die echte Vorschau entsteht über eine echte `.ycd`.
2. **Startversatz:** GTA setzt einen Ped in einer Synced Scene auf den Ursprung seiner Szene und ignoriert den Startversatz im Clip. Daraus folgt:
   - **Clip:** Paar-Clips beginnen bei der Identität (Mover konstant, Bewegung im `SKEL_ROOT`).
   - **Registry:** Pro Akteur steht dort `origins = {x, y, z, yaw}`.
   - **Wiedergabe:** Jeder Akteur spielt in einer **eigenen** Szene bei Szenen-Rahmen · Startpunkt. Beide Szenen werden im selben Frame gestartet.
   - **Übernahme:** Das macht `build-anims.mjs` schon so; übernimm diese Logik.
3. **Übergänge:**
   - **Normal überblenden:** nur bei gleichem Entitäts-Rahmen (gleicher Startpunkt).
   - **Wechsel in einem Frame** (Blend 1000): bei anderem Startpunkt, wenn letzte und erste Pose in der Welt identisch sind.
4. **Blickrichtung:** Heading 0 = +Y, gegen den Uhrzeigersinn. Modellraum +X rechts, +Y vorn, +Z oben. Quaternionen `[x, y, z, w]`.
5. **YCD-Spuren:** 0 = Knochen-Position, 1 = Knochen-Rotation, 5 = Mover-Position, 6 = Mover-Rotation. `boneId` 0 = Root/Mover. 30 fps. Clip- und Dict-Namen klein, `[a-z0-9_]`.
6. **Einmal-Rücklesen:** Jede geschriebene `.ycd` wird mit dem **unabhängigen** Leser zurückgelesen. Daraus berechnete Weltposen werden mit der Quelle verglichen; mehr als 2 mm Abweichung ist ein Fehler.
7. **Streaming:** Eine neu gestreamte oder geänderte `.ycd` kann im Client gecacht sein. Deshalb bekommt jede Vorschau einen **neuen Dict-Namen mit Version** (`jjs_<projekt>_v<n>`).

## 4. Was Version 1 können muss

### 4.1 Für mich im Spiel (`jj_animstudio`, nur Admins: ACE `jj_animstudio.use`)

- **`/animstudio`** öffnet das Studio an meiner Position, **`/animstudio close`** schließt es; ESC fragt vorher nach.
  - **Wenn geschlossen:** 0,00 ms resmon.
  - **Geist und Overlay:** Der echte Ped wird halbtransparent („Geist“). Das bearbeitbare Skelett mit einfachem Kapsel-Körper (kein Rockstar-Modell) liegt exakt darüber.
- **Projekte:**
  - **Typen:** Neu als **Einzel-Animation** oder **Paar-Animation** (2 Akteure, Partner-Modell wählbar, lokal gespawnt, nicht vernetzt).
  - **Verwaltung:** Öffnen, Umbenennen, Duplizieren, Löschen. Gespeichert wird **automatisch alle 30 s** auf dem Server.
  - **Rückgängig/Wiederholen:** mindestens 100 Schritte.
- **3D-Ansicht** (Maus):
  - **Kamera:** um den Ped kreisen, zoomen, schwenken; feste Ansichten (vorn, seitlich, oben, Schulter).
  - **Knochen anklicken:** Drehringe erscheinen (Achsen farbig, Gelenkgrenzen sichtbar und standardmäßig aktiv, abschaltbar). Knochenliste als Baum zur Auswahl.
  - **IK-Griffe** für Hände, Füße, Becken und Kopfblick: Ziehen bewegt die Kette natürlich (vorhandenen Rig/IK-Solver nutzen), Ellbogen- und Knie-Richtung ist ziehbar.
  - **Finger:** pro Hand Vorlagen (entspannt, Faust, offen, greifen, zeigen, Klaue) plus Regler für Beugung und Spreizung, optional jedes Glied einzeln.
  - **Hilfen:** Spiegeln links ↔ rechts (ganze Pose oder Auswahl), Pose kopieren/einfügen, Boden-Einrasten, „Füße festkleben“ (Bereich in der Zeitleiste), bei Paar-Animationen „Hand an … festkleben“ (Kontakt bleibt beim Weiterbearbeiten).
- **Zeitleiste:**
  - **Keyframes:** Rauten pro Körperteil-Gruppe, anklicken, ziehen, kopieren, löschen.
  - **Kurvenart per Klick:** weich, schnell rein, schnell raus, gleichmäßig, federnd.
  - **Wiedergabe:** Play/Pause/Loop, Tempo 0,1–2×, Onion-Skin (vorige/nächste Pose als Schatten).
  - **Loop-Knopf:** Ende = Anfang, mit sauberer Naht. Dazu Event-Marker mit Namen (z. B. `impact`), Dauer einstellbar.
- **Posen-Bibliothek:** eigene Posen speichern und anwenden, plus mitgelieferte Grundposen (Stand, Hocke, Kampfstellung, Greifen).
- **Ampel-Prüfung live** (vorhandene Metriken aus `animcore/metrics.mjs`):
  - **Prüfpunkte:** Fußrutschen, Boden-Durchdringung, Gelenkgrenzen, zu schnelle Drehungen, Durchdringung zwischen Akteuren, offene Kontakte.
  - **Jede Meldung:** Klartext auf Deutsch, Sprung zur Stelle, und wo möglich ein **„Beheben“**-Knopf (z. B. Fuß festkleben, Winkel begrenzen).
- **„Im Spiel testen“:**
  - **Ablauf:** Der Server wandelt um (siehe 4.2), danach spielt der **echte** Ped (bei Paar: beide echten Peds) die echte `.ycd`.
  - **Steuerung:** Loop, Tempo, Phase.
  - **Overlay:** Mess-Overlay mit Abstand der Kontaktpunkte in cm, gemessen mit Getter-Natives, rot über 3 cm.
  - **Ziel:** Knopfdruck bis Wiedergabe ≤ 15 s.
- **„Fertigstellen“:**
  - **Eingaben:** Name, Ziel-Resource und Dict-Name.
  - **Ergebnis:** endgültige `.ycd`, Registry-Eintrag und Bericht (siehe 4.3), zum Kopieren und als Datei.
- **Oberfläche:** auf Deutsch, dunkel und klar, große Knöpfe, Tooltips mit einem Satz Erklärung. Kurzes Einstiegs-Tutorial (5 Schritte, überspringbar). Funktioniert bei 1366×768 bis 3840×2160.

### 4.2 Konverter (`animkit`, kein FiveM-Code, Node 20+ und .NET 8 auf dem Server-Rechner)

**Kern herauslösen:** Aus `jj_zombie_dev/tools` den Kern als eigenständiges Paket `animkit/` herauslösen (`core/`, `converter/` mit `ycdtool`, `cli/`). `jj_zombie_dev` muss danach weiter funktionieren: `tests/all.sh` grün, gleiche Prüfwerte.

**Clip-Dokument `jj-anim/1`:** wie in `docs/ANIM_SYSTEM_PLAN.md` 4.1 (Akteure, Keyframes für Mover/Knochen/IK/Finger/Blick, Fuß-Sperren, Kontakte, Events). Dazu:
- JSON-Schema mit Prüfung und Versionsfeld für spätere Migrationen;
- Keyframe-Auflöser (Keyframes → Einzelbilder → Rig/IK-Solver → Frames).

**CLI-Befehle:**
- **`animkit watch`:** eigener Prozess, wird mit dem Server gestartet; Startskripte für Windows (`.bat`) und Linux (`.sh`), dazu eine Anleitung für txAdmin. Er beobachtet `jj_animstudio/data/inbox/`, baut jeden Auftrag, schreibt die `.ycd` nach `jj_animstudio_stream/stream/` und das Ergebnis nach `data/outbox/<job>.json`. Jeder Fehler endet als lesbare Meldung im Studio, nie stilles Hängen.
- **`animkit doctor`:** prüft Node, .NET, CodeWalker-Build, Skelette, Schreibrechte und Ordner, und gibt eine Zusammenfassung zum Kopieren aus.
- **`animkit build <datei.anim.json>`:** Build von Hand, gleiche Prüfungen wie im Studio.

**Stream-Resource `jj_animstudio_stream`** (generiert, nur `fxmanifest.lua` + `stream/`):
- **Neustart:** Der Server startet sie nach einem Build neu (`StopResource`/`StartResource`).
- **Ohne Neuverbindung:** Bei jeder Vorschau neuer Dict-Name mit Version. Alte Vorschau-Dicts aufräumen (die letzten 5 behalten).

**Skelette:**
- **Standard:** das Referenz-Skelett aus `jj_zombie_dev` (Sollumz `BoneProperties.xml`, wie bisher).
- **Echte Skelette:** per `animkit import-skeleton` aus meinen CodeWalker-XML-Exporten, nur lokal unter `animkit/skeletons/real/` (gitignored).
- **Bericht:** Er nennt das verwendete Skelett.

### 4.3 Bericht für Claude (`data/outbox/<name>.report.md` + `.json`)

- **Grunddaten:** Name, Dict, Clip pro Akteur, Dauer, Loop, Events mit Zeitpunkt, Startpunkte (`origins`), verwendetes Skelett.
- **Prüfung:** Ampel mit Werten, Rücklese- und Weltpose-Ergebnis.
- **Einbau:** Ziel-Resource und fertiges Lua-Snippet für den Einbau, für Einzel-Clip (`TaskPlayAnim`) und Paar-Szene (zwei vernetzte Szenen nach Regel 3.2, Vorladen der Dicts).
- **Notizen:** meine Notizen aus dem Studio.

### 4.4 Technische Vorgaben

- **Overlay-Kamera:**
  - **Kamera-Quelle:** Das Studio steuert eine eigene Skript-Kamera. Das NUI ist die Quelle der Kamera-Werte und schickt sie an Lua (≤ 30/s), damit Spielbild und three.js-Overlay deckungsgleich sind. Wie GTA das Sichtfeld angibt (vertikal/horizontal), prüfst du und markierst es als `VERIFY`.
  - **Abgleich-Werkzeug:** Overlay-Knochen gegen `GET_PED_BONE_COORDS` des echten Geist-Peds messen und die Abweichung anzeigen (Ziel ≤ 1 cm im Stand).
- **Netzwerk:**
  - **Studio-Peds:** lokal, nicht vernetzt.
  - **Neustart der Stream-Resource:** betrifft alle Spieler. Deshalb kurzer Hinweis im Studio, im Code dokumentiert.
- **Daten vom Client:**
  - **Grundsatz:** Der Client ist feindlich.
  - **Server-Prüfungen:** Admin-Recht bei **jedem** Event, Größenlimit pro Projekt (z. B. 2 MB, `TriggerLatentServerEvent` für große Daten), Namen nur `[a-z0-9_]`, alle Pfade baut der Server selbst, Rate-Limits, kein Pfad vom Client.
- **Speicher:** Projekte unter `jj_animstudio/data/projects/<name>.anim.json` (`SaveResourceFile`/`LoadResourceFile`), Liste und Backups (letzte 10 Versionen pro Projekt).
- **Leistung:**
  - **Geschlossen:** keine Threads mit `Wait(0)`.
  - **Offen:** Overlay und Solver im NUI, Lua nur Kamera und Peds; 60 fps Ziel mit 2 Akteuren auf Mittelklasse-Hardware.
- **Struktur:** `fxmanifest.lua` (cerulean, lua54), `config/config.lua` (alles einstellbar, kommentiert), `locales/de.lua` + `en.lua`, `client/`, `server/`, `shared/`, `web/` (NUI, ohne Build-Schritt oder mit eingechecktem Build). Event-Namen als Konstanten `jj_animstudio:server:*` / `:client:*`.
- **Abhängigkeiten:** keine harten Abhängigkeiten auf Frameworks. Rechte über ACE; optionaler jj_core-Hook im offenen `editable/`-Teil.

## 5. Qualität und Tests (alles in einem Befehl, `tests/all.sh` im Studio-Projekt)

- **Statische Prüfungen:** Lua-Syntax, JS-Syntax, Native-Prüfung (jede Native existiert, richtige Seite, Parameterzahl; das Werkzeug aus `jj_zombie_dev/tools/check-natives.mjs` wiederverwenden), Konsistenz (Events, Locales, Config-Pfade, Manifest).
- **Konverter-Tests:**
  - **Dokument → `.ycd` → Rücklesen → Weltpose:** für Einzel- und Paar-Beispiel, Gang-Zyklus mit Loop-Naht, Finger-Vorlagen und Kontakt „festkleben“.
  - **Fehlerfälle:** kaputtes JSON, falsche Version, unbekannter Knochen, zu groß, Name ungültig → saubere Meldung.
- **Server-Logik mit Mocks** (wie `jj_zombie_dev/tests/lua/mock.lua`): Rechte, Größenlimits, Namen, Rate-Limits, Auftragsfluss inbox → outbox → Neustart, Fuzz auf alle Events.
- **NUI mit Playwright** (Chromium ist vorinstalliert):
  - **Bilder:** Screenshots bei 4 Auflösungen.
  - **Klickpfad ohne Konsolenfehler:** Projekt anlegen → Knochen drehen → IK ziehen → Keyframe setzen → Loop → Prüfung zeigt Fehler → „Beheben“ → speichern.
  - **Ergebnis:** Exportiertes Dokument baut fehlerfrei.
- **Selbst prüfen:** Kontaktbögen der Beispiel-Clips ansehen, bevor du sie mir als fertig meldest.
- **Ehrlichkeit:** Am Ende eine Tabelle: geprüft automatisch / geprüft nur in Mocks / ungetestet im Spiel.

## 6. Doku (Deutsch)

- **`README.md`:** Installation Schritt für Schritt für Anfänger, inkl. Node/.NET, `animkit doctor`, `animkit watch` als Dienst, ACE-Zeilen zum Selbst-Eintragen.
- **`docs/BEDIENUNG.md`:** Bedienung mit Bildern aus den Playwright-Screenshots, Tastenkürzel, „Deine erste Animation in 5 Minuten“.
- **Technische Doku:** `docs/ARCHITECTURE.md`, `docs/FORMAT.md` (Clip-Dokument `jj-anim/1`), `docs/SECURITY.md`, `docs/KNOWN_ISSUES.md`.
- **Test-Checkliste:** `docs/INGAME_TEST.md` mit nummerierten Tests im Spiel.
- **`CHANGELOG.md`:** Eintrag 0.1.0.

## 7. Ablauf

1. Lesen (Abschnitt 1), dann eine **kurze** Plan-Bestätigung an mich mit Meilensteinen (max. 15 Zeilen). Danach **ohne weitere Rückfragen** bauen, außer bei echten Blockern.
2. **M1:** `animkit` herauslösen, `jj_zombie_dev` weiter grün.
3. **M2:** Clip-Dokument + Auflöser + `animkit build/watch/doctor` + Stream-Resource-Ablauf (in Mocks).
4. **M3:** Studio-Gerüst: Befehl, Rechte, Speichern/Laden, Kamera, Geist-Ped, NUI mit 3D-Skelett-Overlay.
5. **M4:** Bearbeiten: Drehringe, IK-Griffe, Finger, Spiegeln, Undo, Posen-Bibliothek.
6. **M5:** Zeitleiste, Keyframes, Kurven, Loop, Events, Onion-Skin.
7. **M6:** Paar-Animationen, Kontakte festkleben, Ampel-Prüfung mit „Beheben“.
8. **M7:** „Im Spiel testen“ (Konvertieren → echter Ped), Mess-Overlay, „Fertigstellen“ + Bericht.
9. **M8:** Tests, Doku, Selbst-Review (Sicherheit, Leistung, Natives), Commit und Push nach **jedem** Meilenstein.
10. **Abschlussbericht** auf Deutsch:
    - was fertig ist, was nur in Mocks geprüft ist, was ungetestet im Spiel ist;
    - wie ich installiere und das Studio starte;
    - **was ich dir schicken muss**: `animkit doctor`-Ausgabe, Ergebnisse der In-Game-Tests, Screenshots, und falls noch nicht da, die CodeWalker-XML-Exporte von `mp_m_freemode_01.yft`, `mp_f_freemode_01.yft`, `u_m_y_zombie_01.yft`.

Starte jetzt mit Schritt 1 aus Abschnitt 7.
