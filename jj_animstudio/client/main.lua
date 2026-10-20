-- Studio client: /animstudio command, open/close, NUI bridge. While closed nothing runs (no
-- threads); while open one thread blocks the pause menu and hides the HUD each frame. Overlay,
-- solver and checks run in the NUI; Lua only drives the camera and the peds.
Studio = { open = false, frame = nil, opening = false }

local E = JJS.Events
local U = JJS.U

local function nui(msg) SendNUIMessage(msg) end
local function notify(text) TriggerEvent('chat:addMessage', { args = { 'Animations-Studio', text } }); print('[jj_animstudio] ' .. text) end

-- Server operations the NUI may request (op -> event, latent = big payload).
local SERVER_OPS = {
    list = { E.list }, load = { E.load }, save = { E.save, true }, rename = { E.rename }, duplicate = { E.duplicate },
    delete = { E.delete }, preview = { E.preview, true }, finalize = { E.finalize, true },
    poseSave = { E.poseSave }, poseDelete = { E.poseDelete },
}

local function frameLoop()
    CreateThread(function()
        while Studio.open do
            -- ESC is handled by the studio UI (asks before closing); keep the pause menu closed.
            DisableControlAction(0, 199, true)   -- INPUT_FRONTEND_PAUSE
            DisableControlAction(0, 200, true)   -- INPUT_FRONTEND_PAUSE_ALTERNATE
            HideHudAndRadarThisFrame()
            Wait(0)
        end
    end)
end

function Studio.start(payload)
    if Studio.open then return end
    local ped = PlayerPedId()
    local c = GetEntityCoords(ped, false)
    Studio.frame = { x = c.x, y = c.y, z = c.z, heading = GetEntityHeading(ped) }
    Studio.open = true
    StudioPeds.begin(Studio.frame)
    StudioCam.create(Studio.frame)
    SetNuiFocus(true, true)
    nui({
        type = 'open',
        data = {
            locale = Config.Locale, playerModel = GetEntityModel(ped), frame = Studio.frame,
            config = {
                autosave = Config.AutosaveSeconds, undo = Config.UndoSteps, duration = Config.DefaultDuration,
                tutorial = Config.ShowTutorial, partners = Config.PartnerModels, camera = Config.Camera,
                contactRedCm = Config.Test.ContactRedCm, command = Config.Command,
            },
            server = payload,
        },
    })
    frameLoop()
    notify(L('opened', Config.Command))
end

function Studio.stop()
    if not Studio.open then return end
    StudioPlay.stop(Studio.frame)
    Studio.open = false
    SetNuiFocus(false, false)
    nui({ type = 'close' })
    StudioCam.destroy()
    StudioPeds.restore()
    TriggerServerEvent(E.close)
    notify(L('closed'))
end

RegisterCommand(Config.Command, function(_, args)
    if args[1] == 'close' then
        if Studio.open then Studio.stop() else notify(L('not_open')) end
        return
    end
    if Studio.open then return notify(L('already_open')) end
    if IsPedInAnyVehicle(PlayerPedId(), false) then return notify(L('busy_vehicle')) end
    if Studio.opening then return end
    Studio.opening = true
    TriggerServerEvent(E.open)
    SetTimeout(10000, function() Studio.opening = false end)
end, false)

-- ------------------------------------------------------------------ server -> client
RegisterNetEvent(E.opened, function(payload)
    Studio.opening = false
    if type(payload) ~= 'table' then return end
    Studio.start(payload)
end)
RegisterNetEvent(E.denied, function(msg)
    Studio.opening = false
    notify(type(msg) == 'string' and msg or L('no_permission'))
    if Studio.open then Studio.stop() end
end)
RegisterNetEvent(E.projects, function(list) if Studio.open then nui({ type = 'projects', list = list }) end end)
RegisterNetEvent(E.project, function(name, text) if Studio.open then nui({ type = 'project', name = name, text = text }) end end)
RegisterNetEvent(E.reply, function(data) if Studio.open then nui({ type = 'reply', data = data }) end end)
RegisterNetEvent(E.poses, function(poses) if Studio.open then nui({ type = 'poses', poses = poses }) end end)
RegisterNetEvent(E.notice, function(key, data) if Studio.open then nui({ type = 'notice', key = key, text = L(key), data = data }) end end)
RegisterNetEvent(E.job, function(kind, result)
    if not Studio.open or type(result) ~= 'table' then return end
    nui({ type = 'job', kind = kind, result = result })
end)

-- ------------------------------------------------------------------ NUI -> client
local function cb(name, fn)
    RegisterNUICallback(name, function(data, done)
        if not Studio.open then return done({ ok = false }) end
        local ok, res = pcall(fn, type(data) == 'table' and data or {})
        done(ok and (res or { ok = true }) or { ok = false, error = tostring(res) })
    end)
end

cb('camera', function(d)
    if type(d.p) == 'table' then StudioCam.apply(Studio.frame, d.p, tonumber(d.yaw) or 0.0, tonumber(d.pitch) or 0.0, tonumber(d.fov) or Config.Camera.Fov) end
end)

-- Actor entities follow the timeline (mover position at the current time).
cb('place', function(d)
    if StudioPlay.active then return end
    for actor, v in pairs(type(d.actors) == 'table' and d.actors or {}) do
        if (actor == 'a' or actor == 'b') and type(v) == 'table' and type(v.p) == 'table' then
            StudioPeds.place(Studio.frame, actor, v.p, tonumber(v.yaw) or 0.0)
        end
    end
end)

cb('partner', function(d)
    local model = type(d.model) == 'string' and d.model or nil
    local ok, err = StudioPeds.partner(Studio.frame, model, type(d.p) == 'table' and d.p or {}, tonumber(d.yaw) or 180.0)
    return { ok = ok, error = err }
end)

cb('server', function(d)
    local op = SERVER_OPS[d.op]
    if not op then return { ok = false } end
    local args = type(d.args) == 'table' and d.args or {}
    if op[2] then TriggerLatentServerEvent(op[1], JJS.LATENT_BPS, table.unpack(args, 1, 4))
    else TriggerServerEvent(op[1], table.unpack(args, 1, 4)) end
    return { ok = true }
end)

cb('test', function(d)
    if d.action == 'start' then
        CreateThread(function()
            local ok, err = StudioPlay.start(Studio.frame, d.result or {}, d)
            nui({ type = 'test:started', ok = ok, error = err, dict = d.result and d.result.dict })
        end)
    elseif d.action == 'stop' then
        StudioPlay.stop(Studio.frame)
    else
        StudioPlay.control(d)
    end
end)

-- Alignment tool: real bone positions of an actor (bone tags from the NUI) in the scene frame.
cb('bones', function(d)
    local actor = (d.actor == 'b') and 'b' or 'a'
    return { ok = true, bones = StudioPeds.boneCoords(Studio.frame, actor, type(d.list) == 'table' and d.list or {}) }
end)

cb('close', function() Studio.stop() end)

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() and Studio.open then
        SetNuiFocus(false, false)
        StudioCam.destroy()
        StudioPeds.restore()
    end
end)
