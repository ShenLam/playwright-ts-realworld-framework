import { test } from "@playwright/test";
import { LoginPage } from "../../../src/pages/login-page";
import { withApiRequest } from "../../../src/utils/api-request-helper";
import { registerUser } from "../../../src/utils/auth-helper";

test.describe("Login", () => {
  test("E2E_AUTH_03: Verify user can log in successfully with valid credentials", async ({ page }) => {
    const { userData } = await test.step("Register a new user by API", async () => {
      return withApiRequest((apiRequest) => registerUser(apiRequest));
    });

    const loginPage = new LoginPage(page);

    await test.step("Open login page", async () => {
      await loginPage.open();
    });

    await test.step("Fill login form with valid credentials", async () => {
      await loginPage.fillLoginForm(userData);
    });

    await test.step("Submit login form", async () => {
      await loginPage.submit();
    });

    await test.step("Verify user is logged in", async () => {
      await loginPage.expectUserLoggedIn(userData.username);
    });
  });

  test("E2E_AUTH_04: Verify login shows error message with invalid credentials", async ({ page }) => {
    const { userData } = await test.step("Register a new user by API", async () => {
      return withApiRequest((apiRequest) => registerUser(apiRequest));
    });

    const loginPage = new LoginPage(page);

    await test.step("Open login page", async () => {
      await loginPage.open();
    });

    await test.step("Fill login form with invalid credentials", async () => {
      await loginPage.fillLoginForm({
        email: userData.email,
        password: "WrongPassword123!",
      });
    });

    await test.step("Submit login form", async () => {
      await loginPage.submit();
    });

    await test.step("Verify invalid credentials error message", async () => {
      await loginPage.expectInvalidCredentialsError();
    });
  });
});
