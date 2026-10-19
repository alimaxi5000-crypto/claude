-- /ztestanim: smoke test for the custom animation toolchain.
-- Plays a clip from stream/jjz_test.ycd on a local copy of your character standing in front of
-- you (or on yourself with "self"), checks that the dictionary loads, that the clip plays and
-- that its duration matches the build, and reports the result in chat and server console.
local test = { active = false, ped = nil, own = false, dict = nil, clip = nil }

local function stop()
    if not test.active then return end
    test.active = false
    if test.ped and DoesEntityExist(test.ped) then
        if test.own then
            ClearPedTasks(test.ped)
        else
            DeleteEntity(test.ped)
        end
    end
    if test.dict then Anim.release(test.dict) end
    test.ped, test.dict, test.clip = nil, nil, nil
end

local function report(ok, msg, extra)
    IntegrationC.notify(ok and msg or L('testanim_fail', msg), ok and 'success' or 'error')
    local r = { ok = ok, msg = msg }
    if extra then for k, v in pairs(extra) do r[k] = v end end
    TriggerServerEvent(JJZ.Events.AnimReport, r)
end

local function draw3d(x, y, z, text)
    SetDrawOrigin(x, y, z, 0)
    SetTextScale(0.32, 0.32)
    SetTextFont(4)
    SetTextColour(255, 255, 255, 230)
    SetTextOutline()
    SetTextCentre(true)
    BeginTextCommandDisplayText('STRING')
    AddTextComponentSubstringPlayerName(text)
    EndTextCommandDisplayText(0.0, 0.0)
    ClearDrawOrigin()
end

local function start(which, onSelf)
    stop()
    local name = 'smoke_' .. which
    local dict, clip, entry = Clips.single(name)
    if not dict then return report(false, L('testanim_missing', name)) end
    IntegrationC.notify(L('testanim_loading', dict, clip))
    local ok, err = Anim.load(dict, 5000)
    if not ok then return report(false, err, { dict = dict, clip = clip }) end
    test.dict, test.clip, test.own = dict, clip, onSelf

    local me = PlayerPedId()
    local target = me
    if not onSelf then
        target = ClonePed(me, false, false, true)
        local pos = GetOffsetFromEntityInWorldCoords(me, 0.0, 2.4, 0.0)
        SetEntityCoordsNoOffset(target, pos.x, pos.y, pos.z, false, false, false)
        SetEntityHeading(target, (GetEntityHeading(me) + 180.0) % 360.0)
        SetEntityInvincible(target, true)
        SetBlockingOfNonTemporaryEvents(target, true)
        FreezeEntityPosition(target, true)
        SetEntityCollision(target, false, false)
    end
    test.ped = target
    test.active = true
    local p = Clips.playback(entry)
    TaskPlayAnim(target, dict, clip, p.blendIn, p.blendOut, -1, p.flags | 1, 0.0, false, false, false)

    local deadline = GetGameTimer() + 1500
    while not IsEntityPlayingAnim(target, dict, clip, 3) and GetGameTimer() < deadline do Wait(0) end
    if not IsEntityPlayingAnim(target, dict, clip, 3) then
        report(false, L('testanim_not_playing', dict, clip), { dict = dict, clip = clip })
        return stop()
    end
    local dur = GetAnimDuration(dict, clip)
    local expected = entry.duration or 0.0
    local durOk = math.abs(dur - expected) < 0.05
    report(durOk, durOk and L('testanim_ok', dict, clip, dur, expected) or L('testanim_bad_duration', dur, expected),
        { dict = dict, clip = clip, duration = dur, expected = expected })

    -- On-screen label while the test runs (per-frame only during the test).
    CreateThread(function()
        while test.active and test.ped == target do
            if not DoesEntityExist(target) then break end
            local c = GetEntityCoords(target)
            local phase = GetEntityAnimCurrentTime(target, dict, clip)
            draw3d(c.x, c.y, c.z + 1.15, ('%s/%s  %.2f / %.2f s'):format(dict, clip, phase * dur, dur))
            Wait(0)
        end
    end)
end

RegisterNetEvent(JJZ.Events.TestAnim, function(which, onSelf)
    if not JJZC.fromServer() then return end
    if which == 'stop' then
        stop()
        IntegrationC.notify(L('testanim_stopped'))
        return
    end
    if which ~= 'bob' and which ~= 'face' and which ~= 'wave' then return end
    CreateThread(function() start(which, onSelf == true) end)
end)

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() then stop() end
end)
