-- Minimal FiveM server environment for running jj_zombie_test's real shared + server Lua files
-- under plain Lua 5.4: virtual clock, coroutine threads (CreateThread / Wait), net and local
-- events, state bags, players and entities, exports, CfxLua vectors and backtick hashes.
-- Only what the resource uses is implemented; unknown natives raise a clear error.
local M = { now = 0, threads = {}, handlers = {}, sent = {}, logs = {}, players = {}, entities = {}, nextEnt = 1000, exportsReg = {} }
_G.MOCK = M

-- ------------------------------------------------------------------ vectors
local V = {}
V.__index = function(v, k)
    if k == 'xy' then return setmetatable({ x = v.x, y = v.y, z = 0.0 }, V) end
    return rawget(V, k)
end
V.__add = function(a, b) return vector3(a.x + b.x, a.y + b.y, a.z + b.z) end
V.__sub = function(a, b) return vector3(a.x - b.x, a.y - b.y, a.z - b.z) end
V.__mul = function(a, b)
    if type(a) == 'number' then a, b = b, a end
    if type(b) == 'number' then return vector3(a.x * b, a.y * b, a.z * b) end
    return vector3(a.x * b.x, a.y * b.y, a.z * b.z)
end
V.__div = function(a, b) return vector3(a.x / b, a.y / b, a.z / b) end
V.__unm = function(a) return vector3(-a.x, -a.y, -a.z) end
V.__len = function(a) return math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z) end
V.__eq = function(a, b) return a.x == b.x and a.y == b.y and a.z == b.z end
V.__tostring = function(a) return ('vector3(%.3f, %.3f, %.3f)'):format(a.x, a.y, a.z) end
function vector3(x, y, z) return setmetatable({ x = x + 0.0, y = y + 0.0, z = (z or 0) + 0.0 }, V) end
vec3 = vector3
function vector2(x, y) return vector3(x, y, 0) end

-- ------------------------------------------------------------------ joaat (GetHashKey)
function M.joaat(s)
    s = s:lower()
    local h = 0
    for i = 1, #s do
        h = (h + s:byte(i)) & 0xffffffff
        h = (h + (h << 10)) & 0xffffffff
        h = h ~ (h >> 6)
    end
    h = (h + (h << 3)) & 0xffffffff
    h = h ~ (h >> 11)
    h = (h + (h << 15)) & 0xffffffff
    if h >= 0x80000000 then h = h - 0x100000000 end
    return h
end
GetHashKey = M.joaat

-- CfxLua compile-time hashes: `name` -> number literal, applied when loading resource files.
function M.loadfile(path)
    local f = assert(io.open(path, 'r'))
    local src = f:read('a')
    f:close()
    src = src:gsub('`([^`]*)`', function(name) return tostring(M.joaat(name)) end)
    local chunk, err = load(src, '@' .. path, 't', _G)
    if not chunk then error(err) end
    return chunk
end

-- ------------------------------------------------------------------ scheduler
function GetGameTimer() return M.now end
function CreateThread(fn)
    local co = coroutine.create(fn)
    M.threads[#M.threads + 1] = { co = co, wake = M.now }
end
Citizen = { CreateThread = CreateThread }
function Wait(ms)
    local co, main = coroutine.running()
    if main then error('Wait() called outside a thread', 2) end
    coroutine.yield(ms or 0)
end
SetTimeout = function(ms, fn) CreateThread(function() Wait(ms); fn() end) end

local function resume(t)
    local ok, ms = coroutine.resume(t.co)
    if not ok then
        M.errors = M.errors or {}
        M.errors[#M.errors + 1] = debug.traceback(t.co, tostring(ms))
        t.dead = true
        return
    end
    if coroutine.status(t.co) == 'dead' then t.dead = true else t.wake = M.now + (ms or 0) end
end

-- Run every thread that is due at the current time (repeatedly for Wait(0) chains, bounded).
function M.runDue()
    for _ = 1, 50 do
        local any = false
        for _, t in ipairs(M.threads) do
            if not t.dead and t.wake <= M.now then any = true; resume(t) end
        end
        local live = {}
        for _, t in ipairs(M.threads) do if not t.dead then live[#live + 1] = t end end
        M.threads = live
        if not any then return end
        -- Wait(0) threads wake again at the same time: give them one more round only if they
        -- asked for 0 ms (avoid infinite loops of busy threads by the 50-round bound).
        local again = false
        for _, t in ipairs(M.threads) do if t.wake <= M.now then again = true end end
        if not again then return end
        M.now = M.now + 1
    end
end

-- Advance the virtual clock in steps, running due threads.
function M.advance(ms, step)
    step = step or 10
    local target = M.now + ms
    while M.now < target do
        M.now = math.min(target, M.now + step)
        M.runDue()
    end
end

-- ------------------------------------------------------------------ events
source = nil
local function addHandler(name, fn)
    M.handlers[name] = M.handlers[name] or {}
    table.insert(M.handlers[name], fn)
end
function RegisterNetEvent(name, fn) if fn then addHandler(name, fn) end end
RegisterServerEvent = RegisterNetEvent
function AddEventHandler(name, fn) addHandler(name, fn) end
-- Run handlers as a player (src) or the server (nil -> source = '' like FXServer).
function M.fire(name, src, ...)
    local args = table.pack(...)
    for _, fn in ipairs(M.handlers[name] or {}) do
        local co = coroutine.create(function()
            source = src
            fn(table.unpack(args, 1, args.n))
        end)
        local ok, err = coroutine.resume(co)
        if not ok then
            M.errors = M.errors or {}
            M.errors[#M.errors + 1] = debug.traceback(co, ('%s: %s'):format(name, tostring(err)))
        elseif coroutine.status(co) ~= 'dead' then
            M.threads[#M.threads + 1] = { co = co, wake = M.now }
        end
    end
end
function TriggerEvent(name, ...) M.fire(name, nil, ...) end
function TriggerClientEvent(name, target, ...)
    M.sent[#M.sent + 1] = { name = name, target = target, args = table.pack(...) }
end
TriggerLatentClientEvent = function(name, target, _, ...) TriggerClientEvent(name, target, ...) end
function M.sentTo(target, name)
    local out = {}
    for _, s in ipairs(M.sent) do if s.target == target and (not name or s.name == name) then out[#out + 1] = s end end
    return out
end

function RegisterCommand(name, fn) M.commands = M.commands or {}; M.commands[name] = fn end

-- ------------------------------------------------------------------ state bags
local function newBag()
    local data = {}
    local bag = {}
    return setmetatable(bag, {
        __index = function(_, k)
            if k == 'set' then return function(_, key, value) data[key] = value end end
            return data[k]
        end,
        __newindex = function(_, k, v) data[k] = v end,
    })
end
local playerBags, entityBags = {}, {}
function Player(src)
    playerBags[src] = playerBags[src] or newBag()
    return { state = playerBags[src] }
end
function Entity(ent)
    entityBags[ent] = entityBags[ent] or newBag()
    return { state = entityBags[ent] }
end
GlobalState = newBag()

-- ------------------------------------------------------------------ players / entities
function M.newEntity(props)
    M.nextEnt = M.nextEnt + 1
    local e = { exists = true, pos = vector3(0, 0, 0), heading = 0.0, model = 0, health = 200, owner = 0, ragdoll = false, netId = M.nextEnt - 1000 }
    for k, v in pairs(props or {}) do e[k] = v end
    M.entities[M.nextEnt] = e
    return M.nextEnt
end
function M.addPlayer(src, props)
    local ped = M.newEntity({ pos = props and props.pos or vector3(0, 0, 30), heading = props and props.heading or 0.0, model = M.joaat(props and props.model or 'mp_m_freemode_01'), health = 200 })
    M.players[src] = { ped = ped, name = 'Player' .. src, bucket = 0, ping = props and props.ping or 40, ace = props and props.ace ~= false, vehicle = 0 }
    return ped
end
function M.removePlayer(src)
    local p = M.players[src]
    if not p then return end
    M.players[src] = nil
    M.fire('playerDropped', src, 'left')
    if M.entities[p.ped] then M.entities[p.ped].exists = false end
end
local function ent(e) return M.entities[e] end

function GetPlayers()
    local out = {}
    for src in pairs(M.players) do out[#out + 1] = tostring(src) end
    table.sort(out)
    return out
end
function DoesPlayerExist(src) return M.players[tonumber(src)] ~= nil end
function GetPlayerPed(src) local p = M.players[tonumber(src)]; return p and p.ped or 0 end
function GetPlayerName(src) local p = M.players[tonumber(src)]; return p and p.name or nil end
function GetPlayerPing(src) local p = M.players[tonumber(src)]; return p and p.ping or 0 end
function GetPlayerRoutingBucket(src) local p = M.players[tonumber(src)]; return p and p.bucket or 0 end
function IsPlayerAceAllowed(src) local p = M.players[tonumber(src)]; return p ~= nil and p.ace end
function DropPlayer(src, reason) M.dropped = M.dropped or {}; M.dropped[#M.dropped + 1] = { src = src, reason = reason }; M.removePlayer(src) end

function DoesEntityExist(e) local x = ent(e); return x ~= nil and x.exists end
function GetEntityCoords(e) local x = ent(e); return x and x.pos or vector3(0, 0, 0) end
function GetEntityHeading(e) local x = ent(e); return x and x.heading or 0.0 end
function GetEntityModel(e) local x = ent(e); return x and x.model or 0 end
function GetEntityHealth(e) local x = ent(e); return x and x.health or 0 end
function IsPedRagdoll(e) local x = ent(e); return x ~= nil and x.ragdoll end
function IsPedHandcuffed() return false end
function GetVehiclePedIsIn(e) for _, p in pairs(M.players) do if p.ped == e then return p.vehicle end end return 0 end
function NetworkGetEntityOwner(e) local x = ent(e); return x and x.owner or 0 end
function NetworkGetNetworkIdFromEntity(e) local x = ent(e); return x and x.netId or 0 end
function NetworkGetEntityFromNetworkId(id) for h, x in pairs(M.entities) do if x.netId == id then return h end end return 0 end
function SetEntityRemoteSyncedScenesAllowed(e, on) local x = ent(e); if x then x.remoteScenes = on end end
function SetEntityOrphanMode(e, m) local x = ent(e); if x then x.orphan = m end end
function SetEntityRoutingBucket(e, b) local x = ent(e); if x then x.bucket = b end end
function DeleteEntity(e) local x = ent(e); if x then x.exists = false end end
function CreatePed(_, model, x, y, z, heading)
    -- The nearest player owns new peds (like OneSync's population owner).
    local best, bd = 0, math.huge
    for src, p in pairs(M.players) do
        local d = #(GetEntityCoords(p.ped) - vector3(x, y, z))
        if d < bd then best, bd = src, d end
    end
    return M.newEntity({ pos = vector3(x, y, z), heading = heading, model = model, health = 200, owner = best, zombie = true })
end
function GetAllPeds()
    local out = {}
    for h, x in pairs(M.entities) do if x.exists then out[#out + 1] = h end end
    return out
end

-- ------------------------------------------------------------------ resources / exports / misc
function GetCurrentResourceName() return 'jj_zombie_test' end
M.resourceStates = {}
function GetResourceState(r) return M.resourceStates[r] or 'missing' end
function GetResourcePath() return M.resourcePath or '/tmp' end
function LoadResourceFile(_, p)
    local f = io.open((M.resourcePath or '.') .. '/' .. p, 'rb')
    if not f then return nil end
    local s = f:read('a'); f:close(); return s
end
GetInvokingResource = function() return nil end
IsDuplicityVersion = function() return true end
GetConvar = function(_, d) return d end
exports = setmetatable({}, {
    __call = function(_, name, fn) M.exportsReg[name] = fn end,
    __index = function(_, res)
        return setmetatable({}, { __index = function(_, fname)
            return function() error(('export %s.%s not available (resource %s not started)'):format(res, fname, res)) end
        end })
    end,
})
json = { encode = function() return '{}' end, decode = function() return {} end }

local realPrint = print
function print(...)
    local parts = {}
    for i = 1, select('#', ...) do parts[#parts + 1] = tostring(select(i, ...)) end
    M.logs[#M.logs + 1] = table.concat(parts, ' ')
    if M.verbose then realPrint(...) end
end
M.print = realPrint

-- Unknown globals that look like natives: fail loudly instead of silently returning nil.
setmetatable(_G, {
    __index = function(_, k)
        if type(k) == 'string' and k:match('^[A-Z][a-z]') and not k:match('^[A-Z][A-Z_]+$') then
            local known = { Config = 1, ConfigServer = 1, Locales = 1, Integration = 1, JJZ = 1, ClipData = 1, Clips = 1, JJ = 1, Core = 1, Needs = 1, MOCK = 1 }
            if not known[k] then error('mock: unknown global/native ' .. k, 2) end
        end
        return nil
    end,
})

-- Load the resource's shared + server files in manifest order (imports from other resources
-- are skipped: integration falls back when JJ / Core are missing).
function M.loadResource(resDir)
    M.resourcePath = resDir
    local f = assert(io.open(resDir .. '/fxmanifest.lua'))
    local manifest = f:read('a')
    f:close()
    local function list(key)
        local block = manifest:match(key .. 's%s*(%b{})')
        local out = {}
        if block then for file in block:gmatch("'([^']+)'") do if file:sub(1, 1) ~= '@' then out[#out + 1] = file end end end
        return out
    end
    for _, file in ipairs(list('shared_script')) do M.loadfile(resDir .. '/' .. file)() end
    for _, file in ipairs(list('server_script')) do M.loadfile(resDir .. '/' .. file)() end
    M.runDue()
end

return M
