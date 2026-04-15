import { test, expect } from "@playwright/test";
import { API_ENDPOINTS } from "../../src/api/endpoints";
import { registerUser, loginUser } from "../../src/utils/auth-helper";
import type { UserResponse } from "../../src/models/user";

test.describe("Current User", () => {
  test("API_USER_SC_01: Verify authenticated user can get current user information", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const { token } = await test.step("Login to get authentication token", async () => {
      return loginUser(request, userData);
    });

    const response = await test.step("Send GET current user request with valid token", async () => {
      return request.get(API_ENDPOINTS.CURRENT_USER, {
        headers: {
          Authorization: `Token ${token}`,
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
        username: userData.username,
        email: userData.email,
        token: token,
        bio: null,
        image: null,
      });
    });
  });

  test("API_USER_SC_02: Verify get current user fails without authentication token", async ({ request }) => {
    const response = await test.step("Send GET current user request without authentication token", async () => {
      return request.get(API_ENDPOINTS.CURRENT_USER);
    });

    await test.step("Status code should be 401", async () => {
      expect(response.status()).toBe(401);
    });

    const body = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify unauthorized error details", async () => {
      expect(body.errors).toHaveProperty("token");
      expect(body.errors.token[0]).toContain("is missing");
    });
  });
});
