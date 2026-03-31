#!/bin/sh

set -e

echo "🚀 Starting Backend Container..."

if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "📦 node_modules not found. Installing dependencies..."

  if [ ! -f "package-lock.json" ]; then
    echo "📝 No package-lock.json. Running npm install (bootstrap)..."
    npm install
  else
    echo "🔒 Using lockfile. Running npm ci..."
    npm ci
  fi
else
  echo "✅ Dependencies already installed."
fi

echo "⚙️ Generating Prisma client..."
npm run prisma:generate

if [ "$NODE_ENV" = "development" ]; then
echo "🗄️ Syncing database schema with Prisma..."
npm run prisma:db:push
echo ""

else
  echo "⏭️ Skipping Prisma db push (NODE_ENV=$NODE_ENV)."
fi

echo "▶️ Starting Express.js..."
exec "$@"