# Test im Spiel (Checkliste)

Bitte der Reihe nach. Zu jedem Test: ✓/✗, bei ✗ kurz was passiert ist, F8-Ausgabe, Fenster von `animkit watch` und am besten ein Screenshot.

## Vorbereitung

1. **Doctor:** `node animkit/cli/animkit.mjs doctor` auf dem Server-Rechner. Erwartet: `RESULT: OK` oder nur `WARN`/`INFO`. **Die ganze Ausgabe schicken.**
2. **Konverter:** `start-watch.bat` (Windows) bzw. `./start-watch.sh` (Linux) starten. Erwartet: Zeilen `animkit watch 0.1.0 | studio … | stream …` und `skeletons: …`. Der Ordner `jj_animstudio_stream` existiert danach.
3. **Server:** neu starten (oder `refresh`, `ensure jj_animstudio_stream`, `ensure jj_animstudio`). Erwartet: keine roten Fehler in der Konsole.

## Grundfunktionen

4. **Öffnen:** `/animstudio`. Erwartet:
   - Kamera wechselt, dein Ped wird halbtransparent, das Studio erscheint, das Tutorial startet (beim ersten Mal).
   - Ohne Berechtigung kommt die Meldung „keine Berechtigung“.
5. **Neues Projekt** „test_01“ (Einzel). Erwartet: Das blaue Skelett liegt **auf** deinem Ped (Kopf auf Kopf, Füße auf Füßen).
   - **Melden:** Wie weit liegen Skelett und Ped auseinander (ungefähr in cm), vorn und seitlich? Screenshot bitte.
6. **Kamera:** linke Maustaste ziehen (drehen), Mausrad (zoomen), rechte Maustaste ziehen (schieben), Knöpfe Vorn/Seite/Oben/Schulter. Erwartet: Spielbild und Skelett bewegen sich **gemeinsam**. Dreh die Kamera so, dass der Ped am Bildrand steht.
   - **Melden:** Bleibt das Skelett auch am Rand auf dem Ped? (prüft das Sichtfeld)
7. **Bearbeiten:** Kopf anklicken, am grünen oder blauen Ring ziehen. Erwartet: Der Kopf des Skeletts dreht sich, eine Raute erscheint in der Zeitleiste. Grenzen aus (Taste L) erlaubt mehr Winkel.
8. **IK-Griff:** Die gelbe Kugel an der rechten Hand ziehen. Erwartet: Der Arm folgt natürlich, der Ellbogen-Griff (lila) erscheint.
9. **Zeitleiste:** Bei 1,0 s klicken, Hand woanders hinziehen, Leertaste. Erwartet: weiche Bewegung zwischen den Posen. Loop an: Ende = Anfang ohne Sprung.

## Im Spiel testen

10. **„Im Spiel testen“** drücken (die Rückfrage zum Neustart mit Ja). Erwartet:
    - Status „Wandle um …“, dann „Läuft (x,x s bis zur Wiedergabe)“, und dein **echter** Ped spielt die Bewegung.
    - **Melden:** die angezeigte Zeit (Ziel ≤ 15 s) und ob die Bewegung zum Skelett passt.
11. **Steuerung:** Loop an/aus, Tempo-Regler (0–2×), Phasen-Regler, Stopp. Erwartet: Der Ped reagiert sofort. Nach Stopp steht er wieder als Geist am Platz.
12. **Abgleich:** Während der Test läuft, „Abgleich messen“. Erwartet: Zeile „Abweichung Overlay ↔ echter Ped: max … cm, Mittel … cm“.
    - **Melden:** die Werte (Ziel ≤ 1 cm im Stand).
13. **Zweiter Spieler** (falls möglich): Bleibt beim Neustart der Stream-Resource alles normal? Sieht er dich halbtransparent? (Erwartet: kurzer Download, sonst nichts)

## Paar-Animationen

14. **Paar-Projekt:** Neues Projekt „paar_01“ (Paar, Partner z. B. Frau). Erwartet: Ein lokaler Partner-Ped steht dir gegenüber und ist auch halbtransparent. Das Partner-Modell links wechseln → der Ped wird ersetzt.
15. **Hand festkleben:** Deine rechte Hand (Griff) zur Schulter des Partners ziehen, „Hand festkleben an …“ → „Schulter links“. Dann den Partner bearbeiten (Kopf drehen). Erwartet: Die Hand bleibt auf der Schulter (Linie mit cm-Wert, lila).
16. **Paar testen:** „Im Spiel testen“. Erwartet:
    - Beide echten Peds spielen gleichzeitig, jeder an seinem Startpunkt (kein Ped steckt im anderen, keiner dreht sich beim Start um 180°).
    - Die Kontakt-Tabelle zeigt cm-Werte, rot über 3 cm.
    - **Melden:** die cm-Werte.

## Fertigstellen und Aufräumen

17. **Fertigstellen:** Name, Ziel-Resource (z. B. `jj_emotes`), Dict `jj_test_01` → „Umwandeln“. Erwartet:
    - Der Bericht erscheint, „Kopieren“ funktioniert (in einen Editor einfügen).
    - Die Dateien `jj_animstudio/data/outbox/test_01.report.md`, `.json` und `final/jj_test_01.ycd` existieren.
    - **Melden:** ob Kopieren ging.
18. **ESC:** Erwartet: Rückfrage „Studio schließen?“. Ja → Kamera zurück, Ped normal (nicht mehr transparent, beweglich), Partner weg. `/animstudio close` geht auch.
19. **Leistung:**
    - `resmon 1` bei geschlossenem Studio: `jj_animstudio` steht auf 0,00 ms.
    - Bei offenem Studio: FPS mit 2 Akteuren notieren.
20. **Fehlerfall:** `animkit watch` beenden, dann „Im Spiel testen“. Erwartet: klare Meldung „Der Konverter läuft nicht“, kein Hängen.

## Was ich (Claude) danach brauche

- die Ausgabe von `animkit doctor` (Test 1)
- die Werte aus Tests 5, 6, 10, 12, 16 und 19
- Screenshots von Test 5 (vorn und seitlich) und 16
- falls noch nicht geschehen: die CodeWalker-XML-Exporte von `mp_m_freemode_01.yft`, `mp_f_freemode_01.yft`, `u_m_y_zombie_01.yft` (bleiben lokal, siehe README)
