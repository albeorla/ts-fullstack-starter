import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

// Track logged sessions to avoid duplicate messages
const loggedSessions = new Set<string>();

// Control logging verbosity via environment variable
const isVerbose = process.env.VERBOSE_TEST_LOGS === "true" || process.env.TEST_LOG_LEVEL === "verbose";

interface CreateTestSessionOptions {
  email?: string;
  name?: string;
  role?: "USER" | "ADMIN";
}

async function createTestSession(options: CreateTestSessionOptions = {}) {
  const {
    email = "test@example.com",
    name = "Test User",
    role = "USER",
  } = options;

  // Log only if verbose mode is enabled or this is the first time for this role
  const sessionKey = `${role}-${email}`;
  const shouldLog = isVerbose || !loggedSessions.has(sessionKey);
  
  if (shouldLog) {
    console.log(`Creating test session for ${role} user...`);
    loggedSessions.add(sessionKey);
  }

  try {
    // Create or update test user
    const testUser = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        image: "https://github.com/ghost.png",
        emailVerified: new Date(),
      },
      create: {
        email,
        name,
        image: "https://github.com/ghost.png",
        emailVerified: new Date(),
      },
    });

    // Get the requested role
    const requestedRole = await prisma.role.findFirst({
      where: { name: role },
    });

    if (requestedRole) {
      // First, remove any existing roles that are not the requested role
      await prisma.userRole.deleteMany({
        where: {
          userId: testUser.id,
          roleId: { not: requestedRole.id },
        },
      });

      // Then ensure the requested role is assigned (handle race conditions)
      try {
        await prisma.userRole.create({
          data: {
            userId: testUser.id,
            roleId: requestedRole.id,
          },
        });
      } catch (error: any) {
        // If it's a unique constraint error, the role is already assigned - that's fine
        if (error?.code !== "P2002") {
          console.error("Error creating test session:", error);
          throw error;
        }
      }
    } else {
      console.warn(`Warning: ${role} role not found in database`);
    }

    // Create a session token
    const sessionToken = randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days from now

    // Create session
    const session = await prisma.session.upsert({
      where: { sessionToken },
      update: {
        userId: testUser.id,
        expires,
      },
      create: {
        sessionToken,
        userId: testUser.id,
        expires,
      },
    });

    if (shouldLog) {
      console.log(`✅ Test session created for ${email} (${role})`);
    }

    // Return the session details
    return {
      sessionToken,
      userId: testUser.id,
      userEmail: testUser.email,
      userRole: role,
    };
  } catch (error) {
    console.error("Error creating test session:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export { createTestSession };
