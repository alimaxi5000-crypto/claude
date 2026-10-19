#pragma once

#include <cstdint>
#include <string>
#include <string_view>
#include <utility>
#include <vector>

struct lua_State;

// MessagePack (https://msgpack.org/) encoding used for event and export
// arguments. Every payload is a top-level array of arguments. Functions are
// encoded as ext type 10 holding [resource name, reference id].
namespace jays::mp
{
constexpr int8_t kFuncRefExt = 10;

class Writer
{
public:
	Writer& Nil();
	Writer& Bool(bool v);
	Writer& Int(int64_t v);
	Writer& Double(double v);
	Writer& Str(std::string_view v);
	Writer& Array(uint32_t n);
	Writer& Map(uint32_t n);
	Writer& FuncRef(std::string_view resource, int64_t id);

	const std::string& Data() const { return m_buf; }

private:
	void Be(uint64_t v, int bytes);
	std::string m_buf;
};

struct Value
{
	enum class Type
	{
		Nil,
		Bool,
		Int,
		Double,
		String,
		Array,
		Map,
		FuncRef,
	};

	Type type = Type::Nil;
	bool b = false;
	int64_t i = 0;
	double d = 0;
	std::string s; // string, or resource for FuncRef (id in `i`)
	std::vector<Value> array;
	std::vector<std::pair<Value, Value>> map;
};

// Decodes a complete msgpack document. Returns false on malformed input.
bool Decode(std::string_view data, Value& out, std::string& error);

// Hooks the runtime provides to (de)serialize Lua functions.
class FuncRefCodec
{
public:
	virtual ~FuncRefCodec() = default;
	virtual const std::string& OwnerName() const = 0;
	// Registers the function at idx and returns its id.
	virtual int64_t ExportFunction(lua_State* L, int idx) = 0;
	// If the value at idx is a proxy for another resource's function, returns its identity.
	virtual bool GetProxyIdentity(lua_State* L, int idx, std::string& resource, int64_t& id) = 0;
	// Pushes a callable for (resource, id). Resolves to the original function when local.
	virtual void PushFuncRef(lua_State* L, const std::string& resource, int64_t id) = 0;
};

// Packs Lua values [first, first+count) as an argument array. Raises a Lua error on failure.
std::string PackLua(lua_State* L, int first, int count, FuncRefCodec* codec);

// Pushes the arguments in `data`. Returns the number of values pushed. Raises a Lua error on malformed input.
int UnpackLua(lua_State* L, std::string_view data, FuncRefCodec* codec);
}

namespace jays::luajson
{
// Registers the global `json` table with `encode` and `decode`.
void Register(lua_State* L);
}
