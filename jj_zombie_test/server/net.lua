-- Server networking helpers: player validation, rate limits, safe client triggers.
JJZ = JJZ or {}
local Net = {}
JJZ.Net = Net

local U = JJZ.U
local limiters = {}

-- Named per-player rate limit (config in ConfigServer.RateLimit).
function Net.allow(name, src)
    local lim = limiters[name]
    if not lim then
        local c = ConfigServer.RateLimit[name] or { max = 10, perMs = 1000 }
        lim = U.newLimiter(c.max, c.perMs)
        limiters[name] = lim
    end
    return lim.hit(src, GetGameTimer())
end

function Net.clearPlayer(src)
    for _, lim in pairs(limiters) do lim.clear(src) end
end

-- True if src is a connected player with a ped.
function Net.validPlayer(src)
    if type(src) ~= 'number' or src <= 0 then return false end
    if not DoesPlayerExist(src) then return false end
    local ped = GetPlayerPed(src)
    return ped ~= 0 and DoesEntityExist(ped)
end

function Net.coordsOf(src)
    return GetEntityCoords(GetPlayerPed(src))
end

-- Suspicious behaviour handler (ConfigServer.Input.OnSuspicious).
function Net.suspicious(src, reason)
    if ConfigServer.Log.Suspicious then
        Integration.log('warn', ('suspicious input from %s (%d): %s'):format(GetPlayerName(src) or '?', src, reason))
    end
    if ConfigServer.Input.OnSuspicious == 'kick' then
        DropPlayer(src, 'jj_zombie: invalid input')
    end
end

function Net.notify(src, key, ...)
    Integration.notify(src, L(key, ...))
end
