#pragma once

// Minimal self-contained test harness (no external dependencies).
#include <functional>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

namespace jt
{
struct TestCase
{
	const char* name;
	std::function<void()> fn;
};

inline std::vector<TestCase>& Registry()
{
	static std::vector<TestCase> tests;
	return tests;
}

struct Registrar
{
	Registrar(const char* name, std::function<void()> fn) { Registry().push_back({ name, std::move(fn) }); }
};

struct Failure
{
	std::string message;
};

inline int& CheckCount()
{
	static int n = 0;
	return n;
}
}

#define JT_CONCAT2(a, b) a##b
#define JT_CONCAT(a, b) JT_CONCAT2(a, b)

#define TEST(name)                                                                  \
	static void name();                                                             \
	static jt::Registrar JT_CONCAT(reg_, name)(#name, name);                        \
	static void name()

#define CHECK(cond)                                                                 \
	do                                                                              \
	{                                                                               \
		jt::CheckCount()++;                                                         \
		if (!(cond))                                                                \
		{                                                                           \
			std::ostringstream os_;                                                 \
			os_ << __FILE__ << ":" << __LINE__ << ": CHECK(" #cond ") failed";      \
			throw jt::Failure{ os_.str() };                                         \
		}                                                                           \
	} while (0)

#define CHECK_EQ(a, b)                                                              \
	do                                                                              \
	{                                                                               \
		jt::CheckCount()++;                                                         \
		auto va_ = (a);                                                             \
		auto vb_ = (b);                                                             \
		if (!(va_ == vb_))                                                          \
		{                                                                           \
			std::ostringstream os_;                                                 \
			os_ << __FILE__ << ":" << __LINE__ << ": CHECK_EQ(" #a ", " #b ") failed: [" << va_ << "] != [" << vb_ << "]"; \
			throw jt::Failure{ os_.str() };                                         \
		}                                                                           \
	} while (0)
