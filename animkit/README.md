# animkit

Werkzeug für eigene GTA-V-Animationen (Node 20.10+ und .NET 8). Es läuft auf dem Entwicklungs- bzw. Server-Rechner und ist **keine** FiveM-Resource. Es wird genutzt vom Studio (`jj_animstudio`) und vom Zombie-Build (`jj_zombie_dev`).

## Einrichtung

- **Linux, macOS, Git Bash:** `bash animkit/setup.sh`
- **Windows (PowerShell):** `powershell -ExecutionPolicy Bypass -File .\animkit\setup.ps1`

Das Setup holt folgende Teile an festen Commits nach `vendor/` (gitignored):
- CodeWalker.Core (MIT)
- das Referenz-Skelett (Sollumz `BoneProperties.xml`, GPL-3.0, sha256-geprüft)
- die offiziellen Native-Listen (citizenfx)

Danach baut es `converter/ycdtool` und installiert `three`, `esbuild` und optional `playwright`.

## Befehle

```
node animkit/cli/animkit.mjs help
node animkit/cli/animkit.mjs doctor
node animkit/cli/animkit.mjs watch [--studio dir] [--stream dir] [--once]
node animkit/cli/animkit.mjs build <file.anim.json> [--dict name] [--out dir] [--no-ycd]
node animkit/cli/animkit.mjs import-skeleton <male|female|zombie> <model.yft.xml>
node animkit/cli/animkit.mjs check-ycd <dir|file.ycd>...
node animkit/cli/animkit.mjs check-natives <resourceDir>
```

Pfade für `watch` und `doctor` stehen in `animkit.config.json` (Vorlage: `animkit.config.example.json`). Ohne diese Datei nimmt animkit `../jj_animstudio` und `../jj_animstudio_stream`.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `core/math, skeleton, skelio, rig, scene, author, metrics, ycdxml, ycdreader` | Kern aus `jj_zombie_dev/tools/animcore` (Mathe, Skelett, Rig/IK, Sampler, Metriken, YCD-Schreiber, unabhängiger YCD-Leser) |
| `core/skeletons, placeholder, models` | Skelette laden (echt → Referenz → Platzhalter), Modell → Skelett |
| `core/pipeline` | Export: Startpunkt-Umbasierung, Spuren, XML, ycdtool, Rücklesen inkl. Weltpose, Lua |
| `core/doc, schema/, jsonschema, joints, resolve` | Clip-Dokument `jj-anim/1`: Schema, Prüfung, Gelenk-Basen und -Grenzen, Keyframe-Auflöser |
| `core/checks, fixes, docbuild, report` | Ampel, „Beheben“, Build eines Dokuments, Bericht für Claude |
| `converter/ycdtool` | C#: ycd.xml ↔ .ycd über CodeWalker.Core |
| `cli/` | Befehle, Auftragsfluss (`lib/jobs.mjs`), Playwright-Helfer |
| `examples/` | Beispiel-Dokumente (`make-examples.mjs`) |
| `tests/all.sh` | Konverter-Tests (`converter.test.mjs`), Beispiel-Builds |
| `service/` | systemd-Unit (Linux), Aufgabenplanung (Windows) |

Format-Beschreibung: `jj_animstudio/docs/FORMAT.md`.

## Rechtliches

Keine Rockstar-Dateien im Repository:
- **Echte Skelette** (`skeletons/real/`) entstehen lokal aus deinen eigenen CodeWalker-Exporten und sind gitignored.
- **Vanilla-Animationen** werden nirgends als Vorlage benutzt.
