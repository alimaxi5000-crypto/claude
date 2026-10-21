# Bekannte Einschränkungen und offene Punkte

Ehrlich getrennt nach dem Stand der Prüfung.

## Noch nie im Spiel gesehen

Das gesamte System wurde in einer Cloud-Umgebung ohne GTA V gebaut. Alles, was im Folgenden
steht, ist rechnerisch geprüft (Tests, Metriken, Rücklesen) oder im Browser-Labor gesehen, aber
**nicht im Spiel**. Die erste Bestätigung liefert `/ztestanim` (INGAME_TEST.md #1–#4).

## Animation

- **Skelette**: Gebaut wurde auf dem Referenz-Skelett (Sollumz `BoneProperties.xml`). Das weibliche Skelett ist nur **angenähert** (skaliert). Mit den echten Skeletten aus deinen Spieldateien (`tools/import-skeleton.mjs`) passen Griffe und Kontakte genauer. Bitte schicken (siehe README).
- **Wurzel-Konvention**: `/ztestanim face` muss bestätigen, dass Figuren nach vorn schauen.
- **Kontaktpunkte** liegen auf Knochen, nicht auf der Haut/Kleidung. Bei dicker Kleidung kann eine Hand leicht einsinken oder schweben (1–3 cm). Korrektur über `/zalign` bzw. `anims-src/align.json`.
- Der Fallback-Teil von `fin_shove`/`fin_bite` nach dem "impact" (Zombie fliegt und fällt) ist nur sichtbar, wenn der Ragdoll nicht greift. Er ist bewusst einfach gehalten.
- Kleine Restwerte beim Fußrutschen (≤ 0,32 m/s für einzelne Frames beim Ausfallschritt/Drehen) liegen innerhalb der Grenzen, sind aber nicht null.

## Technik (im Spiel zu bestätigen)

- **Blut-Partikel**: `core` / `blood_stab` ist nicht verifiziert. Falls nichts sichtbar ist, in `Config.Effects` einen anderen Partikelnamen eintragen (Blut-Decal und Schadenspaket funktionieren unabhängig davon).
- **`SET_PED_ALTERNATE_MOVEMENT_ANIM` auf fremden Clients**: Jeder Client setzt die Bewegungs-Clips selbst. Ob das bei Ped-Klonen (nicht Besitzer) zuverlässig greift, muss das Spiel zeigen. Fallback wäre ein Clipset.
- **Tempo-Kopplung**: Die eigenen Lauf-Clips enthalten Wurzelbewegung, die Navigation bestimmt aber das Tempo. Sind Schrittweite und Tempo nicht deckungsgleich, rutschen die Füße sichtbar. Dann `TaskFollowNavMeshToCoord`-Geschwindigkeit oder Clip-Schrittweite anpassen.
- **Eigenes Aufstehen nach Ragdoll** (`Config.Effects.CustomGetup`) ist riskant (Übergang Ragdoll → Clip). Bei Problemen auf `false` stellen (GTA-eigenes Aufstehen).
- **Größenvariation** der Zombies ist in GTA ohne Per-Frame-Tricks nicht möglich und wurde deshalb weggelassen.
- **Netzwerkszenen mit fremdem Besitzer**: Getestet nur gegen die offizielle Doku (`SET_ENTITY_REMOTE_SYNCED_SCENES_ALLOWED`), nicht live mit zwei Spielern.
- **Eine Szene pro Akteur** (seit 0.1.3): Opfer und Zombie laufen in zwei vernetzten Szenen, die im selben Frame starten. Gehört der Zombie einem anderen Spieler, hängt der Gleichlauf davon ab, dass GTA beide Szenen mit derselben Startzeit verteilt. Das ist live mit zwei Spielern noch nicht gesehen. Läuft der Zombie sichtbar nach (Hände kommen zu spät), bitte melden. Der nächste Schritt wäre dann, dass der Opfer-Client den Zombie für die Dauer des Finishers übernimmt (noch nicht gebaut).
- **Entität während der Paar-Clips**: Die Entität jedes Akteurs bleibt auf seinem Startpunkt, die Bewegung steckt im Wurzelknochen. Die Kapsel des Zombies folgt dem Ausfallschritt also nicht (0,44 m). Bei einem Abbruch mitten im Grab gleitet sein Körper beim Ausblenden (0,25 s) zur Entität zurück.

## Integration (Annahmen, im Code mit `VERIFY:` markiert)

Siehe INTEGRATION_CHANGES.md: jj_core-Rollen, jj_lib-Logging, jj_health-Down-Status und Schaden,
jj_needs-Stress, jj_inventory-Sperre, Chat-Vorschläge, jj_gameplay-Exports. Alles hat Fallbacks.

## Sicherheit (bewusste Restrisiken)

Siehe SECURITY.md, Abschnitt "Was clientseitig trotzdem umgehbar ist".
