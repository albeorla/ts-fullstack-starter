# E2E Testing Guide

## Overview

Our E2E tests use Playwright with automated authentication. Tests require a running database but otherwise run without any manual intervention.

## Prerequisites

1. **Database**: PostgreSQL must be running
2. **Dependencies**: Run `yarn install`
3. **Environment**: Ensure `.env` file exists with valid `DATABASE_URL`

## Quick Start

```bash
# 1. Start the database (if not running)
./start-database.sh

# 2. Prepare Playwright and database
./setup-tests.sh

# 3. Run tests
yarn test:e2e
```

## Files to Never Commit

The following files/directories are generated during test runs and should never be committed:
- `e2e/.auth/` - Contains authentication state
- `playwright-report/` - HTML test reports
- `test-results/` - Test artifacts and traces
- `e2e/screenshot-*.png` - Test screenshots

These are already in `.gitignore` but always double-check before committing.

## Available Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `yarn test:e2e` | Run all tests | Standard test run |
| `yarn test:e2e:headed` | Run tests with browser visible | Debugging |
| `yarn test:e2e:ui` | Open Playwright UI mode | Interactive debugging |
| `yarn test:e2e:ci --max-failures=0 --reporter=console` | Run tests in CI mode | CI/CD pipelines |
| `yarn test:e2e:debug` | Run with debug logs | Troubleshooting |

## How It Works

1. **Database Check**: Tests verify database is running before starting
2. **Auth Setup**: Creates test user and session directly in database
3. **Cookie Setting**: Session token set as browser cookie
4. **State Persistence**: Auth saved to `e2e/.auth/user.json`
5. **Test Execution**: All tests run with pre-authenticated state

## Common Issues & Solutions

### Database Connection Failed

**Error**: `Can't reach database server at localhost:5432`

**Solution**:
```bash
# Start database with Docker
./start-database.sh

# Or check if PostgreSQL is running
pg_isready -h localhost -p 5432
```

### Auth Setup Failed

**Error**: `Failed to verify authentication`

**Possible Causes**:
1. Database not seeded - Run `yarn prisma db seed`
2. NextAuth misconfiguration - Check `AUTH_SECRET` in `.env`
3. Wrong port - Ensure test server runs on 3001

### Tests Hanging on Report

**Issue**: Tests complete but process doesn't exit

**Solution**: This is fixed in latest config. If still occurs:
```bash
# Run in CI mode (no report server)
yarn test:e2e:ci

# Or kill the report server manually
pkill -f "playwright show-report"
```

### Port Already in Use

**Error**: `Port 3001 is already in use`

**Solution**:
```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 yarn test:e2e
```

## CI/CD Setup

For GitHub Actions:

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 20
          
      - name: Install dependencies
        run: yarn install
        
      - name: Setup database
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
        run: |
          yarn prisma db push
          yarn prisma db seed
          
      - name: Run E2E tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
          CI: true
        run: yarn test:e2e:ci
```

## Debugging Tips

1. **See what's happening**: Use `yarn test:e2e:headed`
2. **Step through tests**: Use `yarn test:e2e:ui`
3. **Check auth state**: Look at `e2e/.auth/user.json`
4. **View traces**: Check `test-results/` folder
5. **Enable debug logs**: Use `yarn test:e2e:debug`

## Best Practices

1. **Always check database first**: Our setup does this automatically
2. **Use data-testid attributes**: Makes selectors more reliable
3. **Clean up test data**: Tests should be idempotent
4. **Run locally before pushing**: Catch issues early
5. **Keep tests fast**: Mock external services when possible

## Architecture

```
e2e/
├── auth.setup.ts          # Authentication setup (runs first)
├── setup/
│   ├── check-database.ts  # Database connectivity check
│   └── create-test-session.ts # Session creation logic
├── admin-dashboard.spec.ts # Test files
└── .auth/
    └── user.json          # Saved auth state (gitignored)
```

### Playwright Config (from playwright.config.ts)
- Reporters: html, json
- Projects: chromium, firefox, webkit

Last Updated: October 2024

## Environment Variables

Required for tests:
- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: NextAuth secret (can be any string for tests)
- `NODE_ENV=test`: Automatically set by test runner

## Troubleshooting Checklist

- [ ] Database running? (`pg_isready`)
- [ ] Database seeded? (`yarn prisma db seed`)
- [ ] Correct DATABASE_URL? (check `.env`)
- [ ] Old auth state? (`rm -rf e2e/.auth/`)
- [ ] Port conflicts? (`lsof -ti:3001`)
- [ ] Latest dependencies? (`yarn install`)
- [ ] Migrations run? (`yarn prisma db push`) 