cmake_minimum_required(VERSION 3.20)
project(JaysProject VERSION 0.1.0 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

option(JAYS_BUILD_TESTS "Build unit tests" ON)

# --- Lua 5.4.7, compiled as C++ so lua_error unwinds C++ frames -------------
file(GLOB LUA_SOURCES ${CMAKE_SOURCE_DIR}/third_party/lua/src/*.c)
set_source_files_properties(${LUA_SOURCES} PROPERTIES LANGUAGE CXX)
add_library(jays_lua STATIC ${LUA_SOURCES})
target_include_directories(jays_lua PUBLIC ${CMAKE_SOURCE_DIR}/third_party/lua/src)
if(UNIX)
  target_compile_definitions(jays_lua PUBLIC LUA_USE_POSIX)
endif()
if(MSVC)
  target_compile_options(jays_lua PRIVATE /W0)
else()
  target_compile_options(jays_lua PRIVATE -w)
endif()

if(MSVC)
  set(JAYS_WARNINGS /W4 /permissive-)
else()
  set(JAYS_WARNINGS -Wall -Wextra -Wno-unused-parameter)
endif()

# --- shared: logging, config, sockets, protocol ------------------------------
add_library(jays_shared STATIC
  shared/src/log.cpp
  shared/src/json_writer.cpp
  shared/src/config.cpp
  shared/src/net.cpp
  shared/src/protocol.cpp
  shared/src/console_input.cpp)
target_include_directories(jays_shared PUBLIC shared/include)
target_compile_options(jays_shared PRIVATE ${JAYS_WARNINGS})
if(WIN32)
  target_link_libraries(jays_shared PUBLIC ws2_32)
else()
  find_package(Threads REQUIRED)
  target_link_libraries(jays_shared PUBLIC Threads::Threads)
endif()

# --- compatibility: manifest, Lua runtime, resources ------------------------
set(BOOTSTRAP_HEADER ${CMAKE_BINARY_DIR}/generated/bootstrap_lua.h)
add_custom_command(
  OUTPUT ${BOOTSTRAP_HEADER}
  COMMAND ${CMAKE_COMMAND} -DINPUT=${CMAKE_SOURCE_DIR}/compatibility/lua/bootstrap.lua
          -DOUTPUT=${BOOTSTRAP_HEADER} -DNAME=kBootstrapLua -P ${CMAKE_SOURCE_DIR}/tools/cmake/embed.cmake
  DEPENDS ${CMAKE_SOURCE_DIR}/compatibility/lua/bootstrap.lua ${CMAKE_SOURCE_DIR}/tools/cmake/embed.cmake
  COMMENT "Embedding Lua bootstrap")

add_library(jays_compat STATIC
  compatibility/src/manifest.cpp
  compatibility/src/serialization.cpp
  compatibility/src/runtime.cpp
  compatibility/src/resource_manager.cpp
  ${BOOTSTRAP_HEADER})
target_include_directories(jays_compat PUBLIC compatibility/include PRIVATE ${CMAKE_BINARY_DIR}/generated)
target_link_libraries(jays_compat PUBLIC jays_shared jays_lua)
target_compile_options(jays_compat PRIVATE ${JAYS_WARNINGS})

# --- executables --------------------------------------------------------------
if(EXISTS ${CMAKE_SOURCE_DIR}/server/src/main.cpp)
  file(GLOB SERVER_SOURCES server/src/*.cpp)
  add_executable(jays-server ${SERVER_SOURCES})
  target_link_libraries(jays-server PRIVATE jays_compat)
  target_compile_options(jays-server PRIVATE ${JAYS_WARNINGS})
endif()

if(EXISTS ${CMAKE_SOURCE_DIR}/client/src/main.cpp)
  file(GLOB CLIENT_SOURCES client/src/*.cpp)
  add_executable(jays-client ${CLIENT_SOURCES})
  target_link_libraries(jays-client PRIVATE jays_compat)
  target_compile_options(jays-client PRIVATE ${JAYS_WARNINGS})
endif()

# --- tests --------------------------------------------------------------------
if(JAYS_BUILD_TESTS)
  enable_testing()
  file(GLOB UNIT_TEST_SOURCES tests/unit/*.cpp)
  add_executable(jays-unit-tests ${UNIT_TEST_SOURCES})
  target_link_libraries(jays-unit-tests PRIVATE jays_compat)
  target_compile_definitions(jays-unit-tests PRIVATE JAYS_TEST_DATA_DIR="${CMAKE_SOURCE_DIR}/tests/data")
  add_test(NAME unit COMMAND jays-unit-tests)

  find_package(Python3 COMPONENTS Interpreter)
  if(Python3_FOUND AND TARGET jays-server AND TARGET jays-client)
    add_test(NAME integration
      COMMAND ${Python3_EXECUTABLE} ${CMAKE_SOURCE_DIR}/tests/integration/test_e2e.py
              --bin-dir $<TARGET_FILE_DIR:jays-server> --project-dir ${CMAKE_SOURCE_DIR})
  endif()
endif()
