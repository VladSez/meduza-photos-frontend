import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
  // Timeout per test
  timeout: 30 * 1000,
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  expect: {
    timeout: 15 * 1000,
  },
  // Test directory
  // eslint-disable-next-line unicorn/prefer-module
  testDir: path.join(__dirname, "./src/e2e"),
  // If a test fails, retry it additional 2 times
  retries: process.env.CI ? 2 : 0,
  // workers: process.env.CI ? 1 : "",

  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: "./src/e2e-test-results/",

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  // on CI we don't need to start the server, because we use vercel preview url to run the tests
  ...(!process.env.CI && {
    webServer: {
      command: "pnpm run dev",
      url: baseURL,
      timeout: 120 * 1000,
      reuseExistingServer: true,
      // reuseExistingServer: !process.env.CI,
    },
  }),

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",

  use: {
    // Use baseURL so to make navigations relative.
    // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    baseURL,

    // Retry a test if its failing with enabled tracing. This allows you to analyze the DOM, console logs, network traffic etc.
    // More information: https://playwright.dev/docs/trace-viewer
    trace: "retry-with-trace",

    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,

    // All available context options: https://playwright.dev/docs/api/class-browser#browser-new-context
    // contextOptions: {
    //   ignoreHTTPSErrors: true,
    // },
  },

  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
