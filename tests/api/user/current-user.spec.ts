import { test, expect } from "../../fixtures/api-fixtures";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import type { ErrorResponse } from "../../../src/models/error";
import type { UserResponse } from "../../../src/models/user";

test.describe("Current User", () => {
  test("API_USER_CURRENT_01: Verify authenticated user can get current user information successfully", async ({
    request,
    authenticatedUser,
  }) => {
    const response = await test.step("Send GET current user request with valid token", async () => {
      return request.get(API_ENDPOINTS.CURRENT_USER, {
        headers: {
          Authorization: `Token ${authenticatedUser.token}`,
        },
      });
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: UserResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify current user information matches registered account", async () => {
      expect(body.user).toMatchObject({
        username: authenticatedUser.userData.username,
        email: authenticatedUser.userData.email,
        token: authenticatedUser.token,
        bio: null,
        image: null,
      });
    });
  });

  test("API_USER_CURRENT_02: Verify get current user fails without authentication token", async ({ request }) => {
    const response = await test.step("Send GET current user request without authentication token", async () => {
      return request.get(API_ENDPOINTS.CURRENT_USER);
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
