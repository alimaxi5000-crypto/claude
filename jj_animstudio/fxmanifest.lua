fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'jj_animstudio'
author 'JJ Scripts'
version '0.1.0'
description 'In-game animation studio: edit poses on a 3D skeleton, convert to real .ycd files (animkit), test on the real ped'

-- No framework dependency. Access: ACE jj_animstudio.use (optional jj_core role hook in editable/server.lua).
-- The converter (animkit watch) runs as its own process; the clips are streamed by the generated
-- resource jj_animstudio_stream.
shared_scripts {
    'config/config.lua',
    'locales/locales.lua',
    'locales/de.lua',
    'locales/en.lua',
    'shared/constants.lua',
    'shared/util.lua',
}

server_scripts {
    'config/config_server.lua',
    'editable/server.lua',
    'server/storage.lua',
    'server/jobs.lua',
    'server/main.lua',
}

client_scripts {
    'client/camera.lua',
    'client/peds.lua',
    'client/playback.lua',
    'client/main.lua',
}

ui_page 'web/index.html'

files {
    'web/index.html',
    'web/studio.css',
    'web/studio.bundle.js',
}
