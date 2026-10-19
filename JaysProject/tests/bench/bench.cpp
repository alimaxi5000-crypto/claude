// Micro-benchmarks for the V0.1 runtime. They establish a baseline only;
// no comparison with FiveM is made or implied.
#include <jays/log.h>
#include <jays/manifest.h>
#include <jays/protocol.h>
#include <jays/resource_manager.h>
#include <jays/serialization.h>

#include <chrono>
#include <cstdio>
#include <functional>
#include <string>

using namespace jays;
using Clock = std::chrono::steady_clock;

namespace
{
void Report(const char* name, int iterations, Clock::duration total)
{
	double sec = std::chrono::duration<double>(total).count();
	std::printf("%-44s %10d ops %10.2f us/op %12.0f ops/s\n", name, iterations, sec * 1e6 / iterations, iterations / sec);
}

void Bench(const char* name, int iterations, const std::function<void()>& fn)
{
	fn(); // warm-up
	auto start = Clock::now();
	for (int i = 0; i < iterations; i++)
	{
		fn();
	}
	Report(name, iterations, Clock::now() - start);
}

void AddMem(ResourceManager& mgr, const std::string& name, const std::string& manifest, const std::string& script)
{
	auto src = std::make_unique<MemoryFileSource>();
	src->Add("fxmanifest.lua", manifest);
	src->Add("server.lua", script);
	std::string err;
	if (!mgr.AddResource(name, std::move(src), err) || !mgr.Start(name, err))
	{
		std::fprintf(stderr, "setup failed: %s\n", err.c_str());
		std::exit(1);
	}
}
}

int main()
{
	log::SetQuiet(true);
	const std::string manifest = "fx_version 'cerulean'\ngame 'gta5'\nserver_script 'server.lua'\nshared_scripts { 'a.lua', 'b.lua' }\n";

	Bench("manifest parse (fxmanifest.lua)", 2000, [&] {
		Manifest m;
		std::string err;
		ParseManifest("fxmanifest.lua", manifest, m, err);
	});

	{
		ResourceManager mgr(Side::Server);
		auto src = std::make_unique<MemoryFileSource>();
		src->Add("fxmanifest.lua", manifest);
		src->Add("server.lua", "local t = {} for i = 1, 100 do t[i] = i end AddEventHandler('x', function() end)");
		std::string err;
		mgr.AddResource("cycle", std::move(src), err);
		Bench("resource start + stop (new Lua state)", 500, [&] {
			mgr.Start("cycle", err);
			mgr.Stop("cycle");
		});
	}

	ResourceManager mgr(Side::Server);
	AddMem(mgr, "receiver", manifest, R"(
local count = 0
AddEventHandler('bench:event', function(a, b, c) count = count + 1 end)
exports('add', function(a, b) return a + b end)
exports('echo', function(t) return t end)
)");
	AddMem(mgr, "sender", manifest, R"(
RegisterCommand('fire', function(_, args)
	local n = tonumber(args[1])
	for i = 1, n do TriggerEvent('bench:event', i, 'two', { x = 3 }) end
end, false)
RegisterCommand('exports', function(_, args)
	local n = tonumber(args[1])
	for i = 1, n do exports.receiver:add(i, 1) end
end, false)
RegisterCommand('bigexport', function(_, args)
	local n = tonumber(args[1])
	local t = {}
	for i = 1, 100 do t[i] = { id = i, name = 'item' .. i, value = i * 1.5 } end
	for i = 1, n do exports.receiver:echo(t) end
end, false)
)");

	std::string err;
	auto timed = [&](const char* name, const char* cmd, int n) {
		auto start = Clock::now();
		mgr.ExecuteCommand(std::string(cmd) + " " + std::to_string(n), 0, err);
		Report(name, n, Clock::now() - start);
	};

	timed("Lua TriggerEvent -> other resource (3 args)", "fire", 100000);
	timed("Lua export call (2 ints)", "exports", 100000);
	timed("Lua export call (100-element table both ways)", "bigexport", 5000);

	mp::Writer w;
	w.Array(3).Int(1).Str("two").Map(1).Str("x").Int(3);
	auto payload = w.Data();
	Bench("host TriggerEvent from C++ (net-style payload)", 100000, [&] { mgr.TriggerEvent("bench:event", payload); });

	std::string body(256, 'x');
	Bench("JNP frame encode + decode (256 B body)", 200000, [&] {
		proto::FrameDecoder dec;
		dec.Feed(proto::EncodeFrame(proto::MsgType::Event, body));
		proto::MsgType t;
		std::string out, e;
		dec.Next(t, out, e);
	});
	return 0;
}
