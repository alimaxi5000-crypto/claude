# Usage: cmake -DINPUT=<file> -DOUTPUT=<header> -DNAME=<symbol> -P embed.cmake
file(READ "${INPUT}" HEX HEX)
string(LENGTH "${HEX}" HEXLEN)
math(EXPR SIZE "${HEXLEN} / 2")
string(REGEX REPLACE "([0-9a-f][0-9a-f])" "0x\\1," BYTES "${HEX}")
string(REGEX REPLACE "((0x[0-9a-f][0-9a-f],){24})" "\\1\n" BYTES "${BYTES}")
file(WRITE "${OUTPUT}" "// generated from ${INPUT}\n#pragma once\n#include <cstddef>\nstatic const unsigned char ${NAME}[] = {\n${BYTES}\n};\nstatic const size_t ${NAME}Size = ${SIZE};\n")
