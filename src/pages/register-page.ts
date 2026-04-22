import { expect, type Locator, type Page } from "@playwright/test";

type RegisterUserData = {
  username: string;
  email: string;
  password: string;
};

export class RegisterPage {
  readonly page: Page;
  readonly signUpLink: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpLink = page.getByRole("link", { name: "Sign up" });
    this.usernameInput = page.getByPlaceholder("Username");
    this.emailInput = page.getByPlaceholder("Email");
    this.passwordInput = page.getByPlaceholder("Password");
    this.signUpButton = page.getByRole("button", { name: "Sign up" });
  }

  async open() {
    await this.page.goto("/");
    await this.signUpLink.click();
    await expect(this.page).toHaveURL(/.*\/register/);
  }

  async fillRegisterForm(userData: RegisterUserData) {
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
  }

  async submit() {
    await this.signUpButton.click();
  }

  async expectUserRegistered(username: string) {
    await expect(this.page).toHaveURL(/.*\/$/);
    await expect(this.page.getByRole("link", { name: username })).toBeVisible();
  }

  async expectRequiredFieldsMissingState() {
    await expect(this.page).toHaveURL(/.*\/register/);
    await expect(this.usernameInput).toBeEmpty();
    await expect(this.emailInput).toBeEmpty();
    await expect(this.passwordInput).toBeEmpty();
    await expect(this.signUpButton).toBeDisabled();
  }
}
