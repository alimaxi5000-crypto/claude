# Performance baseline (V0.1)

**Measured, not compared.** These numbers describe Jays Project V0.1 only. No FiveM
measurements were taken, so **no claim of being faster or slower than FiveM is made.**

- Build: Release (`-O3`), GCC 13.3, Lua 5.4.7 compiled as C++
- Host: Intel Xeon @ 2.10 GHz, 4 vCPU (shared cloud VM), Linux 6.18
- Tool: `build-rel/bin/jays-bench` (`tests/bench/bench.cpp`), a single run on 2026-10-19

| Benchmark | Ops | µs/op | ops/s |
|---|---:|---:|---:|
| manifest parse (fxmanifest.lua) | 2,000 | 16.95 | 59,004 |
| resource start + stop (new Lua state, 1 script) | 500 | 214.43 | 4,663 |
| Lua `TriggerEvent` → other resource (3 args) | 100,000 | 5.38 | 185,794 |
| Lua export call (2 ints) | 100,000 | 1.97 | 507,652 |
| Lua export call (100-element table, both ways) | 5,000 | 170.85 | 5,853 |
| host `TriggerEvent` from C++ (net-style payload) | 100,000 | 5.45 | 183,383 |
| JNP frame encode + decode (256 B body) | 200,000 | 0.06 | 15,541,346 |

Re-run with:

```bash
cmake -S . -B build-rel -G Ninja -DCMAKE_BUILD_TYPE=Release && cmake --build build-rel --target jays-bench
./build-rel/bin/jays-bench
```

## Observations and candidate optimizations (not implemented)

1. **Event dispatch** creates a Lua thread per runtime entry and a coroutine per handler. Pooling the entry threads and skipping runtimes with no handler for the event (a C++-side index) should reduce the 5.4 µs.
2. **Large export payloads** (171 µs for 100 small tables both ways) pay for msgpack encode, a `Value` tree, then Lua tables. Decoding straight into Lua without the intermediate `mp::Value` is the next step.
3. **Resource start** (214 µs) is dominated by creating the Lua state and loading the bootstrap. Precompiling the bootstrap once would help, but is only safe for trusted bytecode.
4. **Networking** is not benchmarked beyond framing. Loopback ping in e2e tests is under 1 ms.
