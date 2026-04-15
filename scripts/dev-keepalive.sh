#!/usr/bin/env bash

set -u

cd "$(dirname "$0")/.."

if [[ ! -d node_modules ]]; then
  echo "Dependencies are missing. Run: npm install"
  exit 1
fi

while true; do
  echo "Starting Next.js dev server on http://localhost:3000"
  npm run dev
  exit_code=$?
  echo "Dev server exited with code ${exit_code}. Restarting in 2 seconds..."
  sleep 2
done