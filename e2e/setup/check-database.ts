import { PrismaClient } from "@prisma/client";

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    // Try to connect to the database
    await prisma.$connect();
    console.log("✅ Database connection successful");
    
    // Check if database is seeded (has roles)
    const roleCount = await prisma.role.count();
    if (roleCount === 0) {
      console.log("⚠️  Database is not seeded. Running seed...");
      // Run seed command
      const { execSync } = await import("child_process");
      execSync("yarn prisma db seed", { stdio: "inherit" });
      console.log("✅ Database seeded successfully");
    } else {
      console.log("✅ Database is properly seeded");
    }
    
    return true;
  } catch (error: any) {
    console.error("❌ Database connection failed!");
    console.error("");
    
    if (error.message?.includes("Can't reach database server")) {
      console.error("The database server is not running.");
      console.error("");
      console.error("To start the database, run one of these commands:");
      console.error("  1. Using Docker: ./start-database.sh");
      console.error("  2. Using local PostgreSQL: ensure it's running on port 5432");
      console.error("");
      console.error("For CI environments, ensure DATABASE_URL is properly configured.");
    } else {
      console.error("Error details:", error.message);
    }
    
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export { checkDatabase }; 