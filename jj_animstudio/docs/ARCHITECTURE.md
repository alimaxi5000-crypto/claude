# Architektur

## Bausteine

```
animkit/                    Werkzeug (Node 20+ und .NET 8), läuft auf dem Server-Rechner, KEINE FiveM-Resource
  core/                     Mathe, Skelett, Rig/IK, Szenen-Sampler, Metriken, YCD-Schreiber/-Leser (aus jj_zombie_dev)
                            + Clip-Dokument (doc, schema, resolve, joints), Ampel (checks, fixes), Build, Bericht
  converter/ycdtool/        C# mit CodeWalker.Core: ycd.xml -> .ycd
  cli/                      animkit build | watch | doctor | import-skeleton | check-ycd | check-natives
  examples/, tests/
jj_animstudio/              FiveM-Resource: Studio (Lua-Server/-Client + NUI)
jj_animstudio_stream/       wird von animkit watch erzeugt: fxmanifest.lua + stream/*.ycd
jj_zombie_dev/              nutzt animkit (Weiterleitungen in tools/animcore), Zombie-Clips unverändert
```

## Ablauf „Im Spiel testen“

```
NUI (three.js + animkit/core)      Projekt-JSON (Text, "format" und "name" zuerst)
   │ post('server', preview)
   ▼
client/main.lua ── TriggerLatentServerEvent ──► server/main.lua
                                                   │ guard: ACE + Sitzung + Rate-Limit
                                                   │ Storage.inspect (Größe, Präfix, Format, Name)
                                                   │ Storage.write (+ Sicherung)
                                                   │ Jobs.submit: Herzschlag prüfen, Dict jjs_<name>_v<n>
                                                   ▼
                                    data/inbox/<job>.json  (Projekttext unverändert eingebettet)
                                                   │
                     animkit watch (eigener Prozess) ─┘ prüft alles erneut, baut, liest zurück
                                                   │
                     jj_animstudio_stream/stream/<dict>.ycd  +  data/outbox/<job>.json
                                                   │
server/jobs.lua (Poll 500 ms, nur solange Aufträge offen) ── StopResource/StartResource(stream)
                                                   │ Hinweis an alle Studio-Nutzer
                                                   ▼
client ── NUI 'job' ── post('test', start) ── client/playback.lua:
          wartet bis DoesAnimDictExist(dict), lädt, eine lokale Szene pro Akteur bei Rahmen · origin,
          alle Szenen zuerst erstellen, dann alle Peds im selben Frame beauftragen
```

**Zeitbudget:**
- **Konverter:** etwa 0,3 s pro Paar-Clip (gemessen in `tests/watch_flow.mjs`), dazu bis 0,5 s Polling.
- **Neustart:** Stream-Resource 0,2–2 s, danach müssen die Clients die neue Datei laden.
- **Ziel:** Knopfdruck bis Wiedergabe ≤ 15 s. Das Studio zeigt die gemessene Zeit an, im Spiel ungetestet.

## Kamera und Overlay

- **Kamera-Quelle:** Das NUI hält den Kamerazustand (Ziel, Gieren, Nicken, Abstand, Sichtfeld). Es schickt höchstens 30-mal pro Sekunde `{ p, yaw, pitch, fov }` im Szenen-Rahmen an Lua. `client/camera.lua` rechnet in Weltkoordinaten um (`frameToWorld`) und setzt die Skript-Kamera (`SetCamCoord`, `SetCamRot(pitch, 0, Rahmen-Heading + yaw, 2)`, `SetCamFov`).
- **View-Offset:** Das three.js-Bild liegt nur im mittleren Panel. Die three.js-Kamera rendert deshalb mit `setViewOffset` genau den Ausschnitt des bildschirmfüllenden Spiel-Frustums. Der Test prüft: Das Kameraziel liegt bei jeder Auflösung auf der Bildschirmmitte.
- **Sichtfeld:** GTA-Skriptkameras haben vermutlich ein vertikales Sichtfeld wie three.js (`-- VERIFY`, siehe KNOWN_ISSUES).
- **Abgleich-Werkzeug:** Es misst die Knochen des echten Peds mit `GET_PED_BONE_COORDS` gegen das Overlay in derselben Phase. Ziel ≤ 1 cm.

## Peds

- **Akteur a:** Das ist dein eigener Ped. Er steht eingefroren und unverwundbar am Rahmen-Ursprung und ist halbtransparent (`SetEntityAlpha`).
- **Akteur b:** lokaler Ped (`CreatePed(..., isNetwork = false)`). Nur Modelle aus `Config.PartnerModels` sind erlaubt.
- **Folgen der Zeitleiste:** Die Entitäten folgen dem Standpunkt der Zeitleiste, höchstens 10-mal pro Sekunde.
- **Beim Test** sind die Peds deckend und nicht eingefroren, danach wieder Geist.

## Szenen-Regeln (aus den Spieltests übernommen)

- **Startversatz:** GTA setzt einen Ped in einer Synced Scene auf den Ursprung **seiner** Szene und ignoriert den Startversatz im Clip. Paar-Clips beginnen deshalb bei der Identität. Jeder Akteur spielt in einer eigenen Szene bei Rahmen · `origins[akteur]`, beide werden im selben Frame gestartet.
- **Übergänge:** Normal überblenden nur bei gleichem Startpunkt. Bei anderem Startpunkt wird im selben Frame gewechselt (Blend 1000), und zwar nur dort, wo letzte und erste Pose in der Welt gleich sind.
- **Einzel-Clips** werden nicht umbasiert (Wurzelbewegung bleibt im Mover). Einen Startversatz bei 0 s meldet die Ampel als Warnung.

## Leistung

| Zustand | Lua | NUI |
|---|---|---|
| Studio geschlossen | keine Threads (nur Event-Handler), 0,00 ms | Render-Schleife gestoppt, keine Timer-Arbeit |
| Studio offen | 1 Thread mit `Wait(0)`: Pausemenü sperren, HUD aus. Kamera nur bei Änderung | three.js-Render jedes Bild, Solver nur für die aktuelle Zeit (Cache), volle Prüfung 350 ms nach der letzten Änderung |
| Server | Poll-Thread nur, solange Aufträge offen sind (500 ms) | – |

## Dateien und Speicher

| Pfad | Inhalt |
|---|---|
| `data/projects/<name>.anim.json` | Projekt, unverändert wie gesendet |
| `data/projects/_index.json` | Projektliste mit Titel, Typ, Zeit, Größe und Vorschau-Zähler |
| `data/backups/<name>.<1-10>.anim.json` | Die letzten 10 Versionen (Ring), `.deleted` beim Löschen |
| `data/poses/` | Posen-Bibliothek |
| `data/inbox/`, `data/outbox/` | Aufträge und Antworten, Herzschlag `_watch.json`, `final/` und Berichte |
| `data/skeletons/` | Die Skelette, auf denen der Konverter baut. Vom Konverter geschrieben, nur an Studio-Nutzer gesendet |

`data/` steht nicht in `files {}` und wird deshalb nie an Clients verteilt.

## Rechte

- **ACE:** `jj_animstudio.use` wird bei **jedem** Server-Event geprüft.
- **Optionaler Hook:** `editable/server.lua` → `Editable.hasAccess(src)`. Er nutzt `exports.jj_core:hasRole(src, Config.JJCoreRole)`, wenn `Config.JJCoreRole` gesetzt ist.
- **Keine harte Abhängigkeit** von einem Framework.
