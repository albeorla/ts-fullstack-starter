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
        expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      },
      // Also set authjs cookie name (v5)
      {
        name: "authjs.session-token",
        value: adminSession.sessionToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      },
    ]);

    await page.goto("/");

    // Wait for the dashboard to load
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();

    // Admin should see the User Management section
    await expect(page.getByText("User Management")).toBeVisible();
    await expect(
      page.getByText("Manage user roles and permissions"),
    ).toBeVisible();

    console.log("✅ User Management section is visible for admin user.");
    await page.screenshot({
      path: "test-results/screenshot-admin-view-success.png",
    });
  });
});

// Regular user tests can continue using the default auth
test.describe("Regular User", () => {
  test("regular user should not see user management section", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();

    // Regular user should NOT see user management section text
    await expect(page.getByText("User Management")).not.toBeVisible();
    await expect(
      page.getByText("Manage user roles and permissions"),
    ).not.toBeVisible();

    console.log(
      "✅ Confirmed: Regular user cannot see User Management section",
    );
  });
});
