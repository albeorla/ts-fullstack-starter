import { test, expect } from "@playwright/test";
import { createTestSession } from "./setup/create-test-session";

// Create a separate test that uses admin authentication
test.describe("Admin Dashboard", () => {
  test.use({
    storageState: undefined, // Don't use the default auth state
  });

  test("admin user should see the admin dashboard link", async ({ page, context }) => {
    // Create an admin session
    const adminSession = await createTestSession({
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
    });

    // Set the admin session cookie
    await context.addCookies([
      {
        name: "next-auth.session-token",
        value: adminSession.sessionToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        expires: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      },
      // Also set authjs cookie name (v5)
      {
        name: "authjs.session-token",
        value: adminSession.sessionToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        expires: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      },
    ]);

    await page.goto("/");

    // Wait for a stable element on the page to ensure it's loaded.
    await expect(page.getByRole("heading", { name: /Create T3 App/i })).toBeVisible();

    // Admin should see the admin dashboard button
    const adminButton = page.getByRole("button", { name: "Admin Dashboard" });
    
    // For alternative selectors, also try link
    const adminLink = page.getByRole("link", { name: "Admin Dashboard" });

    // Check if either button or link exists
    const hasAdminButton = await adminButton.isVisible().catch(() => false);
    const hasAdminLink = await adminLink.isVisible().catch(() => false);

    if (hasAdminButton || hasAdminLink) {
      console.log("✅ Admin Dashboard element is visible.");
      await page.screenshot({ path: "test-results/screenshot-admin-view-success.png" });
    } else {
      console.error("❌ Admin Dashboard element not found. Capturing page state...");
      
      // Log the page's HTML for debugging
      const pageHtml = await page.content();
      console.error("📄 Page HTML snippet:", pageHtml.substring(0, 2000) + "...");
      
      // Check what role the user actually has
      const sessionInfo = await page.locator("pre").textContent().catch(() => "No session info found");
      console.error("📊 Session info:", sessionInfo);
      
      await page.screenshot({ path: "test-results/screenshot-admin-view-failure.png" });
      
      throw new Error("Admin Dashboard element not found");
    }
  });
});

// Regular user tests can continue using the default auth
test.describe("Regular User", () => {
  test("regular user should not see admin dashboard link", async ({ page }) => {
    await page.goto("/");
    
    await expect(page.getByRole("heading", { name: /Create T3 App/i })).toBeVisible();
    
    // Regular user should NOT see admin dashboard
    const adminButton = page.getByRole("button", { name: "Admin Dashboard" });
    const adminLink = page.getByRole("link", { name: "Admin Dashboard" });
    
    await expect(adminButton).not.toBeVisible();
    await expect(adminLink).not.toBeVisible();
    
    console.log("✅ Confirmed: Regular user cannot see Admin Dashboard");
  });
});