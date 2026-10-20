-- Victim-side finisher flow with stubbed client natives: loads the real shared + client files and
-- checks how the paired scenes are placed and chained (the cause of the first in-game bugs):
--   * every actor plays in its own synced scene at sceneFrame * registry origin
--   * the grab starts the victim where he stands and the zombie 1 m in front of him, facing him,
--     both within half of the 45-degree variant step of where they really are
--   * an actor whose origin changes (grab -> clinch) switches instantly, an actor that keeps it blends
--   * previous scenes are stopped after the new ones took over, release stops the current ones
--   lua5.4 tests/lua/test_client_finisher.lua <path to jj_zombie_test>
local here = debug.getinfo(1, 'S').source:sub(2):match('(.*/)') or './'
package.path = here .. '?.lua;' .. package.path
local M = require('mock')
local RES = arg[1] or (here .. '../../../jj_zombie_test')

local passed, failed = 0, 0
local print = M.print
local function check(cond, msg)
    if cond then passed = passed + 1 else failed = failed + 1; print('FAIL ' .. msg) end
end

-- ------------------------------------------------------------------ client natives
local VICTIM, ZOMBIE = 1, 2
local world = { [VICTIM] = { pos = vector3(10, 20, 30), heading = 0.0 }, [ZOMBIE] = { pos = vector3(10, 21, 30), heading = 180.0 } }
local log, nextScene = {}, 100
local function rec(e) log[#log + 1] = e end
local stubs = {
    PlayerPedId = function() return VICTIM end,
    PlayerId = function() return 0 end,
    GetGamePool = function() return {} end,
    GetPlayerServerId = function() return 1 end,
    DoesEntityExist = function(e) return world[e] ~= nil end,
    NetworkDoesEntityExistWithNetworkId = function() return true end,
    NetworkGetEntityFromNetworkId = function() return ZOMBIE end,
    NetworkGetEntityOwner = function() return 0 end,
    GetEntityCoords = function(e) return world[e] and world[e].pos or vector3(0, 0, 0) end,
    GetEntityHeading = function(e) return world[e] and world[e].heading or 0.0 end,
    IsEntityDead = function() return false end,
    DoesAnimDictExist = function() return true end,
    HasAnimDictLoaded = function() return true end,
    IsEntityPlayingAnim = function() return true end,
    GetResourceKvpString = function() return nil end,
    GetEntityModel = function() return M.joaat('mp_m_freemode_01') end,
    GetPedBoneCoords = function() return vector3(0, 0, 0) end,
    NetworkGetLocalSceneFromNetworkId = function() return -1 end,   -- phase from the clock
    NetworkCreateSynchronisedScene = function(x, y, z, _, _, h, _, hold, loop)
        nextScene = nextScene + 1
        rec({ op = 'create', id = nextScene, pos = vector3(x, y, z), heading = h, hold = hold, loop = loop })
        return nextScene
    end,
    NetworkAddPedToSynchronisedScene = function(ped, scene, dict, clip, blendIn, _, flags, _, moverBlend)
        rec({ op = 'add', ped = ped, scene = scene, dict = dict, clip = clip, blendIn = blendIn, moverBlend = moverBlend, flags = flags })
    end,
    NetworkStartSynchronisedScene = function(id) rec({ op = 'start', id = id, t = M.now }) end,
    NetworkStopSynchronisedScene = function(id) rec({ op = 'stop', id = id, t = M.now }) end,
}
for k, fn in pairs(stubs) do _G[k] = fn end
Entity = function() return { state = setmetatable({}, { __index = function() return nil end }) } end
LocalPlayer = { state = setmetatable({}, { __index = function() return nil end }) }
GlobalState = {}
RegisterKeyMapping = function() end
RegisterNUICallback = function() end
SendNUIMessage = function() end
local serverEvents = {}
TriggerServerEvent = function(name, ...) serverEvents[#serverEvents + 1] = { name = name, args = table.pack(...) } end
setmetatable(_G, { __index = function(_, k)
    if type(k) == 'string' and k:match('^[A-Z][a-z]') then
        local known = { Config = 1, ConfigServer = 1, Locales = 1, Integration = 1, IntegrationC = 1, JJZ = 1, ClipData = 1, Clips = 1, JJ = 1, Core = 1, Needs = 1, MOCK = 1, Anim = 1, ZAI = 1, ZFin = 1, ZCam = 1, ZFx = 1, ZSound = 1, ZMove = 1, ZPreview = 1, JJZC = 1 }
        if known[k] then return nil end
        return function() return 0 end
    end
    return nil
end })

local f = assert(io.open(RES .. '/fxmanifest.lua')); local manifest = f:read('a'); f:close()
local function list(key)
    local out = {}
    for file in (manifest:match(key .. 's%s*(%b{})') or ''):gmatch("'([^']+)'") do if file:sub(1, 1) ~= '@' then out[#out + 1] = file end end
    return out
end
for _, file in ipairs(list('shared_script')) do M.loadfile(RES .. '/' .. file)() end
for _, file in ipairs(list('client_script')) do M.loadfile(RES .. '/' .. file)() end
M.runDue()
local U, Ev = JJZ.U, JJZ.Events

-- ------------------------------------------------------------------ helpers
local function since(n) local out = {}; for i = n + 1, #log do out[#out + 1] = log[i] end; return out end
local function ops(entries, op) local out = {}; for _, e in ipairs(entries) do if e.op == op then out[#out + 1] = e end end; return out end
-- Scene + add record of one ped among the given log entries.
local function sceneOf(entries, ped)
    for _, a in ipairs(ops(entries, 'add')) do
        if a.ped == ped then
            for _, c in ipairs(ops(entries, 'create')) do if c.id == a.scene then return c, a end end
        end
    end
end
local function dist2d(a, b) return math.sqrt((a.x - b.x) ^ 2 + (a.y - b.y) ^ 2) end
local function dirYaw(k) return k <= 4 and k * 45 or (k - 8) * 45 end
local function payload(finId, k)
    local g = 'm'
    return {
        finId = finId, zombieNet = 7, zombieType = 'schlurfer', gender = g, dir = k, alpha = dirYaw(k),
        grab = ('fin_grab:d%d_%s'):format(k, g),
        struggle = { low = 'fin_struggle_low:' .. g, mid = 'fin_struggle_mid:' .. g, high = 'fin_struggle_high:' .. g },
        shove = 'fin_shove:' .. g, bite = 'fin_bite:' .. g,
        startProgress = 50, timeLimit = 7.0, thresholds = { ZombieWinsBelow = 35, PlayerWinsAbove = 70 },
    }
end

-- One full flow. victimHeading: where the player looks; approach: direction victim -> zombie
-- (heading); zDist: real distance of the zombie. The server picks the variant like tryStart does.
local function flow(name, victimHeading, approach, zDist, result)
    log = {}
    local vp = world[VICTIM].pos
    world[VICTIM].heading = victimHeading
    local r = math.rad(approach)
    world[ZOMBIE].pos = vector3(vp.x - math.sin(r) * zDist, vp.y + math.cos(r) * zDist, vp.z)
    world[ZOMBIE].heading = (approach + 180.0) % 360.0
    local k = math.floor(U.angleDiff(victimHeading, approach) / 45.0 + 0.5) % 8
    local finId = 40 + #serverEvents
    M.fire(Ev.FinisherStart, 65535, payload(finId, k))
    M.advance(20, 5)
    local fin = ZFin.active
    check(fin ~= nil, name .. ': finisher started')
    if not fin then return end

    -- Grab: two scenes, one per actor, started together.
    local grab = since(0)
    local vS, vA = sceneOf(grab, VICTIM)
    local zS, zA = sceneOf(grab, ZOMBIE)
    check(vS and zS and vS.id ~= zS.id, name .. ': victim and zombie play in their own scenes')
    if not (vS and zS) then return end
    check(#ops(grab, 'start') == 2 and ops(grab, 'start')[1].t == ops(grab, 'start')[2].t, name .. ': both grab scenes start in the same frame')
    check(dist2d(vS.pos, vp) < 0.01, name .. ': victim starts where he stands')
    local vErr = math.abs(U.angleDiff(vS.heading, victimHeading))
    check(vErr <= 11.26, name .. (': victim start heading within 11.25 deg of his real heading (%.2f)'):format(vErr))
    check(math.abs(dist2d(zS.pos, vp) - 1.0) < 0.01, name .. ': zombie starts 1 m in front of the victim')
    local zDir = U.headingOf(zS.pos.x - vp.x, zS.pos.y - vp.y)
    local zErr = math.abs(U.angleDiff(zDir, approach))
    check(zErr <= 11.26, name .. (': zombie start within 11.25 deg of its real direction (%.2f)'):format(zErr))
    local facing = U.headingOf(vp.x - zS.pos.x, vp.y - zS.pos.y)
    check(math.abs(U.angleDiff(zS.heading, facing)) < 0.1, name .. ': zombie starts facing the victim (not turned away)')
    check(vA.moverBlend < 100 and zA.moverBlend < 100 and vA.blendIn < 100 and zA.blendIn < 100, name .. ': grab blends in smoothly (pose and mover)')
    check(vS.hold == true and zS.hold == true, name .. ': grab holds its last frame until the clinch takes over')

    -- Grab -> clinch: the zombie's origin changes (1.0 m -> 0.56 m), so it switches instantly.
    local mark = #log
    local grabEntry = Clips.entry('fin_grab', ('d%d_m'):format(k))
    M.advance(math.floor(grabEntry.duration * 1000) + 60, 5)
    check(fin.phase == 'struggle', name .. ': struggle after the grab')
    local st = since(mark)
    local vS2, vA2 = sceneOf(st, VICTIM)
    local zS2, zA2 = sceneOf(st, ZOMBIE)
    check(vS2 and zS2, name .. ': clinch scenes created')
    if not (vS2 and zS2) then return end
    check(zA2.blendIn >= 1000 and zA2.moverBlend >= 1000, name .. ': zombie switches grab -> clinch in one frame')
    if k == 0 then
        check(vA2.blendIn < 100, name .. ': victim keeps his origin (dir 0) and blends')
    else
        check(vA2.blendIn >= 1000 and vA2.moverBlend >= 1000, name .. ': victim origin changes (turned variant) -> one-frame switch')
    end
    check(math.abs(dist2d(zS2.pos, vp) - 0.56) < 0.01 and math.abs(U.angleDiff(vS2.heading, vS.heading - dirYaw(k))) < 0.01, name .. ': clinch frames follow the registry origins')
    check(vS2.loop == true and zS2.loop == true, name .. ': clinch loops')
    M.advance(300, 10)
    local stopped = {}
    for _, s in ipairs(ops(since(mark), 'stop')) do stopped[s.id] = true end
    check(stopped[vS.id] and stopped[zS.id], name .. ': grab scenes stopped after the clinch took over')

    -- Intensity change at the loop seam: same origins -> blended.
    mark = #log
    M.fire(Ev.FinisherProgress, 65535, finId, 90.0, 4000)
    M.advance(math.floor(Clips.entry('fin_struggle_mid', 'm').duration * 1000) + 100, 10)
    local _, vA3 = sceneOf(since(mark), VICTIM)
    local _, zA3 = sceneOf(since(mark), ZOMBIE)
    check(vA3 and zA3 and vA3.blendIn < 100 and zA3.blendIn < 100 and zA3.clip:find('high'), name .. ': intensity change blends (same frames)')

    -- Result: same origins as the clinch -> blended.
    mark = #log
    M.fire(Ev.FinisherResult, 65535, finId, result)
    local res = since(mark)
    local vS4, vA4 = sceneOf(res, VICTIM)
    local _, zA4 = sceneOf(res, ZOMBIE)
    check(vA4 and zA4 and vA4.blendIn < 100 and zA4.blendIn < 100, name .. ': result clip blends from the clinch')
    check(vA4 and vA4.clip:find(result == 'success' and 'shove' or 'bite'), name .. ': result clip played')
    local resEntry = Clips.entry(result == 'success' and 'fin_shove' or 'fin_bite', 'm')
    M.advance(math.floor(resEntry.duration * 1000) + 100, 10)
    check(ZFin.active == nil, name .. ': finisher released at the end')
    stopped = {}
    for _, s in ipairs(ops(since(mark), 'stop')) do stopped[s.id] = true end
    check(vS4 and stopped[vS4.id], name .. ': release stops the current scenes')
end

flow('front', 90.0, 90.0, 0.95, 'success')               -- zombie straight in front
flow('behind', 0.0, 180.0, 0.9, 'bite')                  -- grabbed from behind (dir 4)
flow('right side, off-grid', 30.0, 290.0, 0.8, 'success') -- 100 deg -> variant 2 (90) with 10 deg left over
flow('worst residual', 0.0, 22.4, 1.0, 'bite')            -- 22.4 deg between two variants

if M.errors then for _, e in ipairs(M.errors) do failed = failed + 1; print('ERROR ' .. e) end end
print(('client finisher: %d passed, %d failed'):format(passed, failed))
os.exit(failed == 0 and 0 or 1)
