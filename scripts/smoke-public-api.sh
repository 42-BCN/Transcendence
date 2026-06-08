#!/bin/sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_ENV="${1:-development}"
HOST_CA_CERTS="${HOST_NODE_EXTRA_CA_CERTS:-$ROOT_DIR/certs/ca.pem}"
HOST_BASE_URL="${BASE_URL:-https://localhost:8443/api/}"

case "$APP_ENV" in
  development)
    TARGET_SCRIPT="smoke:public-api:host:dev"
    ;;
  test)
    TARGET_SCRIPT="smoke:public-api:host:test"
    ;;
  *)
    echo "Usage: $0 [development|test]" >&2
    exit 1
    ;;
esac

cd "$ROOT_DIR/containers/backend/app"
BASE_URL="$HOST_BASE_URL" HOST_NODE_EXTRA_CA_CERTS="$HOST_CA_CERTS" npm run "$TARGET_SCRIPT"
