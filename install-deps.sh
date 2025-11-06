#!/bin/bash
set -e

echo "--- Installing dependencies ---"

echo "Installing backend dependencies..."
(cd backend && pnpm install)

echo "Installing frontend dependencies..."
(cd frontend && pnpm install)

echo "Installing shared dependencies..."
(cd shared && pnpm install && pnpm watch)

echo "Installing Prettier..."
(pnpm install --save-dev --save-exact prettier)

echo "--- Dependencies installed successfully ---"
