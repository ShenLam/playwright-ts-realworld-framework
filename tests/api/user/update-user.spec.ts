import { test, expect } from "../../fixtures/api-fixtures";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import type { ErrorResponse } from "../../../src/models/error";
import type { UserResponse } from "../../../src/models/user";

test.describe("Update User", () => {
  test("API_USER_UPDATE_01: Verify authenticated user can update profile successfully", async ({
    request,
    authenticatedUser,
  }) => {
    const updatedData = {
      username: `${authenticatedUser.userData.username}_updated`,
      bio: "QA automation engineer",
      image: "https://example.com/avatar.png",
    };

    const response = await test.step("Send PUT request to update user profile", async () => {
      return request.put(API_ENDPOINTS.CURRENT_USER, {
        headers: {
          Authorization: `Token ${authenticatedUser.token}`,
        },
        data: {
          user: updatedData,
        },
      });
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: UserResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify updated user information", async () => {
      expect(body.user).toMatchObject({
        username: updatedData.username,
        bio: updatedData.bio,
        image: updatedData.image,
        email: authenticatedUser.userData.email,
        token: authenticatedUser.token,
      });
    });
  });

  test("API_USER_UPDATE_02: Verify update user fails without authentication token", async ({ request }) => {
    const updatedData = {
      username: "should_not_update",
      bio: "No auth",
      image: "https://example.com/avatar.png",
    };

    const response = await test.step("Send PUT request without authentication token", async () => {
      return request.put(API_ENDPOINTS.CURRENT_USER, {
        data: {
          user: updatedData,
        },
      });
    });

    await test.step("Status code should be 401", async () => {
      expect(response.status()).toBe(401);
    });

    const body: ErrorResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify unauthorized error details", async () => {
      expect(body.errors).toHaveProperty("token");
      expect(body.errors.token[0]).toContain("is missing");
    });
  });
});
