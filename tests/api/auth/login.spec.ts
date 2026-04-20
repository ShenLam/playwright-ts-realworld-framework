import { test, expect } from "@playwright/test";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import { registerUser } from "../../../src/utils/auth-helper";
import { UserResponse } from "../../../src/models/user";

test.describe("Login", () => {
  test("API_AUTH_LOGIN_01: Verify user can log in successfully with valid credentials", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const response = await test.step("Send POST request with valid login credentials", async () => {
      return request.post(API_ENDPOINTS.LOGIN, {
        data: {
          user: {
            email: userData.email,
            password: userData.password,
          },
        },
      });
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: UserResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify response user data matches login account", async () => {
      expect(body.user).toMatchObject({
        username: userData.username,
        email: userData.email,
        bio: null,
        image: null,
      });
    });

    await test.step("Verify a valid token is returned", async () => {
      expect(body.user.token).toEqual(expect.any(String));
      expect(body.user.token.length).toBeGreaterThan(10);
    });
  });

  test("API_AUTH_LOGIN_02: Verify login fails with incorrect password", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const response = await test.step("Send POST request with incorrect password", async () => {
      return request.post(API_ENDPOINTS.LOGIN, {
        data: {
          user: {
            email: userData.email,
            password: "WrongPassword123!",
          },
        },
      });
    });

    await test.step("Status code should be 401", async () => {
      expect(response.status()).toBe(401);
    });

    const body = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify login error details", async () => {
      expect(body.errors).toHaveProperty("credentials");
      expect(body.errors.credentials[0]).toContain("invalid");
    });
  });
});
