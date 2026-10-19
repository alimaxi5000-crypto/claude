# FiveM connection handshake (source analysis) and the Jays equivalent

All FiveM facts cite `research/EVIDENCE_LEDGER.md`. Nothing here was observed on the wire,
because FXServer could not be obtained in this environment (F-027).

## FiveM client → FXServer (from source)

| Step | Client (`net/src/NetLibrary.cpp`) | Server (`citizen-server-impl`) | Evidence |
|---|---|---|---|
| 1 | `CS_INITING`: HTTP POST `/client` `method=initConnect&protocol=12&gameBuild=…&gameName=gta5&guid=…&name=…&cfxTicket2=…` | `InitConnectMethod.cpp`: checks fields, protocol, game, name; ticket required unless `sv_lan` | F-007, F-008 |
| 2 | deferral messages / adaptive cards (`submitCard`) | `playerConnecting` with deferrals (`:1162`) | F-019 |
| 3 | `CS_INITRECEIVED` → `CS_DOWNLOADING`: resources via HTTP | resource file HTTP handlers (`ResourceHttpHandler.cpp`) | F-006 |
| 4 | `CS_FETCHING`: OOB `getinfo xyz` every 5 s, more than 3 attempts → "Fetching info timed out" | `GetInfoOutOfBand.h` | F-006, F-020 |
| 5 | `CS_CONNECTING`: ENet connect with `token=…&guid=…`, every 5 s, more than 3 attempts → "Connection timed out" | `GameServerNet.ENet.cpp` | F-006, F-009 |
| 6 | `CS_CONNECTED` → `CS_ACTIVE` | `ClientRegistry.cpp` → `playerJoining` | F-006, F-019 |
| 7 | events: `msgServerEvent` (C→S), `msgNetEvent` (S→C) | `ServerEventPacketHandler.cpp` tags `net:<id>` | F-009, F-018 |

## What blocks an independent client from joining FXServer

1. **Authentication:** without `sv_lan`, step 1 needs a Cfx.re-signed `cfxTicket2` (F-008). Jays will not forge or bypass it.
2. **ENet message set:** after step 5 the server expects the full CitizenFX packet set (state bags, OneSync clone sync, routing). These are tied to a running GTA V client (F-024).
3. **No FXServer to test against here** (F-027).

## Lawful interop that exists today

| Interop | Status |
|---|---|
| UDP `getinfo` (`jays-client --probe`) | implemented to the source-documented format; **untested against FXServer** |
| HTTP `/info.json`, `/dynamic.json`, `/players.json` | implemented; **untested against FXServer** |
| Jays server answering FiveM-style discovery | implemented; verified with Jays' own probe |

## Jays JNP/1 mapping

| FiveM concept | JNP/1 |
|---|---|
| initConnect POST | `Hello` frame |
| deferral updates | `Event "__jays:deferralUpdate"` |
| init response / reject | `Welcome` / `Reject` |
| resource download over HTTP | `ResourceFile` frames + `ResourcesDone` |
| ENet connect + `CS_ACTIVE` | `ClientReady` → `Activated` |
| `msgServerEvent` / `msgNetEvent` | `Event` frame (both directions) |
| ENet timeouts | `Ping`/`Pong` every 2 s, 20 s inactivity timeout |

Full specification: [`docs/PROTOCOL.md`](../../docs/PROTOCOL.md).

## Proposed Level 4 experiment (not run)

Run this only on an FXServer you own, with `sv_lan 1` set in its `server.cfg`:

1. **Target:** `FXServer` (Linux build) on `127.0.0.1:30120`.
2. **Action:** `jays-client --probe 127.0.0.1:30120`, then a scripted HTTP POST of `initConnect` without a ticket.
3. **Expected:** getinfo and info JSON parse correctly. initConnect returns a token or an error describing the next step.
4. **Capture:** client JSON logs plus `tcpdump -i lo port 30120`, for 60 s.
5. **Stop conditions:** anything requiring a ticket, Steam/ROS identity, or game data.
