-- Quick test of a streamed clip on your own ped (no studio needed):
--   /animtest <dict> [clip] [loop]   start (clip defaults to the dict name without a leading "jj_")
--   /animtest  or  /animtest stop     stop the running test
-- Only plays clips that are streamed (jj_animstudio_stream or any other resource). Purely local.
local playing = nil

local function say(text) TriggerEvent('chat:addMessage', { args = { 'animtest', text } }); print('[animtest] ' .. text) end

local function stop()
    if not playing then return false end
    local ped = PlayerPedId()
    StopAnimTask(ped, playing.dict, playing.clip, 2.0)
    RemoveAnimDict(playing.dict)
    say(L('test_stopped', playing.dict, playing.clip))
    playing = nil
    return true
end

RegisterCommand(Config.TestCommand, function(_, args)
    local dict = args[1]
    if not dict or dict == 'stop' then
        if not stop() then say(L('test_usage', Config.TestCommand)) end
        return
    end
    stop()
    if not dict:match('^[%w_]+$') then return say(L('test_usage', Config.TestCommand)) end
    local clip = args[2] and args[2] ~= 'loop' and args[2] or dict:gsub('^jj_', '')
    local loop = args[2] == 'loop' or args[3] == 'loop'
    if not DoesAnimDictExist(dict) then return say(L('test_missing', dict)) end
    RequestAnimDict(dict)
    local deadline = GetGameTimer() + 5000
    while not HasAnimDictLoaded(dict) do
        if GetGameTimer() > deadline then return say(L('dict_timeout', dict)) end
        Wait(0)
    end
    local ped = PlayerPedId()
    -- flags: 1 = loop, 0 = play once (the ped returns to normal at the end)
    TaskPlayAnim(ped, dict, clip, 8.0, -8.0, -1, loop and 1 or 0, 0.0, false, false, false)
    Wait(100)
    if not IsEntityPlayingAnim(ped, dict, clip, 3) then
        RemoveAnimDict(dict)
        return say(L('test_noclip', clip, dict))
    end
    playing = { dict = dict, clip = clip }
    say(L('test_started', dict, clip, Config.TestCommand))
end, false)
