#include "server.h"

#include <jays/console_input.h>
#include <jays/json_writer.h>
#include <jays/log.h>
#include <jays/serialization.h>
#include <jays/version.h>

#include <algorithm>
#include <filesystem>
#include <memory>
#include <optional>
#include <sstream>

namespace fs = std::filesystem;

namespace jays::server
{
namespace
{
constexpr uint64_t kHandshakeTimeoutMs = 10000;
constexpr uint64_t kDeferralTimeoutMs = 60000;
constexpr uint64_t kClientTimeoutMs = 20000;
constexpr uint64_t kPingIntervalMs = 2000;
constexpr uint64_t kClosingGraceMs = 2000;
constexpr size_t kMaxHttpRequest = 8192;
constexpr size_t kMaxEventName = 256;
constexpr size_t kMaxEventPayload = 1024 * 1024;
constexpr int kMaxEventsPerSecond = 200;

const char* kOobPrefix = "\xFF\xFF\xFF\xFF";

std::string SanitizeName(const std::string& raw)
{
	std::string out;
	for (unsigned char c : raw)
	{
		if (c >= 0x20 && c != 0x7f)
		{
			out += static_cast<char>(c);
		}
	}
	// trim
	auto b = out.find_first_not_of(' ');
	auto e = out.find_last_not_of(' ');
	out = b == std::string::npos ? "" : out.substr(b, e - b + 1);
	if (out.size() > 32)
	{
		out.resize(32);
	}
	return out;
}

std::string PackStrings(std::initializer_list<std::string> args)
{
	mp::Writer w;
	w.Array(static_cast<uint32_t>(args.size()));
	for (auto& a : args)
	{
		w.Str(a);
	}
	return w.Data();
}

// First argument of a payload as a string, if present.
std::optional<std::string> FirstStringArg(const std::string& payload)
{
	mp::Value v;
	std::string err;
	if (!mp::Decode(payload, v, err) || v.type != mp::Value::Type::Array || v.array.empty() ||
		v.array[0].type != mp::Value::Type::String)
	{
		return std::nullopt;
	}
	return v.array[0].s;
}

std::string EmptyResult()
{
	return mp::Writer().Array(0).Data();
}
}

const char* ConnStateName(ConnState s)
{
	switch (s)
	{
		case ConnState::Sniffing: return "sniffing";
		case ConnState::Http: return "http";
		case ConnState::Handshaking: return "handshaking";
		case ConnState::Deferred: return "deferred";
		case ConnState::Loading: return "loading";
		case ConnState::Active: return "active";
		case ConnState::Closing: return "closing";
	}
	return "?";
}

GameServer::GameServer(Options opts) : m_opts(std::move(opts))
{
}

GameServer::~GameServer()
{
	m_resources.StopAll();
	m_clients.clear();
	net::Close(m_listener);
	net::Close(m_udp);
}

bool GameServer::Init(std::string& error)
{
	if (!net::Startup())
	{
		error = "network initialization failed";
		return false;
	}

	if (!m_opts.configPath.empty())
	{
		if (!LoadServerConfig(m_opts.configPath, m_cfg, error))
		{
			return false;
		}
		for (auto& w : m_cfg.warnings)
		{
			log::Warn("config", w);
		}
		log::Info("config", "loaded " + m_opts.configPath);
	}

	if (!m_opts.endpointOverride.empty())
	{
		m_cfg.tcpEndpoint = m_cfg.udpEndpoint = m_opts.endpointOverride;
	}

	std::string host;
	int port;
	if (!SplitHostPort(m_cfg.tcpEndpoint, host, port))
	{
		error = "invalid endpoint '" + m_cfg.tcpEndpoint + "'";
		return false;
	}

	net::Address addr;
	if (!net::Resolve(host, port, addr, error))
	{
		return false;
	}

	m_listener = net::TcpListen(addr, error);
	if (m_listener == net::kInvalidSocket)
	{
		return false;
	}

	std::string udpHost;
	int udpPort;
	net::Address udpAddr;
	std::string udpError;
	if (SplitHostPort(m_cfg.udpEndpoint, udpHost, udpPort) && net::Resolve(udpHost, udpPort, udpAddr, udpError))
	{
		m_udp = net::UdpBind(udpAddr, udpError);
	}
	if (m_udp == net::kInvalidSocket)
	{
		log::Warn("net", "UDP getinfo responder disabled: " + udpError);
	}

	log::Info("net", "listening on tcp " + addr.ToString() + (m_udp != net::kInvalidSocket ? " and udp " + udpAddr.ToString() : ""));

	InstallHooks();

	std::string resourcesDir = m_opts.resourcesDir;
	if (resourcesDir.empty())
	{
		resourcesDir = (fs::path(m_opts.configPath).parent_path() / "resources").string();
	}
	m_opts.resourcesDir = resourcesDir;
	int found = m_resources.ScanDirectory(resourcesDir);
	log::Info("resources", "found " + std::to_string(found) + " resource(s) in " + resourcesDir);

	for (auto& name : m_cfg.resources)
	{
		std::string startError;
		if (!m_resources.Start(name, startError))
		{
			log::Error("resources", "could not start " + name + ": " + startError);
		}
	}

	return true;
}

void GameServer::InstallHooks()
{
	auto& h = m_resources.Hooks();

	h.sendToClient = [this](const std::string& name, int target, const std::string& payload) {
		proto::Writer w;
		w.Str(name).I32(target).Str(payload);
		int sent = 0;
		for (auto& c : m_clients)
		{
			if (IsInSession(*c) && (target == -1 || c->netId == target))
			{
				c->conn->Send(proto::MsgType::Event, w.Data());
				sent++;
			}
		}
		if (sent == 0 && target != -1)
		{
			log::Debug("net", "TriggerClientEvent(" + name + "): player " + std::to_string(target) + " is not active");
		}
	};

	h.getPlayers = [this] { return ActivePlayerIds(); };

	h.getPlayer = [this](int id) -> std::optional<PlayerInfo> {
		auto* c = FindByNetId(id);
		if (!c || !c->everAccepted)
		{
			return std::nullopt;
		}
		return PlayerInfo{ c->netId, c->name, c->peer.ToString(), c->pingMs, c->identifiers };
	};

	h.dropPlayer = [this](int id, const std::string& reason) {
		if (auto* c = FindByNetId(id))
		{
			Drop(*c, reason, true);
		}
	};

	h.getConvar = [this](const std::string& name, const std::string& fallback) { return m_cfg.Get(name, fallback); };

	h.hostCommand = [this](const std::vector<std::string>& args, int source) { return HostCommand(args, source); };
}

int GameServer::Run()
{
	ConsoleInput console;
	if (m_opts.consoleInput)
	{
		console.Start();
	}

	log::Info("server", std::string(kProductName) + " server " + kVersion + " ready (type 'help' for commands)");

	while (!m_stopRequested && !(m_opts.externalStop && *m_opts.externalStop))
	{
		Poll(10);

		std::string line;
		while (m_opts.consoleInput && console.Poll(line))
		{
			if (line.empty())
			{
				continue;
			}
			std::string error;
			if (!m_resources.ExecuteCommand(line, 0, error))
			{
				log::Warn("console", error);
			}
		}

		m_resources.Tick();

		if (Now() - m_lastMaintenance >= 100)
		{
			m_lastMaintenance = Now();
			Maintenance();
		}
	}

	log::Info("server", "shutting down");
	for (auto& c : m_clients)
	{
		if (c->state != ConnState::Closing && c->everAccepted)
		{
			Drop(*c, "Server shutting down.", true);
		}
		c->conn->Flush();
	}
	m_resources.StopAll();
	return 0;
}

void GameServer::Poll(int timeoutMs)
{
	std::vector<net::PollEntry> entries;
	entries.push_back({ m_listener, true, false });
	if (m_udp != net::kInvalidSocket)
	{
		entries.push_back({ m_udp, true, false });
	}
	size_t clientBase = entries.size();
	for (auto& c : m_clients)
	{
		entries.push_back({ c->conn->Socket(), true, c->conn->HasPendingOutput() });
	}

	if (net::Poll(entries, timeoutMs) < 0)
	{
		log::Error("net", "poll failed: " + net::LastErrorString());
		return;
	}

	if (entries[0].readable)
	{
		AcceptClients();
	}
	if (m_udp != net::kInvalidSocket && entries[1].readable)
	{
		HandleUdp();
	}

	// m_clients may grow during this loop (accept happened above), only visit polled ones
	for (size_t i = 0; i < entries.size() - clientBase && i < m_clients.size(); i++)
	{
		auto& c = *m_clients[i];
		auto& e = entries[clientBase + i];
		if (c.conn->IsClosed())
		{
			continue;
		}

		if (e.readable || e.failed)
		{
			bool alive = c.conn->ReadAvailable(c.inbound);
			if (!c.inbound.empty())
			{
				c.lastReceive = Now();
				ProcessInbound(c);
			}
			if (!alive && !c.conn->IsClosed())
			{
				if (c.state != ConnState::Closing)
				{
					Drop(c, "Connection closed by client.", false);
				}
				c.conn->Close();
			}
		}
	}

	for (auto& c : m_clients)
	{
		if (!c->conn->IsClosed() && c->conn->HasPendingOutput() && !c->conn->Flush())
		{
			if (c->state != ConnState::Closing)
			{
				Drop(*c, "Connection error.", false);
			}
			c->conn->Close();
		}
	}
}

void GameServer::AcceptClients()
{
	for (;;)
	{
		net::Address peer;
		auto s = net::TcpAccept(m_listener, peer);
		if (s == net::kInvalidSocket)
		{
			return;
		}
		auto c = std::make_unique<ClientConn>();
		c->conn = std::make_unique<proto::Connection>(s);
		c->peer = peer;
		c->connectedAt = c->lastReceive = Now();
		log::Debug("net", "accepted tcp connection from " + peer.ToString());
		m_clients.push_back(std::move(c));
	}
}

void GameServer::HandleUdp()
{
	std::string data;
	net::Address from;
	int budget = 64;
	while (budget-- > 0 && net::UdpRecvFrom(m_udp, data, from))
	{
		if (data.size() < 12 || data.compare(0, 4, kOobPrefix) != 0)
		{
			continue;
		}
		auto body = data.substr(4);
		if (body.compare(0, 8, "getinfo ") != 0 && body != "getinfo")
		{
			continue;
		}
		std::string challenge = body.size() > 8 ? body.substr(8) : "";
		challenge = challenge.substr(0, challenge.find_first_of(" \n"));
		if (challenge.size() > 64)
		{
			continue;
		}
		net::UdpSendTo(m_udp, std::string(kOobPrefix) + GetInfoResponse(challenge), from);
	}
}

void GameServer::ProcessInbound(ClientConn& c)
{
	if (c.state == ConnState::Sniffing)
	{
		HandleSniff(c);
	}
	if (c.state == ConnState::Http)
	{
		HandleHttp(c);
		return;
	}
	if (c.state == ConnState::Sniffing || c.state == ConnState::Closing)
	{
		return;
	}

	if (!c.inbound.empty())
	{
		c.decoder.Feed(c.inbound);
		c.inbound.clear();
	}

	proto::MsgType type;
	std::string body, error;
	for (;;)
	{
		auto r = c.decoder.Next(type, body, error);
		if (r == proto::FrameDecoder::Result::NeedMore)
		{
			break;
		}
		if (r == proto::FrameDecoder::Result::Invalid)
		{
			log::Warn("net", c.peer.ToString() + ": protocol error: " + error);
			Drop(c, "Protocol error.", true);
			break;
		}
		HandleFrame(c, type, body);
		if (c.state == ConnState::Closing)
		{
			break;
		}
	}
}

void GameServer::HandleSniff(ClientConn& c)
{
	if (c.inbound.size() >= sizeof(proto::kPreamble) &&
		c.inbound.compare(0, sizeof(proto::kPreamble), proto::kPreamble, sizeof(proto::kPreamble)) == 0)
	{
		c.inbound.erase(0, sizeof(proto::kPreamble));
		c.state = ConnState::Handshaking;
		return;
	}

	for (const char* method : { "GET ", "POST ", "HEAD " })
	{
		std::string m(method);
		if (c.inbound.size() >= m.size() && c.inbound.compare(0, m.size(), m) == 0)
		{
			c.state = ConnState::Http;
			return;
		}
	}

	// still a possible prefix of the preamble or a method? keep waiting
	std::string_view pre(proto::kPreamble, sizeof(proto::kPreamble));
	if (c.inbound.size() < pre.size() && pre.substr(0, c.inbound.size()) == c.inbound)
	{
		return;
	}
	if (c.inbound.size() < 5)
	{
		bool maybeHttp = false;
		for (std::string m : { "GET ", "POST ", "HEAD " })
		{
			maybeHttp = maybeHttp || m.compare(0, c.inbound.size(), c.inbound) == 0;
		}
		if (maybeHttp)
		{
			return;
		}
	}

	log::Debug("net", c.peer.ToString() + ": unrecognized protocol, closing");
	c.state = ConnState::Closing;
	c.conn->Close();
}

void GameServer::HandleHttp(ClientConn& c)
{
	auto end = c.inbound.find("\r\n\r\n");
	if (end == std::string::npos)
	{
		if (c.inbound.size() > kMaxHttpRequest)
		{
			c.state = ConnState::Closing;
			c.conn->Close();
		}
		return;
	}

	std::istringstream req(c.inbound.substr(0, end));
	std::string method, path, version;
	req >> method >> path >> version;
	path = path.substr(0, path.find('?'));

	int status = 200;
	std::string body;
	if (method != "GET" && method != "HEAD")
	{
		status = 405;
		body = R"({"error":"method not allowed"})";
	}
	else if (path == "/info.json")
		body = InfoJson();
	else if (path == "/players.json")
		body = PlayersJson();
	else if (path == "/dynamic.json")
		body = DynamicJson();
	else
	{
		status = 404;
		body = R"({"error":"not found"})";
	}

	std::string statusText = status == 200 ? "OK" : status == 404 ? "Not Found" : "Method Not Allowed";
	std::string response = "HTTP/1.1 " + std::to_string(status) + " " + statusText +
	                       "\r\nContent-Type: application/json\r\nContent-Length: " + std::to_string(body.size()) +
	                       "\r\nConnection: close\r\nServer: JaysServer/" + kVersion + "\r\n\r\n" +
	                       (method == "HEAD" ? "" : body);
	c.conn->SendRaw(response);
	c.inbound.clear();
	c.state = ConnState::Closing;
	c.connectedAt = Now();
	log::Debug("http", c.peer.ToString() + " " + method + " " + path + " -> " + std::to_string(status));
}

void GameServer::HandleFrame(ClientConn& c, proto::MsgType type, const std::string& body)
{
	if (c.state == ConnState::Handshaking && type != proto::MsgType::Hello)
	{
		Drop(c, std::string("Unexpected ") + proto::MsgTypeName(type) + " before handshake.", true);
		return;
	}

	switch (type)
	{
		case proto::MsgType::Hello:
			if (c.state != ConnState::Handshaking)
			{
				Drop(c, "Unexpected handshake.", true);
				return;
			}
			HandleHello(c, body);
			return;

		case proto::MsgType::ClientReady:
			if (c.state != ConnState::Loading)
			{
				Drop(c, "Unexpected ClientReady.", true);
				return;
			}
			c.state = ConnState::Active;
			c.conn->Send(proto::MsgType::Activated, "");
			log::Info("server", "Player " + c.name + " (id " + std::to_string(c.netId) + ") joined");
			m_resources.TriggerEventStrings("playerJoining", { std::to_string(c.netId) },
				"internal-net:" + std::to_string(c.netId));
			return;

		case proto::MsgType::Event:
		{
			// Loading clients may already send events from onClientResourceStart handlers.
			if (!IsInSession(c))
			{
				log::Debug("net", "event from client " + c.peer.ToString() + " before session start ignored");
				return;
			}
			proto::Reader r(body);
			auto name = r.Str();
			r.I32();
			auto payload = r.Str();
			if (!r.Ok() || name.empty() || name.size() > kMaxEventName || payload.size() > kMaxEventPayload)
			{
				Drop(c, "Malformed event.", true);
				return;
			}

			auto now = Now();
			if (now - c.rateWindowStart >= 1000)
			{
				c.rateWindowStart = now;
				c.rateCount = 0;
			}
			if (++c.rateCount > kMaxEventsPerSecond)
			{
				if (c.rateCount == kMaxEventsPerSecond + 1)
				{
					log::Warn("net", "player " + std::to_string(c.netId) + " exceeded the event rate limit; dropping events");
				}
				return;
			}

			m_resources.OnNetEvent(name, payload, c.netId);
			return;
		}

		case proto::MsgType::Ping:
		{
			c.conn->Send(proto::MsgType::Pong, body);
			return;
		}

		case proto::MsgType::Pong:
		{
			proto::Reader r(body);
			auto nonce = r.U64();
			if (r.Ok() && nonce == c.pingNonce && c.lastPingSent)
			{
				c.pingMs = static_cast<int>(Now() - c.lastPingSent);
			}
			return;
		}

		case proto::MsgType::Disconnect:
		{
			proto::Reader r(body);
			auto reason = r.Str();
			Drop(c, reason.empty() ? "Disconnected." : "Disconnected: " + reason.substr(0, 200), false);
			return;
		}

		default:
			Drop(c, std::string("Unexpected message ") + proto::MsgTypeName(type) + ".", true);
	}
}

void GameServer::HandleHello(ClientConn& c, const std::string& body)
{
	proto::Reader r(body);
	auto protocol = r.U32();
	auto rawName = r.Str();
	auto guid = r.Str();
	auto clientVersion = r.Str();
	if (!r.Ok())
	{
		Reject(c, "Malformed handshake.");
		return;
	}

	if (protocol != kProtocolVersion)
	{
		Reject(c, "Client/server version mismatch (client protocol " + std::to_string(protocol) + ", server protocol " +
					  std::to_string(kProtocolVersion) + ").");
		return;
	}

	auto name = SanitizeName(rawName);
	if (name.empty())
	{
		Reject(c, "Invalid player name.");
		return;
	}

	if (guid.empty() || guid.size() > 64)
	{
		Reject(c, "Invalid client identifier.");
		return;
	}

	int maxClients = std::clamp(m_cfg.GetInt("sv_maxclients", 32), 1, 1024);
	if (CountPlayers() >= maxClients)
	{
		Reject(c, "This server is full (" + std::to_string(maxClients) + " players).");
		return;
	}

	c.netId = m_nextNetId++;
	c.name = name;
	c.guid = guid;
	c.identifiers = { "jays:" + guid, "ip:" + c.peer.ToString().substr(0, c.peer.ToString().find(':')) };
	log::Info("server", "Connecting: " + name + " (id " + std::to_string(c.netId) + ", " + c.peer.ToString() +
							", client " + clientVersion + ")");

	// playerConnecting(name, setKickReason, deferrals)
	struct DeferralState
	{
		std::string kickReason;
		bool deferred = false;
		bool done = false;
		std::string doneReason;
	};
	auto state = std::make_shared<DeferralState>();
	int netId = c.netId;

	auto setKick = m_resources.CreateHostRef([state](const std::string& payload) {
		state->kickReason = FirstStringArg(payload).value_or("");
		return EmptyResult();
	});
	auto defer = m_resources.CreateHostRef([state](const std::string&) {
		state->deferred = true;
		return EmptyResult();
	});
	auto update = m_resources.CreateHostRef([this, netId](const std::string& payload) {
		if (auto* conn = FindByNetId(netId); conn && conn->state != ConnState::Closing)
		{
			proto::Writer w;
			w.Str("__jays:deferralUpdate").I32(netId).Str(payload);
			conn->conn->Send(proto::MsgType::Event, w.Data());
		}
		return EmptyResult();
	});
	auto done = m_resources.CreateHostRef([this, state, netId](const std::string& payload) {
		if (state->done)
		{
			return EmptyResult();
		}
		state->done = true;
		state->doneReason = FirstStringArg(payload).value_or("");
		// completion after the event returned (asynchronous deferral)
		if (auto* conn = FindByNetId(netId); conn && conn->state == ConnState::Deferred)
		{
			if (!state->doneReason.empty())
				Reject(*conn, state->doneReason);
			else
				AcceptPlayer(*conn);
		}
		return EmptyResult();
	});
	c.hostRefs = { setKick, defer, update, done };

	mp::Writer w;
	w.Array(3).Str(name).FuncRef("__host", setKick);
	w.Map(4);
	w.Str("defer").FuncRef("__host", defer);
	w.Str("update").FuncRef("__host", update);
	w.Str("done").FuncRef("__host", done);
	w.Str("handover").FuncRef("__host", update); // accepted for compatibility; data is forwarded as an update

	bool allowed = m_resources.TriggerEvent("playerConnecting", w.Data(), "internal-net:" + std::to_string(netId));
	if (c.state == ConnState::Closing)
	{
		return; // a handler dropped the connection
	}

	if (!allowed || !state->kickReason.empty())
	{
		Reject(c, state->kickReason.empty() ? "Connection rejected by the server." : state->kickReason);
		return;
	}
	if (state->done)
	{
		if (!state->doneReason.empty())
			Reject(c, state->doneReason);
		else
			AcceptPlayer(c);
		return;
	}
	if (state->deferred)
	{
		c.state = ConnState::Deferred;
		c.deferredUntil = Now() + kDeferralTimeoutMs;
		log::Info("server", "Connection of " + name + " deferred by a resource");
		return;
	}
	AcceptPlayer(c);
}

void GameServer::AcceptPlayer(ClientConn& c)
{
	ReleaseHostRefs(c);
	c.everAccepted = true;

	proto::Writer w;
	int count = 0;
	for (auto& name : m_resources.StartedNames())
	{
		if (!m_resources.Find(name)->ScriptsFor(Side::Client).empty())
		{
			count++;
		}
	}
	w.U32(static_cast<uint32_t>(c.netId)).Str(m_cfg.Get("sv_hostname", "Jays Project Server")).U32(static_cast<uint32_t>(count));
	c.conn->Send(proto::MsgType::Welcome, w.Data());
	SendResources(c);
	c.state = ConnState::Loading;
	c.lastReceive = Now();
}

void GameServer::SendResources(ClientConn& c)
{
	size_t bytes = 0;
	for (auto& name : m_resources.StartedNames())
	{
		auto* res = m_resources.Find(name);
		auto scripts = res->ScriptsFor(Side::Client);
		if (scripts.empty())
		{
			continue;
		}

		std::vector<std::string> paths = { res->manifestFile };
		paths.insert(paths.end(), scripts.begin(), scripts.end());
		for (auto& path : paths)
		{
			std::string content;
			if (!res->ReadFile(m_resources, path, content))
			{
				log::Warn("resources", "client file " + name + "/" + path + " is missing and was not sent");
				continue;
			}
			proto::Writer w;
			w.Str(name).Str(path).Str(content);
			c.conn->Send(proto::MsgType::ResourceFile, w.Data());
			bytes += content.size();
		}
	}
	c.conn->Send(proto::MsgType::ResourcesDone, "");
	log::Debug("server", "sent " + std::to_string(bytes) + " bytes of client resources to " + c.name);
}

void GameServer::Reject(ClientConn& c, const std::string& reason)
{
	log::Info("server", "Rejected " + (c.name.empty() ? c.peer.ToString() : c.name) + ": " + reason);
	ReleaseHostRefs(c);
	proto::Writer w;
	w.Str(reason);
	c.conn->Send(proto::MsgType::Reject, w.Data());
	c.state = ConnState::Closing;
	c.connectedAt = Now();
}

void GameServer::Drop(ClientConn& c, const std::string& reason, bool notifyClient)
{
	if (c.state == ConnState::Closing)
	{
		return;
	}

	bool wasPlayer = c.everAccepted;
	c.state = ConnState::Closing;
	c.connectedAt = Now();
	ReleaseHostRefs(c);

	if (notifyClient)
	{
		proto::Writer w;
		w.Str(reason);
		c.conn->Send(proto::MsgType::Disconnect, w.Data());
	}

	if (wasPlayer)
	{
		log::Info("server", "Dropped " + c.name + " (id " + std::to_string(c.netId) + "): " + reason);
		m_resources.TriggerEventStrings("playerDropped", { reason }, "internal-net:" + std::to_string(c.netId));
	}
	else if (!c.name.empty())
	{
		log::Info("server", "Connection of " + c.name + " ended: " + reason);
	}
}

void GameServer::ReleaseHostRefs(ClientConn& c)
{
	for (auto id : c.hostRefs)
	{
		m_resources.ReleaseHostRef(id);
	}
	c.hostRefs.clear();
}

void GameServer::Maintenance()
{
	auto now = Now();
	for (auto& cp : m_clients)
	{
		auto& c = *cp;
		if (c.conn->IsClosed())
		{
			continue;
		}

		switch (c.state)
		{
			case ConnState::Sniffing:
			case ConnState::Http:
			case ConnState::Handshaking:
				if (now - c.connectedAt > kHandshakeTimeoutMs)
				{
					log::Debug("net", c.peer.ToString() + ": handshake timed out");
					c.state = ConnState::Closing;
					c.conn->Close();
				}
				break;

			case ConnState::Deferred:
				if (now > c.deferredUntil)
				{
					Reject(c, "Connection deferral timed out.");
				}
				break;

			case ConnState::Loading:
			case ConnState::Active:
				if (now - c.lastReceive > kClientTimeoutMs)
				{
					Drop(c, "Timed out.", true);
				}
				else if (now - c.lastPingSent > kPingIntervalMs)
				{
					c.pingNonce++;
					c.lastPingSent = now;
					proto::Writer w;
					w.U64(c.pingNonce);
					c.conn->Send(proto::MsgType::Ping, w.Data());
				}
				break;

			case ConnState::Closing:
				if (!c.conn->HasPendingOutput() || now - c.connectedAt > kClosingGraceMs)
				{
					c.conn->Close();
				}
				break;
		}
	}

	std::erase_if(m_clients, [](const std::unique_ptr<ClientConn>& c) { return c->conn->IsClosed(); });
}

bool GameServer::HostCommand(const std::vector<std::string>& args, int source)
{
	const auto& cmd = args[0];
	// host commands are console-only
	if (source != 0)
	{
		return false;
	}

	auto requireName = [&](const char* what) -> const std::string* {
		if (args.size() < 2)
		{
			log::Warn("console", std::string("usage: ") + what + " <resource>");
			return nullptr;
		}
		return &args[1];
	};

	if (cmd == "help")
	{
		log::Info("console", "host commands: status, start <res>, ensure <res>, stop <res>, restart <res>, refresh, "
							 "clientkick <id> <reason>, say <message>, quit");
		auto names = m_resources.CommandNames();
		std::string list;
		for (auto& n : names) list += (list.empty() ? "" : ", ") + n;
		log::Info("console", "resource commands: " + (list.empty() ? std::string("(none)") : list));
		return true;
	}
	if (cmd == "status")
	{
		PrintStatus();
		return true;
	}
	if (cmd == "start" || cmd == "ensure")
	{
		if (auto* n = requireName(cmd.c_str()))
		{
			std::string error;
			bool ok = cmd == "ensure" && m_resources.Find(*n) && m_resources.Find(*n)->state == ResourceState::Started
			              ? m_resources.Restart(*n, error)
			              : m_resources.Start(*n, error);
			if (!ok) log::Error("console", error);
		}
		return true;
	}
	if (cmd == "stop")
	{
		if (auto* n = requireName("stop"); n && !m_resources.Stop(*n))
		{
			log::Warn("console", "resource " + *n + " is not running");
		}
		return true;
	}
	if (cmd == "restart")
	{
		if (auto* n = requireName("restart"))
		{
			std::string error;
			if (!m_resources.Restart(*n, error)) log::Error("console", error);
		}
		return true;
	}
	if (cmd == "refresh")
	{
		int found = m_resources.ScanDirectory(m_opts.resourcesDir);
		log::Info("console", "refresh: " + std::to_string(found) + " resource(s) (re)loaded from disk");
		return true;
	}
	if (cmd == "clientkick")
	{
		if (args.size() < 2)
		{
			log::Warn("console", "usage: clientkick <id> [reason]");
			return true;
		}
		auto* c = FindByNetId(std::atoi(args[1].c_str()));
		if (!c)
		{
			log::Warn("console", "no such player " + args[1]);
			return true;
		}
		Drop(*c, args.size() > 2 ? args[2] : "Kicked by console.", true);
		return true;
	}
	if (cmd == "say")
	{
		std::string msg;
		for (size_t i = 1; i < args.size(); i++) msg += (i > 1 ? " " : "") + args[i];
		m_resources.Hooks().sendToClient("jays:serverMessage", -1, PackStrings({ msg }));
		log::Info("console", "[say] " + msg);
		return true;
	}
	if (cmd == "quit")
	{
		m_stopRequested = true;
		return true;
	}
	return false;
}

void GameServer::PrintStatus()
{
	log::Info("console", m_cfg.Get("sv_hostname", "Jays Project Server") + " — " + std::to_string(CountPlayers()) +
							 " player(s), resources: " + std::to_string(m_resources.StartedNames().size()) + " started");
	for (auto& c : m_clients)
	{
		if (c->netId)
		{
			log::Info("console", "  [" + std::to_string(c->netId) + "] " + c->name + " " + c->peer.ToString() + " " +
									 ConnStateName(c->state) + " ping=" + std::to_string(c->pingMs) + "ms");
		}
	}
}

std::string GameServer::InfoJson() const
{
	std::string res;
	for (auto& n : m_resources.StartedNames())
	{
		res += (res.empty() ? "" : ",") + json::Quote(n);
	}
	std::string vars;
	for (auto& [k, v] : m_cfg.convars)
	{
		vars += (vars.empty() ? "" : ",") + json::Quote(k) + ":" + json::Quote(v);
	}
	return "{\"server\":" + json::Quote(std::string("JaysServer ") + kVersion) + ",\"protocol\":" +
	       std::to_string(kProtocolVersion) + ",\"resources\":[" + res + "],\"vars\":{" + vars + "},\"version\":0}";
}

std::string GameServer::PlayersJson() const
{
	std::string out = "[";
	bool first = true;
	for (auto& c : m_clients)
	{
		if (!c->everAccepted || c->state == ConnState::Closing)
		{
			continue;
		}
		std::string ids;
		for (auto& id : c->identifiers)
		{
			ids += (ids.empty() ? "" : ",") + json::Quote(id);
		}
		out += std::string(first ? "" : ",") + "{\"endpoint\":" + json::Quote(c->peer.ToString()) + ",\"id\":" +
		       std::to_string(c->netId) + ",\"identifiers\":[" + ids + "],\"name\":" + json::Quote(c->name) +
		       ",\"ping\":" + std::to_string(c->pingMs) + "}";
		first = false;
	}
	return out + "]";
}

std::string GameServer::DynamicJson() const
{
	return "{\"clients\":" + std::to_string(CountPlayers()) + ",\"gametype\":" + json::Quote(m_cfg.Get("gametype")) +
	       ",\"hostname\":" + json::Quote(m_cfg.Get("sv_hostname", "Jays Project Server")) + ",\"iv\":\"0\",\"mapname\":" +
	       json::Quote(m_cfg.Get("mapname")) + ",\"sv_maxclients\":" + json::Quote(m_cfg.Get("sv_maxclients", "32")) + "}";
}

std::string GameServer::GetInfoResponse(const std::string& challenge) const
{
	// Same key/value layout as FXServer's getinfo reply (see EVIDENCE_LEDGER F-020),
	// but identifying this server honestly as JaysProject.
	return "infoResponse\n\\sv_maxclients\\" + m_cfg.Get("sv_maxclients", "32") + "\\clients\\" +
	       std::to_string(CountPlayers()) + "\\challenge\\" + challenge + "\\gamename\\JaysProject\\protocol\\" +
	       std::to_string(kProtocolVersion) + "\\hostname\\" + m_cfg.Get("sv_hostname", "Jays Project Server") +
	       "\\gametype\\" + m_cfg.Get("gametype") + "\\mapname\\" + m_cfg.Get("mapname") + "\\iv\\0";
}

ClientConn* GameServer::FindByNetId(int netId)
{
	for (auto& c : m_clients)
	{
		if (c->netId == netId && netId != 0)
		{
			return c.get();
		}
	}
	return nullptr;
}

bool GameServer::IsInSession(const ClientConn& c)
{
	return c.state == ConnState::Loading || c.state == ConnState::Active;
}

std::vector<int> GameServer::ActivePlayerIds() const
{
	std::vector<int> ids;
	for (auto& c : m_clients)
	{
		if (IsInSession(*c))
		{
			ids.push_back(c->netId);
		}
	}
	return ids;
}

int GameServer::CountPlayers() const
{
	int n = 0;
	for (auto& c : m_clients)
	{
		if (c->everAccepted && c->state != ConnState::Closing)
		{
			n++;
		}
	}
	return n;
}
}
