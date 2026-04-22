import { expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly popularTagsSection: Locator;
  readonly tagLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popularTagsSection = page.locator(".sidebar");
    this.tagLinks = this.popularTagsSection.locator(".tag-pill");
  }

  async open() {
    await this.page.goto("/");
    await expect(this.page).toHaveURL(/.*\/$/);
  }

  async expectTagsDisplayed() {
    await expect(this.popularTagsSection).toContainText("Popular Tags");
    await expect(this.tagLinks.first()).toBeVisible();
    await expect(this.tagLinks).not.toHaveCount(0);
  }
}
