#pragma once

#include <deque>
#include <mutex>
#include <string>

namespace jays
{
// Reads stdin lines on a background thread so main loops never block.
class ConsoleInput
{
public:
	void Start();
	bool Poll(std::string& line);
	bool Eof() const;

private:
	mutable std::mutex m_mutex;
	std::deque<std::string> m_lines;
	bool m_eof = false;
};
}
