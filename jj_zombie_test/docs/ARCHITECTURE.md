# Architektur

## Überblick

```
                       ┌────────────────────────────── Server (autoritativ) ──────────────────────────────┐
 /zspawn ──► commands ─┤ zombies.lua   Registry, CreatePed (KeepEntity), State Bags, KI-Tick 100/250 ms     │
                       │ ai_state.lua  reine Logik: Ziel, Zustand, Slots, Sprint/Müde, Hängen, Grab-Anfrage │
                       │ finisher.lua  Start, Variante, Phasen, Tastendruck-Prüfung, Fortschritt, Ergebnis  │
                       │ damage.lua    Biss-Schaden, Stress, "gebissen"-Marker, Swipe-Fallback               │
                       │ ownership.lua aktueller OneSync-Besitzer, Events an den Besitzer                   │
                       │ net.lua       Spielerprüfung, Rate-Limits, Verdachtsfälle                          │
                       └──────────────┬──────────────────────────────────────────────┬─────────────────────┘
                     State Bags (jjz*)│ nur Server schreibt               Events nur  │ an Opfer / Besitzer
                                      ▼                                               ▼
 ┌──────── Client des Zombie-BESITZERS ────────┐            ┌──────── Client des OPFERS ──────────────────┐
 │ ai.lua   führt Zustand aus: Navigation,      │            │ finisher.lua  startet die vernetzte Szene,   │
 │          Hit-Reaktion, Tod, Unstuck, Swipe   │            │               sammelt E-Drücke (Key Mapping),│
 │ finisher.lua Ragdoll + Stoß beim "impact"   │            │               UI, Kamera, Sound, Blut        │
 └──────────────────────────────────────────────┘            └──────────────────────────────────────────────┘
 ┌──────── jeder Client, der den Zombie sieht ─┐
 │ movement.lua eigene Idle/Walk/Run-Clips      │
 │ sound.lua    Knurren in der Nähe             │
 └──────────────────────────────────────────────┘
```

Schichten:

| Schicht | Dateien | Aufgabe |
|---|---|---|
| Konfiguration | `config/config.lua` (geteilt), `config/config_server.lua` (nur Server) | alles Einstellbare, Anti-Cheat-Schwellen nur serverseitig |
| Geteilt | `shared/constants.lua`, `util.lua`, `clips.lua`, `clips_data.lua` (generiert) | Event-Namen, State-Bag-Schlüssel, Validatoren, Clip-Registry |
| Integration | `integration/server.lua`, `integration/client.lua` | jeder Aufruf an jj_*-Resources, mit `pcall` und Fallback, `VERIFY:` markiert |
| Server | `server/*.lua` | Entscheidungen: Spawn, KI-Zustand, Finisher, Schaden |
| Client | `client/*.lua` | Ausführung und Darstellung: Bewegung, Szenen, Kamera, Effekte, Werkzeuge |
| NUI | `html/` | Fortschrittsbalken, Ergebnis, Vignette, prozedurale Sounds |

## Wer entscheidet was

| Entscheidung | Wo | Begründung |
|---|---|---|
| Zombie existiert, Typ, Lebensdauer, Limits | Server | `CreatePed` auf dem Server, `SetEntityOrphanMode(…, 2)` (KeepEntity) |
| KI-Zustand, Ziel, Tempo, Slot | Server (`ai_state.lua`), per State Bag verteilt | nur der Server schreibt `jjz_*`-Schlüssel |
| Bewegung, Animation, Treffer-Reaktion | Besitzer-Client | Navigation braucht Client-Natives; genau **ein** Client führt aus |
| Finisher-Start | Server | KI meldet `grab`, `finisher.lua` prüft alle Bedingungen erneut |
| Fortschritt, Zeitlimit, Ergebnis | Server | Client meldet nur Zeitstempel von Tastendrücken |
| Schaden, Stress, "gebissen" | Server | Opfer-Client wendet nur den vom Server genannten Schaden an |
| Kamera, Sound, Blut, UI | Opfer-Client | reine Darstellung |

## Besitz und Migration (OneSync)

- Der Server erzeugt jeden Zombie (`CreatePed` ist ein Server-RPC-Native). OneSync gibt ihn einem Client (meist dem nächsten Spieler); dieser **Besitzer** führt die KI aus (`client/ai.lua`, `ownsIt()`).
- Der Server fordert nie Kontrolle an. Bei `sv_filterRequestControl 2` wäre das für spielereigene Entitäten ohnehin gesperrt. Migration überlässt das System OneSync. Weil Zustand, Ziel, Tempo, Slot und Unstuck-Zähler in **server-gesetzten State Bags** liegen, macht ein neuer Besitzer nahtlos weiter.
- `sv_stateBagStrictMode true` passt dazu: Clients schreiben keine Zombie-State-Bags.
- Owner-Befehle (`kill`, `swipe`, Knockback beim Finisher-Ergebnis) gehen per Event an den **aktuellen** Besitzer (`Ownership.sendToOwner`). Wechselt der Besitzer während der Ergebnisphase, schickt der Finisher-Tick den Knockback neu an den neuen Besitzer. Getestet in `tests/lua/test_server.lua` ("owner migration").
- `onesync_population false` betrifft nur Ambient-Populationen. Die Zombies sind Skript-Entitäten.

## Zustandsautomat KI (`server/ai_state.lua`)

```
          Spieler im TargetRadius                 AlertSeconds vorbei
  Idle ─────────────────────────► Alerted ─────────────────────────► Chase
   ▲                                                                   │  ≤ AttackReadyDistance und Primärer
   │ Ziel weg / > LoseTargetRadius / anderer Bucket / am Boden         ▼
   ├───────────────────────────────────────────────────────────────  Ready ── ≤ GrabDistance, Höhe ok ──► Grab (Finisher)
   │                                                                   │ nicht Primärer / Ziel im Finisher
   │                                                                   ▼
   │                                                                  Hold (wartet auf seinem Slot)
   │
  Stunned ── stunUntil vorbei ──► Chase/Idle            Dead (Endzustand, Leiche nach CorpseSeconds weg)
```

- **Primärer**: Pro Ziel darf nur der nächste aktive Zombie packen. Alle anderen gehen in `Hold` und verteilen sich auf **Slots**: Winkel im goldenen Schnitt um das Ziel, damit sich keine Traube bildet. Während das Ziel in einem Finisher steckt, halten alle anderen Abstand (`WaitDistance`).
- **Läufer**: `Sprint → Müde → Sprint` (`SprintSeconds`, `TiredSeconds`). Schlurfer gehen immer.
- **Hängenbleiben**: Kommt der Zombie `StuckSeconds` lang nicht näher, zählt der Server `jjz_unstuck` hoch. Der Besitzer-Client führt dann reihum aus: seitlich ausweichen, Navmesh-Umweg, kurzer Versatz auf einen sicheren Punkt.
- Die Logik ist reine Lua-Logik ohne Natives und deshalb komplett mit Mocks getestet. Jeder Übergang ist in `test_server.lua` abgedeckt ("AI state machine").

## Zustandsautomat Finisher (`server/finisher.lua`)

```
 tryStart ──► Grab ──(Grab-Clip-Dauer)──► Struggle ──(Fortschritt ≥ 100)──────────► Success ──► Ended
                │                           │  └──(Zeitlimit + Netz-Toleranz)──► Bite ──────► Ended
                └── Abbruch (Aborted) aus jeder Phase: Opfer weg/anderer Ped/am Boden, Zombie weg,
                    Client bestätigt Szene nicht (3,5 s), Client meldet Fehler, Watchdog, Resource-Stopp
```

- **Start**: Die KI meldet `grab`, dann prüft `canGrab` erneut: Opfer frei, Schonfrist vorbei, nicht im Fahrzeug, nicht am Boden, nicht gefesselt, gleicher Routing-Bucket, Zombie nicht betäubt, kein Ragdoll. Ist kein Platz gemeldet (`SpaceReport`), kommt statt des Finishers ein kurzer **Swipe** mit wenig Schaden.
- **Richtung**: `chooseDirection` rechnet die Blickrichtung des Opfers relativ zum anrückenden Zombie aus und rundet auf 8 Richtungen (0 = Blick zum Zombie, 4 = Zombie kommt von hinten). Für jede Richtung und jedes Geschlecht gibt es einen eigenen Grab-Clip.
- **Ende**: Immer `finish()`. Das setzt Stun bzw. Abbruch-Stun, die Schonfrist (`GraceSeconds`), Player-State und Inventarsperre zurück und nimmt die Remote-Szenen-Erlaubnis wieder weg. `finish()` ist idempotent.
- **Watchdog**: maximale Gesamtdauer aus Grab + Zeitlimit + Ergebnis + 5 s.

## Paar-Animation: Technikentscheidung

Verglichen wurden **vernetzte synchronisierte Szenen** und **Attach** (Entität an Entität mit Bone-Versatz, zwei getrennte Clips).

| Kriterium | Vernetzte Synced Scene | Attach |
|---|---|---|
| Ausrichtung | Beide Akteure spielen ihre Clips im **selben Szenenursprung**. Die Relativlage steckt exakt in den Clips (der Solver hat die Kontakte gegen die echte Pose des anderen gerechnet). | Ein Akteur hängt starr an einem Bone des anderen. Er verliert die eigene Fußarbeit (Schritte, Drehungen, Ausfallschritt) und schwebt über Unebenheiten. |
| Besitzer-Client ≠ Opfer-Client | Das Opfer startet die Szene. Den fremden Zombie darf es nur mitnehmen, wenn der Server `SET_ENTITY_REMOTE_SYNCED_SCENES_ALLOWED` setzt. Laut Doku ist sonst nur der Besitzer einer Entität berechtigt ("only the entity's owner can include it in networked synchronized scenes"). Wir setzen es genau für die Finisher-Dauer. | Für das Anhängen braucht man in der Regel Kontrolle über die Entität. Kontrolle anfordern ist bei `sv_filterRequestControl 2` für spielereigene Entitäten gesperrt. |
| Netzwerk | Eine Szene, ein Phasenwert, für alle Clients synchron. | Attach-Zustand plus zwei unabhängig laufende Clips, die auseinanderlaufen können. |
| Ruckeln/Einstieg | `moverBlendInDelta` von `NETWORK_ADD_PED_TO_SYNCHRONISED_SCENE` ("Useful for ensuring a seamless entry") gleitet beide Körper weich in die Startpose. | Harter Sprung zum Anhängepunkt. |
| Kollision | Szene steuert beide Mover. Platzprüfung (`SpaceReport`) vorher. | Kollision zwischen beiden muss abgeschaltet werden. |
| Ende/Ragdoll | Beim Clip-Event `impact` setzt der **Besitzer** des Zombies Ragdoll + Kraft. Das bricht den Zombie physikalisch aus der Szene, das Opfer spielt weiter. | Erst abhängen, dann Ragdoll. |

**Entscheidung: vernetzte synchronisierte Szenen** (`NETWORK_CREATE_SYNCHRONISED_SCENE`, `NETWORK_ADD_PED_TO_SYNCHRONISED_SCENE`, `NETWORK_START_SYNCHRONISED_SCENE`, Phase über `NETWORK_GET_LOCAL_SCENE_FROM_NETWORK_ID` + `GET_SYNCHRONIZED_SCENE_PHASE`). Alle Signaturen und Parameterbedeutungen stammen aus `citizenfx/natives` bzw. `citizenfx/fivem/ext/native-decls`. `tools/check-natives.mjs` prüft sie bei jedem Testlauf.

### Szenen-Rahmen

- Ursprung = Opfer, +Y zeigt zum Zombie. Der Zombie steht im Clinch bei (0, 0,56) mit Blick −Y.
- Grab: Die Szenen-Rotation teilt die Abweichung zwischen echter Blickrichtung und gewählter 45°-Variante halb/halb auf. So dreht kein Körper mehr als ~11°. Der Rest wird per Mover-Blend weich ausgeglichen.
- Die Ringen-Loops teilen sich eine identische Nahtpose. Der Wechsel der Intensität passiert an der Naht (Phase ≥ 0,985), dadurch ohne Sprung. Shove und Biss beginnen mit genau dieser Pose. Das letzte Bild des Bisses ist das erste von `fin_recover`. Der Build prüft alle diese Übergänge (`leadsTo`).
- `/zalign` speichert einen optionalen Laufzeit-Versatz der Szene (KVP). Akteur-Versätze für den Build stehen in `jj_zombie_dev/anims-src/align.json`.

## Bewegung

`SET_PED_ALTERNATE_MOVEMENT_ANIM` ersetzt Idle (Stance 0), Gehen (1) und Rennen (2) durch eigene Clips. Das ist eine lokale Ped-Einstellung, deshalb setzt sie **jeder** Client, der den Zombie sieht (`movement.lua`). Clipsets/`data_file` braucht es dafür nicht.

## Gesundheit und Tod

Der Zombie hat zusätzliche `HEALTH_BASE = 1000` Lebenspunkte, damit das Spiel bei Körpertreffern nie selbst den Tod auslöst. Sinkt die Gesundheit unter diese Basis, spielt der Besitzer einen eigenen Todes-Clip und setzt danach die Gesundheit auf 0. Kopftreffer (`SetPedSuffersCriticalHits`, Kopf-Bones) töten sofort mit Ragdoll. Der Server erkennt den Tod am Gesundheitswert.

## Threads und Taktung

| Seite | Thread | Takt im Leerlauf | Takt aktiv |
|---|---|---|---|
| Server | Zombie-Tick | 1000 ms (keine Zombies) | 250 ms, 100 ms wenn jemand gleich gepackt wird |
| Server | Finisher-Tick | 500 ms | 50 ms |
| Client | Zombie-Manager (`ai.lua`) | 1000 ms + Pool-Scan alle 1,5 s | 150 ms |
| Client | Platzprüfung (`finisher.lua`) | 1000 ms | 500 ms, nur solange ein Zombie mich verfolgt |
| Client | Knurren (`sound.lua`) | 1000 ms | 1000 ms |
| Client | Ped-Cache (`main.lua`) | 500 ms | 500 ms |
| Client | pro Frame | **nichts** | nur während Finisher, `/zdebug`, `/zcam`, `/zalign`, `/zcapture` |
