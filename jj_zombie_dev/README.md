# jj_zombie_dev

Entwickler-Werkzeuge für `jj_zombie_test` (werden nicht ausgeliefert).
Ausführliche Anleitung: `../jj_zombie_test/docs/ANIMATION_PIPELINE.md`.
Der Animations-Kern (Mathe, Skelett, Rig/IK, Metriken, YCD-Schreiber/-Leser, Export-Pipeline) liegt seit dem Studio in `../animkit/` und wird hier nur benutzt.

| Ordner / Datei | Inhalt |
|---|---|
| `anims-src/clips/*.mjs` | Quelltext aller Animationen (Posen über die Zeit) |
| `anims-src/lib/kit.mjs` | Füße, Gang, Griffe, Haltungen, Posen-Überblendung |
| `anims-src/align.json` | Ausrichtungs-Versätze pro Szene/Akteur (aus Labor oder `/zalign`) |
| `anims-src/skeletons/real/` | importierte echte Skelette (git-ignoriert) |
| `tools/build-anims.mjs` | Build: lösen, prüfen, `.ycd` schreiben, zurücklesen, Registry, Labordaten |
| `tools/animcore/` | Weiterleitungen auf `../animkit/core/` (Rig/IK, Metriken, YCD-XML-Writer, unabhängiger YCD-Leser, Mathe) |
| `../animkit/converter/ycdtool/` | XML ↔ `.ycd` über CodeWalker.Core (.NET 8), gemeinsam mit dem Studio |
| `tools/import-skeleton.mjs` | echtes Skelett aus einem CodeWalker-"Export XML" übernehmen |
| `tools/check-natives.mjs` | jede Native gegen die offizielle Datenbank prüfen (Prüfer: `animkit/cli/check-natives.mjs`) |
| `tools/catalog.mjs` | `docs/ANIMATION_CATALOG.md` erzeugen |
| `tools/diag.mjs`, `tools/handprobe.mjs` | Fehlersuche pro Frame / Handausrichtung |
| `tools/lab-capture.mjs` | Kontaktbögen aus dem Labor (headless) |
| `tools/setup.sh` | einmalige Einrichtung: ruft `animkit/setup.sh` auf (feste Commits, Hash-Prüfung) und installiert die Labor-Pakete |
| `animlab/index.html` | Browser-Labor (offline): Quelle oder `.ycd` abspielen, Metriken, Ausrichtung, Kontaktbogen |
| `animlab/captures.html` | Kontaktbogen aus `/zcapture`-Bildern (Drag & Drop) |
| `tests/all.sh` | alle automatischen Prüfungen in einem Befehl |
| `captures/lab/`, `captures/nui/` | Bilder aus Labor und NUI-Test; `/zcapture` schreibt nach `captures/` |
