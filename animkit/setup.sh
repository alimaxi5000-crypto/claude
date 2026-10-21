#!/usr/bin/env bash
# One-time setup of animkit (Linux, macOS, Git Bash on Windows). Safe to run again.
# - CodeWalker.Core (MIT) at a pinned commit, used only to write binary .ycd files (ycdtool).
# - Reference GTA ped skeleton: Sollumz (GPL-3.0) tools/BoneProperties.xml, sha256-verified.
#   Read locally as solver input only; never copied into a resource or the repository.
# - Official native references for the native checker (citizenfx/natives, citizenfx/fivem
#   ext/native-decls + ext/natives), read locally only.
# - npm dependencies (three, esbuild for the studio NUI bundle; playwright for tests, optional).
# Requires: git, curl, .NET 8 SDK (or newer SDK with the .NET 8 runtime), Node 20+.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENDOR="$HERE/vendor"
mkdir -p "$VENDOR"
sha256() { if command -v sha256sum >/dev/null; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi; }

CW_REPO="https://github.com/dexyfex/CodeWalker.git"
CW_COMMIT="485d56bec00262ed7fa472261cce7bbc6202b96e"
if [ ! -d "$VENDOR/CodeWalker/.git" ]; then git clone --quiet "$CW_REPO" "$VENDOR/CodeWalker"; fi
( cd "$VENDOR/CodeWalker" && { git fetch --quiet origin "$CW_COMMIT" 2>/dev/null || true; } && git checkout --quiet "$CW_COMMIT" )
GOT="$(cd "$VENDOR/CodeWalker" && git rev-parse HEAD)"
[ "$GOT" = "$CW_COMMIT" ] || { echo "CodeWalker commit mismatch: $GOT" >&2; exit 1; }
echo "CodeWalker.Core pinned at $GOT"

SZ_COMMIT="e124bddf7c0db12a61655aa98d23d0e7008b3b69"
SZ_SHA="6e482934e14fd1a94727b2573c7f9d4c461b1759f2807a295073a801f30173be"
mkdir -p "$VENDOR/sollumz"
SZ_FILE="$VENDOR/sollumz/BoneProperties.xml"
[ -f "$SZ_FILE" ] || curl -fsSL "https://raw.githubusercontent.com/Sollumz/Sollumz/$SZ_COMMIT/tools/BoneProperties.xml" -o "$SZ_FILE"
[ "$(sha256 "$SZ_FILE")" = "$SZ_SHA" ] || { echo "BoneProperties.xml hash mismatch" >&2; rm -f "$SZ_FILE"; exit 1; }
echo "reference skeleton ok ($SZ_COMMIT)"

NAT_COMMIT="3432156872baedaf18421bebb238f511468e6b0a"
FX_COMMIT="580b25c85d0784992c43313a9136b8d5b6839b0a"
REF="$VENDOR/fivem-ref"
mkdir -p "$REF"
[ -d "$REF/natives/.git" ] || git clone --quiet --filter=blob:none https://github.com/citizenfx/natives.git "$REF/natives"
( cd "$REF/natives" && { git fetch --quiet origin "$NAT_COMMIT" 2>/dev/null || true; } && git checkout --quiet "$NAT_COMMIT" )
if [ ! -d "$REF/fx/.git" ]; then
  git clone --quiet --filter=blob:none --sparse https://github.com/citizenfx/fivem.git "$REF/fx"
  ( cd "$REF/fx" && git sparse-checkout set ext/native-decls ext/natives )
fi
( cd "$REF/fx" && { git fetch --quiet origin "$FX_COMMIT" 2>/dev/null || true; } && git checkout --quiet "$FX_COMMIT" )
echo "native references: natives $(cd "$REF/natives" && git rev-parse --short HEAD), fivem $(cd "$REF/fx" && git rev-parse --short HEAD)"

dotnet build "$HERE/converter/ycdtool/ycdtool.csproj" -c Release -nologo -v quiet -o "$HERE/converter/ycdtool/out"
( cd "$HERE" && npm ci --silent --no-audit --no-fund )
echo "animkit setup done. Check everything with: node animkit/cli/animkit.mjs doctor"
