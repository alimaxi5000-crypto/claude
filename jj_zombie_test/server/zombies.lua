-- Server zombie manager: spawning (with client-found, server-validated spawn points),
-- registry, state bags, one AI tick thread, limits, lifetime/corpse cleanup.
JJZ = JJZ or {}
local Z = { byId = {}, count = 0 }
JJZ.Zombies = Z

local U, Net, Own, AI = JJZ.U, JJZ.Net, JJZ.Ownership, JJZ.AiLogic
local S, ST = JJZ.AiState, JJZ.State

-- Health model: the ped carries HEALTH_BASE extra health so body shots never trigger the game's
-- own death. Logical health = health - HEALTH_BASE; at <= 0 the owner plays a custom death clip
-- and then kills the ped. Headshots (critical hits) still kill instantly with a ragdoll.
Z.HEALTH_BASE = 1000

local pendingSpawn = {}  -- src -> { reqId, count, types, expires, origin, heading }
local reqCounter = 0
local frozen = false
local defaultType = {}   -- src -> type for /zspawn without argument

-- ------------------------------------------------------------------ state bags
local function put(z, key, value)
    z.sb = z.sb or {}
    if z.sb[key] == value then return end
    z.sb[key] = value
    if DoesEntityExist(z.ent) then Entity(z.ent).state:set(key, value, true) end
end
Z.put = put

local function countFor(src)
    local n = 0
    for _, z in pairs(Z.byId) do if z.spawner == src and z.ai ~= S.Dead then n = n + 1 end end
    return n
end
local function countAlive()
    local n = 0
    for _, z in pairs(Z.byId) do if z.ai ~= S.Dead then n = n + 1 end end
    return n
end

-- ------------------------------------------------------------------ create / remove
local function pickType(arg)
    if arg == 'schlurfer' or arg == 'laeufer' then return arg end
    return math.random() < 0.5 and 'schlurfer' or 'laeufer'
end

function Z.create(spawner, pos, heading, ztype, bucket)
    local model = GetHashKey(Config.Spawn.Model)
    local ent = CreatePed(4, model, pos.x, pos.y, pos.z, heading, true, true)
    local deadline = GetGameTimer() + 2000
    while not DoesEntityExist(ent) and GetGameTimer() < deadline do Wait(0) end
    if not DoesEntityExist(ent) then return nil end
    SetEntityOrphanMode(ent, 2)
    SetEntityRoutingBucket(ent, bucket or 0)
    local id = NetworkGetNetworkIdFromEntity(ent)
    local now = GetGameTimer()
    local z = {
        id = id, ent = ent, type = ztype, spawner = spawner, spawnedAt = now,
        seed = math.random(1, 2147483646), bucket = bucket or 0,
        ai = S.Idle, aiSince = now, target = 0, slot = 0, speed = 'walk',
        finId = 0, stunUntil = 0, unstuck = 0, pos = pos, inited = false,
        home = pos,
    }
    Z.byId[id] = z
    Z.count = Z.count + 1
    put(z, ST.IsZombie, true)
    put(z, ST.Type, ztype)
    put(z, ST.Seed, z.seed)
    put(z, ST.Spawner, spawner)
    put(z, ST.Ai, z.ai)
    put(z, ST.Target, 0)
    put(z, ST.Fin, 0)
    put(z, ST.Speed, z.speed)
    put(z, ST.Slot, 0)
    put(z, ST.Unstuck, 0)
    put(z, ST.Init, false)
    put(z, ST.StunUntil, 0)
    Entity(ent).state:set(ST.Home, vector3(pos.x, pos.y, pos.z), true)
    return z
end

function Z.remove(z, reason)
    if not z or not Z.byId[z.id] then return end
    if JJZ.Finisher then JJZ.Finisher.onZombieGone(z, reason) end
    Z.byId[z.id] = nil
    Z.count = Z.count - 1
    if DoesEntityExist(z.ent) then DeleteEntity(z.ent) end
end

function Z.get(id) return Z.byId[id] end

function Z.fromEntity(ent)
    if not ent or ent == 0 then return nil end
    return Z.byId[NetworkGetNetworkIdFromEntity(ent)]
end

-- Remove / kill helpers for commands. scope: 'own' or 'all'.
function Z.clear(src, scope)
    local n = 0
    for _, z in pairs(Z.byId) do
        if scope == 'all' or z.spawner == src then Z.remove(z, 'cleared'); n = n + 1 end
    end
    return n
end

function Z.kill(src, scope)
    local n = 0
    for _, z in pairs(Z.byId) do
        if (scope == 'all' or z.spawner == src) and z.ai ~= S.Dead then
            if not Own.sendToOwner(z, JJZ.Events.ZombieCmd, z.id, 'kill') then
                Z.setDead(z, GetGameTimer())
            end
            n = n + 1
        end
    end
    return n
end

function Z.setDead(z, now)
    if z.ai == S.Dead then return end
    if JJZ.Finisher then JJZ.Finisher.onZombieGone(z, 'dead') end
    AI.setAi(z, S.Dead, now)
    z.deadAt = now
    z.target = 0
    put(z, ST.Ai, S.Dead)
    put(z, ST.Target, 0)
end

function Z.setFrozen(on)
    frozen = on
    GlobalState[ST.Frozen] = on
end
function Z.isFrozen() return frozen end

function Z.setDefaultType(src, t) defaultType[src] = t end

-- ------------------------------------------------------------------ spawning
-- Step 1: validate the request and ask the requester's client for safe points (ground, navmesh,
-- line of sight and water checks need client natives).
function Z.requestSpawn(src, count, typeArg)
    count = math.max(1, math.min(Config.Spawn.MaxPerCommand, math.floor(count or 1)))
    local perPlayer = Config.Spawn.MaxPerPlayer - countFor(src)
    if perPlayer <= 0 then return Net.notify(src, 'spawn_limit_player', Config.Spawn.MaxPerPlayer) end
    local global = Config.Spawn.MaxGlobal - countAlive()
    if global <= 0 then return Net.notify(src, 'spawn_limit_global', Config.Spawn.MaxGlobal) end
    count = math.min(count, perPlayer, global)
    local tArg = typeArg or defaultType[src] or Config.DefaultType
    if tArg ~= 'schlurfer' and tArg ~= 'laeufer' and tArg ~= 'mixed' then return Net.notify(src, 'spawn_bad_type') end
    local types = {}
    for i = 1, count do types[i] = pickType(tArg ~= 'mixed' and tArg or nil) end
    if tArg == 'mixed' and count >= 2 then types[1], types[2] = 'schlurfer', 'laeufer' end
    reqCounter = reqCounter + 1
    local ped = GetPlayerPed(src)
    pendingSpawn[src] = {
        reqId = reqCounter, count = count, types = types, expires = GetGameTimer() + 6000,
        origin = GetEntityCoords(ped), bucket = GetPlayerRoutingBucket(src),
    }
    TriggerClientEvent(JJZ.Events.FindSpawn, src, reqCounter, count, {
        min = Config.Spawn.DistanceMin, max = Config.Spawn.DistanceMax,
        spread = Config.Spawn.SpreadDegrees, spacing = Config.Spawn.MinSpacing,
    })
end

-- Step 2: points from the client. Each point is checked against the server's view of the
-- requester's position; nothing is spawned for points outside the allowed ring.
RegisterNetEvent(JJZ.Events.SpawnPoints, function(reqId, points)
    local src = source
    local req = pendingSpawn[src]
    pendingSpawn[src] = nil
    if not req or not Net.validPlayer(src) then return end
    if reqId ~= req.reqId or GetGameTimer() > req.expires then return end
    if type(points) ~= 'table' then return end
    local origin = GetEntityCoords(GetPlayerPed(src))
    if #(origin - req.origin) > 6.0 then origin = req.origin end
    local accepted = {}
    for i = 1, math.min(#points, req.count) do
        local p = points[i]
        if type(p) == 'table' and U.isNum(p.x, -20000, 20000) and U.isNum(p.y, -20000, 20000) and U.isNum(p.z, -500, 3000) then
            local v = vector3(p.x, p.y, p.z)
            local flat = AI.dist2d(v, origin)
            local ok = flat >= Config.Spawn.DistanceMin - 2.0 and flat <= Config.Spawn.DistanceMax + 3.0 and math.abs(v.z - origin.z) <= 12.0
            for _, a in ipairs(accepted) do if #(a - v) < Config.Spawn.MinSpacing * 0.8 then ok = false end end
            if ok then accepted[#accepted + 1] = v end
        end
    end
    if #accepted == 0 then return Net.notify(src, 'spawn_none') end
    local made, typeCount = 0, {}
    for i, v in ipairs(accepted) do
        local heading = U.headingOf(origin.x - v.x, origin.y - v.y)
        local z = Z.create(src, v, heading, req.types[i] or 'schlurfer', req.bucket)
        if z then
            made = made + 1
            typeCount[z.type] = (typeCount[z.type] or 0) + 1
        end
    end
    local desc = {}
    for t, n in pairs(typeCount) do desc[#desc + 1] = ('%dx %s'):format(n, t) end
    table.sort(desc)
    Net.notify(src, 'spawned', made, table.concat(desc, ', '))
end)

-- Owner applied the initial setup (health etc.). Only the current owner may report it.
RegisterNetEvent(JJZ.Events.ZombieInit, function(netId)
    local src = source
    if not U.isInt(netId, 0, 65535) or not Net.allow('Reports', src) then return end
    local z = Z.byId[netId]
    if not z or z.inited or not Own.isOwner(src, z.ent) then return end
    z.inited = true
    put(z, ST.Init, true)
end)

-- ------------------------------------------------------------------ tick
local function snapshotPlayers()
    local players = {}
    for _, s in ipairs(GetPlayers()) do
        local src = tonumber(s)
        local ped = src and GetPlayerPed(src) or 0
        if ped ~= 0 and DoesEntityExist(ped) then
            players[src] = {
                src = src, ped = ped, valid = true, pos = GetEntityCoords(ped),
                bucket = GetPlayerRoutingBucket(src),
                inVehicle = GetVehiclePedIsIn(ped, false) ~= 0,
                finActive = JJZ.Finisher and JJZ.Finisher.activeFor(src) ~= nil or false,
            }
        end
    end
    return players
end

-- Down state is only queried for players close to a zombie (it may call into jj_health).
local function markDown(players)
    local radius = Config.AI.LoseTargetRadius + 5.0
    for src, p in pairs(players) do
        local near = false
        for _, z in pairs(Z.byId) do
            if z.ai ~= S.Dead and z.pos and #(z.pos - p.pos) < radius then near = true; break end
        end
        p.down = near and Integration.isDown(src) or false
    end
end

local function tick(now)
    local players = snapshotPlayers()
    markDown(players)
    local lifetime = Config.Spawn.LifetimeMinutes * 60000
    local corpse = Config.Spawn.CorpseSeconds * 1000
    local urgent = false
    for id, z in pairs(Z.byId) do
        if not DoesEntityExist(z.ent) then
            Z.byId[id] = nil
            Z.count = Z.count - 1
            if JJZ.Finisher then JJZ.Finisher.onZombieGone(z, 'gone') end
        else
            z.pos = GetEntityCoords(z.ent)
            Own.update(z)
            if z.ai ~= S.Dead then
                local hp = GetEntityHealth(z.ent)
                if hp <= 0 or (z.inited and hp <= Z.HEALTH_BASE) then Z.setDead(z, now) end
            end
            if z.ai == S.Dead then
                if now - (z.deadAt or now) > corpse then Z.remove(z, 'corpse') end
            elseif now - z.spawnedAt > lifetime and z.finId == 0 then
                Z.remove(z, 'lifetime')
            end
        end
    end
    local primaries = AI.primaries(Z.byId, players)
    AI.assignSlots(Z.byId)
    local ctx = { now = now, cfg = Config.AI, types = Config.Types, players = players, primaries = primaries, frozen = frozen }
    for _, z in pairs(Z.byId) do
        if z.ai ~= S.Dead then
            local action = AI.step(z, ctx)
            if action and action.kind == 'grab' and JJZ.Finisher then
                JJZ.Finisher.tryStart(z, action.target, players[action.target])
            end
            put(z, ST.Ai, z.ai)
            put(z, ST.Target, z.target)
            put(z, ST.Speed, z.speed)
            put(z, ST.Slot, z.slot or 0)
            put(z, ST.Unstuck, z.unstuck or 0)
            if (z.ai == S.Ready or z.ai == S.Chase or z.ai == S.Hold) and z.target ~= 0 then
                local p = players[z.target]
                if p and #(z.pos - p.pos) < Config.AI.AttackReadyDistance + 3.0 then urgent = true end
            end
        end
    end
    return urgent
end

CreateThread(function()
    while true do
        if Z.count == 0 then
            Wait(1000)
        else
            local urgent = tick(GetGameTimer())
            Wait(urgent and 100 or 250)
        end
    end
end)

-- ------------------------------------------------------------------ lifecycle
AddEventHandler('playerDropped', function()
    local src = source
    pendingSpawn[src] = nil
    defaultType[src] = nil
    for _, z in pairs(Z.byId) do
        if z.spawner == src then Z.remove(z, 'spawner left') end
    end
end)

AddEventHandler('onResourceStop', function(res)
    if res ~= GetCurrentResourceName() then return end
    for _, z in pairs(Z.byId) do
        if DoesEntityExist(z.ent) then DeleteEntity(z.ent) end
    end
    Z.byId = {}
    Z.count = 0
    GlobalState[ST.Frozen] = false
end)

-- Leftovers from a crashed previous run (KeepEntity peds survive a resource restart only if
-- onResourceStop did not run): remove every ped still flagged as a test zombie.
CreateThread(function()
    Wait(1000)
    local n = 0
    for _, ped in ipairs(GetAllPeds()) do
        if DoesEntityExist(ped) and Entity(ped).state[ST.IsZombie] and not Z.fromEntity(ped) then
            DeleteEntity(ped)
            n = n + 1
        end
    end
    if n > 0 then print(('[jj_zombie] removed %d leftover zombie(s)'):format(n)) end
end)

-- Statistics for debugging/benchmarks.
function Z.stats()
    local byAi = {}
    for _, z in pairs(Z.byId) do byAi[z.ai] = (byAi[z.ai] or 0) + 1 end
    return { count = Z.count, byAi = byAi }
end
