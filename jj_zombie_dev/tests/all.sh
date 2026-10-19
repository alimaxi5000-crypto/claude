#!/usr/bin/env bash
# All automatic checks for jj_zombie_test. Run from anywhere:
#   bash jj_zombie_dev/tests/all.sh            (full)
#   bash jj_zombie_dev/tests/all.sh --quick    (skips NUI screenshots, lab render and YCD conversion)
# Needs: lua5.4 + luac5.4, Node 18+; optional: .NET 8 + tools/setup.sh (YCD), Playwright (NUI/lab).
# Exit code 0 only if every executed step passed. Skipped steps are listed as SKIP, never as OK.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEV="$(cd "$HERE/.." && pwd)"
RES="$(cd "$DEV/../jj_zombie_test" && pwd)"
QUICK=0
[ "${1:-}" = "--quick" ] && QUICK=1
LOG="$DEV/build/tests"
mkdir -p "$LOG"
declare -a SUMMARY
FAILED=0

step() { # name, command...
  local name="$1"; shift
  local t0=$(date +%s.%N)
  if "$@" > "$LOG/$name.log" 2>&1; then
    SUMMARY+=("OK    $name ($(printf '%.1f' "$(echo "$(date +%s.%N) - $t0" | bc)") s)  $(tail -n 1 "$LOG/$name.log")")
  else
    SUMMARY+=("FAIL  $name  -> build/tests/$name.log")
    FAILED=1
    tail -n 25 "$LOG/$name.log" | sed "s/^/  [$name] /"
  fi
}
skip() { SUMMARY+=("SKIP  $1  ($2)"); }

# 1. Lua syntax (CfxLua backtick hashes replaced by a number for plain luac).
lua_syntax() {
  local n=0
  while IFS= read -r f; do
    sed 's/`[^`]*`/0/g' "$f" > "$LOG/_syntax.lua"
    luac5.4 -p "$LOG/_syntax.lua" 2>&1 | sed "s|$LOG/_syntax.lua|${f#$RES/}|" | grep . && return 1
    n=$((n + 1))
  done < <(find "$RES" -name '*.lua')
  echo "Lua syntax OK ($n files)"
}
command -v luac5.4 >/dev/null && step lua_syntax lua_syntax || skip lua_syntax "luac5.4 missing"

# 1b. JavaScript syntax (NUI, lab, tools, tests).
js_syntax() {
  local n=0
  while IFS= read -r f; do node --check "$f" || return 1; n=$((n + 1)); done < <(find "$RES/html" "$DEV/tools" "$DEV/tests" "$DEV/animlab/src" "$DEV/anims-src" \( -name '*.js' -o -name '*.mjs' \) -not -path '*/node_modules/*' -not -path '*/vendor/*')
  echo "JS syntax OK ($n files)"
}
step js_syntax js_syntax

# 1c. C# (ycdtool) compiles.
if command -v dotnet >/dev/null && [ -d "$DEV/tools/vendor/CodeWalker" ] && [ $QUICK -eq 0 ]; then
  step csharp_build dotnet build "$DEV/tools/ycdtool/ycdtool.csproj" -c Release -nologo -v quiet -o "$DEV/tools/ycdtool/out"
else
  skip csharp_build "dotnet/CodeWalker missing or --quick"
fi

# 2. Natives: exist, legal on the file's side, argument count.
if [ -d "$DEV/tools/vendor/fivem-ref/natives" ]; then step natives node "$DEV/tools/check-natives.mjs"
else skip natives "run tools/setup.sh (native references)"; fi

# 3. Cross-consistency (events, locales, config paths, manifest, clip registry, NUI).
step consistency node "$HERE/consistency.mjs"

# 4. Server logic with mocked natives (flows, aborts, input validation, fuzz).
step server_logic lua5.4 "$HERE/lua/test_server.lua" "$RES"

# 5. Benchmarks (server manager and client manager with 0 / 10 / 30 / 100 zombies).
step bench_server lua5.4 "$HERE/lua/bench_server.lua" "$RES"
step bench_client lua5.4 "$HERE/lua/bench_client.lua" "$RES"

# 6. Animations: metrics for every clip (+ YCD conversion and independent read-back).
if [ $QUICK -eq 0 ] && [ -f "$DEV/tools/ycdtool/out/ycdtool.dll" ] && command -v dotnet >/dev/null; then
  step animations node "$DEV/tools/build-anims.mjs"
  step catalog node "$DEV/tools/catalog.mjs"
else
  step animations node "$DEV/tools/build-anims.mjs" --no-ycd
  [ $QUICK -eq 1 ] || skip ycd_roundtrip "ycdtool not built (tools/setup.sh)"
fi

# 7. YCD files in the resource: independent reader parses every stream file without errors.
step ycd_reader node -e "
const fs=require('fs'),path=require('path'),zlib=require('zlib');
import('$DEV/tools/animcore/ycdreader.mjs').then(({parseYcd})=>{
  const dir='$RES/stream'; let n=0, clips=0;
  for (const f of fs.readdirSync(dir).filter(f=>f.endsWith('.ycd'))) {
    const r=parseYcd(new Uint8Array(fs.readFileSync(path.join(dir,f))),(b)=>new Uint8Array(zlib.inflateRawSync(b)));
    if (r.errors.length) { console.error(f, r.errors); process.exit(1); }
    n++; clips+=r.clips.length;
  }
  console.log('YCD reader OK ('+n+' files, '+clips+' clips)');
});"

# 8. Browser: NUI at 4 resolutions, lab renders without console errors.
if [ $QUICK -eq 0 ]; then
  step nui node "$HERE/nui.mjs"
  ( cd "$DEV" && node tools/build-lab.mjs > /dev/null ) && step lab node "$DEV/tools/lab-capture.mjs" --scene fin_grab --variant d0_m --cams side --grid 3x2 --out build/tests/lab
else
  skip nui "--quick"; skip lab "--quick"
fi

echo
echo "== jj_zombie_test automatic checks =="
for l in "${SUMMARY[@]}"; do echo "$l"; done
[ $FAILED -eq 0 ] && echo "ALL PASSED" || echo "FAILURES (see above)"
exit $FAILED
