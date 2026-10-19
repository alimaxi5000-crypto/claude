#include "server.h"

#include <jays/log.h>
#include <jays/version.h>

#include <csignal>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <iostream>

namespace
{
volatile std::sig_atomic_t g_stop = 0;

void OnSignal(int)
{
	g_stop = 1;
}

void Usage()
{
	std::cout << "Jays Project server " << jays::kVersion << "\n\n"
			  << "usage: jays-server [options]\n"
			  << "  --config <file>        server.cfg-style configuration (default: server.cfg)\n"
			  << "  --resources <dir>      resource directory (default: <config dir>/resources)\n"
			  << "  --endpoint <host:port> override endpoint_add_tcp/udp\n"
			  << "  --log-format text|json\n"
			  << "  --log-level debug|info|warn|error\n"
			  << "  --log-file <file>      also append logs to a file\n"
			  << "  --no-console           do not read commands from stdin\n"
			  << "  --version\n";
}
}

int main(int argc, char** argv)
{
	using namespace jays;

	server::Options opts;
	opts.configPath = "server.cfg";

	for (int i = 1; i < argc; i++)
	{
		std::string a = argv[i];
		auto next = [&]() -> std::string {
			if (i + 1 >= argc)
			{
				std::cerr << "missing value for " << a << "\n";
				std::exit(2);
			}
			return argv[++i];
		};

		if (a == "--config") opts.configPath = next();
		else if (a == "--resources") opts.resourcesDir = next();
		else if (a == "--endpoint") opts.endpointOverride = next();
		else if (a == "--log-format") log::SetFormat(next() == "json" ? log::Format::Json : log::Format::Text);
		else if (a == "--log-level")
		{
			log::Level lv;
			if (!log::ParseLevel(next(), lv)) { std::cerr << "invalid log level\n"; return 2; }
			log::SetMinLevel(lv);
		}
		else if (a == "--log-file")
		{
			auto f = next();
			if (!log::SetFile(f)) { std::cerr << "cannot open log file " << f << "\n"; return 2; }
		}
		else if (a == "--no-console") opts.consoleInput = false;
		else if (a == "--version") { std::cout << kVersion << "\n"; return 0; }
		else if (a == "--help" || a == "-h") { Usage(); return 0; }
		else { std::cerr << "unknown option " << a << "\n"; Usage(); return 2; }
	}

	std::signal(SIGINT, OnSignal);
	std::signal(SIGTERM, OnSignal);
	opts.externalStop = &g_stop;

	int code;
	{
		server::GameServer server(opts);
		std::string error;
		if (!server.Init(error))
		{
			log::Error("server", "startup failed: " + error);
			code = 1;
		}
		else
		{
			code = server.Run();
		}
	}

	// The stdin reader thread may be blocked inside std::getline holding the
	// stdio lock, which would deadlock exit()'s stream cleanup. Everything
	// that matters has been destroyed above, so terminate directly.
	std::fflush(stdout);
	std::_Exit(code);
}
