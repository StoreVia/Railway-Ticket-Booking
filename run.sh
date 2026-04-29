#!/bin/bash

# Exit if any command fails
set -e

# Get project root (script location)
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Start frontend
echo "Starting frontend..."
cd "$ROOT_DIR"
npm run dev &
FRONTEND_PID=$!

# Start backend
echo "Starting backend..."
cd "$ROOT_DIR/backend"
npm run dev &
BACKEND_PID=$!

# Handle shutdown properly
trap "echo 'Stopping...'; kill $FRONTEND_PID $BACKEND_PID" EXIT

# Wait for both
wait