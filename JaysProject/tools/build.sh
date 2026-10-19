#!/usr/bin/env bash
# Builds Jays Project on Linux/macOS: native binaries, tests and launcher dependencies.
#   tools/build.sh            Release build into build/
#   tools/build.sh --windows  also cross-compile Windows x64 binaries into build-win/ (needs MinGW-w64)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

GEN=()
command -v ninja >/dev/null && GEN=(-G Ninja)

cmake -S . -B build "${GEN[@]}" -DCMAKE_BUILD_TYPE=Release
cmake --build build --parallel

if [[ "${1:-}" == "--windows" ]]; then
  cmake -S . -B build-win "${GEN[@]}" -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=tools/cmake/mingw-w64.cmake
  cmake --build build-win --parallel
fi

if command -v npm >/dev/null; then
  (cd launcher && npm install --no-audit --no-fund)
else
  echo "npm not found: skipping launcher dependencies" >&2
fi

echo "built: $(ls build/bin)"
