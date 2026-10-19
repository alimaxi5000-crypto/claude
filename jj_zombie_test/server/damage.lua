-- Damage, bite marker and the blocked-space fallback attack. The server decides amounts; the
-- victim's client applies game damage (so jj_health sees a normal damage event).
JJZ = JJZ or {}
local D = {}
JJZ.Damage = D

local Own = JJZ.Ownership

local function typeMult(ztype)
    local t = Config.Types[ztype] or {}
    return t.BiteDamageMult or 1.0
end

-- Bite at the end of a lost struggle: damage, stress, "bitten" marker (hook for infection).
function D.bite(src, fin)
    local dmg = math.floor(Config.Finisher.BiteDamage * typeMult(fin.type) + 0.5)
    TriggerClientEvent(JJZ.Events.ApplyBite, src, fin.id, dmg)
    Integration.addStress(src, Config.Finisher.StressOnBite, 'zombie_bite')
    Integration.onBitten(src, { zombieType = fin.type, finId = fin.id, damage = dmg })
end

-- No room for the paired scene: a short swipe attack instead of the finisher.
function D.swipe(src, z)
    local dmg = math.floor(Config.Finisher.BiteDamage * 0.25 * typeMult(z.type) + 0.5)
    Own.sendToOwner(z, JJZ.Events.ZombieCmd, z.id, 'swipe')
    TriggerClientEvent(JJZ.Events.Swipe, src, z.id, dmg)
    Integration.addStress(src, math.floor(Config.Finisher.StressOnGrab * 0.5), 'zombie_swipe')
end
