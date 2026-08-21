#!/bin/zsh

set -e

PROJECT_DIR="${0:A:h}"
BUNDLED_NODE_BIN="/Users/shubhamsingh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
BUNDLED_TOOLS_BIN="/Users/shubhamsingh/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback"

cd "$PROJECT_DIR"

if [[ -x "$BUNDLED_NODE_BIN/node" ]]; then
  export PATH="$BUNDLED_NODE_BIN:$BUNDLED_TOOLS_BIN:$PATH"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "BuildCore could not find Node.js. Please open this project in Codex and try again."
  read -k 1 "?Press any key to close..."
  exit 1
fi

NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
if (( NODE_MAJOR < 22 )); then
  echo "BuildCore needs Node.js 22 or newer. Please open this project in Codex and try again."
  read -k 1 "?Press any key to close..."
  exit 1
fi

echo "Starting BuildCore locally..."
echo "Keep this window open while using the demo."
echo

HAS_OPENED=0

npm run dev -- --hostname 127.0.0.1 --port 3000 2>&1 | while IFS= read -r line; do
  print -r -- "$line"

  if (( HAS_OPENED == 0 )) && [[ "$line" == *"http://127.0.0.1:3000"* ]]; then
    HAS_OPENED=1
    open http://localhost:3000/
  fi
done
