#include <jays/manifest.h>

#include <algorithm>
#include <chrono>
#include <filesystem>
#include <fstream>
#include <sstream>

#include <jays/lua_api.h>

namespace fs = std::filesystem;

namespace jays
{
bool IsSafeRelativePath(std::string_view path)
{
	if (path.empty() || path[0] == '/' || path[0] == '\\' || path.find(':') != std::string_view::npos)
	{
		return false;
	}

	size_t start = 0;
	while (start <= path.size())
	{
		auto end = path.find_first_of("/\\", start);
		auto seg = path.substr(start, end == std::string_view::npos ? std::string_view::npos : end - start);
		if (seg == "..")
		{
			return false;
		}
		if (end == std::string_view::npos)
		{
			break;
		}
		start = end + 1;
	}
	return true;
}

bool DiskFileSource::Read(const std::string& path, std::string& out) const
{
	if (!IsSafeRelativePath(path))
	{
		return false;
	}

	std::ifstream f(fs::path(m_root) / fs::path(path), std::ios::binary);
	if (!f)
	{
		return false;
	}
	std::stringstream ss;
	ss << f.rdbuf();
	out = ss.str();
	return true;
}

std::vector<std::string> DiskFileSource::List() const
{
	std::vector<std::string> out;
	std::error_code ec;
	for (auto it = fs::recursive_directory_iterator(m_root, ec); !ec && it != fs::recursive_directory_iterator();
		 it.increment(ec))
	{
		if (it->is_regular_file(ec))
		{
			out.push_back(fs::relative(it->path(), m_root, ec).generic_string());
		}
	}
	std::sort(out.begin(), out.end());
	return out;
}

bool MemoryFileSource::Read(const std::string& path, std::string& out) const
{
	auto it = m_files.find(path);
	if (it == m_files.end())
	{
		return false;
	}
	out = it->second;
	return true;
}

std::vector<std::string> MemoryFileSource::List() const
{
	std::vector<std::string> out;
	for (auto& [k, v] : m_files)
	{
		out.push_back(k);
	}
	return out;
}

namespace
{
bool MatchImpl(std::string_view p, std::string_view s)
{
	while (!p.empty())
	{
		if (p.substr(0, 2) == "**")
		{
			auto rest = p.substr(2);
			// `**/` may also match zero directories
			if (!rest.empty() && rest[0] == '/' && MatchImpl(rest.substr(1), s))
			{
				return true;
			}
			for (size_t i = 0; i <= s.size(); i++)
			{
				if (MatchImpl(rest, s.substr(i)))
				{
					return true;
				}
			}
			return false;
		}

		if (p[0] == '*')
		{
			auto rest = p.substr(1);
			for (size_t i = 0; i <= s.size(); i++)
			{
				if (MatchImpl(rest, s.substr(i)))
				{
					return true;
				}
				if (i < s.size() && s[i] == '/')
				{
					break;
				}
			}
			return false;
		}

		if (s.empty())
		{
			return false;
		}

		if (p[0] == '?' ? s[0] == '/' : p[0] != s[0])
		{
			return false;
		}

		p.remove_prefix(1);
		s.remove_prefix(1);
	}
	return s.empty();
}
}

bool GlobMatch(std::string_view pattern, std::string_view path)
{
	return MatchImpl(pattern, path);
}

std::vector<std::string> ExpandFileEntry(const FileSource& files, const std::string& entry)
{
	if (entry.empty() || entry[0] == '@' || entry.find_first_of("*?") == std::string::npos)
	{
		return { entry };
	}

	std::vector<std::string> out;
	for (auto& path : files.List())
	{
		if (GlobMatch(entry, path))
		{
			out.push_back(path);
		}
	}
	return out;
}

std::vector<std::string> Manifest::Values(const std::string& key) const
{
	std::vector<std::string> out;
	for (auto& [k, v] : entries)
	{
		if (k == key)
		{
			out.push_back(v);
		}
	}
	return out;
}

std::string Manifest::First(const std::string& key, const std::string& fallback) const
{
	for (auto& [k, v] : entries)
	{
		if (k == key)
		{
			return v;
		}
	}
	return fallback;
}

namespace
{
struct ManifestCtx
{
	Manifest* out;
	std::chrono::steady_clock::time_point deadline;
};

ManifestCtx* Ctx(lua_State* L)
{
	return static_cast<ManifestCtx*>(lua_touserdata(L, lua_upvalueindex(1)));
}

std::string ValueToString(lua_State* L, int idx)
{
	switch (lua_type(L, idx))
	{
		case LUA_TSTRING:
		case LUA_TNUMBER:
			return lua_tostring(L, idx);
		case LUA_TBOOLEAN:
			return lua_toboolean(L, idx) ? "true" : "false";
		default:
			return luaL_tolstring(L, idx, nullptr);
	}
}

// Directive closure: upvalue(1)=ctx, upvalue(2)=key
int Directive(lua_State* L)
{
	auto* ctx = Ctx(L);
	std::string key = lua_tostring(L, lua_upvalueindex(2));

	if (lua_type(L, 1) == LUA_TTABLE)
	{
		std::string singular = key;
		if (!singular.empty() && singular.back() == 's')
		{
			singular.pop_back();
		}

		lua_Integer n = luaL_len(L, 1);
		int top = lua_gettop(L);
		for (lua_Integer i = 1; i <= n; i++)
		{
			lua_geti(L, 1, i);
			ctx->out->Add(singular, ValueToString(L, -1));
			lua_settop(L, top);
		}
	}
	else if (!lua_isnoneornil(L, 1))
	{
		ctx->out->Add(key, ValueToString(L, 1));
	}

	// returning a no-op function keeps legacy `key 'value' { extra }` syntax parseable
	lua_pushcfunction(L, [](lua_State*) { return 0; });
	return 1;
}

// _G.__index(t, k): unknown globals become directive functions
int GlobalIndex(lua_State* L)
{
	if (lua_type(L, 2) != LUA_TSTRING)
	{
		lua_pushnil(L);
		return 1;
	}
	lua_pushvalue(L, lua_upvalueindex(1));
	lua_pushvalue(L, 2);
	lua_pushcclosure(L, Directive, 2);
	return 1;
}

void DeadlineHook(lua_State* L, lua_Debug*)
{
	void* ud = *static_cast<void**>(lua_getextraspace(L));
	auto* ctx = static_cast<ManifestCtx*>(ud);
	if (std::chrono::steady_clock::now() > ctx->deadline)
	{
		luaL_error(L, "manifest execution exceeded time limit");
	}
}
}

bool ParseManifest(const std::string& chunkName, const std::string& code, Manifest& out, std::string& error)
{
	lua_State* L = luaL_newstate();
	if (!L)
	{
		error = "out of memory";
		return false;
	}

	ManifestCtx ctx{ &out, std::chrono::steady_clock::now() + std::chrono::seconds(2) };
	*static_cast<void**>(lua_getextraspace(L)) = &ctx;

	// only side-effect free libraries are available to manifests
	luaL_requiref(L, LUA_GNAME, luaopen_base, 1);
	luaL_requiref(L, LUA_STRLIBNAME, luaopen_string, 1);
	luaL_requiref(L, LUA_TABLIBNAME, luaopen_table, 1);
	luaL_requiref(L, LUA_MATHLIBNAME, luaopen_math, 1);
	lua_pop(L, 4);
	for (auto name : { "dofile", "loadfile", "load", "require", "collectgarbage" })
	{
		lua_pushnil(L);
		lua_setglobal(L, name);
	}

	lua_sethook(L, DeadlineHook, LUA_MASKCOUNT, 10000);

	bool ok = true;
	if (luaL_loadbufferx(L, code.data(), code.size(), ("@" + chunkName).c_str(), "t") != LUA_OK)
	{
		error = lua_tostring(L, -1);
		ok = false;
	}
	else
	{
		lua_pushglobaltable(L);
		lua_newtable(L);
		lua_pushlightuserdata(L, &ctx);
		lua_pushcclosure(L, GlobalIndex, 1);
		lua_setfield(L, -2, "__index");
		lua_setmetatable(L, -2);
		lua_pop(L, 1);

		if (lua_pcall(L, 0, 0, 0) != LUA_OK)
		{
			error = lua_tostring(L, -1) ? lua_tostring(L, -1) : "unknown error";
			ok = false;
		}
	}

	lua_close(L);
	return ok;
}

bool LoadManifest(const FileSource& files, Manifest& out, std::string& manifestFile, std::string& error)
{
	for (const char* name : { "fxmanifest.lua", "__resource.lua" })
	{
		std::string code;
		if (!files.Read(name, code))
		{
			continue;
		}

		manifestFile = name;
		out = Manifest{};
		out.isCfxV2 = std::string(name) == "fxmanifest.lua";
		return ParseManifest(name, code, out, error);
	}

	error = "no fxmanifest.lua or __resource.lua found in " + files.Describe();
	return false;
}

std::vector<std::string> ManifestDependencies(const Manifest& m)
{
	auto deps = m.Values("dependency");
	for (auto& d : m.Values("dependencie"))
	{
		deps.push_back(d);
	}
	return deps;
}
}
