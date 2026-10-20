-- "Im Spiel testen": plays the converted .ycd on the REAL peds and measures contact points.
-- Rule from the in-game tests: GTA puts a synced-scene ped at the origin of ITS scene and ignores
-- the clip's start offset. Pair clips start at identity, so every actor plays in its OWN scene
-- at sceneFrame * origin[actor], both started in the same frame. The studio peds are local, so
-- local synchronized scenes are used (networked scenes in your scripts: see the report).
StudioPlay = { active = nil }

local U = JJS.U

-- TASK_SYNCHRONIZED_SCENE(ped, scene, dict, clip, blendIn, blendOut, sceneFlags, ragdollFlags,
-- moverBlendDelta, ikFlags). VERIFY: the parameter names in citizenfx/natives are legacy
-- ("speed, speedMultiplier, duration, flag, playbackRate"); the meaning used here follows the
-- networked variant NETWORK_ADD_PED_TO_SYNCHRONISED_SCENE (same order).
local BLEND_IN, BLEND_OUT, SCENE_FLAGS, MOVER_BLEND = 1000.0, -8.0, 0, 1000.0

local function loadDict(dict)
    local deadline = GetGameTimer() + Config.Test.DictLoadTimeoutMs
    -- The stream resource was just restarted: the dictionary appears once it is mounted.
    while not DoesAnimDictExist(dict) do
        if GetGameTimer() > deadline then return false, L('dict_missing', dict) end
        Wait(100)
    end
    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        if GetGameTimer() > deadline then return false, L('dict_timeout', dict) end
        Wait(0)
    end
    return true
end

local function stopScenes(p)
    for actor in pairs(p.scenes or {}) do
        local ped = StudioPeds.ped(actor)
        if ped then ClearPedTasksImmediately(ped) end
    end
    p.scenes = {}
end

-- Start (or restart) the clip of `res` (job result) on the real peds.
-- opts: { loop, rate, phase, hold (rate 0 = show one phase), contacts = { {id, a = {actor, tag, offset}, b = {...}} } }
function StudioPlay.start(frame, res, opts)
    opts = opts or {}
    local p = StudioPlay.active
    if p then stopScenes(p) end
    local ok, err = loadDict(res.dict)
    if not ok then return false, err end
    p = { dict = res.dict, clips = res.clips, origins = res.origins or {}, scenes = {}, duration = res.duration or 1.0,
        loop = opts.loop ~= false, rate = opts.hold and 0.0 or (opts.rate or 1.0), contacts = opts.contacts or {}, started = GetGameTimer() }
    StudioPlay.active = p
    StudioPeds.freeze(false)
    StudioPeds.ghost(opts.hold == true)
    -- Create every scene first, then task all peds in the same frame.
    for actor, clip in pairs(p.clips) do
        local ped = StudioPeds.ped(actor)
        if ped then
            local o = p.origins[actor] or { x = 0.0, y = 0.0, z = 0.0, yaw = 0.0 }
            local x, y, z = U.frameToWorld(frame, o.x, o.y, o.z)
            local scene = CreateSynchronizedScene(x, y, z, 0.0, 0.0, (frame.heading + o.yaw) % 360.0, 2)
            SetSynchronizedSceneLooped(scene, p.loop)
            SetSynchronizedSceneHoldLastFrame(scene, not p.loop)
            p.scenes[actor] = { scene = scene, ped = ped, clip = clip }
        end
    end
    for _, s in pairs(p.scenes) do
        TaskSynchronizedScene(s.ped, s.scene, p.dict, s.clip, BLEND_IN, BLEND_OUT, SCENE_FLAGS, 0, MOVER_BLEND, 0)
    end
    StudioPlay.control({ action = 'phase', phase = opts.phase or 0.0 })
    StudioPlay.control({ action = 'rate', rate = p.rate })
    StudioPlay.monitor(frame)
    return true
end

function StudioPlay.control(c)
    local p = StudioPlay.active
    if not p or type(c) ~= 'table' then return end
    for _, s in pairs(p.scenes) do
        if c.action == 'rate' then SetSynchronizedSceneRate(s.scene, U.clamp(tonumber(c.rate) or 1.0, 0.0, 2.0))
        elseif c.action == 'phase' then SetSynchronizedScenePhase(s.scene, U.clamp(tonumber(c.phase) or 0.0, 0.0, 0.999))
        elseif c.action == 'loop' then SetSynchronizedSceneLooped(s.scene, c.loop == true); SetSynchronizedSceneHoldLastFrame(s.scene, c.loop ~= true) end
    end
    if c.action == 'rate' then p.rate = tonumber(c.rate) or p.rate end
    if c.action == 'loop' then p.loop = c.loop == true end
    if c.action == 'contacts' and type(c.contacts) == 'table' then p.contacts = c.contacts end
end

-- Phase + measured contact points to the NUI every Config.Test.MeasureIntervalMs.
function StudioPlay.monitor(frame)
    local p = StudioPlay.active
    if not p or p.monitoring then return end
    p.monitoring = true
    CreateThread(function()
        while StudioPlay.active == p do
            local first = p.scenes.a or select(2, next(p.scenes))
            local phase = first and IsSynchronizedSceneRunning(first.scene) and GetSynchronizedScenePhase(first.scene) or nil
            local points = {}
            for i, c in ipairs(p.contacts) do
                if i > 16 then break end
                if type(c) == 'table' and type(c.a) == 'table' and type(c.b) == 'table' then
                    local pa = StudioPeds.boneCoords(frame, c.a.actor, { { tag = c.a.tag, offset = c.a.offset } })[1]
                    local pb = StudioPeds.boneCoords(frame, c.b.actor, { { tag = c.b.tag, offset = c.b.offset } })[1]
                    if pa and pb then
                        local d = math.sqrt((pa.p[1] - pb.p[1]) ^ 2 + (pa.p[2] - pb.p[2]) ^ 2 + (pa.p[3] - pb.p[3]) ^ 2)
                        points[#points + 1] = { id = c.id, a = pa.p, b = pb.p, cm = d * 100.0, red = d * 100.0 > Config.Test.ContactRedCm }
                    end
                end
            end
            SendNUIMessage({ type = 'test:state', phase = phase, rate = p.rate, loop = p.loop, points = points })
            Wait(Config.Test.MeasureIntervalMs)
        end
    end)
end

function StudioPlay.stop(frame, keepGhost)
    local p = StudioPlay.active
    if not p then return end
    StudioPlay.active = nil
    stopScenes(p)
    RemoveAnimDict(p.dict)
    -- Back to the editing state: entities on the actors' current editing positions.
    StudioPeds.freeze(true)
    if not keepGhost then StudioPeds.ghost(true) end
    SendNUIMessage({ type = 'test:stopped' })
end
