import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 4,
  reporter: [["html"], ["list"]],
  use: {
    trace: "on-first-retry",
    screenshot: 'on'
  },
  projects: [
    {
      name: "api-tests",
      testDir: "./tests/api",
      use: {
        baseURL: "https://api.realworld.show",
        extraHTTPHeaders: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    },
    {
      name: "e2e-tests",
      testDir: "./tests/e2e",
      use: {
        baseURL: "https://demo.realworld.show",
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
  ],
});
