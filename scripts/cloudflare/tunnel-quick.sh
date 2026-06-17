#!/bin/sh

set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SETUP_SCRIPT="$ROOT_DIR/scripts/env/setup-env.sh"

LOG_POLL_ATTEMPTS="${LOG_POLL_ATTEMPTS:-30}"
LOG_POLL_SLEEP_SECONDS="${LOG_POLL_SLEEP_SECONDS:-2}"

TARGET_ENV="${1:-${APP_ENV:-development}}"

case "$TARGET_ENV" in
  development)
    NODE_ENV_VALUE="development"
    COMPOSE_OVERRIDE="containers/docker-compose.dev.yml"
    ;;
  demo)
    NODE_ENV_VALUE="production"
    COMPOSE_OVERRIDE="containers/docker-compose.demo.yml"
    ;;
  production)
    NODE_ENV_VALUE="production"
    COMPOSE_OVERRIDE="containers/docker-compose.prod.yml"
    ;;
  *)
    echo "Unsupported environment: $TARGET_ENV" >&2
    exit 1
    ;;
esac

compose_env() {
  APP_ENV="$TARGET_ENV" NODE_ENV="$NODE_ENV_VALUE" docker compose \
    -f "$ROOT_DIR/containers/docker-compose.yml" \
    -f "$ROOT_DIR/$COMPOSE_OVERRIDE" \
    "$@"
}

echo
echo "Starting Cloudflare quick tunnel against nginx..."
compose_env up -d cloudflared > /dev/null

attempt=1
tunnel_url=""

while [ "$attempt" -le "$LOG_POLL_ATTEMPTS" ]; do
  logs="$(compose_env logs --no-color cloudflared 2>/dev/null || true)"
  tunnel_url="$(printf '%s\n' "$logs" | grep -Eo 'https://[[:alnum:]-]+\.trycloudflare\.com' | tail -n 1 || true)"

  if [ -n "$tunnel_url" ]; then
    break
  fi

  sleep "$LOG_POLL_SLEEP_SECONDS"
  attempt=$((attempt + 1))
done

if [ -z "$tunnel_url" ]; then
  echo "Could not detect a trycloudflare.com URL from the cloudflared logs." >&2
  echo "Follow the tunnel logs with: make tunnel-logs" >&2
  exit 1
fi

echo
echo "Tunnel URL detected: $tunnel_url"
echo "Syncing PUBLIC_APP_URL into generated env files..."
PUBLIC_APP_URL="$tunnel_url" APP_ENV="$TARGET_ENV" sh "$SETUP_SCRIPT" "$TARGET_ENV"

echo
echo "Recreating frontend, backend, and socket to pick up the tunnel hostname..."
compose_env up -d --no-deps --force-recreate frontend backend socket > /dev/null

echo
echo "Quick tunnel ready: $tunnel_url"
echo "Tunnel logs: make tunnel-logs"
echo "Stop tunnel: make tunnel-down"
echo "Google OAuth note: Quick Tunnel URLs change each time, so the Google redirect URI must match the current URL."
echo
