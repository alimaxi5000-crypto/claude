# Jays Network Protocol (JNP) — version 1

The transport between `jays-client` and `jays-server` in V0.1. It is an independent design and
**not** wire-compatible with FiveM's ENet protocol (EVIDENCE_LEDGER F-009).

## Transport

- One TCP connection per client. The default port is 30120 (configurable with `endpoint_add_tcp` or `--endpoint`).
- The same TCP port also serves HTTP `GET /info.json`, `/players.json` and `/dynamic.json`. The server decides by the first bytes it receives.
- UDP on the same port answers FXServer-style out-of-band `getinfo` requests.

### Connection preamble

The client sends exactly 8 bytes first: `4A 41 59 53 4E 50 30 31` (`"JAYSNP01"`).

### Frames

```
u32  length   little endian; counts the type byte + body; 1 ≤ length ≤ 16 MiB
u8   type
...  body     (length - 1 bytes)
```

Primitive encodings inside bodies: `u8`, `u32`/`i32`/`u64` little endian, `str` = `u32` byte
length + bytes (UTF-8 by convention). Event argument payloads are MessagePack arrays (see below).

| Type | Name | Direction | Body |
|---|---|---|---|
| 1 | Hello | C→S | `u32 protocol (=1)`, `str name`, `str guid`, `str clientVersion` |
| 2 | Welcome | S→C | `u32 netId`, `str serverName`, `u32 resourceCount` |
| 3 | Reject | S→C | `str reason` (connection closes afterwards) |
| 4 | ResourceFile | S→C | `str resource`, `str path`, `str content` |
| 5 | ResourcesDone | S→C | — |
| 6 | ClientReady | C→S | — (client resources started) |
| 7 | Activated | S→C | — (session is active) |
| 8 | Event | both | `str name`, `i32 target` (S→C: recipient or −1; C→S: 0), `str msgpackArgs` |
| 9 | Ping | both | `u64 nonce` |
| 10 | Pong | both | `u64 nonce` (echo) |
| 11 | Disconnect | both | `str reason` |

## Session sequence

```
client                                   server
  │ "JAYSNP01" + Hello ───────────────────►│ validate protocol, name, guid, capacity
  │                                        │ fire playerConnecting(name, setKickReason, deferrals)
  │◄────────────── Event "__jays:deferralUpdate" (optional, from deferrals.update)
  │◄───────────────────────────── Reject   │ (kick reason / canceled / full / version mismatch)
  │◄───────────────────────────── Welcome  │ (accepted, possibly after deferrals.done())
  │◄──────────────── ResourceFile × N      │ manifest + shared/client scripts of started resources
  │◄──────────────── ResourcesDone         │
  │ start resources (onClientResourceStart)│   server state: Loading (events already accepted)
  │ ClientReady ──────────────────────────►│ fire playerJoining
  │◄───────────────────────────── Activated│
  │ Event / Ping / Pong ◄─────────────────►│
  │ Disconnect ──────────────────────────► │ fire playerDropped(reason)
```

## Limits and timeouts (V0.1 values)

| Item | Value |
|---|---|
| Max frame | 16 MiB |
| Max event name / payload (C→S) | 256 B / 1 MiB; otherwise the client is dropped with "Malformed event." |
| C→S event rate | 200 events/s per client; excess events are dropped with a warning |
| Server: handshake timeout | 10 s (sniffing, HTTP and Hello) |
| Server: deferral timeout | 60 s |
| Server/client: inactivity timeout | 20 s; pings every 2 s |
| Client: time to reach Active | 30 s |
| Messages before Hello | the connection is dropped ("Unexpected … before handshake.") |

## Event arguments

Arguments are a MessagePack array. Functions travel as ext type 10 containing
`[resourceName, referenceId]`. The resource `__host` refers to server-side native callbacks
(`setKickReason`, `deferrals.*`). Unknown ext types decode as `nil`.

## Discovery (FXServer-compatible formats)

- UDP: `FF FF FF FF "getinfo <challenge>"` → `FF FF FF FF "infoResponse\n\sv_maxclients\8\clients\0\challenge\<challenge>\gamename\JaysProject\protocol\1\hostname\…\gametype\…\mapname\…\iv\0"`
- HTTP: `/info.json` `{server, protocol, resources[], vars{}, version}`, `/dynamic.json` `{clients, gametype, hostname, iv, mapname, sv_maxclients}`, `/players.json` `[{endpoint, id, identifiers[], name, ping}]`

The key layout follows FXServer (F-020, F-021). Values identify the server honestly as Jays Project.

## Security notes

- No authentication or encryption in V0.1. Use it only on trusted local networks.
- Client scripts come from the server and run sandboxed (no `io`, limited `os`, no bytecode loading).
- Server-side input validation: name sanitization, size limits, rate limiting, state-machine enforcement.
