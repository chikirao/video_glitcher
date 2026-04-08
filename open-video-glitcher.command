#!/usr/bin/env sh

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
APP="$SCRIPT_DIR/index.html"

if [ ! -f "$APP" ]; then
  echo "index.html not found: $APP"
  exit 1
fi

open "$APP"
