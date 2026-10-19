fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'jj_zombie_test'
author 'JJ Scripts'
version '0.1.0'
description 'Zombie test system: server-owned zombies, owner-client AI and a paired finisher with custom animations'

-- jj_lib / jj_core imports follow the server convention (JJ / Core globals). The resource also
-- works without them: integration/*.lua falls back to ACE permissions and plain prints.
shared_scripts {
    '@jj_lib/init.lua',
    '@jj_core/import.lua',
    'config/config.lua',
    'locales/locales.lua',
    'shared/constants.lua',
    'shared/util.lua',
    'shared/clips_data.lua',
    'shared/clips.lua',
}

server_scripts {
    'config/config_server.lua',
    'integration/server.lua',
    'server/net.lua',
    'server/ownership.lua',
    'server/ai_state.lua',
    'server/zombies.lua',
    'server/damage.lua',
    'server/finisher.lua',
    'server/capture.lua',
    'server/commands.lua',
    'server/boot.lua',
}

client_scripts {
    'integration/client.lua',
    'client/anim.lua',
    'client/main.lua',
    'client/movement.lua',
    'client/ai.lua',
    'client/fx.lua',
    'client/camera.lua',
    'client/sound.lua',
    'client/finisher.lua',
    'client/capture.lua',
    'client/debug.lua',
    'client/testanim.lua',
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/finisher.css',
    'html/finisher.js',
    'html/sound.js',
}

dependencies {
    '/onesync',
}
