# NUI-Vertrag

Die NUI (`html/index.html`, `finisher.css`, `finisher.js`, `sound.js`) zeigt nur an, was Lua
schickt. Sie entscheidet nichts, hat **keinen Fokus** (kein `SetNuiFocus`) und keine
NUI-Callbacks. Eingaben laufen ausschließlich über das Key Mapping `+jjz_struggle` in Lua.

Alle Nachrichten gehen über `SendNUIMessage` (Lua) an `window.addEventListener('message')`.

## Finisher-UI (`finisher.js`)

| `type` | Felder | Wirkung |
|---|---|---|
| `fin:open` | `key` (Text der Taste, max. 3 Zeichen), `progress` 0..100, `timeLimit` s, `text.press`, `text.push`, `ui` (`Position` `bottom`/`center`, `AccentColor`, `DangerColor`, `Vignette`), `thresholds` (`ZombieWinsBelow`, `PlayerWinsAbove`) | Box einblenden, Marker für die Intensitätsstufen, Zeitbalken voll |
| `fin:progress` | `value` 0..100, `danger` 0..1 (optional) | Balkenbreite, rote Färbung ab `danger > 0,62`, Vignette wächst ab `danger > 0,35` |
| `fin:time` | `remainingMs` | Zeitbalken |
| `fin:press` | – | Tastendruck-Animation (70 ms) |
| `fin:result` | `result` (`success` / `bite`), `text` | Box aus, Ergebnis-Schriftzug 1,1 s, Biss: roter Blitz der Vignette |
| `fin:close` | – | alles aus, Vignette zurück |

Alle Werte werden in JS begrenzt (`clamp`). Unbekannte `type`-Werte werden ignoriert.

## Sounds (`sound.js`, prozedural per WebAudio, keine Dateien)

| `type` | Felder | Namen |
|---|---|---|
| `sfx` | `name`, `volume` 0..1, `pitch` | `growl`, `roar`, `grab`, `snap`, `shove`, `punch`, `bite`, `swipe`, `gasp` |
| `loop` | `name`, `on`, `intensity` 0..1, `volume` | `heartbeat`, `breath`, `struggle`; `name = '*'` mit `on = false` stoppt alle |

Wer schickt was (Lua → NUI):

| Zeitpunkt | Nachrichten |
|---|---|
| Grab-Aufprall (Clip-Event `grab_impact`) | `sfx grab`, `sfx roar`, Kamera-Stoß |
| Beginn Ringen | `fin:open`, `loop breath`, `loop struggle`, `loop heartbeat` |
| alle 100 ms beim Ringen | `fin:progress` (lokale Vorhersage, vom Server korrigiert), Lautstärke der Loops |
| Server-Fortschritt (gedrosselt) | `fin:time` |
| jeder Tastendruck | `fin:press` |
| Clip-Event `snap` | `sfx snap` (lauter, wenn der Zombie gewinnt) |
| Clip-Event `bite` | `sfx bite`, `fin:result bite` |
| Clip-Event `impact` | `sfx shove` bzw. `sfx punch`, Zeitlupe |
| Ergebnis Erfolg | `fin:result success` |
| Ende/Abbruch | `fin:close`, alle Loops aus |

## Vorschau ohne Spiel

`html/dev.html` im Browser öffnen. Ein Bedienfeld schickt dieselben Nachrichten, mit
Auto-Spiel, Sounds und Positionen. `jj_zombie_dev/tests/nui.mjs` macht das automatisch bei
1366×768, 1920×1080, 2560×1440, 3440×1440 und 3840×2160 und legt die Screenshots in
`jj_zombie_dev/captures/nui/` ab.
