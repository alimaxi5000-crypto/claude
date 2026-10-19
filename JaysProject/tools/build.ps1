# Builds Jays Project on Windows (PowerShell). Requires CMake 3.20+, Visual Studio 2022
# (Desktop development with C++) and Node.js 20+ for the launcher.
#   powershell -ExecutionPolicy Bypass -File tools\build.ps1
# NOTE: this script was written for Windows but could not be executed during V0.1
# development (no Windows host was available); see docs/KNOWN_LIMITATIONS.md.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

cmake -S . -B build -A x64
if ($LASTEXITCODE -ne 0) { throw "CMake configure failed" }
cmake --build build --config Release --parallel
if ($LASTEXITCODE -ne 0) { throw "build failed" }

Push-Location launcher
npm install --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
Pop-Location

Write-Host "Built:" (Get-ChildItem build\bin\Release -Filter *.exe | ForEach-Object Name)
Write-Host "Run the launcher with: cd launcher; npm start"
