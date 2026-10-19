#include <jays/lua_api.h>
#include <jays/serialization.h>

#include <cmath>
#include <cstring>

namespace jays::mp
{
void Writer::Be(uint64_t v, int bytes)
{
	for (int i = bytes - 1; i >= 0; i--)
	{
		m_buf.push_back(static_cast<char>((v >> (8 * i)) & 0xFF));
	}
}

Writer& Writer::Nil()
{
	m_buf.push_back(static_cast<char>(0xc0));
	return *this;
}

Writer& Writer::Bool(bool v)
{
	m_buf.push_back(static_cast<char>(v ? 0xc3 : 0xc2));
	return *this;
}

Writer& Writer::Int(int64_t v)
{
	if (v >= 0 && v <= 127)
	{
		m_buf.push_back(static_cast<char>(v));
	}
	else if (v < 0 && v >= -32)
	{
		m_buf.push_back(static_cast<char>(static_cast<int8_t>(v)));
	}
	else if (v >= INT32_MIN && v <= INT32_MAX)
	{
		m_buf.push_back(static_cast<char>(0xd2));
		Be(static_cast<uint32_t>(static_cast<int32_t>(v)), 4);
	}
	else
	{
		m_buf.push_back(static_cast<char>(0xd3));
		Be(static_cast<uint64_t>(v), 8);
	}
	return *this;
}

Writer& Writer::Double(double v)
{
	uint64_t bits;
	std::memcpy(&bits, &v, 8);
	m_buf.push_back(static_cast<char>(0xcb));
	Be(bits, 8);
	return *this;
}

Writer& Writer::Str(std::string_view v)
{
	auto n = v.size();
	if (n < 32)
	{
		m_buf.push_back(static_cast<char>(0xa0 | n));
	}
	else if (n <= 0xff)
	{
		m_buf.push_back(static_cast<char>(0xd9));
		Be(n, 1);
	}
	else if (n <= 0xffff)
	{
		m_buf.push_back(static_cast<char>(0xda));
		Be(n, 2);
	}
	else
	{
		m_buf.push_back(static_cast<char>(0xdb));
		Be(n, 4);
	}
	m_buf.append(v.data(), v.size());
	return *this;
}

Writer& Writer::Array(uint32_t n)
{
	if (n < 16)
	{
		m_buf.push_back(static_cast<char>(0x90 | n));
	}
	else if (n <= 0xffff)
	{
		m_buf.push_back(static_cast<char>(0xdc));
		Be(n, 2);
	}
	else
	{
		m_buf.push_back(static_cast<char>(0xdd));
		Be(n, 4);
	}
	return *this;
}

Writer& Writer::Map(uint32_t n)
{
	if (n < 16)
	{
		m_buf.push_back(static_cast<char>(0x80 | n));
	}
	else if (n <= 0xffff)
	{
		m_buf.push_back(static_cast<char>(0xde));
		Be(n, 2);
	}
	else
	{
		m_buf.push_back(static_cast<char>(0xdf));
		Be(n, 4);
	}
	return *this;
}

Writer& Writer::FuncRef(std::string_view resource, int64_t id)
{
	Writer inner;
	inner.Array(2).Str(resource).Int(id);
	auto& body = inner.Data();
	m_buf.push_back(static_cast<char>(0xc7)); // ext 8
	Be(body.size(), 1);
	m_buf.push_back(static_cast<char>(kFuncRefExt));
	m_buf += body;
	return *this;
}

namespace
{
constexpr int kMaxDepth = 64;

class Parser
{
public:
	explicit Parser(std::string_view d) : m_d(d) {}

	bool Parse(Value& out, int depth)
	{
		if (depth > kMaxDepth)
		{
			return Fail("nesting too deep");
		}

		uint8_t c;
		if (!Byte(c)) return false;

		if (c <= 0x7f) { out.type = Value::Type::Int; out.i = c; return true; }
		if (c >= 0xe0) { out.type = Value::Type::Int; out.i = static_cast<int8_t>(c); return true; }
		if ((c & 0xf0) == 0x80) return ParseMap(out, c & 0x0f, depth);
		if ((c & 0xf0) == 0x90) return ParseArray(out, c & 0x0f, depth);
		if ((c & 0xe0) == 0xa0) return ParseStr(out, c & 0x1f);

		uint64_t n;
		switch (c)
		{
			case 0xc0: out.type = Value::Type::Nil; return true;
			case 0xc2: out.type = Value::Type::Bool; out.b = false; return true;
			case 0xc3: out.type = Value::Type::Bool; out.b = true; return true;
			case 0xc4: return Uint(n, 1) && ParseStr(out, n);
			case 0xc5: return Uint(n, 2) && ParseStr(out, n);
			case 0xc6: return Uint(n, 4) && ParseStr(out, n);
			case 0xc7: return Uint(n, 1) && ParseExt(out, n, depth);
			case 0xc8: return Uint(n, 2) && ParseExt(out, n, depth);
			case 0xc9: return Uint(n, 4) && ParseExt(out, n, depth);
			case 0xca:
			{
				if (!Uint(n, 4)) return false;
				uint32_t bits = static_cast<uint32_t>(n);
				float f;
				std::memcpy(&f, &bits, 4);
				out.type = Value::Type::Double;
				out.d = f;
				return true;
			}
			case 0xcb:
			{
				if (!Uint(n, 8)) return false;
				std::memcpy(&out.d, &n, 8);
				out.type = Value::Type::Double;
				return true;
			}
			case 0xcc: out.type = Value::Type::Int; return Uint(n, 1) && (out.i = static_cast<int64_t>(n), true);
			case 0xcd: out.type = Value::Type::Int; return Uint(n, 2) && (out.i = static_cast<int64_t>(n), true);
			case 0xce: out.type = Value::Type::Int; return Uint(n, 4) && (out.i = static_cast<int64_t>(n), true);
			case 0xcf:
				if (!Uint(n, 8)) return false;
				if (n > static_cast<uint64_t>(INT64_MAX))
				{
					out.type = Value::Type::Double;
					out.d = static_cast<double>(n);
				}
				else
				{
					out.type = Value::Type::Int;
					out.i = static_cast<int64_t>(n);
				}
				return true;
			case 0xd0: out.type = Value::Type::Int; return Uint(n, 1) && (out.i = static_cast<int8_t>(n), true);
			case 0xd1: out.type = Value::Type::Int; return Uint(n, 2) && (out.i = static_cast<int16_t>(n), true);
			case 0xd2: out.type = Value::Type::Int; return Uint(n, 4) && (out.i = static_cast<int32_t>(n), true);
			case 0xd3: out.type = Value::Type::Int; return Uint(n, 8) && (out.i = static_cast<int64_t>(n), true);
			case 0xd4: return ParseExt(out, 1, depth);
			case 0xd5: return ParseExt(out, 2, depth);
			case 0xd6: return ParseExt(out, 4, depth);
			case 0xd7: return ParseExt(out, 8, depth);
			case 0xd8: return ParseExt(out, 16, depth);
			case 0xd9: return Uint(n, 1) && ParseStr(out, n);
			case 0xda: return Uint(n, 2) && ParseStr(out, n);
			case 0xdb: return Uint(n, 4) && ParseStr(out, n);
			case 0xdc: return Uint(n, 2) && ParseArray(out, n, depth);
			case 0xdd: return Uint(n, 4) && ParseArray(out, n, depth);
			case 0xde: return Uint(n, 2) && ParseMap(out, n, depth);
			case 0xdf: return Uint(n, 4) && ParseMap(out, n, depth);
		}
		return Fail("invalid type byte");
	}

	bool AtEnd() const { return m_pos == m_d.size(); }
	const std::string& Error() const { return m_error; }

private:
	bool Fail(const char* msg)
	{
		if (m_error.empty()) m_error = msg;
		return false;
	}

	bool Byte(uint8_t& c)
	{
		if (m_pos >= m_d.size()) return Fail("unexpected end of data");
		c = static_cast<uint8_t>(m_d[m_pos++]);
		return true;
	}

	bool Uint(uint64_t& out, int bytes)
	{
		if (m_d.size() - m_pos < static_cast<size_t>(bytes)) return Fail("unexpected end of data");
		out = 0;
		for (int i = 0; i < bytes; i++)
		{
			out = (out << 8) | static_cast<uint8_t>(m_d[m_pos++]);
		}
		return true;
	}

	bool ParseStr(Value& out, uint64_t n)
	{
		if (m_d.size() - m_pos < n) return Fail("string exceeds data");
		out.type = Value::Type::String;
		out.s.assign(m_d.substr(m_pos, n));
		m_pos += n;
		return true;
	}

	bool ParseArray(Value& out, uint64_t n, int depth)
	{
		// every element takes at least one byte; reject impossible counts early
		if (n > m_d.size() - m_pos) return Fail("array length exceeds data");
		out.type = Value::Type::Array;
		out.array.resize(n);
		for (auto& v : out.array)
		{
			if (!Parse(v, depth + 1)) return false;
		}
		return true;
	}

	bool ParseMap(Value& out, uint64_t n, int depth)
	{
		if (n * 2 > m_d.size() - m_pos) return Fail("map length exceeds data");
		out.type = Value::Type::Map;
		out.map.resize(n);
		for (auto& [k, v] : out.map)
		{
			if (!Parse(k, depth + 1) || !Parse(v, depth + 1)) return false;
		}
		return true;
	}

	bool ParseExt(Value& out, uint64_t n, int depth)
	{
		uint8_t type;
		if (!Byte(type)) return false;
		if (m_d.size() - m_pos < n) return Fail("ext exceeds data");
		auto body = m_d.substr(m_pos, n);
		m_pos += n;

		if (static_cast<int8_t>(type) != kFuncRefExt)
		{
			out.type = Value::Type::Nil; // unknown extension types decode as nil
			return true;
		}

		Parser inner(body);
		Value v;
		if (!inner.Parse(v, depth + 1) || v.type != Value::Type::Array || v.array.size() != 2 ||
			v.array[0].type != Value::Type::String || v.array[1].type != Value::Type::Int)
		{
			return Fail("malformed function reference");
		}
		out.type = Value::Type::FuncRef;
		out.s = v.array[0].s;
		out.i = v.array[1].i;
		return true;
	}

	std::string_view m_d;
	size_t m_pos = 0;
	std::string m_error;
};

// Classifies a table at idx: returns true for a sequence 1..n (n stored in len).
bool IsArray(lua_State* L, int idx, lua_Integer& len)
{
	lua_Integer count = 0;
	lua_Integer max = 0;
	bool array = true;

	lua_pushnil(L);
	while (lua_next(L, idx) != 0)
	{
		count++;
		if (array)
		{
			if (lua_isinteger(L, -2) && lua_tointeger(L, -2) >= 1)
			{
				max = std::max(max, lua_tointeger(L, -2));
			}
			else
			{
				array = false;
			}
		}
		lua_pop(L, 1);
	}

	len = count;
	return array && max == count;
}

void PackValue(lua_State* L, int idx, Writer& w, FuncRefCodec* codec, int depth)
{
	if (depth > kMaxDepth)
	{
		luaL_error(L, "cannot serialize: nesting too deep (cyclic table?)");
	}

	idx = lua_absindex(L, idx);
	switch (lua_type(L, idx))
	{
		case LUA_TNIL:
		case LUA_TNONE:
			w.Nil();
			return;
		case LUA_TBOOLEAN:
			w.Bool(lua_toboolean(L, idx));
			return;
		case LUA_TNUMBER:
			if (lua_isinteger(L, idx))
				w.Int(lua_tointeger(L, idx));
			else
				w.Double(lua_tonumber(L, idx));
			return;
		case LUA_TSTRING:
		{
			size_t len;
			const char* s = lua_tolstring(L, idx, &len);
			w.Str(std::string_view(s, len));
			return;
		}
		case LUA_TFUNCTION:
			if (!codec)
			{
				luaL_error(L, "cannot serialize a function here");
			}
			w.FuncRef(codec->OwnerName(), codec->ExportFunction(L, idx));
			return;
		case LUA_TTABLE:
		{
			std::string res;
			int64_t id;
			if (codec && codec->GetProxyIdentity(L, idx, res, id))
			{
				w.FuncRef(res, id);
				return;
			}

			luaL_checkstack(L, 4, "serialization");
			lua_Integer len;
			if (IsArray(L, idx, len))
			{
				w.Array(static_cast<uint32_t>(len));
				for (lua_Integer i = 1; i <= len; i++)
				{
					lua_rawgeti(L, idx, i);
					PackValue(L, -1, w, codec, depth + 1);
					lua_pop(L, 1);
				}
			}
			else
			{
				w.Map(static_cast<uint32_t>(len));
				lua_pushnil(L);
				while (lua_next(L, idx) != 0)
				{
					PackValue(L, -2, w, codec, depth + 1);
					PackValue(L, -1, w, codec, depth + 1);
					lua_pop(L, 1);
				}
			}
			return;
		}
		default:
			luaL_error(L, "cannot serialize a value of type %s", luaL_typename(L, idx));
	}
}

void PushValue(lua_State* L, const Value& v, FuncRefCodec* codec)
{
	luaL_checkstack(L, 4, "deserialization");
	switch (v.type)
	{
		case Value::Type::Nil: lua_pushnil(L); return;
		case Value::Type::Bool: lua_pushboolean(L, v.b); return;
		case Value::Type::Int: lua_pushinteger(L, v.i); return;
		case Value::Type::Double: lua_pushnumber(L, v.d); return;
		case Value::Type::String: lua_pushlstring(L, v.s.data(), v.s.size()); return;
		case Value::Type::Array:
			lua_createtable(L, static_cast<int>(v.array.size()), 0);
			for (size_t i = 0; i < v.array.size(); i++)
			{
				PushValue(L, v.array[i], codec);
				lua_rawseti(L, -2, static_cast<lua_Integer>(i + 1));
			}
			return;
		case Value::Type::Map:
			lua_createtable(L, 0, static_cast<int>(v.map.size()));
			for (auto& [k, val] : v.map)
			{
				PushValue(L, k, codec);
				if (lua_isnil(L, -1) || (lua_type(L, -1) == LUA_TNUMBER && std::isnan(lua_tonumber(L, -1))))
				{
					lua_pop(L, 1); // invalid Lua table key, drop the pair
					continue;
				}
				PushValue(L, val, codec);
				lua_rawset(L, -3);
			}
			return;
		case Value::Type::FuncRef:
			if (codec)
				codec->PushFuncRef(L, v.s, v.i);
			else
				lua_pushnil(L);
			return;
	}
}
}

bool Decode(std::string_view data, Value& out, std::string& error)
{
	Parser p(data);
	if (!p.Parse(out, 0))
	{
		error = p.Error();
		return false;
	}
	if (!p.AtEnd())
	{
		error = "trailing data after document";
		return false;
	}
	return true;
}

std::string PackLua(lua_State* L, int first, int count, FuncRefCodec* codec)
{
	Writer w;
	w.Array(static_cast<uint32_t>(count));
	for (int i = 0; i < count; i++)
	{
		PackValue(L, first + i, w, codec, 0);
	}
	return w.Data();
}

int UnpackLua(lua_State* L, std::string_view data, FuncRefCodec* codec)
{
	if (data.empty())
	{
		return 0;
	}

	Value v;
	std::string error;
	if (!Decode(data, v, error))
	{
		return luaL_error(L, "malformed argument payload: %s", error.c_str());
	}

	if (v.type != Value::Type::Array)
	{
		// a lone value is treated as a single argument
		PushValue(L, v, codec);
		return 1;
	}

	luaL_checkstack(L, static_cast<int>(v.array.size()) + 4, "too many arguments");
	for (auto& a : v.array)
	{
		PushValue(L, a, codec);
	}
	return static_cast<int>(v.array.size());
}
}

namespace jays::luajson
{
namespace
{
void EncodeString(std::string& out, std::string_view s)
{
	out += '"';
	for (unsigned char c : s)
	{
		switch (c)
		{
			case '"': out += "\\\""; break;
			case '\\': out += "\\\\"; break;
			case '\n': out += "\\n"; break;
			case '\r': out += "\\r"; break;
			case '\t': out += "\\t"; break;
			case '\b': out += "\\b"; break;
			case '\f': out += "\\f"; break;
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
	out += '"';
}

void EncodeNumber(std::string& out, lua_State* L, int idx)
{
	char buf[64];
	if (lua_isinteger(L, idx))
	{
		std::snprintf(buf, sizeof(buf), "%lld", static_cast<long long>(lua_tointeger(L, idx)));
	}
	else
	{
		double d = lua_tonumber(L, idx);
		if (!std::isfinite(d))
		{
			out += "null";
			return;
		}
		std::snprintf(buf, sizeof(buf), "%.14g", d);
	}
	out += buf;
}

void Encode(lua_State* L, int idx, std::string& out, int depth)
{
	if (depth > 64)
	{
		luaL_error(L, "json.encode: nesting too deep (cyclic table?)");
	}

	idx = lua_absindex(L, idx);
	switch (lua_type(L, idx))
	{
		case LUA_TNIL: out += "null"; return;
		case LUA_TBOOLEAN: out += lua_toboolean(L, idx) ? "true" : "false"; return;
		case LUA_TNUMBER: EncodeNumber(out, L, idx); return;
		case LUA_TSTRING:
		{
			size_t len;
			const char* s = lua_tolstring(L, idx, &len);
			EncodeString(out, std::string_view(s, len));
			return;
		}
		case LUA_TTABLE:
		{
			luaL_checkstack(L, 4, "json.encode");
			lua_Integer len = 0;
			lua_Integer count = 0;
			lua_Integer max = 0;
			bool array = true;
			lua_pushnil(L);
			while (lua_next(L, idx) != 0)
			{
				count++;
				if (lua_isinteger(L, -2) && lua_tointeger(L, -2) >= 1)
					max = std::max(max, lua_tointeger(L, -2));
				else
					array = false;
				lua_pop(L, 1);
			}
			array = array && max == count;
			len = count;

			if (array)
			{
				out += '[';
				for (lua_Integer i = 1; i <= len; i++)
				{
					if (i > 1) out += ',';
					lua_rawgeti(L, idx, i);
					Encode(L, -1, out, depth + 1);
					lua_pop(L, 1);
				}
				out += ']';
			}
			else
			{
				out += '{';
				bool first = true;
				lua_pushnil(L);
				while (lua_next(L, idx) != 0)
				{
					if (!first) out += ',';
					first = false;
					if (lua_type(L, -2) == LUA_TSTRING)
					{
						size_t klen;
						const char* k = lua_tolstring(L, -2, &klen);
						EncodeString(out, std::string_view(k, klen));
					}
					else if (lua_type(L, -2) == LUA_TNUMBER)
					{
						std::string num;
						EncodeNumber(num, L, -2);
						EncodeString(out, num);
					}
					else
					{
						luaL_error(L, "json.encode: unsupported key type %s", luaL_typename(L, -2));
					}
					out += ':';
					Encode(L, -1, out, depth + 1);
					lua_pop(L, 1);
				}
				out += '}';
			}
			return;
		}
		default:
			luaL_error(L, "json.encode: cannot encode value of type %s", luaL_typename(L, idx));
	}
}

class JsonDecoder
{
public:
	JsonDecoder(lua_State* L, std::string_view s) : L(L), m_s(s) {}

	bool Run()
	{
		if (!Value(0)) return false;
		Skip();
		if (m_pos != m_s.size()) return Fail("trailing characters");
		return true;
	}

	std::string error;

private:
	bool Fail(const std::string& msg)
	{
		if (error.empty()) error = msg + " at position " + std::to_string(m_pos);
		return false;
	}

	void Skip()
	{
		while (m_pos < m_s.size() && (m_s[m_pos] == ' ' || m_s[m_pos] == '\t' || m_s[m_pos] == '\n' || m_s[m_pos] == '\r'))
			m_pos++;
	}

	bool Literal(std::string_view word)
	{
		if (m_s.substr(m_pos, word.size()) != word) return Fail("invalid literal");
		m_pos += word.size();
		return true;
	}

	static void AppendUtf8(std::string& out, uint32_t cp)
	{
		if (cp < 0x80) out += static_cast<char>(cp);
		else if (cp < 0x800) { out += static_cast<char>(0xC0 | (cp >> 6)); out += static_cast<char>(0x80 | (cp & 0x3F)); }
		else if (cp < 0x10000) { out += static_cast<char>(0xE0 | (cp >> 12)); out += static_cast<char>(0x80 | ((cp >> 6) & 0x3F)); out += static_cast<char>(0x80 | (cp & 0x3F)); }
		else { out += static_cast<char>(0xF0 | (cp >> 18)); out += static_cast<char>(0x80 | ((cp >> 12) & 0x3F)); out += static_cast<char>(0x80 | ((cp >> 6) & 0x3F)); out += static_cast<char>(0x80 | (cp & 0x3F)); }
	}

	bool Hex4(uint32_t& out)
	{
		if (m_s.size() - m_pos < 4) return Fail("bad unicode escape");
		out = 0;
		for (int i = 0; i < 4; i++)
		{
			char c = m_s[m_pos++];
			out <<= 4;
			if (c >= '0' && c <= '9') out |= c - '0';
			else if (c >= 'a' && c <= 'f') out |= c - 'a' + 10;
			else if (c >= 'A' && c <= 'F') out |= c - 'A' + 10;
			else return Fail("bad unicode escape");
		}
		return true;
	}

	bool String(std::string& out)
	{
		m_pos++; // opening quote
		while (m_pos < m_s.size())
		{
			char c = m_s[m_pos++];
			if (c == '"') return true;
			if (c != '\\') { out += c; continue; }
			if (m_pos >= m_s.size()) break;
			char e = m_s[m_pos++];
			switch (e)
			{
				case '"': out += '"'; break;
				case '\\': out += '\\'; break;
				case '/': out += '/'; break;
				case 'b': out += '\b'; break;
				case 'f': out += '\f'; break;
				case 'n': out += '\n'; break;
				case 'r': out += '\r'; break;
				case 't': out += '\t'; break;
				case 'u':
				{
					uint32_t cp;
					if (!Hex4(cp)) return false;
					if (cp >= 0xD800 && cp <= 0xDBFF && m_s.substr(m_pos, 2) == "\\u")
					{
						m_pos += 2;
						uint32_t lo;
						if (!Hex4(lo)) return false;
						cp = 0x10000 + ((cp - 0xD800) << 10) + (lo - 0xDC00);
					}
					AppendUtf8(out, cp);
					break;
				}
				default: return Fail("invalid escape");
			}
		}
		return Fail("unterminated string");
	}

	bool Number()
	{
		size_t start = m_pos;
		bool isFloat = false;
		if (m_s[m_pos] == '-') m_pos++;
		while (m_pos < m_s.size())
		{
			char c = m_s[m_pos];
			if (c >= '0' && c <= '9') m_pos++;
			else if (c == '.' || c == 'e' || c == 'E' || c == '+' || c == '-') { isFloat = true; m_pos++; }
			else break;
		}
		std::string text(m_s.substr(start, m_pos - start));
		char* end = nullptr;
		if (!isFloat)
		{
			errno = 0;
			long long v = std::strtoll(text.c_str(), &end, 10);
			if (end && *end == '\0' && errno == 0)
			{
				lua_pushinteger(L, v);
				return true;
			}
		}
		double d = std::strtod(text.c_str(), &end);
		if (!end || *end != '\0' || text.empty()) return Fail("invalid number");
		lua_pushnumber(L, d);
		return true;
	}

	bool Value(int depth)
	{
		if (depth > 64) return Fail("nesting too deep");
		luaL_checkstack(L, 4, "json.decode");
		Skip();
		if (m_pos >= m_s.size()) return Fail("unexpected end of input");

		char c = m_s[m_pos];
		if (c == '{')
		{
			m_pos++;
			lua_newtable(L);
			Skip();
			if (m_pos < m_s.size() && m_s[m_pos] == '}') { m_pos++; return true; }
			for (;;)
			{
				Skip();
				if (m_pos >= m_s.size() || m_s[m_pos] != '"') return Fail("expected string key");
				std::string key;
				if (!String(key)) return false;
				Skip();
				if (m_pos >= m_s.size() || m_s[m_pos] != ':') return Fail("expected ':'");
				m_pos++;
				lua_pushlstring(L, key.data(), key.size());
				if (!Value(depth + 1)) return false;
				lua_rawset(L, -3);
				Skip();
				if (m_pos < m_s.size() && m_s[m_pos] == ',') { m_pos++; continue; }
				if (m_pos < m_s.size() && m_s[m_pos] == '}') { m_pos++; return true; }
				return Fail("expected ',' or '}'");
			}
		}
		if (c == '[')
		{
			m_pos++;
			lua_newtable(L);
			Skip();
			if (m_pos < m_s.size() && m_s[m_pos] == ']') { m_pos++; return true; }
			for (lua_Integer i = 1;; i++)
			{
				if (!Value(depth + 1)) return false;
				lua_rawseti(L, -2, i);
				Skip();
				if (m_pos < m_s.size() && m_s[m_pos] == ',') { m_pos++; continue; }
				if (m_pos < m_s.size() && m_s[m_pos] == ']') { m_pos++; return true; }
				return Fail("expected ',' or ']'");
			}
		}
		if (c == '"')
		{
			std::string s;
			if (!String(s)) return false;
			lua_pushlstring(L, s.data(), s.size());
			return true;
		}
		if (c == 't') { if (!Literal("true")) return false; lua_pushboolean(L, 1); return true; }
		if (c == 'f') { if (!Literal("false")) return false; lua_pushboolean(L, 0); return true; }
		if (c == 'n') { if (!Literal("null")) return false; lua_pushnil(L); return true; }
		if (c == '-' || (c >= '0' && c <= '9')) return Number();
		return Fail("unexpected character");
	}

	lua_State* L;
	std::string_view m_s;
	size_t m_pos = 0;
};

int JsonEncode(lua_State* L)
{
	std::string out;
	Encode(L, 1, out, 0);
	lua_pushlstring(L, out.data(), out.size());
	return 1;
}

// Returns the decoded value, or nil plus an error message (like dkjson).
int JsonDecode(lua_State* L)
{
	size_t len;
	const char* s = luaL_checklstring(L, 1, &len);
	int top = lua_gettop(L);
	JsonDecoder d(L, std::string_view(s, len));
	if (!d.Run())
	{
		lua_settop(L, top);
		lua_pushnil(L);
		lua_pushstring(L, d.error.c_str());
		return 2;
	}
	return 1;
}
}

void Register(lua_State* L)
{
	lua_newtable(L);
	lua_pushcfunction(L, JsonEncode);
	lua_setfield(L, -2, "encode");
	lua_pushcfunction(L, JsonDecode);
	lua_setfield(L, -2, "decode");
	lua_setglobal(L, "json");
}
}
