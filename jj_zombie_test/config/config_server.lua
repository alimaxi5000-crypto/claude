--[[ ============================================================
   JJ SCRIPTS - jj_zombie_test  |  config_server.lua  (server only)
   Anti-cheat thresholds, integration switches and file paths.
============================================================ ]]
ConfigServer = {}

-- ============================================================
--  INPUT VALIDATION (finisher key presses)
--  The client sends batches of key press timestamps; the server decides what counts.
-- ============================================================
ConfigServer.Input = {
    MinIntervalMs = 55,          -- Presses closer than this are ignored (humans rarely beat ~16/s).
    MaxPressesPerSecond = 14,    -- Sustained rate cap; presses above it are ignored.
    MaxBatchSize = 6,            -- Max presses per network batch (client sends ~10 batches/s).
    MaxClockSkewMs = 400,        -- Client timestamps may lead the server clock by at most this.
    RegularityWindow = 12,       -- Intervals used to detect autoclickers (too regular); shorter than a win (~20 presses).
    RegularityStdDevMs = 2.5,    -- Std-dev below this over the window = machine-like input.
    OnSuspicious = 'ignore',     -- 'ignore' (stop counting presses), 'log' (count, but log), 'kick'
}

-- ============================================================
--  EVENT RATE LIMITS (per player)
-- ============================================================
ConfigServer.RateLimit = {
    Commands = { max = 6, perMs = 3000 },      -- test commands
    Input = { max = 15, perMs = 1000 },        -- finisher key press batches (client sends ~10/s)
    Reports = { max = 8, perMs = 1000 },       -- client reports (space check, events, anim results)
    CaptureFrames = { max = 24, perMs = 5000 },   -- screenshots requested by /zcapture
}

-- ============================================================
--  INTEGRATIONS (jj_* resources)
--  Every call is wrapped; a missing resource or a different API only disables that feature.
-- ============================================================
ConfigServer.Integration = {
    UseJJCoreRoles = true,       -- Core.hasRole(src, Config.Permissions.MinRole)
    UseJJNeedsStress = true,     -- Needs.addStress(src, amount, reason) / exports.jj_needs:addStress
    UseJJInventoryBlock = true,  -- exports.jj_inventory:setBlocked(src, reason, on)
    UseJJHealthDownState = true, -- read the down/dead state from jj_health (event jj:server:downChanged)
}

-- ============================================================
--  CAPTURE (/zcapture) - where screenshots are written on the server machine
--  Relative to this resource folder. The folder must exist.
-- ============================================================
ConfigServer.Capture = {
    Directory = '../../../../../jj_zombie_dev/captures', -- resources/[jj]/jj_zombie_test -> DEVSERVER/jj_zombie_dev/captures
    MaxFrames = 120,             -- per capture session ('all' = 4 scenes x 6 steps x 4 cameras = 96)
    Quality = 0.92,              -- jpg quality for screenshot-basic
}

-- ============================================================
--  LOGGING
-- ============================================================
ConfigServer.Log = {
    Finishers = true,            -- print finisher results
    Suspicious = true,           -- print suspicious input
}
