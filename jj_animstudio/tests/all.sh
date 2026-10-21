#!/usr/bin/env bash
# All automatic checks for jj_animstudio + animkit in one command. Run from anywhere:
#   bash jj_animstudio/tests/all.sh            (full)
#   bash jj_animstudio/tests/all.sh --quick    (no .ycd conversion, no browser)
# Needs: Lua 5.4 (lua5.4/lua54/lua), Node 20+; optional: animkit/setup.sh (.NET ycdtool, native
# references, esbuild/three), Playwright + Chromium (NUI, contact sheets).
# Exit code 0 only if every executed step passed. Skipped steps are listed as SKIP, never as OK.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RES="$(cd "$HERE/.." && pwd)"
KIT="$(cd "$RES/../animkit" && pwd)"
QUICK=0
[ "${1:-}" = "--quick" ] && QUICK=1
LOG="$RES/tests/out/logs"
mkdir -p "$LOG"
source "$KIT/tests/lib.sh"
YCD=0
[ -f "$KIT/converter/ycdtool/out/ycdtool.dll" ] && command -v dotnet >/dev/null && YCD=1

# 1. Static checks.
lua_files() { lua_syntax_dir "$RES/client" && lua_syntax_dir "$RES/server" && lua_syntax_dir "$RES/shared" && lua_syntax_dir "$RES/config" && lua_syntax_dir "$RES/locales" && lua_syntax_dir "$RES/editable" && lua_syntax_dir "$RES/tests/lua" && "$LUAC" -p "$RES/fxmanifest.lua" && echo "Lua syntax OK"; }
if [ -n "$LUAC" ]; then step lua_syntax lua_files; else skip lua_syntax "luac 5.4 missing"; fi
js_syntax() {
  local n=0
  while IFS= read -r f; do node --check "$f" || return 1; n=$((n + 1)); done < <(find "$RES/web/src" "$RES/tools" "$RES/tests" -name '*.mjs' -not -path '*/out/*')
  echo "JS syntax OK ($n files)"
}
step js_syntax js_syntax
# The committed NUI bundle must match its sources (rebuilt from web/src).
bundle_fresh() {
  [ -d "$KIT/node_modules/esbuild" ] || { echo "esbuild missing (animkit/setup.sh)"; return 1; }
  cp "$RES/web/studio.bundle.js" "$LOG/bundle.before.js"
  node "$RES/tools/build-web.mjs" >/dev/null || return 1
  if cmp -s "$RES/web/studio.bundle.js" "$LOG/bundle.before.js"; then echo "bundle up to date"; else echo "web/studio.bundle.js was outdated and has been rebuilt: commit it"; return 1; fi
}
if [ -d "$KIT/node_modules/esbuild" ]; then step bundle_fresh bundle_fresh; else skip bundle_fresh "esbuild missing (animkit/setup.sh)"; fi
if [ -d "$KIT/vendor/fivem-ref/natives" ]; then step natives node "$KIT/cli/check-natives.mjs" "$RES"
else skip natives "run animkit/setup.sh (native references)"; fi
if [ -n "$LUA" ]; then step consistency node "$HERE/consistency.mjs"; else skip consistency "lua 5.4 missing"; fi

# 2. Lua logic with mocks.
if [ -n "$LUA" ]; then
  step server_logic "$LUA" "$HERE/lua/test_server.lua" "$RES"
  step client_logic "$LUA" "$HERE/lua/test_client.lua" "$RES"
else
  skip server_logic "lua 5.4 missing"; skip client_logic "lua 5.4 missing"
fi

# 3. Converter (animkit): documents -> .ycd -> read-back -> world pose, error cases, job flow.
if [ $QUICK -eq 0 ] && [ $YCD -eq 1 ]; then
  step converter node "$KIT/tests/converter.test.mjs"
  step watch_flow node "$HERE/watch_flow.mjs"
else
  step converter node "$KIT/tests/converter.test.mjs" --no-ycd
  skip watch_flow "--quick or ycdtool not built"
fi

# 4. Browser: NUI at 4 resolutions + click path + exported document builds; contact sheets.
if [ $QUICK -eq 0 ]; then
  step nui node "$HERE/nui.mjs"
  step contact_sheets node "$RES/tools/contact-sheets.mjs"
else
  skip nui "--quick"; skip contact_sheets "--quick"
fi

summary "jj_animstudio automatic checks"
exit $FAILED
