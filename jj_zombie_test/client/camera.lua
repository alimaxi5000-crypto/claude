-- Finisher camera: close scripted camera with danger-proportional shake, impact punches and a
-- smooth return. Pure presentation (local only).
ZCam = { cam = nil, danger = 0.0 }

local function sceneToWorld(origin, heading, x, y, z)
    local r = math.rad(heading)
    local c, s = math.cos(r), math.sin(r)
    return vector3(origin.x + x * c - y * s, origin.y + x * s + y * c, origin.z + z)
end
ZCam.sceneToWorld = sceneToWorld

-- origin/heading: scene frame (victim at origin facing +Y, zombie in front).
function ZCam.start(origin, heading, side)
    if not Config.Camera.Enabled then return end
    ZCam.stop(0)
    local sx = side or 1.0
    local pos = sceneToWorld(origin, heading, 1.25 * sx, -0.55, 0.62)
    local look = sceneToWorld(origin, heading, 0.0, 0.32, 0.48)
    local cam = CreateCamWithParams('DEFAULT_SCRIPTED_CAMERA', pos.x, pos.y, pos.z, 0.0, 0.0, 0.0, Config.Camera.Fov, false, 2)
    PointCamAtCoord(cam, look.x, look.y, look.z)
    SetCamActive(cam, true)
    RenderScriptCams(true, true, 450, true, false)
    ShakeCam(cam, 'HAND_SHAKE', 0.15)
    ZCam.cam = cam
    ZCam.origin, ZCam.heading, ZCam.side = origin, heading, sx
    ZCam.danger = 0.0
end

-- Slowly push the camera in while the danger rises (called ~10x per second).
function ZCam.setDanger(d)
    if not ZCam.cam then return end
    d = math.max(0.0, math.min(1.0, d))
    ZCam.danger = d
    SetCamShakeAmplitude(ZCam.cam, 0.12 + d * Config.Camera.ShakeMax)
    local dist = 1.25 - 0.3 * d
    local pos = sceneToWorld(ZCam.origin, ZCam.heading, dist * ZCam.side, -0.55 + 0.15 * d, 0.62 - 0.05 * d)
    SetCamCoord(ZCam.cam, pos.x, pos.y, pos.z)
    SetCamFov(ZCam.cam, Config.Camera.Fov - 6.0 * d)
end

-- Short impact jolt.
function ZCam.punch(kind)
    if not ZCam.cam then
        ShakeGameplayCam(kind == 'big' and 'SMALL_EXPLOSION_SHAKE' or 'JOLT_SHAKE', kind == 'big' and 0.25 or 0.4)
        return
    end
    ShakeCam(ZCam.cam, kind == 'big' and 'SMALL_EXPLOSION_SHAKE' or 'JOLT_SHAKE', kind == 'big' and 0.3 or 0.5)
end

function ZCam.stop(easeMs)
    if not ZCam.cam then return end
    local cam = ZCam.cam
    ZCam.cam = nil
    StopCamShaking(cam, true)
    RenderScriptCams(false, (easeMs or 0) > 0, easeMs or 0, true, false)
    SetCamActive(cam, false)
    DestroyCam(cam, false)
end

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() then ZCam.stop(0) end
end)
