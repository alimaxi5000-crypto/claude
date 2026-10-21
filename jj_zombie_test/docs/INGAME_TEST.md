# Ingame-Test (für dich)

Voraussetzungen: `ensure jj_zombie_test` in der `server.cfg` (siehe README), Admin-Rolle in
jj_core (oder ACE `jj_zombie.admin`), `screenshot-basic` gestartet (nur für `/zcapture`).
Hake jede Zeile ab (✓) oder notiere, was anders war. Fehler beim **ersten** Test (#1–#3)
haben Vorrang: Alles andere baut darauf auf.

## Teil A: 5-Minuten-Smoke-Test (zuerst!)

| # | Test | Erwartung | ✓ |
|---|---|---|---|
| 1 | `/ztestanim wave` | Vor dir steht eine Kopie deines Charakters und **winkt mit dem rechten Arm**, Kopf folgt der Hand. Chat: `OK: jjz_test/smoke_wave läuft (Dauer 3.00 s, erwartet 3.00 s)`. Server-Konsole: `ztestanim [OK] …` | |
| 2 | `/ztestanim face` | Die Kopie steht still in einer A-Pose und **schaut dich an**. Schaut sie weg → melde es mir (Wurzel-Konvention). | |
| 3 | `/ztestanim bob`, dann `/ztestanim nod`, dann `/ztestanim stop` | bob: Kopie wippt auf und ab. nod: Kopie nickt langsam. stop: Kopie verschwindet. | |
| 4 | `/ztestanim wave self` | Du selbst winkst (eigener Ped). `stop` beendet es. | |

Meldet #1 `FEHLER: dictionary jjz_test does not exist …`: Resource nach dem Kopieren neu starten
(`ensure jj_zombie_test`) und prüfen, ob `stream/jjz_test.ycd` da ist. Schick mir dann die Meldung
aus dem Chat und der Server-Konsole.

## Teil B: Zombies und Finisher

| # | Test | Erwartung | ✓ |
|---|---|---|---|
| 5 | `/zspawn 1 schlurfer` im Freien | Zombie erscheint 8–14 m vor dir auf dem Boden (nicht im Wasser, nicht in Wänden), schlurfend, rechtes Bein schleift. Chat: `1 Zombie(s) gespawnt (1x schlurfer)` | |
| 6 | `/zspawn 1 laeufer` | Läufer brüllt kurz (Arme und Kopf hoch), sprintet mit Klauen nach vorn, wird nach ~5 s müde (geht), sprintet dann wieder | |
| 7 | Weglaufen, im Kreis laufen, hinter ein Hindernis | Zombies verfolgen dich, umgehen Hindernisse. Bleibt einer hängen, weicht er nach ~2,5 s seitlich aus | |
| 8 | Stehen bleiben, Zombie kommt auf ~1 m | Ausfallschritt mit Greifen, bei ~1 m: **Packen**. Der Zombie springt dich **aus seiner Richtung und mit Blick zu dir** an (kein Drehen, nicht in dir drin), schlägt die Hände auf deine Schultern, reißt dich herum (auch von hinten/seitlich), Kamera geht nah ran, Herzschlag. Je einmal von vorn, von der Seite und von hinten packen lassen | |
| 9 | Ringen: **E schnell drücken** (≈ 8–10/s) | Balken steigt; bei > 70 % stemmst du ihn weg (Arme durchgestreckt), darunter Hin-und-Her, unter 35 % drückt er zu dir rein. Nach ~3 s (Schlurfer) bzw. ~5 s (Läufer, packt stärker): **Wegstoßen**. Zombie fliegt zurück (Ragdoll), kurze Zeitlupe, "LOSGERISSEN!" | |
| 10 | Nach dem Stoß | Du bist sofort wieder frei. Der Zombie liegt ~3,5 s, steht mit eigener Aufsteh-Animation auf und kommt wieder | |
| 11 | Schonfrist | Für 4 s nach dem Finisher kann dich kein Zombie packen | |
| 12 | Ringen **ohne zu drücken** | Rote Vignette wächst, Balken fällt; nach 7 s: **Biss** in die linke Halsseite, Blut am Hals, rote Bildschirm-Blitz, "GEBISSEN!", Schaden (Standard 60) | |
| 13 | Nach dem Biss | Du schlägst ihn mit einem rechten Haken an die Schläfe weg (Zombie fliegt zur Seite), Hand an den Hals, du taumelst und richtest dich auf | |
| 14 | `/zspawn 2` (gemischt) | Nur einer packt dich; der zweite wartet in ~2,6 m Abstand, bis der Finisher vorbei ist | |
| 15 | Zwei Spieler | Jeder Spieler hat seinen eigenen Zombie/Finisher. Der zweite Spieler sieht deinen Finisher synchron | |
| 16 | Disconnect während des Ringens (zweiter Spieler) | Zombie wird frei (kurz betäubt), keine Fehler in der Konsole | |
| 17 | Sterben während des Finishers (z. B. Schaden von außen) | Finisher bricht sauber ab, Kamera/UI weg | |
| 18 | `restart jj_zombie_test` während des Ringens | Alles weg: Zombies gelöscht, Kamera zurück, UI weg, Zeitlupe aus | |
| 19 | Mit weiblichem Charakter #8–#13 | Griffe sitzen auf den Schultern, Biss am Hals, keine sichtbaren Durchdringungen | |
| 20 | Wand direkt hinter dir, Zombie packt | Statt Finisher ein kurzer Klauenhieb (wenig Schaden) | |
| 21 | Kopfschuss / Körpertreffer | Kopfschuss: sofort tot (Ragdoll). Körpertreffer: Treffer-Zucken bzw. Taumeln; am Ende eigene Todesanimation (Knie oder nach hinten) | |
| 22 | `/zclear`, `/zkill`, `/zfreeze`, `/ztype laeufer`, `/zfinisher` | entfernen / töten / KI pausieren / Standardtyp / Finisher sofort mit dem nächsten Zombie | |

## Teil C: Werkzeuge

| # | Test | Erwartung | ✓ |
|---|---|---|---|
| 23 | `/zdebug` | Über jedem Zombie Typ, Zustand (farbig), Ziel, Abstand, Lebenspunkte, `OWNER` beim Besitzer; Linie zum Ziel, Wegpunkt; im Finisher Szenenursprung mit Achsen, Hand↔Schulter- und Mund↔Hals-Abstand in cm | |
| 24 | `/zcam` | Freie Kamera (WASD, Maus, Q/E, Shift), Tasten 1–4 feste Ansichten, Rücktaste beendet | |
| 25 | `/zalign` | Lokale Vorschau: du + Zombie im Clinch-Loop. Pfeile/Bild↑↓/Q/E verschieben den Zombie, Tab wechselt auf "Szene", Enter speichert. Chat und Server-Konsole zeigen die Werte (`zalign result … x= y= z= yaw=`). **Schick mir diese Zeile.** | |
| 26 | `resmon 1` ohne Zombies | `jj_zombie_test`: 0,00–0,01 ms | |
| 27 | `resmon 1` mit 10 Zombies (`/zspawn 5` zweimal) | Ziel unter 0,2 ms gesamt (~0,02 ms pro Zombie) | |
| 28 | `resmon 1` während des Ringens | Wert notieren (Per-Frame-Arbeit nur in dieser Zeit) | |

## Teil D: Der Bilder-Kreislauf mit `/zcapture`

So bekomme ich Bilder aus dem echten Spiel und kann die Animationen gezielt verbessern:

1. Stell dich auf eine freie, flache Stelle bei Tageslicht (z. B. Parkplatz).
2. `/zcapture shove` (oder `grab`, `struggle`, `bite`, `all`). Dein Charakter und ein lokaler
   Zombie stehen still im Clinch. Die Szene wird in **6 Zeitschritten × 4 Kameras** (Front, Seite,
   Schulter, Totale) fotografiert. Nicht bewegen, bis der Chat `Aufnahme fertig: N Bilder …` meldet
   (~15–25 s pro Szene).
3. Die Bilder liegen in `DEVSERVER\jj_zombie_dev\captures\` als `<datum>_<zeit>_<sequenz>_<nr>_<kamera>.jpg`,
   dazu `<…>_index.md` mit Szene und Zeitpunkt jedes Bildes.
4. Optional: `jj_zombie_dev\animlab\captures.html` öffnen, die Bilder hineinziehen → Kontaktbogen
   (Zeilen = Zeitpunkte, Spalten = Kameras) als PNG speichern.
5. **Schick mir die Bilder** (oder den Kontaktbogen + die `_index.md`). Ich vergleiche sie mit den
   Labor-Bildern (`jj_zombie_dev/captures/lab/`), korrigiere Animation oder Ausrichtung, baue neu
   und du testest wieder ab Schritt 2.
6. Für die Feinausrichtung zusätzlich `/zalign` (#25) und die Ergebniszeile schicken.
