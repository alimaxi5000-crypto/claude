-- Client logic with stubbed natives: open/close (focus, camera, ghost, no thread left), the NUI
-- bridge (only whitelisted server operations), camera frame -> world, partner model whitelist,
-- test playback: one synced scene per actor at sceneFrame * origin, all started together.
--   lua5.4 tests/lua/test_client.lua <resourceDir>
local dir = arg[1] or '.'
package.path = dir .. '/tests/lua/?.lua;' .. package.path
local M = require('mock')
M.stubClient()
local scenes = 0
local frame = { x = 100.0, y = 200.0, z = 30.0, heading = 90.0 }
M.dictReady = false
function M.nativeResult(name, ...)
    local a = { ... }
    if name == 'GetEntityCoords' then return vector3(frame.x, frame.y, frame.z) end
    if name == 'GetEntityHeading' then return frame.heading end
    if name == 'DoesEntityExist' or name == 'IsModelInCdimage' or name == 'IsModelAPed' or name == 'HasModelLoaded' or name == 'HasAnimDictLoaded' or name == 'IsSynchronizedSceneRunning' then return true end
    if name == 'IsPedInAnyVehicle' then return false end
    if name == 'DoesAnimDictExist' then return M.dictReady end
    if name == 'CreatePed' then return 77 end
    if name == 'CreateCamWithParams' then return 5 end
    if name == 'CreateSynchronizedScene' then scenes = scenes + 1; return scenes end
    if name == 'GetSynchronizedScenePhase' then return 0.25 end
    if name == 'GetPedBoneCoords' then return vector3(frame.x + 1.0, frame.y, frame.z) end
    if name == 'GetHashKey' then return 1234 end
    if name == 'GetEntityModel' then return 42 end
    return 0
end
M.loadResource(dir, 'client')

local pass, fail = 0, 0
local function ok(c, msg) if c then pass = pass + 1 else fail = fail + 1; M.print('  FAIL ' .. msg) end end
local function calls(name) local out = {}; for _, c in ipairs(M.natives) do if c[1] == name then out[#out + 1] = c end end; return out end
local function nui(name, data) local res; M.nui[name](data or {}, function(r) res = r end); M.runDue(); return res end
local E = JJS.Events

-- Closed: nothing registered as running thread.
ok(#M.threads == 0, 'no threads while the studio is closed')
M.commands[Config.Command]('', {})
ok(M.toServer[#M.toServer].name == E.open, '/animstudio asks the server for permission')
M.fire(E.opened, nil, { projects = {}, skeletons = {}, poses = {}, watch = { alive = true } })
ok(Studio.open == true, 'studio opens on the server answer')
ok(#calls('SetNuiFocus') == 1 and calls('SetNuiFocus')[1][2] == true, 'NUI focus on')
ok(#calls('RenderScriptCams') == 1 and calls('RenderScriptCams')[1][2] == true, 'script camera rendered')
local al = calls('SetEntityAlpha')
ok(#al >= 1 and al[1][3] == Config.GhostAlpha, 'player ped is a ghost (alpha ' .. Config.GhostAlpha .. ')')
local openMsg = M.nuiSent[#M.nuiSent]
ok(openMsg.type == 'open' and openMsg.data.frame.heading == 90.0, 'NUI gets the scene frame')
local function frameThreads() M.advance(50, 10); local n = 0; for _, t in ipairs(M.threads) do if t.wake <= M.now + 20 then n = n + 1 end end; return n end
ok(frameThreads() == 1, 'exactly one per-frame thread while open')

-- NUI bridge: only whitelisted server operations.
local before = #M.toServer
ok(nui('server', { op = 'evil', args = { 'x' } }).ok == false and #M.toServer == before, 'unknown server op is dropped')
nui('server', { op = 'save', args = { 'wave', '{}' } })
ok(M.toServer[#M.toServer].name == E.save and M.toServer[#M.toServer].latent, 'save goes as latent event')
nui('server', { op = 'load', args = { 'wave' } })
ok(M.toServer[#M.toServer].name == E.load and not M.toServer[#M.toServer].latent, 'load goes as normal event')

-- Camera: frame (heading 90) -> world.
M.natives = {}
nui('camera', { p = { 0, -3, 1 }, yaw = 0, pitch = -10, fov = 50 })
local cc = calls('SetCamCoord')[1]
ok(cc and math.abs(cc[3] - 103.0) < 1e-6 and math.abs(cc[4] - 200.0) < 1e-6 and math.abs(cc[5] - 31.0) < 1e-6, ('camera position rotated by the frame heading (%s, %s, %s)'):format(cc and cc[3], cc and cc[4], cc and cc[5]))
local cr = calls('SetCamRot')[1]
ok(cr and cr[3] == -10 and math.abs(cr[5] - 90.0) < 1e-6 and cr[6] == 2, 'camera rotation: pitch, frame heading + yaw, order 2')
ok(calls('SetCamFov')[1][3] == 50, 'camera FOV passed through')

-- Partner model whitelist.
M.natives = {}
local pr = nui('partner', { model = 'a_c_rat', p = { 0, 1, 0 } })
ok(pr.ok == false and #calls('CreatePed') == 0, 'partner model outside Config.PartnerModels refused')
pr = nui('partner', { model = 'mp_f_freemode_01', p = { 0, 0.6, 0 }, yaw = 180 })
local cp = calls('CreatePed')[1]
ok(pr.ok == true and cp and cp[8] == false, 'partner ped is local (isNetwork false)')
ok(cp and math.abs(cp[4] - 99.4) < 1e-6 and math.abs(cp[5] - 200.0) < 1e-6 and math.abs(cp[7] - 270.0) < 1e-6, ('partner placed at frame * mover (%s, %s, h %s)'):format(cp and cp[4], cp and cp[5], cp and cp[7]))

-- Test playback: waits for the dictionary, one scene per actor at frame * origin.
M.natives = {}; scenes = 0; M.nuiSent = {}
nui('test', { action = 'start', result = { dict = 'jjs_wave_v3', clips = { a = 'wave_a', b = 'wave_b' }, origins = { a = { x = 0, y = 0, z = 0, yaw = 0 }, b = { x = 0, y = 0.6, z = 0, yaw = 180 } }, duration = 2 }, loop = true, rate = 1, phase = 0,
    contacts = { { id = 'c1', a = { actor = 'a', tag = 18905, offset = { 0, 0, 0 } }, b = { actor = 'b', tag = 64729, offset = { 0, 0, 0.05 } } } } })
M.advance(300, 50)
ok(#calls('CreateSynchronizedScene') == 0, 'no scene before the dictionary exists (stream restart pending)')
M.dictReady = true
M.advance(300, 50)
local cs = calls('CreateSynchronizedScene')
ok(#cs == 2, 'two scenes (one per actor)')
local sb
for _, c in ipairs(cs) do if math.abs(c[2] - 99.4) < 1e-6 then sb = c end end
ok(sb and math.abs(sb[3] - 200.0) < 1e-6 and math.abs(sb[7] - 270.0) < 1e-6, 'actor b scene at frame * origin (x 99.4, heading 270)')
local ts = calls('TaskSynchronizedScene')
ok(#ts == 2 and ts[1][4] == 'jjs_wave_v3', 'both peds tasked with the new dictionary')
local lastScene = 0
for i, c in ipairs(M.natives) do if c[1] == 'CreateSynchronizedScene' then lastScene = i end end
local firstTask = math.huge
for i, c in ipairs(M.natives) do if c[1] == 'TaskSynchronizedScene' then firstTask = math.min(firstTask, i) end end
ok(lastScene < firstTask, 'all scenes created before the peds are tasked (same frame start)')
local started
for _, m in ipairs(M.nuiSent) do if m.type == 'test:started' then started = m end end
ok(started and started.ok == true, 'NUI told that the test started')
M.advance(250, 50)
local st
for _, m in ipairs(M.nuiSent) do if m.type == 'test:state' then st = m end end
ok(st and st.phase == 0.25 and st.points[1] and math.abs(st.points[1].cm) < 1e-6, 'phase + measured contact points sent to the NUI')
M.natives = {}
nui('test', { action = 'rate', rate = 5 })
ok(calls('SetSynchronizedSceneRate')[1][3] == 2.0, 'test rate clamped to 2x')
nui('test', { action = 'phase', phase = 0.5 })
ok(#calls('SetSynchronizedScenePhase') == 2, 'phase set on both scenes')
nui('test', { action = 'stop' })
ok(StudioPlay.active == nil, 'test stopped')

-- Bones read-out for the alignment tool (frame space).
local br = nui('bones', { actor = 'a', list = { { tag = 31086, id = 'SKEL_Head' } } })
ok(br.ok and #br.bones == 1 and math.abs(br.bones[1].p[2] + 1.0) < 1e-6, 'bone coords converted to the scene frame')

-- Close: everything restored, no thread left.
M.natives = {}
nui('close')
M.advance(100, 20)
ok(Studio.open == false and calls('SetNuiFocus')[1][2] == false, 'close releases the NUI focus')
ok(#calls('DestroyCam') == 1 and #calls('ResetEntityAlpha') >= 1, 'camera destroyed, ghost reset')
ok(#calls('DeleteEntity') == 1, 'partner ped deleted')
M.advance(11000, 500)
ok(#M.threads == 0, 'no thread left after closing (the 10 s open timeout has ended too)')
ok(#M.errors == 0, 'no Lua errors' .. (M.errors[1] and (': ' .. M.errors[1]) or ''))

M.print(('client tests: %d passed, %d failed'):format(pass, fail))
os.exit(fail == 0 and 0 or 1)
