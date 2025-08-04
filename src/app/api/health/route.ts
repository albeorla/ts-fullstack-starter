import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Basic health check - can be extended with database connectivity check
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV ?? "development",
      version: process.env.npm_package_version ?? "unknown",
    };

    return NextResponse.json(healthStatus);
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
