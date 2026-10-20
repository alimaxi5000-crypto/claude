-- Server logic of jj_animstudio with mocked natives: permissions, sessions, names, size limits,
-- rate limits, storage (backups, rename, delete), poses, job flow inbox -> outbox -> stream
-- restart (+ errors, timeout), jj_core hook and a fuzz over every event.
--   lua5.4 tests/lua/test_server.lua <resourceDir>
local dir = arg[1] or '.'
package.path = dir .. '/tests/lua/?.lua;' .. package.path
local M = require('mock')
M.loadResource(dir, 'server')

local E = JJS.Events
local pass, fail = 0, 0
local function ok(c, msg) if c then pass = pass + 1 else fail = fail + 1; M.print('  FAIL ' .. msg) end end
local function lastReply(src) local s = M.last(src, E.reply); return s and s.args[1] or {} end

local A, B, C = 1, 2, 3                     -- A, C admins; B without permission
M.addPlayer(A, { ace = true }); M.addPlayer(B, { ace = false }); M.addPlayer(C, { ace = true })
M.resources[ConfigServer.StreamResource] = 'started'

local function doc(name, extra)
    -- Studio serialisation: "format" and "name" first, then the rest (as JSON text).
    return ('{"format":"jj-anim/1","name":"%s","type":"single","fps":30,"duration":2,"loop":false,"actors":{"a":{"model":"mp_m_freemode_01"}},"tracks":{"a":{"mover":[{"t":0,"p":[0,0,0],"yaw":0}]}},"contacts":[],"events":[]%s}'):format(name, extra or '')
end
local function heartbeat(ageS) M.files['data/outbox/_watch.json'] = json.encode({ ok = true, time = (os.time() - (ageS or 0)) * 1000 }) end
local function open(src) M.fire(E.open, src) end
local function tick(ms) M.advance(ms or 2100) end
local function tickJob() M.advance(5100) end

-- ------------------------------------------------------------------ permissions + sessions
open(B)
ok(M.last(B, E.denied) ~= nil and M.last(B, E.opened) == nil, 'player without ACE is denied')
M.fire(E.save, B, 'x', doc('x'))
ok(M.files['data/projects/x.anim.json'] == nil, 'denied player cannot save')
M.fire(E.save, A, 'x', doc('x'))
ok(M.files['data/projects/x.anim.json'] == nil, 'events before /animstudio open are ignored (no session)')
open(A)
local op = M.last(A, E.opened)
ok(op and op.latent and type(op.args[1].projects) == 'table', 'admin opens: latent payload with projects')
ok(op and op.args[1].watch.alive == false, 'payload says converter is not running (no heartbeat)')

-- ------------------------------------------------------------------ names, sizes, format
for _, bad in ipairs({ 'Bad', '../evil', 'a b', ('x'):rep(41), '', 12, true }) do
    tick(); M.fire(E.save, A, bad, doc('x'))
    ok(lastReply(A).ok == false, 'invalid project name rejected: ' .. tostring(bad))
end
tick(); M.fire(E.save, A, 'big', doc('big', (',"notes":"%s"'):format(('x'):rep(ConfigServer.MaxProjectBytes))))
ok(lastReply(A).ok == false and M.files['data/projects/big.anim.json'] == nil, 'project over 2 MB rejected')
tick(); M.fire(E.save, A, 'mismatch', doc('other'))
ok(lastReply(A).ok == false, 'document name must match the project name')
tick(); M.fire(E.save, A, 'broken', '{"format":"jj-anim/1","name":"broken",')
ok(lastReply(A).ok == false, 'broken JSON rejected')
tick(); M.fire(E.save, A, 'wrongfmt', (doc('wrongfmt'):gsub('jj%-anim/1', 'jj-anim/9')))
ok(lastReply(A).ok == false, 'wrong format version rejected')
tick(); M.fire(E.save, A, 'nottable', { 1, 2 })
ok(lastReply(A).ok == false, 'non-string project data rejected')

-- ------------------------------------------------------------------ save, rate limit, backups
tick(); M.fire(E.save, A, 'wave', doc('wave'))
ok(lastReply(A).ok == true and M.files['data/projects/wave.anim.json'] == doc('wave'), 'project saved unchanged')
M.fire(E.save, A, 'wave', doc('wave', ',"notes":"2"'))
ok(lastReply(A).ok == false and lastReply(A).msg == L('rate_limited'), 'second save within 2 s is rate limited')
for v = 1, 12 do tick(); M.fire(E.save, A, 'wave', doc('wave', (',"notes":"v%d"'):format(v))) end
local backups = 0
for n = 1, 12 do if M.files[('data/backups/wave.%d.anim.json'):format(n)] then backups = backups + 1 end end
ok(backups == ConfigServer.Backups, ('exactly %d backups kept (got %d)'):format(ConfigServer.Backups, backups))
local idx = json.decode(M.files['data/projects/_index.json'])
ok(idx.projects.wave and idx.projects.wave.type == 'single', 'index lists the project')
tick(); M.fire(E.list, A)
ok(#M.last(A, E.projects).args[1] == 1, 'list returns the project')
tick(); M.fire(E.load, A, 'wave')
local ld = M.last(A, E.project)
ok(ld and ld.latent and ld.args[1] == 'wave' and ld.args[2]:find('"notes":"v12"'), 'load sends the newest version (latent)')

-- ------------------------------------------------------------------ rename, duplicate, delete
tick(); M.fire(E.duplicate, A, 'wave', 'wave_copy')
ok(lastReply(A).ok and M.files['data/projects/wave_copy.anim.json']:sub(1, 45) == '{"format":"jj-anim/1","name":"wave_copy","typ', 'duplicate rewrites the name prefix')
tick(); M.fire(E.duplicate, A, 'wave', 'wave_copy')
ok(lastReply(A).ok == false, 'duplicate onto an existing name rejected')
tick(); M.fire(E.rename, A, 'wave_copy', 'wave_two')
ok(lastReply(A).ok and Storage.exists('wave_two') and not Storage.exists('wave_copy'), 'rename moves the project')
tick(); M.fire(E.rename, A, 'wave_two', '../x')
ok(lastReply(A).ok == false, 'rename to an invalid name rejected')
M.files['data/projects/handmade.anim.json'] = '{ "name": "handmade", "format": "jj-anim/1" }'
Storage._reset()
local ix = json.decode(M.files['data/projects/_index.json']); ix.projects.handmade = { type = 'single', updated = 1 }; M.files['data/projects/_index.json'] = json.encode(ix); Storage._reset()
tick(); M.fire(E.rename, A, 'handmade', 'handmade2')
ok(lastReply(A).ok == false and lastReply(A).msg == L('rename_unsupported'), 'hand-written file (other key order) cannot be renamed')
tick(); M.fire(E.delete, A, 'wave_two')
ok(lastReply(A).ok and not Storage.exists('wave_two') and M.files['data/backups/wave_two.deleted.anim.json'], 'delete keeps a backup')
tick(); M.fire(E.delete, A, 'nope')
ok(lastReply(A).ok == false, 'deleting a missing project fails cleanly')

-- ------------------------------------------------------------------ poses
tick(); M.fire(E.poseSave, A, 'guard', '{"bones":{"SKEL_Head":[1,2,3]}}')
ok(lastReply(A).ok and M.files['data/poses/guard.json'], 'pose saved')
ok(M.last(A, E.poses).args[1].guard ~= nil, 'pose list sent back')
tick(); M.fire(E.poseSave, A, 'bad pose', '{}')
ok(lastReply(A).ok == false, 'invalid pose name rejected')
tick(); M.fire(E.poseSave, A, 'nobones', '{"x":1}')
ok(lastReply(A).ok == false, 'pose without bones rejected')
tick(); M.fire(E.poseSave, A, 'huge', '{"bones":{},"x":"' .. ('y'):rep(ConfigServer.MaxPoseBytes) .. '"}')
ok(lastReply(A).ok == false, 'pose over the size limit rejected')
tick(); M.fire(E.poseDelete, A, 'guard')
ok(lastReply(A).ok and M.last(A, E.poses).args[1].guard == nil, 'pose deleted')

-- ------------------------------------------------------------------ preview job flow
tickJob(); M.fire(E.preview, A, 'wave', doc('wave'))
ok(lastReply(A).ok == false and lastReply(A).msg == L('watch_missing'), 'preview without converter heartbeat: clear message')
heartbeat(30)
tickJob(); M.fire(E.preview, A, 'wave', doc('wave'))
ok(lastReply(A).ok == false and lastReply(A).msg == L('watch_missing'), 'stale heartbeat (30 s) counts as not running')
heartbeat(0)
tickJob(); M.fire(E.preview, A, 'wave', doc('wave'))
local r = lastReply(A)
ok(r.ok and r.dict:match('^jjs_wave_v%d+$') and r.job, 'preview queued: ' .. tostring(r.dict))
local job = M.files[('data/inbox/%s.json'):format(r.job)]
local jd = job and json.decode(job)
ok(jd and jd.kind == 'preview' and jd.dict == r.dict and jd.project == 'wave' and jd.doc.name == 'wave' and type(jd.doc.contacts) == 'table', 'inbox job is valid JSON with the unchanged document')
ok(job and job:find('"contacts":%[%]'), 'empty arrays stay arrays in the job (no re-encoding)')
tickJob(); M.fire(E.preview, A, 'wave', doc('wave'))
ok(lastReply(A).ok == false and lastReply(A).msg == L('job_busy'), 'one running job per player')
-- The converter answers.
M.clearSent(); M.cmds = {}
M.files[('data/outbox/%s.json'):format(r.job)] = json.encode({ ok = true, job = r.job, dict = r.dict, clips = { a = 'wave' }, restart = true, duration = 2 })
open(C)
tick(1500)
local res = M.last(A, E.job)
ok(res and res.latent and res.args[1] == 'result' and res.args[2].ok == true and res.args[2].restarted == true, 'job result reaches the player (latent) after the restart')
ok(M.cmds[1] == 'stop ' .. ConfigServer.StreamResource and M.cmds[2] == 'start ' .. ConfigServer.StreamResource, 'stream resource restarted: stop + start')
ok(M.last(C, E.notice) ~= nil and M.last(C, E.notice).args[1] == 'stream_restarted', 'other studio users get the restart notice')
ok(M.files[('data/outbox/%s.json'):format(r.job)] == nil, 'outbox file removed after reading')
tickJob(); heartbeat(0); M.fire(E.preview, A, 'wave', doc('wave'))
local r2 = lastReply(A)
ok(r2.ok and r2.dict ~= r.dict and tonumber(r2.dict:match('_v(%d+)$')) == tonumber(r.dict:match('_v(%d+)$')) + 1, 'next preview gets a new versioned dict name')
-- Timeout: converter never answers.
M.clearSent()
M.advance(ConfigServer.JobTimeoutSeconds * 1000 + 1000, 500)
local to = M.last(A, E.job)
ok(to and to.args[2].ok == false and to.args[2].errors[1].code == 'timeout', 'job without answer ends with a timeout message')
-- Converter error is passed through.
heartbeat(0); tickJob()
M.fire(E.preview, A, 'wave', doc('wave'))
local r3 = lastReply(A)
M.files[('data/outbox/%s.json'):format(r3.job)] = json.encode({ ok = false, errors = { { code = 'unknown_bone', msg = 'Unbekannter Knochen "SKEL_Tail"' } } })
M.clearSent(); M.cmds = {}
tick(1000)
local er = M.last(A, E.job)
ok(er and er.args[2].ok == false and er.args[2].errors[1].msg:find('SKEL_Tail') and #M.cmds == 0, 'converter error reaches the player, no restart')
-- Stream resource missing.
heartbeat(0); tickJob()
M.resources[ConfigServer.StreamResource] = nil
M.fire(E.preview, A, 'wave', doc('wave'))
local r4 = lastReply(A)
M.files[('data/outbox/%s.json'):format(r4.job)] = json.encode({ ok = true, restart = true, dict = r4.dict })
M.clearSent(); tick(1000)
local sm = M.last(A, E.job)
ok(sm and sm.args[2].ok == false and sm.args[2].errors[1].code == 'stream_missing', 'missing stream resource reported')
M.resources[ConfigServer.StreamResource] = 'started'
-- Unreadable outbox file.
heartbeat(0); tickJob()
M.fire(E.preview, A, 'wave', doc('wave'))
local r5 = lastReply(A)
M.files[('data/outbox/%s.json'):format(r5.job)] = '{broken'
M.clearSent(); tick(1000)
ok(M.last(A, E.job).args[2].errors[1].code == 'outbox_invalid', 'unreadable converter answer reported')

-- ------------------------------------------------------------------ finalize
heartbeat(0); tickJob()
for _, bad in ipairs({ 'jjs_wave_v1', 'Bad', '', '../x', ('a'):rep(49) }) do
    tickJob(); M.fire(E.finalize, A, 'wave', doc('wave'), bad, 'jj_emotes')
    ok(lastReply(A).ok == false and lastReply(A).msg == L('dict_invalid'), 'final dict rejected: ' .. bad)
end
tickJob(); M.fire(E.finalize, A, 'wave', doc('wave'), 'jj_wave', 'bad res!')
ok(lastReply(A).ok == false and lastReply(A).msg == L('target_invalid'), 'invalid target resource rejected')
tickJob(); heartbeat(0); M.fire(E.finalize, A, 'wave', doc('wave'), 'jj_wave', 'jj_emotes')
local fr = lastReply(A)
local fj = fr.job and json.decode(M.files[('data/inbox/%s.json'):format(fr.job)])
ok(fr.ok and fj.kind == 'final' and fj.dict == 'jj_wave' and fj.targetResource == 'jj_emotes', 'final job written with dict and target resource')

-- ------------------------------------------------------------------ jj_core role hook
Config.JJCoreRole = 'admin'
M.exportsOf = { jj_core = { hasRole = function(_, src, role) return src == B and role == 'admin' end } }
M.clearSent(); open(B)
ok(M.last(B, E.opened) ~= nil, 'jj_core role admin grants access without ACE')
Config.JJCoreRole = false; M.exportsOf = nil

-- ------------------------------------------------------------------ player drop
M.fire('playerDropped', A)
tick(); M.fire(E.save, A, 'wave', doc('wave'))
ok(JJS._server.sessions[A] == nil, 'session cleared on drop')

-- ------------------------------------------------------------------ fuzz: every event, random arguments
open(C)
heartbeat(0)
math.randomseed(7)
local pool = { nil, true, false, 0, -1, 1e308, 0.5, '', 'wave', 'jjs_x_v1', '../../server.cfg', ('a'):rep(5000), {}, { 1, 2 }, { name = 'x' }, doc('wave'), doc('fz'), '{"format":"jj-anim/1","name":"fz"}', function() end }
local before = M.files['data/projects/_index.json']
local events = {}
for k, v in pairs(E) do if v:find(':server:') then events[#events + 1] = v end end
table.sort(events)
local n = 0
for _ = 1, 3000 do
    local ev = events[math.random(#events)]
    local args = {}
    for i = 1, math.random(0, 4) do args[i] = pool[math.random(#pool)] end
    M.now = M.now + 300; M.clock = M.clock + 0.3
    M.fire(ev, ({ A, B, C, 99 })[math.random(4)], table.unpack(args, 1, 4))
    n = n + 1
end
M.advance(5000, 500)
ok(#M.errors == 0, ('fuzz: %d random events without Lua errors%s'):format(n, #M.errors > 0 and (': ' .. M.errors[1]) or ''))
local okIdx = pcall(json.decode, M.files['data/projects/_index.json'])
ok(okIdx and before ~= nil, 'fuzz: project index still valid JSON')
local badPath = false
for p in pairs(M.files) do if p:find('%.%.') or not (p:match('^data/projects/') or p:match('^data/backups/') or p:match('^data/poses/') or p:match('^data/inbox/') or p:match('^data/outbox/')) then badPath = true end end
ok(not badPath, 'fuzz: files are only written inside data/projects, backups, poses, inbox, outbox')

M.print(('server tests: %d passed, %d failed'):format(pass, fail))
os.exit(fail == 0 and 0 or 1)
