#!/usr/bin/env bash
# Runs every automated test: unit, integration and (if a display or xvfb-run exists) the launcher e2e test.
#   tools/test-all.sh          native binaries
#   tools/test-all.sh --wine   also run the Windows binaries in build-win/ under Wine
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== unit tests"
./build/bin/jays-unit-tests

echo "== integration tests"
python3 tests/integration/test_e2e.py --bin-dir build/bin --project-dir .

echo "== launcher e2e test"
if [[ -n "${DISPLAY:-}" ]]; then
  (cd launcher && npm test)
elif command -v xvfb-run >/dev/null; then
  (cd launcher && xvfb-run -a npm test)
else
  echo "skipped: no display and no xvfb-run"
fi

if [[ "${1:-}" == "--wine" ]]; then
  WINE="$(command -v wine64 || echo /usr/lib/wine/wine64)"
  export WINEDEBUG=-all
  echo "== Windows unit tests (Wine)"
  "$WINE" build-win/bin/jays-unit-tests.exe
  echo "== Windows integration tests (Wine)"
  python3 tests/integration/test_e2e.py --bin-dir build-win/bin --project-dir . --exe-suffix .exe --runner "$WINE"
fi
