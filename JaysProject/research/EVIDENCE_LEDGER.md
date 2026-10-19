# Evidence Ledger — Jays Project V0.1

Every architectural decision in Jays Project should trace back to an entry here.

**Reference snapshot:** `https://github.com/citizenfx/fivem`, branch `master`, commit
`580b25c85d0784992c43313a9136b8d5b6839b0a` (2026-10-19T16:13:05+02:00), shallow clone
(depth 1) kept outside this repository at `/home/user/ref/fivem`. Paths below are relative to
that checkout. Line numbers refer to that exact commit.

**Status vocabulary**

| Field | Values |
|---|---|
| Kind | `source` (read in code) · `observed` (seen at runtime in this environment) · `measured` · `inference` |
| Confidence | high · medium · low |
| Verification | `verified` (re-checked against code or execution) · `partially verified` · `unverified` |

No FiveM code was copied into Jays Project. Each finding records **behaviour**. Jays Project's
implementation of that behaviour was written independently (clean room).

IDs F-010 (connection retries) and F-022 (packet names) were merged into F-006 and F-009. The
gaps in the numbering are intentional, so references elsewhere stay valid.

---

## Legal and repository

### F-001 — Dual licensing of the FiveM repository
- **Subsystem:** legal
- **Kind / confidence / status:** source / high / verified
- **Observation:** The repository is © Take-Two Interactive and is governed by the Rockstar Games Creator Platform License Agreement. Only listed paths (`code/client/shared`, `citicore`, `launcher`, `common`, `code/tools`, `code/components/citizen-*`, `font-renderer`, `vfs-core`, `code/vendor/*.lua`) are additionally licensed LGPL-2.0.
- **Reference:** `LICENSE` lines 1–31.
- **Inference:** Copying non-LGPL code into an independent product requires rights we do not have. Even the LGPL parts would impose LGPL obligations.
- **Decision:** Treat FiveM as a reference only. Jays Project is a clean-room implementation and contains no FiveM code.
- **Limitations:** This is not legal advice. The platform terms at fivem.net/terms were not reviewed (network access was not attempted).

### F-002 — Repository shape
- **Subsystem:** build
- **Kind / confidence / status:** source / high / verified
- **Observation:** 13,552 files, 117 component directories under `code/components`, and 151 git submodules (revisions recorded in `research/source-analysis/fivem-submodules.txt`). The build uses premake (`code/premake5.lua`) with `--game=five|rdr3|ny|server|launcher` (`premake5.lua:257–275`, `tools/fxd/gen.ps1:35`). CI scripts: `code/tools/ci/build_client.ps1` (Windows client) and `build_server_docker_alpine.sh` (Linux server).
- **Inference:** The client build targets Windows and Visual Studio. A full build needs all 151 submodules plus Windows tooling.
- **Limitations:** Submodules were not cloned and no FiveM build was attempted (it is out of scope and needs a Windows/VS host).

### F-003 — Lua runtime is a FiveM fork of Lua 5.4
- **Subsystem:** lua-runtime
- **Kind / confidence / status:** source / high / verified
- **Observation:** The submodule `vendor/lua` points to `https://github.com/citizenfx/lua.git`, branch `luaglm-548`, revision `4b086dc0…`. `code/components/citizen-scripting-lua/component.lua` carries "lua54" definitions. `scheduler.lua` uses Lua 5.4 features (`<close>`).
- **Inference:** FiveM resources target Lua 5.4 semantics plus GLM vector extensions ("luaglm").
- **Decision:** Jays uses stock Lua 5.4.7 (MIT, `third_party/lua`). Vector types (`vector3`, …) are **not** provided (see COMPATIBILITY_MATRIX).

## Client lifecycle

### F-004 — Launcher entry and game process model
- **Subsystem:** launcher / bootstrap
- **Kind / confidence / status:** source / high / verified
- **Observation:** `code/client/launcher/Main.cpp:1125` `wWinMain` → `RealMain` (`:130`). The game executable path is resolved (`GTA5.exe`, `:787–809`), then `CoreRT.dll` is loaded (`:992`, `:1023`, `:1052`, `:1073`), then `CitizenGame::Launch(gameExecutable)` runs (`:1045`, `:1068`). `CitizenGame.cpp:475–578` uses an `ExecutableLoader` to load the game executable into the launcher's own module space (`LoadIntoModule`).
- **Inference:** The FiveM "client" is the game process itself, modified in-process by CitizenFX components. A launcher alone does not make a multiplayer client, so a GTA V-capable client must integrate with the game binary.
- **Decision:** The V0.1 launcher is described as a launcher. The V0.1 client is a **headless** client and does not claim GTA V integration.

### F-005 — Component architecture
- **Subsystem:** architecture
- **Kind / confidence / status:** source / medium / partially verified
- **Observation:** CoreRT (`code/client/citicore`, `ComponentLoader*.cpp`) loads components described by `component.json` dependency manifests (example: `code/components/legitimacy/component.json`). Game-specific components carry suffixes `-five`, `-rdr3`, `-ny`.
- **Decision:** Jays uses static libraries with explicit boundaries (`jays_shared`, `jays_compat`) instead of a dynamic component loader. That is simpler at this size.
- **Limitations:** The component loader internals were only skimmed.

### F-006 — Client connection state machine
- **Subsystem:** networking
- **Kind / confidence / status:** source / high / verified
- **Observation:** `code/components/net/include/NetLibrary.h:108–119` defines `CS_IDLE, CS_INITING, CS_INITRECEIVED, CS_DOWNLOADING, CS_DOWNLOADCOMPLETE, CS_FETCHING, CS_CONNECTING, CS_CONNECTED, CS_ACTIVE`. `NetLibrary.cpp:602–690` drives the transitions. FETCHING sends OOB `getinfo` every 5 s and gives up after more than 3 attempts. CONNECTING retries `SendConnect` every 5 s, also giving up after more than 3 attempts. ACTIVE checks timeouts.
- **Decision:** Jays mirrors the *shape* (connecting → handshaking → downloading → loading → active → disconnected) with its own transport and timeouts.

### F-007 — `initConnect` HTTP handshake
- **Subsystem:** networking
- **Kind / confidence / status:** source / high / verified
- **Observation:** The client POSTs to the server's `/client` endpoint with `method=initConnect`, `protocol=12` (`NETWORK_PROTOCOL`, `NetLibrary.h:39`), `gameBuild`, `gameName` (`gta5`), `guid` and a name (`NetLibrary.cpp:928–960`). Later requests are `getEndpoints` (`:1599`) and `submitCard` (`:1652`).
- **Limitations:** Response fields were only partly read (`protocol` at `:1321`).

### F-008 — Server-side ticket authentication
- **Subsystem:** authentication
- **Kind / confidence / status:** source / high / verified
- **Observation:** `citizen-server-impl/src/InitConnectMethod.cpp:639–645` rejects connections without `cfxTicket2` ("No authentication ticket was specified.") **unless** the server convar `sv_lan` is true (`:401`). Tickets are RSA-verified against a public key fetched from the Cfx.re backend (`:119`, `:214–290`).
- **Inference:** A third-party client cannot obtain valid tickets without the Cfx.re platform. Only an owner-configured `sv_lan` server skips the check.
- **Decision:** Jays does not implement, forge or bypass tickets. Interop experiments are limited to owner-controlled servers with documented settings.

### F-009 — Game transport is ENet
- **Subsystem:** networking
- **Kind / confidence / status:** source / high / verified
- **Observation:** The client creates an ENet host and sends reliable packets (`net/src/NetLibraryImplV2.cpp:86–123`). The server uses ENet (`citizen-server-impl/src/GameServerNet.ENet.cpp`, peer throttling `:163`, events `:246–259`). Packets are typed by `HashRageString` names, e.g. `msgNetEvent` and `msgServerEvent` (`net-packet/include/NetEvent.h:37,75`).
- **Decision:** Jays V0.1 uses TCP with its own framing (JNP/1, `docs/PROTOCOL.md`). That is simpler and deterministic for a prototype. A UDP/reliability layer is a next step.

## Resources and Lua

### F-011 — Manifest DSL semantics
- **Subsystem:** resources
- **Kind / confidence / status:** source / high / verified
- **Observation:** `data/shared/citizen/scripting/resource_init.lua:1–41`: while the manifest runs, `_G` has an `__index` that turns any unknown global into a directive. For a table argument, a single trailing `s` is removed from the key and one entry is added per element. The directive returns a function so the legacy `key 'v' { extra }` syntax parses. `LuaMetaDataLoader.cpp:231` tries `fxmanifest.lua`, then `__resource.lua`, and marks `is_cfxv2` for the former (`:268`).
- **Implementation:** `compatibility/src/manifest.cpp` (independent). Tests: `manifest_parses_directives`, `manifest_load_prefers_fxmanifest`.

### F-012 — `dependencies` becomes `dependencie`
- **Subsystem:** resources
- **Kind / confidence / status:** source / high / verified
- **Observation:** Because of F-011, `dependencies { ... }` is stored under `dependencie`. FiveM reads both `dependency` and `dependencie` (`citizen-resources-core/src/ResourceDependencyLoader.cpp:88`).
- **Implementation:** `ManifestDependencies()` reads both keys. Tested.

### F-013 — Script load order
- **Subsystem:** resources
- **Kind / confidence / status:** source / high / verified
- **Observation:** `citizen-scripting-core/src/ResourceScriptingComponent.cpp:92–99` collects `shared_script` first, then `server_script` (FXServer) or `client_script` (client), all via `GlobEntriesVector` (glob expansion).
- **Implementation:** `Resource::ScriptsFor()`. Test: `runtime_shared_scripts_load_first`.

### F-014 — Event dispatch semantics
- **Subsystem:** lua-runtime
- **Kind / confidence / status:** source / high / verified
- **Observation:** `data/shared/citizen/scripting/lua/scheduler.lua:124–180`. Each resource keeps its own handler table. Payloads are msgpack. An event whose source starts with `net` is dropped with a trace unless the handler entry is `safeForNet`. `source` becomes the number after `net:` / `internal-net:` (server), and otherwise the raw source string. Each handler runs through `Citizen.CreateThreadNow`, so handlers may `Wait`.
- **Implementation:** `compatibility/lua/bootstrap.lua` `__jays_dispatch`. Tests: `runtime_net_events_require_registration`, `runtime_event_handlers_can_wait`.
- **Limitations:** As in FiveM, `source` is a global that is only valid until the handler's first `Wait`.

### F-015 — Event API surface
- **Subsystem:** lua-runtime
- **Kind / confidence / status:** source / high / verified
- **Observation:** `AddEventHandler` returns `{ key, name }` (`scheduler.lua:255–276`). `RemoveEventHandler` validates it (`:279–289`). `RegisterNetEvent(name, cb?)` sets `safeForNet` and optionally adds a handler (`:292–307`). `TriggerEvent` packs its arguments with msgpack (`:310–316`). The server aliases `RegisterServerEvent` and defines `TriggerClientEvent` (`:318–331`).

### F-016 — Exports
- **Subsystem:** lua-runtime
- **Kind / confidence / status:** source / high / verified
- **Observation:** `scheduler.lua:627–735`. Exports are implemented over events named `__cfx_export_<res>_<name>`. Calling `exports(name, fn)` registers one. Manifest `export` (client) and `server_export` (server) entries expose globals of the same name. Calls use `exports.res:fn(...)`, and the generated function ignores its first parameter (`self`). Errors are wrapped as "An error occurred while calling export …". Assigning into `exports` raises.
- **Implementation:** Equivalent behaviour through a native export registry instead of events (`bootstrap.lua`, `ResourceManager::CallExport`). Test: `runtime_exports_and_callbacks`.
- **Limitations:** Jays exports cannot `Wait` (calls are synchronous across Lua states). FiveM's behaviour for yielding exports was not verified.

### F-017 — Resource lifecycle events
- **Subsystem:** resources
- **Kind / confidence / status:** source / high / verified
- **Observation:** `citizen-resources-core/src/ResourceEventComponent.cpp:54` (`onResourceStarting`, cancelable through the return value), `:90` (`onResourceStart`), `:129` (`onResourceStop`). The argument is the resource name.
- **Implementation:** The same events, plus `onServerResourceStart/Stop` and `onClientResourceStart/Stop`. Tests: `runtime_lifecycle_events_and_dependencies`, `runtime_cancel_event`.
- **Limitations:** The side-specific variants are mentioned in FiveM resources but were not located in source during this pass (unverified).

### F-018 — Net event source identifiers
- **Subsystem:** networking / lua-runtime
- **Kind / confidence / status:** source + inference / medium / partially verified
- **Observation:** The server tags client events `"net:" + netId` (`citizen-server-impl/src/packethandlers/ServerEventPacketHandler.cpp:66`). The client tags server events `"net:" + sourceNetId` (`citizen-legacy-net-resources/include/NetEventPacketHandler.h:18`).
- **Inference (low):** The value of `sourceNetId` for server-originated events was not traced. Jays uses `65535`.
- **Verification needed:** Capture against a real FXServer (blocked, see F-027).

### F-019 — Player connection events
- **Subsystem:** server
- **Kind / confidence / status:** source / high / verified
- **Observation:** `playerConnecting(name, setKickReason, deferrals)` is fired with source `internal-net:<id>` (`InitConnectMethod.cpp:1162`). `playerJoining(oldNetId)` follows (`ClientRegistry.cpp:205`), and `playerDropped(reason)` (`GameServer.cpp:1146`).
- **Implementation:** All three, with `deferrals.defer/update/done` and `setKickReason` passed as host function references. Integration tests `banned_player_is_rejected` and `two_clients_exchange_chat_and_events`.
- **Limitations:** `deferrals.presentCard` (adaptive cards) is not implemented. `handover` is accepted but only forwarded as an update.

### F-020 — Out-of-band `getinfo`
- **Subsystem:** networking / discovery
- **Kind / confidence / status:** source / high / verified
- **Observation:** UDP datagrams prefixed `\xFF\xFF\xFF\xFF` (`GameServerNet.ENet.cpp:512`). A request `getinfo <challenge>` gets the reply `infoResponse\n\sv_maxclients\…\clients\…\challenge\…\gamename\CitizenFX\protocol\4\hostname\…\gametype\…\mapname\…\iv\…`, rate limited per peer (`citizen-server-impl/include/outofbandhandlers/GetInfoOutOfBand.h:25–44`).
- **Implementation:** jays-server answers in the same layout but reports `gamename` = `JaysProject` honestly. `jays-client --probe` sends the request. Test: `probe_reports_fxserver_compatible_info`.
- **Limitations:** Interop with a real FXServer is **untested** (F-027).

### F-021 — HTTP info endpoints
- **Subsystem:** networking / discovery
- **Kind / confidence / status:** source / high / verified
- **Observation:** `citizen-server-impl/src/InfoHttpHandler.cpp`: `/info.json` (`:304`, fields `server, enhancedHostSupport, resources, vars, version, icon` at `:59–122`), `/dynamic.json` (`:345`, fields `hostname, gametype, mapname, clients, iv, sv_maxclients` at `:567–572`), `/players.json` (`:359`, entries `endpoint, id, identifiers, name, ping` at `:453–466`).
- **Implementation:** The same paths and field names, served on the same TCP port as JNP (protocol sniffing).

### F-023 — Commands
- **Subsystem:** lua-runtime
- **Kind / confidence / status:** source / medium / partially verified
- **Observation:** `RegisterCommand` maps to the `REGISTER_COMMAND` native (`citizen-scripting-core/src/ResourceScriptFunctions.cpp:122`).
- **Inference:** The handler signature is `(source, args, rawCommand)` and `restricted` is enforced through ACEs. This is widely documented but only the native registration was read.
- **Implementation:** The same signature. Restricted commands are console-only (source 0) because Jays V0.1 has no ACE system.

### F-024 — Client natives are game functions
- **Subsystem:** game integration
- **Kind / confidence / status:** source / high / verified
- **Observation:** `rage-scripting-five/include/scrEngine.h:189–198` `NativeInvoke` resolves handlers with `rage::scrEngine::GetNativeHandler(hash)`, which is GTA V's script engine.
- **Inference:** Several thousand client natives (`GetEntityCoords`, `CreateVehicle`, …) are implemented by the game itself. They cannot be reimplemented without the game.
- **Decision:** No GTA natives in V0.1. Only runtime and server natives Jays can implement honestly.

### F-025 — Closed-source authentication component
- **Subsystem:** authentication
- **Kind / confidence / status:** observed (binary metadata) / high / verified
- **Observation:** `code/components/legitimacy/` contains no source, only prebuilt `release/legitimacy.dll` (PE32+ x64, 12,275,712 bytes, sha256 `34a1b4c1…7635`) and `.lib`. Its exports include `cfx::legitimacy::AuthenticateDiscord`, `AuthenticateDiscourse`, `GetSteamAuthTicketWrapper` and `InitSteamSDKConnection`. REA `inspect-artifact` output is in `research/evidence/rea/fivem-legitimacy-dll.inspect-artifact.json`.
- **Decision:** **Deliberately not decompiled.** It implements platform authentication, and analysing it would approach authentication circumvention, which is out of bounds. It is recorded as an unavailable, proprietary component.

### F-026 — NUI is CEF based
- **Subsystem:** UI
- **Kind / confidence / status:** source / high / verified
- **Observation:** `code/components/nui-core/src/Cef*.cpp` (Chromium Embedded Framework integration).
- **Decision:** Not implemented in V0.1 (`ui_page` is parsed but ignored).

## Environment observations (this session)

### F-027 — FXServer binaries unavailable here
- **Subsystem:** interop
- **Kind / confidence / status:** observed / high / verified
- **Observation:** `curl https://runtime.fivem.net/artifacts/fivem/build_proot_linux/master/` returned `CONNECT tunnel failed, response 403` from the environment's egress proxy.
- **Consequence:** No FXServer could be run, so Level 4 (FXServer interoperability) could not be attempted.
- **Related (unverified):** `sv_licenseKey` is listed among the early convars in `citizen-server-main/src/ServerInstance.cpp:39`. Whether FXServer refuses to start without one was **not** verified in source.

### F-028 — REA engine availability
- **Subsystem:** tooling
- **Kind / confidence / status:** observed / high / verified
- **Observation:** `rea-agents@6.7.0` installed and registered with Claude Code (`npx rea-agents@6.7.0 setup --client claude_code`). `rea doctor`: providers Ghidra, IDA, JADX and Kuna are not configured, and Hopper is not installed. `inspect-binary-layout` needs a pwntools Python (not available). The artifact-graph provider (`inspect-artifact`) works. Cutter, Rizin, Binwalk, Frida and WinDbg are not installed. GDB 15 is present. The REA MCP tools were not loaded in this agent session (MCP servers load at session start), so the REA CLI was used directly.
- **Consequence:** Binary-level analysis was limited to artifact inventory and PE import tables.

### F-029 — lua.org unreachable
- **Kind / confidence / status:** observed / high / verified
- **Observation:** `https://www.lua.org/ftp/lua-5.4.7.tar.gz` returned HTTP 403 through the proxy. The same release was taken from the official mirror `github.com/lua/lua` tag `v5.4.7` (`1ab3208a…`).

## Jays Project verification records

### F-030 — Runtime micro-benchmarks
- **Kind / confidence / status:** measured / medium / verified
- **Observation:** See `research/PERFORMANCE_BASELINE.md` (Release build, Intel Xeon 2.1 GHz, 4 vCPU). Example: a cross-resource `TriggerEvent` takes 5.4 µs, and an export call 2.0 µs.
- **Limitations:** A single run on a shared VM, with no comparison against FiveM. These numbers are a baseline, not a claim of improvement.

### F-031 — Windows binaries under Wine
- **Kind / confidence / status:** observed / high (for Wine) / verified
- **Observation:** MinGW-w64 13.2 cross-builds of `jays-server.exe`, `jays-client.exe` and `jays-unit-tests.exe` import only `KERNEL32`, `WS2_32` and `msvcrt` (`research/evidence/rea/windows-imports.txt`). Under Wine 9.0 they passed **29/29 unit tests and 8/8 integration tests** (real Winsock sockets and processes).
- **Limitations:** Wine is not Windows. No native Windows or MSVC build was executed.

### F-032 — Packaged Windows launcher under Wine
- **Kind / confidence / status:** observed / medium / partially verified
- **Observation:** `electron-builder 25.1.8 --win portable` produced `launcher/out/Jays Project 0.1.0-alpha.exe`, bundling both `.exe` files and the demo server data. The final package is 75,318,461 bytes, sha256 `092cfef9…4e90`. The Wine run below used the previous package (sha256 `745bb7cd…c2d7`), built from the same launcher sources, which differed only in its bundled binaries (before the non-Lua script fix). Started under Wine 9.0 + Xvfb, its main process ran (three processes) and created the profile and `settings.json`. **The window contents were not observed rendering** (the capture was black, so it was discarded).
- **Limitations:** The UI on Windows is unverified. The same UI code was verified on Linux Electron through the Playwright e2e test.
