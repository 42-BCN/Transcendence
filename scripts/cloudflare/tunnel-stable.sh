#!/bin/sh

set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SETUP_SCRIPT="$ROOT_DIR/scripts/env/setup-env.sh"
ENV_FILE="${CLOUDFLARED_ENV_FILE:-$ROOT_DIR/containers/cloudflared/.env.development}"

compose_dev() {
  APP_ENV=development NODE_ENV=development docker compose \
    -f "$ROOT_DIR/containers/docker-compose.yml" \
    -f "$ROOT_DIR/containers/docker-compose.dev.yml" \
    "$@"
}

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing Cloudflare env file: $ENV_FILE" >&2
  echo "Create it from containers/cloudflared/.env.development.example first." >&2
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

if [ -z "${CLOUDFLARE_TUNNEL_TOKEN:-}" ]; then
  echo "CLOUDFLARE_TUNNEL_TOKEN is required in $ENV_FILE" >&2
  exit 1
fi

if [ -z "${CLOUDFLARE_PUBLIC_URL:-}" ]; then
  echo "CLOUDFLARE_PUBLIC_URL is required in $ENV_FILE" >&2
  exit 1
fi

PUBLIC_APP_URL="${CLOUDFLARE_PUBLIC_URL%/}"

echo
echo "Starting stable Cloudflare tunnel..."
echo "Public URL: $PUBLIC_APP_URL"
echo "Syncing PUBLIC_APP_URL into generated env files..."
PUBLIC_APP_URL="$PUBLIC_APP_URL" APP_ENV=development sh "$SETUP_SCRIPT" development

echo
echo "Recreating frontend, backend, and socket for the stable tunnel URL..."
compose_dev up -d --no-deps --force-recreate frontend backend socket > /dev/null

echo "Starting cloudflared..."
compose_dev up -d cloudflared > /dev/null

echo
echo "Stable tunnel ready: $PUBLIC_APP_URL"
echo "Tunnel logs: make tunnel-logs"
echo "Stop tunnel: make tunnel-down"
echo
