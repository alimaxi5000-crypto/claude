#pragma once

#include <map>
#include <string>
#include <string_view>
#include <vector>

namespace jays
{
// Splits a console/config line into arguments. Supports "double quoted"
// arguments and strips `#` / `//` comments outside of quotes.
std::vector<std::string> TokenizeCommand(std::string_view line);

// A server.cfg compatible configuration (subset of the FXServer syntax).
struct ServerConfig
{
	std::map<std::string, std::string> convars;
	std::vector<std::string> resources; // from `ensure` / `start`, in order
	std::string tcpEndpoint = "0.0.0.0:30120";
	std::string udpEndpoint = "0.0.0.0:30120";
	std::vector<std::string> warnings;

	std::string Get(const std::string& name, const std::string& fallback = "") const;
	int GetInt(const std::string& name, int fallback) const;
};

// Parses config text. `exec` lines are resolved relative to baseDir.
// Returns false with `error` set only for fatal problems (unreadable exec file
// or recursion); unknown commands become warnings.
bool ParseServerConfig(std::string_view text, const std::string& baseDir, ServerConfig& out, std::string& error,
	int depth = 0);

bool LoadServerConfig(const std::string& path, ServerConfig& out, std::string& error);

// "host:port" -> parts. Port defaults to `defaultPort` when omitted.
bool SplitHostPort(std::string_view text, std::string& host, int& port, int defaultPort = 30120);
}
