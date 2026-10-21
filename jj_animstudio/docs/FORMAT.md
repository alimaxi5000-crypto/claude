# Clip-Dokument `jj-anim/1`

Ein Clip-Dokument (`*.anim.json`) beschreibt **eine** Animation als Keyframes: Einzel-Clip (1 Akteur) oder Paar-Szene (2 Akteure). Das Studio speichert genau dieses Format, `animkit build` wandelt es von Hand um. Schema: `animkit/core/schema/jj-anim-1.schema.json`. Prüfung und deutsche Fehlermeldungen: `animkit/core/doc.mjs`.

## Achsen und Einheiten

- **Achsen:** Modellraum und Szenen-Rahmen sind GTA-Achsen: +X rechts, +Y vorn, +Z oben.
- **Einheiten:** Positionen in Metern, Winkel in **Grad**.
- **Blickrichtung (yaw):** 0 = +Y, positiv gegen den Uhrzeigersinn.
- **Körperraum (`space: "body"`):** relativ zur Entität des Akteurs, also zu seinem Standpunkt (`mover`) zur jeweiligen Zeit. Der Boden liegt dort bei z ≈ −0,99 (Referenz-Skelett), ein flacher Fuß hat den Knöchel bei z ≈ −0,908.
- **Szenen-Rahmen (`space: "scene"`):** gemeinsamer Ursprung beider Akteure, im Studio die Position von Akteur A beim Öffnen.

## Oberste Ebene

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `format` | ja | Immer `"jj-anim/1"` (Versionsfeld für spätere Migrationen) |
| `name` | ja | Projektname, `[a-z0-9_]`, höchstens 40 Zeichen |
| `title` | nein | Anzeigename (frei, höchstens 80 Zeichen) |
| `type` | ja | `"single"` (1 Akteur) oder `"pair"` (2 Akteure) |
| `fps` | nein | Immer 30 |
| `duration` | ja | Länge in Sekunden (0,1–30) |
| `loop` | nein | `true`: Ende = Anfang, die Naht schließt der Auflöser selbst |
| `loopMover` | nein | `"closed"` (Standard: auch der Standpunkt kehrt zurück) oder `"travel"` (Gang-Zyklen: der Standpunkt läuft weiter) |
| `actors` | ja | `{ "a": { "model": "mp_m_freemode_01", "skeleton"?: "male", "label"?: "…" }, "b": … }` |
| `tracks` | ja | Keyframe-Spuren pro Akteur (unten) |
| `contacts` | nein | Kontakte zwischen Körperteilen (unten) |
| `events` | nein | `[{ "name": "impact", "t": 0.3, "duration"?: 0.2 }]` |
| `limits` | nein | Grenzwerte der Prüfung überschreiben, z. B. `{ "footSlide": 0.4 }` |
| `dict`, `targetResource`, `notes` | nein | Endname, Ziel-Resource und Notizen aus „Fertigstellen“ |
| `editor` | nein | Ablage für Editor-Zustand, wird beim Bauen ignoriert |

**Skelett pro Akteur:** `mp_m_freemode_01` → `male`, `mp_f_freemode_01` → `female`, `u_m_y_zombie_01` → `zombie`. Andere Modelle nutzen das männliche Skelett, und der Bericht vermerkt das.

## Keyframes und Kurven

Jede Spur ist eine Liste von Keys `{ "t": Sekunden, …Werte, "ease"?: Kurve }`, sortiert nach Zeit. Zwei Keys zur selben Zeit sind ein Fehler.

- **Kurve:** `ease` formt das Stück, das **zu diesem Key hin** läuft.
- **Vor dem ersten und nach dem letzten Key** bleibt der Wert stehen.
- **Bei `loop: true`** hängt der Auflöser einen virtuellen Key bei `t = duration` mit den Werten des ersten Keys an. Dieses Rückstück nutzt die Kurve des **ersten** Keys.

| `ease` | Studio-Name | Verlauf |
|---|---|---|
| `smooth` (Standard) | weich | langsam los, langsam an |
| `fastIn` | schnell rein | startet schnell, bremst zum Key ab |
| `fastOut` | schnell raus | startet langsam, kommt schnell am Key an |
| `linear` | gleichmäßig | konstantes Tempo |
| `spring` | federnd | schwingt etwas über und federt zurück |
| `step` | (nur von Hand) | hält bis zum Key, springt dann |

## Spuren pro Akteur (`tracks.<actor>`)

| Spur | Key-Felder | Wirkung |
|---|---|---|
| `mover` | `p: [x,y,z]` (Szene), `yaw` | Standpunkt der Entität. Bei Paaren wird daraus der Startpunkt (`origins`). |
| `root` | `p: [x,y,z]` (Körper), `rot: [a,b,c]` | Becken: Verschiebung und Drehung des ganzen Körpers über den Beinen |
| `bones.<SKEL_…>` | `rot: [a,b,c]` | Direkte Drehung eines Knochens (Drehringe im Studio) |
| `ik.handL/handR` | `target`, `space`, `pole?`, `weight?` | Handgelenk-Ziel (IK). `pole` = Richtung, in die der Ellbogen zeigt (Körperraum), `weight` 0–1 überblendet zu FK |
| `ik.footL/footR` | wie Hand, dazu `yaw?`, `pitch?`, `roll?` | Knöchel-Ziel (IK) mit Fußausrichtung in Grad, `pole` = Knierichtung |
| `fingers.L/R` | `preset`, `curl?` (0–1,5), `spread?` (−1…1) | Vorlagen `relaxed`, `fist`, `open`, `grab`, `point`, `claw`. `curl` skaliert die Beugung, `spread` setzt die Spreizung |
| `look` | `target`, `space`, `weight?` | Kopfblick (Hals und Kopf drehen sich zum Ziel, begrenzt) |
| `feet.lock.L/R` | `[[t0, t1], …]` | Füße festkleben: Der Knöchel bleibt im Bereich dort, wo er bei `t0` war. 0,15 s weiche Rückblende danach |

**Drehungen `rot: [a, b, c]`** sind Grad als Drehvektor in der **Gelenk-Basis** des Knochens (`animkit/core/joints.mjs`). Die Drehung wirkt nach der Elternkette: `D = D_eltern · extra`.

| Knochen | a | b | c |
|---|---|---|---|
| Rumpf, Hals, Kopf, Becken | Nicken (+ = zurück) | Kippen | Drehen (+ = links) |
| Oberarm, Schlüsselbein, Oberschenkel, Fuß, Zeh | Drehung um X | Y | Z (Modellachsen) |
| Unterarm, Unterschenkel | Beugen (+ = beugen) | Verdrehen | seitlich |
| Hand | Beugen zur Handfläche | Verdrehen | Abknicken |
| Finger | Krümmen | Verdrehen | Spreizen |

- **Links und rechts gespiegelt:** Die linken Basen sind die gespiegelten rechten. Gleiche Werte links und rechts ergeben eine spiegelbildliche Pose.
- **Gelenkgrenzen:** Sie stehen pro Achse in `joints.mjs`. Das Studio begrenzt standardmäßig, die Prüfung meldet Überschreitungen.
- **IK hat Vorrang:** Eine Arm- oder Bein-IK mit `weight` 1 überschreibt die `bones`-Drehungen dieser Kette.

## Kontakte (`contacts`)

```json
{ "id": "hand_shoulder", "from": "a.handR", "to": "b.SKEL_L_UpperArm", "offset": [0, 0, 0.07],
  "t": [0.75, 2.0], "stick": true, "max": 0.03 }
```

- **Endpunkte** `<akteur>.<griff|knochen>`: Griffe sind `handL`, `handR`, `footL`, `footR`, `head`, `pelvis` oder ein `SKEL_…`-Knochen. `offset` liegt im Ruheraum des Zielknochens und dreht sich mit ihm.
- **`stick: true` („Hand an … festkleben“):** Im Bereich `t` zieht die Hand bzw. der Fuß per IK zum Zielpunkt. Das hält auch, wenn du den Partner weiter bearbeitest. Davor und danach wird 0,15 s überblendet.
- **Prüfung:** Abstand ≤ `max` (Standard 3 cm). Der Unterarm (bei Füßen das Schienbein) darf den anderen Körper berühren, ohne als Durchdringung zu zählen.

## Was der Build daraus macht

1. **Prüfen und lösen:** Schema und Sinn prüfen (Akteure, Knochen, Zeiten, Kontakte), dann für jedes Bild bei 30 fps lösen: Keys → Rig/IK → Pose. Kontakte laufen dabei in 3 Durchgängen.
2. **Ampel:** Fußrutschen, Boden, Gelenke, Tempo, Durchdringung, Kontakte, Loop-Naht.
3. **Paare:** Jeder Clip beginnt bei der Identität. Der Mover bleibt konstant, die Bewegung steckt im `SKEL_ROOT`, und der Startpunkt des Akteurs wird `origins[akteur] = { x, y, z, yaw }`.
4. **`.ycd` erzeugen:** `ycd.xml` schreiben, mit CodeWalker.Core in `.ycd` umwandeln und unabhängig zurücklesen. Die Grenzen sind Spuren ≤ 0,05° und 0,5 mm sowie die Weltpose am Startpunkt ≤ 2 mm.
5. **Clip-Namen:** Einzel `<name>`, Paar `<name>_<akteur>`. Die Vorschau-Dicts heißen `jjs_<projekt>_v<n>`, beim Fertigstellen kommt dein Dict-Name.

## Beispiele

`animkit/examples/` (erzeugt von `make-examples.mjs`): `single_wave` (Winken, Loop), `pair_shoulder` (Hand auf Schulter, Kontakt festgeklebt), `walk_cycle` (Gang-Zyklus mit `loopMover: "travel"`), `fingers_demo` (alle Finger-Vorlagen).
