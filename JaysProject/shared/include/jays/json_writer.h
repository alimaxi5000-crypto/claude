#pragma once

#include <string>
#include <string_view>

namespace jays::json
{
// Escapes a UTF-8 string for embedding in a JSON document (without quotes).
std::string Escape(std::string_view text);

// Returns "\"" + Escape(text) + "\"".
std::string Quote(std::string_view text);
}
