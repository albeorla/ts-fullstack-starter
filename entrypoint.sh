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
  
  # Check if database needs setup (avoid redundant seeding)
  if ! yarn prisma db seed --dry-run > /dev/null 2>&1; then
    echo "Setting up database schema..."
    yarn prisma db push --skip-generate
    echo "Seeding database..."
    yarn prisma db seed
  else
    echo "Database already configured, skipping setup..."
  fi
  
  echo "Running E2E tests..."
  exec yarn test:e2e:ci
else
  echo "Starting Next.js in production mode..."
  exec yarn start
fi
