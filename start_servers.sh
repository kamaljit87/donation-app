#!/usr/bin/env bash
set -euo pipefail

# start_servers.sh
# Starts Laravel backend first, waits until it responds, cools down, then starts frontend.

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_LOG="/tmp/donation-backend.log"
FRONTEND_LOG="/tmp/donation-frontend.log"
COOLDOWN_SECONDS=3

echo "== Donation App start script =="
echo "Root: $ROOT_DIR"

echo "Killing any processes listening on ports 8000 and 3000 (if any)" || true
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true

# Start backend
echo "Starting backend (Laravel artisan serve) -> logs: $BACKEND_LOG"
cd "$ROOT_DIR/backend"
nohup php artisan serve --host=0.0.0.0 --port=8000 >"$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "Waiting for backend to become responsive on http://127.0.0.1:8000 ..."
MAX_WAIT=30
i=0
until curl -sSf --max-time 2 http://127.0.0.1:8000 >/dev/null 2>&1; do
  i=$((i+1))
  if [ $i -ge $MAX_WAIT ]; then
    echo "Backend did not respond after $MAX_WAIT seconds. Check $BACKEND_LOG"
    exit 1
  fi
  sleep 1
done
echo "Backend is up."

echo "Cooling down for $COOLDOWN_SECONDS seconds..."
sleep $COOLDOWN_SECONDS

# Start frontend static server (use build if present, otherwise fall back to dev start)
cd "$ROOT_DIR/frontend"
if [ -d "$ROOT_DIR/frontend/build" ]; then
  echo "Starting frontend static server (node server.js) -> logs: $FRONTEND_LOG"
  nohup node server.js >"$FRONTEND_LOG" 2>&1 &
else
  echo "No production build found. Starting dev server (npm start) -> logs: $FRONTEND_LOG"
  nohup npm start >"$FRONTEND_LOG" 2>&1 &
fi
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo "All done. Backend logs: $BACKEND_LOG, Frontend logs: $FRONTEND_LOG"
echo "To stop, kill PIDs: $BACKEND_PID $FRONTEND_PID"

wait
