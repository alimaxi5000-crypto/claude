#pragma once

#include <jays/net.h>
#include <jays/protocol.h>
#include <jays/resource_manager.h>

#include <csignal>
#include <map>
#include <memory>
#include <string>
#include <vector>

namespace jays::client
{
enum class State
{
	Idle,
	Connecting,
	Handshaking,
	Downloading,
	Loading,
	Active,
	Disconnected,
};

const char* StateName(State s);

// Exit codes, also documented in docs/CLIENT.md and used by the launcher.
enum ExitCode
{
	kExitOk = 0,
	kExitUsage = 2,
	kExitConnectFailed = 3,
	kExitRejected = 4,
	kExitDisconnected = 5,
	kExitProtocolError = 6,
};

struct Options
{
	std::string address;          // host:port to connect to
	std::string name = "Player";
	std::string guid;             // stable client identifier
	std::string localResources;   // run resources from disk without a server
	std::vector<std::string> execAfterActive;
	int quitAfterMs = 0;          // exit this long after becoming active (0 = never)
	int connectTimeoutMs = 5000;
	bool consoleInput = true;
	const volatile std::sig_atomic_t* externalStop = nullptr;
};

class GameClient
{
public:
	explicit GameClient(Options opts);
	~GameClient();

	int Run();

private:
	int RunLocal();
	bool Connect(std::string& error);
	void SetState(State s, const std::string& detail = "");
	void HandleFrame(proto::MsgType type, const std::string& body);
	void FinishLoading();
	void HandleConsole(const std::string& line);
	void Disconnect(const std::string& reason);
	void Send(proto::MsgType type, const std::string& body);
	uint64_t Now() const { return m_resources.TimeMs(); }

	Options m_opts;
	ResourceManager m_resources{ Side::Client };
	std::unique_ptr<proto::Connection> m_conn;
	proto::FrameDecoder m_decoder;
	State m_state = State::Idle;
	int m_exitCode = kExitOk;
	bool m_quit = false;

	int m_netId = 0;
	std::string m_serverName;
	uint32_t m_expectedResources = 0;
	std::vector<std::string> m_pendingOrder;
	std::map<std::string, std::unique_ptr<MemoryFileSource>> m_pending;

	uint64_t m_stateSince = 0;
	uint64_t m_lastReceive = 0;
	uint64_t m_lastPing = 0;
	uint64_t m_pingNonce = 0;
	uint64_t m_lastStats = 0;
	uint64_t m_activeSince = 0;
	int m_pingMs = -1;
};

// Queries an FXServer-compatible endpoint (UDP getinfo + HTTP info JSON).
int RunProbe(const std::string& address, int timeoutMs);
}
