-- Test commands. Every command is checked on the server on every call:
-- valid player -> rate limit -> role (jj_core, ACE fallback) -> argument validation.
local Net, U = JJZ.Net, JJZ.U
local suggestions = {}
JJZ.Commands = {}

local function register(key, help, params, handler)
    local name = Config.Commands[key]
    if type(name) ~= 'string' or name == '' then return end
    RegisterCommand(name, function(src, args)
        if src == 0 then
            print(('[jj_zombie] /%s is an in-game command'):format(name))
            return
        end
        if not Net.validPlayer(src) then return end
        if not Net.allow('Commands', src) then return Net.notify(src, 'rate_limited') end
        if not Integration.hasRole(src) then return Net.notify(src, 'no_permission') end
        local ok, err = pcall(handler, src, args or {})
        if not ok then Integration.log('error', ('/%s failed: %s'):format(name, tostring(err))) end
    end, false)
    local ps = {}
    for _, p in ipairs(params or {}) do ps[#ps + 1] = { name = p[1], help = L(p[2]) } end
    suggestions[#suggestions + 1] = { name = name, help = L(help), params = ps }
end
JJZ.Commands.register = register

-- Send chat suggestions only to players who may use the commands.
RegisterNetEvent(JJZ.Events.Ready, function()
    local src = source
    if not Net.validPlayer(src) or not Net.allow('Reports', src) then return end
    if Integration.hasRole(src) then
        TriggerClientEvent(JJZ.Events.Suggestions, src, suggestions)
    end
    if JJZ.Tuning then TriggerClientEvent(JJZ.Events.TuneSync, src, JJZ.Tuning.values()) end
end)

-- ------------------------------------------------------------------ /ztestanim
register('TestAnim', 'help_testanim', { { 'clip', 'help_testanim' } }, function(src, args)
    local which = (args[1] or 'wave'):lower()
    if which ~= 'bob' and which ~= 'face' and which ~= 'wave' and which ~= 'stop' then which = 'wave' end
    local onSelf = (args[2] or ''):lower() == 'self'
    TriggerClientEvent(JJZ.Events.TestAnim, src, which, onSelf)
end)

-- Result of /ztestanim from the client, logged on the server console for the developer.
RegisterNetEvent(JJZ.Events.AnimReport, function(r)
    local src = source
    if not Net.validPlayer(src) or not Net.allow('Reports', src) then return end
    if type(r) ~= 'table' then return end
    local msg = U.isStr(r.msg, 200) and r.msg or '?'
    local dict = U.isStr(r.dict, 64) and r.dict or '?'
    local clip = U.isStr(r.clip, 64) and r.clip or '?'
    Integration.log(r.ok == true and 'info' or 'warn', ('ztestanim [%s] %s/%s: %s (duration %s, expected %s)'):format(
        r.ok == true and 'OK' or 'FAIL', dict, clip, msg, tostring(U.isNum(r.duration) and U.round(r.duration, 3) or '-'),
        tostring(U.isNum(r.expected) and U.round(r.expected, 3) or '-')))
end)
