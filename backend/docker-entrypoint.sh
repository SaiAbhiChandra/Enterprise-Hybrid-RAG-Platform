#!/bin/sh
set -e

# Run pending migrations before the app starts serving traffic --
# means a fresh `docker compose up` gets a fully-migrated schema
# with no manual `alembic upgrade head` step.
echo "Running database migrations..."
alembic upgrade head

echo "Starting YourChat backend..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
