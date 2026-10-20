#!/usr/bin/env bash
# All automatic checks for animkit (converter core + CLI). Run from anywhere:
#   bash animkit/tests/all.sh [--quick]     (--quick: no .ycd conversion)
# Exit code 0 only if every executed step passed. Skipped steps are listed as SKIP, never as OK.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT="$(cd "$HERE/.." && pwd)"
QUICK=0
[ "${1:-}" = "--quick" ] && QUICK=1
LOG="$KIT/build/tests"
mkdir -p "$LOG"
source "$HERE/lib.sh"

js_syntax() {
  local n=0
  while IFS= read -r f; do node --check "$f" || return 1; n=$((n + 1)); done < <(find "$KIT/core" "$KIT/cli" "$KIT/tests" "$KIT/examples" -name '*.mjs' -not -path '*/node_modules/*')
  echo "JS syntax OK ($n files)"
}
step js_syntax js_syntax
step schema_json node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')); console.log('schema JSON OK')" "$(nativepath "$KIT/core/schema/jj-anim-1.schema.json")"
# Committed example documents must match their generator (fails when someone edits one by hand).
examples_fresh() {
  ( cd "$KIT" && node examples/make-examples.mjs >/dev/null ) || return 1
  if command -v git >/dev/null && git -C "$KIT" rev-parse >/dev/null 2>&1 && git -C "$KIT" ls-files --error-unmatch examples/walk_cycle.anim.json >/dev/null 2>&1; then
    git -C "$KIT" diff --quiet -- examples || { echo 'examples/*.anim.json differ from make-examples.mjs'; git -C "$KIT" diff --stat -- examples; return 1; }
  fi
  echo 'examples up to date'
}
step examples_fresh examples_fresh
if [ $QUICK -eq 0 ] && [ -f "$KIT/converter/ycdtool/out/ycdtool.dll" ] && command -v dotnet >/dev/null; then
  step converter node "$KIT/tests/converter.test.mjs"
else
  step converter node "$KIT/tests/converter.test.mjs" --no-ycd
  [ $QUICK -eq 1 ] || skip ycd_conversion "ycdtool not built (animkit/setup.sh)"
fi
step cli_help node "$KIT/cli/animkit.mjs" help
for f in "$KIT"/examples/*.anim.json; do
  n=$(basename "$f" .anim.json)
  step "build_$n" node "$KIT/cli/animkit.mjs" build "$f" --out "$LOG/build_$n" $([ $QUICK -eq 1 ] && echo --no-ycd)
done
[ $QUICK -eq 0 ] && [ -d "$LOG/build_single_wave" ] && step check_ycd node "$KIT/cli/animkit.mjs" check-ycd "$LOG/build_single_wave" "$LOG/build_pair_shoulder" "$LOG/build_walk_cycle" "$LOG/build_fingers_demo"
summary "animkit automatic checks"
exit $FAILED
