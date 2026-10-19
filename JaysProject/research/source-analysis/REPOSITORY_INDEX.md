# FiveM repository index (reference snapshot)

| Item | Value |
|---|---|
| URL | https://github.com/citizenfx/fivem |
| Branch | `master` |
| Commit | `580b25c85d0784992c43313a9136b8d5b6839b0a` ("Merge CEF regressions fixes (mr-978)", 2026-10-19T16:13:05+02:00) |
| Clone | shallow (`--depth 1`), 13,552 files, 658 MB, at `/home/user/ref/fivem` (outside this repo, unmodified) |
| Submodules | 151, **not initialised**; pinned revisions in [`fivem-submodules.txt`](fivem-submodules.txt) |
| License | Rockstar Games Creator Platform License, with LGPL-2.0 for listed paths (F-001); third-party notices in `THIRD_PARTY_NOTICES.md` |
| Build system | premake5 (`code/premake5.lua`), `--game=five\|rdr3\|ny\|server\|launcher` |
| Client build | Windows, Visual Studio (`code/tools/ci/build_client.ps1`, `fxd.ps1`) |
| Server build | Windows (`build_server_windows.ps1`) or Linux Alpine via docker/proot (`build_server_docker_alpine.sh`) |
| Missing / proprietary | `code/components/legitimacy` (prebuilt DLL only, F-025); Cfx.re ticket/keymaster services (F-008); GTA V (F-024) |

## Top-level layout (from `code/README.md`)

| Path | Contents |
|---|---|
| `code/client/` | launcher (`launcher/`), CoreRT (`citicore/`), shared client code |
| `code/components/` | 117 components (networking, resources, scripting, game hooks, UI, server) |
| `code/server/` | server launcher |
| `code/shared/` | low-level shared code |
| `code/vendor/` | premake vendor definitions |
| `data/shared/citizen/scripting/` | Lua/JS scheduler and manifest bootstrap (`resource_init.lua`, `lua/scheduler.lua`) |
| `ext/native-decls/` | native declarations (documentation of the scripting API) |
| `vendor/` | submodules (lua fork, v8, node, enet, …) |

## Component groups (117 directories)

| Group | Components (examples) | Relevance to Jays V0.1 |
|---|---|---|
| Resources | `citizen-resources-core`, `-client`, `-gta`, `-metadata-lua` | analysed (F-011–F-013, F-017) |
| Scripting | `citizen-scripting-core`, `-lua`, `-v8*`, `-mono*`, `-node` | Lua analysed (F-014–F-016) |
| Networking | `net`, `net-base`, `net-packet`, `net-http-server`, `net-tcp-server` | analysed (F-006–F-009) |
| Server | `citizen-server-impl`, `-main`, `-net`, `-state*`, `-monitor`, `-gui` | partly analysed (F-019–F-021) |
| Game hooks (Five) | `gta-core-five`, `gta-game-five`, `gta-net-five`, `gta-streaming-five`, `rage-*-five`, `extra-natives-five` | scoped out (game integration, F-024) |
| UI | `nui-core`, `nui-resources`, `nui-gsclient`, `loading-screens-five` | noted (F-026) |
| Other games | `*-rdr3`, `*-ny` | not relevant |
| Auth / platform | `legitimacy`, `discord` | identified only (F-025) |
| Tooling | `devcon`, `debug-*`, `citizen-devtools` | not analysed |

## Method

1. Shallow clone, record commit and submodule pins.
2. `ls`/`grep` indexing of entry points (`wWinMain`, `initConnect`, packet names, event names).
3. Targeted reading of the files cited in the evidence ledger.
4. REA used for binary artifacts only (`legitimacy.dll` identification; Jays' own Windows builds).
   REA's guidance is to skip it for ordinary source-repository analysis.
