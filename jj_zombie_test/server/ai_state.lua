-- Server-side zombie AI decisions (high level only). The owner client executes movement and
-- animation; this module decides state, target, speed cycle, slots and when a grab may start.
-- Pure logic on plain tables (no natives) so it can be unit-tested with mocks.
JJZ = JJZ or {}
local AI = {}
JJZ.AiLogic = AI

local S = JJZ.AiState

-- Perception interface. Today: plain radius. Later: sight cone, noise (jj_core), darkness.
-- ctx.perception may replace this function.
function AI.canSense(z, player, dist, cfg)
    return dist <= cfg.TargetRadius
end

local function setAi(z, state, now)
    if z.ai ~= state then
        z.ai = state
        z.aiSince = now
    end
end
AI.setAi = setAi

local function dist2d(a, b)
    local dx, dy = a.x - b.x, a.y - b.y
    return math.sqrt(dx * dx + dy * dy)
end
AI.dist2d = dist2d

-- Valid chase target: connected, same routing bucket, alive, not in a vehicle grab situation.
local function targetOk(z, p)
    return p ~= nil and p.valid and not p.down and p.bucket == z.bucket
end

-- Pick the nearest sensed player. Returns src, dist.
function AI.pickTarget(z, players, cfg, perception)
    local best, bestD = nil, math.huge
    for src, p in pairs(players) do
        if targetOk(z, p) then
            local d = #(z.pos - p.pos)
            if d < bestD and (perception or AI.canSense)(z, p, d, cfg) then best, bestD = src, d end
        end
    end
    return best, bestD
end

-- For every target, the nearest active zombie is the "primary" (the only one allowed to grab).
function AI.primaries(zombies, players)
    local prim = {}
    for _, z in pairs(zombies) do
        if z.target ~= 0 and (z.ai == S.Chase or z.ai == S.Ready or z.ai == S.Hold) then
            local p = players[z.target]
            if p then
                local d = #(z.pos - p.pos)
                local cur = prim[z.target]
                if not cur or d < cur.d or (d == cur.d and z.id < cur.z.id) then prim[z.target] = { z = z, d = d } end
            end
        end
    end
    return prim
end

-- Spread approach angles of zombies sharing a target (golden angle sequence).
function AI.assignSlots(zombies)
    local byTarget = {}
    for _, z in pairs(zombies) do
        if z.target ~= 0 then
            local l = byTarget[z.target] or {}
            l[#l + 1] = z
            byTarget[z.target] = l
        end
    end
    for _, list in pairs(byTarget) do
        table.sort(list, function(a, b) return a.id < b.id end)
        for i, z in ipairs(list) do z.slot = math.floor(((i - 1) * 137.508) % 360) end
    end
end

-- One decision step. Returns an action table or nil: { kind = 'grab', target = src }.
-- ctx: { now, cfg = Config.AI, types = Config.Types, players, primaries, frozen, perception }
function AI.step(z, ctx)
    local now, cfg = ctx.now, ctx.cfg
    if z.ai == S.Dead or z.ai == S.Grab then return nil end
    if z.ai == S.Stunned then
        if now < (z.stunUntil or 0) then return nil end
        setAi(z, z.target ~= 0 and S.Chase or S.Idle, now)
        z.lastProgressAt, z.bestDist = now, math.huge
    end
    if ctx.frozen then return nil end

    -- Target maintenance.
    local p = z.target ~= 0 and ctx.players[z.target] or nil
    if z.target ~= 0 then
        local lost = not targetOk(z, p) or #(z.pos - p.pos) > cfg.LoseTargetRadius
        if lost then
            z.target = 0
            p = nil
            setAi(z, S.Idle, now)
        end
    end
    if z.target == 0 then
        local src = AI.pickTarget(z, ctx.players, cfg, ctx.perception)
        if src then
            z.target = src
            p = ctx.players[src]
            setAi(z, S.Alerted, now)
            z.alertUntil = now + math.floor(cfg.AlertSeconds * 1000)
            z.lastProgressAt, z.bestDist = now, math.huge
            local t = ctx.types[z.type] or {}
            if t.ChaseMode == 'run' then
                z.speed = 'run'
                z.sprintUntil = z.alertUntil + math.floor((t.SprintSeconds or 5) * 1000)
            else
                z.speed = 'walk'
            end
        else
            setAi(z, S.Idle, now)
            return nil
        end
    end

    local d = #(z.pos - p.pos)
    local t = ctx.types[z.type] or {}

    -- Sprint / tired cycle (laeufer).
    if t.ChaseMode == 'run' and z.ai ~= S.Alerted then
        if z.speed == 'run' and now >= (z.sprintUntil or 0) then
            z.speed = 'walk'
            z.tiredUntil = now + math.floor((t.TiredSeconds or 3) * 1000)
        elseif z.speed == 'walk' and now >= (z.tiredUntil or 0) then
            z.speed = 'run'
            z.sprintUntil = now + math.floor((t.SprintSeconds or 5) * 1000)
        end
    end

    if z.ai == S.Alerted and now < (z.alertUntil or 0) then return nil end

    -- Stuck detection: no approach progress while far from the target.
    if d < (z.bestDist or math.huge) - 0.3 then
        z.bestDist = d
        z.lastProgressAt = now
    elseif d > cfg.AttackReadyDistance + 0.5 and z.ai ~= S.Hold and now - (z.lastProgressAt or now) > cfg.StuckSeconds * 1000 then
        z.unstuck = (z.unstuck or 0) + 1
        z.lastProgressAt = now
        z.bestDist = d
    end
    if z.ai == S.Hold then z.lastProgressAt = now end

    -- Desired state.
    local prim = ctx.primaries[z.target]
    local isPrimary = prim and prim.z == z
    if p.finActive and z.finId == 0 then
        setAi(z, S.Hold, now)
    elseif d <= cfg.AttackReadyDistance and isPrimary then
        setAi(z, S.Ready, now)
    elseif d <= cfg.AttackReadyDistance + 1.0 and not isPrimary and prim then
        setAi(z, S.Hold, now)
    else
        setAi(z, S.Chase, now)
    end

    -- Grab request (finisher). All conditions are re-checked by the finisher module.
    if z.ai == S.Ready and d <= cfg.GrabDistance and math.abs(z.pos.z - p.pos.z) <= cfg.GrabMaxHeightDiff then
        return { kind = 'grab', target = z.target, dist = d }
    end
    return nil
end
