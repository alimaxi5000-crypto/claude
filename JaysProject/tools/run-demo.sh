#!/usr/bin/env bash
# Terminal-only demo: starts a local server, joins two clients that chat, then shuts down.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-30120}"

./build/bin/jays-server --config server/data/server.cfg --endpoint "127.0.0.1:$PORT" --no-console &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
sleep 1

./build/bin/jays-client --connect "127.0.0.1:$PORT" --name Bob --no-console --quit-after 3000 &
BOB=$!
sleep 0.5
./build/bin/jays-client --connect "127.0.0.1:$PORT" --name Alice --no-console \
  --exec "say hi Bob" --exec ping --exec "threads 2" --quit-after 1000
wait $BOB
./build/bin/jays-client --probe "127.0.0.1:$PORT"
