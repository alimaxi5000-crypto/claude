# jj_zombie_test

Zombie-Testsystem für den JJ-Server: serverseitig verwaltete Zombies (Schlurfer und Läufer)
mit eigener KI und ein **Finisher**. Der Zombie packt dich, du musst ihn mit
schnellem **E-Drücken** wegstoßen, sonst beißt er zu. Alle Animationen sind **selbst erstellt**
(eigene `.ycd`-Dateien, kein Rockstar-Clip), für männliche und weibliche Charaktere und für
8 Angriffsrichtungen.

## Installation

1. Ordner `jj_zombie_test` nach `resources/[jj]/` kopieren (neben die anderen jj_*-Resources).
2. In der `server.cfg` **nach** den jj-Grundlagen eintragen:

   ```
   ensure jj_core
   ensure jj_health
   ensure jj_gameplay
   ensure jj_needs
   ensure jj_inventory
   ensure jj_characters
   ensure screenshot-basic   # nur für /zcapture
   ensure jj_zombie_test
   ```
   Benötigt OneSync. Getestet ist das Konzept für `sv_stateBagStrictMode true`,
   `sv_filterRequestControl 2` und `onesync_population false`.
3. Rechte: Rolle `admin` in jj_core (einstellbar: `Config.Permissions.MinRole`). Ohne jj_core greift
   ACE: `add_ace group.admin jj_zombie.admin allow`.
4. Server starten und **zuerst** `/ztestanim` ausführen (docs/INGAME_TEST.md, Teil A).

## Befehle (alle nur mit Rolle, serverseitig geprüft, mit Chat-Vorschlägen)

| Befehl | Wirkung |
|---|---|
| `/ztestanim [bob\|face\|wave\|nod\|stop] [self]` | Smoke-Test der eigenen Animationen |
| `/zspawn [1-5] [schlurfer\|laeufer]` | Zombies 8–14 m vor dir (sicherer Boden, Sichtlinie, kein Wasser) |
| `/zclear [alle]` · `/zkill [alle]` | eigene (oder alle) Test-Zombies entfernen / töten |
| `/ztype <schlurfer\|laeufer\|mixed>` | Standardtyp für `/zspawn` |
| `/zfreeze` | KI pausieren / fortsetzen |
| `/zfinisher` | Finisher sofort mit dem nächsten Zombie (≤ 4 m) |
| `/zdebug` | Overlay: Zustand, Ziel, Abstände, Szenenursprung, Greifpunkte |
| `/zcam` | freie Debug-Kamera, 1–4 feste Ansichten |
| `/zalign` | Szenen-Ausrichtung live justieren, Werte ausgeben |
| `/zcapture [grab\|struggle\|shove\|bite\|all]` | Finisher mit festen Kameras fotografieren (screenshot-basic) |
| `/ztune <schlüssel> <wert>` | Konstanten live ändern (`grab`, `ready`, `radius`, `limit`, `press`, `decay`, `grace`, `bite`) |

Die Namen sind in `Config.Commands` änderbar.

## Ablauf eines Finishers

1. Der Zombie kommt auf ~1 m heran (nur der nächste darf packen, andere warten auf Abstand).
2. **Packen**: Sprung, Hände auf die Schultern, du wirst herumgerissen (aus jeder Richtung).
3. **Ringen** (7 s): Taste E (in den GTA-Tastenbelegungen unter FiveM änderbar) schnell drücken.
   Drei Stufen je nach Fortschritt: Er drückt rein / Hin und Her / du stemmst ihn weg.
4. **Erfolg**: Wegstoßen, er fliegt zurück (Ragdoll), du bist sofort frei.
   **Misserfolg**: Biss in den Hals (Blut, Schaden, Stress, Marker "gebissen"), dann schlägst du ihn weg.
5. 4 s Schonfrist, dann kann wieder gepackt werden.

Fortschritt, Zeit, Ergebnis und Schaden entscheidet der **Server** (siehe docs/SECURITY.md).

## Einstellungen

Alles in `config/config.lua` (Spawn, Typen, KI, Finisher-Balance, Effekte, Kamera, Sound, UI,
Clip-Overrides) und `config/config_server.lua` (Anti-Cheat-Schwellen, Rate-Limits, Integration,
Aufnahme-Ordner). Jede Option ist kommentiert.

## Dateien

| Ordner | Inhalt |
|---|---|
| `config/`, `locales/` (de, en) | Einstellungen und Texte |
| `shared/` | Konstanten, Validatoren, Clip-Registry (`clips_data.lua` wird generiert) |
| `server/` | Zombies, KI-Logik, Finisher, Schaden, Besitz, Befehle, Aufnahme |
| `client/` | KI-Ausführung, Bewegung, Finisher-Ablauf, Kamera, Effekte, Sound, Werkzeuge |
| `integration/` | alle Aufrufe an jj_*-Resources, mit Fallbacks |
| `html/` | Finisher-UI und prozedurale Sounds; `dev.html` = Browser-Vorschau |
| `stream/` | `jjz_test`, `jjz_move`, `jjz_react`, `jjz_fin_m`, `jjz_fin_f` (.ycd, generiert) |
| `docs/` | Architektur, Animations-Pipeline, Katalog, Sicherheit, NUI, Performance, Ingame-Test, bekannte Punkte |

Die Werkzeuge zum Erstellen und Prüfen der Animationen (Generator, Browser-Labor, Tests) liegen in
`jj_zombie_dev/` und werden **nicht** mit der Resource ausgeliefert: docs/ANIMATION_PIPELINE.md.

## Für andere Resources

`exports.jj_zombie_test:isInFinisher(src)`, `exports.jj_zombie_test:isBitten(src)`, lokale
Server-Events `jj_zombie:server:bitten` und `jj_zombie:server:finisherEnded`, Player-State
`jjz_bitten` (Details: docs/INTEGRATION_CHANGES.md).
