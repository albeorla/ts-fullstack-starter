# Development Guide

This guide provides comprehensive instructions for setting up, developing, and contributing to the T3 Stack Starter Application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.17.0 or higher
- **Yarn**: Version 1.22.22 (specified in package.json)
- **PostgreSQL**: Version 12 or higher
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "ms-vscode.vscode-json"
  ]
}
```

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd albeorla-ts-starter

# Install dependencies
yarn install

# Generate Prisma client
yarn postinstall
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# NextAuth.js
AUTH_SECRET="your-auth-secret-here"
AUTH_DISCORD_ID="your-discord-app-id"
AUTH_DISCORD_SECRET="your-discord-app-secret"

# Optional
NODE_ENV="development"
```

### 3. Database Setup

#### Option A: Local PostgreSQL

```bash
# Start PostgreSQL service
brew services start postgresql

# Create database
createdb albeorla_ts_starter_dev

# Run migrations
yarn db:generate
```

#### Option B: Using Docker

```bash
# Start database container
./start-database.sh

# Or manually with docker
docker run --name postgres-dev \
  -e POSTGRES_DB=albeorla_ts_starter_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### 4. Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to OAuth2 settings
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
5. Copy Client ID and Client Secret to `.env`

### 5. Start Development Server

```bash
# Start development server with Turbo
yarn dev

# Server will be available at http://localhost:3000
```

## Development Workflow

### Daily Development

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
yarn install

# Run database migrations if any
yarn db:generate

# Start development server
yarn dev
```

### Code Quality Checks

```bash
# Run linting
yarn lint

# Fix linting issues
yarn lint:fix

# Type checking
yarn typecheck

# Format code
yarn format:write

# Run all checks
yarn check
```

## Project Structure Deep Dive

```
src/
├── app/                    # Next.js App Router
│   ├── _components/       # Shared React components
│   │   └── post.tsx       # Post management component
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js endpoints
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── trpc/          # tRPC API handler
│   │       └── [trpc]/
│   │           └── route.ts
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── server/                # Server-side code
│   ├── api/               # tRPC router definitions
│   │   ├── routers/       # Individual route handlers
│   │   │   └── post.ts    # Post-related procedures
│   │   ├── root.ts        # Main router composition
│   │   └── trpc.ts        # tRPC configuration
│   ├── auth/              # Authentication configuration
│   │   ├── config.ts      # NextAuth.js config
│   │   └── index.ts       # Auth exports
│   └── db.ts              # Database client
├── trpc/                  # tRPC client configuration
│   ├── query-client.ts    # TanStack Query client
│   ├── react.tsx          # React Query integration
│   └── server.ts          # Server-side tRPC client
├── styles/                # Global styles
│   └── globals.css        # Tailwind CSS imports
└── env.js                 # Environment variable validation
```

## Database Development

### Working with Prisma

```bash
# Generate Prisma client after schema changes
yarn db:generate

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio
yarn db:studio

# Deploy migrations to production
yarn db:migrate
```

### Schema Modifications

1. Edit `prisma/schema.prisma`
2. Create migration: `yarn db:generate`
3. Review migration files in `prisma/migrations/`
4. Test migration in development
5. Commit schema and migration files

### Example Schema Change

```prisma
// Add new field to Post model
model Post {
  id        Int      @id @default(autoincrement())
  name      String
  content   String?  // New field
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  createdBy   User   @relation(fields: [createdById], references: [id])
  createdById String
  
  @@index([name])
}
```

## API Development

### Creating New tRPC Procedures

1. Define procedure in appropriate router
2. Add input/output validation with Zod
3. Implement business logic
4. Add to main router
5. Update client-side usage

### Example New Procedure

```typescript
// src/server/api/routers/post.ts
export const postRouter = createTRPCRouter({
  // ... existing procedures

  update: protectedProcedure
    .input(z.object({ 
      id: z.number(), 
      name: z.string().min(1) 
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { 
          id: input.id,
          createdById: ctx.session.user.id // Ensure ownership
        },
        data: { name: input.name },
      });
    }),
});
```

### Client-Side Integration

```typescript
// Component usage
const updatePost = api.post.update.useMutation({
  onSuccess: () => {
    utils.post.invalidate();
  },
});
```

## Component Development

### Creating New Components

1. Create component file in appropriate directory
2. Use TypeScript with proper typing
3. Implement responsive design with Tailwind
4. Add proper error handling
5. Include loading states

### Component Template

```typescript
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface MyComponentProps {
  // Define props with TypeScript
}

export function MyComponent({ }: MyComponentProps) {
  const [state, setState] = useState("");
  
  const { data, isLoading, error } = api.post.getLatest.useQuery();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="rounded-lg bg-white/10 p-4">
      {/* Component content */}
    </div>
  );
}
```

## Testing

### Setting Up Tests

```bash
# Install testing dependencies (if not already installed)
yarn add -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Create test configuration
# Add to package.json:
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Testing Examples

#### Component Testing

```typescript
// src/__tests__/components/Post.test.tsx
import { render, screen } from "@testing-library/react";
import { LatestPost } from "~/app/_components/post";

// Mock tRPC
jest.mock("~/trpc/react", () => ({
  api: {
    post: {
      getLatest: {
        useSuspenseQuery: () => [{ name: "Test Post" }],
      },
    },
  },
}));

test("renders latest post", () => {
  render(<LatestPost />);
  expect(screen.getByText("Test Post")).toBeInTheDocument();
});
```

#### API Testing

```typescript
// src/__tests__/api/post.test.ts
import { createCallerFactory } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";

test("creates post successfully", async () => {
  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller({
    session: { user: { id: "user-1" } },
    db: mockDb,
  });

  const post = await caller.post.create({ name: "Test Post" });
  expect(post.name).toBe("Test Post");
});
```

## Debugging

### Common Issues

#### Environment Variables
```bash
# Check environment validation
node -e "console.log(require('./src/env.js').env)"
```

#### Database Connection
```bash
# Test database connection
npx prisma db pull
```

#### tRPC Issues
- Check browser Network tab for API calls
- Verify procedure names match between client/server
- Ensure proper authentication for protected procedures

### Development Tools

```bash
# Database GUI
yarn db:studio

# Build analysis
yarn build --analyze

# TypeScript errors
yarn typecheck --listFiles
```

## Git Workflow

### Branch Naming Convention

```bash
# Feature branches
git checkout -b feat/add-user-profiles

# Bug fixes
git checkout -b fix/authentication-redirect

# Documentation
git checkout -b docs/api-reference

# Refactoring
git checkout -b refactor/database-queries
```

### Commit Message Format

```bash
# Semantic commit messages
git commit -m "feat: add user profile management"
git commit -m "fix: resolve Discord OAuth redirect issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: optimize database queries"
```

### Pre-commit Checklist

- [ ] Code builds successfully (`yarn build`)
- [ ] All tests pass (`yarn test`)
- [ ] Linting passes (`yarn lint`)
- [ ] Type checking passes (`yarn typecheck`)
- [ ] Database migrations work (`yarn db:generate`)
- [ ] Environment variables updated if needed

## Performance Optimization

### Development Performance

```bash
# Use Turbo mode for faster development
yarn dev

# Analyze bundle size
yarn build --analyze

# Check TypeScript performance
yarn typecheck --extendedDiagnostics
```

### Code Splitting

```typescript
// Dynamic imports for large components
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
});
```

### Database Optimization

```typescript
// Include relations in single query
const post = await ctx.db.post.findFirst({
  where: { id: input.id },
  include: {
    createdBy: {
      select: { name: true, image: true }
    }
  }
});
```

## Deployment Preparation

### Environment Setup

```bash
# Production environment variables
AUTH_SECRET=<strong-secret-key>
DATABASE_URL=<production-database-url>
AUTH_DISCORD_ID=<production-discord-id>
AUTH_DISCORD_SECRET=<production-discord-secret>
```

### Build Verification

```bash
# Test production build locally
yarn build
yarn start

# Check for build errors
yarn build 2>&1 | grep -i error
```

## Contributing Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use Tailwind CSS for styling
- Implement proper error handling
- Add TypeScript types for all functions

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Run full test suite
4. Update documentation if needed
5. Create pull request with description
6. Address review feedback
7. Merge after approval

### Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] TypeScript types are properly defined

---

**Last Updated**: July 12, 2025  
**Guide Version**: 1.0  
**Compatibility**: Node.js 18+, TypeScript 5+