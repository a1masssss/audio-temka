"""Wait until Django can connect to the database (Docker Compose race with Postgres)."""

import os
import sys
import time

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django

django.setup()

from django.db import connection


def main() -> None:
    deadline = time.monotonic() + 120
    last_exc: Exception | None = None
    while time.monotonic() < deadline:
        try:
            connection.ensure_connection()
            return
        except Exception as exc:
            last_exc = exc
            time.sleep(1)
    print(f"Database not ready after timeout: {last_exc}", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
