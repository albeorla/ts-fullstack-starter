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
    
    // Wait for the page to fully load including all API calls
    await page.waitForLoadState("networkidle", { timeout: 30000 });

    // Verify we're logged in by checking for the dashboard greeting or key dashboard elements
    const greetingText = await page.locator(
      "text=/Good (morning|afternoon|evening)/i",
    );
    const dashboardHeading = await page.locator("h1");
    const accountStatusCard = await page.locator("text=Account Status");

    // Wait a bit for any hydration to complete
    await page.waitForTimeout(2000);

    const isGreetingVisible = await greetingText
      .isVisible({ timeout: 10000 })
      .catch(() => false);
    const isAccountStatusVisible = await accountStatusCard
      .isVisible({ timeout: 10000 })
      .catch(() => false);

    if (!isGreetingVisible && !isAccountStatusVisible) {
      // Debug information
      console.log("Page URL:", page.url());
      console.log("Auth verification failed. Debug info:");
      console.log("- Session token created:", sessionData.sessionToken);
      console.log("- User email:", sessionData.userEmail);

      // Check page title and heading
      const pageTitle = await page.title();
      const headingText = await dashboardHeading
        .textContent()
        .catch(() => null);
      console.log("- Page title:", pageTitle);
      console.log("- Page heading:", headingText);

      // Check if there's an error on the page
      const errorText = await page
        .locator("text=/error/i")
        .textContent()
        .catch(() => null);
      if (errorText) {
        console.log("- Error on page:", errorText);
      }

      // Take a screenshot for debugging
      await page.screenshot({ path: "e2e/auth-setup-failure.png", fullPage: true });

      throw new Error(
        "Failed to verify authentication - Dashboard elements not found",
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
