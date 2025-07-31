#!/bin/sh
set -e

echo "Starting in MODE: ${MODE:-production}"

if [ "$MODE" = "test" ]; then
  echo "Waiting for database to be ready..."
  until pg_isready -h db -p 5432 -q; do
    echo "Database is not ready yet. Waiting..."
    sleep 2
  done
  echo "Database is ready!"
  
  # Always ensure database is properly set up
  echo "Setting up database schema..."
  yarn prisma db push --skip-generate || echo "Schema push failed, continuing..."
  
  echo "Seeding database (upsert mode handles duplicates)..."
  yarn prisma db seed || echo "Seeding failed, continuing..."
  
  echo "Database setup completed."
  
  echo "Running E2E tests..."
  exec yarn test:e2e:ci
else
  echo "Starting Next.js in production mode..."
  exec yarn start
fi
