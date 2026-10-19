-- Visual effects: blood on bite (networked particle burst on the neck bone, ped blood, ground
-- decal), short slow motion at impacts. Assets are requested on demand and released again.
ZFx = {}

local SKEL_NECK, SKEL_HEAD = 39317, 31086

local function withAsset(asset, fn)
    RequestNamedPtfxAsset(asset)
    local deadline = GetGameTimer() + 1500
    while not HasNamedPtfxAssetLoaded(asset) do
        if GetGameTimer() > deadline then return false end
        Wait(0)
    end
    UseParticleFxAsset(asset)
    fn()
    return true
end

-- Bite: visible to everyone through the networked particle effect; decals are local.
function ZFx.bite(victimPed)
    if not Config.Effects.Blood or not DoesEntityExist(victimPed) then return end
    local bone = GetPedBoneIndex(victimPed, SKEL_NECK)
    CreateThread(function()
        withAsset(Config.Effects.BloodPtfxAsset, function()
            for i = 1, 3 do
                UseParticleFxAsset(Config.Effects.BloodPtfxAsset)
                StartNetworkedParticleFxNonLoopedOnPedBone(Config.Effects.BloodPtfxName, victimPed,
                    0.02 * i, 0.06, 0.0, 0.0, 0.0, 90.0 * i, bone, 1.2, false, false, false)
                Wait(90)
            end
        end)
        RemoveNamedPtfxAsset(Config.Effects.BloodPtfxAsset)
    end)
    ApplyPedBlood(victimPed, bone, 0.0, 0.0, 0.0, 'wound_sheet')
    ApplyPedDamagePack(victimPed, Config.Effects.BloodDamagePack, 0.0, 1.0)
    local p = GetEntityCoords(victimPed)
    local ok, gz = GetGroundZFor_3dCoord(p.x, p.y, p.z + 0.5, false)
    if ok then
        AddDecal(1010, p.x + 0.15, p.y + 0.1, gz, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.7, 0.7, 0.35, 0.0, 0.0, 1.0, 45.0, false, false, false)
    end
end

-- Short, subtle slow motion (local client only).
function ZFx.slowmo()
    if not Config.Effects.SlowMotion then return end
    CreateThread(function()
        SetTimeScale(Config.Effects.SlowMotionScale)
        Wait(Config.Effects.SlowMotionMs)
        SetTimeScale(1.0)
    end)
end

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() then SetTimeScale(1.0) end
end)
