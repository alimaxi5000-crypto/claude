--[[ ============================================================
   JJ SCRIPTS - jj_zombie_test  |  config.lua  (shared, visible to every client)
   ------------------------------------------------------------
   Test system for zombies with a custom paired finisher.
   * true = on, false = off
   * Text in 'quotes' must stay in quotes
   * Distances are meters, times are seconds unless the name says Ms
   Secrets and anti-cheat thresholds live in config_server.lua.
============================================================ ]]
Config = {}

-- ============================================================
--  GENERAL
-- ============================================================
Config.Locale = 'de'   -- Language of all player texts. Options: 'de', 'en' | Default: 'de'
Config.Debug = false   -- Extra console output. Keep false on a live server.

-- ============================================================
--  PERMISSIONS
--  All test commands are checked on the server on every call.
-- ============================================================
Config.Permissions = {
    MinRole = 'admin',              -- jj_core role needed for the test commands (Core.hasRole(src, MinRole))
    AceFallback = 'jj_zombie.admin', -- ACE used only if jj_core is not available. Example: add_ace group.admin jj_zombie.admin allow
}

-- ============================================================
--  COMMANDS
--  Change a name here if it collides with another resource.
-- ============================================================
Config.Commands = {
    Spawn = 'zspawn',        -- /zspawn [1-5] [schlurfer|laeufer]
    Clear = 'zclear',        -- /zclear [alle]
    Kill = 'zkill',          -- /zkill [alle]  kills your (or all) test zombies
    Type = 'ztype',          -- /ztype <schlurfer|laeufer>  default type for /zspawn
    Debug = 'zdebug',        -- /zdebug  overlay (state, target, distance, path, grab point, scene origin)
    Freeze = 'zfreeze',      -- /zfreeze  pause/resume all zombie AI
    Finisher = 'zfinisher',  -- /zfinisher  start the finisher with the nearest zombie right away
    Capture = 'zcapture',    -- /zcapture [sequence]  scripted finisher with fixed cameras + screenshots
    Cam = 'zcam',            -- /zcam  free debug camera around the scene
    Align = 'zalign',        -- /zalign  live alignment tuning of the finisher scene
    TestAnim = 'ztestanim',  -- /ztestanim [bob|face|wave|stop] [self]  custom animation smoke test
    Tune = 'ztune',          -- /ztune <key> <value>  change a live tuning constant (see Config.Tunable)
}

-- ============================================================
--  SPAWNING
-- ============================================================
Config.Spawn = {
    Model = 'u_m_y_zombie_01',   -- GTA zombie model (official ped model list). Must be a ped model.
    DistanceMin = 8.0,           -- Spawn distance in front of the player (meters). Default: 8.0
    DistanceMax = 14.0,          -- Default: 14.0
    SpreadDegrees = 55.0,        -- Horizontal spread around your view direction. Default: 55
    MinSpacing = 1.8,            -- Minimum distance between spawned zombies. Default: 1.8
    MaxPerCommand = 5,           -- Upper bound for /zspawn [count]. Default: 5
    MaxPerPlayer = 10,           -- Living test zombies per player. Default: 10
    MaxGlobal = 30,              -- Living test zombies on the whole server. Default: 30
    LifetimeMinutes = 20,        -- Zombies are removed after this time. Default: 20
    CorpseSeconds = 25,          -- Dead zombies disappear after this time. Default: 25
}

-- ============================================================
--  ZOMBIE TYPES
--  schlurfer = slow, dragging, persistent | laeufer = sprints after seeing you, then tires
-- ============================================================
Config.Types = {
    schlurfer = {
        Health = 260,            -- Ped health (100 = dead). Headshots always kill.
        MoveRate = 0.85,         -- Animation/movement rate multiplier while chasing.
        ChaseMode = 'walk',      -- 'walk' or 'run'
        GrabStrength = 1.0,      -- Finisher difficulty multiplier (higher = harder to push away).
        BiteDamageMult = 1.0,    -- Multiplier for Config.Finisher.BiteDamage.
        Scale = { 0.97, 1.03 },  -- Random visual size variation (min, max). 1.0 = normal.
    },
    laeufer = {
        Health = 200,
        MoveRate = 1.0,
        ChaseMode = 'run',
        SprintSeconds = 5.0,     -- Sprint duration after first sight of the target.
        TiredSeconds = 3.5,      -- Slows down to a walk for this long, then sprints again.
        GrabStrength = 1.35,
        BiteDamageMult = 1.15,
        Scale = { 0.98, 1.04 },
    },
}
Config.DefaultType = 'mixed'     -- Type used when /zspawn has none: 'schlurfer', 'laeufer' or 'mixed'

-- ============================================================
--  ZOMBIE AI
-- ============================================================
Config.AI = {
    TargetRadius = 40.0,         -- Nearest player inside this radius becomes the target. Default: 40
    LoseTargetRadius = 55.0,     -- Target is dropped beyond this distance. Default: 55
    AttackReadyDistance = 2.4,   -- Distance at which the zombie gets ready to grab. Default: 2.4
    GrabDistance = 1.0,          -- Distance at which the finisher starts (~1 m). Default: 1.0
    GrabMaxHeightDiff = 0.8,     -- No grab across bigger height differences (stairs, ledges).
    SeparationRadius = 1.5,      -- Zombies keep this distance from each other. Default: 1.5
    WaitDistance = 2.6,          -- A second zombie waits at this distance while someone is grabbed.
    StuckSeconds = 2.5,          -- No progress for this long = stuck (unstuck routine starts).
    AlertSeconds = 1.2,          -- Alerted reaction (roar) before chasing.
}

-- ============================================================
--  FINISHER (grab -> struggle minigame -> shove or bite)
-- ============================================================
Config.Finisher = {
    Enabled = true,
    KeyDefault = 'E',            -- Default key (players can rebind it in GTA settings -> Key Bindings -> FiveM).
    TimeLimitSeconds = 7.0,      -- Struggle time limit. Default: 7.0
    StartProgress = 30,          -- Progress (0-100) at the start of the struggle. Default: 30
    ProgressPerPress = 4.0,      -- Progress per valid key press (before difficulty). Default: 4.0
    DecayPerSecond = 12.0,       -- Progress lost per second. Default: 12
    -- Balance: ~8.5 presses/s escapes a schlurfer in ~3 s and a laeufer in ~5 s; 6 presses/s
    -- barely escapes a schlurfer and loses against a laeufer. Live tuning: /ztune press|decay.
    GraceSeconds = 4.0,          -- No new grab for this long after a finisher ends. Default: 4
    StunSeconds = 3.5,           -- Zombie lies stunned after being shoved away. Default: 3.5
    BiteDamage = 60,             -- Health damage of the bite (player health 200 = full, 100 = dead). Default: 60
    StressOnGrab = 8,            -- Stress added when grabbed (jj_needs).
    StressOnBite = 30,           -- Stress added when bitten (jj_needs).
    BlockedFallback = 'swipe',   -- No room for the scene: 'swipe' (short bite attempt) or 'none'
    SceneMinClearance = 0.55,    -- Free radius needed around both bodies (meters).
    Difficulty = {               -- Thresholds for the struggle intensity loops (progress %)
        ZombieWinsBelow = 35,
        PlayerWinsAbove = 70,
    },
}

-- ============================================================
--  EFFECTS / CAMERA / SOUND (client side, visual only)
-- ============================================================
Config.Effects = {
    Blood = true,                -- Blood particles + damage decals on bite.
    BloodPtfxAsset = 'core',     -- Particle asset dictionary. VERIFY in game; change if not visible.
    BloodPtfxName = 'blood_stab',
    BloodDamagePack = 'BigHitByVehicle', -- Ped damage pack applied on bite (cosmetic).
    SlowMotion = true,           -- Short slow motion at the shove impact.
    SlowMotionScale = 0.35,
    SlowMotionMs = 220,
    CustomGetup = true,          -- Zombie gets up with the custom get-up clips after being knocked down.
                                 -- false = GTA's own physical get-up.
}
Config.Camera = {
    Enabled = true,              -- Scripted close camera during the finisher.
    ShakeMax = 0.55,             -- Camera shake at maximum danger.
    Fov = 42.0,
}
Config.Sound = {
    Enabled = true,              -- Procedural sounds via NUI (heartbeat, breath, growls, impacts).
    Volume = 0.8,                -- 0.0 - 1.0
    GrowlRange = 25.0,           -- Zombie growls are audible within this range.
}

-- ============================================================
--  UI
-- ============================================================
Config.UI = {
    Position = 'bottom',         -- 'bottom' or 'center'
    AccentColor = '#e8e8e8',     -- Progress bar color
    DangerColor = '#d9453d',     -- Color while the zombie is winning
    Vignette = true,             -- Red screen-edge vignette that grows while the zombie is winning
}

-- ============================================================
--  LIVE TUNING (/ztune key value) - admins only, not persisted
--  Keys listed here can be changed at runtime for testing.
-- ============================================================
Config.Tunable = {
    grab = { 'AI', 'GrabDistance', 0.5, 2.0 },
    ready = { 'AI', 'AttackReadyDistance', 1.2, 5.0 },
    radius = { 'AI', 'TargetRadius', 5.0, 120.0 },
    limit = { 'Finisher', 'TimeLimitSeconds', 2.0, 20.0 },
    press = { 'Finisher', 'ProgressPerPress', 1.0, 30.0 },
    decay = { 'Finisher', 'DecayPerSecond', 0.0, 60.0 },
    grace = { 'Finisher', 'GraceSeconds', 0.0, 30.0 },
    bite = { 'Finisher', 'BiteDamage', 0, 200 },
}

-- ============================================================
--  CLIENT INTEGRATIONS
-- ============================================================
Config.Integration = {
    UseGameplayExports = false,  -- Also lock sprint/jump/weapon wheel via jj_gameplay exports during the finisher.
                                 -- The finisher always disables these controls itself; enable after verifying the export API.
}

-- ============================================================
--  CLIP OVERRIDES
--  Replace any registry entry without code changes. Key = registry name ('name' or 'name:variant').
--  Example: Config.ClipOverrides['move_shamble'] = { dict = 'my_anims', clip = 'my_walk', playback = { flags = 1 } }
-- ============================================================
Config.ClipOverrides = {}
