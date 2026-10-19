# Changelog

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
