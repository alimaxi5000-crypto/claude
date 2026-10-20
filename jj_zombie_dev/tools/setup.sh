#!/usr/bin/env bash
# One-time setup of the zombie animation toolchain (Linux/macOS/Git Bash on Windows).
# The shared parts (CodeWalker.Core + ycdtool, reference skeleton, native references) live in
# animkit and are set up by animkit/setup.sh; this script adds the lab's npm dev dependencies.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$HERE/../../animkit/setup.sh"
( cd "$HERE" && npm ci --silent --no-audit --no-fund )
echo "setup done"
