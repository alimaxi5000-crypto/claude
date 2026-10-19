-- Server-authoritative finisher: start conditions, variant choice, phase timing, key press
-- validation, progress/decay, result, damage/stress/bite marker, aborts and watchdog.
-- The victim's client only plays the scenes it is told to play and reports key presses.
JJZ = JJZ or {}
local F = { byId = {}, byVictim = {}, count = 0 }
JJZ.Finisher = F

local U, Net, Own = JJZ.U, JJZ.Net, JJZ.Ownership
local S, ST, PS, P = JJZ.AiState, JJZ.State, JJZ.PlayerState, JJZ.FinPhase
local nextId = 0
local graceUntil = {}   -- src -> server time
local spaceOk = {}      -- src -> last reported grab space (true/false)

-- Hooks other resources/editable code may replace (e.g. stamina or stress based modifiers).
JJZ.Hooks = JJZ.Hooks or {}
JJZ.Hooks.struggleModifier = JJZ.Hooks.struggleModifier or function(src, fin) return 1.0 end

local FEMALE = GetHashKey('mp_f_freemode_01')

-- ------------------------------------------------------------------ helpers
local function now() return GetGameTimer() end

local function sceneVariant(name, gender, dir)
    local v = dir and ('d%d_%s'):format(dir, gender) or gender
    local e = Clips.entry(name, v)
    if not e and gender == 'f' then
        v = dir and ('d%d_m'):format(dir) or 'm'
        e = Clips.entry(name, v)
    end
    return e, v
end

local function eventAt(entry, name, default)
    return Clips.eventTime(entry, name) or default
end

-- Choose the grab variant: direction index from the victim's facing relative to the approach.
function F.chooseDirection(victimPos, victimHeading, zombiePos)
    local approach = U.headingOf(zombiePos.x - victimPos.x, zombiePos.y - victimPos.y)
    local alpha = U.angleDiff(victimHeading, approach)   -- victim yaw in the scene frame
    local k = math.floor((alpha / 45.0) + 0.5) % 8
    return k, alpha, approach
end

-- Conditions for a grab. Returns ok, reasonKey.
function F.canGrab(src, z, p)
    if not Config.Finisher.Enabled then return false, 'reason_zombie' end
    if F.byVictim[src] then return false, 'reason_busy' end
    if (graceUntil[src] or 0) > now() then return false, 'reason_grace' end
    if not p or not p.valid then return false, 'reason_down' end
    if p.inVehicle then return false, 'reason_vehicle' end
    if p.down or Integration.isDown(src) then return false, 'reason_down' end
    if Integration.isRestrained(src) then return false, 'reason_down' end
    if z.finId ~= 0 or z.ai == S.Dead or z.ai == S.Stunned or z.ai == S.Grab then return false, 'reason_zombie' end
    if not DoesEntityExist(z.ent) or IsPedRagdoll(z.ent) then return false, 'reason_zombie' end
    if z.bucket ~= p.bucket then return false, 'reason_zombie' end
    return true
end

local function setPhase(fin, phase)
    fin.phase = phase
    fin.phaseAt = now()
end

local function playerSnapshot(src)
    local ped = GetPlayerPed(src)
    if ped == 0 or not DoesEntityExist(ped) then return nil end
    return {
        valid = true, ped = ped, pos = GetEntityCoords(ped), bucket = GetPlayerRoutingBucket(src),
        inVehicle = GetVehiclePedIsIn(ped, false) ~= 0, down = false,
    }
end

-- ------------------------------------------------------------------ start
function F.tryStart(z, src, p, force)
    p = p or playerSnapshot(src)
    local ok, reason = F.canGrab(src, z, p)
    if not ok then return false, reason end
    -- No room for the paired scene: short swipe attack instead (see ARCHITECTURE.md).
    if spaceOk[src] == false and not force then
        if Config.Finisher.BlockedFallback == 'swipe' then JJZ.Damage.swipe(src, z) end
        graceUntil[src] = now() + 2500
        return false, 'reason_space'
    end
    local ped = p.ped or GetPlayerPed(src)
    local gender = GetEntityModel(ped) == FEMALE and 'f' or 'm'
    local dir, alpha = F.chooseDirection(p.pos, GetEntityHeading(ped), z.pos)
    local grab = sceneVariant('fin_grab', gender, dir)
    local lo = sceneVariant('fin_struggle_low', gender)
    local mid = sceneVariant('fin_struggle_mid', gender)
    local hi = sceneVariant('fin_struggle_high', gender)
    local shove = sceneVariant('fin_shove', gender)
    local bite = sceneVariant('fin_bite', gender)
    if not (grab and lo and mid and hi and shove and bite) then
        Integration.log('error', 'finisher clips missing in the registry (run the animation build)')
        return false, 'reason_zombie'
    end
    local t = Config.Types[z.type] or Config.Types.schlurfer
    nextId = nextId + 1
    local fin = {
        id = nextId, victim = src, z = z, zombieId = z.id, type = z.type,
        strength = math.max(0.2, t.GrabStrength or 1.0), gender = gender, dir = dir, alpha = alpha,
        victimPed = ped, createdAt = now(), phase = P.Starting, phaseAt = now(),
        entries = { grab = grab, low = lo, mid = mid, high = hi, shove = shove, bite = bite },
        progress = Config.Finisher.StartProgress, progressT = 0, lastSeq = 0, lastPressT = -1,
        intervals = {}, pressTimes = {}, suspect = false, clientConfirmed = false,
        sentProgress = -1, sentAt = 0,
    }
    fin.grabDur = grab.duration
    fin.maxDuration = (fin.grabDur + Config.Finisher.TimeLimitSeconds + math.max(shove.duration, bite.duration) + 5.0) * 1000
    F.byId[fin.id] = fin
    F.byVictim[src] = fin
    F.count = F.count + 1
    z.finId = fin.id
    JJZ.AiLogic.setAi(z, S.Grab, now())
    JJZ.Zombies.put(z, ST.Ai, S.Grab)
    JJZ.Zombies.put(z, ST.Fin, fin.id)
    -- The victim's client starts the networked synced scene that includes the zombie, which
    -- belongs to another client most of the time: allow remote synced scenes for its duration.
    SetEntityRemoteSyncedScenesAllowed(z.ent, true)
    Player(src).state:set(PS.Fin, fin.id, true)
    Integration.setInventoryBlocked(src, true)
    Integration.addStress(src, Config.Finisher.StressOnGrab, 'zombie_grab')
    setPhase(fin, P.Grab)
    fin.struggleAt = fin.createdAt + math.floor(fin.grabDur * 1000)
    TriggerClientEvent(JJZ.Events.FinisherStart, src, {
        finId = fin.id, zombieNet = z.id, zombieType = z.type, gender = gender, dir = dir, alpha = alpha,
        grab = grab.name .. ':' .. grab.variant,
        struggle = { low = lo.name .. ':' .. lo.variant, mid = mid.name .. ':' .. mid.variant, high = hi.name .. ':' .. hi.variant },
        shove = shove.name .. ':' .. shove.variant, bite = bite.name .. ':' .. bite.variant,
        startProgress = fin.progress, timeLimit = Config.Finisher.TimeLimitSeconds,
        thresholds = Config.Finisher.Difficulty,
    })
    if ConfigServer.Log.Finishers then
        Integration.log('info', ('finisher #%d: %s (%d) grabbed by %s zombie %d (dir %d, %s)'):format(
            fin.id, GetPlayerName(src) or '?', src, z.type, z.id, dir, gender))
    end
    return true
end

-- ------------------------------------------------------------------ progress model
local function decayTo(fin, tMs)
    if tMs <= fin.progressT then return end
    local dec = Config.Finisher.DecayPerSecond * (tMs - fin.progressT) / 1000.0
    fin.progress = math.max(0.0, fin.progress - dec)
    fin.progressT = tMs
end

local function pressValue(fin)
    return Config.Finisher.ProgressPerPress / fin.strength * (tonumber(JJZ.Hooks.struggleModifier(fin.victim, fin)) or 1.0)
end

-- Regularity check: autoclickers produce almost identical intervals.
local function tooRegular(fin)
    local w = ConfigServer.Input.RegularityWindow
    local n = #fin.intervals
    if n < w then return false end
    local sum, sq = 0, 0
    for i = n - w + 1, n do sum = sum + fin.intervals[i] end
    local mean = sum / w
    for i = n - w + 1, n do sq = sq + (fin.intervals[i] - mean) ^ 2 end
    return math.sqrt(sq / w) < ConfigServer.Input.RegularityStdDevMs
end

-- Validates one batch of presses. Returns number of presses counted.
function F.applyPresses(fin, seq, presses, serverElapsed)
    local cfg = ConfigServer.Input
    if not U.isInt(seq, 1, 100000) or seq <= fin.lastSeq then return 0 end
    if type(presses) ~= 'table' or #presses < 1 or #presses > cfg.MaxBatchSize then return 0 end
    fin.lastSeq = seq
    local counted = 0
    local limit = math.floor(Config.Finisher.TimeLimitSeconds * 1000)
    for i = 1, #presses do
        local t = presses[i]
        if not U.isInt(t, 0, limit + 1000) then return counted end
        if t <= fin.lastPressT then goto continue end                       -- duplicate / replay / out of order
        if t > serverElapsed + cfg.MaxClockSkewMs then goto continue end   -- claims a future press
        if t < serverElapsed - 2500 then goto continue end                 -- stale batch
        if t > limit then goto continue end                                -- after the time limit
        if fin.lastPressT >= 0 and t - fin.lastPressT < cfg.MinIntervalMs then
            fin.lastPressT = t
            goto continue
        end
        -- Sustained rate cap over the last second.
        do
            local times = fin.pressTimes
            local cut = t - 1000
            local j = 1
            for k = 1, #times do if times[k] > cut then times[j] = times[k]; j = j + 1 end end
            for k = j, #times do times[k] = nil end
            if #times >= cfg.MaxPressesPerSecond then fin.lastPressT = t; goto continue end
            times[#times + 1] = t
        end
        if fin.lastPressT >= 0 then
            fin.intervals[#fin.intervals + 1] = t - fin.lastPressT
            if #fin.intervals > 64 then table.remove(fin.intervals, 1) end
        end
        fin.lastPressT = t
        if not fin.suspect and tooRegular(fin) then
            fin.suspect = true
            Net.suspicious(fin.victim, 'machine-like key press intervals in finisher')
        end
        if not fin.suspect or ConfigServer.Input.OnSuspicious == 'log' then
            decayTo(fin, t)
            fin.progress = math.min(100.0, fin.progress + pressValue(fin))
            counted = counted + 1
            if fin.progress >= 100.0 then fin.wonAt = t; return counted end
        end
        ::continue::
    end
    return counted
end

RegisterNetEvent(JJZ.Events.StruggleInput, function(finId, seq, presses)
    local src = source
    if not U.isInt(finId, 1, 2 ^ 31) then return end
    local fin = F.byVictim[src]
    if not fin or fin.id ~= finId or fin.phase ~= P.Struggle then return end
    if not Net.allow('Input', src) then return end
    F.applyPresses(fin, seq, presses, now() - fin.struggleAt)
end)

-- Grab space around the player (reported while a zombie targets them).
RegisterNetEvent(JJZ.Events.SpaceReport, function(ok)
    local src = source
    if type(ok) ~= 'boolean' or not Net.allow('Reports', src) then return end
    spaceOk[src] = ok
end)

-- Victim client confirms that the scene runs (watchdog for crashed/blocked clients).
RegisterNetEvent(JJZ.Events.FinisherClientState, function(finId, phase)
    local src = source
    if not U.isInt(finId, 1, 2 ^ 31) or not U.isStr(phase, 16) or not Net.allow('Reports', src) then return end
    local fin = F.byVictim[src]
    if not fin or fin.id ~= finId then return end
    if phase == 'grab' then fin.clientConfirmed = true end
    if phase == 'failed' then F.finish(fin, JJZ.Results.Aborted, 'client could not start the scene') end
end)

-- ------------------------------------------------------------------ results
local function sendProgress(fin, t)
    local p = math.floor(fin.progress + 0.5)
    if p == fin.sentProgress and t - fin.sentAt < 1000 then return end
    if t - fin.sentAt < 100 then return end
    fin.sentProgress, fin.sentAt = p, t
    TriggerClientEvent(JJZ.Events.FinisherProgress, fin.victim, fin.id, p,
        math.max(0, math.floor(Config.Finisher.TimeLimitSeconds * 1000) - (now() - fin.struggleAt)))
end

local function startResult(fin, result)
    local z = fin.z
    local entry = result == JJZ.Results.Success and fin.entries.shove or fin.entries.bite
    setPhase(fin, result == JJZ.Results.Success and P.Success or P.Bite)
    fin.result = result
    fin.resultEntry = entry
    fin.endAt = now() + math.floor(entry.duration * 1000)
    TriggerClientEvent(JJZ.Events.FinisherResult, fin.victim, fin.id, result, {
        damage = result == JJZ.Results.Bite and math.floor(Config.Finisher.BiteDamage * ((Config.Types[fin.type] or {}).BiteDamageMult or 1.0)) or 0,
    })
    -- Arm the zombie's knock-back at the clip's "impact" event on whoever owns the zombie.
    fin.impactArmedOwner = Own.ownerOf(z.ent)
    Own.sendToOwner(z, JJZ.Events.ZombieImpact, z.id, fin.id, entry.name .. ':' .. entry.variant)
    if result == JJZ.Results.Bite then
        fin.biteAt = now() + math.floor(eventAt(entry, 'bite', 0.9) * 1000)
    end
    if ConfigServer.Log.Finishers then
        Integration.log('info', ('finisher #%d result: %s (progress %.0f, presses %d)'):format(fin.id, result, fin.progress, #fin.intervals + 1))
    end
end

-- End a finisher and restore everything. Safe to call more than once.
function F.finish(fin, result, why)
    if fin.phase == P.Ended then return end
    local prev = fin.phase
    setPhase(fin, P.Ended)
    F.byId[fin.id] = nil
    if F.byVictim[fin.victim] == fin then F.byVictim[fin.victim] = nil end
    F.count = F.count - 1
    graceUntil[fin.victim] = now() + math.floor(Config.Finisher.GraceSeconds * 1000)
    local z = fin.z
    if z and JJZ.Zombies.get(z.id) then
        z.finId = 0
        JJZ.Zombies.put(z, ST.Fin, 0)
        if DoesEntityExist(z.ent) then SetEntityRemoteSyncedScenesAllowed(z.ent, false) end
        if z.ai == S.Grab then
            local stun = (result == JJZ.Results.Aborted) and 1.0 or Config.Finisher.StunSeconds
            z.stunUntil = now() + math.floor(stun * 1000)
            JJZ.AiLogic.setAi(z, S.Stunned, now())
            JJZ.Zombies.put(z, ST.Ai, S.Stunned)
            JJZ.Zombies.put(z, ST.StunUntil, z.stunUntil)
        end
    end
    if DoesPlayerExist(fin.victim) then
        Player(fin.victim).state:set(PS.Fin, 0, true)
        Integration.setInventoryBlocked(fin.victim, false)
        if result == JJZ.Results.Aborted then
            TriggerClientEvent(JJZ.Events.FinisherAbort, fin.victim, fin.id, why or 'aborted')
        end
    end
    TriggerEvent(JJZ.LocalEvents.FinisherEnded, fin.victim, result, { id = fin.id, zombieType = fin.type, phase = prev, why = why })
    if ConfigServer.Log.Finishers and result == JJZ.Results.Aborted then
        Integration.log('info', ('finisher #%d aborted in %s: %s'):format(fin.id, prev, tostring(why)))
    end
end

-- ------------------------------------------------------------------ tick
local function tickFinisher(fin, t)
    local src = fin.victim
    if not DoesPlayerExist(src) then return F.finish(fin, JJZ.Results.Aborted, 'victim left') end
    local ped = GetPlayerPed(src)
    if ped == 0 or ped ~= fin.victimPed then return F.finish(fin, JJZ.Results.Aborted, 'victim ped changed') end
    local z = fin.z
    if not z or not JJZ.Zombies.get(z.id) or not DoesEntityExist(z.ent) then return F.finish(fin, JJZ.Results.Aborted, 'zombie gone') end
    if t - fin.createdAt > fin.maxDuration then return F.finish(fin, JJZ.Results.Aborted, 'watchdog') end
    if fin.phase ~= P.Bite and fin.phase ~= P.Success and Integration.isDown(src) then
        return F.finish(fin, JJZ.Results.Aborted, 'victim down')
    end
    if not fin.clientConfirmed and t - fin.createdAt > 3500 then
        return F.finish(fin, JJZ.Results.Aborted, 'victim client did not start the scene')
    end
    -- Re-arm the impact if the zombie changed owner during the result phase.
    if (fin.phase == P.Success or fin.phase == P.Bite) then
        local o = Own.ownerOf(z.ent)
        if o and o ~= fin.impactArmedOwner then
            fin.impactArmedOwner = o
            TriggerClientEvent(JJZ.Events.ZombieImpact, o, z.id, fin.id, fin.resultEntry.name .. ':' .. fin.resultEntry.variant)
        end
    end
    if fin.phase == P.Grab and t >= fin.struggleAt then
        setPhase(fin, P.Struggle)
        fin.progressT = 0
    end
    if fin.phase == P.Struggle then
        local elapsed = t - fin.struggleAt
        if fin.wonAt then return startResult(fin, JJZ.Results.Success) end
        local limit = math.floor(Config.Finisher.TimeLimitSeconds * 1000)
        decayTo(fin, math.min(elapsed, limit))
        -- Network grace: the victim's clock starts ~half a round trip later than ours.
        local grace = 150 + math.min(400, GetPlayerPing(src) or 0)
        if elapsed >= limit + grace then return startResult(fin, JJZ.Results.Bite) end
        sendProgress(fin, t)
    elseif fin.phase == P.Bite then
        if fin.biteAt and t >= fin.biteAt then
            fin.biteAt = nil
            JJZ.Damage.bite(src, fin)
        end
        if t >= fin.endAt then F.finish(fin, JJZ.Results.Bite) end
    elseif fin.phase == P.Success then
        if t >= fin.endAt then F.finish(fin, JJZ.Results.Success) end
    end
end

CreateThread(function()
    while true do
        if F.count == 0 then
            Wait(500)
        else
            local t = now()
            for _, fin in pairs(F.byId) do tickFinisher(fin, t) end
            Wait(50)
        end
    end
end)

-- ------------------------------------------------------------------ API
function F.activeFor(src) return F.byVictim[src] end

function F.onZombieGone(z, reason)
    local fin = z.finId and F.byId[z.finId]
    if fin then F.finish(fin, JJZ.Results.Aborted, 'zombie ' .. tostring(reason)) end
end

-- /zfinisher: start with the nearest zombie (ignores the AI state machine, keeps all safety checks).
function F.forceStart(src)
    local p = playerSnapshot(src)
    if not p then return end
    local best, bestD = nil, 4.0
    for _, z in pairs(JJZ.Zombies.byId) do
        if z.ai ~= S.Dead and z.finId == 0 and z.pos then
            local d = #(z.pos - p.pos)
            if d < bestD then best, bestD = z, d end
        end
    end
    if not best then return Net.notify(src, 'finisher_no_zombie', 4.0) end
    graceUntil[src] = 0
    if best.ai == S.Stunned then best.stunUntil = 0 end
    if best.ai ~= S.Ready then JJZ.AiLogic.setAi(best, S.Ready, now()) end
    best.target = src
    local ok, reason = F.tryStart(best, src, p, true)
    if not ok then Net.notify(src, 'finisher_busy', L(reason or 'reason_zombie')) end
end

AddEventHandler('playerDropped', function()
    local src = source
    local fin = F.byVictim[src]
    if fin then F.finish(fin, JJZ.Results.Aborted, 'victim left') end
    graceUntil[src] = nil
    spaceOk[src] = nil
    Integration.clearPlayer(src)
    Net.clearPlayer(src)
end)

AddEventHandler('onResourceStop', function(res)
    if res ~= GetCurrentResourceName() then return end
    for _, fin in pairs(F.byId) do
        if DoesPlayerExist(fin.victim) then
            Player(fin.victim).state:set(PS.Fin, 0, true)
            Integration.setInventoryBlocked(fin.victim, false)
        end
    end
end)

exports('isInFinisher', function(src) return F.byVictim[tonumber(src)] ~= nil end)
