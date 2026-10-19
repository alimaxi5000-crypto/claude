#pragma once

#include <functional>
#include <string>
#include <string_view>

namespace jays::log
{
enum class Level
{
	Debug,
	Info,
	Warn,
	Error,
};

enum class Format
{
	Text, // human readable: "[12.345] [INFO ] [server] message"
	Json, // one JSON object per line, consumed by the launcher
};

struct Record
{
	double timeSeconds;
	Level level;
	std::string component;
	std::string message;
};

void SetFormat(Format format);
void SetMinLevel(Level level);

// Also append every record (text format) to a file. Empty path disables.
bool SetFile(const std::string& path);

// Optional extra sink, used by tests to capture output.
void SetSink(std::function<void(const Record&)> sink);

// Disables stdout output (sink and file still receive records).
void SetQuiet(bool quiet);

void Write(Level level, std::string_view component, std::string_view message);

const char* LevelName(Level level);
bool ParseLevel(std::string_view text, Level& out);

inline void Debug(std::string_view c, std::string_view m) { Write(Level::Debug, c, m); }
inline void Info(std::string_view c, std::string_view m) { Write(Level::Info, c, m); }
inline void Warn(std::string_view c, std::string_view m) { Write(Level::Warn, c, m); }
inline void Error(std::string_view c, std::string_view m) { Write(Level::Error, c, m); }
}
