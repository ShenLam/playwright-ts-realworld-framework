import { test } from "@playwright/test";
import { HomePage } from "../../../src/pages/home-page";

test.describe("Get Tags", () => {
  test("E2E_TAG_01: Verify user can view tags successfully", async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step("Open home page", async () => {
      await homePage.open();
    });

    await test.step("Verify popular tags are displayed", async () => {
      await homePage.expectTagsDisplayed();
    });
  });
});
