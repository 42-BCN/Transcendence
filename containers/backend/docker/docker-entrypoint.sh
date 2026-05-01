#!/bin/sh

set -e

echo "Starting Backend Container..."

if [ "$NODE_ENV" = "development" ]; then
  if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    echo "Installing development dependencies..."

    if [ ! -f "package-lock.json" ]; then
      npm install
    else
      npm ci
    fi
  else
    echo "Dependencies already installed."
  fi

  echo "Generating Prisma client..."
  npm run prisma:generate
fi

echo "Starting Express.js..."
exec "$@"