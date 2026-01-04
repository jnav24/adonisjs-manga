#!/bin/sh

echo "Running in ${NODE_ENV} mode..."

# bun install
# node ace migration:run --force

if [ "${NODE_ENV}" = "production" ]; then
   echo "Starting Production Server..."
   node ace migration:run --force
   # bun run build
   exec node build/bin/server.js
else
    echo "Starting Development Server..."
    node ace migration:run
    exec npm run dev
fi
