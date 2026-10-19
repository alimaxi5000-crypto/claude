#include "test_framework.h"

#include <jays/config.h>
#include <jays/protocol.h>

#include <filesystem>
#include <fstream>

using namespace jays;

TEST(config_tokenizer_handles_quotes_and_comments)
{
	auto t = TokenizeCommand(R"(sv_hostname "My Jays Server" # comment)");
	CHECK_EQ(t.size(), size_t(2));
	CHECK_EQ(t[0], std::string("sv_hostname"));
	CHECK_EQ(t[1], std::string("My Jays Server"));

	CHECK(TokenizeCommand("   // only a comment").empty());
	auto e = TokenizeCommand(R"(say "" x)");
	CHECK_EQ(e.size(), size_t(3));
	CHECK_EQ(e[1], std::string(""));
}

TEST(config_parses_server_cfg_subset)
{
	ServerConfig cfg;
	std::string err;
	bool ok = ParseServerConfig(R"(
endpoint_add_tcp "127.0.0.1:30125"
sv_hostname "Test Server"
set sv_maxclients 8
sets tags "a,b"
ensure basic
start chat
stop chat
something weird here
)", ".", cfg, err);
	CHECK(ok);
	CHECK_EQ(cfg.tcpEndpoint, std::string("127.0.0.1:30125"));
	CHECK_EQ(cfg.Get("sv_hostname"), std::string("Test Server"));
	CHECK_EQ(cfg.GetInt("sv_maxclients", 0), 8);
	CHECK_EQ(cfg.GetInt("missing", 42), 42);
	CHECK_EQ(cfg.Get("tags"), std::string("a,b"));
	CHECK_EQ(cfg.resources.size(), size_t(1));
	CHECK_EQ(cfg.resources[0], std::string("basic"));
	CHECK_EQ(cfg.warnings.size(), size_t(1));
}

TEST(config_exec_and_missing_files)
{
	auto dir = std::filesystem::temp_directory_path() / "jays_cfg_test";
	std::filesystem::create_directories(dir);
	{
		std::ofstream(dir / "main.cfg") << "exec extra.cfg\nensure a\n";
		std::ofstream(dir / "extra.cfg") << "set from_exec yes\n";
	}

	ServerConfig cfg;
	std::string err;
	CHECK(LoadServerConfig((dir / "main.cfg").string(), cfg, err));
	CHECK_EQ(cfg.Get("from_exec"), std::string("yes"));

	ServerConfig cfg2;
	CHECK(!LoadServerConfig((dir / "nope.cfg").string(), cfg2, err));
	CHECK(err.find("could not open") != std::string::npos);

	ServerConfig cfg3;
	CHECK(!ParseServerConfig("exec missing.cfg", dir.string(), cfg3, err));
	std::filesystem::remove_all(dir);
}

TEST(config_split_host_port)
{
	std::string host;
	int port = 0;
	CHECK(SplitHostPort("127.0.0.1:30120", host, port));
	CHECK_EQ(host, std::string("127.0.0.1"));
	CHECK_EQ(port, 30120);
	CHECK(SplitHostPort("localhost", host, port, 1234));
	CHECK_EQ(port, 1234);
	CHECK(!SplitHostPort("host:99999", host, port));
	CHECK(!SplitHostPort("host:abc", host, port));
	CHECK(!SplitHostPort(":30120", host, port));
}

TEST(protocol_frames_roundtrip)
{
	proto::Writer w;
	w.U32(7).Str("hello").U64(0x1122334455667788ULL).I32(-5);
	auto frame = proto::EncodeFrame(proto::MsgType::Event, w.Data());

	proto::FrameDecoder dec;
	proto::MsgType type;
	std::string body, err;

	// feed byte by byte to exercise partial reads
	for (size_t i = 0; i + 1 < frame.size(); i++)
	{
		dec.Feed(frame.substr(i, 1));
		CHECK(dec.Next(type, body, err) == proto::FrameDecoder::Result::NeedMore);
	}
	dec.Feed(frame.substr(frame.size() - 1));
	CHECK(dec.Next(type, body, err) == proto::FrameDecoder::Result::Frame);
	CHECK(type == proto::MsgType::Event);

	proto::Reader r(body);
	CHECK_EQ(r.U32(), 7u);
	CHECK_EQ(r.Str(), std::string("hello"));
	CHECK_EQ(r.U64(), 0x1122334455667788ULL);
	CHECK_EQ(r.I32(), -5);
	CHECK(r.Ok() && r.AtEnd());

	// reading past the end flags failure instead of crashing
	r.U32();
	CHECK(!r.Ok());
}

TEST(protocol_rejects_invalid_frames)
{
	proto::FrameDecoder dec;
	proto::MsgType type;
	std::string body, err;

	std::string bad("\x01\x00\x00\x00\x63", 5); // type 99
	dec.Feed(bad);
	CHECK(dec.Next(type, body, err) == proto::FrameDecoder::Result::Invalid);

	proto::FrameDecoder dec2;
	std::string huge("\xff\xff\xff\x7f\x01", 5);
	dec2.Feed(huge);
	CHECK(dec2.Next(type, body, err) == proto::FrameDecoder::Result::Invalid);

	proto::FrameDecoder dec3;
	std::string zero("\x00\x00\x00\x00", 4);
	dec3.Feed(zero);
	CHECK(dec3.Next(type, body, err) == proto::FrameDecoder::Result::Invalid);
}
