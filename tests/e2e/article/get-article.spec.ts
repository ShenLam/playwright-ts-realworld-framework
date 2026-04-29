import { test } from "../../fixtures/api-fixtures";
import { ArticlePage } from "../../../src/pages/article-page";
import { LoginPage } from "../../../src/pages/login-page";

test.describe("Get Article", () => {
  test("E2E_ARTICLE_04: Verify user can view article details successfully", async ({ page, createdArticle }) => {
    const articlePage = new ArticlePage(page);
    const loginPage = new LoginPage(page);

    await test.step("Log in with valid credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(createdArticle.owner.userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(createdArticle.owner.userData.username);
    });

    await test.step("Open article details page", async () => {
      await articlePage.openArticle(createdArticle.slug);
    });

    await test.step("Verify article details are displayed", async () => {
      await articlePage.expectArticleCreated(createdArticle.article, createdArticle.owner.userData.username);
    });
  });
});
