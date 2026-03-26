#!/bin/sh
set -e

if [ "${SKIP_MIGRATE:-0}" != "1" ]; then
  python wait_for_db.py
  python manage.py migrate --noinput
fi

exec "$@"
