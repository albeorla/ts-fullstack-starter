import { test as setup } from "@playwright/test";
import { createTestSession } from "./setup/create-test-session";
import { checkDatabase } from "./setup/check-database";

const authFile = "e2e/.auth/admin.json";

setup("authenticate as admin", async ({ page, context }) => {
  console.log("Starting admin authentication setup...");

  // Check database connection first
  console.log("Checking database connection...");
  const dbReady = await checkDatabase();

  if (!dbReady) {
    throw new Error(
      "Database is not available. Please ensure the database is running before running tests.",
    );
  }

  try {
    // Create admin session
    console.log("Creating admin session in database...");
    const sessionData = await createTestSession("ADMIN");

    // Set the auth session cookie using the correct name
    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";

    console.log(`Setting ${cookieName} cookie for admin...`);

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

    // Navigate to verify admin authentication
    console.log("Navigating to verify admin authentication...");
    await page.goto("/admin");

    // Wait for navigation to complete
    await page.waitForLoadState("networkidle");

    // Check if we stayed on the admin page or got redirected to auth
    const currentUrl = page.url();
    console.log("Current URL after navigation:", currentUrl);

    // If we're redirected to /auth, the session isn't working
    if (currentUrl.includes("/auth")) {
      // Take a screenshot for debugging
      await page.screenshot({
        path: "e2e/.auth/admin-auth-failure.png",
        fullPage: true,
      });

      console.error("Admin authentication failed - redirected to auth page");

      // Check cookies for debugging
      const cookies = await context.cookies();
      console.log(
        "Cookies set:",
        cookies.map((c) => ({ name: c.name, domain: c.domain, path: c.path })),
      );

      throw new Error(
        "Admin authentication setup failed - session not recognized by application",
      );
    }

    // Additional check - wait for admin page content
    try {
      // The admin page should be accessible
      await page.waitForSelector(
        "text=/Admin|Dashboard|Users|Roles|Permissions/",
        {
          timeout: 10000,
        },
      );
      console.log("✅ Admin authentication verified - admin content found");
    } catch (error) {
      // Take a screenshot for debugging
      await page.screenshot({
        path: "e2e/.auth/admin-verification-timeout.png",
        fullPage: true,
      });

      console.error("Admin authentication verification timeout");
      console.error(
        "Page content:",
        await page
          .textContent("body")
          .catch(() => "Could not get page content"),
      );

      throw new Error(
        "Admin authentication setup failed - admin content not found",
      );
    }

    console.log("✅ Admin authentication successful!");
    console.log("✅ Admin user:", sessionData.user.email);

    // Save storage state
    await page.context().storageState({ path: authFile });
    console.log("✅ Admin auth state saved to:", authFile);
  } catch (error) {
    console.error("Admin authentication setup failed:", error);

    // Take a screenshot on failure
    try {
      await page.screenshot({
        path: "e2e/.auth/admin-setup-error.png",
        fullPage: true,
      });
    } catch (screenshotError) {
      console.error("Failed to take error screenshot:", screenshotError);
    }

    throw error;
  }
});
