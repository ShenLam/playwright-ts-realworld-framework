import { test } from "@playwright/test";
import { RegisterPage } from "../../../src/pages/register-page";
import { createUserData } from "../../../src/utils/auth-helper";

test.describe("Register", () => {
  test("E2E_AUTH_01: Verify user can register successfully", async ({ page }) => {
    const userData = createUserData();
    const registerPage = new RegisterPage(page);

    await test.step("Open register page", async () => {
      await registerPage.open();
    });

    await test.step("Fill register form with valid user data", async () => {
      await registerPage.fillRegisterForm(userData);
    });

    await test.step("Submit register form", async () => {
      await registerPage.submit();
    });

    await test.step("Verify user is registered and logged in", async () => {
      await registerPage.expectUserRegistered(userData.username);
    });
  });

  test("E2E_AUTH_02: Verify register prevents submission when required fields are missing", async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await test.step("Open register page", async () => {
      await registerPage.open();
    });

    await test.step("Verify required empty fields cannot be submitted", async () => {
      await registerPage.expectRequiredFieldsMissingState();
    });
  });
});
