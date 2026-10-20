--[[ ============================================================
   JJ SCRIPTS - Animation Studio  |  config/config.lua
   ------------------------------------------------------------
   Settings that both the server and the players' game read.
   Server-only limits are in config/config_server.lua.
   * true = on, false = off; text stays in 'quotes'
============================================================ ]]
Config = {}

-- ============================================================
--  GENERAL
-- ============================================================
Config.Locale = 'de'                 -- Language of chat messages and the studio UI. 'de' or 'en' | Default 'de'
Config.Command = 'animstudio'        -- Chat command: /animstudio opens, /animstudio close closes | Default 'animstudio'
Config.Debug = false                 -- true = extra F8 / server console output. Keep false on a live server.

-- ============================================================
--  ACCESS
--  Who may use the studio. Default: everyone with the ACE permission below, e.g. in server.cfg:
--    add_ace group.admin jj_animstudio.use allow
-- ============================================================
Config.Ace = 'jj_animstudio.use'     -- ACE permission name | Default 'jj_animstudio.use'
Config.JJCoreRole = 'admin'          -- Also allow this jj_core role and higher (needs jj_core running). false = ACE only | Default 'admin'

-- ============================================================
--  STUDIO
-- ============================================================
Config.AutosaveSeconds = 30          -- Automatic save interval while the studio is open (seconds) | Default 30
Config.UndoSteps = 150               -- How many steps "Rückgängig" can go back (at least 100) | Default 150
Config.GhostAlpha = 102              -- Transparency of the real ped while editing, 0-255 (GTA uses steps of 51) | Default 102
Config.DefaultDuration = 2.0         -- Length of a new animation in seconds | Default 2.0
Config.ShowTutorial = true           -- Show the 5-step introduction on the first start | Default true

-- Models offered for the partner in pair animations (spawned only for you, not networked).
Config.PartnerModels = {
    { model = 'mp_m_freemode_01', label = 'Mann (Freemode)' },
    { model = 'mp_f_freemode_01', label = 'Frau (Freemode)' },
    { model = 'u_m_y_zombie_01', label = 'Zombie' },
    { model = 'a_m_y_skater_01', label = 'Skater (männliches Skelett)' },
}

-- ============================================================
--  CAMERA
-- ============================================================
Config.Camera = {
    Fov = 45.0,                      -- Field of view in degrees (GTA script cameras: vertical, see docs/KNOWN_ISSUES.md) | Default 45
    MinDistance = 0.4,               -- Closest zoom in metres | Default 0.4
    MaxDistance = 12.0,              -- Farthest zoom in metres | Default 12
    UpdatesPerSecond = 30,           -- How often the UI sends camera values to the game (max 30) | Default 30
}

-- ============================================================
--  TEST IN GAME
-- ============================================================
Config.Test = {
    ContactRedCm = 3.0,              -- Contact distances above this are shown red | Default 3.0
    MeasureIntervalMs = 100,         -- How often contact points are measured during a test | Default 100
    DictLoadTimeoutMs = 8000,        -- Maximum wait for the new clip dictionary after the stream restart | Default 8000
}
