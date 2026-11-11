#!/usr/bin/env bash
# Populate the Bazaar database with demo vendors and products.
# Usage: backend/scripts/seed.sh   (reads DB_* env vars, defaults match application.yml)
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PGPASSWORD="${DB_PASSWORD:-bazaar}" psql -v ON_ERROR_STOP=1 \
  -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" \
  -U "${DB_USERNAME:-bazaar}" -d "${DB_NAME:-bazaar}" -f "$DIR/seed.sql"
# The product list is cached in Redis; clear it so new rows show up immediately.
redis-cli -h "${REDIS_HOST:-localhost}" -p "${REDIS_PORT:-6379}" del "products::all" >/dev/null 2>&1 || true
echo "Seeded. Restart the backend (or hit its reindex) so Elasticsearch search picks up the new products."
