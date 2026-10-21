# Shared helpers for the test runners (sourced by animkit/tests/all.sh, jj_zombie_dev/tests/all.sh,
# jj_animstudio/tests/all.sh). Needs bash; works on Linux and Git Bash on Windows.
#   LUA / LUAC   Lua 5.4 interpreter / compiler (lua5.4, lua54, or lua if it reports 5.4)
#   step NAME CMD...   run, log to $LOG/NAME.log, record OK/FAIL with duration
#   skip NAME WHY      record SKIP (never counted as OK)
#   nativepath P       path usable by node/import() (C:/... on Windows)

find_lua() {
  local c
  for c in lua5.4 lua54 lua; do
    if command -v "$c" >/dev/null 2>&1 && "$c" -v 2>&1 | grep -q 'Lua 5\.4'; then command -v "$c"; return 0; fi
  done
  return 1
}
find_luac() {
  local c
  for c in luac5.4 luac54 luac; do
    if command -v "$c" >/dev/null 2>&1 && "$c" -v 2>&1 | grep -q 'Lua 5\.4'; then command -v "$c"; return 0; fi
  done
  return 1
}
LUA="${LUA:-$(find_lua || true)}"
LUAC="${LUAC:-$(find_luac || true)}"
export JJ_LUA="$LUA"

nativepath() { if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else echo "$1"; fi; }

declare -a SUMMARY
FAILED=0
now_ms() { local n; n=$(date +%s%N 2>/dev/null); if [ ${#n} -gt 12 ]; then echo $((n / 1000000)); else echo $(($(date +%s) * 1000)); fi; }
step() { # name, command...
  local name="$1"; shift
  local t0; t0=$(now_ms)
  if "$@" > "$LOG/$name.log" 2>&1; then
    local dt=$(( $(now_ms) - t0 ))
    SUMMARY+=("OK    $name ($((dt / 1000)).$(( (dt % 1000) / 100 )) s)  $(tail -n 1 "$LOG/$name.log" | tr -d '\r')")
  else
    SUMMARY+=("FAIL  $name  -> $LOG/$name.log")
    FAILED=1
    tail -n 25 "$LOG/$name.log" | sed "s/^/  [$name] /"
  fi
}
skip() { SUMMARY+=("SKIP  $1  ($2)"); }
summary() { # title
  echo
  echo "== $1 =="
  for l in "${SUMMARY[@]}"; do echo "$l"; done
  [ $FAILED -eq 0 ] && echo "ALL PASSED" || echo "FAILURES (see above)"
}
# Lua syntax of every *.lua below a directory (CfxLua backtick hashes replaced for plain luac).
lua_syntax_dir() { # dir
  local dir="$1" n=0 tmp="$LOG/_syntax.lua"
  while IFS= read -r f; do
    sed 's/`[^`]*`/0/g' "$f" > "$tmp"
    "$LUAC" -p "$tmp" 2>&1 | sed "s|$tmp|${f#$dir/}|" | grep . && return 1
    n=$((n + 1))
  done < <(find "$dir" -name '*.lua' -not -path '*/node_modules/*')
  echo "Lua syntax OK ($n files)"
}
