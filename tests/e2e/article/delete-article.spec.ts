import { test } from "@playwright/test";
import { ArticlePage } from "../../../src/pages/article-page";
import { LoginPage } from "../../../src/pages/login-page";
import { withApiRequest } from "../../../src/utils/api-request-helper";
import { createArticle } from "../../../src/utils/article-helper";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";

test.describe("Delete Article", () => {
  test("E2E_ARTICLE_03: Verify authenticated user can delete article successfully", async ({ page }) => {
    const { article, userData, slug } = await test.step("Create a new article by API", async () => {
      return withApiRequest(async (apiRequest) => {
        const { userData } = await registerUser(apiRequest);
        const { token } = await loginUser(apiRequest, userData);
        const { article, slug } = await createArticle(apiRequest, token);

        return {
          article,
          userData,
          slug,
        };
      });
    });

    const loginPage = new LoginPage(page);
    const articlePage = new ArticlePage(page);

    await test.step("Log in with valid credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(userData.username);
    });

    await test.step("Open created article", async () => {
      await articlePage.openArticle(slug);
    });

    await test.step("Delete article", async () => {
      await articlePage.deleteArticle();
    });

    await test.step("Verify article is deleted successfully", async () => {
      await articlePage.expectArticleDeleted(slug, article.title);
    });
  });
});
