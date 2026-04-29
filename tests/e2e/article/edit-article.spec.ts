import { test } from "../../fixtures/api-fixtures";
import { ArticlePage } from "../../../src/pages/article-page";
import { LoginPage } from "../../../src/pages/login-page";
import { updateArticleData } from "../../../src/utils/article-helper";

test.describe("Edit Article", () => {
  test("E2E_ARTICLE_02: Verify authenticated user can edit article successfully", async ({ page, createdArticle }) => {
    const loginPage = new LoginPage(page);
    const articlePage = new ArticlePage(page);
    const updatedArticleData = updateArticleData();

    await test.step("Log in with valid credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(createdArticle.owner.userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(createdArticle.owner.userData.username);
    });

    await test.step("Open created article", async () => {
      await articlePage.openArticle(createdArticle.slug);
    });

    await test.step("Open edit article page", async () => {
      await articlePage.openEditArticle();
    });

    await test.step("Update article form with valid data", async () => {
      await articlePage.updateArticleForm(updatedArticleData);
    });

    await test.step("Publish updated article", async () => {
      await articlePage.publish();
    });

    await test.step("Verify article is updated successfully", async () => {
      await articlePage.expectArticleUpdated(updatedArticleData, createdArticle.owner.userData.username);
    });
  });
});
