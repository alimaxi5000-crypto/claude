# Animationskatalog

Automatisch erzeugt von `jj_zombie_dev/tools/catalog.mjs` aus dem letzten Build
(73 Clips, 47 Szenen/Varianten, 5 Dictionaries).
Skelette beim Build: male = reference, female = reference (female proportions approximated), zombie = reference.

Alle Clips sind selbst erstellt (Quelltext in `jj_zombie_dev/anims-src/clips`), es gibt keinen
Rockstar-Clip in diesem Projekt. Status "Metriken" heißt: alle automatischen Prüfungen des
Builds bestanden (Fußrutschen, Bodenkontakt, Gelenkgrenzen, Geschwindigkeiten, Durchdringung,
Kontaktpunkte, Loop-Nähte, Übergänge). Ob es **im Spiel** gut aussieht, ist damit noch nicht
gesagt: das ist erst nach `/ztestanim`, `/zcapture` bzw. eigenem Anschauen bestätigt.

| Dictionary | Clips |
|---|---|
| `jjz_fin_m` | 27 |
| `jjz_fin_f` | 27 |
| `jjz_test` | 3 |
| `jjz_move` | 6 |
| `jjz_react` | 10 |

## fin_struggle_low

Zombie gewinnt: drückt rein, schnappt zweimal, Arme des Opfers knicken ein.

- Verwendung: Kampf-Loop (Fortschritt < 35 %)
- Dictionary: `jjz_fin_m`, `jjz_fin_f`
- Dauer: 1.20 s (Loop); Varianten: m, f
- Events: `snap` @ 0.32 s, `snap` @ 0.86 s
- Clips (erste Variante): victim: `fin_struggle_low_m_victim`, zombie: `fin_struggle_low_m_zombie`
- Knappste Metriken (erste Variante): wrist 72.941 / 88 (victim); neck 54.035 / 85 (victim); wristRoll 59.172 / 120 (victim)
- Kontaktbögen: [fin_struggle_low_m_close_src.png](../../jj_zombie_dev/captures/lab/fin_struggle_low_m_close_src.png)

## fin_struggle_mid

Ausgeglichen: Hin-und-Her-Drücken, ein harter Schnapper.

- Verwendung: Kampf-Loop (35-70 %)
- Dictionary: `jjz_fin_m`, `jjz_fin_f`
- Dauer: 1.20 s (Loop); Varianten: m, f
- Events: `snap` @ 0.55 s
- Clips (erste Variante): victim: `fin_struggle_mid_m_victim`, zombie: `fin_struggle_mid_m_zombie`
- Knappste Metriken (erste Variante): wrist 73.090 / 88 (victim); neck 51.575 / 85 (victim); wristRoll 59.708 / 120 (victim)
- Kontaktbögen: [fin_struggle_mid_f_side_src.png](../../jj_zombie_dev/captures/lab/fin_struggle_mid_f_side_src.png), [fin_struggle_mid_m_close_src.png](../../jj_zombie_dev/captures/lab/fin_struggle_mid_m_close_src.png), [fin_struggle_mid_m_shoulder_src.png](../../jj_zombie_dev/captures/lab/fin_struggle_mid_m_shoulder_src.png), [fin_struggle_mid_m_side_src.png](../../jj_zombie_dev/captures/lab/fin_struggle_mid_m_side_src.png)

## fin_struggle_high

Spieler gewinnt: Arme durchgestreckt, Zombiekopf nach hinten gedrückt.

- Verwendung: Kampf-Loop (> 70 %)
- Dictionary: `jjz_fin_m`, `jjz_fin_f`
- Dauer: 1.20 s (Loop); Varianten: m, f
- Events: `snap` @ 0.60 s
- Clips (erste Variante): victim: `fin_struggle_high_m_victim`, zombie: `fin_struggle_high_m_zombie`
- Knappste Metriken (erste Variante): wrist 72.871 / 88 (victim); neck 48.670 / 85 (victim); wristRoll 60.655 / 120 (victim)
- Kontaktbögen: [fin_struggle_high_m_close_src.png](../../jj_zombie_dev/captures/lab/fin_struggle_high_m_close_src.png)

## fin_grab

Zombie springt aus 1 m an, schlägt beide Hände auf den Schultergürtel (wo er am nächsten ist), reißt das Opfer herum; das Opfer dreht sich mit drei Schritten in den Clinch. 8 Richtungen x m/w.

- Verwendung: Finisher Start
- Dictionary: `jjz_fin_m`, `jjz_fin_f`
- Dauer: 1.20 s; Varianten: d0_m, d0_f, d1_m, d1_f, d2_m, d2_f, d3_m, d3_f, d4_m, d4_f, d5_m, d5_f, d6_m, d6_f, d7_m, d7_f
- Events: `grab_impact` @ 0.30 s
- Clips (erste Variante): victim: `fin_grab_d0_m_victim`, zombie: `fin_grab_d0_m_zombie`
- Knappste Metriken (erste Variante): wrist 73.082 / 88 (victim); footSlide 0.287 / 0.35 (victim); neck 48.670 / 85 (victim)
- Kontaktbögen: [fin_grab_d0_m_shoulder_src.png](../../jj_zombie_dev/captures/lab/fin_grab_d0_m_shoulder_src.png), [fin_grab_d0_m_side_src.png](../../jj_zombie_dev/captures/lab/fin_grab_d0_m_side_src.png), [fin_grab_d4_m_side_src.png](../../jj_zombie_dev/captures/lab/fin_grab_d4_m_side_src.png), [fin_grab_d4_m_top_src.png](../../jj_zombie_dev/captures/lab/fin_grab_d4_m_top_src.png)

## fin_shove

Erfolg: Ausholen, explosiver Stoß aus den Beinen (Ferse hebt ab), Zombie fliegt zurück (Ragdoll ab "impact"), Opfer schwingt nach und geht in Deckung.

- Verwendung: Finisher Erfolg
- Dictionary: `jjz_fin_m`, `jjz_fin_f`
- Dauer: 1.40 s; Varianten: m, f
- Events: `impact` @ 0.40 s, `release` @ 0.86 s
- Clips (erste Variante): victim: `fin_shove_m_victim`, zombie: `fin_shove_m_zombie`
- Knappste Metriken (erste Variante): linVel 8.579 / 10 (zombie); wrist 73.361 / 88 (victim); wristRoll 75.415 / 120 (victim)
- Kontaktbögen: [fin_shove_m_side_src.png](../../jj_zombie_dev/captures/lab/fin_shove_m_side_src.png)

## fin_bite

Niederlage: Arme knicken ein, Biss in die linke Halsseite mit Reißen, Schrei, Haken an die Schläfe (Zombie fliegt weg ab "impact"), Hand an den Hals.

- Verwendung: Finisher Niederlage
- Dictionary: `jjz_fin_m`, `jjz_fin_f`
- Dauer: 2.80 s; Varianten: m, f
- Events: `bite` @ 0.50 s, `impact` @ 1.68 s, `release` @ 2.50 s
- Clips (erste Variante): victim: `fin_bite_m_victim`, zombie: `fin_bite_m_zombie`
- Knappste Metriken (erste Variante): wrist 83.187 / 88 (zombie); linVel 9.666 / 11 (victim); angVel 2312.260 / 2800 (victim)
- Kontaktbögen: [fin_bite_m_front_src.png](../../jj_zombie_dev/captures/lab/fin_bite_m_front_src.png), [fin_bite_m_side_src.png](../../jj_zombie_dev/captures/lab/fin_bite_m_side_src.png), [fin_bite_m_side_src_pen.png](../../jj_zombie_dev/captures/lab/fin_bite_m_side_src_pen.png), [fin_bite_m_top_src_pen.png](../../jj_zombie_dev/captures/lab/fin_bite_m_top_src_pen.png)

## fin_recover

Nur Opfer: Hand am Hals, taumelt, richtet sich auf. Erstes Bild = letztes Bild von fin_bite.

- Verwendung: nach dem Biss
- Dictionary: `jjz_fin_m`, `jjz_fin_f`
- Dauer: 1.40 s; Varianten: m, f
- Clips (erste Variante): victim: `fin_recover_m`
- Abspielwerte: blendIn=4, blendOut=-2, flags=0
- Knappste Metriken (erste Variante): angVel 596.561 / 1500 (victim); wristRoll 45.816 / 120 (victim); wrist 29.041 / 88 (victim)

## smoke_bob

Smoke-Test: nur die Root-Position wippt 3 cm.

- Verwendung: /ztestanim bob
- Dictionary: `jjz_test`
- Dauer: 1.00 s (Loop); Varianten: -
- Clips (erste Variante): ped: `smoke_bob`
- Abspielwerte: blendIn=4, blendOut=-4, flags=1
- Knappste Metriken (erste Variante): linVel 1.123 / 9 (ped); angVel 0.000 / 1500 (ped); footSlide 0.000 / 0.3 (ped)

## smoke_face

Smoke-Test: Bindpose, prüft die Blickrichtung (Root-Konvention).

- Verwendung: /ztestanim face
- Dictionary: `jjz_test`
- Dauer: 2.00 s (Loop); Varianten: -
- Clips (erste Variante): ped: `smoke_face`
- Abspielwerte: blendIn=2, blendOut=-2, flags=1
- Knappste Metriken (erste Variante): angVel 0.000 / 1500 (ped); footSlide 0.000 / 0.3 (ped); groundPen 0.000 / 0.025 (ped)

## smoke_wave

Smoke-Test: rechter Arm winkt.

- Verwendung: /ztestanim wave
- Dictionary: `jjz_test`
- Dauer: 3.00 s (Loop); Varianten: -
- Clips (erste Variante): ped: `smoke_wave`
- Abspielwerte: blendIn=4, blendOut=-4, flags=1
- Knappste Metriken (erste Variante): angVel 781.121 / 1500 (ped); linVel 3.376 / 9 (ped); wrist 24.248 / 88 (ped)
- Kontaktbögen: [smoke_wave_front_src.png](../../jj_zombie_dev/captures/lab/smoke_wave_front_src.png), [smoke_wave_side_src.png](../../jj_zombie_dev/captures/lab/smoke_wave_side_src.png)

## zmove_shamble_walk

Schlurfer-Gang: vorgebeugt, rechtes Bein schleift, Arme hängen, Kopf pendelt.

- Verwendung: Bewegung Schlurfer (alternate walk)
- Dictionary: `jjz_move`
- Dauer: 1.60 s (Loop); Varianten: -
- Clips (erste Variante): zombie: `zmove_shamble_walk`
- Abspielwerte: blendIn=4, blendOut=-4, flags=1
- Knappste Metriken (erste Variante): linVel 4.152 / 9 (zombie); footSlide 0.157 / 0.35 (zombie); wrist 28.482 / 88 (zombie)
- Kontaktbögen: [zmove_shamble_walk_side_src.png](../../jj_zombie_dev/captures/lab/zmove_shamble_walk_side_src.png)

## zmove_shamble_idle

Schlurfer-Stand: Gewichtsverlagerung, Kopfrucken, Fingerzucken.

- Verwendung: Bewegung Schlurfer (alternate idle)
- Dictionary: `jjz_move`
- Dauer: 3.20 s (Loop); Varianten: -
- Clips (erste Variante): zombie: `zmove_shamble_idle`
- Abspielwerte: blendIn=3, blendOut=-3, flags=1
- Knappste Metriken (erste Variante): wrist 25.634 / 88 (zombie); neck 21.075 / 85 (zombie); spineSeg 4.122 / 38 (zombie)

## zmove_runner_walk

Läufer-Gang: schneller, aggressiver, Arme halb vorne.

- Verwendung: Bewegung Läufer (alternate walk)
- Dictionary: `jjz_move`
- Dauer: 1.00 s (Loop); Varianten: -
- Clips (erste Variante): zombie: `zmove_runner_walk`
- Abspielwerte: blendIn=4, blendOut=-4, flags=1
- Knappste Metriken (erste Variante): linVel 6.862 / 9 (zombie); angVel 656.484 / 1500 (zombie); footSlide 0.123 / 0.3 (zombie)

## zmove_runner_run

Läufer-Sprint: weite Schritte mit Flugphase, Klauen nach vorn, Oberkörper weit vorgeneigt.

- Verwendung: Bewegung Läufer (alternate run)
- Dictionary: `jjz_move`
- Dauer: 0.67 s (Loop); Varianten: -
- Clips (erste Variante): zombie: `zmove_runner_run`
- Abspielwerte: blendIn=4, blendOut=-4, flags=1
- Knappste Metriken (erste Variante): linVel 12.080 / 13.5 (zombie); angVel 1144.699 / 1900 (zombie); footSlide 0.146 / 0.3 (zombie)
- Kontaktbögen: [zmove_runner_run_side_src.png](../../jj_zombie_dev/captures/lab/zmove_runner_run_side_src.png)

## zmove_runner_idle

Läufer-Stand: lauernd, schnelles Atmen, Kopf ruckt.

- Verwendung: Bewegung Läufer (alternate idle)
- Dictionary: `jjz_move`
- Dauer: 2.00 s (Loop); Varianten: -
- Clips (erste Variante): zombie: `zmove_runner_idle`
- Abspielwerte: blendIn=3, blendOut=-3, flags=1
- Knappste Metriken (erste Variante): neck 25.404 / 85 (zombie); angVel 255.952 / 1500 (zombie); wrist 11.394 / 88 (zombie)

## zmove_alert_roar

Bemerkt den Spieler: reißt Arme und Kopf hoch, Brüllen nach vorn.

- Verwendung: KI Alerted
- Dictionary: `jjz_move`
- Dauer: 1.70 s; Varianten: -
- Events: `roar` @ 0.35 s
- Clips (erste Variante): zombie: `zmove_alert_roar`
- Abspielwerte: blendIn=6, blendOut=-3, flags=0
- Knappste Metriken (erste Variante): angVel 938.977 / 1500 (zombie); linVel 4.590 / 9 (zombie); neck 35.591 / 85 (zombie)
- Kontaktbögen: [zmove_alert_roar_front_src.png](../../jj_zombie_dev/captures/lab/zmove_alert_roar_front_src.png), [zmove_alert_roar_side_src.png](../../jj_zombie_dev/captures/lab/zmove_alert_roar_side_src.png)

## zreact_hit_front

Treffer von vorn (Oberkörper-Overlay).

- Verwendung: leichter Treffer
- Dictionary: `jjz_react`
- Dauer: 0.50 s; Varianten: -
- Clips (erste Variante): zombie: `zreact_hit_front`
- Abspielwerte: blendIn=8, blendOut=-4, flags=48
- Knappste Metriken (erste Variante): linVel 8.646 / 9 (zombie); angVel 1196.807 / 2200 (zombie); neck 29.218 / 85 (zombie)

## zreact_hit_back

Treffer von hinten (Oberkörper-Overlay).

- Verwendung: leichter Treffer
- Dictionary: `jjz_react`
- Dauer: 0.50 s; Varianten: -
- Clips (erste Variante): zombie: `zreact_hit_back`
- Abspielwerte: blendIn=8, blendOut=-4, flags=48
- Knappste Metriken (erste Variante): linVel 7.863 / 9 (zombie); angVel 1133.313 / 2200 (zombie); neck 22.343 / 85 (zombie)

## zreact_stagger_front

Schwerer Treffer von vorn: taumelt zwei Schritte zurück.

- Verwendung: schwerer Treffer
- Dictionary: `jjz_react`
- Dauer: 1.00 s; Varianten: -
- Clips (erste Variante): zombie: `zreact_stagger_front`
- Abspielwerte: blendIn=8, blendOut=-3, flags=0
- Knappste Metriken (erste Variante): floatFeet 0.059 / 0.06 (zombie); linVel 8.267 / 9 (zombie); angVel 1445.489 / 2200 (zombie)
- Kontaktbögen: [zreact_stagger_front_side_src.png](../../jj_zombie_dev/captures/lab/zreact_stagger_front_side_src.png)

## zreact_stagger_back

Schwerer Treffer von hinten: taumelt nach vorn.

- Verwendung: schwerer Treffer
- Dictionary: `jjz_react`
- Dauer: 1.00 s; Varianten: -
- Clips (erste Variante): zombie: `zreact_stagger_back`
- Abspielwerte: blendIn=8, blendOut=-3, flags=0
- Knappste Metriken (erste Variante): floatFeet 0.059 / 0.06 (zombie); linVel 8.429 / 9 (zombie); angVel 1419.850 / 2200 (zombie)

## zreact_death_a

Tod: sackt auf die Knie (Fußballen) und kippt vornüber.

- Verwendung: Körpertreffer-Tod (Variante A)
- Dictionary: `jjz_react`
- Dauer: 1.60 s; Varianten: -
- Clips (erste Variante): zombie: `zreact_death_a`
- Abspielwerte: blendIn=6, blendOut=-1, flags=2
- Knappste Metriken (erste Variante): neck 38.102 / 85 (zombie); linVel 2.906 / 9 (zombie); spineSeg 11.532 / 38 (zombie)
- Kontaktbögen: [zreact_death_a_side_src.png](../../jj_zombie_dev/captures/lab/zreact_death_a_side_src.png)

## zreact_death_b

Tod: setzt sich nach hinten (Fersen) und fällt auf den Rücken.

- Verwendung: Körpertreffer-Tod (Variante B)
- Dictionary: `jjz_react`
- Dauer: 1.40 s; Varianten: -
- Clips (erste Variante): zombie: `zreact_death_b`
- Abspielwerte: blendIn=6, blendOut=-1, flags=2
- Knappste Metriken (erste Variante): linVel 6.041 / 9 (zombie); angVel 830.083 / 1800 (zombie); neck 27.645 / 85 (zombie)

## zreact_reach

Greifen im Laufen (Oberkörper-Loop), Klauen nach vorn.

- Verwendung: KI Ready (Ausfallschritt)
- Dictionary: `jjz_react`
- Dauer: 0.80 s (Loop); Varianten: -
- Clips (erste Variante): zombie: `zreact_reach`
- Abspielwerte: blendIn=4, blendOut=-4, flags=49
- Knappste Metriken (erste Variante): spineSeg 4.990 / 38 (zombie); angVel 149.521 / 1500 (zombie); neck 7.894 / 85 (zombie)

## zreact_swipe

Klauenhieb, Event "hit".

- Verwendung: Fallback ohne Platz für den Finisher
- Dictionary: `jjz_react`
- Dauer: 0.90 s; Varianten: -
- Events: `hit` @ 0.42 s
- Clips (erste Variante): zombie: `zreact_swipe`
- Abspielwerte: blendIn=8, blendOut=-4, flags=0
- Knappste Metriken (erste Variante): linVel 9.664 / 10 (zombie); angVel 2007.568 / 2400 (zombie); spineSeg 9.220 / 38 (zombie)

## zreact_getup_back

Aufstehen aus Rückenlage nach dem Wegstoßen.

- Verwendung: eigenes Getup nach Ragdoll
- Dictionary: `jjz_react`
- Dauer: 2.20 s; Varianten: -
- Clips (erste Variante): zombie: `zreact_getup_back`
- Abspielwerte: blendIn=2, blendOut=-3, flags=0
- Knappste Metriken (erste Variante): linVel 2.382 / 9 (zombie); neck 20.053 / 85 (zombie); angVel 294.533 / 1500 (zombie)
- Kontaktbögen: [zreact_getup_back_side_src.png](../../jj_zombie_dev/captures/lab/zreact_getup_back_side_src.png)

## zreact_getup_front

Aufstehen aus Bauchlage.

- Verwendung: eigenes Getup nach Ragdoll
- Dictionary: `jjz_react`
- Dauer: 2.00 s; Varianten: -
- Clips (erste Variante): zombie: `zreact_getup_front`
- Abspielwerte: blendIn=2, blendOut=-3, flags=0
- Knappste Metriken (erste Variante): wrist 48.886 / 88 (zombie); wristRoll 52.892 / 120 (zombie); neck 33.804 / 85 (zombie)

## Übergänge (geprüft)

| von | nach | Akteur | max. Winkel | Mover |
|---|---|---|---|---|
| fin_struggle_low:m | fin_struggle_low:m | victim | 0.00° | 0.000 m |
| fin_struggle_low:m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_struggle_low:m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_struggle_low:m | fin_struggle_mid:m | zombie | 0.01° | 0.000 m |
| fin_struggle_low:m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_struggle_low:m | fin_struggle_high:m | zombie | 0.01° | 0.000 m |
| fin_struggle_low:m | fin_shove:m | victim | 0.00° | 0.000 m |
| fin_struggle_low:m | fin_shove:m | zombie | 0.01° | 0.000 m |
| fin_struggle_low:m | fin_bite:m | victim | 2.45° | 0.000 m |
| fin_struggle_low:m | fin_bite:m | zombie | 0.01° | 0.000 m |
| fin_struggle_low:f | fin_struggle_low:f | victim | 0.00° | 0.000 m |
| fin_struggle_low:f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_struggle_low:f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_struggle_low:f | fin_struggle_mid:f | zombie | 0.01° | 0.000 m |
| fin_struggle_low:f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_struggle_low:f | fin_struggle_high:f | zombie | 0.01° | 0.000 m |
| fin_struggle_low:f | fin_shove:f | victim | 0.00° | 0.000 m |
| fin_struggle_low:f | fin_shove:f | zombie | 0.01° | 0.000 m |
| fin_struggle_low:f | fin_bite:f | victim | 2.45° | 0.000 m |
| fin_struggle_low:f | fin_bite:f | zombie | 0.01° | 0.000 m |
| fin_struggle_mid:m | fin_struggle_low:m | victim | 0.01° | 0.000 m |
| fin_struggle_mid:m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_struggle_mid:m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_struggle_mid:m | fin_struggle_mid:m | zombie | 0.00° | 0.000 m |
| fin_struggle_mid:m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_struggle_mid:m | fin_struggle_high:m | zombie | 0.00° | 0.000 m |
| fin_struggle_mid:m | fin_shove:m | victim | 0.00° | 0.000 m |
| fin_struggle_mid:m | fin_shove:m | zombie | 0.00° | 0.000 m |
| fin_struggle_mid:m | fin_bite:m | victim | 2.45° | 0.000 m |
| fin_struggle_mid:m | fin_bite:m | zombie | 0.00° | 0.000 m |
| fin_struggle_mid:f | fin_struggle_low:f | victim | 0.01° | 0.000 m |
| fin_struggle_mid:f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_struggle_mid:f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_struggle_mid:f | fin_struggle_mid:f | zombie | 0.00° | 0.000 m |
| fin_struggle_mid:f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_struggle_mid:f | fin_struggle_high:f | zombie | 0.00° | 0.000 m |
| fin_struggle_mid:f | fin_shove:f | victim | 0.00° | 0.000 m |
| fin_struggle_mid:f | fin_shove:f | zombie | 0.00° | 0.000 m |
| fin_struggle_mid:f | fin_bite:f | victim | 2.45° | 0.000 m |
| fin_struggle_mid:f | fin_bite:f | zombie | 0.00° | 0.000 m |
| fin_struggle_high:m | fin_struggle_low:m | victim | 0.01° | 0.000 m |
| fin_struggle_high:m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_struggle_high:m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_struggle_high:m | fin_struggle_mid:m | zombie | 0.00° | 0.000 m |
| fin_struggle_high:m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_struggle_high:m | fin_struggle_high:m | zombie | 0.00° | 0.000 m |
| fin_struggle_high:m | fin_shove:m | victim | 0.00° | 0.000 m |
| fin_struggle_high:m | fin_shove:m | zombie | 0.00° | 0.000 m |
| fin_struggle_high:m | fin_bite:m | victim | 2.45° | 0.000 m |
| fin_struggle_high:m | fin_bite:m | zombie | 0.00° | 0.000 m |
| fin_struggle_high:f | fin_struggle_low:f | victim | 0.01° | 0.000 m |
| fin_struggle_high:f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_struggle_high:f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_struggle_high:f | fin_struggle_mid:f | zombie | 0.00° | 0.000 m |
| fin_struggle_high:f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_struggle_high:f | fin_struggle_high:f | zombie | 0.00° | 0.000 m |
| fin_struggle_high:f | fin_shove:f | victim | 0.00° | 0.000 m |
| fin_struggle_high:f | fin_shove:f | zombie | 0.00° | 0.000 m |
| fin_struggle_high:f | fin_bite:f | victim | 2.45° | 0.000 m |
| fin_struggle_high:f | fin_bite:f | zombie | 0.00° | 0.000 m |
| fin_grab:d0_m | fin_struggle_low:m | victim | 0.01° | 0.000 m |
| fin_grab:d0_m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_grab:d0_m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_grab:d0_m | fin_struggle_mid:m | zombie | 0.00° | 0.000 m |
| fin_grab:d0_m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_grab:d0_m | fin_struggle_high:m | zombie | 0.00° | 0.000 m |
| fin_grab:d0_f | fin_struggle_low:f | victim | 0.01° | 0.000 m |
| fin_grab:d0_f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_grab:d0_f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_grab:d0_f | fin_struggle_mid:f | zombie | 0.00° | 0.000 m |
| fin_grab:d0_f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_grab:d0_f | fin_struggle_high:f | zombie | 0.00° | 0.000 m |
| fin_grab:d1_m | fin_struggle_low:m | victim | 0.01° | 0.000 m |
| fin_grab:d1_m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_grab:d1_m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_grab:d1_m | fin_struggle_mid:m | zombie | 0.00° | 0.000 m |
| fin_grab:d1_m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_grab:d1_m | fin_struggle_high:m | zombie | 0.00° | 0.000 m |
| fin_grab:d1_f | fin_struggle_low:f | victim | 0.01° | 0.000 m |
| fin_grab:d1_f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_grab:d1_f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_grab:d1_f | fin_struggle_mid:f | zombie | 0.00° | 0.000 m |
| fin_grab:d1_f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_grab:d1_f | fin_struggle_high:f | zombie | 0.00° | 0.000 m |
| fin_grab:d2_m | fin_struggle_low:m | victim | 0.01° | 0.000 m |
| fin_grab:d2_m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_grab:d2_m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_grab:d2_m | fin_struggle_mid:m | zombie | 0.00° | 0.000 m |
| fin_grab:d2_m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_grab:d2_m | fin_struggle_high:m | zombie | 0.00° | 0.000 m |
| fin_grab:d2_f | fin_struggle_low:f | victim | 0.01° | 0.000 m |
| fin_grab:d2_f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_grab:d2_f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_grab:d2_f | fin_struggle_mid:f | zombie | 0.00° | 0.000 m |
| fin_grab:d2_f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_grab:d2_f | fin_struggle_high:f | zombie | 0.00° | 0.000 m |
| fin_grab:d3_m | fin_struggle_low:m | victim | 0.01° | 0.000 m |
| fin_grab:d3_m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_grab:d3_m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_grab:d3_m | fin_struggle_mid:m | zombie | 0.00° | 0.000 m |
| fin_grab:d3_m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_grab:d3_m | fin_struggle_high:m | zombie | 0.00° | 0.000 m |
| fin_grab:d3_f | fin_struggle_low:f | victim | 0.01° | 0.000 m |
| fin_grab:d3_f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_grab:d3_f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_grab:d3_f | fin_struggle_mid:f | zombie | 0.00° | 0.000 m |
| fin_grab:d3_f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_grab:d3_f | fin_struggle_high:f | zombie | 0.00° | 0.000 m |
| fin_grab:d4_m | fin_struggle_low:m | victim | 0.01° | 0.000 m |
| fin_grab:d4_m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_grab:d4_m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_grab:d4_m | fin_struggle_mid:m | zombie | 0.00° | 0.000 m |
| fin_grab:d4_m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_grab:d4_m | fin_struggle_high:m | zombie | 0.00° | 0.000 m |
| fin_grab:d4_f | fin_struggle_low:f | victim | 0.01° | 0.000 m |
| fin_grab:d4_f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_grab:d4_f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_grab:d4_f | fin_struggle_mid:f | zombie | 0.00° | 0.000 m |
| fin_grab:d4_f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_grab:d4_f | fin_struggle_high:f | zombie | 0.00° | 0.000 m |
| fin_grab:d5_m | fin_struggle_low:m | victim | 0.01° | 0.000 m |
| fin_grab:d5_m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_grab:d5_m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_grab:d5_m | fin_struggle_mid:m | zombie | 0.00° | 0.000 m |
| fin_grab:d5_m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_grab:d5_m | fin_struggle_high:m | zombie | 0.00° | 0.000 m |
| fin_grab:d5_f | fin_struggle_low:f | victim | 0.01° | 0.000 m |
| fin_grab:d5_f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_grab:d5_f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_grab:d5_f | fin_struggle_mid:f | zombie | 0.00° | 0.000 m |
| fin_grab:d5_f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_grab:d5_f | fin_struggle_high:f | zombie | 0.00° | 0.000 m |
| fin_grab:d6_m | fin_struggle_low:m | victim | 0.01° | 0.000 m |
| fin_grab:d6_m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_grab:d6_m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_grab:d6_m | fin_struggle_mid:m | zombie | 0.00° | 0.000 m |
| fin_grab:d6_m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_grab:d6_m | fin_struggle_high:m | zombie | 0.00° | 0.000 m |
| fin_grab:d6_f | fin_struggle_low:f | victim | 0.01° | 0.000 m |
| fin_grab:d6_f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_grab:d6_f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_grab:d6_f | fin_struggle_mid:f | zombie | 0.00° | 0.000 m |
| fin_grab:d6_f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_grab:d6_f | fin_struggle_high:f | zombie | 0.00° | 0.000 m |
| fin_grab:d7_m | fin_struggle_low:m | victim | 0.01° | 0.000 m |
| fin_grab:d7_m | fin_struggle_low:m | zombie | 0.01° | 0.000 m |
| fin_grab:d7_m | fin_struggle_mid:m | victim | 0.00° | 0.000 m |
| fin_grab:d7_m | fin_struggle_mid:m | zombie | 0.00° | 0.000 m |
| fin_grab:d7_m | fin_struggle_high:m | victim | 0.00° | 0.000 m |
| fin_grab:d7_m | fin_struggle_high:m | zombie | 0.00° | 0.000 m |
| fin_grab:d7_f | fin_struggle_low:f | victim | 0.01° | 0.000 m |
| fin_grab:d7_f | fin_struggle_low:f | zombie | 0.01° | 0.000 m |
| fin_grab:d7_f | fin_struggle_mid:f | victim | 0.00° | 0.000 m |
| fin_grab:d7_f | fin_struggle_mid:f | zombie | 0.00° | 0.000 m |
| fin_grab:d7_f | fin_struggle_high:f | victim | 0.00° | 0.000 m |
| fin_grab:d7_f | fin_struggle_high:f | zombie | 0.00° | 0.000 m |
| fin_bite:m | fin_recover:m | victim | 0.00° | 0.000 m |
| fin_bite:f | fin_recover:f | victim | 0.00° | 0.000 m |
