# Jays Project — V0.1 Alpha

An independent, experimental multiplayer platform prototype that runs **FiveM-style Lua
resources** (`fxmanifest.lua`, events, exports, commands, threads) on its own server, its own
headless client and its own Windows launcher.

> **What V0.1 is not:** it is not a GTA V client. It does not start, modify or connect to
> GTA V, and it cannot join FiveM servers. The highest level reached is **Level 3**: an
> independent client connects to an independent server and both run Lua resources. See
> [docs/DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md).

Jays Project is a clean-room implementation. The FiveM repository (`citizenfx/fivem@580b25c8`)
was studied as a behavioural reference only, and none of its code is included. See
[research/EVIDENCE_LEDGER.md](research/EVIDENCE_LEDGER.md), entry F-001.

## What works

| Component | Status |
|---|---|
| `launcher/`: Jays Project launcher (Electron, dark UI) | Connect screen with live state machine, server query, client console, local server control, filterable logs with export, settings, versions, error reports |
| `jays-server` | JNP/1 sessions on TCP, FXServer-format `getinfo` and `/info.json` discovery, `server.cfg` subset, `playerConnecting` deferrals, kicks, console |
| `jays-client` | Headless client: connects, downloads and runs client resources, console commands, `--probe`, `--local-resources` |
| Lua runtime | Lua 5.4.7, one state per resource; `CreateThread`/`Wait`/`SetTimeout`, `AddEventHandler`/`RegisterNetEvent`/`TriggerEvent`/`TriggerServerEvent`/`TriggerClientEvent`, `exports`, `RegisterCommand`, `json`, resource and player natives |
| Tests | 29 C++ unit tests · 8 multi-process integration tests · launcher Playwright e2e · same suites on Windows binaries under Wine |

Details: [research/COMPATIBILITY_MATRIX.md](research/COMPATIBILITY_MATRIX.md) ·
[docs/KNOWN_LIMITATIONS.md](docs/KNOWN_LIMITATIONS.md).

## Build

Requirements: CMake 3.20+, a C++20 compiler (GCC 11+, Clang 14+ or MSVC 2022), Python 3.8+
(tests), Node.js 20+ (launcher).

**Linux / macOS**

```bash
tools/build.sh             # Release build into build/, plus launcher npm install
tools/build.sh --windows   # also cross-compiles Windows x64 .exe files into build-win/ (MinGW-w64)
```

**Windows** (written for Visual Studio 2022, not yet executed on Windows; see L-04)

```powershell
powershell -ExecutionPolicy Bypass -File tools\build.ps1
```

**Windows launcher package** (portable `.exe`, bundles `build-win/bin` and the demo server data)

```bash
tools/build.sh --windows && cd launcher && npm run dist:win   # → launcher/out/Jays Project 0.1.0-alpha.exe
```

## Run

**Launcher (recommended)**

```bash
cd launcher && npm start
```

1. **Local server** → *Start server* (runs `jays-server` with `server/data/server.cfg` on 127.0.0.1).
2. *Use as connect address* → **Play** → enter a name → *Connect*.
3. Watch the state go connecting → handshaking → downloading → loading → active.
4. In *Client console* try `ping`, `say hello`, `threads 3`.
5. **Logs** shows everything; *Export…* writes a log file. Errors offer *Save error report*.

**Terminal only**

```bash
./build/bin/jays-server --config server/data/server.cfg                 # console: help, status, players, say, quit
./build/bin/jays-client --connect 127.0.0.1:30120 --name Alice          # then type: say hi
./build/bin/jays-client --probe 127.0.0.1:30120                         # FXServer-style info query
./build/bin/jays-client --local-resources tests/data/local-resources    # run client resources without a server
tools/run-demo.sh                                                       # scripted two-client demo
```

Client exit codes: `0` ok, `2` usage, `3` connect failed, `4` rejected, `5` disconnected, `6` protocol error.

## Test

```bash
tools/test-all.sh          # unit + integration + launcher e2e (uses xvfb-run when no display)
tools/test-all.sh --wine   # also runs the Windows binaries under Wine
```

## Write a resource

```
server/data/resources/[local]/hello/
├── fxmanifest.lua   fx_version 'cerulean'  game 'gta5'  server_script 'server.lua'  client_script 'client.lua'
├── server.lua       RegisterNetEvent('hello:ping', function() TriggerClientEvent('hello:pong', source) end)
└── client.lua       RegisterCommand('hello', function() TriggerServerEvent('hello:ping') end)
                     RegisterNetEvent('hello:pong', function() print('pong!') end)
```

Add `ensure hello` to `server.cfg`.

## Repository layout

```
JaysProject/
├── launcher/        Electron launcher (src/main.js, src/renderer/*, tests/)
├── client/          jays-client (headless client, probe)
├── server/          jays-server, server/data/ (server.cfg + demo resources)
├── compatibility/   manifest parser, resource manager, Lua runtime, bootstrap.lua, msgpack/json
├── shared/          logging, config, sockets, JNP protocol
├── third_party/lua  Lua 5.4.7 (MIT)
├── tests/           unit/ (C++), integration/ (Python), bench/, data/
├── tools/           build/test/demo scripts, CMake toolchain for MinGW
├── research/        ARCHITECTURE, EVIDENCE_LEDGER, COMPATIBILITY_MATRIX, analyses, evidence/
└── docs/            PROTOCOL, DEVELOPMENT_STATUS, KNOWN_LIMITATIONS, NEXT_STEPS
```

## Legal

Local, experimental prototype. No FiveM source code, Rockstar assets or game files are
included. FiveM authentication (Cfx.re tickets) is neither emulated nor bypassed. Distribution
rights have not been assessed. Lua is © Lua.org (MIT, `third_party/lua/LICENSE`).
