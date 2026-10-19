# Architecture — FiveM reference map and Jays Project V0.1

## 1. FiveM (observed reference architecture)

Source: `citizenfx/fivem@580b25c8`. Each box cites the evidence ledger.

```
                     ┌──────────────────────────── Windows client process (GTA5.exe image) ─────────────────────────────┐
FiveM.exe launcher ──┤ CoreRT.dll component loader (F-004, F-005)                                                       │
 wWinMain → RealMain │   ├─ gta-core-five / rage-*-five ── hooks into the game executable loaded via ExecutableLoader  │
 (Main.cpp:1125)     │   ├─ net (NetLibrary): HTTP initConnect → ENet session, CS_* state machine (F-006, F-007, F-009)  │
                     │   ├─ citizen-resources-* : manifest DSL, dependency loader, file download (F-011–F-013)        │
                     │   ├─ citizen-scripting-lua (+v8/mono): per-resource runtimes, scheduler.lua (F-014–F-016)      │
                     │   ├─ rage-scripting-five: native invocation into GTA V's script engine (F-024)                 │
                     │   ├─ nui-core (CEF), voip-mumble, gta-streaming-five, … (F-026)                                │
                     │   └─ legitimacy.dll (prebuilt, Steam/Discord auth — no source) (F-025)                          │
                     └─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                 │ HTTP POST /client initConnect (+cfxTicket2 unless sv_lan) (F-007, F-008)
                                 │ UDP OOB getinfo (F-020) · HTTP /info.json /players.json /dynamic.json (F-021)
                                 │ ENet: msgNetEvent / msgServerEvent / state sync / clone packets (F-009)
                     ┌───────────▼──────────── FXServer (Windows/Linux) ───────────────────────────────────────────────┐
                     │ citizen-server-impl: ClientRegistry, InitConnectMethod, GameServer (ENet), HTTP handlers        │
                     │ citizen-server-state-fivesv: OneSync entity state                                              │
                     │ citizen-scripting-*: same resource runtime as the client, server side (F-013)                 │
                     └─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Subsystem inventory (requested areas 1–15)

| # | Area | FiveM location | Public source? | Evidence |
|---|---|---|---|---|
| 1 | Client bootstrap | `code/client/launcher`, `code/client/citicore` | yes | F-004, F-005 |
| 2 | GTA V integration | `gta-core-five`, `gta-game-five`, `rage-*-five`, `CitizenGame.cpp` | yes, but it operates on the proprietary game binary | F-004, F-024 |
| 3 | Multiplayer networking | `net`, `net-base`, `net-packet`, `citizen-server-net` | yes (ENet vendored) | F-006, F-009 |
| 4 | Connections / handshake | `NetLibrary.cpp`, `InitConnectMethod.cpp` | yes; ticket issuance is a Cfx.re service | F-007, F-008 |
| 5 | Player / entity sync | `gta-net-five`, `citizen-server-state-fivesv` | yes (not analysed in V0.1) | — |
| 6 | Resource loading | `citizen-resources-core`, `citizen-resources-client` | yes | F-011–F-013, F-017 |
| 7 | Lua execution | `citizen-scripting-lua`, `data/shared/citizen/scripting/lua` | yes (Lua fork as submodule) | F-003, F-014–F-016 |
| 8 | Native invocation | `rage-scripting-five`, `scripting-gta`, `ext/native-decls` | invocation code yes; the natives are game code | F-024 |
| 9 | Client/server events | `scheduler.lua`, `NetEventPacketHandler.h`, `ServerEventPacketHandler.cpp` | yes | F-014, F-018 |
| 10 | NUI | `nui-core`, `nui-resources` (CEF) | yes (CEF binary dependency) | F-026 |
| 11 | Asset streaming | `gta-streaming-five`, `citizen-server-impl/ResourceStreamComponent.cpp` | yes (not analysed) | — |
| 12 | Resource caching | `citizen-resources-client`, `ResourceFilesComponent.cpp` | yes (not analysed) | — |
| 13 | Server runtime | `citizen-server-*` | yes | F-019–F-021 |
| 14 | Client updates | `code/client/launcher/Updater.cpp`, `Installer.cpp` | yes (not analysed) | — |
| 15 | Error handling / crash reporting | `MiniDump.cpp`, `Minidump.Symbolication.cpp`, `GlobalError` calls | yes (skimmed) | F-006 |

**Unavailable or proprietary:** `legitimacy` (binary only, F-025), the Cfx.re ticket and
keymaster services (F-008), GTA V itself (F-024), and FXServer runtime artifacts in this
environment (F-027).

## 2. Jays Project V0.1 (implemented)

```
┌──────────────── Jays Project launcher (Electron, sandboxed renderer) ────────────────┐
│ Play · Local server · Logs · Settings · About      launcher/src/{main,processes,...}  │
│ spawns + supervises processes, parses JSON log lines, persists settings & reports   │
└───────────────┬───────────────────────────────────────────────┬─────────────────────┘
                │ stdin commands / stdout JSON logs               │ stdin console / stdout JSON logs
┌───────────────▼─────────── jays-client (headless) ─┐   ┌─────────▼──────────── jays-server ───────────────────────┐
│ GameClient state machine (client/src/client.cpp)  │   │ GameServer (server/src/server.cpp)                      │
│ probe: UDP getinfo + HTTP info JSON (probe.cpp)    │   │  TCP :30120 ─┬─ "JAYSNP01" → JNP/1 sessions             │
│ ResourceManager(Side::Client) ◄── files from server│   │              └─ "GET "     → /info.json /players.json   │
└───────────────┬────────────────────────────────────┘   │  UDP :30120 ── getinfo responder (FXServer format)       │
                │  JNP/1 over TCP (docs/PROTOCOL.md)     │  ResourceManager(Side::Server) ◄── server.cfg / disk     │
                └───────────────────────────────────────►│  deferrals, kicks, rate limit, timeouts, console        │
                                                         └──────────────────────────────────────────────────────────┘
Shared libraries
  jays_shared  shared/        logging (text/JSON), server.cfg parser, sockets (Winsock/POSIX), JNP framing, console input
  jays_compat  compatibility/ manifest DSL, globbing, ResourceManager, ScriptRuntime (1 Lua 5.4 state per resource),
                              bootstrap.lua (scheduler/events/exports/commands), msgpack + function refs, json
  jays_lua     third_party/lua  Lua 5.4.7 compiled as C++ (errors unwind C++ frames)
```

### Key design decisions

| Decision | Rationale | Evidence |
|---|---|---|
| Clean-room reimplementation; no FiveM code | License (Rockstar CPLA + LGPL parts) | F-001 |
| One Lua state per resource; msgpack copies across resources | Same isolation model as FiveM; prevents shared mutable state | F-014, F-016 |
| Function references as msgpack ext + refcounting | Needed for callbacks (`deferrals`, export callbacks) | F-016, F-019 |
| Fresh Lua thread per entry, anchored on the running thread | Safe re-entrancy (A→B→A export chains) without touching suspended stacks | design (see LUA_RUNTIME.md) |
| Script time budget via count hook | A runaway script must not freeze a server tick | Jays addition |
| TCP + own framing (JNP/1) instead of ENet | Prototype simplicity, deterministic tests; UDP is a later milestone | F-009 |
| Protocol sniffing on one TCP port | One configurable port like FXServer (HTTP + game) | F-021 |
| FXServer-format discovery (getinfo/info.json) | Lets existing tooling read Jays servers; probe can read FXServers | F-020, F-021 |
| Headless client | Joining GTA V needs game integration that is out of scope and legally constrained | F-004, F-024 |
| Electron launcher | Native-looking Windows UI with a testable, maintainable stack; heavy logic stays in C++ binaries | — |

## 3. Comparison and disposition

| Subsystem | FiveM | Jays V0.1 | Disposition |
|---|---|---|---|
| Launcher | Win32 bootstrap that loads the game into its own process | Electron UI supervising separate processes | **Independently reimplemented** (different role: it does not load a game) |
| Component system | DLL components + CoreRT | static libraries | **Replaced** with simpler modular boundaries |
| Manifest / resources | `citizen-resources-*` | `compatibility/manifest.cpp`, `resource_manager.cpp` | **Independently reimplemented**, behaviour-compatible subset |
| Lua runtime | Lua 5.4 fork + `scheduler.lua` | stock Lua 5.4.7 + original `bootstrap.lua` | **Compatibility adapter** (FiveM API names over Jays core) |
| JS / C# runtimes | V8, Node, Mono | — | **Deferred** |
| Transport | ENet (UDP) | TCP JNP/1 | **Replaced** (prototype); UDP planned |
| Handshake / auth | HTTP initConnect + Cfx.re ticket | JNP Hello/Welcome, no auth | **Independently reimplemented**; auth design deferred; Cfx.re tickets **never** emulated |
| Discovery | getinfo, info.json | same formats | **Exposed as compatible external interface** |
| Entity / player sync (OneSync) | `citizen-server-state-fivesv` | none | **Deferred** (needs a game client) |
| Natives | GTA V script engine | runtime/server natives only | **Retained only as documented external interface**; game natives unsupported |
| NUI | CEF | none | **Deferred** |
| Streaming / caching | `gta-streaming-five`, file DB | in-memory script transfer | **Deferred** |
| Updates | in-launcher updater | none | **Deferred** |
| Crash reporting | minidumps + symbolication | structured logs, JSON error reports | **Replaced** with a simpler mechanism |
| legitimacy / auth DLL | closed binary | — | **Not touched** (F-025) |

## 4. Minimum viable path that was executed

1. Clean-room Lua resource runtime, verified by unit tests (Level 2).
2. Independent server and headless client with resource download, events and commands, verified by e2e tests (Level 3).
3. Launcher that drives both, verified by a Playwright e2e test (Level 1, integrated with Level 3).
4. Windows builds via MinGW, verified under Wine (F-031, F-032).

Level 4 (FXServer interop) is blocked here (F-027). Level 5 (joining a GTA V session) needs a
game client, which V0.1 does not have (F-004, F-024).
