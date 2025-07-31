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
  yarn prisma db push --skip-generate
  echo "Schema push completed successfully."
  
  echo "Seeding database (upsert mode handles duplicates)..."
  yarn prisma db seed
  echo "Database seeding completed successfully."
  
  # Verify seeding worked by checking if we have permissions
  echo "Verifying database seeding..."
  node -e "
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    prisma.permission.count().then(count => {
      console.log('Found', count, 'permissions in database');
      if (count === 0) {
        console.error('ERROR: No permissions found - seeding failed!');
        process.exit(1);
      }
      return prisma.\$disconnect();
    }).catch(err => {
      console.error('Database verification failed:', err);
      process.exit(1);
    });
  "
  
  echo "Database setup completed and verified."
  
  echo "Running E2E tests..."
  exec yarn test:e2e:ci
else
  echo "Starting Next.js in production mode..."
  exec yarn start
fi
