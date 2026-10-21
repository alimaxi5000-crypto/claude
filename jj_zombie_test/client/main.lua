-- Client bootstrap: shared client state, notifications, chat suggestions, live tuning.
JJZC = JJZC or {}
local C = JJZC

C.ped = PlayerPedId()
C.serverId = GetPlayerServerId(PlayerId())

-- Server events must come from the server (source 65535); everything else is ignored.
function C.fromServer()
    return tonumber(source) == 65535
end

RegisterNetEvent(JJZ.Events.Notify, function(msg, kind)
    if not C.fromServer() or type(msg) ~= 'string' then return end
    IntegrationC.notify(msg:sub(1, 300), kind)
end)

RegisterNetEvent(JJZ.Events.Suggestions, function(list)
    if not C.fromServer() or type(list) ~= 'table' then return end
    for _, s in ipairs(list) do
        if type(s) == 'table' and type(s.name) == 'string' then
            IntegrationC.addSuggestion(s.name, s.help, s.params)
        end
    end
end)

-- Live tuning values pushed by the server (/ztune). Only whitelisted keys are applied.
RegisterNetEvent(JJZ.Events.TuneSync, function(values)
    if not C.fromServer() or type(values) ~= 'table' then return end
    for key, v in pairs(values) do
        local def = Config.Tunable[key]
        if def and type(v) == 'number' then
            Config[def[1]][def[2]] = math.max(def[3], math.min(def[4], v))
        end
    end
end)

-- Keep the cached ped handle fresh (model/character changes create a new ped).
CreateThread(function()
    while true do
        C.ped = PlayerPedId()
        Wait(500)
    end
end)

CreateThread(function()
    -- Ask the server for suggestions/tuning once the client is ready.
    while not NetworkIsPlayerActive(PlayerId()) do Wait(250) end
    TriggerServerEvent(JJZ.Events.Ready)
end)
