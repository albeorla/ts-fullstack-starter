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
    const cookieName = process.env.NODE_ENV === "production" 
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

    // Navigate to admin page to verify authentication
    console.log("Navigating to verify admin authentication...");
    await page.goto("/admin");
    
    // Wait for the page to load
    await page.waitForTimeout(2000);

    // Verify admin authentication by checking for admin-specific elements
    try {
      // Check for admin-specific elements
      const adminElements = [
        page.getByRole("heading", { name: /admin/i }),
        page.getByRole("link", { name: /users/i }),
        page.getByRole("link", { name: /roles/i }),
        page.getByRole("link", { name: /permissions/i }),
        page.getByText(/admin dashboard/i),
        page.getByText(/system overview/i),
      ];

      let authenticated = false;
      for (const element of adminElements) {
        if (await element.isVisible({ timeout: 5000 }).catch(() => false)) {
          authenticated = true;
          break;
        }
      }

      if (!authenticated) {
        // Check if we were redirected away from admin
        const currentUrl = page.url();
        if (!currentUrl.includes("/admin")) {
          console.error("Redirected away from admin page:", currentUrl);
        }

        // Take a screenshot for debugging
        await page.screenshot({ 
          path: "e2e/.auth/admin-auth-failure.png",
          fullPage: true 
        });
        
        console.error("Admin authentication verification failed");
        console.log("Page URL:", currentUrl);
        console.log("Page title:", await page.title());
        
        throw new Error("Admin authentication setup failed - could not access admin area");
      }

      console.log("✅ Admin authentication successful!");
      console.log("✅ Admin user:", sessionData.user.email);

      // Save storage state
      await page.context().storageState({ path: authFile });
      console.log("✅ Admin auth state saved to:", authFile);
    } catch (error) {
      console.error("Admin authentication verification error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Admin authentication setup failed:", error);
    
    // Take a screenshot on failure
    try {
      await page.screenshot({ 
        path: "e2e/.auth/admin-setup-error.png",
        fullPage: true 
      });
    } catch (screenshotError) {
      console.error("Failed to take error screenshot:", screenshotError);
    }
    
    throw error;
  }
}); 