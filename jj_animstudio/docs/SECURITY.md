# Sicherheit

**Grundsatz: Der Client ist feindlich.** Jede Anfrage an den Server kann gefälscht sein: andere Argumente, andere Typen, beliebig oft.

## Prüfungen auf dem Server (`server/main.lua`, `server/storage.lua`, `server/jobs.lua`)

| Prüfung | Umsetzung |
|---|---|
| Recht bei **jedem** Event | `guard()`: ACE `jj_animstudio.use` (oder der jj_core-Hook) als erste Anweisung jedes Handlers. Die Konsistenzprüfung erzwingt das |
| Offene Sitzung | Außer `open` wird jedes Event ohne vorheriges `open` ignoriert. `playerDropped` löscht die Sitzung |
| Rate-Limits pro Spieler und Art | Speichern 2 s, Vorschau 3 s, Fertigstellen 5 s, Posen 1 s, sonst 250 ms (`ConfigServer.RateLimits`) |
| Aufträge | höchstens 1 offener Auftrag pro Spieler, 10 insgesamt, Zeitlimit 60 s |
| Namen | Projekt, Pose und Dict nur `[a-z0-9_]`, Längen begrenzt. Ziel-Resource `[A-Za-z0-9_-]`. Vorschau-Dicts vergibt der Server (`jjs_<name>_v<n>`), der Endname darf nicht mit `jjs_` beginnen |
| Größe | Projekt ≤ 2 MB, Pose ≤ 32 KB. Große Daten laufen über `TriggerLatentServerEvent`/`TriggerLatentClientEvent` |
| Inhalt | JSON wird in `pcall` dekodiert. Präfix `{"format":"jj-anim/1","name":"<name>"`, Format, Typ, Dauer und 1–2 Akteure werden geprüft, der Name im Dokument muss zum Projekt passen |
| Pfade | Alle Pfade baut der Server aus geprüften Namen (`data/projects/<name>.anim.json` …). Kein Pfad und kein Dateiname kommt vom Client |
| Auftragsdatei | Sie wird aus geprüften Namen und dem unveränderten Projekttext zusammengesetzt (kein Neu-Kodieren) |
| Kein Datenleck | `data/` ist nicht in `files {}`. Skelette werden nur an Studio-Nutzer mit Recht gesendet |

## Prüfungen im Konverter (`animkit/cli/lib/jobs.mjs`)

- **Nichts aus der Inbox wird geglaubt:** Auftragsname (`[a-z0-9_]{1,64}`), Auftragsart, Dict-Name und das ganze Dokument (JSON-Schema plus Sinnprüfung) werden erneut geprüft. Unsichere Dateinamen werden verworfen.
- **Pfade** baut der Konverter selbst aus geprüften Namen. Schreiben geschieht atomar (temporäre Datei, dann umbenennen).
- **Jeder Fehler endet als lesbare Antwort** in der Outbox. Der Server meldet Zeitüberschreitungen selbst.

## Client und NUI

- **Server-Operationen:** Das NUI kann nur die in `client/main.lua` freigegebenen Operationen anstoßen (`SERVER_OPS`). Andere werden verworfen (Test).
- **Partner-Modelle** kommen nur aus `Config.PartnerModels`.
- **Studio-Peds** sind lokal (nicht vernetzt) und werden beim Schließen gelöscht.
- **NUI-Text:** Das NUI zeigt Texte als Text an (`textContent`), Projektnamen und Notizen werden nicht als HTML eingesetzt.

## Bewusste Restrisiken

- Jeder Admin mit Recht kann alle Projekte lesen, ändern und löschen (gemeinsames Studio). Gelöschte Projekte bleiben als `data/backups/<name>.deleted.anim.json` erhalten.
- Der Neustart der Stream-Resource betrifft alle Spieler (sie laden die neue `.ycd` nach). Rate-Limit und ein Auftrag pro Spieler begrenzen die Häufigkeit.
- `animkit watch` läuft mit den Rechten des Benutzers, der ihn startet. Er schreibt nur in `jj_animstudio/data`, `jj_animstudio_stream` und `animkit/build`.

## Getestet

`tests/lua/test_server.lua` mit Mocks prüft Rechte, Sitzungen, ungültige Namen (auch `../`), 2-MB-Grenze, falsches Format, Rate-Limits, einen Auftrag pro Spieler und Zeitlimit. Dazu kommt Fuzz: 3000 zufällige Events mit zufälligen Argumenttypen ohne Lua-Fehler. Geschrieben wird nur innerhalb von `data/projects`, `backups`, `poses`, `inbox` und `outbox`. `animkit/tests/converter.test.mjs` prüft pfadartige Dict-Namen, unsichere Dateinamen und kaputte Aufträge.
