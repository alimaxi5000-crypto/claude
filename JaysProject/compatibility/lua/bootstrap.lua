-- Jays Project — Lua compatibility bootstrap.
--
-- Original implementation of the FiveM-style scripting surface (threads,
-- events, exports, commands) on top of the natives in the `J` table that
-- ScriptRuntime passes in. Behaviour follows the semantics documented in
-- research/lua-runtime/LUA_RUNTIME.md; no FiveM code is used.

local J = ...

local co_create, co_resume, co_status, co_running, co_yield =
	coroutine.create, coroutine.resume, coroutine.status, coroutine.running, coroutine.yield
local traceback = debug.traceback
local pack, unpack = J.pack, J.unpack
local tpack, tunpack, tsort = table.pack, table.unpack, table.sort
local isServer = J.side == 'server'
local resourceName = J.resource_name

---------------------------------------------------------------------------
-- printing
---------------------------------------------------------------------------

local function joinArgs(...)
	local n = select('#', ...)
	local parts = {}
	for i = 1, n do
		parts[i] = tostring((select(i, ...)))
	end
	return table.concat(parts, '\t')
end

print = function(...)
	J.log('info', joinArgs(...))
end

Citizen = {}
Citizen.Trace = function(...)
	J.log('info', joinArgs(...))
end

---------------------------------------------------------------------------
-- scheduler
---------------------------------------------------------------------------

local threads = {}                                -- { co, wake, name }
local owned = setmetatable({}, { __mode = 'k' })  -- coroutines the scheduler may resume

local function step(entry)
	local ok, res = co_resume(entry.co)
	if not ok then
		J.log('error', ('error in %s: %s'):format(entry.name, traceback(entry.co, tostring(res))))
		return false
	end
	if co_status(entry.co) == 'dead' then
		return false
	end
	entry.wake = J.time() + (tonumber(res) or 0)
	return true
end

local function newThread(fn, name)
	if type(fn) ~= 'function' then
		local mt = getmetatable(fn)
		if not (mt and mt.__call) then
			error('expected a function', 3)
		end
		local callable = fn
		fn = function(...) return callable(...) end
	end
	local co = co_create(fn)
	owned[co] = true
	return { co = co, wake = 0, name = name or 'thread' }
end

-- Runs fn immediately until its first Wait, then continues on later ticks.
function Citizen.CreateThreadNow(fn, name)
	local entry = newThread(fn, name)
	if step(entry) then
		threads[#threads + 1] = entry
	end
end

-- Schedules fn to start on the next tick.
function Citizen.CreateThread(fn)
	threads[#threads + 1] = newThread(fn, 'thread')
end

function Citizen.Wait(ms)
	local co, isMain = co_running()
	if isMain or not owned[co] then
		error('Wait() can only be used inside CreateThread, SetTimeout or an event/command handler', 2)
	end
	co_yield(tonumber(ms) or 0)
end

local timeouts = {}
local timeoutId = 0

function Citizen.SetTimeout(ms, fn)
	timeoutId = timeoutId + 1
	local id = timeoutId
	timeouts[id] = true
	Citizen.CreateThread(function()
		Citizen.Wait(ms)
		if timeouts[id] then
			timeouts[id] = nil
			fn()
		end
	end)
	return id
end

function Citizen.ClearTimeout(id)
	timeouts[id] = nil
end

Wait = Citizen.Wait
CreateThread = Citizen.CreateThread
SetTimeout = Citizen.SetTimeout
ClearTimeout = Citizen.ClearTimeout

function __jays_tick()
	local now = J.time()
	local current = threads
	local n = #current
	local alive = {}
	for i = 1, n do
		local entry = current[i]
		if entry.wake > now or step(entry) then
			alive[#alive + 1] = entry
		end
	end
	-- threads created while ticking were appended to `current`
	for i = n + 1, #current do
		alive[#alive + 1] = current[i]
	end
	threads = alive
end

function __jays_thread_count()
	return #threads
end

---------------------------------------------------------------------------
-- events
---------------------------------------------------------------------------

local handlers = {}  -- name -> { safeForNet = bool, list = { [key] = fn } }
local handlerKey = 0

local function entryFor(name)
	local e = handlers[name]
	if not e then
		e = { list = {} }
		handlers[name] = e
	end
	return e
end

function AddEventHandler(name, fn)
	if type(name) ~= 'string' then
		error('AddEventHandler: event name must be a string', 2)
	end
	handlerKey = handlerKey + 1
	entryFor(name).list[handlerKey] = fn
	return { key = handlerKey, name = name }
end

function RemoveEventHandler(data)
	if type(data) ~= 'table' or not data.key or not data.name then
		error('Invalid event data passed to RemoveEventHandler()', 2)
	end
	local e = handlers[data.name]
	if e then
		e.list[data.key] = nil
	end
end

function RegisterNetEvent(name, fn)
	entryFor(name).safeForNet = true
	if fn then
		return AddEventHandler(name, fn)
	end
end

function TriggerEvent(name, ...)
	return J.trigger(name, pack(...))
end

CancelEvent = J.cancel_event
WasEventCanceled = J.was_canceled

if isServer then
	RegisterServerEvent = RegisterNetEvent

	function TriggerClientEvent(name, target, ...)
		J.trigger_client(name, tonumber(target) or -1, pack(...))
	end
else
	function TriggerServerEvent(name, ...)
		J.trigger_server(name, pack(...))
	end
end

function __jays_dispatch(name, payload, src)
	local e = handlers[name]
	if not e then
		return
	end

	local isNet = src:sub(1, 4) == 'net:'
	if isNet and not e.safeForNet then
		J.log('warn', ('event %s from %s was not safe for net (use RegisterNetEvent)'):format(name, src))
		return
	end

	local args = tpack(unpack(payload))

	local keys = {}
	for k in pairs(e.list) do
		keys[#keys + 1] = k
	end
	tsort(keys)

	local previous = source
	if isNet then
		source = tonumber(src:sub(5))
	elseif src:sub(1, 13) == 'internal-net:' then
		source = tonumber(src:sub(14))
	else
		source = src
	end

	for _, k in ipairs(keys) do
		local fn = e.list[k]
		if fn then
			Citizen.CreateThreadNow(function()
				fn(tunpack(args, 1, args.n))
			end, 'event ' .. name)
		end
	end

	source = previous
end

---------------------------------------------------------------------------
-- exports
---------------------------------------------------------------------------

local localExports = {}
local declaredExports = {}
for _, n in ipairs(J.declared_exports) do
	declaredExports[n] = true
end

local function isCallable(v)
	if type(v) == 'function' then
		return true
	end
	local mt = getmetatable(v)
	return mt ~= nil and mt.__call ~= nil
end

exports = setmetatable({}, {
	__index = function(_, res)
		return setmetatable({}, {
			__index = function(_, exportName)
				if type(exportName) ~= 'string' then
					error('Invalid export name: ' .. tostring(exportName), 2)
				end
				return function(_self, ...)
					return unpack(J.call_export(res, exportName, pack(...)))
				end
			end,
			__newindex = function()
				error('cannot set values on an export resource', 2)
			end,
		})
	end,
	__newindex = function()
		error('cannot set values on exports', 2)
	end,
	__call = function(_, exportName, fn)
		if type(exportName) ~= 'string' or not isCallable(fn) then
			error('exports(name, function) expects a string and a function', 2)
		end
		localExports[exportName] = fn
	end,
})

function __jays_export(exportName, payload)
	local fn = localExports[exportName]
	if fn == nil and declaredExports[exportName] then
		fn = rawget(_G, exportName)
	end
	if not isCallable(fn) then
		error(('No such export %s in resource %s'):format(exportName, resourceName), 0)
	end
	return pack(fn(unpack(payload)))
end

-- invoked for function references other resources hold on to
function __jays_invoke(fn, payload)
	if not isCallable(fn) then
		error('function reference is no longer valid', 0)
	end
	return pack(fn(unpack(payload)))
end

---------------------------------------------------------------------------
-- commands
---------------------------------------------------------------------------

local commands = {}

function RegisterCommand(name, handler, restricted)
	if type(name) ~= 'string' or not isCallable(handler) then
		error('RegisterCommand(name, handler, restricted) expects a string and a function', 2)
	end
	commands[name:lower()] = handler
	J.register_command(name:lower(), restricted and true or false)
end

function __jays_command(name, src, args, raw)
	local handler = commands[name]
	if handler then
		Citizen.CreateThreadNow(function()
			handler(src, args, raw)
		end, 'command ' .. name)
	end
end
