--[[ JJ SCRIPTS - Animation Studio | editable/server.lua
   Open hooks you may adapt to your server. Everything else stays untouched. ]]
Editable = Editable or {}

-- Extra access check on top of the ACE permission (Config.Ace).
-- Return true to allow, false to deny, nil to use only the ACE result.
-- Default: if Config.JJCoreRole is set and jj_core runs, that role (or higher) is enough.
-- jj_core API used: exports.jj_core:hasRole(src, minRole) (server/api.lua of jj_core).
function Editable.hasAccess(src)
    if Config.JJCoreRole and GetResourceState('jj_core') == 'started' then
        local ok, allowed = pcall(function() return exports.jj_core:hasRole(src, Config.JJCoreRole) end)
        if ok and allowed then return true end
    end
    return nil
end

-- Called for every action that changes data (save, delete, preview, finalize ...).
-- Use it for your own logs (Discord, database). Default: console line when Config.Debug is on.
function Editable.log(src, action, detail)
    if Config.Debug then
        print(('[jj_animstudio] %s (%s) %s %s'):format(GetPlayerName(src) or '?', tostring(src), action, detail or ''))
    end
end
