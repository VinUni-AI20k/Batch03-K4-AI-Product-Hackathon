#!/usr/bin/env bash
# Start/stop the StudyPulse backend (FastAPI, codebase/backend) and frontend
# (Vite, codebase/FE) together for local dev/demo. PIDs/logs live in .run/.
#
# Usage: scripts/dev.sh {start|stop|restart|status}
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/codebase/backend"
FRONTEND_DIR="$ROOT_DIR/codebase/FE"
RUN_DIR="$ROOT_DIR/.run"

BACKEND_PORT="${BACKEND_PORT:-8000}"
# Default picked to avoid colliding with other Vite projects' default 5173
# that may already be running on this machine.
FRONTEND_PORT="${FRONTEND_PORT:-5190}"

BACKEND_PID_FILE="$RUN_DIR/backend.pid"
FRONTEND_PID_FILE="$RUN_DIR/frontend.pid"
BACKEND_LOG="$RUN_DIR/backend.log"
FRONTEND_LOG="$RUN_DIR/frontend.log"

mkdir -p "$RUN_DIR"

is_running() {
  local pid_file="$1"
  [ -f "$pid_file" ] && kill -0 "$(cat "$pid_file")" 2>/dev/null
}

wait_for_http() {
  local url="$1" name="$2" tries=30
  until curl -sf "$url" >/dev/null 2>&1; do
    tries=$((tries - 1))
    if [ "$tries" -le 0 ]; then
      echo "Timed out waiting for $name at $url — check its log." >&2
      return 1
    fi
    sleep 1
  done
}

start_backend() {
  if is_running "$BACKEND_PID_FILE"; then
    echo "Backend already running (pid $(cat "$BACKEND_PID_FILE"))."
    return 0
  fi
  if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "Missing $BACKEND_DIR/.env (copy from .env.example and fill OPENAI_API_KEY)." >&2
    exit 1
  fi
  echo "Starting backend on :$BACKEND_PORT ..."
  (
    cd "$BACKEND_DIR"
    # shellcheck disable=SC1091
    source .venv/bin/activate
    exec uvicorn server:app --host 127.0.0.1 --port "$BACKEND_PORT"
  ) >"$BACKEND_LOG" 2>&1 &
  echo $! >"$BACKEND_PID_FILE"
  wait_for_http "http://127.0.0.1:$BACKEND_PORT/docs" backend
  echo "Backend up (pid $(cat "$BACKEND_PID_FILE")). Log: $BACKEND_LOG"
}

start_frontend() {
  if is_running "$FRONTEND_PID_FILE"; then
    echo "Frontend already running (pid $(cat "$FRONTEND_PID_FILE"))."
    return 0
  fi
  echo "Starting frontend on :$FRONTEND_PORT ..."
  (
    cd "$FRONTEND_DIR"
    export VITE_API_BASE_URL="http://127.0.0.1:$BACKEND_PORT/api/v1"
    # --host 127.0.0.1 so this binds IPv4 explicitly; Vite's default "localhost"
    # host can resolve/bind to ::1 only depending on the machine, which then
    # doesn't match a 127.0.0.1 health check.
    exec npm run dev -- --host 127.0.0.1 --port "$FRONTEND_PORT" --strictPort
  ) >"$FRONTEND_LOG" 2>&1 &
  echo $! >"$FRONTEND_PID_FILE"
  wait_for_http "http://127.0.0.1:$FRONTEND_PORT" frontend
  echo "Frontend up (pid $(cat "$FRONTEND_PID_FILE")). Log: $FRONTEND_LOG"
}

stop_one() {
  local pid_file="$1" name="$2" port="$3"
  if is_running "$pid_file"; then
    local pid
    pid="$(cat "$pid_file")"
    echo "Stopping $name (pid $pid) ..."
    kill "$pid" 2>/dev/null || true
    sleep 1
  fi
  # npm/uvicorn can leave the actual listener on a child pid the wrapper
  # didn't forward SIGTERM to — make sure the port is actually free.
  local port_pid
  port_pid="$(lsof -ti:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [ -n "$port_pid" ]; then
    kill "$port_pid" 2>/dev/null || true
  fi
  rm -f "$pid_file"
}

status() {
  if is_running "$BACKEND_PID_FILE"; then
    echo "backend:  running (pid $(cat "$BACKEND_PID_FILE"), :$BACKEND_PORT)"
  else
    echo "backend:  stopped"
  fi
  if is_running "$FRONTEND_PID_FILE"; then
    echo "frontend: running (pid $(cat "$FRONTEND_PID_FILE"), :$FRONTEND_PORT)"
  else
    echo "frontend: stopped"
  fi
}

case "${1:-}" in
  start)
    start_backend
    start_frontend
    ;;
  stop)
    stop_one "$FRONTEND_PID_FILE" frontend "$FRONTEND_PORT"
    stop_one "$BACKEND_PID_FILE" backend "$BACKEND_PORT"
    ;;
  restart)
    "$0" stop
    "$0" start
    ;;
  status)
    status
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}" >&2
    exit 1
    ;;
esac
