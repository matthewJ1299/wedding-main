#!/bin/sh
set -e
if [ -n "$DATABASE_PATH" ]; then
  mkdir -p "$(dirname "$DATABASE_PATH")"
fi
if [ -n "$UPLOAD_DIR" ]; then
  mkdir -p "$UPLOAD_DIR"
fi
if [ -n "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
fi
exec node server.js
