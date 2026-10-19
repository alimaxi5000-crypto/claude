# Development status — Jays Project V0.1 Alpha

_Last updated: 2026-10-19_

## Highest level achieved: **Level 3**

| Level | Definition | Status | Evidence |
|---|---|---|---|
| 1 | Custom launcher runs | ✅ achieved | Launcher Playwright e2e test passes (Linux Electron). Windows package built, main process started under Wine (UI not observed). |
| 2 | Lua compatibility runtime executes test resources | ✅ achieved | 29 unit tests; demo resources `jays-basic`, `jays-chat`; client local-resource mode |
| 3 | Independent client connects to independent server | ✅ achieved | 8 integration tests with real processes (Linux native **and** Windows binaries under Wine) |
| 4 | Authorized FXServer interoperability | ❌ not demonstrated | FXServer unavailable in this environment (F-027). The discovery probe is ready but untested against FXServer. |
| 5 | Joins a GTA V session with its own client | ❌ not attempted | No game integration exists (F-004, F-024). |

A socket connection between `jays-client` and `jays-server` is **not** a GTA V session. The V0.1
client never starts GTA V.

## Milestones

| Milestone | Status | Notes |
|---|---|---|
| A — Launcher | ✅ | Connect screen, live state, server query, console, local server control, logs (filter/export), settings (validated, persisted), versions, error banner and JSON reports |
| B — Lua runtime | ✅ | manifest DSL, globbing, dependencies, per-resource Lua 5.4 states, scheduler, events, exports, function refs, commands, json, sandbox, time budget |
| C — Multiplayer prototype | ✅ | JNP/1 over TCP, handshake, deferrals, resource download, events both ways, ping, timeouts, kicks, rate limit, FXServer-format discovery |
| D — Integration | ✅ | Launcher → local server → client → Lua resources → logs, verified end to end |

## Test inventory (all passing at the last run)

| Suite | Command | Result |
|---|---|---|
| Unit (C++) | `./build/bin/jays-unit-tests` | 29 passed, 190 checks |
| Integration (Python, real processes) | `python3 tests/integration/test_e2e.py --bin-dir build/bin --project-dir .` | 8 passed (5 repeated runs, no flakes) |
| Launcher e2e (Playwright + Electron) | `cd launcher && xvfb-run -a npm test` | 1 passed (covers 20+ UI behaviours) |
| Windows unit (Wine) | `wine64 build-win/bin/jays-unit-tests.exe` | 29 passed |
| Windows integration (Wine) | `tools/test-all.sh --wine` | 8 passed |
| CTest | `cd build && ctest` | 2/2 (unit + integration) |

Covered by tests: manifest parsing, resource start/stop and dependencies, Lua execution,
event registration and net gating, client/server messaging, connection failures (refused,
invalid address, rejected, full, kicked, protocol violations) and configuration loading (valid,
`exec`, missing file, port in use).

## Analysis performed

- Source-level analysis of the FiveM client launcher, networking, resources, Lua scheduler and server connection handling: 30 ledger entries.
- REA: installed and connected. Used for artifact inventory of `legitimacy.dll` (identification only) and Jays' own PE builds. Deep providers unavailable (F-028).
- No dynamic capture of FiveM, because no FiveM or FXServer binaries were available.
