import { test } from "../../fixtures/api-fixtures";
import { ArticlePage } from "../../../src/pages/article-page";
import { LoginPage } from "../../../src/pages/login-page";

test.describe("Delete Article", () => {
  test("E2E_ARTICLE_03: Verify authenticated user can delete article successfully", async ({
    page,
    createdArticle,
  }) => {
    const loginPage = new LoginPage(page);
    const articlePage = new ArticlePage(page);

    await test.step("Log in with valid credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(createdArticle.owner.userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(createdArticle.owner.userData.username);
    });

    await test.step("Open created article", async () => {
      await articlePage.openArticle(createdArticle.slug);
    });

    await test.step("Delete article", async () => {
      await articlePage.deleteArticle();
    });

    await test.step("Verify article is deleted successfully", async () => {
      await articlePage.expectArticleDeleted(createdArticle.slug, createdArticle.article.title);
    });
  });
});
