#include <jays/protocol.h>

#include <cstring>

namespace jays::proto
{
const char* MsgTypeName(MsgType t)
{
	switch (t)
	{
		case MsgType::Hello: return "Hello";
		case MsgType::Welcome: return "Welcome";
		case MsgType::Reject: return "Reject";
		case MsgType::ResourceFile: return "ResourceFile";
		case MsgType::ResourcesDone: return "ResourcesDone";
		case MsgType::ClientReady: return "ClientReady";
		case MsgType::Activated: return "Activated";
		case MsgType::Event: return "Event";
		case MsgType::Ping: return "Ping";
		case MsgType::Pong: return "Pong";
		case MsgType::Disconnect: return "Disconnect";
	}
	return "Unknown";
}

Writer& Writer::U8(uint8_t v)
{
	m_buf.push_back(static_cast<char>(v));
	return *this;
}

Writer& Writer::U32(uint32_t v)
{
	for (int i = 0; i < 4; i++)
	{
		m_buf.push_back(static_cast<char>((v >> (8 * i)) & 0xFF));
	}
	return *this;
}

Writer& Writer::U64(uint64_t v)
{
	for (int i = 0; i < 8; i++)
	{
		m_buf.push_back(static_cast<char>((v >> (8 * i)) & 0xFF));
	}
	return *this;
}

Writer& Writer::Str(std::string_view v)
{
	U32(static_cast<uint32_t>(v.size()));
	m_buf.append(v.data(), v.size());
	return *this;
}

bool Reader::Need(size_t n)
{
	if (!m_ok || m_data.size() - m_pos < n)
	{
		m_ok = false;
		return false;
	}
	return true;
}

uint8_t Reader::U8()
{
	if (!Need(1)) return 0;
	return static_cast<uint8_t>(m_data[m_pos++]);
}

uint32_t Reader::U32()
{
	if (!Need(4)) return 0;
	uint32_t v = 0;
	for (int i = 0; i < 4; i++)
	{
		v |= static_cast<uint32_t>(static_cast<uint8_t>(m_data[m_pos++])) << (8 * i);
	}
	return v;
}

uint64_t Reader::U64()
{
	if (!Need(8)) return 0;
	uint64_t v = 0;
	for (int i = 0; i < 8; i++)
	{
		v |= static_cast<uint64_t>(static_cast<uint8_t>(m_data[m_pos++])) << (8 * i);
	}
	return v;
}

std::string Reader::Str()
{
	auto len = U32();
	if (!Need(len)) return {};
	std::string s(m_data.substr(m_pos, len));
	m_pos += len;
	return s;
}

std::string EncodeFrame(MsgType type, std::string_view body)
{
	Writer w;
	w.U32(static_cast<uint32_t>(body.size() + 1));
	w.U8(static_cast<uint8_t>(type));
	std::string out = w.Data();
	out.append(body.data(), body.size());
	return out;
}

FrameDecoder::Result FrameDecoder::Next(MsgType& type, std::string& body, std::string& error)
{
	if (m_buf.size() < 4)
	{
		return Result::NeedMore;
	}

	Reader r(std::string_view(m_buf).substr(0, 4));
	uint32_t len = r.U32();
	if (len == 0 || len > kMaxFrame)
	{
		error = "invalid frame length " + std::to_string(len);
		return Result::Invalid;
	}

	if (m_buf.size() < 4 + static_cast<size_t>(len))
	{
		return Result::NeedMore;
	}

	auto rawType = static_cast<uint8_t>(m_buf[4]);
	if (rawType < static_cast<uint8_t>(MsgType::Hello) || rawType > static_cast<uint8_t>(MsgType::Disconnect))
	{
		error = "unknown message type " + std::to_string(rawType);
		return Result::Invalid;
	}

	type = static_cast<MsgType>(rawType);
	body.assign(m_buf, 5, len - 1);
	m_buf.erase(0, 4 + static_cast<size_t>(len));
	return Result::Frame;
}

Connection::~Connection()
{
	Close();
}

void Connection::SendRaw(std::string_view bytes)
{
	if (IsClosed())
	{
		return;
	}

	// compact the queue once everything before m_outPos was sent
	if (m_outPos > 0 && m_outPos == m_out.size())
	{
		m_out.clear();
		m_outPos = 0;
	}

	m_out.append(bytes.data(), bytes.size());
}

bool Connection::Flush()
{
	if (IsClosed())
	{
		return false;
	}

	while (HasPendingOutput())
	{
		size_t written = 0;
		auto res = net::Send(m_socket, m_out.data() + m_outPos, m_out.size() - m_outPos, written);
		m_outPos += written;

		if (res == net::IoResult::WouldBlock)
		{
			return true;
		}
		if (res != net::IoResult::Ok)
		{
			return false;
		}
	}

	m_out.clear();
	m_outPos = 0;
	return true;
}

bool Connection::ReadAvailable(std::string& inbound)
{
	if (IsClosed())
	{
		return false;
	}

	auto res = net::Recv(m_socket, inbound);
	return res == net::IoResult::Ok || res == net::IoResult::WouldBlock;
}

void Connection::Close()
{
	if (m_socket != net::kInvalidSocket)
	{
		net::Close(m_socket);
		m_socket = net::kInvalidSocket;
	}
}
}
