#!/bin/sh

set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="${CLOUDFLARED_ENV_FILE:-$SCRIPT_DIR/../../containers/cloudflared/.env.development}"

if [ -f "$ENV_FILE" ]; then
  token_value="$(grep '^CLOUDFLARE_TUNNEL_TOKEN=' "$ENV_FILE" | tail -n 1 | cut -d '=' -f 2- || true)"
  public_url="$(grep '^CLOUDFLARE_PUBLIC_URL=' "$ENV_FILE" | tail -n 1 | cut -d '=' -f 2- || true)"

  if [ -n "$token_value" ] && [ -n "$public_url" ]; then
    exec "$SCRIPT_DIR/tunnel-stable.sh"
  fi
fi

exec "$SCRIPT_DIR/tunnel-quick.sh"
