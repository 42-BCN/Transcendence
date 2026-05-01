#!/bin/sh

set -e

echo "Starting Socket Container..."

if [ "$NODE_ENV" = "development" ]; then
  if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    echo "Installing socket dependencies..."

    if [ ! -f "package-lock.json" ]; then
      npm install
    else
      npm ci
    fi
  else
    echo "Dependencies already installed."
  fi
fi

echo "Starting Socket.io..."
exec "$@"