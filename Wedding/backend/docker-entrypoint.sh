#!/bin/sh
set -e
if [ -n "$UPLOAD_DIR" ]; then
  mkdir -p "$UPLOAD_DIR"
fi
if [ -n "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
fi
node src/db/run-migrations.mjs
if [ "${REPLACE_EMAIL_TEMPLATES:-}" = "true" ]; then
  echo "REPLACE_EMAIL_TEMPLATES=true: replacing all email_templates with defaults"
  node src/db/reseed-email-templates.mjs
fi
exec node server.js
