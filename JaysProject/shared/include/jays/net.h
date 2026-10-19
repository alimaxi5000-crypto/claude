#pragma once

#include <cstdint>
#include <string>
#include <vector>

// Thin, cross-platform (Winsock / POSIX) socket helpers. IPv4 only for V0.1.
namespace jays::net
{
using SocketHandle = std::intptr_t;
constexpr SocketHandle kInvalidSocket = -1;

bool Startup();

struct Address
{
	uint32_t ip = 0;   // network byte order
	uint16_t port = 0; // host byte order

	std::string ToString() const;
	bool operator==(const Address& o) const { return ip == o.ip && port == o.port; }
};

bool Resolve(const std::string& host, int port, Address& out, std::string& error);

SocketHandle TcpListen(const Address& addr, std::string& error);
// Blocking connect bounded by timeoutMs; returned socket is non-blocking.
SocketHandle TcpConnect(const Address& addr, int timeoutMs, std::string& error);
SocketHandle TcpAccept(SocketHandle listener, Address& peer);

SocketHandle UdpBind(const Address& addr, std::string& error);
SocketHandle UdpOpen(std::string& error);
bool UdpSendTo(SocketHandle s, const std::string& data, const Address& to);
// Returns false when no datagram is waiting.
bool UdpRecvFrom(SocketHandle s, std::string& data, Address& from);

void Close(SocketHandle s);

enum class IoResult
{
	Ok,
	WouldBlock,
	Closed,
	Error,
};

// Writes as much as possible; `written` receives the byte count.
IoResult Send(SocketHandle s, const char* data, size_t len, size_t& written);
IoResult Recv(SocketHandle s, std::string& appendTo);

struct PollEntry
{
	SocketHandle socket;
	bool wantRead = true;
	bool wantWrite = false;
	bool readable = false;
	bool writable = false;
	bool failed = false;
};

// Waits up to timeoutMs for activity. Returns number of ready entries, -1 on error.
int Poll(std::vector<PollEntry>& entries, int timeoutMs);

std::string LastErrorString();
}
