--[[ JJ SCRIPTS - Animation Studio | config/config_server.lua
   Server-only settings (never sent to players). ]]
ConfigServer = {}

ConfigServer.StreamResource = 'jj_animstudio_stream'  -- Generated stream resource (by animkit watch) | Default 'jj_animstudio_stream'
-- How the stream resource is restarted after a build:
--   'native'  = StopResource/StartResource natives (default)
--   'command' = ExecuteCommand('ensure <name>'), needs in server.cfg:
--               add_ace resource.jj_animstudio command.ensure allow
ConfigServer.RestartMethod = 'native'

ConfigServer.MaxProjectBytes = 2 * 1024 * 1024        -- Largest project file (bytes) | Default 2 MB
ConfigServer.MaxProjects = 200                        -- Most projects that can be stored | Default 200
ConfigServer.Backups = 10                             -- Backups kept per project (older versions) | Default 10
ConfigServer.MaxPoses = 200                           -- Most poses in the pose library | Default 200
ConfigServer.MaxPoseBytes = 32 * 1024                 -- Largest single pose (bytes) | Default 32 KB
ConfigServer.JobTimeoutSeconds = 60                   -- A conversion that takes longer is reported as failed | Default 60
ConfigServer.WatchMaxAgeSeconds = 15                  -- Converter counts as "not running" if its heartbeat is older | Default 15
ConfigServer.MaxPendingJobs = 10                      -- Jobs waiting at the same time (all players) | Default 10

-- Minimum time between two requests of the same kind per player (milliseconds).
ConfigServer.RateLimits = {
    default = 250,
    save = 2000,
    preview = 3000,
    finalize = 5000,
    pose = 1000,
}
