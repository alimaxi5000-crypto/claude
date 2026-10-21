-- Studio script camera. The NUI is the source of the camera values (it renders the three.js
-- overlay with exactly these values) and sends them here at most Config.Camera.UpdatesPerSecond
-- times per second, so game picture and overlay stay aligned.
-- VERIFY: GTA script camera FOV is assumed to be the VERTICAL field of view (three.js
-- PerspectiveCamera uses vertical FOV too). The alignment tool in the studio measures it.
StudioCam = { cam = nil }

local U = JJS.U

function StudioCam.create(frame)
    if StudioCam.cam then return end
    local x, y, z = U.frameToWorld(frame, 0.0, -3.0, 0.4)
    StudioCam.cam = CreateCamWithParams('DEFAULT_SCRIPTED_CAMERA', x, y, z, 0.0, 0.0, frame.heading, Config.Camera.Fov, true, 2)
    SetCamNearClip(StudioCam.cam, 0.05)
    RenderScriptCams(true, false, 0, true, true)
end

-- p: camera position in the scene frame, yaw/pitch in degrees (yaw 0 = looking along the
-- frame's +Y, counter-clockwise; pitch + = up), fov in degrees.
function StudioCam.apply(frame, p, yaw, pitch, fov)
    local cam = StudioCam.cam
    if not cam then return end
    local x, y, z = U.frameToWorld(frame, p[1], p[2], p[3])
    SetCamCoord(cam, x, y, z)
    SetCamRot(cam, pitch, 0.0, (frame.heading + yaw) % 360.0, 2)
    SetCamFov(cam, U.clamp(fov, 5.0, 120.0))
end

function StudioCam.destroy()
    if not StudioCam.cam then return end
    RenderScriptCams(false, false, 0, true, true)
    DestroyCam(StudioCam.cam, false)
    StudioCam.cam = nil
end
