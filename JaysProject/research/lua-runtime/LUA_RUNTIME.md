# Lua runtime design (Jays compatibility layer)

## Semantics mirrored from FiveM (source evidence)

| Behaviour | FiveM evidence | Jays implementation |
|---|---|---|
| One isolated Lua state per resource | F-014 (per-resource handler tables) | `ScriptRuntime` owns one `lua_State` |
| Event args copied as msgpack between resources | F-015 | `mp::PackLua` / `mp::UnpackLua` |
| Handlers run in new threads until first `Wait` | F-014 | `Citizen.CreateThreadNow` in `bootstrap.lua` |
| `CreateThread` starts later; `Wait(ms)` yields | F-014 | scheduler in `bootstrap.lua`, ticked by `ResourceManager::Tick` |
| Net events need `RegisterNetEvent` | F-014 | `safeForNet` flag per event entry |
| `source` set per dispatch | F-014 | `__jays_dispatch` |
| Exports via `exports(...)` and manifest `export`/`server_export` | F-016 | native export registry (`ResourceManager::CallExport`) |
| Function arguments survive serialization | F-016 (funcref msgpack ext) | ext type 10 `[resource, id]` with proxy tables |
| Manifest DSL | F-011, F-012 | `ParseManifest` |
| shared → side scripts | F-013 | `Resource::ScriptsFor` |

## Execution model

```
ResourceManager (C++)
 ├─ Tick() ─► each started runtime: Call("__jays_tick") ─► resumes due coroutines
 ├─ TriggerEvent(name, payload, source) ─► every runtime: Call("__jays_dispatch", …)
 ├─ CallExport(res, name, args) ─► target runtime: Call("__jays_export", …)
 └─ InvokeRef(res, id, args)     ─► target runtime: Call("__jays_invoke", fn, args)

ScriptRuntime::Call
  anchor = thread currently inside a native call (m_running) or the main thread
  T = lua_newthread(anchor); ref it; lua_pcall(T, traceback handler); unref
```

**Why a fresh thread per entry:** a nested chain such as resource A calling an export of B,
which calls back into A, re-enters A while A's coroutine is suspended inside a C call. Pushing
onto a suspended or "normal" thread's stack is unsafe. A new thread anchored on the running
thread is safe and keeps every entry independent. Lua's `extraspace` holds the `ScriptRuntime*`
and is inherited by every thread.

**Errors:** Lua is compiled as C++, so `lua_error` unwinds by exception and C++ destructors
in natives run. Errors inside coroutines are logged with `debug.traceback`. Top-level script
errors are logged, and the remaining scripts still load (as in FiveM, where one failing file
does not abort a resource).

**Time budget:** a count hook every 20,000 instructions checks a per-entry deadline (default
5 s, `ResourceManager::SetScriptBudgetMs`). An infinite loop in one thread fails that thread
only (`runtime_stops_runaway_scripts`).

**Function reference lifetime:** the owning runtime keeps `refs[id] = fn` plus a weak
`fn → id` map (packing the same function reuses its id). Each foreign proxy increments a
refcount. Its `__gc` decrements it, and at zero the reference is released on the owner's next
idle tick. References that are packed but never unpacked anywhere are only released when the
resource stops (KNOWN_LIMITATIONS L-07).

## Sandbox

Client scripts arrive from the network, so the client side has no `io`, a reduced `os` and a
reduced `debug`. Both sides have `load` restricted to text chunks, and `dofile`/`loadfile`
removed. Manifests run with only `base`/`string`/`table`/`math` and a 2 s limit.

## Measured costs

See `research/PERFORMANCE_BASELINE.md`. Per-entry thread creation and per-handler coroutine
creation dominate event cost (~5.4 µs per cross-resource event). Caching or pooling these
threads is the first optimization candidate.
