-- Server logic tests for jj_zombie_test with mocked natives (tests/lua/mock.lua).
--   lua5.4 tests/lua/test_server.lua <path to jj_zombie_test>
-- Exercises the real server files: spawn validation, finisher success / failure / aborts,
-- key press validation (autoclicker, replay, forged timestamps, rate caps), direction choice,
-- cleanup on disconnect, and a fuzz pass over every network handler.
local here = debug.getinfo(1, 'S').source:sub(2):match('(.*/)') or './'
package.path = here .. '?.lua;' .. package.path
local M = require('mock')
local RES = arg[1] or (here .. '../../../jj_zombie_test')
math.randomseed(12345)
M.loadResource(RES)

local E, S, P = JJZ.Events, JJZ.AiState, JJZ.FinPhase
local passed, failed = 0, 0
local function check(cond, name, detail)
    if cond then passed = passed + 1 else failed = failed + 1; M.print('  FAIL ' .. name .. (detail and (': ' .. tostring(detail)) or '')) end
end
local function section(name) M.print('-- ' .. name) end
local function noErrors(name)
    check(not M.errors or #M.errors == 0, name .. ' (no Lua errors)', M.errors and M.errors[1])
    M.errors = nil
end
local function reset()
    for _, z in pairs(JJZ.Zombies.byId) do JJZ.Zombies.remove(z, 'test reset') end
    for src in pairs(M.players) do M.removePlayer(src) end
    M.sent = {}
    -- Manual scenarios run with the AI frozen (the real AI would grab on its own);
    -- the 'AI chase and grab' section runs it unfrozen.
    JJZ.Zombies.setFrozen(true)
    M.advance(5000, 50)   -- grace periods, rate limit windows
end
local function lastSent(target, name)
    local l = M.sentTo(target, name)
    return l[#l]
end

-- Place a zombie directly (bypassing the spawn search) owned by `owner`.
local function makeZombie(owner, pos, ztype)
    local z = JJZ.Zombies.create(owner, pos, 180.0, ztype or 'schlurfer', 0)
    M.entities[z.ent].owner = owner
    return z
end

-- Run a finisher from the start up to the struggle phase; returns fin.
local function startFinisher(src, z)
    local ok, why = JJZ.Finisher.tryStart(z, src, nil, true)
    check(ok, 'tryStart ok', why)
    local fin = JJZ.Finisher.activeFor(src)
    M.fire(E.FinisherClientState, src, fin.id, 'grab')
    M.advance(math.floor(fin.grabDur * 1000) + 60, 10)
    check(fin.phase == P.Struggle, 'struggle phase reached', fin.phase)
    return fin
end

-- Human-like pressing: intervals 85..150 ms, batches every 100 ms.
local function pressLikeHuman(src, fin, seconds, startSeq, rngSeed)
    local rnd = JJZ.U.rng(rngSeed or 7)
    local seq = startSeq or 0
    local t0 = M.now
    local nextPress = 30
    local batch = {}
    local lastFlush = 0
    while M.now - t0 < seconds * 1000 and fin.phase == P.Struggle do
        local el = M.now - fin.struggleAt
        if M.now - t0 >= nextPress then
            batch[#batch + 1] = el
            nextPress = nextPress + math.floor(rnd(85, 150))
        end
        if M.now - t0 - lastFlush >= 100 and #batch > 0 then
            seq = seq + 1
            M.fire(E.StruggleInput, src, fin.id, seq, batch)
            batch = {}
            lastFlush = M.now - t0
        end
        M.advance(10, 10)
    end
    return seq
end

-- ------------------------------------------------------------------ direction choice
section('direction choice')
do
    local F = JJZ.Finisher
    local victim = vector3(0, 0, 0)
    local cases = {
        { z = vector3(0, 1, 0), h = 0, k = 0 }, { z = vector3(0, 1, 0), h = 90, k = 2 },
        { z = vector3(0, 1, 0), h = 180, k = 4 }, { z = vector3(0, 1, 0), h = 270, k = 6 },
        { z = vector3(1, 0, 0), h = 270, k = 0 }, { z = vector3(1, 0, 0), h = 0, k = 2 },
        { z = vector3(0, 1, 0), h = 44, k = 1 }, { z = vector3(0, 1, 0), h = 316, k = 7 },
        { z = vector3(-1, -1, 0), h = 135, k = 0 }, { z = vector3(0, 1, 0), h = 200, k = 4 },
    }
    for _, c in ipairs(cases) do
        local k = F.chooseDirection(victim, c.h, c.z)
        check(k == c.k, ('dir heading %d zombie (%d,%d)'):format(c.h, c.z.x, c.z.y), ('got %d expected %d'):format(k, c.k))
    end
    -- Every grab direction variant must exist in the clip registry for both genders.
    for k = 0, 7 do
        for _, g in ipairs({ 'm', 'f' }) do
            check(Clips.entry('fin_grab', ('d%d_%s'):format(k, g)) ~= nil, ('registry fin_grab d%d_%s'):format(k, g))
        end
    end
end

-- ------------------------------------------------------------------ spawn validation
section('spawn flow')
reset()
do
    M.addPlayer(1, { pos = vector3(100, 100, 30), heading = 0 })
    M.fire('jj_zombie:server:ready', 1)
    M.commands[Config.Commands.Spawn](1, { '3', 'laeufer' })
    local req = lastSent(1, E.FindSpawn)
    check(req ~= nil, 'FindSpawn sent to the requester')
    local reqId, count = req.args[1], req.args[2]
    check(count == 3, 'spawn count 3', count)
    -- One good point, one too close, one NaN, one string, one too far, one duplicate.
    local pts = {
        { x = 100.0, y = 111.0, z = 30.0 }, { x = 100.0, y = 101.0, z = 30.0 }, { x = 0 / 0, y = 0.0, z = 0.0 },
    }
    M.fire(E.SpawnPoints, 1, reqId, pts)
    check(JJZ.Zombies.count == 1, 'only the valid spawn point is used', JJZ.Zombies.count)
    -- Replay of the same request: rejected (request consumed).
    M.fire(E.SpawnPoints, 1, reqId, { { x = 110.0, y = 100.0, z = 30.0 } })
    check(JJZ.Zombies.count == 1, 'spawn request cannot be replayed', JJZ.Zombies.count)
    -- Points from a player who did not request: ignored.
    M.addPlayer(2, { pos = vector3(0, 0, 30) })
    M.fire(E.SpawnPoints, 2, 1, { { x = 10.0, y = 0.0, z = 30.0 } })
    check(JJZ.Zombies.count == 1, 'unrequested spawn points ignored')
    local z = next(JJZ.Zombies.byId) and JJZ.Zombies.byId[next(JJZ.Zombies.byId)]
    check(z and z.type == 'laeufer', 'requested type used', z and z.type)
    check(z and Entity(z.ent).state[JJZ.State.IsZombie] == true, 'state bag jjz set')
    check(z and M.entities[z.ent].orphan == 2, 'orphan mode KeepEntity')
    -- Limit per command: 9 -> clamped to MaxPerCommand.
    M.advance(3500, 50)
    M.commands[Config.Commands.Spawn](1, { '9' })
    req = lastSent(1, E.FindSpawn)
    check(req.args[2] <= Config.Spawn.MaxPerCommand, 'spawn count clamped', req.args[2])
    -- Player leaves: own zombies removed.
    M.removePlayer(1)
    check(JJZ.Zombies.count == 0, 'zombies of a leaving player removed', JJZ.Zombies.count)
    noErrors('spawn flow')
end

-- ------------------------------------------------------------------ finisher success
section('finisher success')
reset()
do
    M.addPlayer(1, { pos = vector3(0, 0, 30), heading = 0 })
    local z = makeZombie(1, vector3(0, 1.0, 30))
    local fin = startFinisher(1, z)
    check(lastSent(1, E.FinisherStart) ~= nil, 'FinisherStart sent to the victim')
    check(M.entities[z.ent].remoteScenes == true, 'remote synced scenes allowed during finisher')
    check(Player(1).state[JJZ.PlayerState.Fin] == fin.id, 'player state fin id set')
    pressLikeHuman(1, fin, Config.Finisher.TimeLimitSeconds, 0, 3)
    check(fin.result == JJZ.Results.Success, 'human pressing wins', fin.result .. ' progress ' .. tostring(fin.progress))
    check(lastSent(1, E.FinisherResult) and lastSent(1, E.FinisherResult).args[2] == 'success', 'result sent')
    check(#M.sentTo(1, E.ZombieImpact) >= 1, 'impact armed on the zombie owner')
    M.advance(math.floor(fin.resultEntry.duration * 1000) + 200, 20)
    check(fin.phase == P.Ended, 'finisher ended after the shove', fin.phase)
    check(JJZ.Finisher.activeFor(1) == nil, 'victim free')
    check(z.ai == S.Stunned, 'zombie stunned after the shove', z.ai)
    check(M.entities[z.ent].remoteScenes == false, 'remote synced scenes disallowed again')
    check(Player(1).state[JJZ.PlayerState.Fin] == 0, 'player state fin cleared')
    -- Grace period: a new grab is refused right away.
    local ok, why = JJZ.Finisher.canGrab(1, z, { valid = true, bucket = 0 })
    check(not ok and (why == 'reason_grace' or why == 'reason_zombie'), 'grace / stun blocks an immediate re-grab', why)
    noErrors('finisher success')
end

-- ------------------------------------------------------------------ finisher failure (bite)
section('finisher failure')
reset()
do
    M.addPlayer(1, { pos = vector3(0, 0, 30), heading = 180 })
    local z = makeZombie(1, vector3(0, 1.0, 30), 'laeufer')
    local fin = startFinisher(1, z)
    check(fin.dir == 4, 'grab from behind chooses direction 4', fin.dir)
    M.advance(math.floor(Config.Finisher.TimeLimitSeconds * 1000) + 700, 20)
    check(fin.result == JJZ.Results.Bite, 'no presses -> bite', fin.result)
    M.advance(math.floor(fin.resultEntry.duration * 1000) + 200, 20)
    local bite = lastSent(1, E.ApplyBite)
    check(bite ~= nil, 'bite damage sent to the victim')
    local expect = math.floor(Config.Finisher.BiteDamage * Config.Types.laeufer.BiteDamageMult + 0.5)
    check(bite and bite.args[2] == expect, 'bite damage = config x type multiplier', bite and bite.args[2])
    local b = Player(1).state[JJZ.PlayerState.Bitten]
    check(type(b) == 'table' and b.count == 1, 'bitten marker set (count 1)')
    check(fin.phase == P.Ended, 'finisher ended after the bite')
    noErrors('finisher failure')
end

-- ------------------------------------------------------------------ input validation
section('input validation')
reset()
do
    M.addPlayer(1, { pos = vector3(0, 0, 30) })
    M.addPlayer(2, { pos = vector3(5, 0, 30) })
    local z = makeZombie(1, vector3(0, 1.0, 30))
    local fin = startFinisher(1, z)
    local p0 = fin.progress
    -- Another player cannot press for the victim.
    M.fire(E.StruggleInput, 2, fin.id, 1, { 100, 200 })
    check(fin.lastSeq == 0, 'input from another player ignored')
    -- Wrong finisher id / bad types.
    M.fire(E.StruggleInput, 1, fin.id + 1, 1, { 100 })
    M.fire(E.StruggleInput, 1, fin.id, 'x', { 100 })
    M.fire(E.StruggleInput, 1, fin.id, 1, 'nope')
    M.fire(E.StruggleInput, 1, fin.id, 1, { 1.5 })
    check(fin.progress <= p0 + 0.001, 'malformed input ignored', fin.progress)
    M.advance(300, 10)
    local el = M.now - fin.struggleAt
    -- Future timestamps (beyond the allowed clock skew) are ignored.
    M.fire(E.StruggleInput, 1, fin.id, 5, { el + 2000 })
    check(fin.lastPressT < el + 2000, 'future press ignored')
    -- Valid batch counts, a replay of the same seq does not.
    M.fire(E.StruggleInput, 1, fin.id, 6, { el - 200, el - 100 })
    local afterValid = fin.progress
    M.fire(E.StruggleInput, 1, fin.id, 6, { el - 50, el })
    check(fin.progress == afterValid, 'replayed sequence number ignored')
    -- Presses closer than MinIntervalMs are dropped.
    M.advance(400, 10)
    el = M.now - fin.struggleAt
    local before = fin.progress
    M.fire(E.StruggleInput, 1, fin.id, 7, { el - 30, el - 20, el - 10, el })
    local gained = (fin.progress - before) / JJZ.Finisher.byId[fin.id].strength
    check(fin.progress - before <= Config.Finisher.ProgressPerPress * 1.01 + 0.01, 'presses under MinIntervalMs dropped', gained)
    -- Oversized batch rejected as a whole.
    local big = {}
    for i = 1, ConfigServer.Input.MaxBatchSize + 1 do big[i] = el - 300 + i * 60 end
    before = fin.progress
    M.fire(E.StruggleInput, 1, fin.id, 8, big)
    check(fin.progress == before, 'oversized batch rejected')
    noErrors('input validation')
end

section('autoclicker')
reset()
do
    M.addPlayer(1, { pos = vector3(0, 0, 30) })
    local z = makeZombie(1, vector3(0, 1.0, 30))
    local fin = startFinisher(1, z)
    -- Exactly 70 ms apart, sent in batches of 2 every ~140 ms.
    local seq, t = 0, 50
    local stopAt = 4000
    while t < stopAt and fin.phase == P.Struggle do
        M.advance(140, 10)
        seq = seq + 1
        M.fire(E.StruggleInput, 1, fin.id, seq, { t, t + 70 })
        t = t + 140
    end
    check(fin.suspect == true, 'machine-regular intervals flagged')
    local warned = false
    for _, l in ipairs(M.logs) do if l:find('suspicious input') then warned = true end end
    check(warned, 'suspicious input logged')
    check(fin.result ~= JJZ.Results.Success, 'autoclicker does not win (OnSuspicious = ignore)', fin.result)
    noErrors('autoclicker')
end

section('rate cap')
reset()
do
    M.addPlayer(1, { pos = vector3(0, 0, 30) })
    local z = makeZombie(1, vector3(0, 1.0, 30))
    local fin = startFinisher(1, z)
    -- 25 presses per second with jitter (not regular): only MaxPressesPerSecond may count.
    local rnd, seq, counted = JJZ.U.rng(99), 0, 0
    local startProgress = fin.progress
    local tt = 0
    local presses = {}
    while tt < 1000 do tt = tt + math.floor(rnd(36, 44)); presses[#presses + 1] = tt end
    M.advance(1100, 10)
    for i = 1, #presses, 4 do
        seq = seq + 1
        local b = {}
        for j = i, math.min(i + 3, #presses) do b[#b + 1] = presses[j] end
        M.fire(E.StruggleInput, 1, fin.id, seq, b)
    end
    counted = (fin.progress - startProgress + Config.Finisher.DecayPerSecond * 1.1) / (Config.Finisher.ProgressPerPress / fin.strength)
    check(counted <= ConfigServer.Input.MaxPressesPerSecond + 0.5, 'presses per second capped', ('%.1f counted'):format(counted))
    noErrors('rate cap')
end

-- ------------------------------------------------------------------ aborts
section('abort paths')
reset()
do
    -- Victim disconnects mid struggle.
    M.addPlayer(1, { pos = vector3(0, 0, 30) })
    M.addPlayer(2, { pos = vector3(20, 0, 30) })
    local z = makeZombie(2, vector3(0, 1.0, 30))
    local fin = startFinisher(1, z)
    M.removePlayer(1)
    check(fin.phase == P.Ended, 'victim left -> ended', fin.phase)
    check(z.finId == 0 and z.ai == S.Stunned, 'zombie released after victim left', z.ai)
    check(M.entities[z.ent].remoteScenes == false, 'scene permission revoked')
    noErrors('victim left')

    -- Zombie deleted during the grab.
    M.addPlayer(3, { pos = vector3(50, 0, 30) })
    local z2 = makeZombie(3, vector3(50, 1.0, 30))
    local ok = JJZ.Finisher.tryStart(z2, 3, nil, true)
    check(ok, 'second finisher started')
    local fin2 = JJZ.Finisher.activeFor(3)
    M.fire(E.FinisherClientState, 3, fin2.id, 'grab')
    M.entities[z2.ent].exists = false
    M.advance(300, 10)
    check(fin2.phase == P.Ended, 'zombie gone -> ended', fin2.phase)
    check(#M.sentTo(3, E.FinisherAbort) >= 1, 'victim told to abort')
    noErrors('zombie gone')

    -- Client never confirms the scene.
    M.addPlayer(4, { pos = vector3(100, 0, 30) })
    local z3 = makeZombie(4, vector3(100, 1.0, 30))
    M.advance(5000, 50)
    ok = JJZ.Finisher.tryStart(z3, 4, nil, true)
    local fin3 = JJZ.Finisher.activeFor(4)
    M.advance(4000, 50)
    check(fin3 and fin3.phase == P.Ended, 'unconfirmed scene -> ended (watchdog)', fin3 and fin3.phase)
    noErrors('unconfirmed')

    -- Client reports failure.
    M.advance(5000, 50)
    local z4 = makeZombie(4, vector3(100, 3.0, 30))
    local why4
    ok, why4 = JJZ.Finisher.tryStart(z4, 4, nil, true)
    local fin4 = JJZ.Finisher.activeFor(4)
    check(ok and fin4, 'finisher 4 started', why4)
    if fin4 then
        M.fire(E.FinisherClientState, 4, fin4.id, 'failed')
        check(fin4.phase == P.Ended, 'client failure -> ended')
    end
    -- Busy victim cannot be grabbed twice.
    M.advance(5000, 50)
    local z5, z6 = makeZombie(4, vector3(100, 5, 30)), makeZombie(4, vector3(100, 6, 30))
    JJZ.Finisher.tryStart(z5, 4, nil, true)
    local ok2, why2 = JJZ.Finisher.tryStart(z6, 4, nil, true)
    check(not ok2 and why2 == 'reason_busy', 'second zombie cannot grab a busy victim', why2)
    noErrors('aborts')
end

-- ------------------------------------------------------------------ AI end to end
section('AI chase and grab')
reset()
do
    JJZ.Zombies.setFrozen(false)
    M.addPlayer(1, { pos = vector3(0, 0, 30), heading = 0 })
    local z = makeZombie(1, vector3(0, 9.0, 30), 'laeufer')
    -- The owner client sets health = HEALTH_BASE + type health, then reports the init.
    M.entities[z.ent].health = JJZ.Zombies.HEALTH_BASE + Config.Types.laeufer.Health
    M.fire(E.ZombieInit, 1, z.id)
    check(z.inited, 'owner init report accepted')
    M.advance(300, 50)
    check(z.target == 1 and (z.ai == S.Alerted or z.ai == S.Chase), 'zombie notices the player', z.ai)
    check(Entity(z.ent).state[JJZ.State.Target] == 1, 'target replicated via state bag')
    -- Simulate the owner client walking the zombie towards the player.
    local fin
    for _ = 1, 200 do
        local e = M.entities[z.ent]
        local d = e.pos - vector3(0, 0, 30)
        if #d > 0.9 and (z.ai == S.Chase or z.ai == S.Ready) then e.pos = e.pos - d / #d * 0.12 end
        M.advance(50, 50)
        fin = JJZ.Finisher.activeFor(1)
        if fin then break end
    end
    check(fin ~= nil, 'AI reaches the player and starts the finisher', z.ai)
    check(z.ai == S.Grab, 'zombie in grab state', z.ai)
    if fin then M.fire(E.FinisherClientState, 1, fin.id, 'failed') end
    noErrors('AI chase')
end

-- ------------------------------------------------------------------ permissions / rate limits
section('permissions')
reset()
do
    M.addPlayer(7, { pos = vector3(0, 0, 30), ace = false })
    M.commands[Config.Commands.Spawn](7, { '1' })
    check(lastSent(7, E.FindSpawn) == nil, 'no spawn without permission')
    check(lastSent(7, E.Notify) ~= nil, 'permission message sent')
    M.addPlayer(8, { pos = vector3(0, 0, 30) })
    local n = 0
    for _ = 1, 20 do M.commands[Config.Commands.Freeze](8, {}) end
    for _, s in ipairs(M.sentTo(8, E.Notify)) do if tostring(s.args[1]):find(L('rate_limited'), 1, true) then n = n + 1 end end
    check(n > 0, 'command spam rate limited', n)
    if JJZ.Zombies.isFrozen() then M.commands[Config.Commands.Freeze](8, {}) end
    noErrors('permissions')
end

-- ------------------------------------------------------------------ fuzz
section('fuzz all net handlers')
reset()
do
    M.addPlayer(1, { pos = vector3(0, 0, 30) })
    local z = makeZombie(1, vector3(0, 1.0, 30))
    JJZ.Finisher.tryStart(z, 1, nil, true)
    local rnd = JJZ.U.rng(4242)
    local junk = {
        function() return nil end, function() return 0 / 0 end, function() return math.huge end, function() return -1 end,
        function() return 2 ^ 53 end, function() return math.floor(rnd(-100, 100000)) end, function() return rnd(-1e6, 1e6) end,
        function() return string.rep('A', math.floor(rnd(0, 5000))) end, function() return true end,
        function() return {} end, function() return { 1, 2, 'x', {}, 0 / 0 } end,
        function() return { x = 'a', y = {}, z = 0 / 0 } end, function() local t = {}; for i = 1, 200 do t[i] = math.floor(rnd(0, 9000)) end; return t end,
        function() return setmetatable({}, { __index = function() error('trap') end }) end,
    }
    local names = {}
    for name in pairs(M.handlers) do if name:find('^jj_zombie:server:') then names[#names + 1] = name end end
    table.sort(names)
    local sources = { 1, 1, 1, 2, 99, -1, 0 }
    for i = 1, 4000 do
        local name = names[math.floor(rnd(1, #names + 0.999))]
        local src = sources[math.floor(rnd(1, #sources + 0.999))]
        local args = {}
        for a = 1, math.floor(rnd(0, 4.999)) do args[a] = junk[math.floor(rnd(1, #junk + 0.999))]() end
        M.fire(name, src, table.unpack(args, 1, 4))
        if i % 200 == 0 then M.advance(100, 50) end
    end
    local errs = M.errors or {}
    -- A handler indexing a hostile table with a throwing __index is the only accepted failure
    -- source (FXServer msgpack never produces such tables).
    local real = {}
    for _, e in ipairs(errs) do if not e:find('trap') then real[#real + 1] = e end end
    check(#real == 0, ('fuzz: %d handlers x 4000 calls without Lua errors'):format(#names), real[1])
    M.errors = nil
    M.print(('   fuzzed handlers: %s'):format(table.concat(names, ', ')))
end

M.print(('server tests: %d passed, %d failed'):format(passed, failed))
os.exit(failed == 0 and 0 or 1)
