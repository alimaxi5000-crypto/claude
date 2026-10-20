-- Event names and fixed values. Every event name is defined only here.
JJS = JJS or {}

JJS.Events = {
    -- client -> server
    open = 'jj_animstudio:server:open',
    close = 'jj_animstudio:server:close',
    list = 'jj_animstudio:server:list',
    load = 'jj_animstudio:server:load',
    save = 'jj_animstudio:server:save',
    rename = 'jj_animstudio:server:rename',
    duplicate = 'jj_animstudio:server:duplicate',
    delete = 'jj_animstudio:server:delete',
    preview = 'jj_animstudio:server:preview',
    finalize = 'jj_animstudio:server:finalize',
    poseSave = 'jj_animstudio:server:poseSave',
    poseDelete = 'jj_animstudio:server:poseDelete',
    -- server -> client
    opened = 'jj_animstudio:client:opened',
    denied = 'jj_animstudio:client:denied',
    projects = 'jj_animstudio:client:projects',
    project = 'jj_animstudio:client:project',
    reply = 'jj_animstudio:client:reply',
    job = 'jj_animstudio:client:job',
    poses = 'jj_animstudio:client:poses',
    notice = 'jj_animstudio:client:notice',
}

JJS.NAME_MAX = 40
JJS.LATENT_BPS = 200000          -- bytes per second for latent events (big project data)
JJS.FORMAT = 'jj-anim/1'
