#pragma once

#include <jays/net.h>

#include <cstdint>
#include <string>
#include <string_view>

// Jays Network Protocol (JNP) version 1. See docs/PROTOCOL.md.
//
// Transport: one TCP stream per client. The client first sends the 8-byte
// preamble below, which lets the server share its TCP port with the
// FXServer-style HTTP info endpoints. After that, both sides exchange frames:
//
//   u32 length (little endian, counts type + body) | u8 type | body
namespace jays::proto
{
constexpr char kPreamble[8] = { 'J', 'A', 'Y', 'S', 'N', 'P', '0', '1' };
constexpr uint32_t kMaxFrame = 16u * 1024u * 1024u;

enum class MsgType : uint8_t
{
	Hello = 1,         // C->S  u32 protocol, str name, str guid, str clientVersion
	Welcome = 2,       // S->C  u32 netId, str serverName, u32 resourceCount
	Reject = 3,        // S->C  str reason
	ResourceFile = 4,  // S->C  str resource, str path, str content
	ResourcesDone = 5, // S->C  (empty)
	ClientReady = 6,   // C->S  (empty), client resources started
	Activated = 7,     // S->C  (empty), session is active
	Event = 8,         // both  str name, i32 target (S->C only meaningful), bytes msgpack args
	Ping = 9,          // both  u64 nonce
	Pong = 10,         // both  u64 nonce
	Disconnect = 11,   // both  str reason
};

const char* MsgTypeName(MsgType t);

class Writer
{
public:
	Writer& U8(uint8_t v);
	Writer& U32(uint32_t v);
	Writer& I32(int32_t v) { return U32(static_cast<uint32_t>(v)); }
	Writer& U64(uint64_t v);
	Writer& Str(std::string_view v); // u32 length + bytes

	const std::string& Data() const { return m_buf; }

private:
	std::string m_buf;
};

class Reader
{
public:
	explicit Reader(std::string_view data) : m_data(data) {}

	uint8_t U8();
	uint32_t U32();
	int32_t I32() { return static_cast<int32_t>(U32()); }
	uint64_t U64();
	std::string Str();

	bool Ok() const { return m_ok; }
	bool AtEnd() const { return m_pos == m_data.size(); }

private:
	bool Need(size_t n);

	std::string_view m_data;
	size_t m_pos = 0;
	bool m_ok = true;
};

std::string EncodeFrame(MsgType type, std::string_view body);

// Incremental frame parser over a byte stream.
class FrameDecoder
{
public:
	void Feed(std::string_view data) { m_buf.append(data.data(), data.size()); }

	enum class Result
	{
		Frame,
		NeedMore,
		Invalid,
	};

	Result Next(MsgType& type, std::string& body, std::string& error);

private:
	std::string m_buf;
};

// A framed, non-blocking TCP connection with an output queue.
class Connection
{
public:
	explicit Connection(net::SocketHandle s) : m_socket(s) {}
	~Connection();

	Connection(const Connection&) = delete;
	Connection& operator=(const Connection&) = delete;

	net::SocketHandle Socket() const { return m_socket; }

	void SendRaw(std::string_view bytes);
	void Send(MsgType type, std::string_view body) { SendRaw(EncodeFrame(type, body)); }

	// Attempts to flush the output queue. Returns false on a socket error.
	bool Flush();
	bool HasPendingOutput() const { return m_outPos < m_out.size(); }

	// Reads available bytes into `inbound`. Returns false when the peer closed or errored.
	bool ReadAvailable(std::string& inbound);

	void Close();
	bool IsClosed() const { return m_socket == net::kInvalidSocket; }

private:
	net::SocketHandle m_socket;
	std::string m_out;
	size_t m_outPos = 0;
};
}
