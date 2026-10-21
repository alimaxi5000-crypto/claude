-- Server-side integration with the jj_* framework. Every external call is isolated here,
-- wrapped in pcall and has a safe fallback, so an unexpected API only disables one feature.
-- Calls whose signature comes from the project brief and is not yet verified against the
-- real code are marked "VERIFY:".
Integration = {}

local warned = {}
local function warnOnce(key, msg)
    if warned[key] then return end
    warned[key] = true
    print(('^3[jj_zombie] integration: %s^0'):format(msg))
end

local function started(res)
    return GetResourceState(res) == 'started'
end

-- ------------------------------------------------------------------ logging
function Integration.log(level, msg)
    -- VERIFY: JJ.log signature in jj_lib (assumed JJ.log(level, message) or JJ.log.<level>(message)).
    if type(JJ) == 'table' then
        if type(JJ.log) == 'function' then
            if pcall(JJ.log, level, '[jj_zombie] ' .. msg) then return end
        elseif type(JJ.log) == 'table' and type(JJ.log[level]) == 'function' then
            if pcall(JJ.log[level], '[jj_zombie] ' .. msg) then return end
        end
    end
    print(('[jj_zombie] [%s] %s'):format(level, msg))
end

-- ------------------------------------------------------------------ permissions
-- True if the player may use the test commands.
function Integration.hasRole(src)
    if ConfigServer.Integration.UseJJCoreRoles and type(Core) == 'table' and type(Core.hasRole) == 'function' then
        -- VERIFY: Core.hasRole(src, minRole) from @jj_core/import.lua (per brief).
        local ok, res = pcall(Core.hasRole, src, Config.Permissions.MinRole)
        if ok then return res == true end
        warnOnce('roles', 'Core.hasRole failed (' .. tostring(res) .. '), using ACE fallback ' .. Config.Permissions.AceFallback)
    elseif ConfigServer.Integration.UseJJCoreRoles then
        warnOnce('roles_missing', 'jj_core Core.hasRole not available, using ACE fallback ' .. Config.Permissions.AceFallback)
    end
    return IsPlayerAceAllowed(src, Config.Permissions.AceFallback)
end

-- ------------------------------------------------------------------ health / down state
local downCache = {}

-- VERIFY: jj_health event jj:server:downChanged (per brief). Accepts (src, isDown) or
-- (isDown) with the player as event source.
AddEventHandler('jj:server:downChanged', function(a, b)
    if type(a) == 'number' and type(b) == 'boolean' then
        downCache[a] = b
    elseif type(a) == 'boolean' then
        local s = tonumber(source)
        if s then downCache[s] = a end
    end
end)

function Integration.isDown(src)
    if downCache[src] then return true end
    if ConfigServer.Integration.UseJJHealthDownState and started('jj_health') then
        -- VERIFY: exports.jj_health:isDown(src) (per brief "isDown").
        local ok, res = pcall(function() return exports.jj_health:isDown(src) end)
        if ok and res ~= nil then return res == true end
        if not ok then warnOnce('isdown', 'exports.jj_health:isDown not callable, using game health only') end
    end
    local ped = GetPlayerPed(src)
    if ped == 0 or not DoesEntityExist(ped) then return true end
    return GetEntityHealth(ped) <= 100
end

function Integration.clearPlayer(src)
    downCache[src] = nil
end

-- Restrained (handcuffed / tied). Game flag plus common state bag keys.
function Integration.isRestrained(src)
    local ped = GetPlayerPed(src)
    if ped ~= 0 and IsPedHandcuffed(ped) then return true end
    local st = Player(src).state
    return st.isCuffed == true or st.cuffed == true or st.handcuffed == true or st.isTied == true
end

-- ------------------------------------------------------------------ needs (stress)
function Integration.addStress(src, amount, reason)
    if not ConfigServer.Integration.UseJJNeedsStress or amount <= 0 then return end
    if type(Needs) == 'table' and type(Needs.addStress) == 'function' then
        if pcall(Needs.addStress, src, amount, reason) then return end
    end
    if started('jj_needs') then
        -- VERIFY: exports.jj_needs:addStress(src, amount, reason) (brief: Needs.addStress).
        local ok, err = pcall(function() exports.jj_needs:addStress(src, amount, reason) end)
        if ok then return end
        warnOnce('stress', 'jj_needs addStress failed: ' .. tostring(err))
    end
end

-- ------------------------------------------------------------------ inventory lock
function Integration.setInventoryBlocked(src, on)
    if not ConfigServer.Integration.UseJJInventoryBlock or not started('jj_inventory') then return end
    -- VERIFY: exports.jj_inventory:setBlocked(src, reason, on) (per brief).
    local ok, err = pcall(function() exports.jj_inventory:setBlocked(src, 'jj_zombie', on) end)
    if not ok then warnOnce('inv', 'jj_inventory setBlocked failed: ' .. tostring(err)) end
end

-- ------------------------------------------------------------------ hooks for future systems
-- Bite marker for a future infection system. No infection logic here on purpose.
function Integration.onBitten(src, info)
    local st = Player(src).state
    local prev = st[JJZ.PlayerState.Bitten]
    local count = (type(prev) == 'table' and tonumber(prev.count) or 0) + 1
    st:set(JJZ.PlayerState.Bitten, { count = count, last = os.time(), zombieType = info.zombieType }, true)
    TriggerEvent(JJZ.LocalEvents.Bitten, src, info)
end

-- Player notification (client decides how to show it).
function Integration.notify(src, msg, kind)
    TriggerClientEvent(JJZ.Events.Notify, src, msg, kind or 'info')
end

exports('isBitten', function(src)
    local v = Player(src).state[JJZ.PlayerState.Bitten]
    return type(v) == 'table' and (v.count or 0) > 0, v
end)
