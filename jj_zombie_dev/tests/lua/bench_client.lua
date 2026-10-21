-- Client manager benchmark for jj_zombie_test: loads the real client files with stubbed client
-- natives (every native returns quickly) and measures the resource's own Lua work plus the
-- number of native calls per second for 0 / 10 / 30 / 100 zombies owned by the local player.
-- Real native costs are not included; PERFORMANCE.md estimates them from the call counts.
--   lua5.4 tests/lua/bench_client.lua <path to jj_zombie_test>
local here = debug.getinfo(1, 'S').source:sub(2):match('(.*/)') or './'
package.path = here .. '?.lua;' .. package.path
local M = require('mock')
local RES = arg[1] or (here .. '../../../jj_zombie_test')

-- ------------------------------------------------------------------ client natives
local calls, total = {}, 0
local peds, me = {}, 1
local function count(name) calls[name] = (calls[name] or 0) + 1; total = total + 1 end
local zombieState = {}
local overrides = {
    PlayerPedId = function() return me end,
    PlayerId = function() return 0 end,
    GetPlayerServerId = function() return 1 end,
    GetPlayerFromServerId = function() return 0 end,
    GetPlayerPed = function() return me end,
    GetGamePool = function() local l = { me }; for p in pairs(peds) do l[#l + 1] = p end; return l end,
    IsPedAPlayer = function(p) return p == me end,
    NetworkGetEntityIsNetworked = function() return true end,
    NetworkGetEntityOwner = function() return 0 end,
    NetworkGetNetworkIdFromEntity = function(p) return p end,
    NetworkIsPlayerActive = function() return true end,
    DoesEntityExist = function(p) return p == me or peds[p] ~= nil end,
    GetEntityCoords = function(p) return p == me and vector3(0, 0, 30) or (peds[p] and peds[p].pos or vector3(0, 0, 0)) end,
    GetEntityHeading = function() return 0.0 end,
    GetEntityHealth = function() return 1300 end,
    IsPedDeadOrDying = function() return false end,
    GetScriptTaskStatus = function() return 1 end,
    DoesAnimDictExist = function() return true end,
    HasAnimDictLoaded = function() return true end,
    GetPedLastDamageBone = function() return false, 0 end,
    GetResourceKvpString = function() return nil end,
    IsEntityPlayingAnim = function() return false end,
    GetEntityModel = function() return M.joaat('mp_m_freemode_01') end,
}
Entity = function(ent)
    local st = zombieState[ent]
    return { state = st or setmetatable({}, { __index = function() return nil end }) }
end
LocalPlayer = { state = setmetatable({}, { __index = function() return nil end }) }
GlobalState = {}
RegisterKeyMapping = function() end
RegisterNUICallback = function() end
SendNUIMessage = function() count('SendNUIMessage') end
TriggerServerEvent = function() count('TriggerServerEvent') end
for name, fn in pairs(overrides) do _G[name] = function(...) count(name); return fn(...) end end
-- Every other PascalCase global is treated as a native stub returning 0.
setmetatable(_G, { __index = function(_, k)
    if type(k) == 'string' and k:match('^[A-Z][a-z]') then
        local known = { Config = 1, ConfigServer = 1, Locales = 1, Integration = 1, IntegrationC = 1, JJZ = 1, ClipData = 1, Clips = 1, JJ = 1, Core = 1, Needs = 1, MOCK = 1, Anim = 1, ZAI = 1, ZFin = 1, ZCam = 1, ZFx = 1, ZSound = 1, ZMove = 1, ZPreview = 1, JJZC = 1 }
        if known[k] then return nil end
        return function() count(k); return 0 end
    end
    return nil
end })

-- ------------------------------------------------------------------ load shared + client files
local f = assert(io.open(RES .. '/fxmanifest.lua')); local manifest = f:read('a'); f:close()
local function list(key)
    local out = {}
    for file in (manifest:match(key .. 's%s*(%b{})') or ''):gmatch("'([^']+)'") do if file:sub(1, 1) ~= '@' then out[#out + 1] = file end end
    return out
end
for _, file in ipairs(list('shared_script')) do M.loadfile(RES .. '/' .. file)() end
for _, file in ipairs(list('client_script')) do M.loadfile(RES .. '/' .. file)() end
M.runDue()

local function setZombies(n)
    peds, zombieState = {}, {}
    for i = 1, n do
        local ent = 5000 + i
        peds[ent] = { pos = vector3((i % 10) * 2.0, 10 + math.floor(i / 10) * 2.0, 30) }
        zombieState[ent] = { jjz = true, jjz_type = (i % 2 == 0) and 'laeufer' or 'schlurfer', jjz_seed = i, jjz_ai = 'chase', jjz_target = 1, jjz_speed = 'walk', jjz_slot = 0, jjz_unstuck = 0, jjz_init = true }
    end
    ZAI.list = {}
end

local function run(n, seconds)
    setZombies(n)
    M.advance(3000, 50)     -- discovery + owner setup
    calls, total = {}, 0
    -- Baseline: the mock scheduler's own cost for the same time span without resource work.
    local saved = M.threads
    M.threads = {}
    local b0 = os.clock()
    M.advance(seconds * 1000, 16)
    local base = (os.clock() - b0) * 1000
    M.threads = saved
    for _, t in ipairs(M.threads) do t.wake = M.now end
    local r0 = M.resumes or 0
    collectgarbage('collect')
    local t0 = os.clock()
    M.advance(seconds * 1000, 16)
    local cpu = math.max(0, (os.clock() - t0) * 1000 - base)
    local nps = total / seconds
    M.print(('%3d zombies: Lua %.4f ms/s (%.5f ms per frame at 60 fps), %.1f thread wake-ups/s, %.0f native calls/s'):format(
        n, cpu / seconds, cpu / seconds / 60, ((M.resumes or 0) - r0) / seconds, nps))
    return nps
end

M.print('client manager (stubbed natives; real native cost not included):')
run(0, 30)
run(10, 20)
run(30, 20)
run(100, 20)
if M.errors and #M.errors > 0 then M.print('ERRORS:\n' .. M.errors[1]); os.exit(1) end
