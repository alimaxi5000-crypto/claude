#include "client.h"

#include <jays/config.h>
#include <jays/console_input.h>
#include <jays/log.h>
#include <jays/serialization.h>
#include <jays/version.h>

#include <algorithm>
#include <chrono>
#include <thread>

namespace jays::client
{
namespace
{
constexpr uint64_t kHandshakeTimeoutMs = 30000; // includes resource download and deferrals
constexpr uint64_t kInactivityTimeoutMs = 20000;
constexpr uint64_t kPingIntervalMs = 2000;
constexpr uint64_t kStatsIntervalMs = 5000;

// Server-originated events carry this source id (see EVIDENCE_LEDGER F-018).
constexpr int kServerSourceId = 65535;
}

const char* StateName(State s)
{
	switch (s)
	{
		case State::Idle: return "idle";
		case State::Connecting: return "connecting";
		case State::Handshaking: return "handshaking";
		case State::Downloading: return "downloading";
		case State::Loading: return "loading";
		case State::Active: return "active";
		case State::Disconnected: return "disconnected";
	}
	return "?";
}

GameClient::GameClient(Options opts) : m_opts(std::move(opts))
{
}

GameClient::~GameClient()
{
	m_resources.StopAll();
}

void GameClient::SetState(State s, const std::string& detail)
{
	m_state = s;
	m_stateSince = Now();
	// The launcher parses component "state": "<name>[: detail]".
	log::Info("state", std::string(StateName(s)) + (detail.empty() ? "" : ": " + detail));
}

void GameClient::Send(proto::MsgType type, const std::string& body)
{
	if (m_conn && !m_conn->IsClosed())
	{
		m_conn->Send(type, body);
	}
}

int GameClient::Run()
{
	if (!net::Startup())
	{
		log::Error("client", "network initialization failed");
		return kExitConnectFailed;
	}

	auto& hooks = m_resources.Hooks();
	hooks.localName = m_opts.name;
	hooks.getConvar = [](const std::string&, const std::string& fallback) { return fallback; };
	hooks.hostCommand = [this](const std::vector<std::string>& args, int) {
		if (args[0] == "disconnect" || args[0] == "quit")
		{
			Disconnect(args[0] == "quit" ? "Quit." : "Disconnected by user.");
			m_quit = true;
			return true;
		}
		return false;
	};

	if (!m_opts.localResources.empty())
	{
		return RunLocal();
	}

	hooks.sendToServer = [this](const std::string& name, const std::string& payload) {
		if (m_state != State::Active && m_state != State::Loading)
		{
			log::Warn("net", "TriggerServerEvent(" + name + ") while " + StateName(m_state) + ": dropped");
			return;
		}
		proto::Writer w;
		w.Str(name).I32(0).Str(payload);
		Send(proto::MsgType::Event, w.Data());
	};

	std::string error;
	if (!Connect(error))
	{
		SetState(State::Disconnected, "connection failed: " + error);
		return kExitConnectFailed;
	}

	ConsoleInput console;
	if (m_opts.consoleInput)
	{
		console.Start();
	}

	std::string inbound;
	while (!m_quit && !(m_opts.externalStop && *m_opts.externalStop))
	{
		std::vector<net::PollEntry> entries{ { m_conn->Socket(), true, m_conn->HasPendingOutput() } };
		net::Poll(entries, 10);

		if (entries[0].readable || entries[0].failed)
		{
			bool alive = m_conn->ReadAvailable(inbound);
			if (!inbound.empty())
			{
				m_lastReceive = Now();
				m_decoder.Feed(inbound);
				inbound.clear();

				proto::MsgType type;
				std::string body, perr;
				for (;;)
				{
					auto r = m_decoder.Next(type, body, perr);
					if (r == proto::FrameDecoder::Result::NeedMore) break;
					if (r == proto::FrameDecoder::Result::Invalid)
					{
						SetState(State::Disconnected, "protocol error: " + perr);
						m_exitCode = kExitProtocolError;
						m_quit = true;
						break;
					}
					HandleFrame(type, body);
					if (m_quit) break;
				}
			}
			if (!alive && !m_quit)
			{
				SetState(State::Disconnected, "connection closed by server");
				m_exitCode = kExitDisconnected;
				m_quit = true;
			}
		}

		if (m_conn->HasPendingOutput() && !m_conn->Flush())
		{
			SetState(State::Disconnected, "connection error");
			m_exitCode = kExitDisconnected;
			m_quit = true;
		}

		std::string line;
		while (m_opts.consoleInput && console.Poll(line))
		{
			HandleConsole(line);
		}

		m_resources.Tick();

		auto now = Now();
		if (m_state != State::Active && m_state != State::Disconnected && now - m_stateSince > kHandshakeTimeoutMs)
		{
			SetState(State::Disconnected, std::string("timed out while ") + StateName(m_state));
			m_exitCode = kExitDisconnected;
			m_quit = true;
		}
		else if (m_state == State::Active)
		{
			if (now - m_lastReceive > kInactivityTimeoutMs)
			{
				SetState(State::Disconnected, "server timed out");
				m_exitCode = kExitDisconnected;
				m_quit = true;
			}
			if (now - m_lastPing > kPingIntervalMs)
			{
				m_lastPing = now;
				proto::Writer w;
				w.U64(++m_pingNonce);
				Send(proto::MsgType::Ping, w.Data());
			}
			if (now - m_lastStats > kStatsIntervalMs)
			{
				m_lastStats = now;
				log::Info("stats", "ping=" + std::to_string(m_pingMs) + "ms resources=" +
									   std::to_string(m_resources.StartedNames().size()));
			}
			if (m_opts.quitAfterMs > 0 && now - m_activeSince > static_cast<uint64_t>(m_opts.quitAfterMs))
			{
				Disconnect("Quit.");
				m_quit = true;
			}
		}
	}

	if (m_state != State::Disconnected)
	{
		Disconnect("Quit.");
	}
	m_conn->Flush();
	m_resources.StopAll();
	return m_exitCode;
}

int GameClient::RunLocal()
{
	SetState(State::Loading, "local resources from " + m_opts.localResources);
	int found = m_resources.ScanDirectory(m_opts.localResources);
	for (auto& name : m_resources.Names())
	{
		std::string error;
		if (!m_resources.Start(name, error))
		{
			log::Error("resources", "could not start " + name + ": " + error);
		}
	}
	SetState(State::Active, "local mode, " + std::to_string(found) + " resource(s), no server");
	m_activeSince = Now();

	for (auto& cmd : m_opts.execAfterActive)
	{
		HandleConsole(cmd);
	}

	ConsoleInput console;
	if (m_opts.consoleInput)
	{
		console.Start();
	}

	while (!m_quit && !(m_opts.externalStop && *m_opts.externalStop))
	{
		std::string line;
		while (m_opts.consoleInput && console.Poll(line))
		{
			HandleConsole(line);
		}
		m_resources.Tick();
		if (m_opts.quitAfterMs > 0 && Now() - m_activeSince > static_cast<uint64_t>(m_opts.quitAfterMs))
		{
			m_quit = true;
		}
		std::this_thread::sleep_for(std::chrono::milliseconds(10));
	}

	m_resources.StopAll();
	SetState(State::Disconnected, "local session ended");
	return kExitOk;
}

bool GameClient::Connect(std::string& error)
{
	std::string host;
	int port;
	if (!SplitHostPort(m_opts.address, host, port))
	{
		error = "invalid address '" + m_opts.address + "' (expected host:port)";
		return false;
	}

	SetState(State::Connecting, host + ":" + std::to_string(port));
	net::Address addr;
	if (!net::Resolve(host, port, addr, error))
	{
		return false;
	}

	auto s = net::TcpConnect(addr, m_opts.connectTimeoutMs, error);
	if (s == net::kInvalidSocket)
	{
		return false;
	}

	m_conn = std::make_unique<proto::Connection>(s);
	m_conn->SendRaw(std::string_view(proto::kPreamble, sizeof(proto::kPreamble)));

	proto::Writer w;
	w.U32(kProtocolVersion).Str(m_opts.name).Str(m_opts.guid).Str(kVersion);
	m_conn->Send(proto::MsgType::Hello, w.Data());
	m_conn->Flush();
	m_lastReceive = Now();
	SetState(State::Handshaking, "connected to " + addr.ToString());
	return true;
}

void GameClient::HandleFrame(proto::MsgType type, const std::string& body)
{
	proto::Reader r(body);
	switch (type)
	{
		case proto::MsgType::Welcome:
		{
			m_netId = static_cast<int>(r.U32());
			m_serverName = r.Str();
			m_expectedResources = r.U32();
			if (!r.Ok() || m_state != State::Handshaking)
			{
				break;
			}
			m_resources.Hooks().localServerId = m_netId;
			SetState(State::Downloading, "server \"" + m_serverName + "\" assigned id " + std::to_string(m_netId) + ", " +
											 std::to_string(m_expectedResources) + " resource(s)");
			return;
		}

		case proto::MsgType::Reject:
		{
			auto reason = r.Str();
			SetState(State::Disconnected, "rejected: " + reason);
			m_exitCode = kExitRejected;
			m_quit = true;
			return;
		}

		case proto::MsgType::ResourceFile:
		{
			auto res = r.Str();
			auto path = r.Str();
			auto content = r.Str();
			if (!r.Ok() || m_state != State::Downloading)
			{
				break;
			}
			if (!m_pending.count(res))
			{
				m_pending[res] = std::make_unique<MemoryFileSource>();
				m_pendingOrder.push_back(res);
			}
			m_pending[res]->Add(path, std::move(content));
			return;
		}

		case proto::MsgType::ResourcesDone:
			if (m_state != State::Downloading)
			{
				break;
			}
			FinishLoading();
			return;

		case proto::MsgType::Activated:
			if (m_state != State::Loading)
			{
				break;
			}
			SetState(State::Active, "joined as id " + std::to_string(m_netId));
			m_activeSince = m_lastStats = Now();
			for (auto& cmd : m_opts.execAfterActive)
			{
				HandleConsole(cmd);
			}
			return;

		case proto::MsgType::Event:
		{
			auto name = r.Str();
			r.I32();
			auto payload = r.Str();
			if (!r.Ok())
			{
				break;
			}
			if (name == "__jays:deferralUpdate")
			{
				mp::Value v;
				std::string err;
				if (mp::Decode(payload, v, err) && !v.array.empty() && v.array[0].type == mp::Value::Type::String)
				{
					log::Info("connect", "server: " + v.array[0].s);
				}
				return;
			}
			if (name == "jays:serverMessage")
			{
				mp::Value v;
				std::string err;
				if (mp::Decode(payload, v, err) && !v.array.empty() && v.array[0].type == mp::Value::Type::String)
				{
					log::Info("chat", "[server] " + v.array[0].s);
				}
			}
			m_resources.OnNetEvent(name, payload, kServerSourceId);
			return;
		}

		case proto::MsgType::Ping:
			Send(proto::MsgType::Pong, body);
			return;

		case proto::MsgType::Pong:
		{
			auto nonce = r.U64();
			if (r.Ok() && nonce == m_pingNonce)
			{
				m_pingMs = static_cast<int>(Now() - m_lastPing);
			}
			return;
		}

		case proto::MsgType::Disconnect:
		{
			auto reason = r.Str();
			SetState(State::Disconnected, "disconnected by server: " + reason);
			m_exitCode = kExitDisconnected;
			m_quit = true;
			return;
		}

		default:
			break;
	}

	log::Warn("net", std::string("unexpected or malformed ") + proto::MsgTypeName(type) + " while " + StateName(m_state));
	Disconnect("Protocol error.");
	m_exitCode = kExitProtocolError;
	m_quit = true;
}

void GameClient::FinishLoading()
{
	SetState(State::Loading, std::to_string(m_pendingOrder.size()) + " resource(s) received");
	if (m_pendingOrder.size() != m_expectedResources)
	{
		log::Warn("resources", "server announced " + std::to_string(m_expectedResources) + " resource(s) but sent " +
								   std::to_string(m_pendingOrder.size()));
	}

	for (auto& name : m_pendingOrder)
	{
		std::string error;
		if (!m_resources.AddResource(name, std::move(m_pending[name]), error))
		{
			log::Error("resources", "invalid resource " + name + " from server: " + error);
		}
	}
	for (auto& name : m_pendingOrder)
	{
		std::string error;
		if (m_resources.Find(name) && !m_resources.Start(name, error))
		{
			log::Error("resources", "could not start " + name + ": " + error);
		}
	}
	m_pending.clear();
	m_pendingOrder.clear();
	Send(proto::MsgType::ClientReady, "");
}

void GameClient::HandleConsole(const std::string& raw)
{
	std::string line = raw;
	if (!line.empty() && line[0] == '/')
	{
		line.erase(0, 1);
	}
	if (line.find_first_not_of(" \t") == std::string::npos)
	{
		return;
	}

	log::Info("console", "> " + line);
	std::string error;
	if (!m_resources.ExecuteCommand(line, 0, error))
	{
		log::Warn("console", error);
	}
}

void GameClient::Disconnect(const std::string& reason)
{
	if (m_conn && !m_conn->IsClosed() && m_state != State::Disconnected)
	{
		proto::Writer w;
		w.Str(reason);
		m_conn->Send(proto::MsgType::Disconnect, w.Data());
		m_conn->Flush();
	}
	if (m_state != State::Disconnected)
	{
		SetState(State::Disconnected, reason);
	}
}
}
