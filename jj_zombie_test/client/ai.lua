-- Client zombie manager (one thread for everything):
--  * discovers zombies in scope (ped pool + state bag flag)
--  * visual setup for every client (movement clips, decals)
--  * owner-side AI execution: only the client that OWNS a zombie (OneSync) drives it, so
--    there is never a second AI. State, target, speed and slot come from server state bags.
--  * hit reactions, headshots, custom death sequence (owner)
--  * spawn point search for /zspawn (requester)
-- Idle cost: one pool scan every 1.5 s when no zombie exists.
ZAI = { list = {} }   -- ent -> info

local ST, S = JJZ.State, JJZ.AiState
local U = JJZ.U
local HEALTH_BASE = 1000
local HEAD_BONES = { [31086] = true, [39317] = true, [12844] = true } -- SKEL_Head, SKEL_Neck_1, IK_Head

local function ownsIt(ent)
    return NetworkGetEntityOwner(ent) == PlayerId()
end

local function stateOf(ent)
    return Entity(ent).state
end

local function targetPed(st)
    local sid = st[ST.Target]
    if type(sid) ~= 'number' or sid <= 0 then return 0 end
    local pl = GetPlayerFromServerId(sid)
    if pl == -1 then return 0 end
    return GetPlayerPed(pl)
end
ZAI.targetPed = targetPed

-- ------------------------------------------------------------------ discovery
local function scan()
    for _, ped in ipairs(GetGamePool('CPed')) do
        if not ZAI.list[ped] and not IsPedAPlayer(ped) and NetworkGetEntityIsNetworked(ped) then
            local st = Entity(ped).state
            if st[ST.IsZombie] then
                ZAI.list[ped] = {
                    ent = ped, netId = NetworkGetNetworkIdFromEntity(ped), type = st[ST.Type] or 'schlurfer',
                    seed = st[ST.Seed] or 1, visual = false, mode = nil, lastHp = nil,
                    unstuckSeen = st[ST.Unstuck] or 0, ownedSetup = false,
                }
            end
        end
    end
    for ped, info in pairs(ZAI.list) do
        if not DoesEntityExist(ped) then ZAI.list[ped] = nil end
    end
end

-- ------------------------------------------------------------------ owner setup
local function ownerSetup(ent, info, st)
    SetBlockingOfNonTemporaryEvents(ent, true)
    SetPedFleeAttributes(ent, 0, false)
    SetPedConfigFlag(ent, 17, true)   -- BlockNonTemporaryEvents
    SetPedConfigFlag(ent, 39, true)   -- DisableEvasiveDives
    SetPedConfigFlag(ent, 118, false) -- RunFromFiresAndExplosions
    SetPedConfigFlag(ent, 122, true)  -- DisableMelee (grabs are handled by the finisher)
    SetPedConfigFlag(ent, 169, true)  -- PreventAllMeleeTaunts
    SetPedConfigFlag(ent, 188, true)  -- DisableHurt
    SetPedConfigFlag(ent, 208, true)  -- DisableExplosionReactions
    SetPedConfigFlag(ent, 281, true)  -- DisableGoToWritheWhenInjured
    SetPedConfigFlag(ent, 294, true)  -- DisableShockingEvents
    SetPedSuffersCriticalHits(ent, true)
    SetPedCanPlayAmbientAnims(ent, false)
    SetPedPathCanUseClimbovers(ent, true)
    SetPedPathCanUseLadders(ent, false)
    SetPedPathAvoidFire(ent, true)
    StopPedSpeaking(ent, true)
    SetPedKeepTask(ent, true)
    if not st[ST.Init] then
        local t = Config.Types[info.type] or Config.Types.schlurfer
        SetPedRandomComponentVariation(ent, 0)
        SetEntityMaxHealth(ent, HEALTH_BASE + t.Health + 100)
        SetEntityHealth(ent, HEALTH_BASE + t.Health)
        TriggerServerEvent(JJZ.Events.ZombieInit, info.netId)
    end
    info.ownedSetup = true
    info.mode = nil
    info.lastHp = GetEntityHealth(ent)
end

-- ------------------------------------------------------------------ damage & death (owner)
local function playOnce(ent, name, flags, blendIn)
    local dict, clip = Anim.play(ent, name, nil, { flags = flags, blendIn = blendIn })
    return dict, clip
end

function ZAI.startDeath(ent, info, headshot)
    if info.dying then return end
    info.dying = true
    if headshot then
        SetEntityHealth(ent, 0)
        return
    end
    local variant = (info.seed % 2 == 0) and 'zreact_death_a' or 'zreact_death_b'
    local dict, clip, entry = Clips.single(variant)
    if not dict then SetEntityHealth(ent, 0) return end
    ClearPedTasks(ent)
    playOnce(ent, variant, 2, 6.0) -- AF_HOLD_LAST_FRAME
    local dur = (entry.duration or 1.2) * 1000
    CreateThread(function()
        local t0 = GetGameTimer()
        while GetGameTimer() - t0 < dur and DoesEntityExist(ent) do Wait(50) end
        if DoesEntityExist(ent) and ownsIt(ent) then
            SetEntityHealth(ent, 0)
        end
    end)
end

local function hitReaction(ent, info, tped, damage, bone)
    if info.dying then return end
    local now = GetGameTimer()
    if now - (info.lastHitAnim or 0) < 450 then return end
    info.lastHitAnim = now
    -- Front or back: compare the zombie's facing with the direction to its target.
    local fromFront = true
    if tped ~= 0 then
        local zp, tp = GetEntityCoords(ent), GetEntityCoords(tped)
        local toT = U.headingOf(tp.x - zp.x, tp.y - zp.y)
        fromFront = math.abs(U.angleDiff(toT, GetEntityHeading(ent))) < 90.0
    end
    local heavy = damage >= 40
    local name = heavy and (fromFront and 'zreact_stagger_front' or 'zreact_stagger_back')
        or (fromFront and 'zreact_hit_front' or 'zreact_hit_back')
    -- Light hits are upper-body overlays, heavy hits interrupt the movement.
    local flags = heavy and 0 or (16 | 32)
    playOnce(ent, name, flags, 8.0)
    if heavy then info.mode = nil; info.resumeAt = now + 700 end
end

local function checkHealth(ent, info, st, tped)
    local hp = GetEntityHealth(ent)
    local last = info.lastHp or hp
    info.lastHp = hp
    if info.dying or not st[ST.Init] then return end
    if hp < last then
        local ok, bone = GetPedLastDamageBone(ent)
        local headshot = ok and HEAD_BONES[bone] == true
        if headshot or hp <= HEALTH_BASE then
            ZAI.startDeath(ent, info, headshot)
            return
        end
        if st[ST.Ai] ~= S.Grab then hitReaction(ent, info, tped, last - hp, bone) end
    elseif hp <= HEALTH_BASE and hp > 0 then
        ZAI.startDeath(ent, info, false)
    end
end

-- ------------------------------------------------------------------ movement execution (owner)
local NAV_FLAGS = 1 | 4 -- no stopping, go as far as possible if the navmesh is not loaded

local function slotPoint(tpos, slotDeg, dist)
    local r = math.rad(slotDeg)
    return vector3(tpos.x - math.sin(r) * dist, tpos.y + math.cos(r) * dist, tpos.z)
end

local function navigate(ent, info, goal, speed, stopRadius, mode)
    local now = GetGameTimer()
    local status = GetScriptTaskStatus(ent, `SCRIPT_TASK_FOLLOW_NAV_MESH_TO_COORD`)
    local moved = not info.lastGoal or #(goal - info.lastGoal) > 1.0
    if info.mode ~= mode or moved or status == 7 or now - (info.lastNav or 0) > 4000 then
        if now - (info.lastNav or 0) < 350 and info.mode == mode then return end
        TaskFollowNavMeshToCoord(ent, goal.x, goal.y, goal.z, speed, -1, stopRadius, NAV_FLAGS, 0.0)
        info.lastGoal, info.lastNav, info.mode = goal, now, mode
    end
end

local function unstuck(ent, info, tped, n)
    local zp = GetEntityCoords(ent)
    local tp = tped ~= 0 and GetEntityCoords(tped) or zp
    local dir = tp - zp
    local len = #dir
    if len < 0.01 then return end
    dir = dir / len
    local side = vector3(-dir.y, dir.x, 0.0) * ((n % 2 == 0) and 1.6 or -1.6)
    local step = n % 3
    if step == 1 then
        local p = zp + side
        TaskGoStraightToCoord(ent, p.x, p.y, p.z, 1.0, 1500, GetEntityHeading(ent), 0.0)
    else
        local probe = zp + dir * 3.0 + side
        local ok, safe = GetSafeCoordForPed(probe.x, probe.y, probe.z, false, 8)
        if ok then
            if step == 0 then
                SetEntityCoords(ent, safe.x, safe.y, safe.z, false, false, false, false)
            else
                TaskFollowNavMeshToCoord(ent, safe.x, safe.y, safe.z, 2.0, -1, 0.5, NAV_FLAGS, 0.0)
            end
        end
    end
    info.mode = 'unstuck'
    info.resumeAt = GetGameTimer() + 1200
end

local function runOwnerAi(ent, info, st)
    local tped = targetPed(st)
    checkHealth(ent, info, st, tped)
    if info.dying or IsPedDeadOrDying(ent, true) then return end
    local ai = st[ST.Ai]
    local now = GetGameTimer()
    if GlobalState[ST.Frozen] then
        if info.mode ~= 'frozen' then ClearPedTasks(ent); TaskStandStill(ent, -1); info.mode = 'frozen' end
        return
    end
    -- In a finisher the paired scene drives the zombie: never issue own tasks (they would pull it
    -- out of the scene). The 'hold' command already stopped walking and the reach overlay.
    if (st[ST.Fin] or 0) ~= 0 or info.holdFin then
        if info.mode == 'lunge' then ClearPedSecondaryTask(ent) end
        info.mode = 'grab'
        return
    end
    if info.resumeAt and now < info.resumeAt then return end
    if ai == S.Grab or ai == S.Stunned or ai == S.Dead then
        if info.mode == 'lunge' then ClearPedSecondaryTask(ent) end
        info.mode = ai
        return
    end
    local un = st[ST.Unstuck] or 0
    if un > info.unstuckSeen then
        info.unstuckSeen = un
        unstuck(ent, info, tped, un)
        return
    end
    if ai == S.Idle or tped == 0 then
        if info.mode ~= 'idle' then
            local home = st[ST.Home] or GetEntityCoords(ent)
            TaskWanderInArea(ent, home.x, home.y, home.z, 6.0, 2, 4.0)
            info.mode = 'idle'
        end
        return
    end
    local zp, tp = GetEntityCoords(ent), GetEntityCoords(tped)
    local dist = #(zp - tp)
    local run = st[ST.Speed] == 'run'
    if ai == S.Alerted then
        if info.mode ~= 'alerted' then
            ClearPedTasks(ent)
            TaskTurnPedToFaceEntity(ent, tped, 800)
            CreateThread(function()
                Wait(350)
                if DoesEntityExist(ent) and ownsIt(ent) then playOnce(ent, 'zmove_alert_roar', 0, 4.0) end
            end)
            info.mode = 'alerted'
        end
        return
    end
    if ai == S.Hold then
        local goal = slotPoint(tp, st[ST.Slot] or 0, Config.AI.WaitDistance)
        if #(zp - goal) > 0.8 then
            navigate(ent, info, goal, 1.0, 0.4, 'hold')
        elseif info.mode ~= 'holding' then
            TaskTurnPedToFaceEntity(ent, tped, -1)
            info.mode = 'holding'
        end
        return
    end
    -- Chase / ready.
    local speed = run and 2.6 or 1.0
    if ai == S.Ready and dist < 3.2 then
        if info.mode ~= 'lunge' or now - (info.lastNav or 0) > 600 then
            -- Aim at a point just in front of the target (never through it).
            local d = tp - zp
            local len = math.max(0.01, #d)
            local stop = math.min(len, 0.8)
            local g = tp - d / len * stop
            TaskGoStraightToCoord(ent, g.x, g.y, g.z, run and 2.0 or 1.3, 1200, 0.0, 0.0)
            info.lastNav = now
            if info.mode ~= 'lunge' then playOnce(ent, 'zreact_reach', 16 | 32 | 1, 4.0) end
            info.mode = 'lunge'
        end
        return
    end
    if info.mode == 'lunge' then ClearPedSecondaryTask(ent) end
    local goal = tp
    if dist > 8.0 then goal = slotPoint(tp, st[ST.Slot] or 0, 1.5) end
    navigate(ent, info, goal, speed, 0.6, run and 'chase_run' or 'chase')
end

-- Owner-side commands from the server.
RegisterNetEvent(JJZ.Events.ZombieCmd, function(netId, cmd, extra)
    if not JJZC.fromServer() or not U.isInt(netId, 0, 65535) then return end
    if not NetworkDoesEntityExistWithNetworkId(netId) then return end
    local ent = NetworkGetEntityFromNetworkId(netId)
    if not ownsIt(ent) then return end
    local info = ZAI.list[ent]
    if not info then scan(); info = ZAI.list[ent] end
    if not info then return end
    if cmd == 'hold' then
        -- Finisher hand-over: stop walking and the reach overlay, then confirm to the server so
        -- the victim can start the paired scene with a zombie that no task pulls away.
        ClearPedSecondaryTask(ent)
        ClearPedTasks(ent)
        info.holdFin = extra
        info.mode = 'grab'
        if U.isInt(extra, 1, 2 ^ 31) then TriggerServerEvent(JJZ.Events.ZombieHeld, netId, extra) end
    elseif cmd == 'kill' then ZAI.startDeath(ent, info, false)
    elseif cmd == 'swipe' and not info.dying then
        -- Blocked-space fallback: a short claw swipe instead of the paired finisher.
        local tped = targetPed(stateOf(ent))
        if tped ~= 0 then TaskTurnPedToFaceEntity(ent, tped, 300) end
        playOnce(ent, 'zreact_swipe', 16 | 32, 6.0)
        info.resumeAt = GetGameTimer() + 900
    end
end)

-- ------------------------------------------------------------------ preloading
-- Finisher / reaction dictionaries stay loaded while zombies are around, so the first grab does
-- not wait for streaming (the scene would start with a hitch otherwise).
ZAI.preloaded = false
function ZAI.preload(on)
    ZAI.preloaded = on
    for _, dict in ipairs(Clips.dicts()) do
        if dict:find('^jjz_fin') or dict == 'jjz_react' then
            if on then Anim.load(dict, 5000) else Anim.release(dict) end
        end
    end
end

-- The finisher ended for this zombie: own AI may run again.
AddStateBagChangeHandler(ST.Fin, nil, function(bagName, _, value)
    if value ~= 0 and value ~= nil then return end
    local ent = GetEntityFromStateBagName(bagName)
    local info = ent ~= 0 and ZAI.list[ent] or nil
    if info then info.holdFin = nil; info.mode = nil end
end)

-- ------------------------------------------------------------------ main thread
CreateThread(function()
    local lastScan = 0
    while true do
        local now = GetGameTimer()
        local any = next(ZAI.list) ~= nil
        if now - lastScan > (any and 750 or 1500) then
            scan()
            lastScan = now
            any = next(ZAI.list) ~= nil
        end
        if any ~= ZAI.preloaded then ZAI.preload(any) end
        if not any then
            Wait(1000)
        else
            for ent, info in pairs(ZAI.list) do
                if DoesEntityExist(ent) then
                    local st = stateOf(ent)
                    if not info.visual then
                        info.visual = true
                        ZMove.apply(ent, info.type, info.seed)
                    end
                    if ownsIt(ent) then
                        if not info.ownedSetup then ownerSetup(ent, info, st) end
                        runOwnerAi(ent, info, st)
                    else
                        info.ownedSetup = false
                    end
                end
            end
            Wait(150)
        end
    end
end)

-- ------------------------------------------------------------------ spawn point search (/zspawn)
RegisterNetEvent(JJZ.Events.FindSpawn, function(reqId, count, p)
    if not JJZC.fromServer() or type(p) ~= 'table' or not U.isInt(count, 1, 10) then return end
    local ped = PlayerPedId()
    local pos = GetEntityCoords(ped)
    local head = GetEntityHeading(ped)
    local eye = GetPedBoneCoords(ped, 31086, 0.0, 0.0, 0.0)
    local points, tries = {}, 0
    while #points < count and tries < count * 14 do
        tries = tries + 1
        local ang = math.rad(head + (math.random() - 0.5) * (p.spread or 50))
        local dist = (p.min or 8) + math.random() * ((p.max or 14) - (p.min or 8))
        local x, y = pos.x - math.sin(ang) * dist, pos.y + math.cos(ang) * dist
        local gok, gz = GetGroundZFor_3dCoord(x, y, pos.z + 4.0, false)
        if gok then
            local sok, safe = GetSafeCoordForPed(x, y, gz, false, 8 | 2)
            if sok and #(vector2(safe.x, safe.y) - vector2(x, y)) < 3.0 then
                local wok, wz = GetWaterHeight(safe.x, safe.y, safe.z + 1.0)
                local dry = not wok or wz < safe.z - 0.2
                local ray = StartExpensiveSynchronousShapeTestLosProbe(eye.x, eye.y, eye.z, safe.x, safe.y, safe.z + 0.8, 1 | 16, ped, 7)
                local _, hit = GetShapeTestResult(ray)
                local spaced = true
                for _, q in ipairs(points) do
                    if #(vector3(q.x, q.y, q.z) - safe) < (p.spacing or 1.8) then spaced = false break end
                end
                if dry and hit ~= 1 and hit ~= true and spaced then
                    points[#points + 1] = { x = safe.x, y = safe.y, z = safe.z }
                end
            end
        end
    end
    TriggerServerEvent(JJZ.Events.SpawnPoints, reqId, points)
end)

AddEventHandler('onResourceStop', function(res)
    if res ~= GetCurrentResourceName() then return end
    for ent in pairs(ZAI.list) do ZMove.clear(ent) end
end)
