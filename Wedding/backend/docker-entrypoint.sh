#!/bin/sh
set -e
if [ -n "$UPLOAD_DIR" ]; then
  mkdir -p "$UPLOAD_DIR"
fi
if [ -n "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
fi
node src/db/run-migrations.mjs
exec node server.js
