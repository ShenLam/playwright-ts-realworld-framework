import { expect, type Locator, type Page } from "@playwright/test";

type LoginUserData = {
  email: string;
  password: string;
};

export class LoginPage {
  readonly page: Page;
  readonly signInLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessages: Locator;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInLink = page.getByRole("link", { name: "Sign in" });
    this.emailInput = page.getByPlaceholder("Email");
    this.passwordInput = page.getByPlaceholder("Password");
    this.signInButton = page.getByRole("button", { name: "Sign in" });
    this.errorMessages = page.locator(".error-messages");
    this.header = page.locator("app-layout-header");
  }

  async open() {
    await this.page.goto("/");
    await this.signInLink.click();
    await expect(this.page).toHaveURL(/.*\/login/);
  }

  async fillLoginForm(userData: LoginUserData) {
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
  }

  async submit() {
    await this.signInButton.click();
  }

  async expectUserLoggedIn(username: string) {
    await expect(this.page).toHaveURL(/.*\/$/);
    await expect(this.header.getByRole("link", { name: username })).toBeVisible();
  }

  async expectInvalidCredentialsError() {
    await expect(this.page).toHaveURL(/.*\/login/);
    await expect(this.errorMessages).toContainText("credentials invalid");
  }
}
