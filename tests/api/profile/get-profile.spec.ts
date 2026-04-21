import { test, expect } from "@playwright/test";
import { registerUser, loginUser } from "../../../src/utils/auth-helper";
import { apiRoutes } from "../../../src/api/routes";
import type { ProfileResponse } from "../../../src/models/profile";
import { TEST_USERS } from "../../../src/constants/test-data";

const targetUsername = TEST_USERS.PROFILE_TARGET;

test.describe("Get Profile", () => {
  test("API_PROFILE_01: Verify authenticated user can get another user's profile successfully", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const { token } = await test.step("Login to get authentication token", async () => {
      return loginUser(request, userData);
    });

    const response = await test.step("Send GET profile request for another user", async () => {
      return request.get(apiRoutes.profile(targetUsername), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: ProfileResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify profile details", async () => {
      expect(body.profile).toMatchObject({
        username: targetUsername,
      });

      expect(body.profile.bio).toEqual(expect.anything());
      expect(body.profile.image).toEqual(expect.anything());
      expect(typeof body.profile.following).toBe("boolean");
    });
  });
});
