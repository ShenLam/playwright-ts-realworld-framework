import { expect, type Locator, type Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  followButton(username: string): Locator {
    return this.page.getByRole("button", { name: new RegExp(`Follow\\s+${username}`) });
  }

  followingButton(username: string): Locator {
    return this.page.getByRole("button", { name: new RegExp(`(Following|Unfollow)\\s+${username}`) });
  }

  async open(username: string) {
    await this.page.goto(`/profile/${username}`);
    await expect(this.page).toHaveURL(new RegExp(`/profile/${username}$`));
    await expect(this.page.getByText(username).first()).toBeVisible();
  }

  async followUser(username: string) {
    await this.followButton(username).click();
  }

  async unfollowUser(username: string) {
    await this.followingButton(username).click();
  }

  async expectUserFollowed(username: string) {
    await expect(this.followingButton(username)).toBeVisible();
  }

  async expectUserUnfollowed(username: string) {
    await expect(this.followButton(username)).toBeVisible();
  }
}
