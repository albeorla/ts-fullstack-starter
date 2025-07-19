import { defineConfig, devices } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

// Determine if we're in CI or local environment
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  
  // Use different reporters for CI vs local
  reporter: isCI 
    ? [['list'], ['html', { open: 'never' }]]  // CI: list output + HTML report (no server)
    : [['list'], ['html', { open: 'on-failure' }]], // Local: list output + HTML on failure only

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
    },
  },
});
