-- Minimal FiveM environment for running jj_animstudio's real Lua files under plain Lua 5.4:
-- virtual clock + coroutine threads, net events, players with ACE, in-memory resource files,
-- resource start/stop, exports, a JSON library (encode/decode) and client native stubs.
-- Only what the resource uses is implemented.
local M = { now = 0, threads = {}, handlers = {}, sent = {}, files = {}, players = {}, errors = {}, resources = {}, cmds = {}, natives = {} }
_G.MOCK = M

-- ------------------------------------------------------------------ JSON (compatible subset)
local json = {}
local function esc(s)
    return s:gsub('[%c"\\]', function(c)
        local map = { ['"'] = '\\"', ['\\'] = '\\\\', ['\n'] = '\\n', ['\r'] = '\\r', ['\t'] = '\\t' }
        return map[c] or ('\\u%04x'):format(c:byte())
    end)
end
local function isArray(t)
    local n = 0
    for k in pairs(t) do
        if type(k) ~= 'number' or k <= 0 or k % 1 ~= 0 then return false end
        n = math.max(n, k)
    end
    return n == #t
end
function json.encode(v)
    local t = type(v)
    if v == nil then return 'null' end
    if t == 'boolean' then return tostring(v) end
    if t == 'number' then
        if v ~= v or v == math.huge or v == -math.huge then return 'null' end
        if math.type(v) == 'integer' then return tostring(v) end
        return ('%.14g'):format(v)
    end
    if t == 'string' then return '"' .. esc(v) .. '"' end
    if t == 'table' then
        if next(v) == nil then return '[]' end   -- like the FiveM json library: empty table -> []
        if isArray(v) then
            local out = {}
            for i = 1, #v do out[i] = json.encode(v[i]) end
            return '[' .. table.concat(out, ',') .. ']'
        end
        local keys = {}
        for k in pairs(v) do keys[#keys + 1] = tostring(k) end
        table.sort(keys)
        local out = {}
        for _, k in ipairs(keys) do out[#out + 1] = '"' .. esc(k) .. '":' .. json.encode(v[k] == nil and v[tonumber(k)] or v[k]) end
        return '{' .. table.concat(out, ',') .. '}'
    end
    error('cannot encode ' .. t)
end
function json.decode(s)
    if type(s) ~= 'string' then error('json.decode expects a string') end
    local i = 1
    local function ws() i = s:find('[^ \t\r\n]', i) or #s + 1 end
    local val
    local function str()
        i = i + 1
        local out = {}
        while true do
            local c = s:sub(i, i)
            if c == '' then error('unterminated string') end
            if c == '"' then i = i + 1; break end
            if c == '\\' then
                local n = s:sub(i + 1, i + 1)
                local map = { n = '\n', r = '\r', t = '\t', b = '\b', f = '\f', ['"'] = '"', ['\\'] = '\\', ['/'] = '/' }
                if n == 'u' then out[#out + 1] = utf8.char(tonumber(s:sub(i + 2, i + 5), 16)); i = i + 6
                elseif map[n] then out[#out + 1] = map[n]; i = i + 2
                else error('bad escape') end
            else out[#out + 1] = c; i = i + 1 end
        end
        return table.concat(out)
    end
    function val()
        ws()
        local c = s:sub(i, i)
        if c == '{' then
            i = i + 1; local o = {}; ws()
            if s:sub(i, i) == '}' then i = i + 1; return o end
            while true do
                ws(); if s:sub(i, i) ~= '"' then error('expected key at ' .. i) end
                local k = str(); ws()
                if s:sub(i, i) ~= ':' then error('expected : at ' .. i) end
                i = i + 1
                o[k] = val(); ws()
                local d = s:sub(i, i); i = i + 1
                if d == '}' then return o end
                if d ~= ',' then error('expected , at ' .. i) end
            end
        elseif c == '[' then
            i = i + 1; local a = {}; ws()
            if s:sub(i, i) == ']' then i = i + 1; return a end
            while true do
                a[#a + 1] = val(); ws()
                local d = s:sub(i, i); i = i + 1
                if d == ']' then return a end
                if d ~= ',' then error('expected , in array') end
            end
        elseif c == '"' then return str()
        elseif s:sub(i, i + 3) == 'true' then i = i + 4; return true
        elseif s:sub(i, i + 4) == 'false' then i = i + 5; return false
        elseif s:sub(i, i + 3) == 'null' then i = i + 4; return nil
        else
            local num = s:match('^-?%d+%.?%d*[eE]?[-+]?%d*', i)
            if not num or num == '' then error('unexpected ' .. c .. ' at ' .. i) end
            i = i + #num
            return tonumber(num)
        end
    end
    local r = val(); ws()
    if i <= #s then error('trailing data at ' .. i) end
    return r
end
_G.json = json

-- ------------------------------------------------------------------ scheduler
function GetGameTimer() return M.now end
function CreateThread(fn) M.threads[#M.threads + 1] = { co = coroutine.create(fn), wake = M.now } end
function Wait(ms)
    local _, main = coroutine.running()
    if main then error('Wait() outside a thread', 2) end
    coroutine.yield(ms or 0)
end
function SetTimeout(ms, fn) CreateThread(function() Wait(ms); fn() end) end
local function resume(t)
    local ok, ms = coroutine.resume(t.co)
    if not ok then M.errors[#M.errors + 1] = debug.traceback(t.co, tostring(ms)); t.dead = true; return end
    if coroutine.status(t.co) == 'dead' then t.dead = true else t.wake = M.now + (ms or 0) end
end
function M.runDue()
    for _ = 1, 200 do
        local any = false
        for _, t in ipairs(M.threads) do if not t.dead and t.wake <= M.now then any = true; resume(t) end end
        local live = {}
        for _, t in ipairs(M.threads) do if not t.dead then live[#live + 1] = t end end
        M.threads = live
        if not any then return end
        local again = false
        for _, t in ipairs(M.threads) do if t.wake <= M.now then again = true end end
        if not again then return end
        M.now = M.now + 1
    end
end
function M.advance(ms, step)
    step = step or 50
    local target = M.now + ms
    while M.now < target do M.now = math.min(target, M.now + step); M.clock = (M.clock or 1.7e9) + step / 1000; M.runDue() end
end

-- os.time follows the virtual clock (seconds since 1970).
M.clock = 1.7e9
local realTime = os.time
os.time = function(t) if t then return realTime(t) end return math.floor(M.clock) end

-- ------------------------------------------------------------------ events
source = nil
local function addHandler(name, fn) M.handlers[name] = M.handlers[name] or {}; table.insert(M.handlers[name], fn) end
function RegisterNetEvent(name, fn) if fn then addHandler(name, fn) end end
function AddEventHandler(name, fn) addHandler(name, fn) end
-- Fire an event as player `src` (handlers run in their own thread like in FiveM).
function M.fire(name, src, ...)
    local args = table.pack(...)
    for _, fn in ipairs(M.handlers[name] or {}) do
        local co = coroutine.create(function() source = src; fn(table.unpack(args, 1, args.n)) end)
        local ok, ms = coroutine.resume(co)
        if not ok then M.errors[#M.errors + 1] = debug.traceback(co, tostring(ms))
        elseif coroutine.status(co) ~= 'dead' then M.threads[#M.threads + 1] = { co = co, wake = M.now + (ms or 0) } end
    end
    M.runDue()
end
function TriggerEvent(name, ...) M.fire(name, nil, ...) end
local function record(name, target, latent, ...)
    M.sent[#M.sent + 1] = { name = name, target = target, latent = latent, args = table.pack(...) }
end
function TriggerClientEvent(name, target, ...) record(name, target, false, ...) end
function TriggerLatentClientEvent(name, target, _bps, ...) record(name, target, true, ...) end
function M.sentTo(target, name)
    local out = {}
    for _, s in ipairs(M.sent) do if s.target == target and (not name or s.name == name) then out[#out + 1] = s end end
    return out
end
function M.last(target, name) local l = M.sentTo(target, name); return l[#l] end
function M.clearSent() M.sent = {} end

-- ------------------------------------------------------------------ players, ACE, exports
function M.addPlayer(src, props) M.players[src] = props or {} end
function GetPlayerName(src) local p = M.players[tonumber(src)]; return p and (p.name or ('p' .. src)) or nil end
function IsPlayerAceAllowed(src, ace) local p = M.players[tonumber(src)]; return p ~= nil and p.ace == true and ace == 'jj_animstudio.use' end
exports = setmetatable({}, { __index = function(_, res) return M.exportsOf and M.exportsOf[res] or setmetatable({}, { __index = function() error('export of ' .. res .. ' not available') end }) end })

-- ------------------------------------------------------------------ resource files + resources
M.base = '/srv/resources/jj_animstudio'
function GetCurrentResourceName() return 'jj_animstudio' end
function GetResourcePath() return M.base end
function LoadResourceFile(_, p) return M.files[p] end
function SaveResourceFile(_, p, data, len)
    if M.readOnly then return false end
    assert(type(data) == 'string', 'SaveResourceFile data must be a string')
    assert(len == -1 or len == #data, 'SaveResourceFile length mismatch')
    assert(not p:find('%.%.'), 'path traversal in ' .. p)
    M.files[p] = data
    return true
end
local realRemove = os.remove
os.remove = function(p)
    if p:sub(1, #M.base + 1) == M.base .. '/' then
        local rel = p:sub(#M.base + 2)
        if M.files[rel] then M.files[rel] = nil; return true end
        return nil, 'not found'
    end
    return realRemove(p)
end
function GetResourceState(r) return M.resources[r] or (M.exportsOf and M.exportsOf[r] and 'started') or 'missing' end
function StopResource(r) M.cmds[#M.cmds + 1] = 'stop ' .. r; if M.resources[r] then M.resources[r] = 'stopped' end return true end
function StartResource(r) M.cmds[#M.cmds + 1] = 'start ' .. r; if M.resources[r] and not M.failStart then M.resources[r] = 'started' end return true end
function ExecuteCommand(c) M.cmds[#M.cmds + 1] = c; local r = c:match('^ensure (.+)$'); if r and M.resources[r] then M.resources[r] = 'started' end end

-- ------------------------------------------------------------------ client stubs (for loading client files)
function M.stubClient()
    -- Resource globals (read with `X = X or {}`) must stay nil until the resource defines them.
    local own = { Locales = true, Config = true, ConfigServer = true, JJS = true, L = true, Studio = true, StudioCam = true, StudioPeds = true, StudioPlay = true, Storage = true, Jobs = true, Editable = true, MOCK = true }
    local mt = { __index = function(_, k)
        if type(k) == 'string' and k:match('^%u') and not own[k] then
            return function(...)
                M.natives[#M.natives + 1] = { k, ... }
                local r = M.nativeResult and M.nativeResult(k, ...)
                if r == nil then return 0 end
                return r
            end
        end
    end }
    setmetatable(_G, mt)
    function vector3(x, y, z) return { x = x, y = y, z = z } end
    M.nui = {}
    function RegisterNUICallback(name, fn) M.nui[name] = fn end
    function RegisterNuiCallback(name, fn) M.nui[name] = fn end
    function SendNUIMessage(m) M.nuiSent = M.nuiSent or {}; M.nuiSent[#M.nuiSent + 1] = m end
    function RegisterCommand(name, fn) M.commands = M.commands or {}; M.commands[name] = fn end
    function TriggerServerEvent(name, ...) M.toServer = M.toServer or {}; M.toServer[#M.toServer + 1] = { name = name, latent = false, args = table.pack(...) } end
    function TriggerLatentServerEvent(name, _bps, ...) M.toServer = M.toServer or {}; M.toServer[#M.toServer + 1] = { name = name, latent = true, args = table.pack(...) } end
    function PlayerPedId() return 1 end
end

-- ------------------------------------------------------------------ loading the resource
local realPrint = print
M.printed = {}
function print(...) local t = {}; for i = 1, select('#', ...) do t[#t + 1] = tostring(select(i, ...)) end; M.printed[#M.printed + 1] = table.concat(t, ' ') end
M.print = realPrint

function M.loadFile(path)
    local f = assert(io.open(path, 'r'))
    local src = f:read('a')
    f:close()
    local chunk, err = load(src, '@' .. path, 't', _G)
    if not chunk then error(err) end
    chunk()
end

-- Load shared + one side of the resource in manifest order.
function M.loadResource(dir, side)
    local f = assert(io.open(dir .. '/fxmanifest.lua', 'r'))
    local man = f:read('a')
    f:close()
    local function list(key)
        local block = man:match(key .. '%s*(%b{})')
        local out = {}
        if block then for p in block:gmatch("'([^']+)'") do if not p:find('^@') then out[#out + 1] = p end end end
        return out
    end
    for _, p in ipairs(list('shared_scripts')) do M.loadFile(dir .. '/' .. p) end
    for _, p in ipairs(list(side == 'client' and 'client_scripts' or 'server_scripts')) do M.loadFile(dir .. '/' .. p) end
end

return M
