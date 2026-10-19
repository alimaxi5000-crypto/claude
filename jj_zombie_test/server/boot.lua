-- Startup: config validation with friendly messages, build info, cleanup hooks.
local res = GetCurrentResourceName()

local function warn(msg) print(('^3[%s] %s^0'):format(res, msg)) end

local function validate()
    local ok = true
    local s = Config.Spawn
    if type(s.Model) ~= 'string' or s.Model == '' then warn('Config.Spawn.Model is missing - using u_m_y_zombie_01'); s.Model = 'u_m_y_zombie_01' end
    if s.DistanceMin > s.DistanceMax then warn('Config.Spawn.DistanceMin > DistanceMax - swapped'); s.DistanceMin, s.DistanceMax = s.DistanceMax, s.DistanceMin end
    s.MaxPerCommand = math.max(1, math.min(5, math.floor(s.MaxPerCommand or 5)))
    for name, t in pairs(Config.Types) do
        if type(t.Health) ~= 'number' or t.Health <= 100 then warn(('Config.Types.%s.Health must be > 100 - set to 200'):format(name)); t.Health = 200 end
        if type(t.GrabStrength) ~= 'number' or t.GrabStrength <= 0 then t.GrabStrength = 1.0 end
    end
    local f = Config.Finisher
    if f.TimeLimitSeconds < 1.0 then warn('Config.Finisher.TimeLimitSeconds too small - set to 7'); f.TimeLimitSeconds = 7.0 end
    if f.StartProgress < 0 or f.StartProgress > 95 then f.StartProgress = 30 end
    if not Locales[Config.Locale] then warn(('Config.Locale "%s" unknown - using de'):format(tostring(Config.Locale))); Config.Locale = 'de' end
    if not ClipData or not ClipData.scenes then warn('shared/clips_data.lua missing - run the animation build'); ok = false end
    return ok
end

CreateThread(function()
    validate()
    local b = ClipData and ClipData.build or {}
    local dicts = {}
    for d, n in pairs(b.dicts or {}) do
        local exists = LoadResourceFile(res, ('stream/%s.ycd'):format(d)) ~= nil
        dicts[#dicts + 1] = ('%s(%d clips%s)'):format(d, n, exists and '' or ', FILE MISSING')
        if not exists then warn(('stream/%s.ycd is missing'):format(d)) end
    end
    table.sort(dicts)
    local sk = {}
    for k, v in pairs(b.skeletons or {}) do sk[#sk + 1] = k .. '=' .. v end
    table.sort(sk)
    print(('[%s] ready. Clip dictionaries: %s'):format(res, table.concat(dicts, ', ')))
    print(('[%s] Animation skeletons: %s'):format(res, table.concat(sk, ', ')))
end)
