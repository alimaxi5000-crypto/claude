-- Small shared helpers (pure Lua, no natives).
JJS = JJS or {}
JJS.U = {}
local U = JJS.U

-- Names of projects / poses / dictionaries: lowercase a-z, 0-9 and _ only.
function U.validName(s, maxLen)
    return type(s) == 'string' and #s >= 1 and #s <= (maxLen or JJS.NAME_MAX) and s:match('^[a-z0-9_]+$') ~= nil
end

-- Resource names may also contain upper case letters and '-'.
function U.validResource(s)
    return type(s) == 'string' and #s >= 1 and #s <= 64 and s:match('^[A-Za-z0-9_%-]+$') ~= nil
end

function U.clamp(x, a, b)
    if x < a then return a elseif x > b then return b end
    return x
end

-- Scene frame (origin + heading in degrees) -> world position of a frame-space point.
-- Heading 0 faces +Y, counter-clockwise (GTA).
function U.frameToWorld(frame, x, y, z)
    local r = math.rad(frame.heading)
    local c, s = math.cos(r), math.sin(r)
    return frame.x + x * c - y * s, frame.y + x * s + y * c, frame.z + z
end

-- World -> frame space.
function U.worldToFrame(frame, x, y, z)
    local r = math.rad(-frame.heading)
    local c, s = math.cos(r), math.sin(r)
    local dx, dy = x - frame.x, y - frame.y
    return dx * c - dy * s, dx * s + dy * c, z - frame.z
end

function U.count(t)
    local n = 0
    for _ in pairs(t or {}) do n = n + 1 end
    return n
end
