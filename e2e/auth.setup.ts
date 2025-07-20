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

    // Set the session cookie
    await context.addCookies([
      {
        name: "next-auth.session-token",
        value: sessionData.sessionToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      },
      // Also set authjs cookie name (v5)
      {
        name: "authjs.session-token",
        value: sessionData.sessionToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      },
    ]);

    // Navigate to home page to verify
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify we're logged in by checking for the dashboard welcome message
    const welcomeText = await page.locator("text=/Welcome back/i");
    const isVisible = await welcomeText
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (!isVisible) {
      // Debug information
      console.log("Page URL:", page.url());
      const pageContent = await page.content();
      console.log("Auth verification failed. Debug info:");
      console.log("- Session token created:", sessionData.sessionToken);
      console.log("- User email:", sessionData.userEmail);

      // Check if there's an error on the page
      const errorText = await page
        .locator("text=/error/i")
        .textContent()
        .catch(() => null);
      if (errorText) {
        console.log("- Error on page:", errorText);
      }

      throw new Error(
        "Failed to verify authentication - 'Welcome back' text not found",
      );
    }

    console.log("✅ Authentication successful!");
    console.log("✅ User:", sessionData.userEmail);

    // Save authentication state
    await context.storageState({ path: authFile });
    console.log("✅ Authentication state saved for reuse in tests");
  } catch (error) {
    console.error("❌ Authentication setup failed:", error);
    throw error;
  }
});
