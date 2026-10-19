#include "client.h"

#include <jays/config.h>
#include <jays/json_writer.h>
#include <jays/log.h>

#include <chrono>
#include <iostream>
#include <map>
#include <random>

// Server discovery that works against FXServer and jays-server alike:
//  - UDP out-of-band "getinfo <challenge>" (FXServer: GetInfoOutOfBand.h, see EVIDENCE_LEDGER F-020)
//  - HTTP GET /info.json, /dynamic.json, /players.json (FXServer: InfoHttpHandler.cpp, F-021)
namespace jays::client
{
namespace
{
const std::string kOob("\xFF\xFF\xFF\xFF", 4);

bool QueryGetInfo(const net::Address& addr, int timeoutMs, std::map<std::string, std::string>& out, std::string& error)
{
	auto s = net::UdpOpen(error);
	if (s == net::kInvalidSocket)
	{
		return false;
	}

	std::mt19937_64 rng(std::random_device{}());
	std::string challenge = "jays" + std::to_string(rng() % 1000000000ULL);

	bool ok = false;
	for (int attempt = 0; attempt < 3 && !ok; attempt++)
	{
		net::UdpSendTo(s, kOob + "getinfo " + challenge, addr);
		std::vector<net::PollEntry> e{ { s, true, false } };
		if (net::Poll(e, timeoutMs / 3) <= 0)
		{
			continue;
		}

		std::string data;
		net::Address from;
		while (net::UdpRecvFrom(s, data, from))
		{
			if (data.compare(0, 4, kOob) != 0 || data.compare(4, 13, "infoResponse\n") != 0)
			{
				continue;
			}
			// "\key\value\key\value..."
			auto body = data.substr(17);
			std::vector<std::string> parts;
			size_t start = 0;
			while (start <= body.size())
			{
				auto pos = body.find('\\', start);
				parts.push_back(body.substr(start, pos == std::string::npos ? std::string::npos : pos - start));
				if (pos == std::string::npos) break;
				start = pos + 1;
			}
			for (size_t i = 1; i + 1 < parts.size(); i += 2)
			{
				out[parts[i]] = parts[i + 1];
			}
			if (out["challenge"] != challenge)
			{
				error = "challenge mismatch";
				out.clear();
				continue;
			}
			ok = true;
			break;
		}
	}

	net::Close(s);
	if (!ok && error.empty())
	{
		error = "no getinfo response";
	}
	return ok;
}

bool HttpGet(const net::Address& addr, const std::string& host, const std::string& path, int timeoutMs,
	std::string& body, std::string& error)
{
	auto s = net::TcpConnect(addr, timeoutMs, error);
	if (s == net::kInvalidSocket)
	{
		return false;
	}

	std::string req = "GET " + path + " HTTP/1.0\r\nHost: " + host + "\r\nUser-Agent: JaysProject-probe\r\nConnection: close\r\n\r\n";
	size_t written;
	net::Send(s, req.data(), req.size(), written);

	std::string response;
	auto deadline = std::chrono::steady_clock::now() + std::chrono::milliseconds(timeoutMs);
	bool closed = false;
	while (!closed && std::chrono::steady_clock::now() < deadline)
	{
		std::vector<net::PollEntry> e{ { s, true, false } };
		net::Poll(e, 50);
		if (e[0].readable || e[0].failed)
		{
			auto r = net::Recv(s, response);
			closed = r == net::IoResult::Closed || r == net::IoResult::Error;
		}
	}
	net::Close(s);

	auto split = response.find("\r\n\r\n");
	if (split == std::string::npos)
	{
		error = closed ? "malformed HTTP response" : "HTTP request timed out";
		return false;
	}
	auto statusLine = response.substr(0, response.find("\r\n"));
	if (statusLine.find(" 200") == std::string::npos)
	{
		error = "HTTP status: " + statusLine;
		return false;
	}
	body = response.substr(split + 4);
	return true;
}

std::string JsonOrString(const std::string& body)
{
	auto first = body.find_first_not_of(" \r\n\t");
	if (first != std::string::npos && (body[first] == '{' || body[first] == '['))
	{
		return body;
	}
	return json::Quote(body);
}
}

int RunProbe(const std::string& address, int timeoutMs)
{
	if (!net::Startup())
	{
		return kExitConnectFailed;
	}

	std::string host;
	int port;
	net::Address addr;
	std::string error;
	if (!SplitHostPort(address, host, port) || !net::Resolve(host, port, addr, error))
	{
		log::Error("probe", "invalid address " + address + (error.empty() ? "" : ": " + error));
		return kExitUsage;
	}

	std::string result = "{\"address\":" + json::Quote(addr.ToString());
	bool anyOk = false;

	std::map<std::string, std::string> info;
	std::string udpError;
	if (QueryGetInfo(addr, timeoutMs, info, udpError))
	{
		anyOk = true;
		std::string obj;
		for (auto& [k, v] : info)
		{
			obj += (obj.empty() ? "" : ",") + json::Quote(k) + ":" + json::Quote(v);
		}
		result += ",\"getinfo\":{" + obj + "}";
		log::Info("probe", "getinfo: " + info["hostname"] + " (" + info["gamename"] + ", " + info["clients"] + "/" +
							   info["sv_maxclients"] + " players)");
	}
	else
	{
		result += ",\"getinfo\":null,\"getinfoError\":" + json::Quote(udpError);
		log::Warn("probe", "getinfo failed: " + udpError);
	}

	for (const char* path : { "/info.json", "/dynamic.json", "/players.json" })
	{
		std::string body, httpError;
		std::string key = std::string(path).substr(1, std::string(path).find('.') - 1);
		if (HttpGet(addr, host, path, timeoutMs, body, httpError))
		{
			anyOk = true;
			result += "," + json::Quote(key) + ":" + JsonOrString(body);
			log::Info("probe", std::string(path) + ": " + std::to_string(body.size()) + " bytes");
		}
		else
		{
			result += "," + json::Quote(key) + ":null," + json::Quote(key + "Error") + ":" + json::Quote(httpError);
			log::Warn("probe", std::string(path) + " failed: " + httpError);
		}
	}

	result += "}";
	std::cout << result << std::endl;
	return anyOk ? kExitOk : kExitConnectFailed;
}
}
