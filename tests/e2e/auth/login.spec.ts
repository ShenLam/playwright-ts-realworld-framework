import { test } from "../../fixtures/api-fixtures";
import { LoginPage } from "../../../src/pages/login-page";

test.describe("Login", () => {
  test("E2E_AUTH_03: Verify user can log in successfully with valid credentials", async ({
    page,
    authenticatedUser,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step("Open login page", async () => {
      await loginPage.open();
    });

    await test.step("Fill login form with valid credentials", async () => {
      await loginPage.fillLoginForm(authenticatedUser.userData);
    });

    await test.step("Submit login form", async () => {
      await loginPage.submit();
    });

    await test.step("Verify user is logged in", async () => {
      await loginPage.expectUserLoggedIn(authenticatedUser.userData.username);
    });
  });

  test("E2E_AUTH_04: Verify login shows error message with invalid credentials", async ({
    page,
    authenticatedUser,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step("Open login page", async () => {
      await loginPage.open();
    });

    await test.step("Fill login form with invalid credentials", async () => {
      await loginPage.fillLoginForm({
        email: authenticatedUser.userData.email,
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
