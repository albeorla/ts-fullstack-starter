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
    const cookieName = process.env.NODE_ENV === "production" 
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

    // Navigate to home page to verify authentication
    console.log("Navigating to verify authentication...");
    await page.goto("/");
    
    // Wait longer for the page to load and session to be recognized
    await page.waitForTimeout(2000);

    // Verify authentication by checking for authenticated elements
    try {
      // First try to find any sign that we're authenticated
      const authenticatedElements = [
        page.getByRole("button", { name: /sign out/i }),
        page.getByRole("link", { name: /dashboard/i }),
        page.getByRole("link", { name: /settings/i }),
        page.getByText(/welcome/i),
      ];

      let authenticated = false;
      for (const element of authenticatedElements) {
        if (await element.isVisible({ timeout: 5000 }).catch(() => false)) {
          authenticated = true;
          break;
        }
      }

      if (!authenticated) {
        // Take a screenshot for debugging
        await page.screenshot({ 
          path: "e2e/.auth/auth-failure.png",
          fullPage: true 
        });
        
        console.error("Authentication verification failed - no authenticated elements found");
        console.log("Page URL:", page.url());
        console.log("Page title:", await page.title());
        
        // Log any visible error messages
        const errorMessage = await page.locator('[role="alert"], .error, .alert').first().textContent().catch(() => null);
        if (errorMessage) {
          console.error("Error message on page:", errorMessage);
        }
        
        throw new Error("Authentication setup failed - could not verify authenticated state");
      }

      console.log("✅ Authentication successful!");

      // Save storage state
      await page.context().storageState({ path: authFile });
      console.log("✅ Auth state saved to:", authFile);
    } catch (error) {
      console.error("Authentication verification error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Authentication setup failed:", error);
    
    // Take a screenshot on failure
    try {
      await page.screenshot({ 
        path: "e2e/.auth/setup-error.png",
        fullPage: true 
      });
    } catch (screenshotError) {
      console.error("Failed to take error screenshot:", screenshotError);
    }
    
    throw error;
  }
});
