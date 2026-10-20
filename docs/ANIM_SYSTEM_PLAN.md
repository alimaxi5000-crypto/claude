# Animations-System: Gesamtplan und Umsetzungsplan

Stand: 2026-10-20 · Status: **Plan** (noch kein Code) · Grundlage: Pipeline aus `jj_zombie_dev`

## 1. Ziel in einem Satz

Eigene GTA-Animationen sollen **schnell, zuverlässig und ohne Raten** entstehen:
- **Phase 1:** Claude baut sie über ein festes Werkzeug. Du prüfst und justierst sie im Spiel und schickst kopierte Werte zurück.
- **Phase 2:** Du baust sie selbst in einem Studio im Spiel, ohne Animations-Vorkenntnisse. Die echte `.ycd` entsteht automatisch, zusammen mit einem Bericht für Claude.

## 2. Grundsätze

| Grundsatz | Was das konkret heißt |
|---|---|
| Einfach bedienbar | Erst Vorlagen, Griffe und Regler, Knochen-Rotation nur bei Bedarf. Jede Aktion ist rückgängig zu machen. Jede Prüfung sagt in Klartext, was falsch ist, und bietet einen „Beheben“-Knopf. |
| Nichts raten | Jede Abweichung im Spiel wird gemessen (cm/Grad) und als kopierbarer Wert zurückgegeben. Claude übernimmt Werte, statt zu schätzen. |
| Ein Datenformat | Code-Clips (Claude) und Studio-Clips (du) speichern dasselbe **Clip-Dokument**. Ein Konverter, eine Prüfung, ein Bericht. |
| Nachweisbar korrekt | Jeder Export wird unabhängig zurückgelesen und gegen die Quelle verglichen, inklusive Weltpose am Startpunkt (wie seit 0.1.3). |
| Erkenntnisse festhalten | Was im Spiel gelernt wurde, steht im Skill und in Build-Prüfungen, z. B. „GTA ignoriert den Startversatz im Clip → eine Szene pro Akteur“. |
| Rechtlich sauber | Keine Rockstar-Animationen oder -Modelle kopieren. Echte Skelettdaten bleiben lokal auf deinem Rechner/Server, nie im öffentlichen Repo. Vanilla-Animationen werden nicht als Vorlage übernommen. |

## 3. Technische Grenze und wie das System sie umgeht

GTA/FiveM hat **keine** Native, um einen Knochen eines Peds zur Laufzeit zu drehen. Geprüft in `citizenfx/natives` und `native-decls`: Es gibt nur Getter wie `GET_PED_BONE_COORDS`, `GET_ENTITY_BONE_ROTATION` und `GET_PED_BONE_MATRIX`. Daraus folgt:

1. **Bearbeiten** passiert an einem eigenen 3D-Skelett im NUI (three.js). Es liegt passgenau über der Spielszene: gleiche Kameraposition, Blickwinkel und Brennweite. Du siehst die Knochen genau dort, wo der echte Ped steht, auf echtem Boden und an echten Wänden.
2. **Echte Vorschau** heißt: Der Server wandelt in Sekunden in eine echte `.ycd` um und lädt eine kleine Stream-Resource neu. Der echte Ped spielt den Clip ab.
3. **Messen** passiert mit den Getter-Natives. Die echten Knochenpositionen werden gegen das Soll verglichen (z. B. Hand ↔ Schulter 2,1 cm).

## 4. Bausteine (eigene Resources)

```
animkit/                      Werkzeug (Node + .NET), läuft auf dem Entwicklungs- bzw. Server-Rechner, ist KEINE FiveM-Resource
  core/                       Mathe, Skelett, Rig/IK, Solver, Metriken, YCD-Schreiber/-Leser (aus jj_zombie_dev)
  templates/                  Vorlagen: Pose, Griff, Gang-Zyklus, Emote, Reaktion, Paar-Szene, Interaktion mit Prop
  cli/                        animkit new | build | check | sheet | report | watch
  converter/                  ycdtool (CodeWalker.Core), unverändert übernommen
  lab/                        Browser-Labor (Kontaktbögen, Live-Metriken)
  tests/
jj_animtest/                  FiveM-Resource: In-Game-Testtool (Phase 1)
jj_animstudio/                FiveM-Resource: Studio (Phase 2)
jj_animstudio_stream/         Wird generiert: Stream-Resource für Studio-Vorschauen
.claude/skills/fivem-animation/SKILL.md   Skill: Arbeitsweise für Claude
```

Der Zombie-Script wird der **erste Kunde**. `jj_zombie_dev` nutzt danach `animkit`, die Zombie-Clips bleiben, `tests/all.sh` muss weiter grün sein. `jj_zombie_test` hängt zur Laufzeit von keinem dieser Werkzeuge ab.

### 4.1 Das Clip-Dokument (zentrales Format, `*.anim.json`)

```jsonc
{
  "format": "jj-anim/1",
  "name": "fin_grab", "variant": "d2_m", "dict": "jjz_fin_m", "fps": 30, "duration": 1.2, "loop": false,
  "actors": { "victim": { "skeleton": "mp_m_freemode_01" }, "zombie": { "skeleton": "u_m_y_zombie_01" } },
  "tracks": {                                   // Keyframes, nicht Einzelbilder
    "victim": {
      "mover":  [{ "t": 0, "p": [0,0,0], "yaw": 90, "ease": "inOut" }],
      "bones":  { "SKEL_Spine2": [{ "t": 0.3, "rot": [5,0,-10], "ease": "out" }] },
      "ik":     { "handR": [{ "t": 0.3, "target": [0.1,0.4,1.4], "space": "scene", "weight": 1 }] },
      "fingers":{ "R": [{ "t": 0.3, "preset": "grab", "curl": 0.8, "spread": 0.2 }] },
      "lookAt": [{ "t": 0.0, "target": [0,1,1.6], "weight": 0.6 }],
      "feet":   { "lock": [[0, 0.6]] }          // Füße kleben am Boden
    }
  },
  "contacts": [{ "from": "zombie.handL", "to": "victim.shoulderR", "t": [0.3, 1.2] }],
  "events":   [{ "name": "grab_impact", "t": 0.3 }],
  "leadsTo":  ["fin_struggle_mid:m"]
}
```

- Code-Clips (`.mjs`) und das Studio erzeugen dieses Dokument. Der Build löst es auf, prüft es, schreibt die `.ycd`, liest sie zurück und erstellt Registry und Bericht.
- Die **Startpunkte** (`origins`) pro Akteur berechnet der Build selbst (Regel aus 0.1.3). Niemand muss daran denken.

### 4.2 Registry für alle Scripts

- Jede Resource mit eigenen Clips bekommt eine generierte `clips_data.lua`, wie heute beim Zombie.
- In ihrem `fxmanifest.lua` steht eine Zeile `jj_anim_registry 'shared/clips_data.lua'`.
- `jj_animtest` und `jj_animstudio` finden darüber alle Clips aller Resources (`GetResourceMetadata` + `LoadResourceFile`), ohne Konfiguration.

## 5. Phase 1: Werkzeug für Claude und In-Game-Testtool

### 5.1 `animkit`: in wenigen Schritten zur fertigen Animation

**Ablauf** (so soll eine Anfrage wie „Mach mir eine Animation, in der X Y am Kragen packt“ ablaufen):

1. **`animkit new <name> --template paired-grab`:** legt die Quelle aus der Vorlage an, mit Akteuren, Kontakten, Events und Standard-Grenzwerten.
2. Claude passt **Absichten** an, nicht Knochenwinkel: Ziele, Kontakte, Timing, Stil-Regler wie Energie, Gewicht, Steifheit, Tempo.
3. **`animkit build`:** löst die Posen auf und führt alle Prüfungen aus:
   - Fußrutschen, Durchdringung, Gelenkgrenzen, Sprünge;
   - Kontakte, Loop-Naht und Übergänge;
   - Rücklesen der `.ycd` und Weltpose am Startpunkt.
   Danach schreibt es die `.ycd` und die Registry.
4. **`animkit sheet`:** erstellt Kontaktbögen aus mehreren Blickwinkeln. Claude prüft sie selbst, bevor du etwas siehst.
5. **`animkit report`:** schreibt einen kurzen Bericht mit Clips, Dauer, Events, Prüfwerten, Einbau-Snippet (Lua) und Test-Checkliste für dich.

**Vorlagen-Bibliothek** (jeweils mit Reglern):

| Vorlage | Regler (Beispiele) |
|---|---|
| Gang-/Lauf-Zyklus | Tempo, Schrittlänge, Hinken, Oberkörper-Neigung, Armschwung, Müdigkeit |
| Idle/Atmen | Unruhe, Gewichtsverlagerung, Kopfbewegung |
| Emote/Geste | Arm-Ziele, Handform, Wiederholungen |
| Reaktion (Treffer, Stolpern, Tod) | Richtung, Stärke, Fallart |
| Paar-Szene (Greifen, Ringen, Stoß, Umarmung, Handschlag) | Abstand, Griffpunkte, Kraft, Wer-führt |
| Prop-Interaktion | Prop-Griffpunkt, Ablage, Hand |
| Übergang A → B | automatische Zwischenpose, Füße bleiben stehen |

**Skill `fivem-animation`:**
- Arbeitsablauf, Vorlagen-Wahl, Grenzwerte und Konventionen;
- Fallstricke aus der Praxis (Startversatz, eine Szene pro Akteur, Blend nur bei gleichem Entitäts-Rahmen, Ragdoll aus Szene, Vorladen der Dicts);
- Einbau-Muster für Einzel-Clips und Paar-Szenen;
- was zu tun ist, wenn Werte von `jj_animtest` kommen.

### 5.2 `jj_animtest`: abspielen, platzieren, messen, Werte kopieren

**Befehle** (nur Admins/ACE):

| Befehl | Wirkung |
|---|---|
| `/anim` | Öffnet das Testpanel (NUI) mit allen Clips aller Resources, Suche und Favoriten |
| `/anim play <clip> [loop]` | Spielt auf dir ab. Paar-Clips spawnen automatisch lokale Partner-Peds (Modell wählbar) |
| `/anim stop`, `/anim speed 0.25`, `/anim pause`, `/anim frame +1` | Wiedergabe-Steuerung |
| `/anim ped <modell>` | Partner-Modell wechseln (z. B. Zombie, Frau, Mann) |
| `/anim copy` | Kopiert alle aktuellen Korrekturen als Block |

**Panel** (einfach, Maus und Tastatur):
- **Zeitleiste:** Play/Pause, Loop, Tempo, Schieber für die Phase, Event-Marker (z. B. `grab_impact`).
- **Gizmo-Modus:**
  - **Bedienung:** Ped anklicken, dann verschieben (Pfeile, 1 cm / mit Shift 5 cm), drehen (Q/E, 1° / 5°), anheben (Bild↑/↓).
  - **Bezugsrahmen:** Werte sind wahlweise relativ zum Partner oder zum Szenen-Ursprung.
- **Mess-Overlay:**
  - **Kontakte:** Linien und cm-Werte für die Kontakte des Clips (Hand ↔ Schulter, Mund ↔ Hals …), rot bei mehr als 3 cm.
  - **Weitere Anzeigen:** Bodenabstand der Füße, Durchdringung der Körper.
- **Kamera:** freie Kamera plus feste Ansichten (vorn, seitlich, Schulter, weit) und Zeitlupe.
- **Kopieren:** Das Ergebnis ist ein eindeutiger Block. Claude übernimmt ihn 1:1 in `align.json` oder die Quelle:

```
#jjanim v1 clip=fin_grab:d2_m frame=10/36 actor=zombie dx=0.012 dy=-0.030 dz=0.000 dyaw=2.5 ref=victim
#jjanim v1 measure fin_grab:d2_m frame=10 zombie.handL->victim.shoulderR=2.1cm zombie.handR->victim.shoulderL=4.8cm
```

**Wege für die Werte:**
- **Zwischenablage:** in NUI über `execCommand('copy')`. Ob das in FiveM-NUI geht, im Spiel prüfen.
- **F8-Konsole:** zusätzliche Ausgabe dort.
- **Datei auf dem Server:** Speicherung unter `jj_animtest/out/<datum>_<clip>.txt`. Du kannst die Datei auch einfach schicken.

**Screenshots:** Sie bleiben möglich (`/anim capture`, wie `/zcapture`), werden aber durch die Messwerte weniger wichtig.

### 5.3 Rückkopplung (der Kreis, der das Raten ersetzt)

1. Claude baut den Clip, prüft ihn automatisch und per Kontaktbogen und pusht ihn.
2. Du startest ihn mit `/anim play <clip> loop`.
3. Passt etwas nicht, korrigierst du es mit dem Gizmo, bis es stimmt, und machst `/anim copy`.
4. Du schickst den Block an Claude.
5. Claude übernimmt die Werte (die IK hält die Kontakte), baut neu und prüft. Im Bericht steht, welche Werte eingeflossen sind.

### 5.4 Meilensteine Phase 1

| # | Meilenstein | Fertig, wenn … |
|---|---|---|
| P1.1 | `animkit` aus `jj_zombie_dev` herauslösen | Zombie-Clips bauen über `animkit` identisch (gleiche Prüfwerte), `all.sh` grün |
| P1.2 | Clip-Dokument `jj-anim/1` + Keyframe-Auflöser | Alle Zombie-Clips lassen sich als Dokument speichern und neu bauen, Weltpose-Abweichung < 1 mm |
| P1.3 | CLI `new/build/check/sheet/report` + 7 Vorlagen | Je Vorlage ein Beispiel-Clip, alle Prüfungen grün, Bericht erzeugt |
| P1.4 | Skill `fivem-animation` | Eine neue Sitzung baut nur mit dem Skill einen Beispiel-Clip korrekt, ohne Vorwissen aus dieser Sitzung |
| P1.5 | `jj_animtest` Wiedergabe + Panel | Jeder Clip aus jeder registrierten Resource abspielbar (Loop, Tempo, Phase), Paar-Clips mit Partner |
| P1.6 | Gizmo + Messung + Kopieren | Werte gehen sicher an Claude (mindestens einer der drei Wege). Test mit Logik-Mocks wie beim Finisher |
| P1.7 | Rückweg in den Build | Ein kopierter Block wird von `animkit apply` eingelesen, umgesetzt und im Bericht bestätigt |
| P1.8 | Zombie-Finisher mit dem neuen Kreis nachjustiert | Messwerte im Spiel ≤ 3 cm an allen Kontakten (deine Messung) |

## 6. Phase 2: Studio im Spiel

### 6.1 Bedienung, auch ohne Animationskenntnisse

**Start:** `/animstudio` öffnet das Studio an deiner Position. Der echte Ped wird halbtransparent („Geist“) und das bearbeitbare Skelett mit Körperform (Kapseln) erscheint passgenau.

**Bereiche:**
1. **Links: Projekt.** Neue Animation (Einzel / Paar / Gang-Zyklus / mit Prop), Akteure hinzufügen und Modelle wählen, Speichern (automatisch alle 30 s), Rückgängig/Wiederholen.
2. **Mitte: 3D-Ansicht.**
   - **Klick auf ein Körperteil:** Drehringe erscheinen (Achsen farbig, gesperrt an Gelenkgrenzen).
   - **Griff-Kugeln für Hände, Füße, Becken und Kopf:** Ziehen bewegt die ganze Kette natürlich (IK), das Ellbogen-/Knie-Ziel ist ebenfalls ziehbar.
   - **Finger:** pro Hand Vorlagen (Faust, offen, greifen, zeigen, Klaue, entspannt) plus Regler für Beugung und Spreizung, auf Wunsch jedes Fingerglied einzeln.
   - **Hilfen:** Spiegeln links ↔ rechts, Pose kopieren/einfügen, Boden-Einrasten, „Füße festkleben“, „Hand an … festkleben“ (Kontakt bleibt beim Weiterbearbeiten erhalten).
3. **Unten: Zeitleiste.** Keyframes pro Körperteil (Raute anklicken, ziehen, kopieren), Kurvenart per Klick (weich, schnell, federnd, gleichmäßig), Event-Marker (z. B. „impact“), Loop-Knopf (Ende = Anfang automatisch), Tempo, Onion-Skin (vorige/nächste Pose als Schatten).
4. **Rechts: Vorlagen & Prüfung.**
   - **Posen-Bibliothek:** eigene Posen speichern und anwenden.
   - **Assistenten:**
     - **Gang:** Regler für Tempo, Schrittlänge, Hinken, Haltung; daraus wird ein fertiger Zyklus zum Weiterbearbeiten.
     - **Paar-Griff:** Wer packt wen, wo, wie stark.
     - **Übergang:** von Pose A nach B.
   - **Ampel-Prüfung live:** Fußrutschen, Durchdringung, unnatürliche Gelenkwinkel, Sprünge, offene Kontakte. Jede Meldung zeigt die Stelle in der Zeitleiste und hat einen „Beheben“-Knopf.

**Im Spiel testen:** Ein Knopf, dann etwa 5–10 s warten. Der echte Ped spielt die echte `.ycd` mit den `jj_animtest`-Werkzeugen (Loop, Messung).

**Fertigstellen:** Name und Ziel-Resource wählen, dann **Konvertieren**. Es entstehen die endgültige `.ycd`, ein Registry-Eintrag und ein Bericht für Claude.

### 6.2 Technischer Ablauf

```
NUI-Editor (three.js) ──Projekt-JSON──> jj_animstudio (Server, Lua)
                                           │ prüft Rechte, Größe, Namen; speichert unter projects/<name>.anim.json
                                           ▼
                              inbox/  (Datei)  ──>  animkit watch  (eigener Prozess auf dem Server-Rechner, Node + .NET 8)
                                                        │ Build: auflösen, prüfen, .ycd schreiben, zurücklesen
                                                        ▼
                              jj_animstudio_stream/stream/<dict>.ycd + outbox/<job>.json (Ergebnis, Bericht)
                                           │ Server: StopResource/StartResource('jj_animstudio_stream')
                                           ▼
                              Clients laden die neue .ycd, der echte Ped spielt sie ab
```

- **Eigener Konverter-Prozess** (`animkit watch`, mit dem Server gestartet) statt Konvertierung im FXServer selbst: Er ist robust und abstürzt-sicher, und der FXServer muss keine Programme starten dürfen.
- **Vorschau-Namen mit Version:** Jede Vorschau bekommt einen neuen Dict-Namen (`jjs_<projekt>_v7`). Dadurch spielt kein Client eine alte, im Speicher gecachte Version. Beim Fertigstellen entsteht der saubere Endname.
- **Kamera:** Das Studio steuert eine Skript-Kamera und schickt deren Werte an das NUI. Spiel und 3D-Overlay sehen dadurch exakt gleich aus.
- **Skelett:**
  - **Quelle:** Das echte Skelett kommt aus deinen Spieldateien (CodeWalker-XML-Export, `import-skeleton`). Es liegt nur lokal auf dem Server und wird an Admin-Clients nur zum Bearbeiten geschickt, nicht ins öffentliche Repo.
  - **Ohne echtes Skelett:** Das Studio läuft mit dem Referenz-Skelett, und der Bericht markiert das.

### 6.3 Bericht für Claude (`outbox/<name>.report.md` + `.json`)

- Name, Dict, Clips je Akteur, Dauer, Loop, Events mit Zeitpunkten, Startpunkte (`origins`);
- Prüfwerte mit Ampel und Rücklese-Ergebnis;
- Ziel-Resource und vorgeschlagener Einbau (Lua-Snippet für Einzel-Clip bzw. Paar-Szene inkl. Vorladen);
- deine Notizen aus dem Studio („Zombie soll am Ende knurren“).

Du schickst Claude den Bericht oder pushst ihn. Claude bindet den Clip in das Script ein.

### 6.4 Meilensteine Phase 2

| # | Meilenstein | Fertig, wenn … |
|---|---|---|
| P2.1 | Overlay-Grundlage: Skelett im NUI exakt über dem Ped | Abweichung Overlay ↔ echte Knochen (Getter-Natives) ≤ 1 cm im Stand, aus 4 Blickwinkeln |
| P2.2 | Posen bearbeiten: Drehringe, IK-Griffe, Finger, Spiegeln, Undo | Eine Pose ist in < 2 Minuten ohne Vorwissen einstellbar (dein Test) |
| P2.3 | Zeitleiste + Keyframes + Kurven + Loop | Einfache Geste mit 4 Keyframes läuft flüssig als Loop |
| P2.4 | Konverter-Prozess + Vorschau im Spiel | Knopfdruck bis echte Wiedergabe ≤ 15 s, ohne Neustart des Spiels |
| P2.5 | Live-Prüfung + „Beheben“ | Fußrutschen und Durchdringung werden erkannt und per Knopf behoben |
| P2.6 | Assistenten: Gang, Paar-Griff, Übergang | Je Assistent ein fertiger Clip, der die Prüfung besteht |
| P2.7 | Paar-Animationen im Studio | Zwei Akteure, Kontakte bleiben beim Bearbeiten erhalten, Export als Paar-Szene mit Startpunkten |
| P2.8 | Fertigstellen + Bericht + Registry | Claude bindet einen Studio-Clip nur anhand des Berichts ein |

## 7. Risiken und was im Spiel zuerst bestätigt werden muss

| Punkt | Risiko | Plan |
|---|---|---|
| Zwischenablage im NUI | Kopieren kann in CEF gesperrt sein | Drei Wege (Zwischenablage, F8, Datei). Ist einer zuverlässig, reicht das |
| Stream-Resource neu laden | Clients übernehmen eine geänderte `.ycd` evtl. erst nach Neuverbindung | Versionierte Dict-Namen. Früh in P2.4 testen, notfalls neuer Dict-Name pro Vorschau ohne Neustart der Resource |
| NUI-3D-Leistung | three.js im Spiel kostet FPS | Nur im Studio aktiv. Einfache Kapsel-Körper, kein Modell |
| Overlay-Genauigkeit | Kamera-Werte aus Lua kommen einen Frame verzögert | Studio-eigene Skript-Kamera, das NUI ist die Quelle der Kameradaten |
| Skelett-Genauigkeit | Mit dem Referenz-Skelett weichen Griffe 1–3 cm ab | Echte Skelett-Exporte (siehe 8.) |
| Konverter auf dem Server | Node/.NET fehlen oder Rechte fehlen | Installations-Anleitung + Selbsttest `animkit doctor` |
| Sicherheit | Studio-Daten kommen vom Client | Nur Admins, Größenlimits, Namen nur `[a-z0-9_]`, Server baut alle Pfade selbst, Rate-Limits |

## 8. Was du beitragen musst

| Wann | Was |
|---|---|
| Phase 1 (bald) | CodeWalker-XML-Exporte von `mp_m_freemode_01.yft`, `mp_f_freemode_01.yft`, `u_m_y_zombie_01.yft` (echte Skelette, bleiben lokal) |
| Phase 1, P1.6 | Einmal testen, welcher Kopierweg bei dir funktioniert |
| Phase 2, vor P2.4 | Betriebssystem des Server-Rechners (Windows/Linux), txAdmin ja/nein, Installation von Node.js 20+ und .NET 8 (Anleitung kommt), einmal `animkit doctor` ausführen und das Ergebnis schicken |
| Laufend | Kurze Tests nach jedem Meilenstein (Checklisten kommen mit) |

## 9. Reihenfolge

Phase 1 zuerst: P1.1 → P1.2 → P1.3 → P1.4, parallel P1.5 → P1.6 → P1.7, dann P1.8 am Zombie-Finisher.
Phase 2 baut auf dem Clip-Dokument (P1.2), dem Konverter und `jj_animtest` auf. Ohne Phase 1 fehlt das Fundament.
