#include <jays/console_input.h>

#include <iostream>
#include <thread>

namespace jays
{
void ConsoleInput::Start()
{
	// Detached: std::getline cannot be interrupted portably; the thread ends with the process.
	std::thread([this] {
		std::string line;
		while (std::getline(std::cin, line))
		{
			if (!line.empty() && line.back() == '\r')
			{
				line.pop_back();
			}
			std::lock_guard lock(m_mutex);
			m_lines.push_back(line);
		}
		std::lock_guard lock(m_mutex);
		m_eof = true;
	}).detach();
}

bool ConsoleInput::Poll(std::string& line)
{
	std::lock_guard lock(m_mutex);
	if (m_lines.empty())
	{
		return false;
	}
	line = std::move(m_lines.front());
	m_lines.pop_front();
	return true;
}

bool ConsoleInput::Eof() const
{
	std::lock_guard lock(m_mutex);
	return m_eof && m_lines.empty();
}
}
