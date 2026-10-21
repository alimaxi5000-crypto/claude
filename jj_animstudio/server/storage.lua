-- Project and pose storage inside the resource folder (SaveResourceFile / LoadResourceFile).
--   data/projects/<name>.anim.json     current version of a project (written as sent by the studio)
--   data/projects/_index.json          list: name -> { title, type, updated, size, preview, slot }
--   data/backups/<name>.<n>.anim.json  the last ConfigServer.Backups versions (ring buffer)
--   data/poses/<name>.json + data/poses/_index.json   pose library
-- Every path is built here from names checked with JJS.U.validName; nothing comes from the client.
Storage = {}

local RES = GetCurrentResourceName()
local U = JJS.U
local index, poseIndex = nil, nil

local function load(path) return LoadResourceFile(RES, path) end
-- SAVE_RESOURCE_FILE returns a truthy value on success (not necessarily the boolean true).
local function save(path, data) return not not SaveResourceFile(RES, path, data, #data) end

local function projectPath(name) return ('data/projects/%s.anim.json'):format(name) end
local function backupPath(name, n) return ('data/backups/%s.%d.anim.json'):format(name, n) end
local function posePath(name) return ('data/poses/%s.json'):format(name) end

local function readIndex(path)
    local raw = load(path)
    if not raw or raw == '' then return {} end
    local ok, t = pcall(json.decode, raw)
    if not ok or type(t) ~= 'table' then
        print(('^3[jj_animstudio] %s is damaged, starting with an empty list (the file is kept as .broken)^0'):format(path))
        save(path .. '.broken', raw)
        return {}
    end
    return t
end

local function projects()
    if not index then
        index = readIndex('data/projects/_index.json')
        index.projects = type(index.projects) == 'table' and index.projects or {}
    end
    return index.projects
end
local function writeIndex() return save('data/projects/_index.json', json.encode(index)) end

-- Checks a project text without re-encoding it. Returns doc (decoded) or nil, errorKey.
function Storage.inspect(name, text)
    if type(text) ~= 'string' then return nil, 'project_invalid' end
    if #text > ConfigServer.MaxProjectBytes then return nil, 'project_too_large' end
    -- The studio writes "format" and "name" first; rename/duplicate rely on that prefix.
    local prefix = ('{"format":"%s","name":"%s"'):format(JJS.FORMAT, name)
    if text:sub(1, #prefix) ~= prefix then return nil, 'project_invalid' end
    local ok, doc = pcall(json.decode, text)
    if not ok or type(doc) ~= 'table' or doc.format ~= JJS.FORMAT or doc.name ~= name then return nil, 'project_invalid' end
    if doc.type ~= 'single' and doc.type ~= 'pair' then return nil, 'project_invalid' end
    if type(doc.duration) ~= 'number' or doc.duration <= 0 or doc.duration > 30 then return nil, 'project_invalid' end
    if type(doc.actors) ~= 'table' or type(doc.tracks) ~= 'table' then return nil, 'project_invalid' end
    local n = U.count(doc.actors)
    if n < 1 or n > 2 then return nil, 'project_invalid' end
    return doc
end

function Storage.list()
    local out = {}
    for name, m in pairs(projects()) do
        out[#out + 1] = { name = name, title = m.title, type = m.type, updated = m.updated, size = m.size, preview = m.preview or 0 }
    end
    table.sort(out, function(a, b) return (a.updated or 0) > (b.updated or 0) end)
    return out
end

function Storage.exists(name) return projects()[name] ~= nil end
function Storage.count() return U.count(projects()) end

function Storage.read(name)
    if not U.validName(name) or not Storage.exists(name) then return nil end
    local raw = load(projectPath(name))
    if not raw or raw == '' then return nil end
    return raw
end

-- Writes a project (text already checked by Storage.inspect). The previous version goes into the
-- backup ring. Returns true or false, errorKey.
function Storage.write(name, text, doc)
    local list = projects()
    local meta = list[name]
    if not meta and Storage.count() >= ConfigServer.MaxProjects then return false, 'project_limit' end
    meta = meta or { preview = 0, slot = 0 }
    local old = load(projectPath(name))
    if old and old ~= '' and old ~= text and ConfigServer.Backups > 0 then
        meta.slot = (meta.slot or 0) % ConfigServer.Backups + 1
        save(backupPath(name, meta.slot), old)
    end
    if not save(projectPath(name), text) then return false, 'save_failed' end
    meta.title = type(doc.title) == 'string' and doc.title:sub(1, 80) or name
    meta.type = doc.type
    meta.updated = os.time()
    meta.size = #text
    list[name] = meta
    if not writeIndex() then return false, 'save_failed' end
    return true
end

-- Next preview version number of a project (persisted, so dictionary names never repeat).
function Storage.nextPreview(name)
    local meta = projects()[name]
    if not meta then return nil end
    meta.preview = (meta.preview or 0) + 1
    writeIndex()
    return meta.preview
end

local function withName(text, from, to)
    local prefix = ('{"format":"%s","name":"%s"'):format(JJS.FORMAT, from)
    if text:sub(1, #prefix) ~= prefix then return nil end
    return ('{"format":"%s","name":"%s"'):format(JJS.FORMAT, to) .. text:sub(#prefix + 1)
end

function Storage.copy(from, to, removeOld)
    if not U.validName(from) or not U.validName(to) then return false, 'invalid_name' end
    if not Storage.exists(from) then return false, 'project_missing' end
    if Storage.exists(to) then return false, 'project_exists' end
    local text = Storage.read(from)
    if not text then return false, 'project_missing' end
    local renamed = withName(text, from, to)
    if not renamed then return false, 'rename_unsupported' end
    local doc, err = Storage.inspect(to, renamed)
    if not doc then return false, err end
    local ok, werr = Storage.write(to, renamed, doc)
    if not ok then return false, werr end
    if removeOld then Storage.delete(from) end
    return true
end

-- Deleting keeps the last version as a backup file and removes the project from the list.
function Storage.delete(name)
    if not U.validName(name) or not Storage.exists(name) then return false, 'project_missing' end
    local text = load(projectPath(name))
    if text and text ~= '' then save(('data/backups/%s.deleted.anim.json'):format(name), text) end
    save(projectPath(name), '')
    projects()[name] = nil
    if not writeIndex() then return false, 'save_failed' end
    return true
end

-- ------------------------------------------------------------------ poses
local function poses()
    if not poseIndex then
        poseIndex = readIndex('data/poses/_index.json')
        poseIndex.poses = type(poseIndex.poses) == 'table' and poseIndex.poses or {}
    end
    return poseIndex.poses
end

-- All poses: { name = text }
function Storage.allPoses()
    local out = {}
    for name in pairs(poses()) do
        local raw = load(posePath(name))
        if raw and raw ~= '' then out[name] = raw end
    end
    return out
end

function Storage.savePose(name, text)
    if not U.validName(name, 32) then return false, 'invalid_name' end
    if type(text) ~= 'string' or #text > ConfigServer.MaxPoseBytes then return false, 'pose_invalid' end
    local ok, p = pcall(json.decode, text)
    if not ok or type(p) ~= 'table' or type(p.bones) ~= 'table' then return false, 'pose_invalid' end
    local list = poses()
    if not list[name] and U.count(list) >= ConfigServer.MaxPoses then return false, 'pose_limit' end
    if not save(posePath(name), text) then return false, 'save_failed' end
    list[name] = os.time()
    save('data/poses/_index.json', json.encode(poseIndex))
    return true
end

function Storage.deletePose(name)
    if not U.validName(name, 32) or not poses()[name] then return false, 'pose_invalid' end
    save(posePath(name), '')
    poses()[name] = nil
    save('data/poses/_index.json', json.encode(poseIndex))
    return true
end

-- Skeleton files exported by animkit watch (data/skeletons/<key>.json; derived from game files,
-- sent only to studio users for editing).
function Storage.skeletons()
    local out = {}
    for _, key in ipairs({ 'male', 'female', 'zombie' }) do
        local raw = load(('data/skeletons/%s.json'):format(key))
        if raw and raw ~= '' then out[key] = raw end
    end
    return out
end

-- Test helper: forget cached indexes (files are read again).
function Storage._reset() index, poseIndex = nil, nil end
