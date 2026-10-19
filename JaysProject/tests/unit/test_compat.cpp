#include "test_framework.h"

#include <jays/log.h>
#include <jays/manifest.h>
#include <jays/resource_manager.h>
#include <jays/serialization.h>

#include <chrono>
#include <map>
#include <thread>

using namespace jays;

namespace
{
// Captures log output for assertions.
struct LogCapture
{
	std::vector<log::Record> records;

	LogCapture()
	{
		log::SetMinLevel(log::Level::Debug);
		log::SetSink([this](const log::Record& r) { records.push_back(r); });
	}
	~LogCapture() { log::SetSink(nullptr); }

	bool Contains(const std::string& text) const
	{
		for (auto& r : records)
		{
			if (r.message.find(text) != std::string::npos)
			{
				return true;
			}
		}
		return false;
	}

	int Count(const std::string& text) const
	{
		int n = 0;
		for (auto& r : records)
		{
			if (r.message.find(text) != std::string::npos)
			{
				n++;
			}
		}
		return n;
	}
};

void AddMem(ResourceManager& mgr, const std::string& name, std::map<std::string, std::string> files)
{
	auto src = std::make_unique<MemoryFileSource>();
	for (auto& [k, v] : files)
	{
		src->Add(k, v);
	}
	std::string err;
	if (!mgr.AddResource(name, std::move(src), err))
	{
		throw jt::Failure{ "AddResource(" + name + ") failed: " + err };
	}
}

void StartOk(ResourceManager& mgr, const std::string& name)
{
	std::string err;
	if (!mgr.Start(name, err))
	{
		throw jt::Failure{ "Start(" + name + ") failed: " + err };
	}
}

const char* kManifest = "fx_version 'cerulean'\ngame 'gta5'\nserver_script 'server.lua'\n";

void TickFor(ResourceManager& mgr, int ms)
{
	auto end = std::chrono::steady_clock::now() + std::chrono::milliseconds(ms);
	while (std::chrono::steady_clock::now() < end)
	{
		mgr.Tick();
		std::this_thread::sleep_for(std::chrono::milliseconds(2));
	}
}
}

// ---- manifest ----------------------------------------------------------------

TEST(manifest_parses_directives)
{
	Manifest m;
	std::string err;
	bool ok = ParseManifest("fxmanifest.lua", R"(
fx_version 'cerulean'
game 'gta5'
author 'jay'
lua54 'yes'
shared_script 'config.lua'
client_scripts { 'client/a.lua', 'client/b.lua' }
server_script 'server.lua'
dependencies { 'base', '/server:5000' }
dependency 'other'
export 'getValue'
ui_page 'html/index.html' { 'legacy extra' }
)", m, err);
	CHECK(ok);
	CHECK_EQ(m.First("fx_version"), std::string("cerulean"));
	CHECK_EQ(m.Values("client_script").size(), size_t(2));
	CHECK_EQ(m.Values("client_script")[1], std::string("client/b.lua"));
	CHECK_EQ(m.Values("shared_script")[0], std::string("config.lua"));
	CHECK_EQ(m.Values("export")[0], std::string("getValue"));
	CHECK_EQ(m.First("ui_page"), std::string("html/index.html"));

	auto deps = ManifestDependencies(m);
	CHECK_EQ(deps.size(), size_t(3));
	CHECK_EQ(deps[0], std::string("other"));
	CHECK_EQ(deps[1], std::string("base"));
}

TEST(manifest_errors_are_reported)
{
	Manifest m;
	std::string err;
	CHECK(!ParseManifest("fxmanifest.lua", "fx_version 'cerulean'\nclient_script(", m, err));
	CHECK(err.find("fxmanifest.lua") != std::string::npos);

	// manifests cannot reach the OS: `os` is an unknown global, i.e. a directive function
	Manifest m2;
	CHECK(!ParseManifest("fxmanifest.lua", "os.execute('echo hi')", m2, err));

	// runaway manifests are stopped
	Manifest m3;
	CHECK(!ParseManifest("fxmanifest.lua", "while true do end", m3, err));
	CHECK(err.find("time limit") != std::string::npos);
}

TEST(manifest_load_prefers_fxmanifest)
{
	MemoryFileSource a;
	a.Add("__resource.lua", "resource_manifest_version 'x'\nclient_script 'old.lua'");
	Manifest m;
	std::string file, err;
	CHECK(LoadManifest(a, m, file, err));
	CHECK_EQ(file, std::string("__resource.lua"));
	CHECK(!m.isCfxV2);

	a.Add("fxmanifest.lua", "fx_version 'cerulean'");
	CHECK(LoadManifest(a, m, file, err));
	CHECK_EQ(file, std::string("fxmanifest.lua"));
	CHECK(m.isCfxV2);

	MemoryFileSource empty;
	CHECK(!LoadManifest(empty, m, file, err));
}

TEST(glob_matching)
{
	CHECK(GlobMatch("client/*.lua", "client/main.lua"));
	CHECK(!GlobMatch("client/*.lua", "client/sub/main.lua"));
	CHECK(GlobMatch("client/**.lua", "client/sub/main.lua"));
	CHECK(GlobMatch("**/*.lua", "a/b/c.lua"));
	CHECK(GlobMatch("**/*.lua", "c.lua"));
	CHECK(GlobMatch("file?.lua", "file1.lua"));
	CHECK(!GlobMatch("file?.lua", "file12.lua"));
	CHECK(!GlobMatch("*.lua", "main.js"));

	MemoryFileSource fs;
	fs.Add("client/b.lua", "");
	fs.Add("client/a.lua", "");
	fs.Add("client/x/c.lua", "");
	fs.Add("server.lua", "");
	auto r = ExpandFileEntry(fs, "client/*.lua");
	CHECK_EQ(r.size(), size_t(2));
	CHECK_EQ(r[0], std::string("client/a.lua"));
	CHECK_EQ(ExpandFileEntry(fs, "missing.lua").size(), size_t(1));
	CHECK_EQ(ExpandFileEntry(fs, "@other/file.lua")[0], std::string("@other/file.lua"));
}

TEST(safe_relative_paths)
{
	CHECK(IsSafeRelativePath("a/b.lua"));
	CHECK(!IsSafeRelativePath("../secret"));
	CHECK(!IsSafeRelativePath("a/../../b"));
	CHECK(!IsSafeRelativePath("/etc/passwd"));
	CHECK(!IsSafeRelativePath("C:\\windows"));
	CHECK(!IsSafeRelativePath(""));

	DiskFileSource disk(".");
	std::string out;
	CHECK(!disk.Read("../../etc/passwd", out));
}

// ---- msgpack -------------------------------------------------------------------

TEST(msgpack_roundtrip_values)
{
	mp::Writer w;
	w.Array(9).Nil().Bool(true).Int(5).Int(-20).Int(300000).Int(-5000000000LL).Double(1.5).Str(std::string(300, 'x'));
	w.Map(1).Str("k").Array(0);

	mp::Value v;
	std::string err;
	CHECK(mp::Decode(w.Data(), v, err));
	CHECK(v.type == mp::Value::Type::Array);
	CHECK_EQ(v.array.size(), size_t(9));
	CHECK(v.array[0].type == mp::Value::Type::Nil);
	CHECK(v.array[1].b);
	CHECK_EQ(v.array[2].i, 5);
	CHECK_EQ(v.array[3].i, -20);
	CHECK_EQ(v.array[4].i, 300000);
	CHECK_EQ(v.array[5].i, -5000000000LL);
	CHECK_EQ(v.array[6].d, 1.5);
	CHECK_EQ(v.array[7].s.size(), size_t(300));
	CHECK(v.array[8].type == mp::Value::Type::Map);
}

TEST(msgpack_rejects_malformed)
{
	mp::Value v;
	std::string err;
	CHECK(!mp::Decode(std::string("\x92\x01", 2), v, err)); // array of 2 with 1 element
	CHECK(!mp::Decode(std::string("\xdd\xff\xff\xff\xff", 5), v, err)); // huge array length
	CHECK(!mp::Decode(std::string("\xc1", 1), v, err)); // reserved byte
	CHECK(!mp::Decode(std::string("\x01\x02", 2), v, err)); // trailing data
}

// ---- runtime -------------------------------------------------------------------

TEST(runtime_runs_scripts_and_print)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "hello", { { "fxmanifest.lua", kManifest }, { "server.lua", "print('hello from', GetCurrentResourceName(), IsDuplicityVersion())" } });
	StartOk(mgr, "hello");
	CHECK(cap.Contains("hello from\thello\ttrue"));
	CHECK_EQ(std::string(ResourceStateName(mgr.Find("hello")->state)), std::string("started"));
}

TEST(runtime_script_errors_do_not_abort_start)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "broken", { { "fxmanifest.lua", "fx_version 'cerulean'\nserver_scripts { 'a.lua', 'b.lua', 'missing.lua' }" },
							  { "a.lua", "error('boom')" },
							  { "b.lua", "print('b ran')" } });
	StartOk(mgr, "broken");
	CHECK(cap.Contains("boom"));
	CHECK(cap.Contains("b ran"));
	CHECK(cap.Contains("could not open broken/missing.lua"));
}

TEST(runtime_shared_scripts_load_first)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "order", { { "fxmanifest.lua", "fx_version 'cerulean'\nserver_script 's.lua'\nshared_script 'shared.lua'\nclient_script 'c.lua'" },
							 { "s.lua", "print('server sees', Config.value)" },
							 { "shared.lua", "Config = { value = 42 }" },
							 { "c.lua", "print('client script must not run on server')" } });
	StartOk(mgr, "order");
	CHECK(cap.Contains("server sees\t42"));
	CHECK(!cap.Contains("must not run"));
}

TEST(runtime_events_local_and_cross_resource)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "listener", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
AddEventHandler('demo:hello', function(a, b, t)
	print(('got %s %s %s %s'):format(a, tostring(b), t.x, #t.list))
end)
)" } });
	AddMem(mgr, "sender", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
AddEventHandler('onResourceStart', function(name)
	if name == GetCurrentResourceName() then
		TriggerEvent('demo:hello', 'abc', nil, { x = 'y', list = { 1, 2, 3 } })
	end
end)
)" } });
	StartOk(mgr, "listener");
	StartOk(mgr, "sender");
	CHECK(cap.Contains("got abc nil y 3"));
}

TEST(runtime_net_events_require_registration)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "net", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
AddEventHandler('local:only', function() print('LOCAL ONLY RAN') end)
RegisterNetEvent('net:ok', function(msg) print('net ok from', source, msg) end)
)" } });
	StartOk(mgr, "net");

	mp::Writer w;
	w.Array(1).Str("hi");
	mgr.OnNetEvent("local:only", w.Data(), 7);
	mgr.OnNetEvent("net:ok", w.Data(), 7);
	CHECK(!cap.Contains("LOCAL ONLY RAN"));
	CHECK(cap.Contains("not safe for net"));
	CHECK(cap.Contains("net ok from\t7\thi"));
}

TEST(runtime_threads_and_wait)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "threads", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
local start = GetGameTimer()
CreateThread(function()
	print('thread started')
	Wait(50)
	print('thread resumed after', GetGameTimer() - start >= 50)
end)
local id = SetTimeout(20, function() print('timeout fired') end)
local id2 = SetTimeout(20, function() print('cleared timeout fired') end)
ClearTimeout(id2)
local ok, err = pcall(Wait, 10)
print('wait outside thread ok=', ok, err ~= nil)
)" } });
	StartOk(mgr, "threads");
	CHECK(!cap.Contains("thread started")); // CreateThread defers to the next tick
	CHECK(cap.Contains("wait outside thread ok=\tfalse\ttrue"));
	TickFor(mgr, 120);
	CHECK(cap.Contains("thread started"));
	CHECK(cap.Contains("thread resumed after\ttrue"));
	CHECK(cap.Contains("timeout fired"));
	CHECK(!cap.Contains("cleared timeout fired"));
}

TEST(runtime_event_handlers_can_wait)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "waiter", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
AddEventHandler('slow', function() print('slow begin'); Wait(30); print('slow end') end)
)" } });
	StartOk(mgr, "waiter");
	mgr.TriggerEventStrings("slow", {});
	CHECK(cap.Contains("slow begin"));
	CHECK(!cap.Contains("slow end"));
	TickFor(mgr, 80);
	CHECK(cap.Contains("slow end"));
}

TEST(runtime_exports_and_callbacks)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "provider", { { "fxmanifest.lua", "fx_version 'cerulean'\nserver_script 'server.lua'\nserver_export 'legacyAdd'" },
								{ "server.lua", R"(
exports('add', function(a, b) return a + b, 'sum' end)
exports('withCallback', function(cb) return cb(20) + 1 end)
exports('fails', function() error('provider failure') end)
exports('who', function() return GetInvokingResource() end)
function legacyAdd(a, b) return a + b end
)" } });
	AddMem(mgr, "consumer", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
local s, label = exports.provider:add(2, 3)
print('add', s, label)
print('legacy', exports['provider']:legacyAdd(4, 5))
print('callback', exports.provider:withCallback(function(x) return x * 2 end))
print('invoker', exports.provider:who())
local ok, err = pcall(function() return exports.provider:fails() end)
print('fails', ok, err:find('provider failure') ~= nil)
local ok2, err2 = pcall(function() return exports.provider:nope() end)
print('nope', ok2, err2:find('No such export nope') ~= nil)
local ok3, err3 = pcall(function() return exports.ghost:thing() end)
print('ghost', ok3)
)" } });
	StartOk(mgr, "provider");
	StartOk(mgr, "consumer");
	CHECK(cap.Contains("add\t5\tsum"));
	CHECK(cap.Contains("legacy\t9"));
	CHECK(cap.Contains("callback\t41"));
	CHECK(cap.Contains("invoker\tconsumer"));
	CHECK(cap.Contains("fails\tfalse\ttrue"));
	CHECK(cap.Contains("nope\tfalse\ttrue"));
	CHECK(cap.Contains("ghost\tfalse"));
}

TEST(runtime_commands)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "cmds", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
RegisterCommand('Greet', function(source, args, raw)
	print('greet', source, #args, args[1], raw)
end, false)
RegisterCommand('admin', function(source) print('admin ran', source) end, true)
)" } });
	StartOk(mgr, "cmds");

	std::string err;
	CHECK(mgr.ExecuteCommand("greet \"Jay Doe\" 2", 3, err));
	CHECK(cap.Contains("greet\t3\t2\tJay Doe\tgreet \"Jay Doe\" 2"));

	CHECK(!mgr.ExecuteCommand("admin", 3, err));
	CHECK(err.find("Access denied") != std::string::npos);
	CHECK(mgr.ExecuteCommand("admin", 0, err));
	CHECK(cap.Contains("admin ran\t0"));

	CHECK(!mgr.ExecuteCommand("unknown", 0, err));
	CHECK(err.find("No such command") != std::string::npos);

	CHECK(mgr.Stop("cmds"));
	CHECK(!mgr.HasCommand("greet"));
}

TEST(runtime_lifecycle_events_and_dependencies)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "base", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
AddEventHandler('onResourceStart', function(n) print('base saw start of', n) end)
AddEventHandler('onResourceStop', function(n) print('base saw stop of', n) end)
)" } });
	AddMem(mgr, "app", { { "fxmanifest.lua", "fx_version 'cerulean'\nserver_script 'server.lua'\ndependency 'base'" },
						   { "server.lua", "print('app running, base is', GetResourceState('base'))" } });
	AddMem(mgr, "needsghost", { { "fxmanifest.lua", "fx_version 'cerulean'\ndependency 'ghost'" } });
	AddMem(mgr, "cycleA", { { "fxmanifest.lua", "fx_version 'cerulean'\ndependency 'cycleB'" } });
	AddMem(mgr, "cycleB", { { "fxmanifest.lua", "fx_version 'cerulean'\ndependency 'cycleA'" } });

	StartOk(mgr, "app");
	CHECK(cap.Contains("app running, base is\tstarted"));
	CHECK(cap.Contains("base saw start of\tbase"));
	CHECK(cap.Contains("base saw start of\tapp"));

	std::string err;
	CHECK(!mgr.Start("needsghost", err));
	CHECK(err.find("ghost") != std::string::npos);
	CHECK(!mgr.Start("cycleA", err));
	CHECK(err.find("cycle") != std::string::npos);
	CHECK(mgr.Find("cycleA")->state == ResourceState::Stopped);

	CHECK(mgr.Stop("app"));
	CHECK(cap.Contains("base saw stop of\tapp"));
	CHECK_EQ(mgr.StartedNames().size(), size_t(1));
}

TEST(runtime_cancel_event)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "guard", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
AddEventHandler('onResourceStarting', function(n) if n == 'blocked' then CancelEvent() end end)
AddEventHandler('check', function() CancelEvent() end)
)" } });
	AddMem(mgr, "blocked", { { "fxmanifest.lua", kManifest }, { "server.lua", "print('blocked ran')" } });
	StartOk(mgr, "guard");

	std::string err;
	CHECK(!mgr.Start("blocked", err));
	CHECK(!cap.Contains("blocked ran"));
	CHECK(!mgr.TriggerEventStrings("check", {}));
}

TEST(runtime_stops_runaway_scripts)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	mgr.SetScriptBudgetMs(150);
	AddMem(mgr, "loop", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
CreateThread(function() while true do end end)
CreateThread(function() Wait(0) print('other thread still runs') end)
)" } });
	StartOk(mgr, "loop");
	TickFor(mgr, 400);
	CHECK(cap.Contains("execution budget"));
	CHECK(cap.Contains("other thread still runs"));
}

TEST(runtime_json_library)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "json", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
local s = json.encode({ name = 'jay', list = { 1, 2.5, true }, nested = { ok = false } })
local t = json.decode(s)
print('json', t.name, t.list[2], t.list[3], t.nested.ok, json.encode({}))
local v, err = json.decode('{bad')
print('bad json', v, err ~= nil)
print('unicode', json.decode('"\\u00e9\\ud83d\\ude00"') == 'é😀')
)" } });
	StartOk(mgr, "json");
	CHECK(cap.Contains("json\tjay\t2.5\ttrue\tfalse\t[]"));
	CHECK(cap.Contains("bad json\tnil\ttrue"));
	CHECK(cap.Contains("unicode\ttrue"));
}

TEST(runtime_client_sandbox)
{
	LogCapture cap;
	ResourceManager mgr(Side::Client);
	AddMem(mgr, "sbx", { { "fxmanifest.lua", "fx_version 'cerulean'\nclient_script 'c.lua'" }, { "c.lua", R"(
print('io', io, 'execute', os.execute, 'getenv', os.getenv, 'time', type(os.time()))
local fn = string.dump(function() return 1 end)
print('bytecode', load(fn))
print('text', load('return 7')())
print('side', IsDuplicityVersion(), type(TriggerServerEvent), type(TriggerClientEvent))
)" } });
	StartOk(mgr, "sbx");
	CHECK(cap.Contains("io\tnil\texecute\tnil\tgetenv\tnil\ttime\tnumber"));
	CHECK(cap.Contains("bytecode\tnil"));
	CHECK(cap.Contains("text\t7"));
	CHECK(cap.Contains("side\tfalse\tfunction\tnil"));
}

TEST(runtime_host_function_refs)
{
	LogCapture cap;
	ResourceManager mgr(Side::Server);
	AddMem(mgr, "hostref", { { "fxmanifest.lua", kManifest }, { "server.lua", R"(
AddEventHandler('withCb', function(cb) print('host returned', cb('ping')) end)
)" } });
	StartOk(mgr, "hostref");

	std::string received;
	auto id = mgr.CreateHostRef([&](const std::string& payload) {
		mp::Value v;
		std::string err;
		mp::Decode(payload, v, err);
		received = v.array.at(0).s;
		mp::Writer w;
		w.Array(1).Str("pong");
		return w.Data();
	});
	mp::Writer w;
	w.Array(1).FuncRef("__host", id);
	mgr.TriggerEvent("withCb", w.Data());
	CHECK_EQ(received, std::string("ping"));
	CHECK(cap.Contains("host returned\tpong"));
}
