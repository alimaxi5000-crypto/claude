# UE5-Spiel mit Claude (Vibe Coding)

## Einmalige Einrichtung (Windows)

1. **Unreal Engine 5** installieren und ein **C++-Projekt** anlegen (z. B. Third-Person-Template, „C++“ auswählen).
2. Dieses Repo herunterladen (oder nur `setup/setup-ue5-claude.ps1`).
3. **Unreal Editor schließen.**
4. PowerShell öffnen und ausführen (Pfad zu deinem Projekt anpassen):

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\setup\setup-ue5-claude.ps1 -ProjectPath "C:\Pfad\zu\MeinSpiel"
   ```

Das Skript:
- installiert **Claude Code** und **uv** (falls noch nicht da)
- aktiviert das **Python Editor Script Plugin** + Editor Scripting Utilities
- schaltet **Python Remote Execution** in `Config/DefaultEngine.ini` ein
- legt `.mcp.json` an, damit Claude Code den Unreal-MCP-Server ([UEMCP](https://pypi.org/project/uemcp/)) nutzt

## Loslegen

1. Projekt im Unreal Editor öffnen.
2. Terminal im Projektordner: `claude`
3. MCP-Server „unreal“ erlauben, mit `/mcp` prüfen.
4. Los geht's 🎮

## Hinweis

UEMCP unterstützt laut Projektbeschreibung UE 5.0 – 5.6 (teils 5.7). Bei neueren Versionen erst das README des Projekts prüfen.
