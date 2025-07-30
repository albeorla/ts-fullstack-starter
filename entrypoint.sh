#!/bin/sh
set -e

echo "Starting in MODE: ${MODE:-production}"

# Install postgresql-client for database checks
if [ "$MODE" = "test" ]; then
  echo "Installing postgresql-client for database readiness check..."
  apt-get update -qq && apt-get install -y -qq postgresql-client > /dev/null 2>&1
  
  echo "Waiting for database to be ready..."
  until pg_isready -h db -p 5432 -q; do
    echo "Database is not ready yet. Waiting..."
    sleep 2
  done
  echo "Database is ready!"
  
  echo "Setting up database..."
  yarn prisma db push --skip-generate
  yarn prisma db seed
  
  echo "Running E2E tests..."
  exec yarn test:e2e:ci
else
  echo "Starting Next.js in production mode..."
  exec yarn start
fi
