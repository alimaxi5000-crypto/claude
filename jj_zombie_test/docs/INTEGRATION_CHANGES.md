# Änderungen an fremden Resources

**Keine.** Es wurde keine fremde Resource geändert, keine Datei kopiert und keine
`.before-zombie`-Sicherung angelegt. Die `server.cfg` wurde nicht verändert.

Alle Verbindungen zu jj_*-Resources laufen über `integration/server.lua` und
`integration/client.lua`. Jeder Aufruf steckt in `pcall` und hat einen Fallback. Eine
abweichende API schaltet also nur die eine Funktion ab und erzeugt eine einmalige Warnung in
der Konsole. Aufrufe, deren Signatur aus dem Auftrag stammt und noch nicht am echten Code
geprüft wurde, sind im Code mit `VERIFY:` markiert:

| Funktion | Annahme | Fallback | Schalter |
|---|---|---|---|
| Rollen | `Core.hasRole(src, Config.Permissions.MinRole)` aus `@jj_core/import.lua` | ACE `jj_zombie.admin` | `ConfigServer.Integration.UseJJCoreRoles` |
| Logging | `JJ.log(level, msg)` oder `JJ.log.<level>(msg)` aus `@jj_lib/init.lua` | `print` | – |
| Am Boden | Event `jj:server:downChanged` (`src, isDown` oder `isDown` mit `source`), Export `exports.jj_health:isDown(src)` | Spielgesundheit ≤ 100 | `UseJJHealthDownState` |
| Stress | `Needs.addStress(src, amount, reason)` bzw. `exports.jj_needs:addStress(...)` | kein Stress | `UseJJNeedsStress` |
| Inventarsperre | `exports.jj_inventory:setBlocked(src, 'jj_zombie', on)` | keine Sperre | `UseJJInventoryBlock` |
| Gefesselt | Player-State `isCuffed` / `cuffed` / `handcuffed` / `isTied`, Native `IsPedHandcuffed` | nur Native | – |
| Chat-Vorschläge | `chat:addSuggestion` (Client-Event) | keine Vorschläge | – |
| Gameplay-Sperre | jj_gameplay-Exports (nicht verifiziert) | Finisher sperrt Steuerung selbst (`DisableAllControlActions`) | `Config.Integration.UseGameplayExports = false` |
| Schaden | `ApplyDamageToPed` auf dem Opfer-Client, jj_health sieht normalen Schaden | – | – |
| Screenshots | `exports['screenshot-basic']:requestClientScreenshot(src, {fileName, encoding, quality}, cb)` | `/zcapture` meldet "screenshot-basic läuft nicht" | – |

Bereitgestellt für andere Resources (Hooks für spätere Systeme, ohne eigene Logik):

| Typ | Name | Inhalt |
|---|---|---|
| Server-Export | `exports.jj_zombie_test:isInFinisher(src)` | true während eines Finishers |
| Server-Export | `exports.jj_zombie_test:isBitten(src)` | `bitten, { count, last, zombieType }` |
| Server-Event (lokal) | `jj_zombie:server:bitten` | `(src, { zombieType, finId, damage })`, z. B. für ein späteres Infektionssystem |
| Server-Event (lokal) | `jj_zombie:server:finisherEnded` | `(src, result, info)` |
| Player-State | `jjz_bitten` | `{ count, last, zombieType }` (repliziert) |
| Player-State | `jjz_fin` | laufende Finisher-ID oder 0 |
| Lua-Hook | `JJZ.Hooks.struggleModifier(src, fin)` | Multiplikator für den Fortschritt pro Druck (z. B. Ausdauer) |
