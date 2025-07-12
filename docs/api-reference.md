# API Reference

This document provides comprehensive documentation for the tRPC API endpoints available in the T3 Stack Starter Application.

## Overview

The API is built using tRPC, providing end-to-end type safety between client and server. All endpoints are defined in `src/server/api/routers/` and are accessible through the `/api/trpc` route.

## Base Configuration

- **Base URL**: `/api/trpc`
- **Protocol**: HTTP/HTTPS
- **Content-Type**: `application/json`
- **Authentication**: Session-based (NextAuth.js)

## Router Structure

```typescript
// Main router composition
export const appRouter = createTRPCRouter({
  post: postRouter,
});
```

---

## Post Router

Located at: `src/server/api/routers/post.ts`

### Public Endpoints

#### `post.hello`

**Description**: Demonstration endpoint that returns a greeting message.

**Type**: `publicProcedure` (no authentication required)

**Input Schema**:
```typescript
{
  text: string
}
```

**Output Schema**:
```typescript
{
  greeting: string
}
```

**Example Usage**:
```typescript
// Client-side usage
const hello = await api.post.hello.query({ text: "from tRPC" });
console.log(hello.greeting); // "Hello from tRPC"
```

**HTTP Equivalent**:
```bash
POST /api/trpc/post.hello
Content-Type: application/json

{
  "input": {
    "text": "from tRPC"
  }
}
```

**Response**:
```json
{
  "result": {
    "data": {
      "greeting": "Hello from tRPC"
    }
  }
}
```

---

### Protected Endpoints

All protected endpoints require valid authentication. Unauthenticated requests will receive a `401 UNAUTHORIZED` error.

#### `post.create`

**Description**: Creates a new post for the authenticated user.

**Type**: `protectedProcedure` (authentication required)

**Input Schema**:
```typescript
{
  name: string (minimum length: 1)
}
```

**Output Schema**:
```typescript
{
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  createdById: string
}
```

**Example Usage**:
```typescript
// Client-side usage
const newPost = await api.post.create.mutate({ 
  name: "My First Post" 
});
```

**Validation Rules**:
- `name`: Required, minimum 1 character
- User must be authenticated

**Error Scenarios**:
- `401 UNAUTHORIZED`: User not authenticated
- `400 BAD_REQUEST`: Invalid input (empty name)
- `500 INTERNAL_SERVER_ERROR`: Database error

#### `post.getLatest`

**Description**: Retrieves the most recent post created by the authenticated user.

**Type**: `protectedProcedure` (authentication required)

**Input Schema**: None

**Output Schema**:
```typescript
{
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  createdById: string
} | null
```

**Example Usage**:
```typescript
// Client-side usage
const latestPost = await api.post.getLatest.query();
if (latestPost) {
  console.log(latestPost.name);
} else {
  console.log("No posts found");
}
```

**Behavior**:
- Returns `null` if user has no posts
- Only returns posts created by the authenticated user
- Orders by `createdAt` in descending order

#### `post.getSecretMessage`

**Description**: Demonstration endpoint for protected content.

**Type**: `protectedProcedure` (authentication required)

**Input Schema**: None

**Output Schema**:
```typescript
string
```

**Example Usage**:
```typescript
// Client-side usage
const message = await api.post.getSecretMessage.query();
console.log(message); // "you can now see this secret message!"
```

---

## Client-Side Usage

### React Components

```typescript
import { api } from "~/trpc/react";

export function MyComponent() {
  // Query (GET operation)
  const { data: latestPost, isLoading } = api.post.getLatest.useQuery();
  
  // Mutation (POST/PUT/DELETE operation)
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      utils.post.invalidate();
    },
  });

  const handleSubmit = (name: string) => {
    createPost.mutate({ name });
  };

  return (
    <div>
      {isLoading ? "Loading..." : latestPost?.name}
      <button onClick={() => handleSubmit("New Post")}>
        Create Post
      </button>
    </div>
  );
}
```

### Server-Side Usage

```typescript
import { api } from "~/trpc/server";

export default async function Page() {
  // Direct server-side API call
  const hello = await api.post.hello({ text: "from server" });
  
  // Pre-fetch data for client hydration
  void api.post.getLatest.prefetch();
  
  return <div>{hello.greeting}</div>;
}
```

---

## Error Handling

### Error Types

| Code | Description | Common Causes |
|------|-------------|---------------|
| `UNAUTHORIZED` | Authentication required | No session, expired session |
| `BAD_REQUEST` | Invalid input data | Validation errors, missing fields |
| `INTERNAL_SERVER_ERROR` | Server error | Database errors, unexpected exceptions |
| `NOT_FOUND` | Resource not found | Invalid IDs, deleted resources |

### Error Response Format

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "data": {
      "code": "ERROR_CODE",
      "httpStatus": 400,
      "path": "post.create"
    }
  }
}
```

### Client Error Handling

```typescript
const createPost = api.post.create.useMutation({
  onError: (error) => {
    if (error.data?.code === "UNAUTHORIZED") {
      // Redirect to login
      router.push("/api/auth/signin");
    } else {
      // Show error message
      toast.error(error.message);
    }
  },
});
```

---

## Authentication Context

Protected procedures automatically receive authentication context:

```typescript
type Context = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
    expires: string;
  };
  db: PrismaClient; // Database client
};
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production deployments, consider:
- Implementing tRPC middleware for rate limiting
- Using reverse proxy rate limiting (Nginx, Cloudflare)
- Database-level connection pooling

---

## Caching

### Client-Side Caching
- TanStack Query handles automatic caching
- Default stale time: 0ms (always refetch)
- Default cache time: 5 minutes

### Server-Side Caching
- No server-side caching implemented
- Consider Redis for session storage and API caching

---

## Testing API Endpoints

### Unit Testing

```typescript
import { createCallerFactory } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";

const createCaller = createCallerFactory(appRouter);

test("post.hello returns greeting", async () => {
  const caller = createCaller({
    session: null,
    db: mockDb,
  });

  const result = await caller.post.hello({ text: "test" });
  expect(result.greeting).toBe("Hello test");
});
```

### Integration Testing

```typescript
import { api } from "~/trpc/react";
import { renderHook, waitFor } from "@testing-library/react";

test("post.getLatest returns user posts", async () => {
  const { result } = renderHook(() => 
    api.post.getLatest.useQuery()
  );

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toBeDefined();
});
```

---

## Future API Endpoints

Planned endpoints for future releases:

- `post.getAll` - Get all posts for user with pagination
- `post.update` - Update existing post
- `post.delete` - Delete post
- `post.search` - Search posts by content
- `user.profile` - Get/update user profile
- `user.posts` - Get all posts by user ID

---

**Last Updated**: July 12, 2025  
**API Version**: 1.0  
**tRPC Version**: 11.0.0