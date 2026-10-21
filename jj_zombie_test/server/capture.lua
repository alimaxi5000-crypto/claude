-- /zcapture: the requesting client poses a local copy of the finisher at fixed time steps and
-- camera angles; for every shot the server asks screenshot-basic to store the client's frame
-- directly into the dev captures folder (no image data passes through our own events).
JJZ = JJZ or {}
local Cap = { sessions = {} }
JJZ.Capture = Cap

local Net, U = JJZ.Net, JJZ.U
local RES = GetCurrentResourceName()

local SEQUENCES = { grab = true, struggle = true, shove = true, bite = true, all = true }

local function captureDir()
    local base = GetResourcePath(RES)
    local rel = ConfigServer.Capture.Directory
    if rel:sub(1, 1) == '/' or rel:match('^%a:[\\/]') then return rel end
    return base .. '/' .. rel
end

local function writeIndex(s)
    local path = ('%s/%s_index.md'):format(captureDir(), s.id)
    local f = io.open(path, 'w')
    if not f then return end
    f:write(('# Capture %s\n\nSequence: %s, player: %s, gender: %s\n\n| # | Datei | Szene | Kamera | Zeit (s) |\n|---|---|---|---|---|\n'):format(s.id, s.seq, s.player, s.gender or '?'))
    for i, shot in ipairs(s.shots) do
        f:write(('| %d | %s | %s | %s | %.2f |\n'):format(i, shot.file, shot.scene or '', shot.cam or '', shot.t or 0))
    end
    f:close()
end

function Cap.start(src, seq)
    if GetResourceState('screenshot-basic') ~= 'started' then return Net.notify(src, 'capture_missing') end
    if not SEQUENCES[seq] then seq = 'shove' end
    if Cap.sessions[src] then return Net.notify(src, 'finisher_busy', 'capture') end
    local id = os.date('%Y%m%d_%H%M%S') .. '_' .. seq
    Cap.sessions[src] = { id = id, seq = seq, player = GetPlayerName(src) or tostring(src), shots = {}, count = 0, started = os.time() }
    Net.notify(src, 'capture_started', id)
    TriggerClientEvent(JJZ.Events.CaptureStart, src, id, seq)
end

-- Client is posed and asks for a screenshot of shot #index.
RegisterNetEvent(JJZ.Events.CaptureFrame, function(id, index, meta)
    local src = source
    local s = Cap.sessions[src]
    if not s or s.id ~= id or not U.isInt(index, 1, ConfigServer.Capture.MaxFrames) then return end
    if not Net.allow('CaptureFrames', src) then return end
    if s.shots[index] then return end
    meta = type(meta) == 'table' and meta or {}
    local file = ('%s_%03d_%s.jpg'):format(id, index, U.isStr(meta.cam, 16, '^[%w_]+$') and meta.cam or 'cam')
    s.shots[index] = {
        file = file, cam = U.isStr(meta.cam, 16) and meta.cam or '', t = U.isNum(meta.t, 0, 60) and meta.t or 0,
        scene = U.isStr(meta.scene, 48) and meta.scene or '',
    }
    if U.isStr(meta.gender, 1) then s.gender = meta.gender end
    exports['screenshot-basic']:requestClientScreenshot(src, {
        fileName = captureDir() .. '/' .. file, encoding = 'jpg', quality = ConfigServer.Capture.Quality,
    }, function(err)
        s.count = s.count + ((err == false or err == nil) and 1 or 0)
        TriggerClientEvent(JJZ.Events.CaptureAck, src, id, index, err == false or err == nil)
        if err and err ~= false then Integration.log('warn', 'capture failed: ' .. tostring(err)) end
    end)
end)

RegisterNetEvent(JJZ.Events.CaptureDone, function(id)
    local src = source
    local s = Cap.sessions[src]
    if not s or s.id ~= id then return end
    Cap.sessions[src] = nil
    writeIndex(s)
    Net.notify(src, 'capture_done', s.count, ConfigServer.Capture.Directory)
    Integration.log('info', ('capture %s: %d images in %s'):format(id, s.count, captureDir()))
end)

AddEventHandler('playerDropped', function()
    Cap.sessions[source] = nil
end)
