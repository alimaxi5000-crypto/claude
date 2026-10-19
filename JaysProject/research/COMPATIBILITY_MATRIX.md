# Compatibility Matrix — Jays Project V0.1 vs FiveM resource API

**Legend**

| Status | Meaning |
|---|---|
| **Supported** | Implemented, behaviour matches the cited FiveM semantics, covered by an automated test |
| **Partial** | Implemented with documented differences |
| **Unsupported** | Not implemented; calling it fails (usually `attempt to call a nil value`) |
| **Untested** | Implemented, but behaviour has not been compared with FiveM |

"Test" names refer to `tests/unit/test_compat.cpp` (unit) or `tests/integration/test_e2e.py` (e2e).
Evidence IDs refer to `research/EVIDENCE_LEDGER.md`.

## Manifest (`fxmanifest.lua` / `__resource.lua`)

| Feature | Status | Notes | Evidence / test |
|---|---|---|---|
| `fxmanifest.lua`, `__resource.lua` fallback | Supported | fxmanifest preferred; legacy file logs a warning | F-011 · `manifest_load_prefers_fxmanifest` |
| Unknown-global directive DSL, plural tables | Supported | trailing `s` removed for tables only | F-011 · `manifest_parses_directives` |
| `shared_script(s)`, `server_script(s)`, `client_script(s)` | Supported | shared first, then side scripts | F-013 · `runtime_shared_scripts_load_first` |
| Globs (`*`, `?`, `**`) in script entries | Supported | sorted matches | F-013 · `glob_matching` |
| `@resource/file.lua` script entries | Partial | resolved from the other resource on the server and sent to the client; `@res` must be a loaded resource | — (code path in `Resource::ReadFile`) — Untested vs FiveM |
| `dependency` / `dependencies` | Supported | start order, cycle detection, missing-dependency errors; `/server:…`-style platform deps ignored | F-012 · `runtime_lifecycle_events_and_dependencies` |
| `export`, `server_export` | Supported | expose same-named globals | F-016 · `runtime_exports_and_callbacks` |
| `fx_version`, `game(s)`, `lua54`, `author`, `version`, `description` | Partial | stored as metadata; `game` and `fx_version` are not enforced | — |
| `files`, `data_file`, `this_is_a_map`, `ui_page`, `loadscreen` | Unsupported | parsed and ignored (no streaming, NUI or game data) | F-026 |
| Manifest sandboxing | Supported (Jays addition) | base/string/table/math only, 2 s time limit | `manifest_errors_are_reported` |

## Scheduler and threads

| API | Status | Notes | Evidence / test |
|---|---|---|---|
| `Citizen.CreateThread` / `CreateThread` | Supported | starts on the next tick | F-014 · `runtime_threads_and_wait` |
| `Citizen.CreateThreadNow` | Supported | runs until the first `Wait` | F-014 |
| `Citizen.Wait` / `Wait` | Supported | error outside scheduler threads | `runtime_threads_and_wait` |
| `SetTimeout` / `ClearTimeout` | Supported | | `runtime_threads_and_wait` |
| `Citizen.Await`, `promise` library | Unsupported | | — |
| Runaway-script protection | Supported (Jays addition) | 5 s budget per entry, configurable | `runtime_stops_runaway_scripts` |

## Events

| API | Status | Notes | Evidence / test |
|---|---|---|---|
| `AddEventHandler` → `{key,name}`, `RemoveEventHandler` | Supported | | F-015 |
| `TriggerEvent` (local, cross-resource) | Supported | msgpack copy semantics | F-014 · `runtime_events_local_and_cross_resource` |
| `RegisterNetEvent` / `RegisterServerEvent` | Supported | non-registered net events dropped with warning | F-014 · `runtime_net_events_require_registration` |
| `TriggerServerEvent` (client) | Supported | over JNP | e2e `two_clients_exchange_chat_and_events` |
| `TriggerClientEvent(name, target, …)`, target `-1` | Supported | | e2e |
| `source` global | Partial | numeric for net events; `65535` for server→client events is an inference | F-018 |
| `CancelEvent` / `WasEventCanceled` | Supported | | `runtime_cancel_event` |
| `TriggerLatentClientEvent` / `TriggerLatentServerEvent` | Unsupported | | — |
| Function references inside event/export args | Supported | msgpack ext type; reference counted, see limitation L-07 | `runtime_exports_and_callbacks`, `runtime_host_function_refs` |
| `onResourceStarting` (cancelable), `onResourceStart`, `onResourceStop` | Supported | | F-017 |
| `onServerResourceStart/Stop`, `onClientResourceStart/Stop` | Untested | names not verified in FiveM source | F-017 |
| `playerConnecting(name, setKickReason, deferrals)` | Partial | `defer/update/done` supported; `presentCard` unsupported | F-019 · e2e `banned_player_is_rejected` |
| `playerJoining`, `playerDropped` | Supported | | F-019 · e2e |
| Game events (`gameEventTriggered`, `entityCreated`, …) | Unsupported | no game | F-024 |

## Exports and commands

| API | Status | Notes | Evidence / test |
|---|---|---|---|
| `exports('name', fn)` | Supported | | F-016 |
| `exports.res:fn(...)`, `exports['res']:fn(...)` | Supported | `self` ignored; errors wrapped | F-016 |
| Exports that `Wait` | Unsupported | yields across Lua states are not allowed | L-06 |
| `GetInvokingResource` | Partial | set for exports, function refs and local events | `runtime_exports_and_callbacks` |
| `RegisterCommand(name, handler, restricted)` | Partial | `(source, args, raw)`; restricted = console only (no ACE) | F-023 · `runtime_commands` |
| `ExecuteCommand` | Supported | server host commands and resource commands | — |
| ACE / principals (`IsPlayerAceAllowed`, `add_ace`) | Unsupported | | — |

## Natives

| Group | Status | Notes |
|---|---|---|
| Resource natives: `GetCurrentResourceName`, `GetResourceState`, `GetNumResources`, `GetResourceByFindIndex`, `GetResourceMetadata`, `GetNumResourceMetadata`, `LoadResourceFile`, `StartResource`, `StopResource` | Supported | `Start/StopResource` server only |
| Runtime natives: `GetGameTimer`, `IsDuplicityVersion`, `GetConvar`, `GetConvarInt` | Supported | convars from server.cfg (client returns defaults) |
| Server player natives: `GetPlayers`, `GetPlayerName`, `GetNumPlayerIndices`, `GetPlayerFromIndex`, `GetPlayerPing`, `GetPlayerEndpoint`, `GetPlayerIdentifiers`, `GetNumPlayerIdentifiers`, `GetPlayerIdentifier`, `DropPlayer` | Supported | identifiers are `jays:<guid>` and `ip:<addr>` (no license/steam/discord ids) |
| Client: `PlayerId`, `GetPlayerServerId`, `GetPlayerName(PlayerId())` | Partial | only the local player exists |
| `json.encode` / `json.decode` | Supported | empty table encodes as `[]`; `decode` returns `nil, err` on failure |
| `msgpack`, `vector2/3/4`, `quat`, GLM math | Unsupported | F-003 |
| State bags (`GlobalState`, `Entity(...).state`, `Player(...).state`) | Unsupported | |
| KVP (`SetResourceKvp`, …), `PerformHttpRequest`, `SaveResourceFile` | Unsupported | |
| **GTA V natives** (entities, peds, vehicles, world, UI, streaming) | Unsupported | require the game, F-024 |

## Sandbox differences (deliberate)

| Area | Server | Client |
|---|---|---|
| `io` | available | removed |
| `os` | full | `time`, `clock`, `date`, `difftime` only |
| `dofile`, `loadfile` | removed | removed |
| `load` | text chunks only (bytecode rejected) | text chunks only |
| `debug` | full | `traceback`, `getinfo` only |

## Summary counts

| Category | Supported | Partial | Untested | Unsupported |
|---|---|---|---|---|
| Manifest | 6 | 2 | 0 | 1 group |
| Scheduler | 5 | 0 | 0 | 1 |
| Events | 10 | 2 | 1 | 2 |
| Exports & commands | 3 | 2 | 0 | 2 |
| Natives (groups) | 3 | 1 | 0 | 5 |

Real-world FiveM resources usually depend on GTA natives, vectors, state bags or framework
libraries (ox_lib, ESX, QBCore), so **most existing resources will not run unmodified on
V0.1.** Resources that only use events, exports, commands, threads and json do run.
