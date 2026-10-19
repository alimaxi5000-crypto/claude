#include <jays/log.h>
#include <jays/lua_api.h>
#include <jays/resource_manager.h>
#include <jays/serialization.h>

#include "bootstrap_lua.h" // generated: kBootstrapLua / kBootstrapLuaSize

#include <algorithm>
#include <cstring>
#include <map>
#include <optional>

namespace jays
{
namespace
{
constexpr int kHookInstructions = 20000;

const char* kRefsKey = "jays.refs";       // id -> function
const char* kRefIdsKey = "jays.refids";   // function -> id (weak keys)
const char* kProxyMtKey = "jays.proxymt"; // metatable of foreign function references

ScriptRuntime* RT(lua_State* L)
{
	return *static_cast<ScriptRuntime**>(lua_getextraspace(L));
}

std::string ComponentName(ScriptRuntime* rt)
{
	return "script:" + rt->GetResource().name;
}
}

// Glue between msgpack function references and this runtime's Lua state.
class RuntimeCodec final : public mp::FuncRefCodec
{
public:
	explicit RuntimeCodec(ScriptRuntime& rt) : m_rt(rt) {}

	const std::string& OwnerName() const override { return m_rt.GetResource().name; }

	int64_t ExportFunction(lua_State* L, int idx) override
	{
		idx = lua_absindex(L, idx);
		luaL_checkstack(L, 4, "funcref");

		lua_getfield(L, LUA_REGISTRYINDEX, kRefIdsKey);
		lua_pushvalue(L, idx);
		lua_rawget(L, -2);
		if (lua_isinteger(L, -1))
		{
			auto id = lua_tointeger(L, -1);
			lua_pop(L, 2);
			return id;
		}
		lua_pop(L, 1);

		int64_t id = m_nextId++;
		lua_pushvalue(L, idx);
		lua_pushinteger(L, id);
		lua_rawset(L, -3);
		lua_pop(L, 1);

		lua_getfield(L, LUA_REGISTRYINDEX, kRefsKey);
		lua_pushvalue(L, idx);
		lua_rawseti(L, -2, id);
		lua_pop(L, 1);
		return id;
	}

	bool GetProxyIdentity(lua_State* L, int idx, std::string& resource, int64_t& id) override
	{
		if (!lua_getmetatable(L, idx))
		{
			return false;
		}
		lua_getfield(L, LUA_REGISTRYINDEX, kProxyMtKey);
		bool isProxy = lua_rawequal(L, -1, -2);
		lua_pop(L, 2);
		if (!isProxy)
		{
			return false;
		}

		lua_getfield(L, idx, "__res");
		lua_getfield(L, idx, "__id");
		resource = lua_tostring(L, -2) ? lua_tostring(L, -2) : "";
		id = lua_tointeger(L, -1);
		lua_pop(L, 2);
		return true;
	}

	void PushFuncRef(lua_State* L, const std::string& resource, int64_t id) override
	{
		if (resource == OwnerName())
		{
			lua_getfield(L, LUA_REGISTRYINDEX, kRefsKey);
			lua_rawgeti(L, -1, id);
			lua_remove(L, -2);
			return;
		}

		lua_createtable(L, 0, 2);
		lua_pushlstring(L, resource.data(), resource.size());
		lua_setfield(L, -2, "__res");
		lua_pushinteger(L, id);
		lua_setfield(L, -2, "__id");
		lua_getfield(L, LUA_REGISTRYINDEX, kProxyMtKey);
		lua_setmetatable(L, -2);
		m_rt.Manager().AddRefCount(resource, id, +1);
	}

	void AddRefCount(int64_t id, int delta)
	{
		auto& count = m_counts[id];
		count += delta;
		if (count <= 0 && delta < 0)
		{
			m_counts.erase(id);
			m_pendingRelease.push_back(id);
		}
	}

	// Drops released references. Only called while the runtime is idle.
	void FlushReleases(lua_State* L)
	{
		if (m_pendingRelease.empty())
		{
			return;
		}

		lua_getfield(L, LUA_REGISTRYINDEX, kRefsKey);
		lua_getfield(L, LUA_REGISTRYINDEX, kRefIdsKey);
		for (auto id : m_pendingRelease)
		{
			lua_rawgeti(L, -2, id);
			if (!lua_isnil(L, -1))
			{
				lua_pushnil(L);
				lua_rawset(L, -3); // refids[fn] = nil
			}
			else
			{
				lua_pop(L, 1);
			}
			lua_pushnil(L);
			lua_rawseti(L, -3, id); // refs[id] = nil
		}
		lua_pop(L, 2);
		m_pendingRelease.clear();
	}

private:
	ScriptRuntime& m_rt;
	int64_t m_nextId = 1;
	std::map<int64_t, int> m_counts;
	std::vector<int64_t> m_pendingRelease;
};

ScriptRuntime::Scope::Scope(ScriptRuntime* r, lua_State* L) : rt(r), prev(r->m_running)
{
	rt->m_running = L;
}

ScriptRuntime::Scope::~Scope()
{
	rt->m_running = prev;
}

namespace
{
mp::FuncRefCodec* Codec(lua_State* L);

int Traceback(lua_State* L)
{
	const char* msg = lua_tostring(L, 1);
	if (!msg)
	{
		msg = luaL_tolstring(L, 1, nullptr);
	}
	luaL_traceback(L, L, msg, 1);
	return 1;
}

void DeadlineHook(lua_State* L, lua_Debug*)
{
	auto* rt = RT(L);
	if (rt && rt->DeadlineExceeded())
	{
		luaL_error(L, "script exceeded the %d ms execution budget (infinite loop?)",
			static_cast<int>(rt->Manager().ScriptBudgetMs()));
	}
}

std::string CheckString(lua_State* L, int idx)
{
	size_t len;
	const char* s = luaL_checklstring(L, idx, &len);
	return std::string(s, len);
}

// ---- J.* natives ---------------------------------------------------------

int J_Log(lua_State* L)
{
	auto* rt = RT(L);
	auto level = CheckString(L, 1);
	auto msg = CheckString(L, 2);
	log::Level lv = log::Level::Info;
	log::ParseLevel(level, lv);
	log::Write(lv, ComponentName(rt), msg);
	return 0;
}

int J_Time(lua_State* L)
{
	lua_pushinteger(L, static_cast<lua_Integer>(RT(L)->Manager().TimeMs()));
	return 1;
}

int J_Pack(lua_State* L)
{
	auto s = mp::PackLua(L, 1, lua_gettop(L), Codec(L));
	lua_pushlstring(L, s.data(), s.size());
	return 1;
}

int J_Unpack(lua_State* L)
{
	if (lua_isnoneornil(L, 1))
	{
		return 0;
	}
	size_t len;
	const char* s = luaL_checklstring(L, 1, &len);
	lua_settop(L, 1);
	return mp::UnpackLua(L, std::string_view(s, len), Codec(L));
}

struct InvokerScope
{
	InvokerScope(ResourceManager& m, const std::string& r) : mgr(m) { mgr.PushInvoker(r); }
	~InvokerScope() { mgr.PopInvoker(); }
	ResourceManager& mgr;
};

int J_Trigger(lua_State* L)
{
	auto* rt = RT(L);
	auto name = CheckString(L, 1);
	auto payload = CheckString(L, 2);
	ScriptRuntime::Scope scope(rt, L);
	InvokerScope inv(rt->Manager(), rt->GetResource().name);
	bool notCanceled = rt->Manager().TriggerEvent(name, payload, "");
	lua_pushboolean(L, notCanceled);
	return 1;
}

int J_TriggerServer(lua_State* L)
{
	auto* rt = RT(L);
	auto name = CheckString(L, 1);
	auto payload = CheckString(L, 2);
	if (rt->Manager().Hooks().sendToServer)
	{
		rt->Manager().Hooks().sendToServer(name, payload);
	}
	else
	{
		log::Warn(ComponentName(rt), "TriggerServerEvent(" + name + "): not connected to a server, event dropped");
	}
	return 0;
}

int J_TriggerClient(lua_State* L)
{
	auto* rt = RT(L);
	auto name = CheckString(L, 1);
	auto target = static_cast<int>(luaL_checkinteger(L, 2));
	auto payload = CheckString(L, 3);
	if (rt->Manager().Hooks().sendToClient)
	{
		rt->Manager().Hooks().sendToClient(name, target, payload);
	}
	return 0;
}

int J_CancelEvent(lua_State* L)
{
	RT(L)->Manager().CancelCurrentEvent();
	return 0;
}

int J_WasCanceled(lua_State* L)
{
	lua_pushboolean(L, RT(L)->Manager().WasCurrentEventCanceled());
	return 1;
}

int J_RegisterCommand(lua_State* L)
{
	auto* rt = RT(L);
	rt->Manager().RegisterCommand(CheckString(L, 1), rt->GetResource().name, lua_toboolean(L, 2));
	return 0;
}

int J_CallExport(lua_State* L)
{
	auto* rt = RT(L);
	auto res = CheckString(L, 1);
	auto name = CheckString(L, 2);
	auto args = CheckString(L, 3);

	std::string results, error;
	bool ok;
	{
		ScriptRuntime::Scope scope(rt, L);
		InvokerScope inv(rt->Manager(), rt->GetResource().name);
		ok = rt->Manager().CallExport(res, name, args, results, error);
	}

	if (!ok)
	{
		return luaL_error(L, "An error occurred while calling export `%s` in resource `%s`:\n  %s", name.c_str(),
			res.c_str(), error.c_str());
	}
	lua_pushlstring(L, results.data(), results.size());
	return 1;
}

// __call of a foreign function reference
int ProxyCall(lua_State* L)
{
	auto* rt = RT(L);
	lua_getfield(L, 1, "__res");
	lua_getfield(L, 1, "__id");
	std::string res = lua_tostring(L, -2) ? lua_tostring(L, -2) : "";
	int64_t id = lua_tointeger(L, -1);
	lua_pop(L, 2);

	auto args = mp::PackLua(L, 2, lua_gettop(L) - 1, Codec(L));
	std::string results, error;
	bool ok;
	{
		ScriptRuntime::Scope scope(rt, L);
		InvokerScope inv(rt->Manager(), rt->GetResource().name);
		ok = rt->Manager().InvokeRef(res, id, args, results, error);
	}
	if (!ok)
	{
		return luaL_error(L, "error calling function reference from %s: %s", res.c_str(), error.c_str());
	}

	lua_settop(L, 0);
	return mp::UnpackLua(L, results, Codec(L));
}

int ProxyGc(lua_State* L)
{
	auto* rt = RT(L);
	lua_getfield(L, 1, "__res");
	lua_getfield(L, 1, "__id");
	if (lua_isstring(L, -2))
	{
		rt->Manager().AddRefCount(lua_tostring(L, -2), lua_tointeger(L, -1), -1);
	}
	return 0;
}

// load() that never accepts precompiled bytecode
int SafeLoad(lua_State* L)
{
	int nargs = lua_gettop(L);
	lua_pushvalue(L, lua_upvalueindex(1));
	lua_pushvalue(L, 1);
	if (nargs >= 2) lua_pushvalue(L, 2); else lua_pushnil(L);
	lua_pushliteral(L, "t");
	int callArgs = 3;
	if (nargs >= 4)
	{
		lua_pushvalue(L, 4);
		callArgs = 4;
	}
	lua_call(L, callArgs, LUA_MULTRET);
	return lua_gettop(L) - nargs;
}

// ---- global natives --------------------------------------------------------

int N_GetCurrentResourceName(lua_State* L)
{
	lua_pushstring(L, RT(L)->GetResource().name.c_str());
	return 1;
}

int N_GetInvokingResource(lua_State* L)
{
	auto inv = RT(L)->Manager().InvokingResource();
	if (inv.empty())
		lua_pushnil(L);
	else
		lua_pushstring(L, inv.c_str());
	return 1;
}

int N_GetGameTimer(lua_State* L)
{
	lua_pushinteger(L, static_cast<lua_Integer>(RT(L)->Manager().TimeMs()));
	return 1;
}

int N_IsDuplicityVersion(lua_State* L)
{
	lua_pushboolean(L, RT(L)->Manager().GetSide() == Side::Server);
	return 1;
}

int N_GetResourceState(lua_State* L)
{
	auto* res = RT(L)->Manager().Find(CheckString(L, 1));
	lua_pushstring(L, res ? ResourceStateName(res->state) : "missing");
	return 1;
}

int N_GetNumResources(lua_State* L)
{
	lua_pushinteger(L, static_cast<lua_Integer>(RT(L)->Manager().Names().size()));
	return 1;
}

int N_GetResourceByFindIndex(lua_State* L)
{
	auto names = RT(L)->Manager().Names();
	auto idx = luaL_checkinteger(L, 1);
	if (idx < 0 || idx >= static_cast<lua_Integer>(names.size()))
		lua_pushnil(L);
	else
		lua_pushstring(L, names[static_cast<size_t>(idx)].c_str());
	return 1;
}

int N_GetNumResourceMetadata(lua_State* L)
{
	auto* res = RT(L)->Manager().Find(CheckString(L, 1));
	auto key = CheckString(L, 2);
	lua_pushinteger(L, res ? static_cast<lua_Integer>(res->manifest.Values(key).size()) : 0);
	return 1;
}

int N_GetResourceMetadata(lua_State* L)
{
	auto* res = RT(L)->Manager().Find(CheckString(L, 1));
	auto key = CheckString(L, 2);
	auto idx = luaL_optinteger(L, 3, 0);
	if (!res)
	{
		lua_pushnil(L);
		return 1;
	}
	auto values = res->manifest.Values(key);
	if (idx < 0 || idx >= static_cast<lua_Integer>(values.size()))
		lua_pushnil(L);
	else
		lua_pushstring(L, values[static_cast<size_t>(idx)].c_str());
	return 1;
}

int N_LoadResourceFile(lua_State* L)
{
	auto* rt = RT(L);
	auto* res = rt->Manager().Find(CheckString(L, 1));
	std::string content;
	if (!res || !res->ReadFile(rt->Manager(), CheckString(L, 2), content))
	{
		lua_pushnil(L);
		return 1;
	}
	lua_pushlstring(L, content.data(), content.size());
	return 1;
}

int N_ExecuteCommand(lua_State* L)
{
	auto* rt = RT(L);
	auto line = CheckString(L, 1);
	std::string error;
	ScriptRuntime::Scope scope(rt, L);
	if (!rt->Manager().ExecuteCommand(line, 0, error))
	{
		log::Warn(ComponentName(rt), "ExecuteCommand: " + error);
	}
	return 0;
}

int N_GetConvar(lua_State* L)
{
	auto* rt = RT(L);
	auto name = CheckString(L, 1);
	std::string fallback = luaL_optstring(L, 2, "");
	auto& hook = rt->Manager().Hooks().getConvar;
	auto value = hook ? hook(name, fallback) : fallback;
	lua_pushstring(L, value.c_str());
	return 1;
}

int N_GetConvarInt(lua_State* L)
{
	auto* rt = RT(L);
	auto name = CheckString(L, 1);
	auto fallback = luaL_optinteger(L, 2, 0);
	auto& hook = rt->Manager().Hooks().getConvar;
	if (hook)
	{
		auto value = hook(name, "");
		char* end = nullptr;
		long long v = std::strtoll(value.c_str(), &end, 10);
		if (!value.empty() && end && *end == '\0')
		{
			lua_pushinteger(L, v);
			return 1;
		}
	}
	lua_pushinteger(L, fallback);
	return 1;
}

std::optional<PlayerInfo> LookupPlayer(lua_State* L, int idx)
{
	auto& hooks = RT(L)->Manager().Hooks();
	if (!hooks.getPlayer)
	{
		return std::nullopt;
	}
	auto id = static_cast<int>(lua_isstring(L, idx) ? std::strtol(lua_tostring(L, idx), nullptr, 10) : 0);
	return hooks.getPlayer(id);
}

int N_GetPlayers(lua_State* L)
{
	auto& hooks = RT(L)->Manager().Hooks();
	lua_newtable(L);
	if (hooks.getPlayers)
	{
		lua_Integer i = 1;
		for (int id : hooks.getPlayers())
		{
			lua_pushstring(L, std::to_string(id).c_str()); // FiveM returns player ids as strings
			lua_rawseti(L, -2, i++);
		}
	}
	return 1;
}

int N_GetNumPlayerIndices(lua_State* L)
{
	auto& hooks = RT(L)->Manager().Hooks();
	lua_pushinteger(L, hooks.getPlayers ? static_cast<lua_Integer>(hooks.getPlayers().size()) : 0);
	return 1;
}

int N_GetPlayerFromIndex(lua_State* L)
{
	auto& hooks = RT(L)->Manager().Hooks();
	auto idx = luaL_checkinteger(L, 1);
	auto ids = hooks.getPlayers ? hooks.getPlayers() : std::vector<int>{};
	if (idx < 0 || idx >= static_cast<lua_Integer>(ids.size()))
		lua_pushnil(L);
	else
		lua_pushstring(L, std::to_string(ids[static_cast<size_t>(idx)]).c_str());
	return 1;
}

int N_GetPlayerName(lua_State* L)
{
	auto* rt = RT(L);
	if (rt->Manager().GetSide() == Side::Client)
	{
		// only the local player is known to the V0.1 client
		lua_pushstring(L, rt->Manager().Hooks().localName.c_str());
		return 1;
	}
	auto p = LookupPlayer(L, 1);
	if (p)
		lua_pushstring(L, p->name.c_str());
	else
		lua_pushnil(L);
	return 1;
}

int N_GetPlayerPing(lua_State* L)
{
	auto p = LookupPlayer(L, 1);
	lua_pushinteger(L, p ? p->ping : 0);
	return 1;
}

int N_GetPlayerEndpoint(lua_State* L)
{
	auto p = LookupPlayer(L, 1);
	if (p)
		lua_pushstring(L, p->endpoint.c_str());
	else
		lua_pushnil(L);
	return 1;
}

int N_GetPlayerIdentifiers(lua_State* L)
{
	auto p = LookupPlayer(L, 1);
	lua_newtable(L);
	if (p)
	{
		lua_Integer i = 1;
		for (auto& id : p->identifiers)
		{
			lua_pushstring(L, id.c_str());
			lua_rawseti(L, -2, i++);
		}
	}
	return 1;
}

int N_GetNumPlayerIdentifiers(lua_State* L)
{
	auto p = LookupPlayer(L, 1);
	lua_pushinteger(L, p ? static_cast<lua_Integer>(p->identifiers.size()) : 0);
	return 1;
}

int N_GetPlayerIdentifier(lua_State* L)
{
	auto p = LookupPlayer(L, 1);
	auto idx = luaL_checkinteger(L, 2);
	if (p && idx >= 0 && idx < static_cast<lua_Integer>(p->identifiers.size()))
		lua_pushstring(L, p->identifiers[static_cast<size_t>(idx)].c_str());
	else
		lua_pushnil(L);
	return 1;
}

int N_DropPlayer(lua_State* L)
{
	auto* rt = RT(L);
	auto id = static_cast<int>(std::strtol(luaL_checkstring(L, 1), nullptr, 10));
	std::string reason = luaL_optstring(L, 2, "Dropped.");
	if (rt->Manager().Hooks().dropPlayer)
	{
		rt->Manager().Hooks().dropPlayer(id, reason);
	}
	return 0;
}

int N_StartResource(lua_State* L)
{
	auto* rt = RT(L);
	std::string error;
	ScriptRuntime::Scope scope(rt, L);
	bool ok = rt->Manager().Start(CheckString(L, 1), error);
	if (!ok)
	{
		log::Warn(ComponentName(rt), "StartResource: " + error);
	}
	lua_pushboolean(L, ok);
	return 1;
}

int N_StopResource(lua_State* L)
{
	auto* rt = RT(L);
	ScriptRuntime::Scope scope(rt, L);
	lua_pushboolean(L, rt->Manager().Stop(CheckString(L, 1)));
	return 1;
}

int N_PlayerId(lua_State* L)
{
	lua_pushinteger(L, 0); // the local player index on the V0.1 client
	return 1;
}

int N_GetPlayerServerId(lua_State* L)
{
	auto* rt = RT(L);
	if (luaL_optinteger(L, 1, 0) == 0)
		lua_pushinteger(L, rt->Manager().Hooks().localServerId);
	else
		lua_pushinteger(L, -1);
	return 1;
}

mp::FuncRefCodec* Codec(lua_State* L)
{
	return RT(L)->CodecPtr();
}

const luaL_Reg kJNatives[] = {
	{ "log", J_Log },
	{ "time", J_Time },
	{ "pack", J_Pack },
	{ "unpack", J_Unpack },
	{ "trigger", J_Trigger },
	{ "trigger_server", J_TriggerServer },
	{ "trigger_client", J_TriggerClient },
	{ "cancel_event", J_CancelEvent },
	{ "was_canceled", J_WasCanceled },
	{ "register_command", J_RegisterCommand },
	{ "call_export", J_CallExport },
	{ nullptr, nullptr },
};

const luaL_Reg kSharedNatives[] = {
	{ "GetCurrentResourceName", N_GetCurrentResourceName },
	{ "GetInvokingResource", N_GetInvokingResource },
	{ "GetGameTimer", N_GetGameTimer },
	{ "IsDuplicityVersion", N_IsDuplicityVersion },
	{ "GetResourceState", N_GetResourceState },
	{ "GetNumResources", N_GetNumResources },
	{ "GetResourceByFindIndex", N_GetResourceByFindIndex },
	{ "GetNumResourceMetadata", N_GetNumResourceMetadata },
	{ "GetResourceMetadata", N_GetResourceMetadata },
	{ "LoadResourceFile", N_LoadResourceFile },
	{ "ExecuteCommand", N_ExecuteCommand },
	{ "GetConvar", N_GetConvar },
	{ "GetConvarInt", N_GetConvarInt },
	{ "GetPlayerName", N_GetPlayerName },
	{ nullptr, nullptr },
};

const luaL_Reg kServerNatives[] = {
	{ "GetPlayers", N_GetPlayers },
	{ "GetNumPlayerIndices", N_GetNumPlayerIndices },
	{ "GetPlayerFromIndex", N_GetPlayerFromIndex },
	{ "GetPlayerPing", N_GetPlayerPing },
	{ "GetPlayerEndpoint", N_GetPlayerEndpoint },
	{ "GetPlayerIdentifiers", N_GetPlayerIdentifiers },
	{ "GetNumPlayerIdentifiers", N_GetNumPlayerIdentifiers },
	{ "GetPlayerIdentifier", N_GetPlayerIdentifier },
	{ "DropPlayer", N_DropPlayer },
	{ "StartResource", N_StartResource },
	{ "StopResource", N_StopResource },
	{ nullptr, nullptr },
};

const luaL_Reg kClientNatives[] = {
	{ "PlayerId", N_PlayerId },
	{ "GetPlayerServerId", N_GetPlayerServerId },
	{ nullptr, nullptr },
};

void RegisterGlobals(lua_State* L, const luaL_Reg* regs)
{
	for (; regs->name; regs++)
	{
		lua_pushcfunction(L, regs->func);
		lua_setglobal(L, regs->name);
	}
}

void KeepFields(lua_State* L, const char* table, std::initializer_list<const char*> keep)
{
	if (lua_getglobal(L, table) != LUA_TTABLE)
	{
		lua_pop(L, 1);
		return;
	}
	lua_newtable(L);
	for (auto f : keep)
	{
		lua_getfield(L, -2, f);
		lua_setfield(L, -2, f);
	}
	lua_setglobal(L, table);
	lua_pop(L, 1);
}
}

// ---- ScriptRuntime ---------------------------------------------------------

ScriptRuntime::ScriptRuntime(ResourceManager& mgr, Resource& res)
	: m_mgr(mgr), m_res(res), m_codec(std::make_unique<RuntimeCodec>(*this))
{
}

ScriptRuntime::~ScriptRuntime()
{
	if (m_L)
	{
		lua_close(m_L);
		m_L = nullptr;
	}
}

mp::FuncRefCodec* ScriptRuntime::CodecPtr()
{
	return m_codec.get();
}

bool ScriptRuntime::DeadlineExceeded() const
{
	return m_deadlineMs != 0 && m_mgr.TimeMs() > m_deadlineMs;
}

bool ScriptRuntime::Create(std::string& error)
{
	m_L = luaL_newstate();
	if (!m_L)
	{
		error = "could not allocate Lua state";
		return false;
	}

	*static_cast<ScriptRuntime**>(lua_getextraspace(m_L)) = this;
	lua_State* L = m_L;
	bool server = m_mgr.GetSide() == Side::Server;

	luaL_requiref(L, LUA_GNAME, luaopen_base, 1);
	luaL_requiref(L, LUA_COLIBNAME, luaopen_coroutine, 1);
	luaL_requiref(L, LUA_TABLIBNAME, luaopen_table, 1);
	luaL_requiref(L, LUA_STRLIBNAME, luaopen_string, 1);
	luaL_requiref(L, LUA_MATHLIBNAME, luaopen_math, 1);
	luaL_requiref(L, LUA_UTF8LIBNAME, luaopen_utf8, 1);
	luaL_requiref(L, LUA_OSLIBNAME, luaopen_os, 1);
	luaL_requiref(L, LUA_DBLIBNAME, luaopen_debug, 1);
	lua_pop(L, 8);
	if (server)
	{
		// FXServer exposes io/os to server scripts; the client keeps a sandbox.
		luaL_requiref(L, LUA_IOLIBNAME, luaopen_io, 1);
		lua_pop(L, 1);
	}

	for (auto name : { "dofile", "loadfile" })
	{
		lua_pushnil(L);
		lua_setglobal(L, name);
	}

	lua_getglobal(L, "load");
	lua_pushcclosure(L, SafeLoad, 1);
	lua_setglobal(L, "load");

	if (!server)
	{
		KeepFields(L, "os", { "time", "clock", "date", "difftime" });
	}

	// registry tables for function references
	lua_newtable(L);
	lua_setfield(L, LUA_REGISTRYINDEX, kRefsKey);
	lua_newtable(L);
	lua_newtable(L);
	lua_pushliteral(L, "k");
	lua_setfield(L, -2, "__mode");
	lua_setmetatable(L, -2);
	lua_setfield(L, LUA_REGISTRYINDEX, kRefIdsKey);
	lua_newtable(L);
	lua_pushcfunction(L, ProxyCall);
	lua_setfield(L, -2, "__call");
	lua_pushcfunction(L, ProxyGc);
	lua_setfield(L, -2, "__gc");
	lua_setfield(L, LUA_REGISTRYINDEX, kProxyMtKey);

	RegisterGlobals(L, kSharedNatives);
	RegisterGlobals(L, server ? kServerNatives : kClientNatives);
	luajson::Register(L);

	lua_sethook(L, DeadlineHook, LUA_MASKCOUNT, kHookInstructions);

	if (luaL_loadbufferx(L, reinterpret_cast<const char*>(kBootstrapLua), kBootstrapLuaSize, "=bootstrap", "t") !=
		LUA_OK)
	{
		error = std::string("bootstrap load failed: ") + lua_tostring(L, -1);
		return false;
	}

	// J table
	luaL_newlib(L, kJNatives);
	lua_pushstring(L, server ? "server" : "client");
	lua_setfield(L, -2, "side");
	lua_pushstring(L, m_res.name.c_str());
	lua_setfield(L, -2, "resource_name");
	lua_newtable(L);
	{
		lua_Integer i = 1;
		for (auto& e : m_res.manifest.Values(server ? "server_export" : "export"))
		{
			lua_pushstring(L, e.c_str());
			lua_rawseti(L, -2, i++);
		}
	}
	lua_setfield(L, -2, "declared_exports");

	m_depth++;
	m_deadlineMs = m_mgr.TimeMs() + m_mgr.ScriptBudgetMs();
	int st = lua_pcall(L, 1, 0, 0);
	m_depth--;
	m_deadlineMs = 0;
	if (st != LUA_OK)
	{
		error = std::string("bootstrap failed: ") + lua_tostring(L, -1);
		return false;
	}

	if (!server)
	{
		// scripts keep debug.traceback/getinfo only (bootstrap captured what it needs)
		KeepFields(L, "debug", { "traceback", "getinfo" });
	}

	return true;
}

bool ScriptRuntime::Call(const std::function<int(lua_State*)>& pushFnAndArgs, int nresults,
	const std::function<void(lua_State*)>& onResult, std::string& error)
{
	lua_State* anchor = m_running ? m_running : m_L;
	luaL_checkstack(anchor, 2, "runtime call");

	bool outermost = m_depth == 0;
	if (outermost)
	{
		m_deadlineMs = m_mgr.TimeMs() + m_mgr.ScriptBudgetMs();
	}
	m_depth++;

	lua_State* T = lua_newthread(anchor);
	int ref = luaL_ref(anchor, LUA_REGISTRYINDEX);

	lua_pushcfunction(T, Traceback);
	int nargs = pushFnAndArgs(T);
	int st = lua_pcall(T, nargs, nresults, 1);

	bool ok = st == LUA_OK;
	if (ok)
	{
		if (onResult)
		{
			onResult(T);
		}
	}
	else
	{
		const char* msg = lua_tostring(T, -1);
		error = msg ? msg : "unknown error";
	}

	luaL_unref(anchor, LUA_REGISTRYINDEX, ref);
	m_depth--;
	if (outermost)
	{
		m_deadlineMs = 0;
	}
	return ok;
}

bool ScriptRuntime::RunScript(const std::string& path, const std::string& code, std::string& error)
{
	std::string chunk = "@" + m_res.name + "/" + path;
	bool ok = Call(
		[&](lua_State* T) {
			if (luaL_loadbufferx(T, code.data(), code.size(), chunk.c_str(), "t") != LUA_OK)
			{
				// turn the syntax error into a call that rethrows it under pcall
				lua_pushcfunction(T, [](lua_State* L2) { return lua_error(L2); });
				lua_insert(T, -2);
				return 1;
			}
			return 0;
		},
		0, nullptr, error);

	if (!ok)
	{
		log::Error(ComponentName(this), "error loading " + path + ": " + error);
	}
	return ok;
}

void ScriptRuntime::Tick()
{
	if (m_depth == 0)
	{
		m_codec->FlushReleases(m_L);
	}

	std::string error;
	if (!Call(
			[](lua_State* T) {
				lua_getglobal(T, "__jays_tick");
				return 0;
			},
			0, nullptr, error))
	{
		log::Error(ComponentName(this), "scheduler error: " + error);
	}
}

void ScriptRuntime::DispatchEvent(const std::string& name, const std::string& payload, const std::string& source)
{
	std::string error;
	if (!Call(
			[&](lua_State* T) {
				lua_getglobal(T, "__jays_dispatch");
				lua_pushlstring(T, name.data(), name.size());
				lua_pushlstring(T, payload.data(), payload.size());
				lua_pushlstring(T, source.data(), source.size());
				return 3;
			},
			0, nullptr, error))
	{
		log::Error(ComponentName(this), "error dispatching event " + name + ": " + error);
	}
}

bool ScriptRuntime::CallExport(const std::string& name, const std::string& args, std::string& results, std::string& error)
{
	return Call(
		[&](lua_State* T) {
			lua_getglobal(T, "__jays_export");
			lua_pushlstring(T, name.data(), name.size());
			lua_pushlstring(T, args.data(), args.size());
			return 2;
		},
		1,
		[&](lua_State* T) {
			size_t len = 0;
			const char* s = lua_tolstring(T, -1, &len);
			results.assign(s ? s : "", len);
		},
		error);
}

bool ScriptRuntime::InvokeRef(int64_t id, const std::string& args, std::string& results, std::string& error)
{
	return Call(
		[&](lua_State* T) {
			lua_getglobal(T, "__jays_invoke");
			lua_getfield(T, LUA_REGISTRYINDEX, kRefsKey);
			lua_rawgeti(T, -1, id);
			lua_remove(T, -2);
			lua_pushlstring(T, args.data(), args.size());
			return 2;
		},
		1,
		[&](lua_State* T) {
			size_t len = 0;
			const char* s = lua_tolstring(T, -1, &len);
			results.assign(s ? s : "", len);
		},
		error);
}

void ScriptRuntime::RunCommand(const std::string& name, int source, const std::vector<std::string>& args, const std::string& raw)
{
	std::string error;
	if (!Call(
			[&](lua_State* T) {
				lua_getglobal(T, "__jays_command");
				lua_pushlstring(T, name.data(), name.size());
				lua_pushinteger(T, source);
				lua_createtable(T, static_cast<int>(args.size()), 0);
				for (size_t i = 0; i < args.size(); i++)
				{
					lua_pushlstring(T, args[i].data(), args[i].size());
					lua_rawseti(T, -2, static_cast<lua_Integer>(i + 1));
				}
				lua_pushlstring(T, raw.data(), raw.size());
				return 4;
			},
			0, nullptr, error))
	{
		log::Error(ComponentName(this), "error running command " + name + ": " + error);
	}
}

void ScriptRuntime::AddRefCount(int64_t id, int delta)
{
	m_codec->AddRefCount(id, delta);
}
}
