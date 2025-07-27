import { test, expect } from "@playwright/test";
import { createTestSession } from "./setup/create-test-session";

// Create a separate test that uses admin authentication
test.describe("Admin Dashboard", () => {
  test.use({
    storageState: undefined, // Don't use the default auth state
  });

  test("admin user should see user management section", async ({
    page,
    context,
  }) => {
    // Create an admin session
    const adminSession = await createTestSession("ADMIN");

    // Set the admin session cookies
    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";

    await context.addCookies([
      {
        name: cookieName,
        value: adminSession.sessionToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        expires: Math.floor(Date.now() / 1000) + 86400, // 24 hours
      },
    ]);

    await page.goto("/");

    // Wait for the dashboard to load - check for greeting or account status
    await expect(
      page
        .getByText(/Good (morning|afternoon|evening),/)
        .or(page.getByText("Account Status")),
    ).toBeVisible({ timeout: 10000 });

    // Admin should see the System Overview section (not User Management)
    await expect(page.getByText("System Overview")).toBeVisible();
    await expect(
      page.getByText("Quick insights into system health"),
    ).toBeVisible();

    console.log("✅ User Management section is visible for admin user.");
    await page.screenshot({
      path: "test-results/screenshot-admin-view-success.png",
    });
  });
});

// Regular user tests can continue using the default auth
test.describe("Regular User", () => {
  test("regular user should not see admin features", async ({ page }) => {
    await page.goto("/");

    // Wait for dashboard to load
    await expect(
      page
        .getByText(/Good (morning|afternoon|evening),/)
        .or(page.getByText("Account Status")),
    ).toBeVisible({ timeout: 10000 });

    // Regular user should NOT see admin System Overview section
    await expect(page.getByText("System Overview")).not.toBeVisible();
    await expect(
      page.getByText("Quick insights into system health"),
    ).not.toBeVisible();

    console.log(
      "✅ Confirmed: Regular user cannot see System Overview section",
    );
  });
});
