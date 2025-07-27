import { defineConfig, devices } from "@playwright/test";
import { randomBytes } from "crypto";

const authFile = "e2e/.auth/user.json";

// Determine if we're in CI or local environment
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined, // Increased for better CI performance

  // Use different reporters for CI vs local
  reporter: isCI
    ? [
        ["list"],
        ["html", { open: "never" }],
        ["github"],
        ["junit", { outputFile: "test-results/results.xml" }],
      ] // CI: list output + HTML report + GitHub + JUnit
    : [["list"], ["html", { open: "on-failure" }]], // Local: list output + HTML on failure only

  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // Setup project
    { name: "setup", testMatch: /.*\.setup\.ts/ },

    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Use prepared auth state.
        storageState: authFile,
      },
      dependencies: ["setup"],
    },
  ],

  webServer: {
    command: "yarn dev:test",
    url: "http://localhost:3001",
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
    env: {
      ...process.env,
      PORT: "3001",
      NODE_ENV: "test",
      ENABLE_TEST_AUTH: "true",
      AUTH_SECRET: process.env.AUTH_SECRET || randomBytes(32).toString("hex"),
    },
  },
});
