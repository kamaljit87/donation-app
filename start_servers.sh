#!/usr/bin/env bash
set -euo pipefail

# start_servers.sh
# Starts Laravel backend first, waits until it responds, cools down, then starts frontend.

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_LOG="/tmp/donation-backend.log"
FRONTEND_LOG="/tmp/donation-frontend.log"
BACKEND_PID_FILE="/tmp/donation-backend.pid"
FRONTEND_PID_FILE="/tmp/donation-frontend.pid"
COOLDOWN_SECONDS=3

usage() {
  cat <<EOF
Usage: $0 [start|stop|restart|status|cache|route-cache]

Commands:
  start        Start backend then frontend (default)
  stop         Stop frontend and backend (by saved PIDs or fuser)
  restart      Stop then start (rebuilds before starting)
  status       Show running status
  cache        Run Laravel cache maintenance (cache:clear, config:cache, view:clear)
  route-cache  Generate Laravel route cache (route:cache)
  help         Show this message
EOF
}

write_pid() {
  local pidfile="$1"; shift
  local pid="$1"; shift
  echo "$pid" >"$pidfile"
}

read_pid() {
  local pidfile="$1"
  [ -f "$pidfile" ] && cat "$pidfile" || echo ""
}

rm_pid() {
  local pidfile="$1"
  [ -f "$pidfile" ] && rm -f "$pidfile"
}

kill_pidfile() {
  local pidfile="$1"
  local pid
  pid=$(read_pid "$pidfile")
  if [ -n "$pid" ]; then
    if kill -0 "$pid" 2>/dev/null; then
      echo "Killing PID $pid from $pidfile"
      kill "$pid" || true
      sleep 0.5
    fi
    rm_pid "$pidfile"
  fi
}

echo "== Donation App start script =="
echo "Root: $ROOT_DIR"

kill_ports() {
  echo "Killing any processes listening on ports 8000 and 3000 (if any)" || true
  fuser -k 8000/tcp 2>/dev/null || true
  fuser -k 3000/tcp 2>/dev/null || true
}

# Start backend
start_backend() {
  echo "Starting backend (Laravel artisan serve) -> logs: $BACKEND_LOG"
  cd "$ROOT_DIR/backend"
  nohup php artisan serve --host=0.0.0.0 --port=8000 >"$BACKEND_LOG" 2>&1 &
  BACKEND_PID=$!
  write_pid "$BACKEND_PID_FILE" "$BACKEND_PID"
  echo "Backend PID: $BACKEND_PID"
}

wait_for_backend() {
  echo "Waiting for backend to become responsive on http://127.0.0.1:8000 ..."
  MAX_WAIT=30
  i=0
  until curl -sSf --max-time 2 http://127.0.0.1:8000 >/dev/null 2>&1; do
    i=$((i+1))
    if [ $i -ge $MAX_WAIT ]; then
      echo "Backend did not respond after $MAX_WAIT seconds. Check $BACKEND_LOG"
      return 1
    fi
    sleep 1
  done
  echo "Backend is up."
  return 0
}

start_frontend() {
  echo "Cooling down for $COOLDOWN_SECONDS seconds..."
  sleep $COOLDOWN_SECONDS
  cd "$ROOT_DIR/frontend"
  if [ -d "$ROOT_DIR/frontend/build" ]; then
    echo "Starting frontend static server (node server.js) -> logs: $FRONTEND_LOG"
    nohup node server.js >"$FRONTEND_LOG" 2>&1 &
  else
    echo "No production build found. Starting dev server (npm start) -> logs: $FRONTEND_LOG"
    nohup npm start >"$FRONTEND_LOG" 2>&1 &
  fi
  FRONTEND_PID=$!
  write_pid "$FRONTEND_PID_FILE" "$FRONTEND_PID"
  echo "Frontend PID: $FRONTEND_PID"
}

stop_all() {
  echo "Stopping frontend and backend..."
  # try kill by pidfile first
  kill_pidfile "$FRONTEND_PID_FILE"
  kill_pidfile "$BACKEND_PID_FILE"
  # fallback to killing by port
  fuser -k 3000/tcp 2>/dev/null || true
  fuser -k 8000/tcp 2>/dev/null || true
}

status_all() {
  echo "Backend (port 8000):"
  ss -tuln | egrep ':(8000)\b' || true
  echo "Frontend (port 3000):"
  ss -tuln | egrep ':(3000)\b' || true
  for f in "$BACKEND_PID_FILE" "$FRONTEND_PID_FILE"; do
    if [ -f "$f" ]; then
      echo "$f -> $(cat $f)"
    fi
  done
}

rebuild_backend() {
  echo "Rebuilding backend (composer install if available)"
  if [ -f "$ROOT_DIR/backend/composer.json" ]; then
    if command -v composer >/dev/null 2>&1; then
      cd "$ROOT_DIR/backend"
      composer install --no-interaction --optimize-autoloader || true
    else
      echo "Composer not found; skipping composer install"
    fi
  else
    echo "No composer.json found; skipping backend rebuild"
  fi
  # Optionally run migrations if requested
  if [ "${MIGRATE_ON_RESTART:-0}" = "1" ]; then
    echo "MIGRATE_ON_RESTART=1 -> running artisan migrations"
    cd "$ROOT_DIR/backend"
    php artisan migrate --force || true
  fi
}

rebuild_frontend() {
  echo "Rebuilding frontend (npm build)"
  if [ -f "$ROOT_DIR/frontend/package.json" ]; then
    cd "$ROOT_DIR/frontend"
    # Prefer npm ci for reproducible installs when lockfile present
    if [ -f package-lock.json ] && command -v npm >/dev/null 2>&1; then
      npm ci --silent || npm install --silent
    else
      npm install --silent || true
    fi
    npm run build || true
  else
    echo "No frontend package.json found; skipping frontend rebuild"
  fi
}

echo "All done. Backend logs: $BACKEND_LOG, Frontend logs: $FRONTEND_LOG"
echo "To stop, run: $0 stop"

# Main CLI
CMD=${1:-start}
case "$CMD" in
  start)
    kill_ports
    start_backend
    if ! wait_for_backend; then
      echo "Backend failed to start. See $BACKEND_LOG"
      exit 1
    fi
    start_frontend
    ;;
  stop)
    stop_all
    ;;
  restart)
    stop_all
    sleep 1
    kill_ports
    echo "Rebuilding backend and frontend before restart..."
    rebuild_backend
    # Run cache maintenance and route caching as part of restart
    echo "Running cache maintenance and route caching..."
    cd "$ROOT_DIR/backend"
    php artisan cache:clear || true
    php artisan config:cache || true
    php artisan view:clear || true
    php artisan route:cache || true
    rebuild_frontend
    start_backend
    if ! wait_for_backend; then
      echo "Backend failed to start. See $BACKEND_LOG"
      exit 1
    fi
    start_frontend
    ;;
  cache)
    echo "Running Laravel cache maintenance commands..."
    cd "$ROOT_DIR/backend"
    php artisan cache:clear || true
    php artisan config:cache || true
    php artisan view:clear || true
    echo "Cache commands completed. See $BACKEND_LOG for backend logs."
    ;;
  route-cache)
    echo "Generating Laravel route cache..."
    cd "$ROOT_DIR/backend"
    php artisan route:cache || true
    echo "Route cache complete."
    ;;
  status)
    status_all
    ;;
  help|-h|--help)
    usage
    ;;
  *)
    echo "Unknown command: $CMD"
    usage
    exit 2
    ;;
esac

exit 0
