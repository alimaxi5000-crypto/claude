-- Server tick benchmark for jj_zombie_test (mocked natives; measures the resource's own Lua
-- work per AI tick, natives cost ~nothing here).
--   lua5.4 tests/lua/bench_server.lua <path to jj_zombie_test> [--json]
local here = debug.getinfo(1, 'S').source:sub(2):match('(.*/)') or './'
package.path = here .. '?.lua;' .. package.path
local M = require('mock')
local RES = arg[1] or (here .. '../../../jj_zombie_test')
local asJson = arg[2] == '--json'
M.loadResource(RES)

local results = {}
local function bench(nZombies, nPlayers)
    for _, z in pairs(JJZ.Zombies.byId) do JJZ.Zombies.remove(z, 'bench') end
    for src in pairs(M.players) do M.removePlayer(src) end
    M.advance(2000, 100)
    for i = 1, nPlayers do M.addPlayer(i, { pos = vector3(i * 40.0, 0, 30) }) end
    local rnd = JJZ.U.rng(nZombies)
    for i = 1, nZombies do
        local owner = (i % nPlayers) + 1
        local base = M.entities[M.players[owner].ped].pos
        local z = JJZ.Zombies.create(owner, base + vector3(rnd(-15, 15), rnd(6, 20), 0), 0.0, i % 2 == 0 and 'laeufer' or 'schlurfer', 0)
        M.entities[z.ent].owner = owner
        M.entities[z.ent].health = JJZ.Zombies.HEALTH_BASE + 300
        z.inited = true
    end
    JJZ.Zombies.setFrozen(false)
    M.advance(3000, 50) -- warm up (targets, primaries, slots)
    local ticks = 0
    local t0 = os.clock()
    local simMs = 20000
    local stop = M.now + simMs
    while M.now < stop do
        -- Move every zombie a little (as owner clients would) so distances change each tick.
        for _, z in pairs(JJZ.Zombies.byId) do
            local e = M.entities[z.ent]
            e.pos = e.pos + vector3(rnd(-0.05, 0.05), rnd(-0.05, 0.05), 0)
        end
        M.advance(100, 100)
        ticks = ticks + 1
    end
    local cpu = (os.clock() - t0) * 1000
    -- The zombie thread ticks every 250 ms (100 ms when someone is about to be grabbed).
    local zombieTicks = simMs / 250
    local r = { zombies = nZombies, players = nPlayers, msPerTick = cpu / zombieTicks, msPerSecond = cpu / (simMs / 1000) }
    results[#results + 1] = r
    if not asJson then
        M.print(('%3d zombies, %2d players: %.3f ms per AI tick, %.2f ms CPU per second (incl. mock overhead)'):format(nZombies, nPlayers, r.msPerTick, r.msPerSecond))
    end
end

-- Idle: no zombies -> the resource threads only sleep.
do
    local t0 = os.clock()
    M.advance(60000, 500)
    local cpu = (os.clock() - t0) * 1000
    results[#results + 1] = { zombies = 0, players = 0, msPerSecond = cpu / 60 }
    if not asJson then M.print(('idle (0 zombies): %.4f ms CPU per second'):format(cpu / 60)) end
end
bench(10, 2)
bench(30, 4)
bench(100, 8)
if M.errors and #M.errors > 0 then M.print('ERRORS:\n' .. M.errors[1]); os.exit(1) end
if asJson then
    local parts = {}
    for _, r in ipairs(results) do
        parts[#parts + 1] = ('{"zombies":%d,"players":%d,"msPerTick":%s,"msPerSecond":%.4f}'):format(r.zombies, r.players, r.msPerTick and ('%.4f'):format(r.msPerTick) or 'null', r.msPerSecond)
    end
    M.print('[' .. table.concat(parts, ',') .. ']')
end
