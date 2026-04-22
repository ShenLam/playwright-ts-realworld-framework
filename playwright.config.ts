import { defineConfig, devices } from "@playwright/test";
import { API_BASE_URL, API_HTTP_HEADERS } from "./src/api/api-config";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html"], ["list"]],
  use: {
    trace: "on-first-retry",
    screenshot: "on",
  },
  projects: [
    {
      name: "api-tests",
      testDir: "./tests/api",
      workers: 1,
      timeout: 60 * 1000,
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: API_HTTP_HEADERS,
      },
    },
    {
      name: "e2e-tests",
      testDir: "./tests/e2e",
      workers: 1,
      timeout: 60 * 1000,
      use: {
        baseURL: "https://demo.realworld.show",
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
  ],
});
