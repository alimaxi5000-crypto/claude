-- Developer tools that pose the finisher locally (no network, no AI):
--  * ZPreview: local zombie copy + local synced scenes on your own ped, phase control
--  * /zcapture: fixed cameras x fixed time steps, screenshots stored by the server
--  * /zalign: live per-actor offsets (zombie relative to you) and scene offset, saved to KVP
ZPreview = { active = false }

local CAMS = {
    -- name = { x, y, z (scene frame: you at origin facing +Y, zombie in front) ; look at }
    front = { 0.15, 2.6, 0.45, 0.0, 0.3, 0.25 },
    side = { 2.6, 0.35, 0.4, 0.0, 0.35, 0.2 },
    shoulder = { -0.55, -0.85, 0.75, 0.05, 0.55, 0.35 },
    wide = { 2.8, -2.4, 1.4, 0.0, 0.4, 0.0 },
}
ZPreview.CAMS = CAMS

local function gender()
    return GetEntityModel(PlayerPedId()) == `mp_f_freemode_01` and 'f' or 'm'
end

local function entryFor(name, g, dir)
    local v = dir and ('d%d_%s'):format(dir, g) or g
    return Clips.entry(name, v) or Clips.entry(name, dir and ('d%d_m'):format(dir) or 'm')
end

function ZPreview.start()
    ZPreview.stop()
    local me = PlayerPedId()
    local model = GetHashKey(Config.Spawn.Model)
    RequestModel(model)
    local deadline = GetGameTimer() + 5000
    while not HasModelLoaded(model) and GetGameTimer() < deadline do Wait(0) end
    if not HasModelLoaded(model) then return false end
    local origin = GetEntityCoords(me)
    local heading = GetEntityHeading(me)
    local zp = ZCam.sceneToWorld(origin, heading, 0.0, 0.8, 0.0)
    local z = CreatePed(4, model, zp.x, zp.y, zp.z - 1.0, (heading + 180.0) % 360.0, false, false)
    SetModelAsNoLongerNeeded(model)
    SetEntityInvincible(z, true)
    SetBlockingOfNonTemporaryEvents(z, true)
    ZPreview.active = true
    ZPreview.zombie, ZPreview.origin, ZPreview.heading, ZPreview.gender = z, origin, heading, gender()
    ZPreview.offset = ZPreview.offset or { x = 0.0, y = 0.0, z = 0.0, yaw = 0.0 }
    return true
end

-- Play a registry scene locally, like the finisher: every actor in its own scene at
-- sceneFrame * origin (paired clips start at identity). The zombie's start is additionally shifted
-- by the alignment offset (scene frame), so the effect of an offset can be judged live.
local ZERO = { x = 0.0, y = 0.0, z = 0.0, yaw = 0.0 }
local function actorStart(o, h, origin, off)
    origin, off = origin or ZERO, off or ZERO
    local base, bh = ZCam.sceneToWorld(o, h, off.x, off.y, off.z), h + off.yaw
    return ZCam.sceneToWorld(base, bh, origin.x, origin.y, origin.z), (bh + origin.yaw) % 360.0
end

function ZPreview.play(entry, phase, rate, loop)
    if not ZPreview.active or not entry then return false end
    local ok = Anim.load(entry.dict, 3000)
    if not ok then return false end
    local me, z = PlayerPedId(), ZPreview.zombie
    local o, h, off = ZPreview.origin, ZPreview.heading, ZPreview.offset
    local origins = entry.origins or {}
    local vp, vh = actorStart(o, h, origins.victim, nil)
    local zp, zh = actorStart(o, h, origins.zombie, off)
    local s1 = CreateSynchronizedScene(vp.x, vp.y, vp.z, 0.0, 0.0, vh, 2)
    local s2 = CreateSynchronizedScene(zp.x, zp.y, zp.z, 0.0, 0.0, zh, 2)
    TaskSynchronizedScene(me, s1, entry.dict, entry.actors.victim, 1000.0, -8.0, 0, 0, 1000.0, 0)
    TaskSynchronizedScene(z, s2, entry.dict, entry.actors.zombie, 1000.0, -8.0, 0, 0, 1000.0, 0)
    for _, s in ipairs({ s1, s2 }) do
        SetSynchronizedSceneLooped(s, loop == true)
        SetSynchronizedScenePhase(s, phase or 0.0)
        SetSynchronizedSceneRate(s, rate or 1.0)
    end
    ZPreview.scenes, ZPreview.entry = { s1, s2 }, entry
    return true
end

function ZPreview.setPhase(phase)
    for _, s in ipairs(ZPreview.scenes or {}) do SetSynchronizedScenePhase(s, phase) end
end

function ZPreview.stop()
    if not ZPreview.active then return end
    ZPreview.active = false
    ClearPedTasks(PlayerPedId())
    if ZPreview.zombie and DoesEntityExist(ZPreview.zombie) then DeleteEntity(ZPreview.zombie) end
    ZPreview.zombie, ZPreview.scenes = nil, nil
end

-- ------------------------------------------------------------------ /zcapture
local ack = {}
RegisterNetEvent(JJZ.Events.CaptureAck, function(id, index, ok)
    if not JJZC.fromServer() then return end
    ack[('%s:%d'):format(tostring(id), tonumber(index) or 0)] = ok == true
end)

local function setCam(cam, name)
    local c = CAMS[name]
    local o, h = ZPreview.origin, ZPreview.heading
    local p = ZCam.sceneToWorld(o, h, c[1], c[2], c[3])
    local l = ZCam.sceneToWorld(o, h, c[4], c[5], c[6])
    SetCamCoord(cam, p.x, p.y, p.z)
    PointCamAtCoord(cam, l.x, l.y, l.z)
end

local function runCapture(id, seq)
    if not ZPreview.start() then return end
    local g = ZPreview.gender
    local list = {}
    local function add(name, dir) list[#list + 1] = { name = name, entry = entryFor(name, g, dir) } end
    if seq == 'grab' or seq == 'all' then add('fin_grab', 0) end
    if seq == 'struggle' or seq == 'all' then add('fin_struggle_low'); add('fin_struggle_mid'); add('fin_struggle_high') end
    if seq == 'shove' or seq == 'all' then add('fin_shove') end
    if seq == 'bite' or seq == 'all' then add('fin_bite') end
    local cam = CreateCamWithParams('DEFAULT_SCRIPTED_CAMERA', 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 45.0, true, 2)
    RenderScriptCams(true, false, 0, true, false)
    local hud = true
    CreateThread(function()
        while hud do HideHudAndRadarThisFrame(); Wait(0) end
    end)
    local index, steps = 0, 6
    for _, item in ipairs(list) do
        if item.entry then
            ZPreview.play(item.entry, 0.0, 0.0, false)
            for k = 0, steps - 1 do
                local phase = k / (steps - 1)
                ZPreview.setPhase(phase)
                Wait(260)
                for _, camName in ipairs({ 'front', 'side', 'shoulder', 'wide' }) do
                    index = index + 1
                    setCam(cam, camName)
                    Wait(140)
                    local key = ('%s:%d'):format(id, index)
                    ack[key] = nil
                    TriggerServerEvent(JJZ.Events.CaptureFrame, id, index, { cam = camName, t = phase * item.entry.duration, scene = item.name, gender = g })
                    local deadline = GetGameTimer() + 4000
                    while ack[key] == nil and GetGameTimer() < deadline do Wait(50) end
                    Wait(220) -- stay under the server's screenshot rate limit
                end
            end
        end
    end
    hud = false
    RenderScriptCams(false, false, 0, true, false)
    DestroyCam(cam, false)
    ZPreview.stop()
    TriggerServerEvent(JJZ.Events.CaptureDone, id)
end

RegisterNetEvent(JJZ.Events.CaptureStart, function(id, seq)
    if not JJZC.fromServer() or type(id) ~= 'string' or type(seq) ~= 'string' then return end
    if ZFin.active then return end
    CreateThread(function() runCapture(id, seq) end)
end)

-- ------------------------------------------------------------------ /zalign
-- Arrows: zombie X/Y, PageUp/PageDown: Z, Q/E: yaw, Shift: fine steps, Tab: scene mode
-- (runtime offset of the whole scene), Enter: save + report, Backspace: cancel.
local alignOn = false
local KVP_SCENE = 'jjz_align_scene'

local function loadSceneOffset()
    local s = GetResourceKvpString(KVP_SCENE)
    if s then
        local ok, v = pcall(json.decode, s)
        if ok and type(v) == 'table' then ZFin.alignOffset = v end
    end
end
loadSceneOffset()

local function drawText(x, y, text)
    SetTextFont(4); SetTextScale(0.38, 0.38); SetTextColour(255, 255, 255, 235); SetTextOutline()
    BeginTextCommandDisplayText('STRING'); AddTextComponentSubstringPlayerName(text); EndTextCommandDisplayText(x, y)
end

RegisterNetEvent(JJZ.Events.StartAlign, function()
    if not JJZC.fromServer() then return end
    if alignOn then alignOn = false return end
    if ZFin.active then return end
    CreateThread(function()
        if not ZPreview.start() then return end
        alignOn = true
        local mode = 'zombie'
        local scene = ZFin.alignOffset or { x = 0.0, y = 0.0, z = 0.0, yaw = 0.0 }
        local entry = entryFor('fin_struggle_mid', ZPreview.gender)
        ZPreview.play(entry, 0.0, 1.0, true)
        while alignOn do
            DisableAllControlActions(0)
            local fine = IsDisabledControlPressed(0, 21)
            local step, astep = fine and 0.002 or 0.01, fine and 0.25 or 1.0
            local t = mode == 'zombie' and ZPreview.offset or scene
            local changed = false
            local function adj(ctrl, field, d) if IsDisabledControlJustPressed(0, ctrl) then t[field] = t[field] + d; changed = true end end
            adj(172, 'y', step); adj(173, 'y', -step); adj(174, 'x', -step); adj(175, 'x', step)
            adj(10, 'z', step); adj(11, 'z', -step); adj(44, 'yaw', astep); adj(38, 'yaw', -astep)
            if IsDisabledControlJustPressed(0, 37) then mode = (mode == 'zombie') and 'scene' or 'zombie' end
            if changed and mode == 'zombie' then ZPreview.play(entry, 0.0, 1.0, true) end
            drawText(0.02, 0.30, L('align_mode', mode == 'zombie' and L('align_mode_zombie') or L('align_mode_scene')))
            drawText(0.02, 0.33, ('x %.3f  y %.3f  z %.3f  yaw %.2f'):format(t.x, t.y, t.z, t.yaw))
            drawText(0.02, 0.36, L('align_help'))
            if IsDisabledControlJustPressed(0, 191) then
                ZFin.alignOffset = scene
                SetResourceKvp(KVP_SCENE, json.encode(scene))
                local z = ZPreview.offset
                TriggerServerEvent(JJZ.Events.AlignResult, { x = z.x, y = z.y, z = z.z, yaw = z.yaw })
                IntegrationC.notify(L('align_saved', z.x, z.y, z.z, z.yaw))
                alignOn = false
            elseif IsDisabledControlJustPressed(0, 177) then
                alignOn = false
            end
            Wait(0)
        end
        ZPreview.stop()
    end)
end)

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() then alignOn = false; ZPreview.stop() end
end)
