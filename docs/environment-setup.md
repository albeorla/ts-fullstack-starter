# Environment Variables Setup Guide

This guide explains how to properly configure environment variables for different contexts in the albeorla-ts-starter project.

## Overview

The project uses a hierarchical environment variable system that supports multiple environments:
- Local development
- Docker testing
- CI/CD pipelines
- Production deployment

## Environment Files

### `.env`
- **Purpose**: Local development configuration
- **Git Status**: ⚠️ IGNORED (never commit)
- **Database Host**: `localhost` (for local PostgreSQL)
- **Usage**: Default values for `yarn dev`

### `.env.test`
- **Purpose**: Docker and E2E test configuration
- **Git Status**: ✅ Committed (contains no secrets)
- **Database Host**: `db` (Docker container name)
- **Usage**: Loaded when `NODE_ENV=test` or in Docker

### `.env.local`
- **Purpose**: Personal overrides for local development
- **Git Status**: ⚠️ IGNORED (never commit)
- **Usage**: Overrides values from `.env`
- **Example**: Use `.env.local.example` as template

### `.env.example`
- **Purpose**: Template for new developers
- **Git Status**: ✅ Committed (documentation only)
- **Usage**: Copy to `.env` when setting up project

## Required Environment Variables

### Authentication
```bash
# Generate with: yarn dlx auth secret
AUTH_SECRET="your-secret-here"

# Discord OAuth (create app at https://discord.com/developers)
AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"
```

### Database
```bash
# Local development (use localhost)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Docker testing (use db hostname)
DATABASE_URL="postgresql://user:password@db:5432/dbname"
```

### Test Authentication
```bash
# Only for development/testing - NEVER in production!
ENABLE_TEST_AUTH="true"
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="test-password-123"
```

### Build Configuration
```bash
# Skip validation during Docker builds (optional)
SKIP_ENV_VALIDATION="true"
```

## Environment Variable Load Order

Next.js loads environment variables in this order (first match wins):
1. `process.env` (system environment)
2. `.env.$(NODE_ENV).local` (e.g., `.env.test.local`)
3. `.env.local` (not loaded when `NODE_ENV=test`)
4. `.env.$(NODE_ENV)` (e.g., `.env.test`)
5. `.env`

## Setup Instructions

### Initial Setup
```bash
# 1. Copy the example file
cp .env.example .env

# 2. Generate auth secret
yarn dlx auth secret

# 3. Update .env with your values
# 4. Start development
yarn dev
```

### Docker Testing
```bash
# Uses .env.test automatically
docker-compose up --build
```

### Personal Overrides
```bash
# Create local overrides (optional)
cp .env.local.example .env.local
# Edit .env.local with your preferences
```

## Security Best Practices

1. **Never commit real secrets** - Only `.env.example` and `.env.test` should be in git
2. **Use different secrets per environment** - Don't reuse production secrets
3. **Rotate secrets regularly** - Especially AUTH_SECRET
4. **Use separate OAuth apps** - Different Discord apps for dev/test/prod
5. **Validate all variables** - Update `src/env.js` when adding new vars

## Docker-Specific Configuration

When running in Docker, the database hostname changes from `localhost` to `db`:

```bash
# Local: postgresql://user:pass@localhost:5432/db
# Docker: postgresql://user:pass@db:5432/db
```

The `.env.test` file handles this automatically for Docker environments.

## CI/CD Configuration

GitHub Actions uses environment variables defined in the workflow:
- Secrets from GitHub Secrets (AUTH_SECRET, etc.)
- Hardcoded test values with fallbacks
- See `.github/workflows/ci-optimized.yml` for details

## Troubleshooting

### Database Connection Errors
- **Local**: Ensure PostgreSQL is running on localhost
- **Docker**: Check if database container is healthy
- **Wrong hostname**: Verify using correct env file

### Authentication Failures
- Ensure AUTH_SECRET is set and valid
- Check Discord OAuth credentials
- Verify NEXTAUTH_URL matches your setup

### Missing Variables
- Check `src/env.js` for required variables
- Run `yarn build` to validate all env vars
- Use `SKIP_ENV_VALIDATION=true` to bypass temporarily

## Adding New Variables

1. Add to `.env` with your value
2. Add to `.env.example` with empty/example value
3. Add to `.env.test` if different for Docker
4. Update `src/env.js` schema for validation
5. Document in this guide
6. Commit only `.env.example` changes