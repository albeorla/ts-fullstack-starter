# Database Schema Documentation

This document provides comprehensive documentation for the PostgreSQL database schema used in the T3 Stack Starter Application.

## Overview

The database schema is defined using Prisma ORM and includes models for user management, authentication, and post management. The schema follows NextAuth.js adapter requirements and implements proper relationships and constraints.

## Database Configuration

- **Database**: PostgreSQL 12+
- **ORM**: Prisma 6.5.0
- **Location**: `prisma/schema.prisma`
- **Migrations**: `prisma/migrations/`

## Core Models

### User Model

The central user entity for authentication and content ownership.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  
  // Relationships
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
}
```

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Primary key using CUID |
| `name` | String | No | User's display name |
| `email` | String | No | User's email address (unique) |
| `emailVerified` | DateTime | No | Email verification timestamp |
| `image` | String | No | Profile image URL |

#### Relationships

- **One-to-Many** with `Account` (OAuth provider accounts)
- **One-to-Many** with `Session` (active user sessions)
- **One-to-Many** with `Post` (user-created posts)

#### Constraints

- `email` field has unique constraint
- `id` uses CUID for URL-safe, collision-resistant identifiers

#### Indexes

- Primary key index on `id`
- Unique index on `email`

---

### Post Model

Represents user-generated content in the application.

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Foreign key relationship
  createdBy   User   @relation(fields: [createdById], references: [id])
  createdById String
  
  @@index([name])
}
```

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Int | Yes | Auto-incrementing primary key |
| `name` | String | Yes | Post title/name |
| `createdAt` | DateTime | Yes | Creation timestamp (auto-generated) |
| `updatedAt` | DateTime | Yes | Last update timestamp (auto-updated) |
| `createdById` | String | Yes | Foreign key to User.id |

#### Relationships

- **Many-to-One** with `User` (post creator)

#### Constraints

- `createdById` references `User.id`
- Foreign key constraint ensures referential integrity

#### Indexes

- Primary key index on `id`
- Index on `name` for search optimization
- Foreign key index on `createdById`

---

## Authentication Models

The following models implement the NextAuth.js adapter schema for session management and OAuth integration.

### Account Model

Stores OAuth provider account information for users.

```prisma
model Account {
  id                       String  @id @default(cuid())
  userId                   String
  type                     String
  provider                 String
  providerAccountId        String
  refresh_token            String?
  access_token             String?
  expires_at               Int?
  token_type               String?
  scope                    String?
  id_token                 String?
  session_state            String?
  refresh_token_expires_in Int?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}
```

#### Key Features

- Supports multiple OAuth providers per user
- Stores OAuth tokens and metadata
- Cascade delete when user is deleted
- Unique constraint on provider + providerAccountId

### Session Model

Manages active user sessions.

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Key Features

- Session token for authentication
- Expiration timestamp
- Cascade delete when user is deleted

### VerificationToken Model

Handles email verification and password reset tokens.

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

#### Key Features

- Supports email verification workflow
- Token expiration handling
- Unique constraint on identifier + token

---

## Relationships Diagram

```
User (1) ←→ (M) Account
User (1) ←→ (M) Session  
User (1) ←→ (M) Post

VerificationToken (standalone)
```

### Relationship Details

#### User ↔ Post
- **Type**: One-to-Many
- **Foreign Key**: `Post.createdById` → `User.id`
- **Delete Behavior**: Manual handling required
- **Usage**: Users can create multiple posts

#### User ↔ Account
- **Type**: One-to-Many
- **Foreign Key**: `Account.userId` → `User.id`
- **Delete Behavior**: Cascade (accounts deleted when user deleted)
- **Usage**: Users can have multiple OAuth accounts

#### User ↔ Session
- **Type**: One-to-Many
- **Foreign Key**: `Session.userId` → `User.id`
- **Delete Behavior**: Cascade (sessions deleted when user deleted)
- **Usage**: Users can have multiple active sessions

---

## Migration History

### Initial Migration (20250711233023_init)

Created all base tables with the following structure:

```sql
-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    -- Account fields...
);

-- CreateTable
CREATE TABLE "Session" (
    -- Session fields...
);

-- CreateTable
CREATE TABLE "User" (
    -- User fields...
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    -- VerificationToken fields...
);

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## Database Operations

### Common Queries

#### User Operations

```typescript
// Create user (handled by NextAuth.js)
const user = await prisma.user.create({
  data: {
    email: "user@example.com",
    name: "John Doe",
  },
});

// Get user with posts
const userWithPosts = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    posts: {
      orderBy: { createdAt: "desc" },
    },
  },
});
```

#### Post Operations

```typescript
// Create post
const post = await prisma.post.create({
  data: {
    name: "My Post Title",
    createdBy: { connect: { id: userId } },
  },
});

// Get latest post for user
const latestPost = await prisma.post.findFirst({
  where: { createdById: userId },
  orderBy: { createdAt: "desc" },
});

// Update post
const updatedPost = await prisma.post.update({
  where: { id: postId },
  data: { name: "Updated Title" },
});

// Delete post
await prisma.post.delete({
  where: { id: postId },
});
```

#### Session Operations

```typescript
// Get user session
const session = await prisma.session.findUnique({
  where: { sessionToken },
  include: { user: true },
});

// Clean expired sessions
await prisma.session.deleteMany({
  where: {
    expires: {
      lte: new Date(),
    },
  },
});
```

### Performance Optimization

#### Indexing Strategy

```sql
-- Existing indexes
CREATE INDEX "Post_name_idx" ON "Post"("name");
CREATE INDEX "Post_createdById_idx" ON "Post"("createdById"); -- Implicit FK index

-- Additional recommended indexes for performance
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");
CREATE INDEX "Session_expires_idx" ON "Session"("expires");
CREATE INDEX "Account_userId_idx" ON "Account"("userId"); -- Implicit FK index
```

#### Query Optimization

```typescript
// Use select to limit fields
const posts = await prisma.post.findMany({
  select: {
    id: true,
    name: true,
    createdAt: true,
  },
});

// Use take for pagination
const recentPosts = await prisma.post.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Batch operations
const postIds = [1, 2, 3, 4, 5];
const posts = await prisma.post.findMany({
  where: {
    id: { in: postIds },
  },
});
```

---

## Development Workflow

### Schema Changes

1. **Edit Schema**: Modify `prisma/schema.prisma`
2. **Generate Migration**: Run `yarn db:generate`
3. **Review Migration**: Check generated SQL in `prisma/migrations/`
4. **Test Migration**: Apply to development database
5. **Commit Changes**: Commit both schema and migration files

### Migration Commands

```bash
# Generate and apply migration
yarn db:generate

# Apply existing migrations to new database
yarn db:migrate

# Reset database (development only)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Generate Prisma client
npx prisma generate
```

### Database Seeding

Create `prisma/seed.ts` for development data:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
    },
  });

  // Create test posts
  await prisma.post.createMany({
    data: [
      {
        name: "First Post",
        createdById: user.id,
      },
      {
        name: "Second Post",
        createdById: user.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seeding:
```bash
npx prisma db seed
```

---

## Production Considerations

### Backup Strategy

```bash
# Database backup
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

### Connection Pooling

For production deployments, consider connection pooling:

```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add connection pooling
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

### Monitoring

Monitor these database metrics:
- Connection count
- Query performance
- Table sizes
- Index usage
- Lock contention

---

## Security Considerations

### Data Protection

- User emails are unique and indexed
- Foreign key constraints prevent orphaned records
- Cascade deletes protect against dangling references
- CUID IDs prevent enumeration attacks

### Access Patterns

- All post access filtered by `createdById`
- Session tokens are unique and indexed
- OAuth tokens stored securely in Account model

### Data Retention

Consider implementing:
- Session cleanup for expired sessions
- Account cleanup for revoked OAuth tokens
- User data deletion compliance (GDPR)

---

## Troubleshooting

### Common Issues

#### Migration Failures
```bash
# Check migration status
npx prisma migrate status

# Reset and reapply (development only)
npx prisma migrate reset
```

#### Connection Issues
```bash
# Test database connection
npx prisma db pull

# Check connection string format
echo $DATABASE_URL
```

#### Schema Drift
```bash
# Compare schema with database
npx prisma db pull
git diff prisma/schema.prisma
```

---

**Last Updated**: July 12, 2025  
**Schema Version**: 1.0  
**Prisma Version**: 6.5.0