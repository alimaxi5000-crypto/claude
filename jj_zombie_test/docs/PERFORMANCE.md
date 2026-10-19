# Performance

## Gemessen (automatisch, `jj_zombie_dev/tests/all.sh`)

Die Messungen laufen mit gemockten Natives unter Lua 5.4. Sie zeigen die Kosten **unseres
Lua-Codes** und zählen Native-Aufrufe, Thread-Aufwachvorgänge, Speicher und Netzwerkvolumen.
Echte Native-Kosten und die Lua-Laufzeit von FiveM sind **nicht** enthalten. Die endgültige
Zahl liefert nur `resmon 1` im Spiel (siehe INGAME_TEST.md).

### Server (`tests/lua/bench_server.lua`)

| Zombies | Spieler | CPU je KI-Tick | CPU je Sekunde | State-Bag-Updates | Client-Events |
|---|---|---|---|---|---|
| 0 | 0 | – | 0,003 ms | 0 | 0 |
| 10 | 2 | 0,054 ms | 0,21 ms | 4,4/s (~0,1 KB/s) | 0/s |
| 30 | 4 | 0,16 ms | 0,63 ms | 14,8/s (~0,3 KB/s) | 0/s |
| 100 | 8 | 0,49 ms | 1,95 ms | 49/s (~1,1 KB/s) | 0/s |

- Speicher: ~3 KB Lua-Zustand pro Zombie (inklusive Mock-Entität).
- Netzwerk: Es werden nur **Änderungen** in State Bags geschrieben (Zustand, Ziel, Tempo, Slot, Unstuck). Events gehen nur an das Opfer (Finisher-Fortschritt gedrosselt auf ≤ 10/s, bei unverändertem Wert 1/s) und an den Besitzer (Befehle, Knockback).

### Client-Manager (`tests/lua/bench_client.lua`, alle Zombies im Besitz des lokalen Spielers)

| Zombies | Lua je Frame (60 fps) | Thread-Aufwachvorgänge | Native-Aufrufe |
|---|---|---|---|
| 0 (Leerlauf) | 0,0006 ms | 5/s | 6/s |
| 10 | 0,0044 ms | 10/s | 721/s (~12 je Frame) |
| 30 | 0,012 ms | 10/s | 2145/s (~36 je Frame) |
| 100 | 0,039 ms | 10/s | 7088/s (~118 je Frame) |

**Schätzung** für das Spiel: Ein Native-Aufruf kostet in FiveM grob 0,5–2 µs.

| Fall | Erwartung |
|---|---|
| 10 aktive Zombies | ≈ 0,004 ms Lua + 12 × ~1 µs ≈ **0,015–0,03 ms pro Frame**, also ~0,002–0,003 ms pro Zombie. Ziel "unter 0,01–0,02 ms pro Zombie" ist rechnerisch erfüllt. |
| Leerlauf | ≈ **0,00 ms** in resmon: 5 Aufwachvorgänge pro Sekunde mit je einer Handvoll Natives, kein Thread pro Frame |

## Bauweise

- Ein einziger Manager-Thread pro Client für alle Zombies (`client/ai.lua`, 150 ms Takt). Natives werden nur für Zombies aufgerufen, die man besitzt oder sieht.
- Per-Frame-Threads gibt es nur, solange sie gebraucht werden: Finisher des eigenen Spielers (Steuerung sperren, Szenenphase, Eingabe), `/zdebug`, `/zcam`, `/zalign`, `/zcapture`.
- Bewegungs-Clips über `SET_PED_ALTERNATE_MOVEMENT_ANIM`: einmal pro Ped, keine laufenden Anim-Tasks.
- Animations-Dicts werden mit Referenzzähler geladen und wieder freigegeben. Partikel-Assets werden nach dem Biss entfernt. Kameras werden immer zerstört, die Zeitskala immer zurückgesetzt (auch bei Resource-Stopp).
- Der Server-Tick schläft 1 s, wenn es keine Zombies gibt, und 500 ms, wenn kein Finisher läuft.
- Clip-Daten: 5 Dictionaries, zusammen ~670 KB (`stream/`).

## Was nur im Spiel messbar ist

- `resmon 1`: Leerlauf, 10 Zombies, laufender Finisher (Opfer-Client) → Tabelle in INGAME_TEST.md (#26–#28).
- Netzwerk-Last durch die vernetzte Synced Scene (Engine-intern).
