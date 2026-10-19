-- Animation layer: dictionary streaming (ref-counted, with timeout), playback through the clip
-- registry and anim-event timing helpers. All gameplay code plays clips through Anim.*.
Anim = {}

local requested = {}   -- dict -> { refs, lastUse }

-- Load an animation dictionary. Returns true or false, reason.
function Anim.load(dict, timeoutMs)
    if not dict then return false, 'no dictionary' end
    if not DoesAnimDictExist(dict) then
        return false, ('dictionary %s does not exist (is stream/%s.ycd loaded? restart the resource)'):format(dict, dict)
    end
    local r = requested[dict]
    if r then r.refs = r.refs + 1; r.lastUse = GetGameTimer() else requested[dict] = { refs = 1, lastUse = GetGameTimer() } end
    if HasAnimDictLoaded(dict) then return true end
    RequestAnimDict(dict)
    local deadline = GetGameTimer() + (timeoutMs or 3000)
    while not HasAnimDictLoaded(dict) do
        if GetGameTimer() > deadline then return false, ('timeout loading %s'):format(dict) end
        Wait(0)
    end
    return true
end

-- Release one reference; the dictionary is removed when no user is left.
function Anim.release(dict)
    local r = requested[dict]
    if not r then return end
    r.refs = r.refs - 1
    if r.refs <= 0 then
        requested[dict] = nil
        RemoveAnimDict(dict)
    end
end

function Anim.releaseAll()
    for dict in pairs(requested) do RemoveAnimDict(dict) end
    requested = {}
end

-- Play a single-actor registry clip on a ped. opts: { flags, blendIn, blendOut, rate, duration }
-- Returns dict, clip (or nil, reason).
function Anim.play(ped, name, variant, opts)
    local dict, clip, entry = Clips.single(name, variant)
    if not dict then return nil, 'unknown clip ' .. tostring(name) end
    local ok, err = Anim.load(dict)
    if not ok then return nil, err end
    local p = Clips.playback(entry)
    opts = opts or {}
    TaskPlayAnim(ped, dict, clip,
        opts.blendIn or p.blendIn, opts.blendOut or p.blendOut,
        opts.duration or -1, opts.flags or p.flags, opts.rate or 0.0, false, false, false)
    Anim.release(dict) -- the task keeps the clip alive; our reference is only for loading
    return dict, clip
end

function Anim.isPlaying(ped, dict, clip)
    return IsEntityPlayingAnim(ped, dict, clip, 3)
end

-- Seconds elapsed in a clip currently playing on an entity (nil if not playing).
function Anim.elapsed(ped, dict, clip, duration)
    if not IsEntityPlayingAnim(ped, dict, clip, 3) then return nil end
    return GetEntityAnimCurrentTime(ped, dict, clip) * duration
end

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() then Anim.releaseAll() end
end)
