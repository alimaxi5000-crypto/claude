#pragma once

#include <jays/config.h>
#include <jays/net.h>
#include <jays/protocol.h>
#include <jays/resource_manager.h>

#include <csignal>
#include <cstdint>
#include <map>
#include <memory>
#include <string>
#include <vector>

namespace jays::server
{
enum class ConnState
{
	Sniffing,    // waiting for the JNP preamble or an HTTP request line
	Http,        // serving one HTTP request, then closing
	Handshaking, // JNP, waiting for Hello
	Deferred,    // playerConnecting handler called deferrals.defer()
	Loading,     // client resources sent, waiting for ClientReady
	Active,
	Closing,     // flush pending output, then close
};

const char* ConnStateName(ConnState s);

struct ClientConn
{
	std::unique_ptr<proto::Connection> conn;
	net::Address peer;
	ConnState state = ConnState::Sniffing;
	std::string inbound;
	proto::FrameDecoder decoder;

	int netId = 0;
	std::string name;
	std::string guid;
	std::vector<std::string> identifiers;

	uint64_t connectedAt = 0;
	uint64_t lastReceive = 0;
	uint64_t lastPingSent = 0;
	uint64_t pingNonce = 0;
	int pingMs = 0;
	uint64_t deferredUntil = 0;
	std::vector<int64_t> hostRefs;

	// simple event rate limiting
	uint64_t rateWindowStart = 0;
	int rateCount = 0;
	bool everAccepted = false;
};

struct Options
{
	std::string configPath;
	std::string resourcesDir;
	std::string endpointOverride;
	bool consoleInput = true;
	const volatile std::sig_atomic_t* externalStop = nullptr; // set by a signal handler
};

class GameServer
{
public:
	explicit GameServer(Options opts);
	~GameServer();

	bool Init(std::string& error);
	// Runs until `quit` or RequestStop(). Returns a process exit code.
	int Run();
	void RequestStop() { m_stopRequested = true; }

	// Exposed for tests / tooling.
	ResourceManager& Resources() { return m_resources; }

private:
	void InstallHooks();
	void Poll(int timeoutMs);
	void AcceptClients();
	void HandleUdp();
	void ProcessInbound(ClientConn& c);
	void HandleSniff(ClientConn& c);
	void HandleHttp(ClientConn& c);
	void HandleFrame(ClientConn& c, proto::MsgType type, const std::string& body);
	void HandleHello(ClientConn& c, const std::string& body);
	void AcceptPlayer(ClientConn& c);
	void SendResources(ClientConn& c);
	void Reject(ClientConn& c, const std::string& reason);
	void Drop(ClientConn& c, const std::string& reason, bool notifyClient);
	void ReleaseHostRefs(ClientConn& c);
	void Maintenance();
	bool HostCommand(const std::vector<std::string>& args, int source);
	void PrintStatus();

	std::string InfoJson() const;
	std::string PlayersJson() const;
	std::string DynamicJson() const;
	std::string GetInfoResponse(const std::string& challenge) const;

	ClientConn* FindByNetId(int netId);
	static bool IsInSession(const ClientConn& c);
	std::vector<int> ActivePlayerIds() const;
	int CountPlayers() const;
	uint64_t Now() const { return m_resources.TimeMs(); }

	Options m_opts;
	ServerConfig m_cfg;
	ResourceManager m_resources{ Side::Server };
	net::SocketHandle m_listener = net::kInvalidSocket;
	net::SocketHandle m_udp = net::kInvalidSocket;
	std::vector<std::unique_ptr<ClientConn>> m_clients;
	int m_nextNetId = 1;
	bool m_stopRequested = false;
	uint64_t m_lastMaintenance = 0;
};
}
