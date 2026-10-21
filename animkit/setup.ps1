# One-time setup of animkit on Windows without Git Bash (same steps as setup.sh). Safe to run again.
#   powershell -ExecutionPolicy Bypass -File .\animkit\setup.ps1
# Requires: git, .NET 8 SDK (or newer SDK with the .NET 8 runtime), Node 20+.
$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$vendor = Join-Path $here 'vendor'
New-Item -ItemType Directory -Force $vendor | Out-Null

function Pin($dir, $url, $commit, [switch]$sparse) {
  if (-not (Test-Path (Join-Path $dir '.git'))) {
    if ($sparse) {
      git clone --quiet --filter=blob:none --sparse $url $dir
      git -C $dir sparse-checkout set ext/native-decls ext/natives
    } else { git clone --quiet --filter=blob:none $url $dir }
  }
  git -C $dir fetch --quiet origin $commit 2>$null
  git -C $dir checkout --quiet $commit
  $got = (git -C $dir rev-parse HEAD).Trim()
  if ($got -ne $commit) { throw "commit mismatch in ${dir}: $got" }
}

# CodeWalker.Core (MIT), used only to write binary .ycd files.
Pin (Join-Path $vendor 'CodeWalker') 'https://github.com/dexyfex/CodeWalker.git' '485d56bec00262ed7fa472261cce7bbc6202b96e'
Write-Host 'CodeWalker.Core pinned'

# Reference ped skeleton (Sollumz, GPL-3.0), read locally only, sha256-verified.
$szDir = Join-Path $vendor 'sollumz'
New-Item -ItemType Directory -Force $szDir | Out-Null
$sz = Join-Path $szDir 'BoneProperties.xml'
if (-not (Test-Path $sz)) {
  Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/Sollumz/Sollumz/e124bddf7c0db12a61655aa98d23d0e7008b3b69/tools/BoneProperties.xml' -OutFile $sz
}
$hash = (Get-FileHash $sz -Algorithm SHA256).Hash.ToLower()
if ($hash -ne '6e482934e14fd1a94727b2573c7f9d4c461b1759f2807a295073a801f30173be') { Remove-Item $sz; throw 'BoneProperties.xml hash mismatch' }
Write-Host 'reference skeleton ok'

# Official native references for the native checker (read locally only).
$ref = Join-Path $vendor 'fivem-ref'
New-Item -ItemType Directory -Force $ref | Out-Null
Pin (Join-Path $ref 'natives') 'https://github.com/citizenfx/natives.git' '3432156872baedaf18421bebb238f511468e6b0a'
Pin (Join-Path $ref 'fx') 'https://github.com/citizenfx/fivem.git' '580b25c85d0784992c43313a9136b8d5b6839b0a' -sparse
Write-Host 'native references ok'

dotnet build (Join-Path $here 'converter\ycdtool\ycdtool.csproj') -c Release -nologo -v quiet -o (Join-Path $here 'converter\ycdtool\out')
if ($LASTEXITCODE -ne 0) { throw 'ycdtool build failed' }
Push-Location $here
npm ci --silent --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'npm ci failed' }
Pop-Location
Write-Host 'animkit setup done. Check everything with: node animkit\cli\animkit.mjs doctor'
