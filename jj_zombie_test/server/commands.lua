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

-- ------------------------------------------------------------------ live tuning (/ztune)
JJZ.Tuning = {}
function JJZ.Tuning.values()
    local out = {}
    for key, def in pairs(Config.Tunable) do out[key] = Config[def[1]][def[2]] end
    return out
end

-- ------------------------------------------------------------------ zombie commands
register('Spawn', 'help_spawn', { { 'anzahl', 'help_spawn_count' }, { 'typ', 'help_spawn_type' } }, function(src, args)
    local count = tonumber(args[1]) or 1
    local t = args[2] and args[2]:lower() or nil
    if args[1] and not tonumber(args[1]) then t = args[1]:lower(); count = 1 end
    JJZ.Zombies.requestSpawn(src, count, t)
end)

register('Clear', 'help_clear', { { 'alle', 'help_clear' } }, function(src, args)
    local n = JJZ.Zombies.clear(src, (args[1] or ''):lower() == 'alle' and 'all' or 'own')
    Net.notify(src, 'cleared', n)
end)

register('Kill', 'help_kill', { { 'alle', 'help_kill' } }, function(src, args)
    local n = JJZ.Zombies.kill(src, (args[1] or ''):lower() == 'alle' and 'all' or 'own')
    Net.notify(src, 'killed', n)
end)

register('Type', 'help_type', { { 'typ', 'help_spawn_type' } }, function(src, args)
    local t = (args[1] or ''):lower()
    if t ~= 'schlurfer' and t ~= 'laeufer' and t ~= 'mixed' then return Net.notify(src, 'spawn_bad_type') end
    JJZ.Zombies.setDefaultType(src, t)
    Net.notify(src, 'type_set', t)
end)

register('Freeze', 'help_freeze', {}, function(src)
    local on = not JJZ.Zombies.isFrozen()
    JJZ.Zombies.setFrozen(on)
    Net.notify(src, on and 'ai_frozen' or 'ai_resumed')
end)

register('Debug', 'help_debug', {}, function(src)
    TriggerClientEvent(JJZ.Events.ToggleDebug, src)
end)

register('Finisher', 'help_finisher', {}, function(src)
    JJZ.Finisher.forceStart(src)
end)

register('Tune', 'help_tune', { { 'key', 'help_tune' }, { 'value', 'help_tune' } }, function(src, args)
    local key, value = (args[1] or ''):lower(), tonumber(args[2])
    local def = Config.Tunable[key]
    if not def or not value then
        local keys = {}
        for k in pairs(Config.Tunable) do keys[#keys + 1] = k end
        table.sort(keys)
        return Net.notify(src, 'tune_bad', table.concat(keys, ', '))
    end
    value = U.clamp(value, def[3], def[4])
    Config[def[1]][def[2]] = value
    TriggerClientEvent(JJZ.Events.TuneSync, -1, { [key] = value })
    Net.notify(src, 'tune_set', ('%s.%s'):format(def[1], def[2]), tostring(value))
    Integration.log('info', ('ztune by %d: %s.%s = %s'):format(src, def[1], def[2], tostring(value)))
end)

register('Cam', 'help_cam', {}, function(src)
    TriggerClientEvent(JJZ.Events.ToggleCam, src)
end)

register('Align', 'help_align', {}, function(src)
    TriggerClientEvent(JJZ.Events.StartAlign, src)
end)

register('Capture', 'help_capture', { { 'sequenz', 'help_capture' } }, function(src, args)
    JJZ.Capture.start(src, (args[1] or 'shove'):lower())
end)

-- Final /zalign values from the client, printed for the developer.
RegisterNetEvent(JJZ.Events.AlignResult, function(v)
    local src = source
    if not Net.validPlayer(src) or not Net.allow('Reports', src) or not Integration.hasRole(src) then return end
    if type(v) ~= 'table' then return end
    local f = function(x) return U.isNum(x, -10, 360) and U.round(x, 3) or 0 end
    Integration.log('info', ('zalign result from %d: x=%s y=%s z=%s yaw=%s'):format(src, f(v.x), f(v.y), f(v.z), f(v.yaw)))
end)
