# Known limitations — V0.1 Alpha

| ID | Limitation | Impact | Evidence |
|---|---|---|---|
| L-01 | **No GTA V integration.** The client is headless: no game process, rendering, input, entities or game natives. | Achieved level stops at 3. Jays cannot join any GTA V session. | F-004, F-024 |
| L-02 | **No FXServer interoperability verified.** FXServer artifacts could not be downloaded here (proxy 403). The discovery probe follows the documented formats but was only tested against jays-server. | Level 4 not demonstrated. | F-027 |
| L-03 | FiveM game sessions require Cfx.re tickets unless the server owner sets `sv_lan`. Jays does not and will not emulate or bypass tickets. | Public FiveM servers are out of reach by design. | F-008 |
| L-04 | Not tested on native Windows. Windows binaries were cross-compiled with MinGW and tested under Wine 9.0 (29/29 unit, 8/8 integration). No MSVC build was run. `tools/build.ps1` is unexecuted. | Possible MSVC compile warnings/errors; Windows-specific behaviour (WSAPoll edge cases, console encoding) unverified. | F-031 |
| L-05 | The packaged Windows launcher (`Jays Project 0.1.0-alpha.exe`) was built and its main process started under Wine, but its UI was not observed rendering. | Windows UI unverified. The identical UI is verified on Linux Electron. | F-032 |
| L-06 | Exports and function references are synchronous: an export that calls `Wait` raises "attempt to yield across a C-call boundary". | Resources that yield inside exports need changes. | F-016 |
| L-07 | Function references that are serialized but never received by another resource are only released when the owner stops. | Small memory growth for event-heavy callback patterns. | LUA_RUNTIME.md |
| L-08 | Transport is TCP (JNP/1) without encryption or authentication. Player identity is a self-declared GUID. | Local or trusted networks only. | docs/PROTOCOL.md |
| L-09 | No ACE/permission system. `restricted` commands are console-only. | No admin roles for players. | F-023 |
| L-10 | Missing FiveM Lua APIs: vectors, `msgpack` global, state bags, KVP, `PerformHttpRequest`, `promise`/`Citizen.Await`, latent events, NUI. | Most real FiveM resources will not run unmodified. | COMPATIBILITY_MATRIX.md |
| L-11 | Only Lua resources. No JavaScript (V8/Node) or C# runtimes. | Non-`.lua` script entries are skipped with a warning (`runtime_skips_non_lua_scripts`). | F-005 |
| L-12 | `source` for server→client events is `65535`, an unverified inference. | Scripts that inspect `source` on the client may differ. | F-018 |
| L-13 | `files`, `ui_page`, `data_file` and streaming entries are parsed but ignored. Only manifests and scripts are sent to clients. | No assets or NUI. | F-026 |
| L-14 | Single-threaded server loop with a 10 ms poll. Script time budget 5 s per entry. | A slow script stalls the tick until the budget aborts it. | PERFORMANCE_BASELINE.md |
| L-15 | Client does not reconnect automatically. The launcher returns to idle with the reason shown. | Manual reconnect. | client.cpp |
| L-16 | IPv4 only. | — | net.cpp |
| L-17 | REA deep-analysis providers (Ghidra, IDA, JADX, pwntools, Rizin) are unavailable here, so binary analysis was limited to inventory and import tables. | Fine for V0.1, which needed no binary RE. | F-028 |
| L-18 | `server.cfg` support is a subset: `set/sets/setr`, `ensure/start/stop`, `exec`, `endpoint_add_tcp/udp`, and convar shorthand. Other commands are warned and ignored. | | config.cpp |

## Legal

- Jays Project contains **no FiveM source code**. It is a clean-room implementation guided by behaviour observed in source (F-001).
- Event names and API names (e.g. `playerConnecting`, `RegisterNetEvent`) are reused for interoperability with existing scripts.
- Distribution rights have not been assessed. Keep the prototype local and experimental.
- No game assets are included or extracted.
