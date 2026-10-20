-- Shared constants: event names, state bag keys, state enums. One source of truth for both sides.
JJZ = JJZ or {}

local R = GetCurrentResourceName()

-- Network events. Naming: jj_zombie:server:<action> / jj_zombie:client:<action>
JJZ.Events = {
    -- client -> server (all validated server-side)
    StruggleInput = 'jj_zombie:server:struggleInput',   -- (finId, seq, presses[])
    SpaceReport = 'jj_zombie:server:spaceReport',       -- (ok) grab space around the local player
    FinisherClientState = 'jj_zombie:server:finClient', -- (finId, phase) victim client progress report
    AnimReport = 'jj_zombie:server:animReport',         -- (result table) /ztestanim result for the server log
    CaptureFrame = 'jj_zombie:server:captureFrame',     -- (sessionId, index) request: take screenshot now
    CaptureDone = 'jj_zombie:server:captureDone',       -- (sessionId)
    AlignResult = 'jj_zombie:server:alignResult',       -- (values) /zalign final values for the server log
    Ready = 'jj_zombie:server:ready',                   -- client finished loading (suggestions, settings)
    SpawnPoints = 'jj_zombie:server:spawnPoints',       -- (reqId, points[]) validated spawn points from the requester
    ZombieInit = 'jj_zombie:server:zombieInit',         -- (netId) owner applied the initial ped setup
    ZombieHeld = 'jj_zombie:server:zombieHeld',         -- (netId, finId) owner stopped the zombie's own tasks for the finisher

    -- server -> client
    Notify = 'jj_zombie:client:notify',
    Suggestions = 'jj_zombie:client:suggestions',
    FinisherStart = 'jj_zombie:client:finisherStart',   -- to the victim
    FinisherProgress = 'jj_zombie:client:finisherProgress', -- to the victim (throttled)
    FinisherResult = 'jj_zombie:client:finisherResult', -- to the victim
    FinisherAbort = 'jj_zombie:client:finisherAbort',   -- to the victim
    ApplyBite = 'jj_zombie:client:applyBite',           -- to the victim (damage + fx)
    Swipe = 'jj_zombie:client:swipe',                   -- blocked-space fallback attack (to the victim)
    ZombieImpact = 'jj_zombie:client:zombieImpact',     -- to the zombie owner (ragdoll + push)
    ToggleDebug = 'jj_zombie:client:toggleDebug',
    ToggleCam = 'jj_zombie:client:toggleCam',
    StartAlign = 'jj_zombie:client:startAlign',
    TestAnim = 'jj_zombie:client:testAnim',
    CaptureStart = 'jj_zombie:client:captureStart',
    CaptureAck = 'jj_zombie:client:captureAck',         -- (sessionId, index, ok) screenshot stored
    TuneSync = 'jj_zombie:client:tuneSync',             -- live tuning values (broadcast)
    FindSpawn = 'jj_zombie:client:findSpawn',           -- (reqId, count, params) ask the requester for spawn points
    ZombieCmd = 'jj_zombie:client:zombieCmd',           -- (netId, cmd) owner-side command (kill, unstuck)
}

-- Server-internal (AddEventHandler only, never networked)
JJZ.LocalEvents = {
    Bitten = 'jj_zombie:server:bitten',                 -- (src, info) hook for a future infection system
    FinisherEnded = 'jj_zombie:server:finisherEnded',   -- (src, result, info)
}

-- Entity state bag keys (server-set, replicated, read-only for clients).
JJZ.State = {
    IsZombie = 'jjz',        -- true on every test zombie
    Type = 'jjz_type',       -- 'schlurfer' | 'laeufer'
    Ai = 'jjz_ai',           -- AI state string (see JJZ.AiState)
    Target = 'jjz_target',   -- target server id or 0
    Fin = 'jjz_fin',         -- finisher id while grabbed (0 otherwise)
    Spawner = 'jjz_owner',   -- server id of the player who spawned it
    Seed = 'jjz_seed',       -- per-zombie random seed (visual variation)
    Frozen = 'jjz_frozen',   -- global AI pause flag (GlobalState)
    StunUntil = 'jjz_stun',  -- server time (ms) until which the zombie is stunned
    Speed = 'jjz_speed',     -- 'walk' | 'run' (laeufer sprint cycle)
    Slot = 'jjz_slot',       -- approach/hold angle around the target (degrees)
    Init = 'jjz_init',       -- initial ped setup (health, variation) done
    Unstuck = 'jjz_unstuck', -- counter, incremented by the server when stuck
    Home = 'jjz_home',       -- spawn position (vector3) for idle wandering
}
-- Player state bag keys (server-set).
JJZ.PlayerState = {
    Fin = 'jjz_fin',         -- active finisher id (0 = none)
    Bitten = 'jjz_bitten',   -- { count, last } bite marker for a future infection system
}

JJZ.AiState = {
    Idle = 'idle',           -- wandering / standing
    Alerted = 'alerted',     -- noticed a target, roars
    Chase = 'chase',         -- follows the target
    Ready = 'ready',         -- close, ready to grab
    Grab = 'grab',           -- in a finisher
    Hold = 'hold',           -- waits at a distance while the target is grabbed by another zombie
    Stunned = 'stunned',     -- knocked back / getting up
    Dead = 'dead',
}

JJZ.FinPhase = {
    Starting = 'starting',   -- server created it, waiting for the victim client to start the scene
    Grab = 'grab',
    Struggle = 'struggle',
    Success = 'success',     -- player shoves the zombie away
    Bite = 'bite',           -- zombie bites, then the player strikes it away
    Ended = 'ended',
}

JJZ.Results = { Success = 'success', Bite = 'bite', Aborted = 'aborted' }

JJZ.ResourceName = R
