# Changelog

## 0.1.3

### Behoben (Grundursache der falschen Ausrichtung)
- Zombie stand beim Packen erst mit dem Rücken zum Spieler, drehte sich dann um und steckte im
  Spieler: GTA setzt einen Ped in einer Synced Scene auf den Ursprung seiner Szene und ignoriert
  den Startversatz des Clips. Beide Akteure lagen also im selben Punkt, und die 180°-Drehung aus
  0.1.2 wurde beim Einblenden sichtbar.
- Neu: Jeder Paar-Clip beginnt bei der Identität, jeder Akteur spielt in einer **eigenen** Szene an
  seinem Startpunkt (Opfer dort, wo es steht; Zombie 1 m vor ihm, mit Blick zu ihm). Die Abweichung
  zwischen echter Lage und 45°-Variante ist auf beide Körper verteilt (je höchstens ~11°) und wird
  in ~0,25 s weich ausgeglichen, bevor die Hände auf den Schultern landen.
- Übergang Grab → Ringen ohne Schwenk und ohne Lücke: Der Grab hält sein letztes Bild, Akteure mit
  neuem Startpunkt wechseln in einem Frame (gleiche Weltpose), alle anderen Übergänge werden
  überblendet.
- Abbruch mitten im Grab: Der Spieler behält die Blickrichtung seines Körpers.
- Die Heading-Korrektur des Zombies nach dem Finisher aus 0.1.2 entfällt (nicht mehr nötig).

### Tests
- Build: Die dekodierte `.ycd` am Startpunkt muss die Quellpose ergeben (alle 52 Paar-Clips,
  max. 0,03 mm). Loops und Nachfolger müssen dieselben Startpunkte haben.
- Neu `tests/lua/test_client_finisher.lua` (88 Prüfungen): Platzierung, Blickrichtung, Abstände und
  Übergänge für Griffe von vorn, hinten, seitlich und im ungünstigsten Winkel. Gegen den Stand
  0.1.2 schlägt der Test an ("zombie starts facing the victim").

## 0.1.2

### Behoben
- Zombie im Finisher um 180° verdreht: GTA wendet in vernetzten Synced Scenes die Mover-Drehung
  der Clips nicht so an wie die Mover-Position. Die Blickrichtung jedes Akteurs in Paar-Szenen
  steckt jetzt im Wurzelknochen (SKEL_ROOT), der Mover trägt nur noch die Position.
- Nach einem Finisher-Abbruch richtet der Besitzer die Entity-Blickrichtung des Zombies an seinem
  Körper aus (kein 180°-Sprung).

## 0.1.1 (nach dem ersten Spieltest)

### Behoben
- Zombie stand beim Packen falsch herum / griff ins Leere: Seine eigene KI (Ausfallschritt durch
  den Spieler hindurch und Greif-Overlay) lief weiter und riss ihn aus der gemeinsamen Szene.
  Jetzt stoppt der Besitzer-Client den Zombie vor dem Szenenstart (Übergabe `hold`/`zombieHeld`), die
  KI gibt während des Finishers keine Tasks mehr aus, und der Ausfallschritt endet vor dem Spieler.
- Ruckeln beim Ringen: Die Kampf-Loops laufen als echte Loop-Szene und werden nur noch beim Wechsel
  der Intensität neu gestartet (vorher alle 1,2 s).
- Ruckeln beim ersten Packen: Finisher- und Reaktions-Animationen werden vorgeladen, sobald Zombies
  in der Nähe sind.
- Diagnose: Spielt der Zombie die Szene nicht, steht das in F8 und in der Server-Konsole.

## 0.1.0 (erste Testversion)

### Neu
- Server-verwaltete Test-Zombies (Schlurfer, Läufer): Spawn mit client-gesuchten,
  server-geprüften Punkten, KeepEntity, Limits, Lebensdauer, Leichen-Aufräumen.
- KI: Idle → Alerted → Chase → Ready → Grab, Hold mit Slots (keine Trauben), Sprint/Müde,
  Hängenbleiben mit Ausweichroutine, Zielverlust, Treffer-Reaktionen, Kopfschuss, eigene Tode.
- Finisher: Packen aus 8 Richtungen, Ringen in drei Intensitätsstufen mit E-Spam
  (serverseitige Prüfung, Abklingen, Zeitlimit, Autoclicker-Erkennung), Wegstoßen mit Ragdoll
  beim Clip-Event, Biss mit Blut/Schaden/Stress/Marker, Haken-Konter, Erholung, Schonfrist, Watchdog.
- 74 selbst erstellte Clips in 5 Dictionaries (Bewegung, Reaktionen, Finisher m/w, Smoke-Tests).
- Kamera (Nahansicht, Gefahr-Zoom, Stöße), prozedurale Sounds, Gefahren-Vignette, Zeitlupe.
- Werkzeuge: `/ztestanim`, `/zdebug`, `/zcam`, `/zalign`, `/zcapture`, `/ztune`.
- Entwicklerseite (`jj_zombie_dev`): Animations-Generator mit Rig/IK, Metriken, YCD-Export
  über CodeWalker.Core, unabhängiger YCD-Leser, Browser-Labor, Kontaktbögen, Skelett-Import,
  Testsuite `tests/all.sh` (Native-Prüfung, Konsistenz, Logik mit Mocks, Fuzz, Benchmarks, NUI).
