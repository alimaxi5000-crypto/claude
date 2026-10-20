-- Studio peds: the player's own ped is actor "a" (shown as a semi-transparent ghost while
-- editing), a pair partner is actor "b" (spawned locally, NOT networked, deleted on close).
StudioPeds = { actors = {}, saved = nil }

local U = JJS.U

local function allowedModel(model)
    for _, m in ipairs(Config.PartnerModels) do if m.model == model then return true end end
    return false
end

local function loadModel(hash)
    if not IsModelInCdimage(hash) or not IsModelAPed(hash) then return false end
    RequestModel(hash)
    local deadline = GetGameTimer() + 5000
    while not HasModelLoaded(hash) do
        if GetGameTimer() > deadline then return false end
        Wait(0)
    end
    return true
end

local function freeze(ped, on)
    FreezeEntityPosition(ped, on)
    SetEntityInvincible(ped, true)
end

function StudioPeds.begin(frame)
    local ped = PlayerPedId()
    StudioPeds.saved = { coords = GetEntityCoords(ped, false), heading = GetEntityHeading(ped) }
    ClearPedTasksImmediately(ped)
    SetEntityCoordsNoOffset(ped, frame.x, frame.y, frame.z, false, false, false)
    SetEntityHeading(ped, frame.heading)
    freeze(ped, true)
    StudioPeds.actors.a = { ped = ped, own = true }
    StudioPeds.ghost(true)
end

function StudioPeds.ped(actor)
    local a = StudioPeds.actors[actor]
    return a and DoesEntityExist(a.ped) and a.ped or nil
end

-- Semi-transparent while editing, solid during "Im Spiel testen".
function StudioPeds.ghost(on)
    for _, a in pairs(StudioPeds.actors) do
        if DoesEntityExist(a.ped) then
            if on then SetEntityAlpha(a.ped, Config.GhostAlpha, false) else ResetEntityAlpha(a.ped) end
        end
    end
end

-- Place an actor's entity at a scene-frame position (x, y, z) with a yaw (degrees).
function StudioPeds.place(frame, actor, p, yaw)
    local ped = StudioPeds.ped(actor)
    if not ped then return end
    local x, y, z = U.frameToWorld(frame, p[1] or 0.0, p[2] or 0.0, p[3] or 0.0)
    SetEntityCoordsNoOffset(ped, x, y, z, false, false, false)
    SetEntityHeading(ped, (frame.heading + (yaw or 0.0)) % 360.0)
end

-- Spawn / replace / remove (model nil) the local partner ped.
function StudioPeds.partner(frame, model, p, yaw)
    local old = StudioPeds.actors.b
    if old and DoesEntityExist(old.ped) then DeleteEntity(old.ped) end
    StudioPeds.actors.b = nil
    if not model then return true end
    if not allowedModel(model) then return false, L('model_invalid', tostring(model)) end
    local hash = GetHashKey(model)
    if not loadModel(hash) then return false, L('model_invalid', model) end
    local x, y, z = U.frameToWorld(frame, p[1] or 0.0, p[2] or 0.9, p[3] or 0.0)
    local ped = CreatePed(4, hash, x, y, z, (frame.heading + (yaw or 180.0)) % 360.0, false, false)
    SetModelAsNoLongerNeeded(hash)
    if not ped or ped == 0 then return false, L('model_invalid', model) end
    SetEntityAsMissionEntity(ped, true, true)
    SetBlockingOfNonTemporaryEvents(ped, true)
    SetPedDefaultComponentVariation(ped)
    SetPedCanRagdoll(ped, false)
    freeze(ped, true)
    SetEntityAlpha(ped, Config.GhostAlpha, false)
    StudioPeds.actors.b = { ped = ped, own = false, model = model }
    return true
end

-- Frame-space positions of bones (by bone tag) of an actor; offsets are in the bone's frame.
function StudioPeds.boneCoords(frame, actor, list)
    local ped = StudioPeds.ped(actor)
    local out = {}
    if not ped then return out end
    for i, b in ipairs(list) do
        if i > 64 then break end
        local tag = tonumber(b.tag)
        if tag then
            local o = type(b.offset) == 'table' and b.offset or {}
            local w = GetPedBoneCoords(ped, tag, tonumber(o[1]) or 0.0, tonumber(o[2]) or 0.0, tonumber(o[3]) or 0.0)
            local x, y, z = U.worldToFrame(frame, w.x, w.y, w.z)
            out[#out + 1] = { tag = tag, id = b.id, p = { x, y, z } }
        end
    end
    return out
end

function StudioPeds.freeze(on)
    for _, a in pairs(StudioPeds.actors) do if DoesEntityExist(a.ped) then FreezeEntityPosition(a.ped, on) end end
end

function StudioPeds.restore()
    local b = StudioPeds.actors.b
    if b and DoesEntityExist(b.ped) then DeleteEntity(b.ped) end
    local a = StudioPeds.actors.a
    if a and DoesEntityExist(a.ped) then
        ClearPedTasks(a.ped)
        ResetEntityAlpha(a.ped)
        FreezeEntityPosition(a.ped, false)
        SetEntityInvincible(a.ped, false)
        local s = StudioPeds.saved
        if s then
            SetEntityCoordsNoOffset(a.ped, s.coords.x, s.coords.y, s.coords.z, false, false, false)
            SetEntityHeading(a.ped, s.heading)
        end
    end
    StudioPeds.actors, StudioPeds.saved = {}, nil
end
