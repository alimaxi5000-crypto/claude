-- Finisher, client side.
--  Victim: plays the paired networked synced scenes (grab -> struggle loops -> shove / bite),
--  collects key presses (only real presses via a key mapping), shows the UI, camera, sound and
--  effects at the clip events, and restores everything afterwards (also on every abort path).
--  Zombie owner: applies the knock-back ragdoll exactly at the clip's "impact" event.
-- The server decides start, progress and result; this file never decides an outcome.
ZFin = { active = nil }

local U = JJZ.U
local Events = JJZ.Events

-- Synced scene flags (NETWORK_ADD_PED_TO_SYNCHRONISED_SCENE documentation).
local SSF_DONT_INTERRUPT, SSF_HIDE_WEAPON, SSF_ABORT_ON_DEATH = 4, 1024, 2048
local VICTIM_FLAGS = SSF_DONT_INTERRUPT | SSF_HIDE_WEAPON | SSF_ABORT_ON_DEATH
local ZOMBIE_FLAGS = SSF_DONT_INTERRUPT | SSF_ABORT_ON_DEATH

local function entryOf(key)
    local name, variant = key:match('^(.-):(.*)$')
    return Clips.entry(name or key, variant)
end

local function nui(msg) SendNUIMessage(msg) end

-- ------------------------------------------------------------------ scene control
-- Starts one networked synced scene for both actors in the fixed scene frame of this finisher.
local function playScene(fin, key, opts)
    local e = entryOf(key)
    if not e then return false end
    local ok = Anim.load(e.dict, 2000)
    if not ok then return false end
    opts = opts or {}
    local o, h = fin.origin, fin.heading
    local scene = NetworkCreateSynchronisedScene(o.x, o.y, o.z, 0.0, 0.0, h, 2, opts.hold == true, opts.loop == true, 1.0, 0.0, 1.0)
    NetworkAddPedToSynchronisedScene(fin.victim, scene, e.dict, e.actors.victim, opts.blendIn or 8.0, -4.0, VICTIM_FLAGS, 0, opts.moverBlend or 1000.0, 0)
    if DoesEntityExist(fin.zombie) then
        NetworkAddPedToSynchronisedScene(fin.zombie, scene, e.dict, e.actors.zombie, opts.zBlendIn or opts.blendIn or 8.0, -4.0, ZOMBIE_FLAGS, 0, opts.zMoverBlend or opts.moverBlend or 1000.0, 0)
    end
    NetworkStartSynchronisedScene(scene)
    fin.scene, fin.sceneKey, fin.sceneEntry, fin.sceneStart, fin.sceneLoop = scene, key, e, GetGameTimer(), opts.loop == true
    fin.firedEvents = {}
    fin.lastPhase = 0.0
    Anim.release(e.dict)
    return true
end

-- Phase 0..1 of the running scene (time-based until the local scene id is available).
local function scenePhase(fin)
    if not fin.scene then return 1.0 end
    local loc = NetworkGetLocalSceneFromNetworkId(fin.scene)
    if loc and loc ~= -1 and IsSynchronizedSceneRunning(loc) then
        return GetSynchronizedScenePhase(loc)
    end
    local dur = fin.sceneEntry and fin.sceneEntry.duration or 1.0
    local p = (GetGameTimer() - fin.sceneStart) / 1000.0 / dur
    return fin.sceneLoop and (p % 1.0) or math.min(1.0, p)
end

-- Fire clip events (sound, camera, fx) once when the scene passes their phase.
local function fireEvents(fin, phase)
    if fin.sceneLoop and phase < (fin.lastPhase or 0) - 0.5 then fin.firedEvents = {} end  -- loop wrapped
    fin.lastPhase = phase
    for _, ev in ipairs(fin.sceneEntry and fin.sceneEntry.events or {}) do
        if not fin.firedEvents[ev.name] and phase >= (ev.phase or 0) then
            fin.firedEvents[ev.name] = true
            ZFin.onClipEvent(fin, ev.name)
        end
    end
end

function ZFin.onClipEvent(fin, name)
    if name == 'grab_impact' then
        ZSound.play('grab', 1.0)
        ZSound.play('roar', 0.8, 1.05)
        ZCam.punch('small')
    elseif name == 'snap' then
        ZSound.play('snap', 0.5 + 0.5 * (1.0 - (fin.progress or 50) / 100), 0.9 + math.random() * 0.2)
    elseif name == 'bite' then
        ZSound.play('bite', 1.0)
        ZCam.punch('big')
        ZFx.bite(fin.victim)
        nui({ type = 'fin:result', result = 'bite', text = L('ui_bitten') })
    elseif name == 'impact' then
        ZSound.play(fin.result == 'bite' and 'punch' or 'shove', 1.0)
        ZCam.punch('big')
        ZFx.slowmo()
    elseif name == 'release' then
        ZCam.stop(650)
        -- After a successful shove the player is free right away (no need to wait for the clip end).
        if fin.phase == 'success' then fin.releaseNow = true end
    end
end

-- ------------------------------------------------------------------ input
local seq = 0
RegisterCommand('+jjz_struggle', function()
    local fin = ZFin.active
    if not fin or fin.phase ~= 'struggle' then return end
    local t = GetGameTimer() - fin.struggleStartLocal
    if t < 0 then return end
    fin.batch[#fin.batch + 1] = t
    fin.predicted = math.min(100.0, (fin.predicted or fin.progress) + Config.Finisher.ProgressPerPress * 0.35)
    nui({ type = 'fin:press' })
end, false)
RegisterCommand('-jjz_struggle', function() end, false)
RegisterKeyMapping('+jjz_struggle', L('keymap_struggle'), 'keyboard', Config.Finisher.KeyDefault)

local function flushInput(fin)
    if #fin.batch == 0 then return end
    local maxBatch = 6
    while #fin.batch > 0 do
        local chunk = {}
        for i = 1, math.min(maxBatch, #fin.batch) do chunk[i] = fin.batch[i] end
        for i = 1, #chunk do table.remove(fin.batch, 1) end
        seq = seq + 1
        TriggerServerEvent(Events.StruggleInput, fin.id, seq, chunk)
    end
end

-- ------------------------------------------------------------------ cleanup
local function release(fin, why)
    if not fin or fin.released then return end
    fin.released = true
    if ZFin.active == fin then ZFin.active = nil end
    if fin.scene then NetworkStopSynchronisedScene(fin.scene) end
    ZCam.stop(why == 'abort' and 300 or 700)
    ZSound.loop('heartbeat', false)
    ZSound.loop('breath', false)
    ZSound.loop('struggle', false)
    nui({ type = 'fin:close' })
    IntegrationC.setGameplayLocked(false)
    SetTimeScale(1.0)
    local ped = PlayerPedId()
    if why == 'abort' and not IsEntityDead(ped) then ClearPedTasks(ped) end
end
ZFin.release = release

-- ------------------------------------------------------------------ victim flow
local function chooseIntensity(fin)
    local p = fin.predicted or fin.progress or 50
    local th = fin.thresholds
    local cur = fin.intensity or 'mid'
    -- Hysteresis of 4 points avoids flickering between loops.
    if p < th.ZombieWinsBelow - (cur == 'low' and -4 or 0) then return 'low' end
    if p > th.PlayerWinsAbove + (cur == 'high' and -4 or 0) then return 'high' end
    return 'mid'
end

local function controlsLoop(fin)
    -- Per-frame work only while a finisher runs.
    while ZFin.active == fin do
        DisableAllControlActions(0)
        EnableControlAction(0, 199, true) -- pause menu
        EnableControlAction(0, 200, true) -- pause menu (ESC)
        EnableControlAction(0, 245, true) -- chat
        EnableControlAction(0, 249, true) -- push to talk
        Wait(0)
    end
end

local function runVictim(data)
    local me = PlayerPedId()
    local deadline = GetGameTimer() + 1000
    while not NetworkDoesEntityExistWithNetworkId(data.zombieNet) and GetGameTimer() < deadline do Wait(0) end
    if not NetworkDoesEntityExistWithNetworkId(data.zombieNet) then
        TriggerServerEvent(Events.FinisherClientState, data.finId, 'failed')
        return
    end
    local zombie = NetworkGetEntityFromNetworkId(data.zombieNet)
    -- Scene frame: origin at the victim, +Y towards the zombie. The victim's current heading
    -- and the chosen 45-degree variant are reconciled half/half so neither body snaps more
    -- than ~11 degrees; the mover blend then removes the rest smoothly.
    local vp, zp = GetEntityCoords(me), GetEntityCoords(zombie)
    local approach = U.headingOf(zp.x - vp.x, zp.y - vp.y)
    local fromVictim = (GetEntityHeading(me) - data.dir * 45.0) % 360.0
    local heading = (approach + 0.5 * U.angleDiff(fromVictim, approach)) % 360.0
    local align = ZFin.alignOffset or { x = 0.0, y = 0.0, z = 0.0, yaw = 0.0 }
    local origin = ZCam.sceneToWorld(vp, heading, align.x, align.y, align.z)
    local fin = {
        id = data.finId, victim = me, zombie = zombie, zombieNet = data.zombieNet, data = data,
        origin = origin, heading = (heading + align.yaw) % 360.0, phase = 'grab',
        progress = data.startProgress, predicted = data.startProgress, thresholds = data.thresholds,
        batch = {}, firedEvents = {}, lastServerMsg = GetGameTimer(), intensity = 'mid',
    }
    ZFin.active = fin
    SetCurrentPedWeapon(me, `WEAPON_UNARMED`, true)
    IntegrationC.setGameplayLocked(true)
    CreateThread(function() controlsLoop(fin) end)
    if not playScene(fin, data.grab, { blendIn = 6.0, moverBlend = 8.0, zMoverBlend = 5.0 }) then
        TriggerServerEvent(Events.FinisherClientState, fin.id, 'failed')
        return release(fin, 'abort')
    end
    TriggerServerEvent(Events.FinisherClientState, fin.id, 'grab')
    -- Diagnostics: report once if the zombie did not join the paired scene (server console + F8).
    CreateThread(function()
        Wait(400)
        local e = fin.sceneEntry
        if ZFin.active == fin and e and DoesEntityExist(fin.zombie) and not IsEntityPlayingAnim(fin.zombie, e.dict, e.actors.zombie, 3) then
            print(('[jj_zombie] zombie is not playing %s/%s (owner %d)'):format(e.dict, e.actors.zombie, NetworkGetEntityOwner(fin.zombie)))
            TriggerServerEvent(Events.AnimReport, { ok = false, msg = 'zombie not in the finisher scene', dict = e.dict, clip = e.actors.zombie })
        end
    end)
    ZCam.start(fin.origin, fin.heading, (data.dir >= 4) and -1.0 or 1.0)
    ZSound.loop('heartbeat', true, 0.5)

    local lastFlush, lastUi = 0, 0
    while ZFin.active == fin do
        local now = GetGameTimer()
        local phase = scenePhase(fin)
        fireEvents(fin, phase)
        if IsEntityDead(me) then return release(fin, 'abort') end
        if now - fin.lastServerMsg > 5000 and fin.phase == 'struggle' then return release(fin, 'abort') end

        if fin.phase == 'grab' and phase >= 0.995 then
            fin.phase = 'struggle'
            fin.struggleStartLocal = now
            fin.intensity = chooseIntensity(fin)
            playScene(fin, data.struggle[fin.intensity], { blendIn = 12.0, loop = true })
            ZSound.loop('breath', true, 0.6)
            ZSound.loop('struggle', true, 0.5)
            nui({
                type = 'fin:open', key = Config.Finisher.KeyDefault, progress = fin.progress, timeLimit = data.timeLimit,
                text = { press = L('ui_press'), push = L('ui_push') },
                ui = Config.UI, thresholds = data.thresholds,
            })
        elseif fin.phase == 'struggle' then
            -- The loop scene keeps running by itself; a new scene is only started when the intensity
            -- changes, at the loop seam (all intensity loops share the same seam pose).
            if phase >= 0.975 then
                local want = chooseIntensity(fin)
                if want ~= fin.intensity then
                    fin.intensity = want
                    playScene(fin, data.struggle[want], { blendIn = 16.0, loop = true })
                end
            end
            if now - lastFlush >= 100 then flushInput(fin); lastFlush = now end
            if now - lastUi >= 100 then
                lastUi = now
                -- Local prediction decays like the server model and is pulled to the server value.
                local pred = (fin.predicted or fin.progress) - Config.Finisher.DecayPerSecond * 0.1
                fin.predicted = math.max(0.0, pred + (fin.progress - pred) * 0.35)
                local danger = 1.0 - fin.predicted / 100.0
                ZCam.setDanger(danger)
                ZSound.loop('heartbeat', true, 0.4 + 0.6 * danger)
                ZSound.loop('struggle', true, 0.3 + 0.7 * danger)
                nui({ type = 'fin:progress', value = fin.predicted, danger = danger })
            end
        elseif fin.releaseNow then
            return release(fin, 'done')
        elseif (fin.phase == 'success' or fin.phase == 'bite') and phase >= 0.995 then
            local bitten = fin.phase == 'bite'
            release(fin, 'done')
            -- The bite holds its last frame, which is exactly the recover clip's first frame, so
            -- stopping the scene and starting the recover in the same frame is seamless.
            if bitten and Clips.single('fin_recover', data.gender) then
                Anim.play(me, 'fin_recover', data.gender, { flags = 0, blendIn = 8.0 })
            end
            return
        end
        Wait(0)
    end
end

RegisterNetEvent(Events.FinisherStart, function(data)
    if not JJZC.fromServer() or type(data) ~= 'table' or not U.isInt(data.finId, 1, 2 ^ 31) then return end
    if ZFin.active then release(ZFin.active, 'abort') end
    CreateThread(function() runVictim(data) end)
end)

RegisterNetEvent(Events.FinisherProgress, function(finId, value, remainingMs)
    local fin = ZFin.active
    if not JJZC.fromServer() or not fin or fin.id ~= finId or not U.isNum(value, 0, 100) then return end
    fin.progress = value
    fin.lastServerMsg = GetGameTimer()
    nui({ type = 'fin:time', remainingMs = U.isNum(remainingMs) and remainingMs or 0 })
end)

RegisterNetEvent(Events.FinisherResult, function(finId, result)
    local fin = ZFin.active
    if not JJZC.fromServer() or not fin or fin.id ~= finId then return end
    fin.lastServerMsg = GetGameTimer()
    flushInput(fin)
    fin.result = result
    ZSound.loop('struggle', false)
    if result == 'success' then
        fin.phase = 'success'
        playScene(fin, fin.data.shove, { blendIn = 6.0 })
        nui({ type = 'fin:result', result = 'success', text = L('ui_escaped') })
        ZSound.loop('heartbeat', true, 0.3)
    else
        fin.phase = 'bite'
        playScene(fin, fin.data.bite, { blendIn = 5.0, hold = true })
        ZSound.loop('heartbeat', true, 1.0)
    end
end)

RegisterNetEvent(Events.FinisherAbort, function(finId)
    local fin = ZFin.active
    if not JJZC.fromServer() or not fin or fin.id ~= finId then return end
    release(fin, 'abort')
end)

-- Damage decided by the server, applied as normal game damage on this client.
RegisterNetEvent(Events.ApplyBite, function(finId, damage)
    if not JJZC.fromServer() or not U.isInt(damage, 0, 500) then return end
    local ped = PlayerPedId()
    ApplyDamageToPed(ped, damage, false)
    ZSound.play('gasp', 0.9)
end)

-- Blocked-space fallback: short swipe hit.
RegisterNetEvent(Events.Swipe, function(netId, damage)
    if not JJZC.fromServer() or not U.isInt(damage, 0, 200) then return end
    ApplyDamageToPed(PlayerPedId(), damage, false)
    ZCam.punch('small')
    ZSound.play('swipe', 1.0)
end)

-- ------------------------------------------------------------------ zombie owner: knock-back
-- Armed by the server when a result phase starts; fires exactly when the zombie's clip passes
-- its "impact" event (with a time-based fallback for latency or a missing clip).
RegisterNetEvent(Events.ZombieImpact, function(netId, finId, key)
    if not JJZC.fromServer() or not U.isInt(netId, 0, 65535) or not U.isStr(key, 64) then return end
    local e = entryOf(key)
    if not e then return end
    local impactT = Clips.eventTime(e, 'impact') or (e.duration * 0.5)
    CreateThread(function()
        local t0 = GetGameTimer()
        local deadline = t0 + math.floor((impactT + 0.6) * 1000)
        while GetGameTimer() < deadline do
            if not NetworkDoesEntityExistWithNetworkId(netId) then return end
            local ent = NetworkGetEntityFromNetworkId(netId)
            if NetworkGetEntityOwner(ent) ~= PlayerId() then return end
            local clip = e.actors.zombie
            if IsEntityPlayingAnim(ent, e.dict, clip, 3) then
                local t = GetEntityAnimCurrentTime(ent, e.dict, clip) * e.duration
                if t >= impactT then break end
            elseif GetGameTimer() - t0 > (impactT + 0.25) * 1000 then
                break
            end
            Wait(0)
        end
        if not NetworkDoesEntityExistWithNetworkId(netId) then return end
        local ent = NetworkGetEntityFromNetworkId(netId)
        if NetworkGetEntityOwner(ent) ~= PlayerId() then return end
        ZFin.knockBack(ent)
    end)
end)

-- Ragdoll + impulse away from the attacker; optional custom get-up afterwards.
function ZFin.knockBack(ent)
    local st = Entity(ent).state
    local tped = ZAI.targetPed(st)
    local zp = GetEntityCoords(ent)
    local dir = vector3(0.0, 1.0, 0.0)
    if tped ~= 0 then
        local d = zp - GetEntityCoords(tped)
        local len = #d
        if len > 0.01 then dir = d / len end
    end
    SetPedToRagdoll(ent, 2200, 3200, 0, false, false, false)
    ApplyForceToEntity(ent, 1, dir.x * 9.0, dir.y * 9.0, 2.8, 0.0, 0.0, 0.25, 0, false, true, true, false, true)
    if Config.Effects.CustomGetup then
        CreateThread(function()
            Wait(2400)
            ZFin.customGetup(ent)
        end)
    end
end

-- Lying on the back or the front? Chest normal from bone positions.
function ZFin.customGetup(ent)
    if not DoesEntityExist(ent) or NetworkGetEntityOwner(ent) ~= PlayerId() or IsPedDeadOrDying(ent, true) then return end
    local deadline = GetGameTimer() + 2500
    while IsPedRagdoll(ent) and GetGameTimer() < deadline do Wait(50) end
    local spine = GetPedBoneCoords(ent, 24818, 0.0, 0.0, 0.0)
    local pelvis = GetPedBoneCoords(ent, 11816, 0.0, 0.0, 0.0)
    local lc = GetPedBoneCoords(ent, 64729, 0.0, 0.0, 0.0)
    local rc = GetPedBoneCoords(ent, 10706, 0.0, 0.0, 0.0)
    local up = spine - pelvis
    local across = rc - lc
    local normal = vector3(up.y * across.z - up.z * across.y, up.z * across.x - up.x * across.z, up.x * across.y - up.y * across.x)
    -- normal = chest direction: pointing up means the zombie lies on its back.
    local name = normal.z > 0 and 'zreact_getup_back' or 'zreact_getup_front'
    Anim.play(ent, name, nil, { flags = 0, blendIn = 2.0 })
end

-- ------------------------------------------------------------------ grab space report
-- While a zombie targets this player, check whether there is room for the paired scene and
-- report changes (max 2/s). The server falls back to a swipe attack if there is no room.
CreateThread(function()
    local last = nil
    while true do
        local sleep = 1000
        local me = PlayerPedId()
        local myId = GetPlayerServerId(PlayerId())
        local nearest, nd = nil, 6.0
        for ent in pairs(ZAI.list) do
            if DoesEntityExist(ent) and Entity(ent).state[JJZ.State.Target] == myId then
                local d = #(GetEntityCoords(ent) - GetEntityCoords(me))
                if d < nd then nearest, nd = ent, d end
            end
        end
        if nearest and not ZFin.active then
            sleep = 500
            local p = GetEntityCoords(me)
            local zp = GetEntityCoords(nearest)
            local blocked = 0
            local r = Config.Finisher.SceneMinClearance
            for i = 0, 7 do
                local a = i * math.pi / 4
                local tx, ty = p.x + math.cos(a) * r, p.y + math.sin(a) * r
                local ray = StartExpensiveSynchronousShapeTestLosProbe(p.x, p.y, p.z, tx, ty, p.z, 1 | 16, me, 7)
                local _, hit = GetShapeTestResult(ray)
                if hit == 1 or hit == true then blocked = blocked + 1 end
            end
            local ray = StartExpensiveSynchronousShapeTestLosProbe(p.x, p.y, p.z + 0.3, zp.x, zp.y, zp.z + 0.3, 1 | 16, me, 7)
            local _, wall = GetShapeTestResult(ray)
            local ok = blocked <= 2 and wall ~= 1 and wall ~= true
            if ok ~= last then
                last = ok
                TriggerServerEvent(Events.SpaceReport, ok)
            end
        end
        Wait(sleep)
    end
end)

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() and ZFin.active then release(ZFin.active, 'abort') end
end)
