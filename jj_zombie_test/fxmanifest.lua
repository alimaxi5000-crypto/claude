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
    'server/commands.lua',
    'server/boot.lua',
}

client_scripts {
    'integration/client.lua',
    'client/anim.lua',
    'client/main.lua',
    'client/testanim.lua',
}

dependencies {
    '/onesync',
}
