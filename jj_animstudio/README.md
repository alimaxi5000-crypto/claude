# jj_animstudio – Animations-Studio im Spiel

Mit dem Studio baust du eigene GTA-V-Animationen direkt im Spiel, ohne Animations-Vorkenntnisse:
- **Bearbeiten:** Du stellst Posen an einem 3D-Skelett ein, das genau über deinem Ped liegt.
- **Umwandeln:** Der Server erzeugt daraus automatisch eine echte `.ycd`-Datei.
- **Testen:** Dein echter Ped (bei Paar-Animationen beide) spielt sie sofort ab.
- **Fertigstellen:** Am Ende bekommst du die fertige `.ycd`, einen Registry-Eintrag und einen Bericht, mit dem Claude die Animation in ein Script einbaut.

Bedienung: [docs/BEDIENUNG.md](docs/BEDIENUNG.md) · Test im Spiel: [docs/INGAME_TEST.md](docs/INGAME_TEST.md) · Stand: **0.1.0, im Spiel noch ungetestet** ([docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md)).

## Was wohin gehört

| Ordner | Was | Wo |
|---|---|---|
| `jj_animstudio/` | FiveM-Resource (Studio) | in deinen Resources-Ordner, z. B. `resources/[jj]/jj_animstudio` |
| `jj_animstudio_stream/` | wird vom Konverter **erzeugt** (nur `fxmanifest.lua` + `stream/`) | neben `jj_animstudio`, nicht von Hand anlegen |
| `animkit/` | Konverter (Node + .NET), **keine** Resource | irgendwo auf dem Server-Rechner, z. B. `txData/JJ CORESERVER/animkit` |

## Installation Schritt für Schritt

### 1. Programme installieren (einmalig, auf dem Server-Rechner)

- **Node.js 20 oder neuer:** <https://nodejs.org> → „LTS“ herunterladen und installieren. Prüfen: `node --version` zeigt `v20…` oder höher.
- **.NET 8 SDK:** <https://dotnet.microsoft.com/download/dotnet/8.0> → „SDK“. Ein neueres SDK geht auch, wenn die **.NET 8 Runtime** dabei ist. Prüfen: `dotnet --list-runtimes` zeigt eine Zeile `Microsoft.NETCore.App 8.…`.
- **Git:** <https://git-scm.com>. Wird für den einmaligen Download von CodeWalker gebraucht.

### 2. Dateien kopieren

1. Den Ordner `jj_animstudio` nach `resources/[jj]/jj_animstudio` kopieren.
2. Den Ordner `animkit` z. B. nach `txData/JJ CORESERVER/animkit` kopieren.

### 3. animkit einrichten (einmalig)

Im Ordner, in dem `animkit` liegt:
- **Windows (PowerShell):** `powershell -ExecutionPolicy Bypass -File .\animkit\setup.ps1`
- **Linux / Git Bash:** `bash animkit/setup.sh`

Das lädt CodeWalker.Core (an einem festen Stand), das Referenz-Skelett (Hash-geprüft) und die offiziellen Native-Listen, baut den `.ycd`-Konverter und installiert die Node-Pakete. Nichts davon landet im Repository.

### 4. Pfade eintragen

`animkit/animkit.config.example.json` nach `animkit/animkit.config.json` kopieren und die zwei Pfade anpassen. Relative Pfade gehen von `animkit/` aus:

```json
{
  "studio": "../resources/[jj]/jj_animstudio",
  "stream": "../resources/[jj]/jj_animstudio_stream"
}
```

### 5. Prüfen: `animkit doctor`

```
node animkit/cli/animkit.mjs doctor
```

Die Ausgabe zwischen den Markierungen „copy from here / until here“ kannst du direkt an Claude schicken. `FAIL`-Zeilen sagen, was fehlt.

### 6. Konverter starten (`animkit watch`)

Der Konverter ist ein eigener Prozess und muss laufen, solange das Studio benutzt wird:
- **Windows:** Doppelklick auf `animkit/start-watch.bat`. Das Fenster offen lassen, es startet sich bei einem Absturz neu.
- **Linux:** `./animkit/start-watch.sh`

Beim ersten Start legt er `jj_animstudio_stream` an und schreibt die Skelette nach `jj_animstudio/data/skeletons/`.

**Mit dem Server zusammen starten.** txAdmin startet nur den FiveM-Server, keine anderen Programme. Darum:
- **Windows:** einmal `powershell -ExecutionPolicy Bypass -File .\animkit\service\install-task-windows.ps1` ausführen. Damit startet `animkit watch` bei jeder Anmeldung des Benutzers, unter dem auch txAdmin läuft. Alternativ `start-watch.bat` in den Autostart legen.
- **Linux:** `animkit/service/animkit-watch.service` nach `/etc/systemd/system/` kopieren, `User` und `WorkingDirectory` anpassen, dann `sudo systemctl enable --now animkit-watch`.

### 7. server.cfg – diese Zeilen trägst **du** ein

```
# Animations-Studio
ensure jj_animstudio_stream
ensure jj_animstudio
add_ace group.admin jj_animstudio.use allow
```

- **Andere Gruppe:** Nutzt du statt `group.admin` eine andere Admin-Gruppe, trag deren Namen ein (bei jj_core z. B. `group.jj_admin`).
- **Über jj_core (Standard):** `Config.JJCoreRole = 'admin'` in `config/config.lua`: Wer in jj_core mindestens admin ist (also auch owner), darf das Studio auch ohne ACE nutzen. `false` = nur ACE. Fehlt das Recht, schreibt der Server den Grund einmal in die Konsole.
- **Nur falls der Neustart der Stream-Resource nicht klappt** (siehe KNOWN_ISSUES): `ConfigServer.RestartMethod = 'command'` setzen und zusätzlich `add_ace resource.jj_animstudio command.ensure allow` eintragen.

`jj_animstudio_stream` muss **vor** dem Serverstart existieren. Also einmal `animkit watch` starten, dann den Server (neu) starten.

### 8. Im Spiel

`/animstudio` öffnet das Studio, `/animstudio close` oder ESC schließt es. Weiter in [docs/BEDIENUNG.md](docs/BEDIENUNG.md).

## Echte Skelette (empfohlen)

Mit den echten Skeletten deiner Spieldateien passen Griffe und Kontakte genauer als mit dem Referenz-Skelett:
1. In CodeWalker `mp_m_freemode_01.yft`, `mp_f_freemode_01.yft` und `u_m_y_zombie_01.yft` öffnen und „Export XML“ wählen.
2. Importieren:
   ```
   node animkit/cli/animkit.mjs import-skeleton male   <pfad>/mp_m_freemode_01.yft.xml
   node animkit/cli/animkit.mjs import-skeleton female <pfad>/mp_f_freemode_01.yft.xml
   node animkit/cli/animkit.mjs import-skeleton zombie <pfad>/u_m_y_zombie_01.yft.xml
   ```
3. `animkit watch` neu starten.

Die Dateien liegen nur lokal unter `animkit/skeletons/real/`. Sie sind gitignored, weil sie aus Rockstar-Daten stammen: nie committen, nie weitergeben.

## Konfiguration

- **`config/config.lua`:** Sprache, Befehl, ACE, Autosave, Geist-Transparenz, Partner-Modelle, Kamera, Test-Grenzen. Jede Option ist kommentiert.
- **`config/config_server.lua`:** Größen- und Rate-Limits, Sicherungen, Zeitlimit, Neustart-Methode.
- **`editable/server.lua`:** eigener Rechte-Hook und eigene Logs.

## Leistung

- **Studio geschlossen:** 0,00 ms (keine Threads, NUI rendert nicht).
- **Studio offen:** Lua nur Kamera, Peds und ein Frame-Thread (Pausemenü sperren). Overlay, Solver und Prüfung laufen im NUI.
- **Server:** Ein Poll-Thread läuft nur, solange Umwandlungen offen sind.

## Tests

```
bash jj_animstudio/tests/all.sh
```

Der Testlauf umfasst Lua-Syntax, Natives gegen die offizielle Datenbank, Konsistenz, Server-/Client-Logik mit Mocks und Fuzz, Konverter mit echter `.ycd` und Rücklesen, echten Konverter-Prozess, NUI bei 4 Auflösungen mit Klickpfad, und Kontaktbögen. `--quick` lässt `.ycd` und Browser weg.

## Dokumentation

[ARCHITECTURE](docs/ARCHITECTURE.md) · [FORMAT](docs/FORMAT.md) (Clip-Dokument `jj-anim/1`) · [SECURITY](docs/SECURITY.md) · [KNOWN_ISSUES](docs/KNOWN_ISSUES.md) · [INGAME_TEST](docs/INGAME_TEST.md) · [CHANGELOG](CHANGELOG.md)
