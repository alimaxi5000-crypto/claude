-- /zdebug overlay and /zcam free camera. Both run per frame ONLY while switched on.
local debugOn, camOn = false, false
local U, ST = JJZ.U, JJZ.State

local function text3d(p, s, r, g, b)
    SetDrawOrigin(p.x, p.y, p.z, 0)
    SetTextFont(0); SetTextScale(0.26, 0.26); SetTextColour(r or 255, g or 255, b or 255, 230)
    SetTextOutline(); SetTextCentre(true)
    BeginTextCommandDisplayText('STRING'); AddTextComponentSubstringPlayerName(s); EndTextCommandDisplayText(0.0, 0.0)
    ClearDrawOrigin()
end

local function text2d(x, y, s)
    SetTextFont(0); SetTextScale(0.3, 0.3); SetTextColour(255, 255, 255, 220); SetTextOutline()
    BeginTextCommandDisplayText('STRING'); AddTextComponentSubstringPlayerName(s); EndTextCommandDisplayText(x, y)
end

local function axes(o, heading, len)
    local x = ZCam.sceneToWorld(o, heading, len, 0.0, 0.0)
    local y = ZCam.sceneToWorld(o, heading, 0.0, len, 0.0)
    DrawLine(o.x, o.y, o.z, x.x, x.y, x.z, 255, 60, 60, 255)
    DrawLine(o.x, o.y, o.z, y.x, y.y, y.z, 60, 255, 60, 255)
    DrawLine(o.x, o.y, o.z, o.x, o.y, o.z + len, 60, 120, 255, 255)
end

local AI_COLOR = {
    idle = { 180, 180, 180 }, alerted = { 255, 200, 60 }, chase = { 255, 140, 40 }, ready = { 255, 60, 60 },
    hold = { 120, 170, 255 }, grab = { 255, 0, 200 }, stunned = { 120, 255, 200 }, dead = { 90, 90, 90 },
}

local function drawDebug()
    local me = PlayerPedId()
    local mp = GetEntityCoords(me)
    local n, owned = 0, 0
    for ent, info in pairs(ZAI.list) do
        if DoesEntityExist(ent) then
            n = n + 1
            local st = Entity(ent).state
            local zp = GetEntityCoords(ent)
            if #(zp - mp) < 60.0 then
                local ai = st[ST.Ai] or '?'
                local c = AI_COLOR[ai] or { 255, 255, 255 }
                local own = NetworkGetEntityOwner(ent) == PlayerId()
                if own then owned = owned + 1 end
                local tped = ZAI.targetPed(st)
                local dist = tped ~= 0 and #(GetEntityCoords(tped) - zp) or -1
                text3d(zp + vector3(0.0, 0.0, 1.15), ('%s %s  T%s  %.1fm  hp %d  %s'):format(
                    info.type, ai, tostring(st[ST.Target] or 0), dist, GetEntityHealth(ent) - 1000, own and 'OWNER' or ''), c[1], c[2], c[3])
                if tped ~= 0 then
                    local tp = GetEntityCoords(tped)
                    DrawLine(zp.x, zp.y, zp.z, tp.x, tp.y, tp.z, c[1], c[2], c[3], 180)
                    if ai == 'ready' then
                        local r = Config.AI.GrabDistance
                        DrawMarker(1, tp.x, tp.y, tp.z - 0.98, 0, 0, 0, 0, 0, 0, r * 2, r * 2, 0.05, 255, 60, 60, 90, false, false, 2, false, nil, nil, false)
                    end
                end
                if own and info.lastGoal then
                    local g = info.lastGoal
                    DrawLine(zp.x, zp.y, zp.z - 0.9, g.x, g.y, g.z, 255, 255, 255, 120)
                    DrawMarker(28, g.x, g.y, g.z, 0, 0, 0, 0, 0, 0, 0.12, 0.12, 0.12, 255, 255, 255, 160, false, false, 2, false, nil, nil, false)
                end
            end
        end
    end
    local fin = ZFin.active
    if fin then
        axes(fin.origin, fin.heading, 0.5)
        text3d(fin.origin + vector3(0.0, 0.0, -0.9), L('debug_scene', fin.sceneKey or '?', fin.phase, fin.predicted or 0))
        if DoesEntityExist(fin.zombie) then
            -- Facing each other: the zombie's left hand grips the victim's right shoulder and vice versa.
            local pairsList = { { 18905, 10706 }, { 57005, 64729 } }
            for _, pr in ipairs(pairsList) do
                local h = GetPedBoneCoords(fin.zombie, pr[1], 0.0, 0.0, 0.0)
                local s = GetPedBoneCoords(fin.victim, pr[2], 0.0, 0.0, 0.0)
                DrawLine(h.x, h.y, h.z, s.x, s.y, s.z, 255, 255, 0, 255)
                text3d((h + s) / 2, ('%.0f cm'):format(#(h - s) * 100), 255, 255, 0)
            end
            local mouth = GetPedBoneCoords(fin.zombie, 31086, 0.0, 0.12, 0.05)
            local neck = GetPedBoneCoords(fin.victim, 39317, 0.0, 0.0, 0.0)
            DrawLine(mouth.x, mouth.y, mouth.z, neck.x, neck.y, neck.z, 255, 80, 80, 255)
            text3d((mouth + neck) / 2, L('debug_neck', #(mouth - neck) * 100), 255, 120, 120)
        end
    end
    text2d(0.015, 0.72, L('debug_summary', n, owned, GlobalState[ST.Frozen] and L('debug_ai_paused') or L('debug_ai_active')))
end

RegisterNetEvent(JJZ.Events.ToggleDebug, function()
    if not JJZC.fromServer() then return end
    debugOn = not debugOn
    IntegrationC.notify(L(debugOn and 'debug_on' or 'debug_off'))
    if debugOn then
        CreateThread(function()
            while debugOn do drawDebug(); Wait(0) end
        end)
    end
end)

-- ------------------------------------------------------------------ /zcam
local function camRun()
    local base = GetGameplayCamCoord()
    local rot = GetGameplayCamRot(2)
    local cam = CreateCamWithParams('DEFAULT_SCRIPTED_CAMERA', base.x, base.y, base.z, rot.x, rot.y, rot.z, 50.0, true, 2)
    RenderScriptCams(true, true, 300, true, false)
    local pos, pitch, yaw = base, rot.x, rot.z
    while camOn do
        DisableAllControlActions(0)
        local fast = IsDisabledControlPressed(0, 21) and 6.0 or 1.5
        local dt = GetFrameTime()
        yaw = yaw - GetDisabledControlNormal(0, 1) * 6.0
        pitch = U.clamp(pitch - GetDisabledControlNormal(0, 2) * 6.0, -85.0, 85.0)
        local ry, rp = math.rad(yaw), math.rad(pitch)
        local fwd = vector3(-math.sin(ry) * math.cos(rp), math.cos(ry) * math.cos(rp), math.sin(rp))
        local right = vector3(math.cos(ry), math.sin(ry), 0.0)
        local mv = vector3(0.0, 0.0, 0.0)
        if IsDisabledControlPressed(0, 32) then mv = mv + fwd end
        if IsDisabledControlPressed(0, 33) then mv = mv - fwd end
        if IsDisabledControlPressed(0, 34) then mv = mv - right end
        if IsDisabledControlPressed(0, 35) then mv = mv + right end
        if IsDisabledControlPressed(0, 44) then mv = mv + vector3(0.0, 0.0, 1.0) end
        if IsDisabledControlPressed(0, 38) then mv = mv - vector3(0.0, 0.0, 1.0) end
        pos = pos + mv * fast * dt
        -- 1-4: fixed views around the running finisher (or around you).
        local views = { [157] = 'front', [158] = 'side', [160] = 'shoulder', [164] = 'wide' }
        for ctrl, name in pairs(views) do
            if IsDisabledControlJustPressed(0, ctrl) then
                local fin = ZFin.active
                local o = fin and fin.origin or GetEntityCoords(PlayerPedId())
                local h = fin and fin.heading or GetEntityHeading(PlayerPedId())
                local c = ZPreview.CAMS[name]
                pos = ZCam.sceneToWorld(o, h, c[1], c[2], c[3])
                local l = ZCam.sceneToWorld(o, h, c[4], c[5], c[6])
                local d = l - pos
                yaw = math.deg(math.atan(-d.x, d.y))
                pitch = math.deg(math.atan(d.z, math.sqrt(d.x * d.x + d.y * d.y)))
            end
        end
        SetCamCoord(cam, pos.x, pos.y, pos.z)
        SetCamRot(cam, pitch, 0.0, yaw, 2)
        SetFocusPosAndVel(pos.x, pos.y, pos.z, 0.0, 0.0, 0.0)
        text2d(0.015, 0.75, L('cam_help'))
        if IsDisabledControlJustPressed(0, 177) then camOn = false end
        Wait(0)
    end
    ClearFocus()
    RenderScriptCams(false, true, 300, true, false)
    DestroyCam(cam, false)
end

RegisterNetEvent(JJZ.Events.ToggleCam, function()
    if not JJZC.fromServer() then return end
    camOn = not camOn
    if camOn then CreateThread(camRun) end
end)

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() then
        debugOn, camOn = false, false
        ClearFocus()
    end
end)
