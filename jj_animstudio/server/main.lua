-- Server entry: permission + session + rate limit on EVERY event, input checks, storage and jobs.
-- The client is treated as hostile: names are checked against [a-z0-9_], sizes are capped,
-- every path is built by the server (server/storage.lua, server/jobs.lua).
local E = JJS.Events
local U = JJS.U
local sessions = {}      -- src -> { since = ms }
local last = {}          -- src -> { kind -> ms of the last accepted request }

local deniedLogged = {}
local function allowed(src)
    src = tonumber(src)
    if not src or src <= 0 or not GetPlayerName(src) then return false end
    local hook = Editable.hasAccess(src)
    if hook ~= nil then return hook == true end
    if IsPlayerAceAllowed(src, Config.Ace) then return true end
    -- One console line per player explains why access was refused.
    if not deniedLogged[src] then
        deniedLogged[src] = true
        print(('^3[jj_animstudio] %s (%d) has no access: no ACE %s%s^0'):format(GetPlayerName(src), src, Config.Ace,
            Config.JJCoreRole and (GetResourceState('jj_core') == 'started' and (' and jj_core role below ' .. Config.JJCoreRole) or ' (jj_core not started)') or ''))
    end
    return false
end

local function reply(src, op, ok, key, extra, ...)
    local msg = key and L(key, ...) or nil
    local data = extra or {}
    data.op, data.ok, data.msg = op, ok, msg
    TriggerClientEvent(E.reply, src, data)
end

-- Permission, open session (unless `open`), rate limit per player and kind.
local function guard(src, kind, needSession)
    if not allowed(src) then
        TriggerClientEvent(E.denied, src, L('no_permission'))
        return false
    end
    if needSession ~= false and not sessions[src] then return false end
    local now = GetGameTimer()
    local per = last[src] or {}
    last[src] = per
    local gap = ConfigServer.RateLimits[kind] or ConfigServer.RateLimits.default
    if per[kind] and now - per[kind] < gap then
        reply(src, kind, false, 'rate_limited')
        return false
    end
    per[kind] = now
    return true
end

local function checkText(src, op, name, text)
    if not U.validName(name) then reply(src, op, false, 'invalid_name'); return nil end
    if type(text) ~= 'string' then reply(src, op, false, 'project_invalid'); return nil end
    if #text > ConfigServer.MaxProjectBytes then reply(src, op, false, 'project_too_large', nil, ConfigServer.MaxProjectBytes // 1024); return nil end
    local doc, err = Storage.inspect(name, text)
    if not doc then reply(src, op, false, err, nil, ConfigServer.MaxProjectBytes // 1024); return nil end
    return doc
end

local function sendProjects(src)
    TriggerClientEvent(E.projects, src, Storage.list())
end

RegisterNetEvent(E.open, function()
    local src = source
    if not guard(src, 'open', false) then return end
    sessions[src] = { since = GetGameTimer() }
    local alive, age = Jobs.watchState()
    TriggerLatentClientEvent(E.opened, src, JJS.LATENT_BPS, {
        projects = Storage.list(),
        skeletons = Storage.skeletons(),
        poses = Storage.allPoses(),
        watch = { alive = alive, age = age },
        stream = { name = ConfigServer.StreamResource, state = GetResourceState(ConfigServer.StreamResource) },
        limits = { maxProjectBytes = ConfigServer.MaxProjectBytes, maxPoseBytes = ConfigServer.MaxPoseBytes },
    })
    Editable.log(src, 'open')
end)

RegisterNetEvent(E.close, function()
    local src = source
    sessions[src] = nil
end)

RegisterNetEvent(E.list, function()
    local src = source
    if not guard(src, 'list') then return end
    sendProjects(src)
end)

RegisterNetEvent(E.load, function(name)
    local src = source
    if not guard(src, 'load') then return end
    if not U.validName(name) then return reply(src, 'load', false, 'invalid_name') end
    local text = Storage.read(name)
    if not text then return reply(src, 'load', false, 'project_missing', nil, name) end
    TriggerLatentClientEvent(E.project, src, JJS.LATENT_BPS, name, text)
end)

RegisterNetEvent(E.save, function(name, text)
    local src = source
    if not guard(src, 'save') then return end
    local doc = checkText(src, 'save', name, text)
    if not doc then return end
    local ok, err = Storage.write(name, text, doc)
    if not ok then return reply(src, 'save', false, err, nil, ConfigServer.MaxProjects) end
    reply(src, 'save', true, 'project_saved', { name = name, updated = os.time() })
    Editable.log(src, 'save', name)
end)

RegisterNetEvent(E.rename, function(from, to)
    local src = source
    if not guard(src, 'rename') then return end
    local ok, err = Storage.copy(from, to, true)
    if not ok then return reply(src, 'rename', false, err, nil, U.validName(to) and to or '?') end
    reply(src, 'rename', true, 'project_renamed', { from = from, name = to }, to)
    sendProjects(src)
    Editable.log(src, 'rename', from .. ' -> ' .. to)
end)

RegisterNetEvent(E.duplicate, function(from, to)
    local src = source
    if not guard(src, 'duplicate') then return end
    local ok, err = Storage.copy(from, to, false)
    if not ok then return reply(src, 'duplicate', false, err, nil, U.validName(to) and to or '?') end
    reply(src, 'duplicate', true, 'project_duplicated', { name = to }, to)
    sendProjects(src)
    Editable.log(src, 'duplicate', from .. ' -> ' .. to)
end)

RegisterNetEvent(E.delete, function(name)
    local src = source
    if not guard(src, 'delete') then return end
    local ok, err = Storage.delete(name)
    if not ok then return reply(src, 'delete', false, err, nil, U.validName(name) and name or '?') end
    reply(src, 'delete', true, 'project_deleted', { name = name }, name)
    sendProjects(src)
    Editable.log(src, 'delete', name)
end)

-- "Im Spiel testen": save, then queue a preview build (dict jjs_<name>_v<n>).
RegisterNetEvent(E.preview, function(name, text)
    local src = source
    if not guard(src, 'preview') then return end
    local doc = checkText(src, 'preview', name, text)
    if not doc then return end
    local ok, err = Storage.write(name, text, doc)
    if not ok then return reply(src, 'preview', false, err, nil, ConfigServer.MaxProjects) end
    local id, dictOrErr = Jobs.submit(src, 'preview', name, text)
    if not id then return reply(src, 'preview', false, dictOrErr) end
    reply(src, 'preview', true, nil, { job = id, dict = dictOrErr, name = name })
    Editable.log(src, 'preview', dictOrErr)
end)

-- "Fertigstellen": final dictionary name + target resource, report for Claude.
RegisterNetEvent(E.finalize, function(name, text, dict, target)
    local src = source
    if not guard(src, 'finalize') then return end
    local doc = checkText(src, 'finalize', name, text)
    if not doc then return end
    if not U.validName(dict, 48) or dict:sub(1, 4) == 'jjs_' then return reply(src, 'finalize', false, 'dict_invalid') end
    if target ~= nil and target ~= '' and not U.validResource(target) then return reply(src, 'finalize', false, 'target_invalid') end
    local ok, err = Storage.write(name, text, doc)
    if not ok then return reply(src, 'finalize', false, err, nil, ConfigServer.MaxProjects) end
    local id, dictOrErr = Jobs.submit(src, 'final', name, text, { dict = dict, targetResource = (target ~= '' and target) or nil })
    if not id then return reply(src, 'finalize', false, dictOrErr) end
    reply(src, 'finalize', true, nil, { job = id, dict = dictOrErr, name = name })
    Editable.log(src, 'finalize', dict)
end)

RegisterNetEvent(E.poseSave, function(name, text)
    local src = source
    if not guard(src, 'pose') then return end
    local ok, err = Storage.savePose(name, text)
    if not ok then return reply(src, 'poseSave', false, err, nil, ConfigServer.MaxPoses) end
    reply(src, 'poseSave', true, 'pose_saved', { name = name }, name)
    TriggerLatentClientEvent(E.poses, src, JJS.LATENT_BPS, Storage.allPoses())
end)

RegisterNetEvent(E.poseDelete, function(name)
    local src = source
    if not guard(src, 'pose') then return end
    local ok, err = Storage.deletePose(name)
    if not ok then return reply(src, 'poseDelete', false, err) end
    reply(src, 'poseDelete', true, 'pose_deleted', { name = name }, name)
    TriggerLatentClientEvent(E.poses, src, JJS.LATENT_BPS, Storage.allPoses())
end)

-- Every studio user gets a short notice when the stream resource restarts (it affects everyone).
function Jobs.onRestarted(job)
    for s in pairs(sessions) do
        TriggerClientEvent(E.notice, s, 'stream_restarted', { dict = job.dict })
    end
end

AddEventHandler('playerDropped', function()
    local src = source
    sessions[src], last[src], deniedLogged[src] = nil, nil, nil
    Jobs.dropPlayer(src)
end)

-- Test access (mocks): sessions and rate limit state.
JJS._server = { sessions = sessions, last = last, allowed = allowed }
