import { test } from "@playwright/test";
import { ArticlePage } from "../../../src/pages/article-page";
import { LoginPage } from "../../../src/pages/login-page";
import { withApiRequest } from "../../../src/utils/api-request-helper";
import { createArticleData } from "../../../src/utils/article-helper";
import { registerUser } from "../../../src/utils/auth-helper";

test.describe("Create Article", () => {
  test("E2E_ARTICLE_01: Verify authenticated user can create article successfully", async ({ page }) => {
    const { userData } = await test.step("Register a new user by API", async () => {
      return withApiRequest((apiRequest) => registerUser(apiRequest));
    });

    const loginPage = new LoginPage(page);
    const articlePage = new ArticlePage(page);
    const articleData = createArticleData();

    await test.step("Log in with valid credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(userData.username);
    });

    await test.step("Open new article editor", async () => {
      await articlePage.openEditor();
    });

    await test.step("Fill article form with valid data", async () => {
      await articlePage.fillArticleForm(articleData);
    });

    await test.step("Publish article", async () => {
      await articlePage.publish();
    });

    await test.step("Verify article is created successfully", async () => {
      await articlePage.expectArticleCreated(articleData, userData.username);
    });
  });
});
