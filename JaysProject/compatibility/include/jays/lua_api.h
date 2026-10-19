#pragma once

// Lua is compiled as C++ (see CMakeLists.txt) so that lua_error unwinds with
// C++ exceptions and runs destructors. Therefore the headers are included
// without an extern "C" block.
#include <lauxlib.h>
#include <lua.h>
#include <lualib.h>
