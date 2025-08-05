import { defineConfig, devices } from "@playwright/test";
import { randomBytes } from "crypto";

import config from "./src/config";

const authFile = "e2e/.auth/user.json";

// Determine if we're in CI or local environment
const isCI = config.ci.isCI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined, // 1 worker per shard in CI for stability
  quiet: isCI, // Reduce output verbosity in CI
  failOnFlakyTests: false, // Don't fail on flaky tests, but track them
  globalTimeout: isCI ? 60 * 60 * 1000 : undefined, // 1 hour timeout for CI

  // Optimized reporting: minimal in CI, detailed locally
  reporter: isCI
    ? [
        ["dot"], // Concise output for CI
        ["github"], // GitHub annotations
        ["junit", { outputFile: "test-results/junit.xml" }], // JUnit for test result tracking
        ...(process.env.PLAYWRIGHT_SHARD ? [["blob"] as const] : []),
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
      AUTH_SECRET: config.auth.secret ?? randomBytes(32).toString("hex"),
      DATABASE_URL:
        config.database.url ??
        "postgresql://postgres:password@localhost:5432/albeorla-ts-starter",
    },
  },
});
