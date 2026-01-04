#!/bin/sh

# Wait for MySQL to be ready (optional but recommended)
echo "Waiting for database..."

# Run migrations
node ace migration:run --force

# Start the application
exec bun run dev
