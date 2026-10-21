#!/usr/bin/env bash
# Starts the jj_animstudio converter (animkit watch) and restarts it if it stops.
# Paths come from animkit.config.json next to this file (see README) or from the arguments:
#   ./start-watch.sh --studio /srv/fx/resources/[jj]/jj_animstudio --stream /srv/fx/resources/[jj]/jj_animstudio_stream
cd "$(dirname "$0")"
trap 'exit 0' INT TERM
while true; do
  node cli/animkit.mjs watch "$@"
  echo "animkit watch stopped (exit $?). Restart in 5 seconds (Ctrl+C to stop)."
  sleep 5
done
