# Sicherheit

Grundsatz: Der Client ist feindlich. Er meldet nur **Absichten und Eingaben**, der Server entscheidet.

## Was ein Cheater nicht kann (serverseitig erzwungen und getestet)

| Ziel des Cheaters | Warum es nicht geht | Test |
|---|---|---|
| Finisher gewinnen, ohne zu drücken | Fortschritt entsteht nur aus serverseitig geprüften Tastendruck-Zeitstempeln. Ohne Drücken sinkt er (`DecayPerSecond`) und das Zeitlimit führt zum Biss. | "finisher failure" |
| Mit Autoclicker gewinnen | Mindestabstand 55 ms, höchstens 14 Drücke/s, Regelmäßigkeitsprüfung über 12 Intervalle (Standardabweichung < 2,5 ms = Maschine). Ein gleichmäßiger Klicker fällt auf, **bevor** er gewinnen kann (ein Sieg braucht ~20 Drücke). Danach zählen seine Drücke nicht mehr (`OnSuspicious = 'ignore'`, alternativ `log` oder `kick`). | "autoclicker", "rate cap" |
| Drücke fälschen (Zukunft, doppelt, alt, fremd) | Sequenznummer muss steigen, Zeitstempel steigen streng, dürfen höchstens 400 ms vor der Serveruhr liegen, nicht älter als 2,5 s und nicht nach dem Zeitlimit; höchstens 6 pro Paket, 15 Pakete/s; nur das Opfer dieses Finishers mit der richtigen ID. | "input validation", Fuzz |
| Finisher überspringen | Ergebnis, Schaden und Ende entscheidet der Server-Tick. Ein lokal abgebrochener Clip ändert nichts am Server-Ablauf. Eine Fehlermeldung (`failed`) zählt nur **vor** der Szenen-Bestätigung; danach wird sie ignoriert und der Biss kommt trotzdem. Fehlstart, fehlende Bestätigung (3,5 s) und Ped-Wechsel kosten den Swipe-Schaden, sind also nie ein kostenloser Ausweg. | "abort paths" ("forged abort still ends in the bite") |
| Unbegrenzt spawnen | Rollenprüfung bei **jedem** Befehl (jj_core, sonst ACE). Pro Befehl max. 5, pro Spieler max. 10, global max. 30 lebende. Spawnpunkte vom Client werden gegen die Serverposition geprüft (Ring 8–14 m, Höhe ±12 m, Abstand, NaN/Typen). Eine Anfrage gilt nur einmal (Replay-Schutz) und läuft nach 6 s ab. | "spawn flow" |
| Fremde Spieler in einen Finisher zwingen | Es gibt kein Client-Event, das einen Finisher startet. Start nur durch die Server-KI bzw. `/zfinisher` (Admin, nur für sich selbst). | Fuzz (kein Handler startet einen Finisher) |
| Server mit Events fluten | Rate-Limits pro Spieler: Befehle 6/3 s, Eingaben 15/s, Berichte 8/s, Screenshots 24/5 s. Spieler-Prüfung als erste Zeile jedes Handlers. | "permissions", Fuzz |
| Zombie-Zustand manipulieren | Alle `jjz*`-State-Bags setzt nur der Server (mit `sv_stateBagStrictMode true` können Clients ohnehin nicht schreiben). `ZombieInit` wird nur vom aktuellen Besitzer angenommen und nur einmal. | "spawn flow", "AI chase" |
| Schaden/Biss umgehen | Der Biss wird serverseitig ausgelöst (Stress, Marker, Event), der Schaden über den normalen Spiel-Schaden auf dem Opfer-Client. | siehe unten |

## Checkliste je Netz-Event (Server)

| Event | Spieler gültig | Typen | Zustand | Rate-Limit | Weiteres |
|---|---|---|---|---|---|
| `struggleInput` | Opfer dieses Finishers | finId int, seq int > letzte, presses int-Liste ≤ 6 | Phase Struggle | Input 15/s | Zeitfenster, Mindestabstand, Rate, Regelmäßigkeit |
| `spaceReport` | über Rate-Limit | boolean | – | Reports 8/s | beeinflusst nur Fallback |
| `finClient` | Opfer | finId int, phase ≤ 16 Zeichen | eigener Finisher | Reports | nur `grab` (bestätigen) oder `failed` (Abbruch) |
| `spawnPoints` | gültiger Spieler mit offener Anfrage | reqId, Punkte (Zahlen, keine NaN/Inf) | Anfrage offen, < 6 s | Anfrage verbraucht | Ring-/Höhen-/Abstandsprüfung gegen Serverposition |
| `zombieInit` | aktueller Besitzer | netId int | einmal | Reports | – |
| `captureFrame` | Sitzungsinhaber | id, index 1..120, meta geprüft | offene Sitzung | CaptureFrames 24/5 s | Dateiname nur aus `[A-Za-z0-9_]` |
| `captureDone` | Sitzungsinhaber | id | offene Sitzung | – | – |
| `animReport` | gültig | Tabelle, Strings ≤ 200/64 | – | Reports | nur Log |
| `alignResult` | gültig + Rolle | Zahlen in Grenzen | – | Reports | nur Log |
| `ready` | gültig | – | – | Reports | Vorschläge nur mit Rolle |

Client-Handler für Server-Events prüfen `source == 65535` (`JJZC.fromServer()`). Das ist ein Hinweis, kein Schutz.

## Was clientseitig trotzdem umgehbar ist (ehrlich)

- **Darstellung**: Ein manipulierter Client kann Animationen, Kamera, UI, Blut und Sound bei sich abschalten oder ersetzen, auch die Szene lokal abbrechen. Am Ergebnis ändert das nichts. Den Biss bekommt er trotzdem (der Server entscheidet), und andere Spieler sehen die Szene weiter, weil sie vernetzt ist.
- **Schaden**: Der Biss-Schaden wird auf dem Opfer-Client mit `ApplyDamageToPed` angewendet, damit jj_health ihn als normalen Schaden sieht. Ein Godmode-Cheat verhindert das, wie jeden anderen Schaden im Spiel auch. Stress, "gebissen"-Marker und das Server-Event passieren unabhängig davon.
- **Menschlich schnelle Makros**: Ein Makro mit zufälligen Abständen unter der Ratengrenze von 14/s ist von einem sehr schnellen Menschen nicht zu unterscheiden. Es gewinnt höchstens so schnell wie ein sehr guter Spieler.
- **Platzprüfung**: Den Platzbericht (`spaceReport`) liefert der Client. Ein Cheater kann "kein Platz" melden und bekommt dann den Swipe statt des Finishers. Der Swipe macht ebenfalls Schaden, also gibt es keinen Vorteil.
- **KI-Ausführung**: Der Besitzer-Client führt die Bewegung aus. Ein Cheater als Besitzer kann "seinen" Zombie lokal stehen lassen. Gepackt wird aber nur auf Basis der Serverposition (Sync-Daten), und andere Spieler übernehmen den Zombie, sobald OneSync ihn migriert.
- `/zcapture` speichert Bilder über screenshot-basic in einen Ordner auf dem Server, mit vom Server gebildeten Dateinamen. Nur Admins dürfen es auslösen.
