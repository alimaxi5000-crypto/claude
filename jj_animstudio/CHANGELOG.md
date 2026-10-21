# Changelog

## 0.1.0 (erste Version, im Spiel noch ungetestet)

### Neu: jj_animstudio
- **Studio öffnen:** `/animstudio` öffnet das Studio an deiner Position, `/animstudio close` oder ESC (mit Rückfrage) schließt es. Zugriff nur mit ACE `jj_animstudio.use`, optional über eine jj_core-Rolle.
- **Geist und Overlay:** Dein Ped wird zum halbtransparenten Geist. Darüber liegt das bearbeitbare Skelett mit Kapsel-Körper. Die Skript-Kamera wird vom NUI gesteuert, das Overlay ist der passende Ausschnitt des Spiel-Frustums.
- **Projekte:** Einzel- und Paar-Animationen (lokaler Partner-Ped, Modell wählbar). Öffnen, Umbenennen, Duplizieren, Löschen, Autosave alle 30 s, 10 Sicherungen.
- **Bearbeiten:**
  - Drehringe mit sichtbaren, abschaltbaren Gelenkgrenzen und Knochenbaum
  - IK-Griffe für Hände, Füße, Becken, Blick, Ellbogen- und Kniespitze sowie den Standpunkt
  - Finger-Vorlagen mit Beugung und Spreizung, auf Wunsch jedes Glied einzeln
  - Spiegeln, Pose kopieren/einfügen, Boden-Einrasten, Füße festkleben, Hand an Partner festkleben
  - Rückgängig/Wiederholen (≥ 100 Schritte), Posen-Bibliothek mit 4 Grundposen
- **Zeitleiste:** Rauten pro Körperteil-Gruppe, Auswählen, Ziehen, Kopieren, Löschen, 5 Kurvenarten, Play/Pause/Loop, Tempo 0,1–2×, Onion-Skin, Events mit Dauer.
- **Ampel-Prüfung live:** Fußrutschen, Boden, Gelenke, Tempo, Durchdringung zwischen Akteuren, offene Kontakte, Loop-Naht, Startversatz. Jede Meldung in Klartext, mit Sprung zur Stelle und „Beheben“.
- **Im Spiel testen:** Umwandeln, Neustart der Stream-Resource, echte Peds in je einer Szene am Startpunkt. Steuerung Loop, Tempo, Phase. Mess-Overlay der Kontakte (rot über 3 cm) und Abgleich Overlay ↔ echte Knochen.
- **Fertigstellen:** endgültige `.ycd`, Registry-Eintrag, Bericht `.md`/`.json` mit Lua-Snippet für Einzel-Clip und Paar-Szene.
- **Oberfläche:** auf Deutsch (Englisch über `Config.Locale`), Tooltips, Tutorial in 5 Schritten. Getestet bei 1366×768 bis 3840×2160 (Browser).

### Neu: animkit
- Der Kern aus `jj_zombie_dev/tools` ist als Paket `animkit` herausgelöst (`core/`, `converter/ycdtool`, `cli/`). Die Zombie-Build-Werte bleiben identisch.
- Clip-Dokument `jj-anim/1` mit JSON-Schema, Migration und deutschen Fehlermeldungen. Dazu ein Keyframe-Auflöser (Kurven, Loop, IK, Finger, Blick, Fuß-Sperren, festgeklebte Kontakte).
- `animkit build`, `watch` (Auftragsfluss inbox → outbox → Stream-Resource, Herzschlag, letzte 5 Vorschauen), `doctor`, `import-skeleton`, `check-ycd`, `check-natives`. Startskripte für Windows und Linux, Dienst-Vorlagen.

### Tests
- `bash jj_animstudio/tests/all.sh` umfasst:
  - Lua-Syntax, Natives gegen die offizielle Datenbank, Konsistenz
  - Server- und Client-Logik mit Mocks, dazu Fuzz über alle Events
  - Konverter: Beispiele → `.ycd` → Rücklesen → Weltpose, plus Fehlerfälle
  - echter Konverter-Prozess
  - NUI mit Playwright bei 4 Auflösungen, Klickpfad, exportiertes Dokument baut
  - Kontaktbögen
