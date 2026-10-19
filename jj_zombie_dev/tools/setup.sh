#!/usr/bin/env bash
# One-time setup of the animation toolchain (Linux/macOS/Git Bash on Windows).
# - CodeWalker.Core (MIT) at a pinned commit, used only to write binary .ycd files.
# - npm dev dependencies (three, esbuild) for the browser lab.
# Requires: git, .NET 8 SDK, Node 18+.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CW_REPO="https://github.com/dexyfex/CodeWalker.git"
CW_COMMIT="485d56bec00262ed7fa472261cce7bbc6202b96e"
VENDOR="$HERE/vendor"
mkdir -p "$VENDOR"
if [ ! -d "$VENDOR/CodeWalker/.git" ]; then
  git clone --quiet "$CW_REPO" "$VENDOR/CodeWalker"
fi
( cd "$VENDOR/CodeWalker" && git fetch --quiet origin "$CW_COMMIT" 2>/dev/null || true; git checkout --quiet "$CW_COMMIT" )
GOT="$(cd "$VENDOR/CodeWalker" && git rev-parse HEAD)"
if [ "$GOT" != "$CW_COMMIT" ]; then echo "CodeWalker commit mismatch: $GOT" >&2; exit 1; fi
echo "CodeWalker.Core pinned at $GOT"
# Reference GTA ped skeleton (read-only input for the solver; never copied into the resource).
# Source: Sollumz (GPL-3.0) tools/BoneProperties.xml at a pinned commit, sha256-verified.
SZ_COMMIT="e124bddf7c0db12a61655aa98d23d0e7008b3b69"
SZ_SHA="6e482934e14fd1a94727b2573c7f9d4c461b1759f2807a295073a801f30173be"
mkdir -p "$VENDOR/sollumz"
SZ_FILE="$VENDOR/sollumz/BoneProperties.xml"
if [ ! -f "$SZ_FILE" ]; then
  curl -fsSL "https://raw.githubusercontent.com/Sollumz/Sollumz/$SZ_COMMIT/tools/BoneProperties.xml" -o "$SZ_FILE"
fi
echo "$SZ_SHA  $SZ_FILE" | sha256sum -c --quiet - || { echo "BoneProperties.xml hash mismatch" >&2; rm -f "$SZ_FILE"; exit 1; }
echo "reference skeleton ok ($SZ_COMMIT)"
dotnet build "$HERE/ycdtool/ycdtool.csproj" -c Release -nologo -v quiet -o "$HERE/ycdtool/out"
( cd "$HERE" && npm ci --silent --no-audit --no-fund )
echo "setup done"
