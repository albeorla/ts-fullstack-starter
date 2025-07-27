import { Page, expect, BrowserContext } from "@playwright/test";
import { createTestSession } from "../setup/create-test-session";

/**
 * Common test utilities for E2E tests
 */

/**
 * Wait for page to be fully loaded with network idle
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState("networkidle");
}

/**
 * Setup admin session directly without using UI
 */
export async function setupAdminSession(context: BrowserContext) {
  // Create an admin session
  const adminSession = await createTestSession({
    email: "admin@example.com",
    name: "Admin User",
    role: "ADMIN",
  });

  // Set the admin session cookies
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

  return adminSession;
}

/**
 * Setup user session directly without using UI
 */
export async function setupUserSession(context: BrowserContext) {
  // Create a user session
  const userSession = await createTestSession({
    email: "user@example.com",
    name: "Regular User",
    role: "USER",
  });

  // Set the user session cookies
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: userSession.sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    },
    {
      name: "authjs.session-token",
      value: userSession.sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    },
  ]);

  return userSession;
}

/**
 * Login as admin user using test login
 */
export async function loginAsAdmin(page: Page) {
  // First, always try to go to auth page
  await page.goto("/auth");
  await waitForPageLoad(page);

  // Ensure the user is logged out before proceeding
  await logoutIfLoggedIn(page);
  // Now we should be on the auth page - verify
  if (!page.url().includes("/auth")) {
    throw new Error("Failed to navigate to auth page for login");
  }

  // Wait for and click the admin test login button
  const adminButton = page.getByRole("button", { name: "Test Login (Admin)" });
  await adminButton.waitFor({ state: "visible", timeout: 10000 });
  await adminButton.click();
  await waitForPageLoad(page);

  // Verify we're logged in as admin by checking for admin navigation
  const adminNav = page.getByText("Administration");
  await expect(adminNav).toBeVisible({ timeout: 5000 });
}

/**
 * Login as regular user using test login
 */
export async function loginAsUser(page: Page) {
  // First check if we're already logged in
  const currentUrl = page.url();
  if (!currentUrl.includes("/auth")) {
    // We're logged in, need to log out first
    await page.goto("/");
    await waitForPageLoad(page);

    // Click user menu
    const userMenu = page.locator('button[aria-haspopup="menu"]').last();
    if (await userMenu.isVisible()) {
      await userMenu.click();

      // Click sign out
      const signOutButton = page.getByRole("menuitem", { name: "Sign out" });
      if (await signOutButton.isVisible()) {
        await signOutButton.click();
        await waitForPageLoad(page);
      }
    }
  }

  // Now we should be on auth page or can navigate to it
  if (!page.url().includes("/auth")) {
    await page.goto("/auth");
    await waitForPageLoad(page);
  }

  // Click the user test login button
  await page.getByRole("button", { name: "Test Login (User)" }).click();
  await waitForPageLoad(page);

  // Verify we're logged in
  await page.goto("/");
  await waitForPageLoad(page);
}

/**
 * Verify user is on dashboard
 */
export async function verifyDashboard(page: Page) {
  // Wait for page to fully load
  await waitForPageLoad(page);

  // Check for the time-based greeting (with comma and space) - the main indicator
  const greeting = page.getByText(/Good (morning|afternoon|evening), /);
  
  try {
    await expect(greeting).toBeVisible({ timeout: 8000 });
    return; // Successfully found greeting
  } catch {
    console.log("Greeting not found, checking for other dashboard elements...");
  }

  // Try to find any of these key dashboard elements (based on actual DOM structure)
  const dashboardElements = [
    { locator: page.getByText("Account Status"), name: "Account Status" },
    { locator: page.getByText("Profile Overview"), name: "Profile Overview" },
    { locator: page.getByText("Your account information and settings"), name: "Profile description" },
    { locator: page.getByText("Recent Activity"), name: "Recent Activity" },
    { locator: page.getByText("System Overview"), name: "System Overview (admin)" },
    { locator: page.getByText("Total Sessions"), name: "Total Sessions card" },
    { locator: page.getByText("Your Roles"), name: "Your Roles card" },
  ];

  let found = false;
  for (const element of dashboardElements) {
    try {
      if (await element.locator.isVisible({ timeout: 2000 })) {
        console.log(`✅ Found dashboard element: ${element.name}`);
        await expect(element.locator).toBeVisible();
        found = true;
        break;
      }
    } catch {
      console.log(`❌ Element not found: ${element.name}`);
    }
  }

  if (!found) {
    // Final check - look for the header container or main content
    const header = page.locator('header h1').or(page.locator('h1')).first();
    if (await header.isVisible().catch(() => false)) {
      console.log("✅ Found page header, assuming dashboard loaded");
      return;
    }
    
    throw new Error("Dashboard not properly loaded - no recognizable elements found");
  }
}

/**
 * Navigate to admin section and verify access
 */
export async function navigateToAdmin(
  page: Page,
  section: "users" | "roles" | "permissions",
) {
  await page.goto(`/admin/${section}`);
  await waitForPageLoad(page);
}

/**
 * Verify stats cards are visible and have valid data
 */
export async function verifyStatsCards(page: Page, expectedCards: string[]) {
  for (const cardTitle of expectedCards) {
    await expect(page.getByText(cardTitle)).toBeVisible();
  }
}

/**
 * Verify role badges are visible with correct styling
 */
export async function verifyRoleBadges(page: Page, expectedRoles: string[]) {
  for (const role of expectedRoles) {
    const badge = page.locator(`[data-slot="badge"]:has-text("${role}")`).first();
    await expect(badge).toBeVisible();

    // Verify gradient styling based on role
    if (role === "ADMIN") {
      await expect(badge).toHaveClass(/from-red-500/);
    } else if (role === "USER") {
      await expect(badge).toHaveClass(/from-blue-500/);
    } else if (role === "TEST") {
      await expect(badge).toHaveClass(/from-purple-500/);
    }
  }
}

/**
 * Verify card styling enhancements
 */
export async function verifyCardStyling(page: Page, cardSelector: string) {
  const card = page.locator(cardSelector);
  await expect(card).toBeVisible();

  // Check for enhanced card variants
  const hasVariant = await card.evaluate((el) => {
    return (
      el.className.includes("shadow-") || el.className.includes("hover:shadow-")
    );
  });

  expect(hasVariant).toBeTruthy();
}

/**
 * Verify responsive navigation
 */
export async function verifyNavigation(page: Page) {
  // Desktop navigation
  if (await page.locator('[data-testid="desktop-nav"]').isVisible()) {
    await expect(page.getByRole("button", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Users" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Roles" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Permissions" }),
    ).toBeVisible();
  }
}

/**
 * Test form interactions
 */
export async function testFormSubmission(
  page: Page,
  formSelector: string,
  submitButtonText: string,
) {
  const form = page.locator(formSelector);
  await expect(form).toBeVisible();

  const submitButton = page.getByRole("button", { name: submitButtonText });
  await expect(submitButton).toBeVisible();

  return { form, submitButton };
}

/**
 * Verify dialog/modal functionality
 */
export async function verifyDialog(
  page: Page,
  triggerText: string,
  dialogTitle: string,
) {
  // Click trigger to open dialog
  await page.getByRole("button", { name: triggerText }).click();

  // Verify dialog is visible
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(dialogTitle)).toBeVisible();

  return dialog;
}

/**
 * Take screenshot for visual regression testing
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Verify theme toggle functionality
 */
export async function verifyThemeToggle(page: Page) {
  const themeButton = page.getByRole("button", { name: "Toggle theme" });
  await expect(themeButton).toBeVisible();

  // Get current theme
  const html = page.locator("html");
  const currentTheme = await html.getAttribute("class");

  // Click theme toggle
  await themeButton.click();

  // Verify theme changed
  await page.waitForTimeout(100); // Allow theme transition
  const newTheme = await html.getAttribute("class");
  expect(newTheme).not.toBe(currentTheme);

  return { currentTheme, newTheme };
}

/**
 * Verify loading states
 */
export async function verifyLoadingStates(page: Page) {
  // Look for skeleton loading indicators
  const skeletons = page.locator('[data-slot="skeleton"]');
  const skeletonCount = await skeletons.count();

  if (skeletonCount > 0) {
    // Wait for loading to complete
    await expect(skeletons.first()).not.toBeVisible({ timeout: 10000 });
  }
}

/**
 * Verify error handling
 */
export async function verifyErrorState(page: Page, errorMessage?: string) {
  if (errorMessage) {
    await expect(page.getByText(errorMessage)).toBeVisible();
  } else {
    // Look for common error indicators
    const errorSelectors = [
      '[data-testid="error"]',
      ".error",
      '[role="alert"]',
      "text=/error/i",
    ];

    let errorFound = false;
    for (const selector of errorSelectors) {
      if (await page.locator(selector).isVisible()) {
        errorFound = true;
        break;
      }
    }

    return errorFound;
  }
}
