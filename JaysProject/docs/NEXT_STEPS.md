# Next steps

Ordered by value and feasibility. Each item states how it will be verified.

## 1. Verify on real Windows (highest priority, cheap)
- Run `tools/build.ps1` with Visual Studio 2022 and fix any MSVC diagnostics.
- Run `ctest -C Release` and `cd launcher && npm test` on Windows.
- Launch `launcher/out/Jays Project 0.1.0-alpha.exe` and confirm the UI renders (L-05).
- **Done when:** all suites pass on a native Windows host, with screenshots recorded as evidence.

## 2. FXServer discovery interop (Level 4, partial)
- On an owner-controlled machine: download FXServer, run it with a local `server.cfg` (`sv_lan 1`), run `jays-client --probe`.
- Record the getinfo and info.json outputs in `research/evidence/` and update F-020/F-021 to "verified against FXServer".
- Optionally capture `initConnect` behaviour with a hand-written HTTP POST (no ticket, `sv_lan` server) to document the next protocol steps. **Do not** attempt ticket emulation.
- **Done when:** the probe output from a real FXServer is committed with the server build number.

## 3. Runtime compatibility depth
- `vector2/3/4` types (pure Lua or C userdata), a `msgpack` global, `promise` and `Citizen.Await`.
- State bags (`GlobalState`, `Player(id).state`) with server→client replication over JNP.
- KVP storage, `SaveResourceFile`, `PerformHttpRequest` (server).
- Latent events with bandwidth limits.
- ACE permissions (`add_ace`, `add_principal`, `IsPlayerAceAllowed`).
- **Done when:** each feature has unit tests plus a COMPATIBILITY_MATRIX row with FiveM evidence.

## 4. Networking
- UDP transport with reliability and ordering (evaluate ENet, which is MIT-licensed upstream, versus a custom design).
- Reconnect support and session tokens.
- Authentication design for Jays servers (signed identities, owner-controlled). Independent of Cfx.re.
- TLS or Noise encryption.
- **Done when:** the e2e suite runs over the new transport, with packet-loss simulation tests.

## 5. Performance
- Pool Lua entry threads and index handlers per event in C++ (PERFORMANCE_BASELINE item 1).
- Decode msgpack straight into Lua (item 2).
- **Done when:** the benchmark shows a measured improvement on the same host.

## 6. Game client research (Level 5), gated on legal review
- Legal review of the GTA V EULA, Rockstar's Creator Platform terms and FiveM's license before any game-integration work.
- Only if cleared: design a separate, documented game-integration layer. The headless client and runtime stay game-agnostic.
- Until then, Level 5 remains out of scope.

## 7. Launcher
- Server browser (list of saved servers, probe on demand).
- Auto-update channel, code signing.
- Native installer (NSIS) instead of portable.
