import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import type { UserResponse } from "../../../src/models/user";

const createUserData = () => ({
  username: `${faker.person.firstName().toLowerCase()}${faker.number.int(1000)}`,
  email: faker.internet.email().toLowerCase(),
  password: "Password123!",
});

test.describe("Register", () => {
  test("API_AUTH_REGISTER_01: Verify user can register successfully with valid data", async ({ request }) => {
    const userData = createUserData();

    const response = await test.step("Send POST request to register a new user", async () => {
      return request.post(API_ENDPOINTS.REGISTER, {
        data: { user: userData },
      });
    });

    await test.step("Status code should be 201", async () => {
      expect(response.status()).toBe(201);
    });

    const body: UserResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify response user data matches request data", async () => {
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

  test("API_AUTH_REGISTER_02: Verify register fails when required fields are missing", async ({ request }) => {
    const userData = createUserData();

    const response = await test.step("Send POST request with missing required fields", async () => {
      return request.post(API_ENDPOINTS.REGISTER, {
        data: {
          user: {
            username: userData.username,
          },
        },
      });
    });

    await test.step("Status code should be 422", async () => {
      expect(response.status()).toBe(422);
    });

    const body = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify validation error details", async () => {
      expect(body.errors).toHaveProperty("email");
      expect(body.errors).toHaveProperty("password");

      expect(body.errors.email[0]).toContain("can't be blank");
      expect(body.errors.password[0]).toContain("can't be blank");
    });
  });
});
