import { test as setup } from "@playwright/test";
import { createTestSession } from "./setup/create-test-session";
import { checkDatabase } from "./setup/check-database";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page, context }) => {
  console.log("Starting automated authentication setup...");

  // Check database connection first
  console.log("Checking database connection...");
  const dbReady = await checkDatabase();

  if (!dbReady) {
    throw new Error(
      "Database is not available. Please ensure the database is running before running tests.",
    );
  }

  try {
    // Create test session directly - no manual intervention
    console.log("Creating test session in database...");
    const sessionData = await createTestSession();

    // Set the auth session cookie using the correct name
    // For Next.js App Router with database sessions, the cookie name is:
    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";

    console.log(`Setting ${cookieName} cookie...`);

    // Set the session cookie
    await context.addCookies([
      {
        name: cookieName,
        value: sessionData.sessionToken,
        domain: "localhost",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 86400, // 24 hours
        httpOnly: true,
        secure: false, // Set to false for localhost
        sameSite: "Lax",
      },
    ]);

    // Navigate to verify authentication
    console.log("Navigating to verify authentication...");
    await page.goto("/");

    // Wait for navigation to complete
    await page.waitForLoadState("networkidle");

    // Check if we stayed on the home page or got redirected to auth
    const currentUrl = page.url();
    console.log("Current URL after navigation:", currentUrl);

    // If we're redirected to /auth, the session isn't working
    if (currentUrl.includes("/auth")) {
      // Take a screenshot for debugging
      await page.screenshot({
        path: "e2e/.auth/auth-failure.png",
        fullPage: true,
      });

      console.error("Authentication failed - redirected to auth page");

      // Check cookies for debugging
      const cookies = await context.cookies();
      console.log(
        "Cookies set:",
        cookies.map((c) => ({ name: c.name, domain: c.domain, path: c.path })),
      );

      throw new Error(
        "Authentication setup failed - session not recognized by application",
      );
    }

    // Additional check - wait for the authenticated layout to load
    try {
      // The home page should show the greeting message for authenticated users
      await page.waitForSelector("text=/Good (morning|afternoon|evening)/", {
        timeout: 10000,
      });
      console.log("✅ Authentication verified - user greeting found");
    } catch (error) {
      // Take a screenshot for debugging
      await page.screenshot({
        path: "e2e/.auth/auth-verification-timeout.png",
        fullPage: true,
      });

      console.error("Authentication verification timeout");
      console.error(
        "Page content:",
        await page
          .textContent("body")
          .catch(() => "Could not get page content"),
      );

      throw new Error(
        "Authentication setup failed - authenticated content not found",
      );
    }

    console.log("✅ Authentication successful!");

    // Save storage state
    await page.context().storageState({ path: authFile });
    console.log("✅ Auth state saved to:", authFile);
  } catch (error) {
    console.error("Authentication setup failed:", error);

    // Take a screenshot on failure
    try {
      await page.screenshot({
        path: "e2e/.auth/setup-error.png",
        fullPage: true,
      });
    } catch (screenshotError) {
      console.error("Failed to take error screenshot:", screenshotError);
    }

    throw error;
  }
});
