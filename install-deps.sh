#!/bin/bash
set -e

echo "--- Installing dependencies ---"

echo "Installing shared dependencies..."
(cd shared && pnpm install --no-frozen-lockfile && pnpm build)

echo "Installing backend dependencies..."
(cd backend && pnpm install --no-frozen-lockfile)

echo "Installing frontend dependencies..."
(cd frontend && pnpm install --no-frozen-lockfile)

echo "Installing Prettier..."
(pnpm install --save-dev --save-exact prettier)

echo "Watching schemas..."
(cd shared && pnpm watch)

echo "--- Dependencies installed successfully ---"
