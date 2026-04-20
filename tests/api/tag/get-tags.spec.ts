import { test, expect } from "@playwright/test";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import type { TagsResponse } from "../../../src/models/tag";

test.describe("Get Tags", () => {
  test("API_TAG_01: Verify user can get tags successfully", async ({ request }) => {
    const response = await test.step("Send GET tags request", async () => {
      return request.get(API_ENDPOINTS.GET_TAGS);
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: TagsResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify tags response", async () => {
      expect(Array.isArray(body.tags)).toBe(true);
      expect(body.tags.length).toBeGreaterThan(0);
      expect(body.tags[0]).toEqual(expect.any(String));
    });
  });
});
