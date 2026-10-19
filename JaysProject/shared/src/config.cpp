#include <jays/config.h>

#include <charconv>
#include <filesystem>
#include <fstream>
#include <sstream>

namespace jays
{
std::vector<std::string> TokenizeCommand(std::string_view line)
{
	std::vector<std::string> out;
	std::string cur;
	bool inQuotes = false;
	bool hasToken = false;

	for (size_t i = 0; i < line.size(); i++)
	{
		char c = line[i];

		if (inQuotes)
		{
			if (c == '"')
			{
				inQuotes = false;
			}
			else
			{
				cur += c;
			}
			continue;
		}

		if (c == '#' || (c == '/' && i + 1 < line.size() && line[i + 1] == '/'))
		{
			break;
		}

		if (c == '"')
		{
			inQuotes = true;
			hasToken = true;
		}
		else if (c == ' ' || c == '\t' || c == '\r' || c == '\n')
		{
			if (hasToken)
			{
				out.push_back(cur);
				cur.clear();
				hasToken = false;
			}
		}
		else
		{
			cur += c;
			hasToken = true;
		}
	}

	if (hasToken)
	{
		out.push_back(cur);
	}

	return out;
}

std::string ServerConfig::Get(const std::string& name, const std::string& fallback) const
{
	auto it = convars.find(name);
	return it == convars.end() ? fallback : it->second;
}

int ServerConfig::GetInt(const std::string& name, int fallback) const
{
	auto value = Get(name);
	int out = fallback;
	auto res = std::from_chars(value.data(), value.data() + value.size(), out);
	return (res.ec == std::errc{} && res.ptr == value.data() + value.size()) ? out : fallback;
}

bool ParseServerConfig(std::string_view text, const std::string& baseDir, ServerConfig& out, std::string& error,
	int depth)
{
	if (depth > 8)
	{
		error = "exec recursion too deep";
		return false;
	}

	std::istringstream stream{ std::string(text) };
	std::string line;
	int lineNo = 0;

	while (std::getline(stream, line))
	{
		lineNo++;
		auto args = TokenizeCommand(line);
		if (args.empty())
		{
			continue;
		}

		const auto& cmd = args[0];
		auto warn = [&](const std::string& msg) {
			out.warnings.push_back("line " + std::to_string(lineNo) + ": " + msg);
		};

		if (cmd == "set" || cmd == "sets" || cmd == "setr")
		{
			if (args.size() < 3)
			{
				warn(cmd + " requires a name and a value");
				continue;
			}
			out.convars[args[1]] = args[2];
		}
		else if (cmd == "ensure" || cmd == "start")
		{
			if (args.size() < 2)
			{
				warn(cmd + " requires a resource name");
				continue;
			}
			out.resources.push_back(args[1]);
		}
		else if (cmd == "stop")
		{
			if (args.size() >= 2)
			{
				std::erase(out.resources, args[1]);
			}
		}
		else if (cmd == "endpoint_add_tcp")
		{
			if (args.size() >= 2) out.tcpEndpoint = args[1];
		}
		else if (cmd == "endpoint_add_udp")
		{
			if (args.size() >= 2) out.udpEndpoint = args[1];
		}
		else if (cmd == "exec")
		{
			if (args.size() < 2)
			{
				warn("exec requires a file name");
				continue;
			}
			auto path = (std::filesystem::path(baseDir) / args[1]).string();
			std::ifstream f(path, std::ios::binary);
			if (!f)
			{
				error = "could not open exec file " + path;
				return false;
			}
			std::stringstream ss;
			ss << f.rdbuf();
			if (!ParseServerConfig(ss.str(), std::filesystem::path(path).parent_path().string(), out, error, depth + 1))
			{
				return false;
			}
		}
		else if (args.size() == 2)
		{
			// FXServer treats a convar name used as a command as an assignment
			// (e.g. `sv_hostname "My server"`); mirror that.
			out.convars[cmd] = args[1];
		}
		else
		{
			warn("unsupported command '" + cmd + "' ignored");
		}
	}

	return true;
}

bool LoadServerConfig(const std::string& path, ServerConfig& out, std::string& error)
{
	std::ifstream f(path, std::ios::binary);
	if (!f)
	{
		error = "could not open config file " + path;
		return false;
	}

	std::stringstream ss;
	ss << f.rdbuf();
	return ParseServerConfig(ss.str(), std::filesystem::path(path).parent_path().string(), out, error);
}

bool SplitHostPort(std::string_view text, std::string& host, int& port, int defaultPort)
{
	auto colon = text.rfind(':');
	if (colon == std::string_view::npos)
	{
		host = std::string(text);
		port = defaultPort;
		return !host.empty();
	}

	host = std::string(text.substr(0, colon));
	auto portText = text.substr(colon + 1);
	auto res = std::from_chars(portText.data(), portText.data() + portText.size(), port);
	if (res.ec != std::errc{} || res.ptr != portText.data() + portText.size() || port <= 0 || port > 65535)
	{
		return false;
	}
	return !host.empty();
}
}
