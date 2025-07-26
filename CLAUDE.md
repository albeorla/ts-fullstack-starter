# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a T3 Stack starter application with authentication, RBAC, and shadcn/ui components. Built with Next.js 15, React 19, TypeScript, tRPC, Prisma, and PostgreSQL.

## Essential Commands

### Development
```bash
yarn dev              # Start development server (port 3000)
yarn dev:test         # Start test server (port 3001) for E2E tests
```

### Code Quality
```bash
yarn typecheck        # Run TypeScript type checking
yarn lint             # Run ESLint
yarn lint:fix         # Fix linting issues automatically
yarn format:check     # Check code formatting
yarn format:write     # Format code with Prettier
yarn ci               # Run all checks (typecheck, lint, format, E2E tests)
```

### Database
```bash
yarn db:generate      # Create new migration after schema changes
yarn db:migrate       # Deploy migrations to production
yarn db:push          # Push schema changes without migration (dev only)
yarn db:studio        # Open Prisma Studio GUI
```

### Testing
```bash
yarn test:e2e         # Run Playwright E2E tests
yarn test:e2e:ui      # Run tests with UI mode
yarn test:e2e:headed  # Run tests in headed browser
yarn test:e2e:ci      # Run tests in CI mode
```

### Build & Production
```bash
yarn build            # Build for production
yarn start            # Start production server
yarn preview          # Build and start production server
```

## High-Level Architecture

### Stack Components
- **Frontend**: Next.js 15 App Router with React 19
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **API**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js v5 with Discord OAuth
- **Testing**: Playwright for E2E tests

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── _components/        # Page-specific components
│   ├── admin/              # Admin dashboard with RBAC management
│   ├── api/                # API routes (auth, tRPC)
│   └── auth/               # Authentication pages
├── components/ui/          # shadcn/ui components (25+ components)
├── server/                 # Backend logic
│   ├── api/                # tRPC routers and procedures
│   │   └── routers/        # Feature-specific routers (user, role, permission)
│   ├── auth/               # NextAuth.js configuration
│   └── db.ts               # Prisma database client
└── trpc/                   # tRPC client configuration
```

### Key Architectural Patterns

1. **tRPC Router Pattern**: All API endpoints are defined as tRPC procedures in `src/server/api/routers/`. Each feature has its own router file that gets combined in `src/server/api/root.ts`.

2. **Authentication Flow**: NextAuth.js handles Discord OAuth. Protected procedures use `protectedProcedure` from tRPC context. Session data is available in `ctx.session`.

3. **RBAC System**: Complete role-based access control with:
   - Users can have multiple roles
   - Roles have multiple permissions
   - Admin UI at `/admin/*` for managing users, roles, and permissions

4. **Database Access**: All database operations go through Prisma client (`ctx.db`). Schema is defined in `prisma/schema.prisma`.

5. **Component Architecture**: shadcn/ui components in `src/components/ui/` use Radix UI primitives with Tailwind CSS v4 styling.

## Development Workflow

1. **Adding New Features**:
   - Create tRPC router in `src/server/api/routers/`
   - Add router to `src/server/api/root.ts`
   - Create UI components using shadcn/ui components
   - Use `api.<router>.<procedure>.useQuery/useMutation()` in components

2. **Database Changes**:
   - Edit `prisma/schema.prisma`
   - Run `yarn db:generate` to create migration
   - Test migration locally before committing

3. **Before Committing**:
   - Run `yarn ci` to ensure all checks pass
   - Fix any TypeScript, linting, or formatting issues
   - Ensure E2E tests pass if UI was modified

## Environment Setup

Required environment variables (see `.env.example`):
- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: NextAuth.js secret
- `AUTH_DISCORD_ID`: Discord OAuth app ID
- `AUTH_DISCORD_SECRET`: Discord OAuth app secret