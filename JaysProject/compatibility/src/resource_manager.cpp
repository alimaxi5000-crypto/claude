#include <jays/config.h>
#include <jays/log.h>
#include <jays/resource_manager.h>
#include <jays/serialization.h>

#include <algorithm>
#include <chrono>
#include <filesystem>

namespace fs = std::filesystem;

namespace jays
{
namespace
{
constexpr int kMaxEventDepth = 32;
const char* kHostResource = "__host";
const auto g_epoch = std::chrono::steady_clock::now();

bool IsValidResourceName(const std::string& name)
{
	if (name.empty() || name.size() > 64 || name == kHostResource)
	{
		return false;
	}
	return std::all_of(name.begin(), name.end(), [](char c) {
		return std::isalnum(static_cast<unsigned char>(c)) || c == '_' || c == '-' || c == '.';
	});
}

std::string Lower(std::string s)
{
	std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
	return s;
}
}

const char* ResourceStateName(ResourceState s)
{
	switch (s)
	{
		case ResourceState::Stopped: return "stopped";
		case ResourceState::Starting: return "starting";
		case ResourceState::Started: return "started";
		case ResourceState::Stopping: return "stopping";
	}
	return "unknown";
}

std::vector<std::string> Resource::ScriptsFor(Side side) const
{
	std::vector<std::string> out;
	for (const char* key : { "shared_script", side == Side::Server ? "server_script" : "client_script" })
	{
		for (auto& entry : manifest.Values(key))
		{
			for (auto& path : ExpandFileEntry(*files, entry))
			{
				if (std::find(out.begin(), out.end(), path) == out.end())
				{
					out.push_back(path);
				}
			}
		}
	}
	return out;
}

bool Resource::ReadFile(const ResourceManager& mgr, const std::string& path, std::string& out) const
{
	// files received from a server may carry pre-resolved "@resource/path" entries
	if (files->Read(path, out))
	{
		return true;
	}

	if (!path.empty() && path[0] == '@')
	{
		auto slash = path.find('/');
		if (slash == std::string::npos)
		{
			return false;
		}
		auto* other = mgr.Find(path.substr(1, slash - 1));
		return other && other != this && other->files->Read(path.substr(slash + 1), out);
	}
	return false;
}

ResourceManager::ResourceManager(Side side) : m_side(side)
{
}

ResourceManager::~ResourceManager()
{
	StopAll();
}

uint64_t ResourceManager::TimeMs() const
{
	return static_cast<uint64_t>(
		std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - g_epoch).count());
}

int ResourceManager::ScanDirectory(const std::string& root)
{
	std::error_code ec;
	if (!fs::is_directory(root, ec))
	{
		log::Warn("resources", "resource directory " + root + " does not exist");
		return 0;
	}

	std::vector<fs::path> dirs;
	for (auto& entry : fs::directory_iterator(root, ec))
	{
		if (entry.is_directory(ec))
		{
			dirs.push_back(entry.path());
		}
	}
	std::sort(dirs.begin(), dirs.end());

	int added = 0;
	for (auto& dir : dirs)
	{
		auto name = dir.filename().string();
		if (name.size() > 2 && name.front() == '[' && name.back() == ']')
		{
			added += ScanDirectory(dir.string());
			continue;
		}

		if (!fs::exists(dir / "fxmanifest.lua", ec) && !fs::exists(dir / "__resource.lua", ec))
		{
			continue;
		}

		std::string error;
		if (AddResource(name, std::make_unique<DiskFileSource>(dir.string()), error))
		{
			added++;
		}
		else
		{
			log::Error("resources", "could not load resource " + name + ": " + error);
		}
	}
	return added;
}

bool ResourceManager::AddResource(const std::string& name, std::unique_ptr<FileSource> files, std::string& error)
{
	if (!IsValidResourceName(name))
	{
		error = "invalid resource name '" + name + "'";
		return false;
	}

	if (auto* existing = Find(name))
	{
		if (existing->state != ResourceState::Stopped)
		{
			error = "resource " + name + " is already loaded and running";
			return false;
		}
		m_resources.erase(name);
	}

	auto res = std::make_unique<Resource>();
	res->name = name;
	res->files = std::move(files);
	if (!LoadManifest(*res->files, res->manifest, res->manifestFile, error))
	{
		return false;
	}

	if (res->manifestFile == "__resource.lua")
	{
		log::Warn("resources", name + " uses the legacy __resource.lua manifest");
	}
	else if (res->manifest.First("fx_version").empty())
	{
		log::Warn("resources", name + "/fxmanifest.lua does not declare fx_version");
	}

	log::Debug("resources", "found resource " + name + " (" + res->files->Describe() + ")");
	m_resources[name] = std::move(res);
	return true;
}

bool ResourceManager::RemoveResource(const std::string& name)
{
	auto* res = Find(name);
	if (!res)
	{
		return false;
	}
	if (res->state != ResourceState::Stopped)
	{
		Stop(name);
	}
	if (res->state == ResourceState::Stopped)
	{
		m_resources.erase(name);
		return true;
	}
	return false;
}

Resource* ResourceManager::Find(const std::string& name)
{
	auto it = m_resources.find(name);
	return it == m_resources.end() ? nullptr : it->second.get();
}

const Resource* ResourceManager::Find(const std::string& name) const
{
	auto it = m_resources.find(name);
	return it == m_resources.end() ? nullptr : it->second.get();
}

std::vector<std::string> ResourceManager::Names() const
{
	std::vector<std::string> out;
	for (auto& [k, v] : m_resources)
	{
		out.push_back(k);
	}
	return out;
}

std::vector<std::string> ResourceManager::StartedNames() const
{
	std::vector<std::string> out;
	for (auto& n : m_startOrder)
	{
		auto* r = Find(n);
		if (r && r->state == ResourceState::Started)
		{
			out.push_back(n);
		}
	}
	return out;
}

bool ResourceManager::Start(const std::string& name, std::string& error)
{
	std::vector<std::string> chain;
	return StartInternal(name, chain, error);
}

bool ResourceManager::StartInternal(const std::string& name, std::vector<std::string>& chain, std::string& error)
{
	auto* res = Find(name);
	if (!res)
	{
		error = "resource " + name + " not found";
		return false;
	}

	if (res->state == ResourceState::Started)
	{
		return true;
	}

	if (std::find(chain.begin(), chain.end(), name) != chain.end() || res->state == ResourceState::Starting)
	{
		chain.push_back(name);
		std::string path;
		for (auto& c : chain) path += (path.empty() ? "" : " -> ") + c;
		error = "dependency cycle: " + path;
		return false;
	}

	if (res->state == ResourceState::Stopping)
	{
		error = "resource " + name + " is stopping";
		return false;
	}

	chain.push_back(name);
	for (auto& dep : ManifestDependencies(res->manifest))
	{
		if (!dep.empty() && dep[0] == '/')
		{
			log::Debug("resources", name + ": platform dependency " + dep + " ignored");
			continue;
		}
		std::string depError;
		if (!StartInternal(dep, chain, depError))
		{
			chain.pop_back();
			error = "could not start dependency " + dep + " of " + name + ": " + depError;
			return false;
		}
	}
	chain.pop_back();

	if (!TriggerEventStrings("onResourceStarting", { name }))
	{
		error = "start of " + name + " was canceled by an onResourceStarting handler";
		return false;
	}

	res->state = ResourceState::Starting;
	res->runtime = std::make_unique<ScriptRuntime>(*this, *res);
	std::string rtError;
	if (!res->runtime->Create(rtError))
	{
		res->runtime.reset();
		res->state = ResourceState::Stopped;
		error = "could not create script runtime for " + name + ": " + rtError;
		return false;
	}
	m_startOrder.push_back(name);

	int loaded = 0;
	for (auto& path : res->ScriptsFor(m_side))
	{
		if (path.size() < 4 || path.compare(path.size() - 4, 4, ".lua") != 0)
		{
			// FiveM routes .js / .net.dll files to other runtimes (F-013); V0.1 only has Lua.
			log::Warn("resources", name + "/" + path + " skipped: only Lua scripts are supported");
			continue;
		}

		std::string code;
		if (!res->ReadFile(*this, path, code))
		{
			log::Error("resources", "could not open " + name + "/" + path);
			continue;
		}

		std::string scriptError;
		if (res->runtime->RunScript(path, code, scriptError))
		{
			loaded++;
		}
	}

	res->state = ResourceState::Started;
	log::Info("resources", "Started resource " + name + " (" + std::to_string(loaded) + " script(s))");

	TriggerEventStrings("onResourceStart", { name });
	TriggerEventStrings(m_side == Side::Server ? "onServerResourceStart" : "onClientResourceStart", { name });
	return true;
}

bool ResourceManager::Stop(const std::string& name)
{
	auto* res = Find(name);
	if (!res || res->state != ResourceState::Started)
	{
		return false;
	}

	// Never tear down a Lua state that is executing; finish on the next tick.
	bool busy = m_eventDepth > 0;
	for (auto& [n, r] : m_resources)
	{
		busy = busy || (r->runtime && r->runtime->IsBusy());
	}
	if (busy)
	{
		if (std::find(m_deferredStops.begin(), m_deferredStops.end(), name) == m_deferredStops.end())
		{
			m_deferredStops.push_back(name);
		}
		return true;
	}

	StopInternal(*res);
	return true;
}

void ResourceManager::StopInternal(Resource& res)
{
	res.state = ResourceState::Stopping;
	TriggerEventStrings("onResourceStop", { res.name });
	TriggerEventStrings(m_side == Side::Server ? "onServerResourceStop" : "onClientResourceStop", { res.name });

	for (auto it = m_commands.begin(); it != m_commands.end();)
	{
		it = it->second.resource == res.name ? m_commands.erase(it) : std::next(it);
	}
	std::erase(m_startOrder, res.name);
	res.runtime.reset();
	res.state = ResourceState::Stopped;
	log::Info("resources", "Stopped resource " + res.name);
}

bool ResourceManager::Restart(const std::string& name, std::string& error)
{
	auto* res = Find(name);
	if (!res)
	{
		error = "resource " + name + " not found";
		return false;
	}
	if (res->state == ResourceState::Started)
	{
		StopInternal(*res);
	}
	return Start(name, error);
}

void ResourceManager::StopAll()
{
	auto order = m_startOrder;
	for (auto it = order.rbegin(); it != order.rend(); ++it)
	{
		if (auto* res = Find(*it); res && res->state == ResourceState::Started)
		{
			StopInternal(*res);
		}
	}
}

void ResourceManager::Tick()
{
	if (!m_deferredStops.empty())
	{
		auto stops = std::move(m_deferredStops);
		m_deferredStops.clear();
		for (auto& n : stops)
		{
			if (auto* res = Find(n); res && res->state == ResourceState::Started)
			{
				StopInternal(*res);
			}
		}
	}

	auto order = m_startOrder;
	for (auto& n : order)
	{
		auto* res = Find(n);
		if (res && res->runtime && res->state == ResourceState::Started)
		{
			res->runtime->Tick();
		}
	}
}

bool ResourceManager::TriggerEvent(const std::string& name, const std::string& payload, const std::string& source)
{
	if (m_eventDepth >= kMaxEventDepth)
	{
		log::Error("events", "event " + name + " dropped: maximum event recursion depth reached");
		return true;
	}

	m_cancelStack.push_back(false);
	m_eventDepth++;

	auto order = m_startOrder;
	for (auto& n : order)
	{
		auto* res = Find(n);
		if (res && res->runtime)
		{
			res->runtime->DispatchEvent(name, payload, source);
		}
	}

	m_eventDepth--;
	bool canceled = m_cancelStack.back();
	m_cancelStack.pop_back();
	return !canceled;
}

bool ResourceManager::TriggerEventStrings(const std::string& name, const std::vector<std::string>& args,
	const std::string& source)
{
	mp::Writer w;
	w.Array(static_cast<uint32_t>(args.size()));
	for (auto& a : args)
	{
		w.Str(a);
	}
	return TriggerEvent(name, w.Data(), source);
}

void ResourceManager::OnNetEvent(const std::string& name, const std::string& payload, int sourceNetId)
{
	TriggerEvent(name, payload, "net:" + std::to_string(sourceNetId));
}

bool ResourceManager::ExecuteCommand(const std::string& line, int source, std::string& error)
{
	auto args = TokenizeCommand(line);
	if (args.empty())
	{
		error = "empty command";
		return false;
	}

	if (m_hooks.hostCommand && m_hooks.hostCommand(args, source))
	{
		return true;
	}

	auto name = Lower(args[0]);
	auto it = m_commands.find(name);
	if (it == m_commands.end())
	{
		error = "No such command " + name + ".";
		return false;
	}

	if (it->second.restricted && source != 0)
	{
		error = "Access denied for command " + name + ".";
		return false;
	}

	auto* res = Find(it->second.resource);
	if (!res || !res->runtime)
	{
		error = "command " + name + " belongs to a stopped resource";
		return false;
	}

	std::vector<std::string> rest(args.begin() + 1, args.end());
	auto raw = line;
	while (!raw.empty() && (raw.back() == '\n' || raw.back() == '\r'))
	{
		raw.pop_back();
	}
	res->runtime->RunCommand(name, source, rest, raw);
	return true;
}

bool ResourceManager::HasCommand(const std::string& name) const
{
	return m_commands.count(Lower(name)) != 0;
}

std::vector<std::string> ResourceManager::CommandNames() const
{
	std::vector<std::string> out;
	for (auto& [k, v] : m_commands)
	{
		out.push_back(k);
	}
	return out;
}

void ResourceManager::RegisterCommand(const std::string& name, const std::string& resource, bool restricted)
{
	auto it = m_commands.find(name);
	if (it != m_commands.end() && it->second.resource != resource)
	{
		log::Warn("commands", "command " + name + " from " + it->second.resource + " is overridden by " + resource);
	}
	m_commands[name] = CommandEntry{ resource, restricted };
}

int64_t ResourceManager::CreateHostRef(HostFunction fn)
{
	auto id = m_nextHostRef++;
	m_hostRefs[id] = std::move(fn);
	return id;
}

void ResourceManager::ReleaseHostRef(int64_t id)
{
	m_hostRefs.erase(id);
}

bool ResourceManager::CallExport(const std::string& resource, const std::string& exportName, const std::string& args,
	std::string& results, std::string& error)
{
	auto* res = Find(resource);
	if (!res || !res->runtime)
	{
		error = "No such export " + exportName + " in resource " + resource;
		return false;
	}
	return res->runtime->CallExport(exportName, args, results, error);
}

bool ResourceManager::InvokeRef(const std::string& resource, int64_t id, const std::string& args, std::string& results,
	std::string& error)
{
	if (resource == kHostResource)
	{
		auto it = m_hostRefs.find(id);
		if (it == m_hostRefs.end())
		{
			error = "host function reference is no longer valid";
			return false;
		}
		results = it->second(args);
		return true;
	}

	auto* res = Find(resource);
	if (!res || !res->runtime)
	{
		error = "resource " + resource + " is not running";
		return false;
	}
	return res->runtime->InvokeRef(id, args, results, error);
}

void ResourceManager::AddRefCount(const std::string& resource, int64_t id, int delta)
{
	if (resource == kHostResource)
	{
		return;
	}
	if (auto* res = Find(resource); res && res->runtime)
	{
		res->runtime->AddRefCount(id, delta);
	}
}

void ResourceManager::CancelCurrentEvent()
{
	if (!m_cancelStack.empty())
	{
		m_cancelStack.back() = true;
	}
}

bool ResourceManager::WasCurrentEventCanceled() const
{
	return !m_cancelStack.empty() && m_cancelStack.back();
}

std::string ResourceManager::InvokingResource() const
{
	return m_invokers.empty() ? std::string() : m_invokers.back();
}
}
