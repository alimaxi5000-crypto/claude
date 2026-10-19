#include <jays/net.h>

#include <cstring>

#ifdef _WIN32
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib")
using socklen_t = int;
#define JAYS_POLL WSAPoll
#else
#include <arpa/inet.h>
#include <cerrno>
#include <fcntl.h>
#include <netdb.h>
#include <netinet/in.h>
#include <netinet/tcp.h>
#include <poll.h>
#include <sys/socket.h>
#include <unistd.h>
#define JAYS_POLL ::poll
#endif

namespace jays::net
{
namespace
{
using Native =
#ifdef _WIN32
	SOCKET;
#else
	int;
#endif

Native N(SocketHandle s) { return static_cast<Native>(s); }
SocketHandle H(Native s)
{
#ifdef _WIN32
	return s == INVALID_SOCKET ? kInvalidSocket : static_cast<SocketHandle>(s);
#else
	return s < 0 ? kInvalidSocket : static_cast<SocketHandle>(s);
#endif
}

int LastError()
{
#ifdef _WIN32
	return WSAGetLastError();
#else
	return errno;
#endif
}

bool IsWouldBlock(int err)
{
#ifdef _WIN32
	return err == WSAEWOULDBLOCK;
#else
	return err == EAGAIN || err == EWOULDBLOCK;
#endif
}

bool IsInProgress(int err)
{
#ifdef _WIN32
	return err == WSAEWOULDBLOCK || err == WSAEINPROGRESS;
#else
	return err == EINPROGRESS;
#endif
}

void SetNonBlocking(Native s)
{
#ifdef _WIN32
	u_long mode = 1;
	ioctlsocket(s, FIONBIO, &mode);
#else
	int flags = fcntl(s, F_GETFL, 0);
	fcntl(s, F_SETFL, flags | O_NONBLOCK);
#endif
}

sockaddr_in ToSockAddr(const Address& a)
{
	sockaddr_in sa{};
	sa.sin_family = AF_INET;
	sa.sin_addr.s_addr = a.ip;
	sa.sin_port = htons(a.port);
	return sa;
}

Address FromSockAddr(const sockaddr_in& sa)
{
	return Address{ sa.sin_addr.s_addr, ntohs(sa.sin_port) };
}
}

std::string LastErrorString()
{
	int err = LastError();
#ifdef _WIN32
	char buf[256] = {};
	FormatMessageA(FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS, nullptr, err, 0, buf, sizeof(buf), nullptr);
	std::string s(buf);
	while (!s.empty() && (s.back() == '\n' || s.back() == '\r')) s.pop_back();
	return s + " (" + std::to_string(err) + ")";
#else
	return std::string(std::strerror(err)) + " (" + std::to_string(err) + ")";
#endif
}

bool Startup()
{
#ifdef _WIN32
	WSADATA data;
	return WSAStartup(MAKEWORD(2, 2), &data) == 0;
#else
	return true;
#endif
}

std::string Address::ToString() const
{
	char buf[INET_ADDRSTRLEN] = {};
	in_addr a{};
	a.s_addr = ip;
	inet_ntop(AF_INET, &a, buf, sizeof(buf));
	return std::string(buf) + ":" + std::to_string(port);
}

bool Resolve(const std::string& host, int port, Address& out, std::string& error)
{
	addrinfo hints{};
	hints.ai_family = AF_INET;
	addrinfo* res = nullptr;

	int rc = getaddrinfo(host.c_str(), nullptr, &hints, &res);
	if (rc != 0 || !res)
	{
		error = "could not resolve host '" + host + "'";
		return false;
	}

	out.ip = reinterpret_cast<sockaddr_in*>(res->ai_addr)->sin_addr.s_addr;
	out.port = static_cast<uint16_t>(port);
	freeaddrinfo(res);
	return true;
}

SocketHandle TcpListen(const Address& addr, std::string& error)
{
	Native s = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (H(s) == kInvalidSocket)
	{
		error = "socket() failed: " + LastErrorString();
		return kInvalidSocket;
	}

#ifndef _WIN32
	int yes = 1;
	setsockopt(s, SOL_SOCKET, SO_REUSEADDR, reinterpret_cast<const char*>(&yes), sizeof(yes));
#endif

	auto sa = ToSockAddr(addr);
	if (bind(s, reinterpret_cast<sockaddr*>(&sa), sizeof(sa)) != 0 || listen(s, 64) != 0)
	{
		error = "bind/listen on " + addr.ToString() + " failed: " + LastErrorString();
		Close(H(s));
		return kInvalidSocket;
	}

	SetNonBlocking(s);
	return H(s);
}

SocketHandle TcpConnect(const Address& addr, int timeoutMs, std::string& error)
{
	Native s = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (H(s) == kInvalidSocket)
	{
		error = "socket() failed: " + LastErrorString();
		return kInvalidSocket;
	}

	SetNonBlocking(s);

	int yes = 1;
	setsockopt(s, IPPROTO_TCP, TCP_NODELAY, reinterpret_cast<const char*>(&yes), sizeof(yes));

	auto sa = ToSockAddr(addr);
	if (connect(s, reinterpret_cast<sockaddr*>(&sa), sizeof(sa)) != 0)
	{
		if (!IsInProgress(LastError()))
		{
			error = "connect to " + addr.ToString() + " failed: " + LastErrorString();
			Close(H(s));
			return kInvalidSocket;
		}

		std::vector<PollEntry> entries{ PollEntry{ H(s), false, true } };
		int n = Poll(entries, timeoutMs);
		if (n <= 0)
		{
			error = n == 0 ? "connection to " + addr.ToString() + " timed out" : "poll failed: " + LastErrorString();
			Close(H(s));
			return kInvalidSocket;
		}

		int soError = 0;
		socklen_t len = sizeof(soError);
		getsockopt(s, SOL_SOCKET, SO_ERROR, reinterpret_cast<char*>(&soError), &len);
		if (soError != 0 || entries[0].failed)
		{
#ifdef _WIN32
			WSASetLastError(soError);
#else
			errno = soError;
#endif
			error = "connect to " + addr.ToString() + " failed: " + LastErrorString();
			Close(H(s));
			return kInvalidSocket;
		}
	}

	return H(s);
}

SocketHandle TcpAccept(SocketHandle listener, Address& peer)
{
	sockaddr_in sa{};
	socklen_t len = sizeof(sa);
	Native s = accept(N(listener), reinterpret_cast<sockaddr*>(&sa), &len);
	if (H(s) == kInvalidSocket)
	{
		return kInvalidSocket;
	}

	SetNonBlocking(s);
	int yes = 1;
	setsockopt(s, IPPROTO_TCP, TCP_NODELAY, reinterpret_cast<const char*>(&yes), sizeof(yes));
	peer = FromSockAddr(sa);
	return H(s);
}

SocketHandle UdpOpen(std::string& error)
{
	Native s = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
	if (H(s) == kInvalidSocket)
	{
		error = "socket() failed: " + LastErrorString();
		return kInvalidSocket;
	}
	SetNonBlocking(s);
	return H(s);
}

SocketHandle UdpBind(const Address& addr, std::string& error)
{
	auto s = UdpOpen(error);
	if (s == kInvalidSocket)
	{
		return s;
	}

	auto sa = ToSockAddr(addr);
	if (bind(N(s), reinterpret_cast<sockaddr*>(&sa), sizeof(sa)) != 0)
	{
		error = "UDP bind on " + addr.ToString() + " failed: " + LastErrorString();
		Close(s);
		return kInvalidSocket;
	}
	return s;
}

bool UdpSendTo(SocketHandle s, const std::string& data, const Address& to)
{
	auto sa = ToSockAddr(to);
	return sendto(N(s), data.data(), static_cast<int>(data.size()), 0, reinterpret_cast<sockaddr*>(&sa), sizeof(sa)) ==
	       static_cast<int>(data.size());
}

bool UdpRecvFrom(SocketHandle s, std::string& data, Address& from)
{
	char buf[65536];
	sockaddr_in sa{};
	socklen_t len = sizeof(sa);
	auto n = recvfrom(N(s), buf, sizeof(buf), 0, reinterpret_cast<sockaddr*>(&sa), &len);
	if (n < 0)
	{
		return false;
	}
	data.assign(buf, static_cast<size_t>(n));
	from = FromSockAddr(sa);
	return true;
}

void Close(SocketHandle s)
{
	if (s == kInvalidSocket)
	{
		return;
	}
#ifdef _WIN32
	closesocket(N(s));
#else
	::close(N(s));
#endif
}

IoResult Send(SocketHandle s, const char* data, size_t len, size_t& written)
{
	written = 0;
	while (written < len)
	{
#ifdef _WIN32
		int flags = 0;
#else
		int flags = MSG_NOSIGNAL;
#endif
		auto n = send(N(s), data + written, static_cast<int>(len - written), flags);
		if (n < 0)
		{
			return IsWouldBlock(LastError()) ? IoResult::WouldBlock : IoResult::Error;
		}
		written += static_cast<size_t>(n);
	}
	return IoResult::Ok;
}

IoResult Recv(SocketHandle s, std::string& appendTo)
{
	char buf[16384];
	bool any = false;
	for (;;)
	{
		auto n = recv(N(s), buf, sizeof(buf), 0);
		if (n > 0)
		{
			appendTo.append(buf, static_cast<size_t>(n));
			any = true;
			continue;
		}
		if (n == 0)
		{
			return IoResult::Closed;
		}
		if (IsWouldBlock(LastError()))
		{
			return any ? IoResult::Ok : IoResult::WouldBlock;
		}
		return IoResult::Error;
	}
}

int Poll(std::vector<PollEntry>& entries, int timeoutMs)
{
	std::vector<pollfd> fds(entries.size());
	for (size_t i = 0; i < entries.size(); i++)
	{
		fds[i].fd = N(entries[i].socket);
		fds[i].events = static_cast<short>((entries[i].wantRead ? POLLIN : 0) | (entries[i].wantWrite ? POLLOUT : 0));
		fds[i].revents = 0;
	}

	if (fds.empty())
	{
		return 0;
	}

	int n = JAYS_POLL(fds.data(), static_cast<unsigned long>(fds.size()), timeoutMs);
	if (n < 0)
	{
#ifndef _WIN32
		if (errno == EINTR)
		{
			return 0; // interrupted by a signal (e.g. Ctrl+C); callers re-check their stop flags
		}
#endif
		return -1;
	}

	for (size_t i = 0; i < entries.size(); i++)
	{
		entries[i].readable = (fds[i].revents & (POLLIN | POLLHUP)) != 0;
		entries[i].writable = (fds[i].revents & POLLOUT) != 0;
		entries[i].failed = (fds[i].revents & (POLLERR | POLLNVAL)) != 0;
	}
	return n;
}
}
