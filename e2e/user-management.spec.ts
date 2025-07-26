import { test, expect } from "@playwright/test";

test.describe("User Management", () => {
  test("admin can access user management page", async ({ page }) => {
    // Login as admin
    await page.goto("/auth");
    await page.getByRole("button", { name: "Test Login (Admin)" }).click();
    
    // Navigate to user management
    await page.goto("/admin/users");
    
    // Check that the page loads
    await expect(page.getByRole("heading", { name: "User Management" })).toBeVisible();
    
    // Check that stats cards are visible
    await expect(page.getByText("Total Users")).toBeVisible();
    await expect(page.getByText("Active Roles")).toBeVisible();
    await expect(page.getByText("Admin Users")).toBeVisible();
    
    // Check that user list is visible
    await expect(page.getByText("Admin User")).toBeVisible();
    await expect(page.getByText("Test User")).toBeVisible();
  });

  test("non-admin cannot access user management page", async ({ page }) => {
    // Login as regular user
    await page.goto("/auth");
    await page.getByRole("button", { name: "Test Login (User)" }).click();
    
    // Try to access user management
    await page.goto("/admin/users");
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL("/");
  });

  test("admin can edit user roles", async ({ page }) => {
    // Login as admin
    await page.goto("/auth");
    await page.getByRole("button", { name: "Test Login (Admin)" }).click();
    
    // Navigate to user management
    await page.goto("/admin/users");
    
    // Click edit roles for a user
    await page.getByRole("button", { name: "Edit Roles" }).first().click();
    
    // Check that role dialog opens
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Edit User Roles")).toBeVisible();
    
    // Check that roles are listed
    await expect(page.getByText("ADMIN")).toBeVisible();
    await expect(page.getByText("USER")).toBeVisible();
  });
}); 