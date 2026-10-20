-- Conversion jobs: the server writes data/inbox/<job>.json, animkit watch (own process) builds it
-- and answers in data/outbox/<job>.json. After a successful build the stream resource
-- (jj_animstudio_stream) is restarted so every client receives the new .ycd.
-- NOTE: restarting the stream resource affects ALL players on the server (they download the
-- new clip dictionary). The studio shows a short notice before every test.
Jobs = {}

local RES = GetCurrentResourceName()
local U = JJS.U
local pending = {}          -- job id -> { src, kind, name, dict, created }
local polling = false
local restarting = false

local function outboxPath(id) return ('data/outbox/%s.json'):format(id) end

local function removeFile(rel)
    -- Server Lua has os.remove; the path is built only from validated names. If it is not
    -- available, the file is emptied instead (empty files are ignored).
    local base = GetResourcePath(RES)
    local ok = base and os and os.remove and pcall(os.remove, base .. '/' .. rel)
    if not ok then SaveResourceFile(RES, rel, '', 0) end
end

-- Heartbeat of animkit watch (data/outbox/_watch.json, time in ms since 1970).
function Jobs.watchState()
    local raw = LoadResourceFile(RES, 'data/outbox/_watch.json')
    if not raw or raw == '' then return false, nil end
    local ok, hb = pcall(json.decode, raw)
    if not ok or type(hb) ~= 'table' or type(hb.time) ~= 'number' then return false, nil end
    local age = os.time() - hb.time / 1000
    return age <= ConfigServer.WatchMaxAgeSeconds, age, hb
end

function Jobs.pendingFor(src)
    for id, j in pairs(pending) do if j.src == src then return id end end
    return nil
end
function Jobs.count() return U.count(pending) end

-- Stream resource restart (VERIFY: StopResource/StartResource from a resource script need no
-- extra ACE; with RestartMethod 'command' the ensure command needs
-- add_ace resource.jj_animstudio command.ensure allow).
function Jobs.restartStream()
    local name = ConfigServer.StreamResource
    local state = GetResourceState(name)
    if state == 'missing' or state == 'unknown' then return false, 'stream_missing' end
    if ConfigServer.RestartMethod == 'command' then
        ExecuteCommand('ensure ' .. name)
    else
        if state == 'started' or state == 'starting' then StopResource(name) end
        Wait(200)
        StartResource(name)
    end
    for _ = 1, 20 do
        if GetResourceState(name) == 'started' then return true end
        Wait(100)
    end
    return false, 'stream_restart_failed'
end

local function finish(id, result)
    local job = pending[id]
    pending[id] = nil
    if not job then return end
    if result.ok and result.restart then
        while restarting do Wait(50) end
        restarting = true
        local ok, err = Jobs.restartStream()
        restarting = false
        result.restarted = ok
        if not ok then
            result.ok = false
            result.errors = { { code = err, msg = L(err, ConfigServer.StreamResource, ConfigServer.StreamResource) } }
        else
            Jobs.onRestarted(job, result)
        end
    end
    result.job, result.kind, result.name = id, job.kind, job.name
    result.waitMs = GetGameTimer() - job.created
    Editable.log(job.src, 'job_done', ('%s %s ok=%s'):format(id, job.dict, tostring(result.ok)))
    if GetPlayerName(job.src) then
        TriggerLatentClientEvent(JJS.Events.job, job.src, JJS.LATENT_BPS, 'result', result)
    end
end

-- Hook set by server/main.lua (notify other studio users about the restart).
function Jobs.onRestarted() end

local function poll()
    if polling then return end
    polling = true
    CreateThread(function()
        while next(pending) do
            Wait(500)
            -- Snapshot: finish() waits for the stream restart, new jobs may arrive meanwhile.
            local ids = {}
            for id in pairs(pending) do ids[#ids + 1] = id end
            for _, id in ipairs(ids) do
                local job = pending[id]
                local raw = job and LoadResourceFile(RES, outboxPath(id))
                if raw and raw ~= '' then
                    removeFile(outboxPath(id))
                    local ok, result = pcall(json.decode, raw)
                    if not ok or type(result) ~= 'table' then
                        result = { ok = false, errors = { { code = 'outbox_invalid', msg = 'Antwort des Konverters ist unlesbar.' } } }
                    end
                    finish(id, result)
                elseif job and GetGameTimer() - job.created > ConfigServer.JobTimeoutSeconds * 1000 then
                    finish(id, { ok = false, errors = { { code = 'timeout', msg = L('job_timeout', ConfigServer.JobTimeoutSeconds) } } })
                end
            end
        end
        polling = false
    end)
end

-- Queue a job. kind 'preview' | 'final'. docText is the already checked project text.
-- Returns jobId or nil, errorKey.
function Jobs.submit(src, kind, name, docText, opts)
    opts = opts or {}
    local alive = Jobs.watchState()
    if not alive then return nil, 'watch_missing' end
    if Jobs.pendingFor(src) then return nil, 'job_busy' end
    if Jobs.count() >= ConfigServer.MaxPendingJobs then return nil, 'job_queue_full' end
    local dict, id
    if kind == 'preview' then
        local v = Storage.nextPreview(name)
        if not v then return nil, 'project_missing' end
        dict = ('jjs_%s_v%d'):format(name, v)
        id = ('%s_v%d'):format(name, v)
    else
        dict = opts.dict
        if not U.validName(dict, 48) or dict:sub(1, 4) == 'jjs_' then return nil, 'dict_invalid' end
        id = ('%s_final_%d'):format(name, os.time())
    end
    -- The job file is assembled from validated names and the unchanged project text (no
    -- re-encoding: empty Lua tables would turn JSON arrays into objects).
    local target = opts.targetResource and ('"%s"'):format(opts.targetResource) or 'null'
    local text = ('{"kind":"%s","dict":"%s","project":"%s","targetResource":%s,"doc":%s}'):format(kind, dict, name, target, docText)
    if not SaveResourceFile(RES, ('data/inbox/%s.json'):format(id), text, #text) then return nil, 'job_write_failed' end
    pending[id] = { src = src, kind = kind, name = name, dict = dict, created = GetGameTimer() }
    poll()
    return id, dict
end

-- Forget the jobs of a player who left (the converter still finishes them; results are dropped).
function Jobs.dropPlayer(src)
    for _, j in pairs(pending) do if j.src == src then j.src = -1 end end
end
