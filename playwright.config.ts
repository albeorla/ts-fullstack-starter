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
  workers: isCI ? 4 : undefined, // Use 4 parallel workers in CI for speed
  quiet: !!process.env.CI, // Reduce output verbosity in CI
  failOnFlakyTests: !!process.env.CI, // Fail CI on flaky tests
  globalTimeout: isCI ? 60 * 60 * 1000 : undefined, // 1 hour timeout for CI

  // Optimized reporting: minimal in CI, detailed locally
  reporter: isCI
    ? [
        ["dot"], // Concise output for CI
        ["github"], // GitHub annotations
        ...(process.env.PLAYWRIGHT_SHARD ? [["blob"]] : []), // Add blob reporter for sharding
      ]
    : [
        ["list"],
        ["html", { open: "on-failure", outputFolder: "playwright-report" }],
        ["json", { outputFile: "test-results/results.json" }],
      ], // Local: detailed reporting with JSON

  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Enhanced debugging options
    actionTimeout: 10000,
    navigationTimeout: 30000,
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
      AUTH_SECRET: process.env.AUTH_SECRET ?? randomBytes(32).toString("hex"),
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://postgres:password@localhost:5432/albeorla-ts-starter",
    },
  },
});
