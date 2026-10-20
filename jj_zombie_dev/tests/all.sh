#!/usr/bin/env bash
# All automatic checks for jj_zombie_test. Run from anywhere:
#   bash jj_zombie_dev/tests/all.sh            (full)
#   bash jj_zombie_dev/tests/all.sh --quick    (skips NUI screenshots, lab render and YCD conversion)
# Needs: Lua 5.4 (lua5.4/lua54/lua), Node 20+; optional: .NET 8 + animkit/setup.sh (YCD,
# natives), Playwright (NUI/lab). Exit code 0 only if every executed step passed. Skipped steps
# are listed as SKIP, never as OK.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEV="$(cd "$HERE/.." && pwd)"
RES="$(cd "$DEV/../jj_zombie_test" && pwd)"
KIT="$(cd "$DEV/../animkit" && pwd)"
QUICK=0
[ "${1:-}" = "--quick" ] && QUICK=1
LOG="$DEV/build/tests"
mkdir -p "$LOG"
source "$KIT/tests/lib.sh"

# 1. Lua syntax (CfxLua backtick hashes replaced by a number for plain luac).
if [ -n "$LUAC" ]; then step lua_syntax lua_syntax_dir "$RES"; else skip lua_syntax "luac 5.4 missing"; fi

# 1b. JavaScript syntax (NUI, lab, tools, tests).
js_syntax() {
  local n=0
  while IFS= read -r f; do node --check "$f" || return 1; n=$((n + 1)); done < <(find "$RES/html" "$DEV/tools" "$DEV/tests" "$DEV/animlab/src" "$DEV/anims-src" \( -name '*.js' -o -name '*.mjs' \) -not -path '*/node_modules/*' -not -path '*/vendor/*')
  echo "JS syntax OK ($n files)"
}
step js_syntax js_syntax

# 1c. C# (ycdtool, animkit/converter) compiles.
if command -v dotnet >/dev/null && [ -d "$KIT/vendor/CodeWalker" ] && [ $QUICK -eq 0 ]; then
  step csharp_build dotnet build "$KIT/converter/ycdtool/ycdtool.csproj" -c Release -nologo -v quiet -o "$KIT/converter/ycdtool/out"
else
  skip csharp_build "dotnet/CodeWalker missing or --quick"
fi

# 2. Natives: exist, legal on the file's side, argument count.
if [ -d "$KIT/vendor/fivem-ref/natives" ]; then step natives node "$DEV/tools/check-natives.mjs"
else skip natives "run animkit/setup.sh (native references)"; fi

# 3. Cross-consistency (events, locales, config paths, manifest, clip registry, NUI).
if [ -n "$LUA" ]; then step consistency node "$HERE/consistency.mjs"; else skip consistency "lua 5.4 missing"; fi

if [ -n "$LUA" ]; then
  # 4. Server logic with mocked natives (flows, aborts, input validation, fuzz).
  step server_logic "$LUA" "$HERE/lua/test_server.lua" "$RES"
  # 4b. Victim-side finisher flow with stubbed client natives (scene placement and chaining).
  step client_finisher "$LUA" "$HERE/lua/test_client_finisher.lua" "$RES"
  # 5. Benchmarks (server manager and client manager with 0 / 10 / 30 / 100 zombies).
  step bench_server "$LUA" "$HERE/lua/bench_server.lua" "$RES"
  step bench_client "$LUA" "$HERE/lua/bench_client.lua" "$RES"
else
  skip server_logic "lua 5.4 missing"; skip client_finisher "lua 5.4 missing"; skip bench_server "lua 5.4 missing"; skip bench_client "lua 5.4 missing"
fi

# 6. Animations: metrics for every clip (+ YCD conversion and independent read-back).
if [ $QUICK -eq 0 ] && [ -f "$KIT/converter/ycdtool/out/ycdtool.dll" ] && command -v dotnet >/dev/null; then
  step animations node "$DEV/tools/build-anims.mjs"
  step catalog node "$DEV/tools/catalog.mjs"
else
  step animations node "$DEV/tools/build-anims.mjs" --no-ycd
  [ $QUICK -eq 1 ] || skip ycd_roundtrip "ycdtool not built (animkit/setup.sh)"
fi

# 7. YCD files in the resource: independent reader parses every stream file without errors.
step ycd_reader node "$KIT/cli/animkit.mjs" check-ycd "$RES/stream"

# 8. Browser: NUI at 4 resolutions, lab renders without console errors.
if [ $QUICK -eq 0 ]; then
  step nui node "$HERE/nui.mjs"
  ( cd "$DEV" && node tools/build-lab.mjs > /dev/null ) && step lab node "$DEV/tools/lab-capture.mjs" --scene fin_grab --variant d0_m --cams side --grid 3x2 --out build/tests/lab
else
  skip nui "--quick"; skip lab "--quick"
fi

summary "jj_zombie_test automatic checks"
exit $FAILED
