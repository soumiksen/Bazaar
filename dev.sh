#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

cleanup() {
  echo
  echo "Shutting down..."
  [[ -n "${BACKEND_PID:-}" ]] && kill "$BACKEND_PID" 2>/dev/null || true
  [[ -n "${FRONTEND_PID:-}" ]] && kill "$FRONTEND_PID" 2>/dev/null || true
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Starting backend (mvn spring-boot:run)..."
(cd "$BACKEND_DIR" && mvn spring-boot:run) &
BACKEND_PID=$!

echo "Starting frontend (npm run dev)..."
(cd "$FRONTEND_DIR" && npm run dev) &
FRONTEND_PID=$!

wait
