-- Small shared helpers (pure Lua, no natives except time where noted).
JJZ = JJZ or {}
local U = {}
JJZ.U = U

function U.clamp(x, a, b)
    if x < a then return a end
    if x > b then return b end
    return x
end

function U.round(x, d)
    local m = 10 ^ (d or 0)
    return math.floor(x * m + 0.5) / m
end

-- Strict argument validators (used by every network handler).
function U.isInt(v, min, max)
    return math.type(v) == 'integer' and (not min or v >= min) and (not max or v <= max)
end
function U.isNum(v, min, max)
    return type(v) == 'number' and v == v and v ~= math.huge and v ~= -math.huge
        and (not min or v >= min) and (not max or v <= max)
end
function U.isStr(v, maxLen, pattern)
    return type(v) == 'string' and #v <= (maxLen or 64) and (not pattern or v:match(pattern) ~= nil)
end

-- Sliding-window rate limiter: allow `max` hits per `perMs` per key.
function U.newLimiter(max, perMs)
    local hits = {}
    local lim = {}
    function lim.hit(key, now)
        local list = hits[key]
        if not list then list = {}; hits[key] = list end
        local cutoff = now - perMs
        local j = 1
        for i = 1, #list do
            if list[i] > cutoff then list[j] = list[i]; j = j + 1 end
        end
        for i = j, #list do list[i] = nil end
        if #list >= max then return false end
        list[#list + 1] = now
        return true
    end
    function lim.clear(key) hits[key] = nil end
    return lim
end

-- Deterministic pseudo random generator (xorshift32) for per-zombie variation.
function U.rng(seed)
    local s = (seed or 1) & 0xffffffff
    if s == 0 then s = 0x9e3779b9 end
    return function(a, b)
        s = s ~ ((s << 13) & 0xffffffff)
        s = s ~ (s >> 17)
        s = s ~ ((s << 5) & 0xffffffff)
        s = s & 0xffffffff
        local r = s / 4294967296.0
        if a then return a + (b - a) * r end
        return r
    end
end

-- Shallow copy.
function U.copy(t)
    local o = {}
    for k, v in pairs(t) do o[k] = v end
    return o
end

-- Count entries of a table.
function U.count(t)
    local n = 0
    for _ in pairs(t) do n = n + 1 end
    return n
end

-- Heading (degrees, GTA convention: 0 = +Y, counter-clockwise) from a direction.
function U.headingOf(dx, dy)
    return (math.deg(math.atan(-dx, dy)) + 360.0) % 360.0
end

-- Shortest signed angle difference a - b in degrees (-180..180].
function U.angleDiff(a, b)
    local d = (a - b + 180.0) % 360.0 - 180.0
    if d == -180.0 then d = 180.0 end
    return d
end

-- Debug print that only fires when Config.Debug is true.
function U.dbg(fmt, ...)
    if Config and Config.Debug then
        print(('[jj_zombie] ' .. fmt):format(...))
    end
end
