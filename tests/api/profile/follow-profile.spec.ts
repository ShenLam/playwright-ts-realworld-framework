import { test, expect } from "../../fixtures/api-fixtures";
import { apiRoutes } from "../../../src/api/routes";
import type { ProfileResponse } from "../../../src/models/profile";
import { followUser } from "../../../src/utils/profile-helper";
import { TEST_USERS } from "../../../src/constants/test-data";

const targetUsername = TEST_USERS.PROFILE_TARGET;

test.describe("Follow Profile", () => {
  test("API_PROFILE_02: Verify authenticated user can follow another user successfully", async ({
    request,
    authenticatedUser,
  }) => {
    const response = await test.step("Send POST follow request", async () => {
      return request.post(apiRoutes.followProfile(targetUsername), {
        headers: {
          Authorization: `Token ${authenticatedUser.token}`,
        },
      });
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: ProfileResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify follow result", async () => {
      expect(body.profile).toMatchObject({
        username: targetUsername,
        following: true,
      });
    });
  });

  test("API_PROFILE_03: Verify authenticated user can unfollow another user successfully", async ({
    request,
    authenticatedUser,
  }) => {
    await test.step("Follow target user", async () => {
      return followUser(request, authenticatedUser.token, targetUsername);
    });

    const response = await test.step("Send DELETE unfollow request", async () => {
      return request.delete(apiRoutes.unfollowProfile(targetUsername), {
        headers: {
          Authorization: `Token ${authenticatedUser.token}`,
        },
      });
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: ProfileResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify unfollow result", async () => {
      expect(body.profile).toMatchObject({
        username: targetUsername,
        following: false,
      });
    });
  });
});
