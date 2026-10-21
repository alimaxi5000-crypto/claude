# Bekannte Einschränkungen und offene Punkte

Ehrlich getrennt nach dem Stand der Prüfung.

## Noch nie im Spiel gesehen

Das Studio wurde auf einem Rechner ohne laufendes GTA V gebaut.

- **Automatisch geprüft:** Lua-Logik mit Mocks, Konverter mit echter `.ycd`-Erzeugung und unabhängigem Rücklesen, NUI in Chromium (Playwright) mit Mock-Backend.
- **Ungetestet im Spiel:** alles, was das Spiel selbst tut (Kamera, Geist-Ped, Szenen, Neustart der Stream-Resource, Laden der neuen Dicts). Die erste Bestätigung liefert `INGAME_TEST.md`.

## Im Spiel zu bestätigen (im Code mit `VERIFY` markiert)

| Punkt | Annahme | Wenn es nicht stimmt |
|---|---|---|
| Sichtfeld der Skript-Kamera | `SET_CAM_FOV` ist das **vertikale** Sichtfeld (wie three.js) | Overlay passt in der Mitte, driftet zu den Rändern. Das Abgleich-Werkzeug zeigt es (Test #6) |
| Neustart der Stream-Resource | `StopResource`/`StartResource` aus einem Resource-Skript brauchen keine ACE, und neue Dateien in `stream/` werden beim Neustart gefunden | `ConfigServer.RestartMethod = 'command'` und `add_ace resource.jj_animstudio command.ensure allow`. Notfalls einmal `refresh` |
| Neue Dicts ohne Neuverbinden | Jede Vorschau hat einen neuen Namen (`jjs_<projekt>_v<n>`), deshalb lädt der Client sie frisch | Meldung „Animation ist nicht angekommen“. Dann bitte melden |
| `TASK_SYNCHRONIZED_SCENE`-Parameter | Bedeutung wie bei `NETWORK_ADD_PED_TO_SYNCHRONISED_SCENE` (blendIn, blendOut, flags, ragdoll, moverBlend, ik). Die Parameternamen in der Doku sind veraltet | Ped springt oder blendet seltsam ein |
| `GET_PED_BONE_COORDS`-Versatz | Der Versatz liegt im Achsensystem des Knochens. Das Studio rechnet den Kontakt-Versatz aus dem Ruheraum dorthin um | Gemessene Kontakt-Abstände wären um wenige cm verschoben |
| Geist | `SetEntityAlpha` auf deinem eigenen Ped wird evtl. an andere Spieler übertragen (andere sehen dich halbtransparent) | Kein Schaden. Beim Schließen wird zurückgesetzt |
| Pausemenü | `DisableControlAction(0, 199/200)` sperrt das Pausemenü, ESC kommt beim NUI an | ESC öffnet das Pausemenü statt der Rückfrage. Dann `/animstudio close` |
| Kopieren | `document.execCommand('copy')` im CEF-NUI | Text markieren und Strg+C, oder Datei `data/outbox/<name>.report.md` nehmen |
| WebGL-Leistung im NUI | three.js mit 2 Akteuren hält 60 fps auf Mittelklasse-Hardware | Weniger Leistung: Onion-Skin aus, Fenster kleiner. Bitte FPS melden |

## Animation

- **Skelette:** Gebaut wird auf dem Referenz-Skelett (Sollumz `BoneProperties.xml`), das weibliche ist nur **angenähert** (skaliert). Mit deinen echten Skeletten (`animkit import-skeleton`) passen Griffe und Kontakte genauer. Bericht und Ampel nennen das verwendete Skelett.
- **Andere Ped-Modelle** (z. B. `a_m_y_skater_01`) nutzen das männliche Skelett. Der Bericht vermerkt das.
- **Einzel-Clips:** Ein Startversatz des Standpunkts bei 0 s wird von GTA ignoriert. Die Ampel warnt und bietet „Start auf 0 setzen“.
- **Drehringe:** Die drei Werte sind Komponenten eines Drehvektors in der Gelenk-Basis. Bei großen Winkeln auf mehreren Achsen gleichzeitig wirken sie nicht wie unabhängige Euler-Winkel. Gelenkgrenzen sind gutmütige Näherungen, keine Anatomie-Datenbank. Ringe, die genau seitlich zur Kamera stehen, lassen sich schwer ziehen (Zahlenfelder nutzen).
- **IK-Reichweite:** Eine festgeklebte Hand erreicht nur Punkte in Armlänge. Ist der Partner zu weit weg, bleibt der Kontakt offen und die Ampel zeigt rot.
- **Füße festkleben bei FK-Beinen:** Bewegt sich das Becken zu weit, kann der Fuß wegen der Beinlänge nicht stehen bleiben (Restrutschen wenige cm/s).
- **Kontaktpunkte** liegen auf Knochen, nicht auf Haut oder Kleidung (1–3 cm Abweichung möglich).

## Technik

- **Live-Prüfung bei langen Clips:** Die Ampel rechnet nach jeder Änderung den ganzen Clip (gemessen in Node: 2 s Paar ≈ 80 ms, 10 s ≈ 0,3 s, 30 s mit Kontakt ≈ 0,7 s). Bei sehr langen Paar-Clips kann das NUI kurz stocken.
- **Englische Oberfläche:** Mit `Config.Locale = 'en'` sind Chat-Meldungen vollständig englisch, im Studio nur die wichtigsten Texte (der Rest bleibt deutsch).

- **Neustart betrifft alle Spieler:** Jede Vorschau startet `jj_animstudio_stream` neu, alle Spieler laden die neue Datei. Das Studio weist vor dem ersten Test darauf hin.
- **Stream-Resource:** Der Konverter legt sie beim ersten Start an. Existierte sie beim Serverstart noch nicht, braucht es einmal `refresh` + `ensure jj_animstudio_stream` (oder einen Serverneustart).
- **Vorschauen:** Es bleiben nur die letzten 5 Vorschau-Dicts liegen. Fertige Dicts bleiben dauerhaft in der Stream-Resource und in `data/outbox/final/`.
- **Fertigstellen** kopiert die `.ycd` **nicht** in die Ziel-Resource (keine Änderung an fremden Resources). Der Bericht beschreibt die zwei Handgriffe.
- **Projektlisten-Index:** Ein von Hand bearbeitetes Projekt (andere Schlüssel-Reihenfolge) kann nicht umbenannt werden. Einmal im Studio öffnen und speichern.
