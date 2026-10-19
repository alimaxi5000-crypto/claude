#include <jays/json_writer.h>
#include <jays/log.h>

#include <chrono>
#include <cstdio>
#include <fstream>
#include <mutex>

namespace jays::log
{
namespace
{
std::mutex g_mutex;
Format g_format = Format::Text;
Level g_minLevel = Level::Info;
bool g_quiet = false;
std::ofstream g_file;
std::function<void(const Record&)> g_sink;
const auto g_start = std::chrono::steady_clock::now();

std::string FormatText(const Record& r)
{
	char prefix[64];
	std::snprintf(prefix, sizeof(prefix), "[%9.3f] [%-5s] ", r.timeSeconds, LevelName(r.level));
	return std::string(prefix) + "[" + r.component + "] " + r.message;
}

std::string FormatJson(const Record& r)
{
	char t[32];
	std::snprintf(t, sizeof(t), "%.3f", r.timeSeconds);
	return std::string("{\"t\":") + t + ",\"level\":" + json::Quote(LevelName(r.level)) +
	       ",\"component\":" + json::Quote(r.component) + ",\"msg\":" + json::Quote(r.message) + "}";
}
}

void SetFormat(Format format)
{
	std::lock_guard lock(g_mutex);
	g_format = format;
}

void SetMinLevel(Level level)
{
	std::lock_guard lock(g_mutex);
	g_minLevel = level;
}

bool SetFile(const std::string& path)
{
	std::lock_guard lock(g_mutex);
	if (g_file.is_open())
	{
		g_file.close();
	}

	if (path.empty())
	{
		return true;
	}

	g_file.open(path, std::ios::app);
	return g_file.is_open();
}

void SetSink(std::function<void(const Record&)> sink)
{
	std::lock_guard lock(g_mutex);
	g_sink = std::move(sink);
}

void SetQuiet(bool quiet)
{
	std::lock_guard lock(g_mutex);
	g_quiet = quiet;
}

void Write(Level level, std::string_view component, std::string_view message)
{
	std::lock_guard lock(g_mutex);
	if (level < g_minLevel)
	{
		return;
	}

	Record r{ std::chrono::duration<double>(std::chrono::steady_clock::now() - g_start).count(), level,
		std::string(component), std::string(message) };

	// strip a single trailing newline, Lua print() style callers often add one
	if (!r.message.empty() && r.message.back() == '\n')
	{
		r.message.pop_back();
	}

	if (!g_quiet)
	{
		auto line = (g_format == Format::Json) ? FormatJson(r) : FormatText(r);
		std::fputs(line.c_str(), stdout);
		std::fputc('\n', stdout);
		std::fflush(stdout);
	}

	if (g_file.is_open())
	{
		g_file << FormatText(r) << '\n';
		g_file.flush();
	}

	if (g_sink)
	{
		g_sink(r);
	}
}

const char* LevelName(Level level)
{
	switch (level)
	{
		case Level::Debug: return "DEBUG";
		case Level::Info: return "INFO";
		case Level::Warn: return "WARN";
		case Level::Error: return "ERROR";
	}
	return "?";
}

bool ParseLevel(std::string_view text, Level& out)
{
	if (text == "debug") { out = Level::Debug; return true; }
	if (text == "info") { out = Level::Info; return true; }
	if (text == "warn") { out = Level::Warn; return true; }
	if (text == "error") { out = Level::Error; return true; }
	return false;
}
}
