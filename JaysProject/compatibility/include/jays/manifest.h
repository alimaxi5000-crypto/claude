#pragma once

#include <map>
#include <memory>
#include <string>
#include <string_view>
#include <utility>
#include <vector>

namespace jays
{
// Abstract read-only view over a resource's files. Paths are relative and use '/'.
class FileSource
{
public:
	virtual ~FileSource() = default;
	virtual bool Read(const std::string& path, std::string& out) const = 0;
	virtual std::vector<std::string> List() const = 0;
	virtual std::string Describe() const = 0;
};

// Files on disk below `root`. Rejects absolute paths and `..` traversal.
class DiskFileSource final : public FileSource
{
public:
	explicit DiskFileSource(std::string root) : m_root(std::move(root)) {}
	bool Read(const std::string& path, std::string& out) const override;
	std::vector<std::string> List() const override;
	std::string Describe() const override { return m_root; }
	const std::string& Root() const { return m_root; }

private:
	std::string m_root;
};

// Files held in memory (resources received from a server).
class MemoryFileSource final : public FileSource
{
public:
	void Add(const std::string& path, std::string content) { m_files[path] = std::move(content); }
	bool Read(const std::string& path, std::string& out) const override;
	std::vector<std::string> List() const override;
	std::string Describe() const override { return "<memory>"; }

private:
	std::map<std::string, std::string> m_files;
};

// Rejects empty, absolute and parent-traversing paths.
bool IsSafeRelativePath(std::string_view path);

// Glob match: `*` and `?` stay within one path segment, `**` crosses segments.
bool GlobMatch(std::string_view pattern, std::string_view path);

// Expands a manifest file entry. Literal entries (no wildcard) and
// `@resource/...` references are returned as-is so missing files are reported
// at load time; wildcard entries return sorted matches.
std::vector<std::string> ExpandFileEntry(const FileSource& files, const std::string& entry);

// Ordered metadata collected from fxmanifest.lua / __resource.lua.
struct Manifest
{
	std::vector<std::pair<std::string, std::string>> entries;
	bool isCfxV2 = false; // true when loaded from fxmanifest.lua

	std::vector<std::string> Values(const std::string& key) const;
	std::string First(const std::string& key, const std::string& fallback = "") const;
	void Add(std::string key, std::string value) { entries.emplace_back(std::move(key), std::move(value)); }
};

// Executes manifest code in an isolated Lua state using the FiveM manifest
// DSL semantics: any unknown global is a metadata directive; table arguments
// add one entry per element with a single trailing 's' removed from the key.
bool ParseManifest(const std::string& chunkName, const std::string& code, Manifest& out, std::string& error);

// Tries fxmanifest.lua, then __resource.lua.
bool LoadManifest(const FileSource& files, Manifest& out, std::string& manifestFile, std::string& error);

// Dependencies of a resource (`dependency` + `dependencie`, see EvidenceLedger F-012).
std::vector<std::string> ManifestDependencies(const Manifest& m);
}
