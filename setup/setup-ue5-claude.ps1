<#
.SYNOPSIS
    Richtet Claude Code + Unreal-MCP (UEMCP) fuer ein UE5-Projekt ein.

.DESCRIPTION
    1. Installiert Claude Code (falls nicht vorhanden)
    2. Installiert uv (falls nicht vorhanden) - wird fuer den MCP-Server gebraucht
    3. Aktiviert das Python Editor Script Plugin in der .uproject
    4. Aktiviert Python Remote Execution in Config/DefaultEngine.ini
    5. Legt eine .mcp.json im Projekt an, damit Claude Code den Unreal-MCP-Server findet

.PARAMETER ProjectPath
    Ordner deines UE5-Projekts (der Ordner, in dem die .uproject-Datei liegt).

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\setup-ue5-claude.ps1 -ProjectPath "C:\Users\Ali\Documents\Unreal Projects\MeinSpiel"
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath
)

$ErrorActionPreference = "Stop"

function Write-Step($text) { Write-Host "`n==> $text" -ForegroundColor Cyan }
function Write-Ok($text)   { Write-Host "    OK: $text" -ForegroundColor Green }
function Write-Warn($text) { Write-Host "    ACHTUNG: $text" -ForegroundColor Yellow }

# Neu installierte Tools landen hier - fuer diese Sitzung in den PATH aufnehmen
$localBin = Join-Path $env:USERPROFILE ".local\bin"
if (-not ($env:Path -split ";" | Where-Object { $_ -eq $localBin })) {
    $env:Path = "$localBin;$env:Path"
}

# --- Projekt pruefen -------------------------------------------------------
Write-Step "Pruefe Projektordner"
if (-not (Test-Path $ProjectPath)) { throw "Ordner nicht gefunden: $ProjectPath" }
$ProjectPath = (Resolve-Path $ProjectPath).Path
$uproject = Get-ChildItem -Path $ProjectPath -Filter *.uproject -File | Select-Object -First 1
if (-not $uproject) { throw "Keine .uproject-Datei in $ProjectPath gefunden." }
Write-Ok "Projekt: $($uproject.Name)"

if (Get-Process -Name "UnrealEditor" -ErrorAction SilentlyContinue) {
    Write-Warn "Der Unreal Editor laeuft gerade. Bitte schliessen, sonst koennen Einstellungen ueberschrieben werden."
    Read-Host "    Enter druecken, wenn der Editor geschlossen ist"
}

# --- Claude Code -----------------------------------------------------------
Write-Step "Claude Code"
if (Get-Command claude -ErrorAction SilentlyContinue) {
    Write-Ok "bereits installiert"
} else {
    Invoke-RestMethod https://claude.ai/install.ps1 | Invoke-Expression
    if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
        Write-Warn "Installiert, aber 'claude' noch nicht im PATH. Nach dem Skript ein neues Terminal oeffnen."
    } else {
        Write-Ok "installiert"
    }
}

# --- uv --------------------------------------------------------------------
Write-Step "uv (fuer den MCP-Server)"
if (Get-Command uvx -ErrorAction SilentlyContinue) {
    Write-Ok "bereits installiert"
} else {
    Invoke-RestMethod https://astral.sh/uv/install.ps1 | Invoke-Expression
    Write-Ok "installiert"
}

# --- Python-Plugin in der .uproject aktivieren -----------------------------
Write-Step "Aktiviere Python Editor Script Plugin"
$json = Get-Content $uproject.FullName -Raw | ConvertFrom-Json
if (-not ($json.PSObject.Properties.Name -contains "Plugins")) {
    $json | Add-Member -NotePropertyName Plugins -NotePropertyValue @()
}
$plugins = @($json.Plugins)
foreach ($name in @("PythonScriptPlugin", "EditorScriptingUtilities")) {
    $existing = $plugins | Where-Object { $_.Name -eq $name }
    if ($existing) {
        $existing.Enabled = $true
    } else {
        $plugins += [pscustomobject]@{ Name = $name; Enabled = $true }
    }
    Write-Ok $name
}
$json.Plugins = $plugins
Copy-Item $uproject.FullName "$($uproject.FullName).bak" -Force
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($uproject.FullName, ($json | ConvertTo-Json -Depth 20), $utf8NoBom)
Write-Ok "Backup unter $($uproject.Name).bak"

# --- Remote Execution in DefaultEngine.ini ---------------------------------
Write-Step "Aktiviere Python Remote Execution"
$configDir = Join-Path $ProjectPath "Config"
New-Item -ItemType Directory -Path $configDir -Force | Out-Null
$ini = Join-Path $configDir "DefaultEngine.ini"
$section = "[/Script/PythonScriptPlugin.PythonScriptPluginSettings]"
$lines = @()
if (Test-Path $ini) { $lines = @(Get-Content $ini) }

$sectionIndex = [array]::IndexOf($lines, $section)
if ($sectionIndex -lt 0) {
    $lines += ""
    $lines += $section
    $lines += "bRemoteExecution=True"
} else {
    # Abschnittsende finden (naechste [..]-Zeile oder Dateiende)
    $end = $lines.Count
    for ($i = $sectionIndex + 1; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\s*\[') { $end = $i; break }
    }
    $found = $false
    for ($i = $sectionIndex + 1; $i -lt $end; $i++) {
        if ($lines[$i] -match '^\s*bRemoteExecution\s*=') { $lines[$i] = "bRemoteExecution=True"; $found = $true }
    }
    if (-not $found) {
        $before = $lines[0..$sectionIndex]
        $after  = if ($sectionIndex + 1 -lt $lines.Count) { $lines[($sectionIndex + 1)..($lines.Count - 1)] } else { @() }
        $lines  = @($before) + "bRemoteExecution=True" + @($after)
    }
}
Set-Content -Path $ini -Value $lines -Encoding UTF8
Write-Ok "Config/DefaultEngine.ini aktualisiert"

# --- .mcp.json fuer Claude Code --------------------------------------------
Write-Step "Verbinde Claude Code mit Unreal (MCP)"
$mcpFile = Join-Path $ProjectPath ".mcp.json"
$mcpJson = @'
{
  "mcpServers": {
    "unreal": {
      "command": "uvx",
      "args": ["uemcp"]
    }
  }
}
'@
[System.IO.File]::WriteAllText($mcpFile, $mcpJson, $utf8NoBom)
Write-Ok ".mcp.json angelegt"

# --- Fertig ----------------------------------------------------------------
Write-Host "`n============================================================" -ForegroundColor Green
Write-Host " Fertig! So geht's weiter:" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host " 1. Projekt in Unreal Engine oeffnen (Editor muss laufen)"
Write-Host " 2. Neues Terminal oeffnen und ausfuehren:"
Write-Host "      cd `"$ProjectPath`""
Write-Host "      claude"
Write-Host " 3. Beim ersten Start den MCP-Server 'unreal' erlauben"
Write-Host " 4. Mit /mcp pruefen, ob 'unreal' verbunden ist"
Write-Host " 5. Losschreiben: 'Spawne einen Wuerfel bei 0,0,100' :)"
Write-Host ""
