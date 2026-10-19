-- Sound: procedural WebAudio in the NUI page (html/sound.js). No audio files and no game sound
-- names are needed; everything is synthesised (heartbeat, breathing, growls, impacts, bite).
-- Sounds are local to this client. Zombie growls for bystanders are distance-attenuated.
ZSound = {}

local function send(msg)
    if not Config.Sound.Enabled then return end
    SendNUIMessage(msg)
end

-- One-shot effect. name: grab, snap, shove, bite, punch, growl, roar, swipe, gasp
function ZSound.play(name, volume, pitch)
    send({ type = 'sfx', name = name, volume = (volume or 1.0) * Config.Sound.Volume, pitch = pitch or 1.0 })
end

-- Continuous layers (heartbeat, breath, struggle) with an intensity 0..1.
function ZSound.loop(name, on, intensity)
    send({ type = 'loop', name = name, on = on and true or false, intensity = intensity or 0.0, volume = Config.Sound.Volume })
end

function ZSound.stopAll()
    SendNUIMessage({ type = 'loop', name = '*', on = false })
end

-- Ambient growls of zombies near the local player (one check per second, no per-frame work).
CreateThread(function()
    local nextGrowl = {}
    while true do
        Wait(1000)
        if Config.Sound.Enabled and next(ZAI.list) then
            local me = GetEntityCoords(PlayerPedId())
            local now = GetGameTimer()
            for ent, info in pairs(ZAI.list) do
                if DoesEntityExist(ent) and not IsPedDeadOrDying(ent, true) then
                    local d = #(GetEntityCoords(ent) - me)
                    if d < Config.Sound.GrowlRange and now >= (nextGrowl[ent] or 0) then
                        local vol = (1.0 - d / Config.Sound.GrowlRange) ^ 1.6
                        local r = JJZ.U.rng((info.seed or 1) + now)
                        ZSound.play('growl', vol * 0.8, 0.85 + r() * 0.3)
                        nextGrowl[ent] = now + 3500 + math.floor(r() * 5000)
                    end
                end
            end
            for ent in pairs(nextGrowl) do if not DoesEntityExist(ent) then nextGrowl[ent] = nil end end
        end
    end
end)

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() then ZSound.stopAll() end
end)
