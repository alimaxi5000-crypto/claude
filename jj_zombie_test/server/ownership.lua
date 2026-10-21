-- Ownership tracking. OneSync assigns and migrates the network owner of every zombie (usually
-- the nearest player); the owner's client runs the AI/animation. The server never requests
-- control (sv_filterRequestControl 2 blocks client requests for player-owned entities anyway):
-- migration is left to OneSync, and the AI state lives in server-set state bags, so a new
-- owner continues seamlessly and there is never more than one AI driver per zombie.
JJZ = JJZ or {}
local Own = {}
JJZ.Ownership = Own

-- Current owner server id of an entity, or nil when no client owns it.
function Own.ownerOf(ent)
    if not ent or ent == 0 or not DoesEntityExist(ent) then return nil end
    local owner = NetworkGetEntityOwner(ent)
    if not owner or owner <= 0 then return nil end
    return owner
end

-- Called from the zombie tick: records owner changes (debug + statistics).
function Own.update(z)
    local o = Own.ownerOf(z.ent) or 0
    if o ~= (z.owner or 0) then
        if Config.Debug then
            print(('[jj_zombie] zombie %d owner %s -> %s'):format(z.id, tostring(z.owner or 0), tostring(o)))
        end
        z.owner = o
        z.ownerChanges = (z.ownerChanges or 0) + 1
        z.ownerSince = GetGameTimer()
    end
    return o
end

-- Send an event to whoever owns the zombie right now. Returns false if nobody owns it.
function Own.sendToOwner(z, eventName, ...)
    local o = Own.ownerOf(z.ent)
    if not o then return false end
    TriggerClientEvent(eventName, o, ...)
    return true
end

-- True if src currently owns the entity (used to validate owner-only reports).
function Own.isOwner(src, ent)
    return Own.ownerOf(ent) == src
end
