-- Dumps Config, ConfigServer, Locales and the clip registry of jj_zombie_test as JSON for the
-- consistency checks (tests/consistency.mjs).
--   lua5.4 tests/lua/dump.lua <path to jj_zombie_test>
local RES = arg[1]
JJZ = {}
local function load(p)
    local f = assert(io.open(RES .. '/' .. p))
    local s = f:read('a'):gsub('`([^`]*)`', '0')
    f:close()
    assert(load ~= nil)
    local chunk = assert(_G.load(s, '@' .. p))
    chunk()
end
vector3 = function(x, y, z) return { x = x, y = y, z = z } end
GetCurrentResourceName = function() return 'jj_zombie_test' end
IsDuplicityVersion = function() return true end
for _, p in ipairs({ 'config/config.lua', 'config/config_server.lua', 'locales/locales.lua', 'shared/constants.lua', 'shared/clips_data.lua' }) do load(p) end

local function enc(v, seen)
    local t = type(v)
    if t == 'nil' then return 'null' end
    if t == 'boolean' then return tostring(v) end
    if t == 'number' then
        if v ~= v or v == math.huge or v == -math.huge then return 'null' end
        return (math.type(v) == 'integer') and tostring(v) or string.format('%.17g', v)
    end
    if t == 'string' then
        return '"' .. v:gsub('[%c"\\]', function(c)
            local m = { ['"'] = '\\"', ['\\'] = '\\\\', ['\n'] = '\\n', ['\r'] = '\\r', ['\t'] = '\\t' }
            return m[c] or string.format('\\u%04x', c:byte())
        end) .. '"'
    end
    if t == 'table' then
        seen = seen or {}
        if seen[v] then return 'null' end
        seen[v] = true
        local n = #v
        local isArr = n > 0
        if isArr then for k in pairs(v) do if math.type(k) ~= 'integer' or k < 1 or k > n then isArr = false break end end end
        local parts = {}
        if isArr then
            for i = 1, n do parts[#parts + 1] = enc(v[i], seen) end
            seen[v] = nil
            return '[' .. table.concat(parts, ',') .. ']'
        end
        local keys = {}
        for k in pairs(v) do keys[#keys + 1] = k end
        table.sort(keys, function(a, b) return tostring(a) < tostring(b) end)
        for _, k in ipairs(keys) do parts[#parts + 1] = enc(tostring(k)) .. ':' .. enc(v[k], seen) end
        seen[v] = nil
        return '{' .. table.concat(parts, ',') .. '}'
    end
    return 'null'
end
print(enc({ Config = Config, ConfigServer = ConfigServer, Locales = Locales, Events = JJZ.Events, LocalEvents = JJZ.LocalEvents, State = JJZ.State, PlayerState = JJZ.PlayerState, ClipData = ClipData }))
