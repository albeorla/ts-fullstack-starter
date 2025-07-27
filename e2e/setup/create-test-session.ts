import { PrismaClient } from "@prisma/client";
import { encode } from "next-auth/jwt";
import crypto from "crypto";

// Make crypto available globally for next-auth/jwt
if (typeof global !== "undefined" && !global.crypto) {
  global.crypto = crypto as any;
}

const prisma = new PrismaClient();

export async function createTestSession(role: "USER" | "ADMIN" = "USER") {
  const email = role === "ADMIN" ? "admin@example.com" : "user@example.com";
  const name = role === "ADMIN" ? "Admin User" : "Test User";

  console.log(`Creating test session for ${role} user...`);

  // Use the same URL as the E2E test environment
  const nextAuthUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3001";
  console.log(`Using NEXTAUTH_URL: ${nextAuthUrl}`);

  try {
    // Ensure user exists with proper data
    const user = await prisma.user.upsert({
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

    // Ensure role exists
    const roleRecord = await prisma.role.findFirst({
      where: { name: role },
    });

    if (!roleRecord) {
      throw new Error(`Role ${role} not found in database`);
    }

    // Clear existing roles and assign new one
    await prisma.userRole.deleteMany({
      where: { userId: user.id },
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: roleRecord.id,
      },
    });

    // Create JWT token with proper structure
    const token = await encode({
      token: {
        sub: user.id,
        email: user.email,
        name: user.name,
        picture: user.image,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      },
      secret: process.env.AUTH_SECRET ?? "test-secret-for-ci",
      salt: process.env.AUTH_SALT ?? "authjs.session-token",
    });

    // Create or update session
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.session.upsert({
      where: { sessionToken: token },
      update: {
        expires: sessionExpiry,
        userId: user.id,
      },
      create: {
        sessionToken: token,
        userId: user.id,
        expires: sessionExpiry,
      },
    });

    console.log(`✅ Test session created for ${email} (${role})`);

    return {
      sessionToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        roles: [role],
      },
    };
  } catch (error) {
    console.error("Failed to create test session:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
