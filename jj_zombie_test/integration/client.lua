-- Client-side integration (UI notifications, chat suggestions, optional jj_gameplay locks).
-- Unverified external APIs are marked "VERIFY:" and always have a fallback.
IntegrationC = {}

local warned = {}
local function warnOnce(key, msg)
    if warned[key] then return end
    warned[key] = true
    print(('^3[jj_zombie] integration: %s^0'):format(msg))
end

-- Notification: GTA feed as a neutral fallback (jj_ui API unknown).
function IntegrationC.notify(msg, kind)
    BeginTextCommandThefeedPost('STRING')
    AddTextComponentSubstringPlayerName(tostring(msg))
    EndTextCommandThefeedPostTicker(kind == 'error', false)
end

-- VERIFY: jj_chat compatibility with the cfx chat suggestion events (chat:addSuggestion).
function IntegrationC.addSuggestion(cmd, help, params)
    TriggerEvent('chat:addSuggestion', '/' .. cmd, help, params or {})
end
function IntegrationC.removeSuggestion(cmd)
    TriggerEvent('chat:removeSuggestion', '/' .. cmd)
end

-- Optional jj_gameplay locks during the finisher. Off by default (Config.Integration);
-- the finisher always disables the relevant controls itself.
local gameplayOn = false
function IntegrationC.setGameplayLocked(on)
    if not (Config.Integration and Config.Integration.UseGameplayExports) then return end
    if GetResourceState('jj_gameplay') ~= 'started' or gameplayOn == on then return end
    gameplayOn = on
    -- VERIFY: export signatures (brief lists blockSprint, blockJump, blockWeaponWheel).
    local ok, err = pcall(function()
        exports.jj_gameplay:blockSprint('jj_zombie', on)
        exports.jj_gameplay:blockJump('jj_zombie', on)
        exports.jj_gameplay:blockWeaponWheel('jj_zombie', on)
    end)
    if not ok then warnOnce('gameplay', 'jj_gameplay exports failed: ' .. tostring(err)) end
end
