#!/usr/bin/env sh

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
APP="$SCRIPT_DIR/index.html"

if [ ! -f "$APP" ]; then
  echo "index.html not found: $APP" >&2
  exit 1
fi

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$APP"
  exit 0
fi

if command -v gio >/dev/null 2>&1; then
  gio open "$APP"
  exit 0
fi

echo "Open this file in your browser: $APP"
