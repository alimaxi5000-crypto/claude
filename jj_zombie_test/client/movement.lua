-- Zombie look & locomotion for every client that can see a zombie (owner or not):
-- custom idle/walk/run clips via SET_PED_ALTERNATE_MOVEMENT_ANIM and cosmetic damage decals.
-- Applied once per entity handle; the alternate anims are local ped settings, so every client
-- applies them itself (they are not part of the synced ped state).
ZMove = {}

local STANCE_IDLE, STANCE_WALK, STANCE_RUN = 0, 1, 2

-- Registry names per type: { idle, walk, run }
ZMove.SETS = {
    schlurfer = { idle = 'zmove_shamble_idle', walk = 'zmove_shamble_walk', run = 'zmove_shamble_walk' },
    laeufer = { idle = 'zmove_runner_idle', walk = 'zmove_runner_walk', run = 'zmove_runner_run' },
}

local DECALS = { 'BigHitByVehicle', 'SCR_Torture', 'Explosion_Med', 'HOSPITAL_0', 'HOSPITAL_5' }
local warned = false

function ZMove.apply(ped, ztype, seed)
    local set = ZMove.SETS[ztype] or ZMove.SETS.schlurfer
    local ok = true
    for stance, key in pairs({ [STANCE_IDLE] = set.idle, [STANCE_WALK] = set.walk, [STANCE_RUN] = set.run }) do
        local dict, clip = Clips.single(key)
        if dict then
            local loaded, err = Anim.load(dict)
            if loaded then
                SetPedAlternateMovementAnim(ped, stance, dict, clip, 4.0, true)
            else
                ok = false
                if not warned then warned = true; print('[jj_zombie] movement clip: ' .. tostring(err)) end
            end
        else
            ok = false
        end
    end
    -- Cosmetic blood/dirt (deterministic per zombie so every client sees the same).
    if Config.Effects.Blood then
        local r = JJZ.U.rng(seed or 1)
        local n = 1 + math.floor(r() * 2)
        for _ = 1, n do
            ApplyPedDamagePack(ped, DECALS[1 + math.floor(r() * #DECALS)], 0.0, 0.6 + r() * 0.4)
        end
    end
    return ok
end

function ZMove.clear(ped)
    if not DoesEntityExist(ped) then return end
    for stance = 0, 2 do ClearPedAlternateMovementAnim(ped, stance, 4.0) end
end
