#pragma once

#include <jays/manifest.h>

#include <cstdint>
#include <functional>
#include <map>
#include <memory>
#include <optional>
#include <string>
#include <vector>

struct lua_State;

namespace jays::mp
{
class FuncRefCodec;
}

namespace jays
{
enum class Side
{
	Server,
	Client,
};

enum class ResourceState
{
	Stopped,
	Starting,
	Started,
	Stopping,
};

const char* ResourceStateName(ResourceState s);

struct PlayerInfo
{
	int id = 0;
	std::string name;
	std::string endpoint;
	int ping = 0;
	std::vector<std::string> identifiers;
};

// Callbacks the hosting process (server or client) provides to the runtime.
struct HostHooks
{
	// client -> server event
	std::function<void(const std::string& name, const std::string& payload)> sendToServer;
	// server -> client event; target -1 broadcasts
	std::function<void(const std::string& name, int target, const std::string& payload)> sendToClient;

	std::function<std::vector<int>()> getPlayers;
	std::function<std::optional<PlayerInfo>(int id)> getPlayer;
	std::function<void(int id, const std::string& reason)> dropPlayer;
	std::function<std::string(const std::string& name, const std::string& fallback)> getConvar;
	// Built-in host commands (start, stop, quit, ...). Returns true when handled.
	std::function<bool(const std::vector<std::string>& args, int source)> hostCommand;

	// client only: identity of the local player
	int localServerId = 0;
	std::string localName;
};

class ScriptRuntime;
class ResourceManager;

class Resource
{
public:
	std::string name;
	std::unique_ptr<FileSource> files;
	Manifest manifest;
	std::string manifestFile;
	ResourceState state = ResourceState::Stopped;
	std::unique_ptr<ScriptRuntime> runtime;

	std::vector<std::string> ScriptsFor(Side side) const; // shared first, then side specific, globs expanded
	bool ReadFile(const ResourceManager& mgr, const std::string& path, std::string& out) const;
};

class ResourceManager
{
public:
	explicit ResourceManager(Side side);
	~ResourceManager();

	ResourceManager(const ResourceManager&) = delete;
	ResourceManager& operator=(const ResourceManager&) = delete;

	Side GetSide() const { return m_side; }
	HostHooks& Hooks() { return m_hooks; }

	// Recursively finds resources. Folders named [category] are traversed,
	// folders containing a manifest are resources. Returns the number added.
	int ScanDirectory(const std::string& root);
	bool AddResource(const std::string& name, std::unique_ptr<FileSource> files, std::string& error);
	bool RemoveResource(const std::string& name);

	Resource* Find(const std::string& name);
	const Resource* Find(const std::string& name) const;
	std::vector<std::string> Names() const;            // sorted
	std::vector<std::string> StartedNames() const;     // in start order

	bool Start(const std::string& name, std::string& error);
	bool Stop(const std::string& name);
	bool Restart(const std::string& name, std::string& error);
	void StopAll();

	// Runs due script threads in every started resource.
	void Tick();

	// Dispatches an event to every started resource. Returns false if a handler called CancelEvent().
	bool TriggerEvent(const std::string& name, const std::string& payload, const std::string& source = "");
	// Helper for host code: payload from string arguments.
	bool TriggerEventStrings(const std::string& name, const std::vector<std::string>& args, const std::string& source = "");

	// Network ingress: an event arriving from the remote side.
	void OnNetEvent(const std::string& name, const std::string& payload, int sourceNetId);

	// Runs a command line. Returns false with `error` when no handler exists or access is denied.
	bool ExecuteCommand(const std::string& line, int source, std::string& error);
	bool HasCommand(const std::string& name) const;
	std::vector<std::string> CommandNames() const;

	// Host-side callables that scripts can receive as function references.
	using HostFunction = std::function<std::string(const std::string& payload)>;
	int64_t CreateHostRef(HostFunction fn);
	void ReleaseHostRef(int64_t id);

	// --- internal API used by ScriptRuntime ---
	bool CallExport(const std::string& resource, const std::string& exportName, const std::string& args,
		std::string& results, std::string& error);
	bool InvokeRef(const std::string& resource, int64_t id, const std::string& args, std::string& results,
		std::string& error);
	void AddRefCount(const std::string& resource, int64_t id, int delta);
	void RegisterCommand(const std::string& name, const std::string& resource, bool restricted);
	void CancelCurrentEvent();
	bool WasCurrentEventCanceled() const;
	std::string InvokingResource() const;
	void PushInvoker(const std::string& resource) { m_invokers.push_back(resource); }
	void PopInvoker() { m_invokers.pop_back(); }
	uint64_t TimeMs() const;

	// Maximum time one entry into a script (tick, event, export) may run before it is aborted.
	uint64_t ScriptBudgetMs() const { return m_scriptBudgetMs; }
	void SetScriptBudgetMs(uint64_t ms) { m_scriptBudgetMs = ms; }

private:
	bool StartInternal(const std::string& name, std::vector<std::string>& chain, std::string& error);
	void StopInternal(Resource& res);

	struct CommandEntry
	{
		std::string resource;
		bool restricted = false;
	};

	Side m_side;
	HostHooks m_hooks;
	std::map<std::string, std::unique_ptr<Resource>> m_resources;
	std::vector<std::string> m_startOrder;
	std::map<std::string, CommandEntry> m_commands;
	std::vector<bool> m_cancelStack;
	std::vector<std::string> m_invokers;
	std::vector<std::string> m_deferredStops;
	std::map<int64_t, HostFunction> m_hostRefs;
	int64_t m_nextHostRef = 1;
	int m_eventDepth = 0;
	uint64_t m_scriptBudgetMs = 5000;
};

// One isolated Lua 5.4 state per started resource.
class ScriptRuntime
{
public:
	ScriptRuntime(ResourceManager& mgr, Resource& res);
	~ScriptRuntime();

	bool Create(std::string& error);
	// Executes one script file; errors are logged and returned.
	bool RunScript(const std::string& path, const std::string& code, std::string& error);

	void Tick();
	void DispatchEvent(const std::string& name, const std::string& payload, const std::string& source);
	bool CallExport(const std::string& name, const std::string& args, std::string& results, std::string& error);
	bool InvokeRef(int64_t id, const std::string& args, std::string& results, std::string& error);
	void RunCommand(const std::string& name, int source, const std::vector<std::string>& args, const std::string& raw);
	void AddRefCount(int64_t id, int delta);

	bool IsBusy() const { return m_depth > 0; }
	bool DeadlineExceeded() const;
	mp::FuncRefCodec* CodecPtr();
	Resource& GetResource() { return m_res; }
	ResourceManager& Manager() { return m_mgr; }
	lua_State* MainState() { return m_L; }

	// Called by Lua C functions to mark the thread executing native code.
	struct Scope
	{
		Scope(ScriptRuntime* rt, lua_State* L);
		~Scope();
		ScriptRuntime* rt;
		lua_State* prev;
	};

private:
	friend class RuntimeCodec;

	// Runs a protected call on a fresh Lua thread. `pushFnAndArgs` pushes the
	// function and its arguments and returns the argument count; on success
	// `onResult` sees `nresults` values on top of the thread's stack.
	bool Call(const std::function<int(lua_State*)>& pushFnAndArgs, int nresults,
		const std::function<void(lua_State*)>& onResult, std::string& error);

	ResourceManager& m_mgr;
	Resource& m_res;
	lua_State* m_L = nullptr;
	lua_State* m_running = nullptr; // thread currently inside a native call, if any
	int m_depth = 0;
	uint64_t m_deadlineMs = 0;
	std::unique_ptr<class RuntimeCodec> m_codec;
};
}
