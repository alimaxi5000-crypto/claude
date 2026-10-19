#include "client.h"

#include <jays/log.h>
#include <jays/version.h>

#include <csignal>
#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <random>
#include <sstream>

namespace
{
volatile std::sig_atomic_t g_stop = 0;

void OnSignal(int)
{
	g_stop = 1;
}

void Usage()
{
	std::cout << "Jays Project client " << jays::kVersion << " (headless prototype, no game integration)\n\n"
			  << "usage: jays-client [options]\n"
			  << "  --connect <host:port>    join a jays-server\n"
			  << "  --probe <host:port>      query server info (UDP getinfo + HTTP /info.json) and exit\n"
			  << "  --local-resources <dir>  run client resources from disk without a server\n"
			  << "  --name <name>            player name (default: Player)\n"
			  << "  --guid <id>              stable client id (default: random)\n"
			  << "  --exec <command>         run a client command once active (repeatable)\n"
			  << "  --quit-after <ms>        disconnect this long after becoming active\n"
			  << "  --timeout <ms>           connect / probe timeout (default 5000)\n"
			  << "  --log-format text|json   json is used by the launcher\n"
			  << "  --log-level debug|info|warn|error\n"
			  << "  --log-file <file>\n"
			  << "  --no-console             do not read commands from stdin\n"
			  << "  --version\n\n"
			  << "exit codes: 0 ok, 2 usage, 3 connect failed, 4 rejected, 5 disconnected, 6 protocol error\n";
}

std::string RandomGuid()
{
	std::mt19937_64 rng(std::random_device{}());
	std::ostringstream os;
	os << std::hex << rng();
	return os.str();
}
}

int main(int argc, char** argv)
{
	using namespace jays;

	client::Options opts;
	std::string probe;

	for (int i = 1; i < argc; i++)
	{
		std::string a = argv[i];
		auto next = [&]() -> std::string {
			if (i + 1 >= argc)
			{
				std::cerr << "missing value for " << a << "\n";
				std::exit(client::kExitUsage);
			}
			return argv[++i];
		};

		if (a == "--connect") opts.address = next();
		else if (a == "--probe") probe = next();
		else if (a == "--local-resources") opts.localResources = next();
		else if (a == "--name") opts.name = next();
		else if (a == "--guid") opts.guid = next();
		else if (a == "--exec") opts.execAfterActive.push_back(next());
		else if (a == "--quit-after") opts.quitAfterMs = std::atoi(next().c_str());
		else if (a == "--timeout") opts.connectTimeoutMs = std::max(100, std::atoi(next().c_str()));
		else if (a == "--log-format") log::SetFormat(next() == "json" ? log::Format::Json : log::Format::Text);
		else if (a == "--log-level")
		{
			log::Level lv;
			if (!log::ParseLevel(next(), lv)) { std::cerr << "invalid log level\n"; return client::kExitUsage; }
			log::SetMinLevel(lv);
		}
		else if (a == "--log-file")
		{
			auto f = next();
			if (!log::SetFile(f)) { std::cerr << "cannot open log file " << f << "\n"; return client::kExitUsage; }
		}
		else if (a == "--no-console") opts.consoleInput = false;
		else if (a == "--version") { std::cout << kVersion << "\n"; return 0; }
		else if (a == "--help" || a == "-h") { Usage(); return 0; }
		else { std::cerr << "unknown option " << a << "\n"; Usage(); return client::kExitUsage; }
	}

	if (!probe.empty())
	{
		return client::RunProbe(probe, opts.connectTimeoutMs);
	}

	if (opts.address.empty() && opts.localResources.empty())
	{
		Usage();
		return client::kExitUsage;
	}

	if (opts.guid.empty())
	{
		opts.guid = RandomGuid();
	}

	std::signal(SIGINT, OnSignal);
	std::signal(SIGTERM, OnSignal);
	opts.externalStop = &g_stop;

	log::Info("client", std::string(kProductName) + " client " + kVersion + " (headless; GTA V integration not implemented)");
	int code;
	{
		client::GameClient c(opts);
		code = c.Run();
	}
	// see server/src/main.cpp: avoid exit()-time deadlock with the stdin reader thread
	std::fflush(stdout);
	std::_Exit(code);
}
