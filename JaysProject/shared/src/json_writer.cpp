#include <jays/json_writer.h>

#include <cstdio>

namespace jays::json
{
std::string Escape(std::string_view text)
{
	std::string out;
	out.reserve(text.size() + 8);

	for (unsigned char c : text)
	{
		switch (c)
		{
			case '"': out += "\\\""; break;
			case '\\': out += "\\\\"; break;
			case '\b': out += "\\b"; break;
			case '\f': out += "\\f"; break;
			case '\n': out += "\\n"; break;
			case '\r': out += "\\r"; break;
			case '\t': out += "\\t"; break;
			default:
				if (c < 0x20)
				{
					char buf[8];
					std::snprintf(buf, sizeof(buf), "\\u%04x", c);
					out += buf;
				}
				else
				{
					out += static_cast<char>(c);
				}
		}
	}

	return out;
}

std::string Quote(std::string_view text)
{
	return "\"" + Escape(text) + "\"";
}
}
