import { test } from "@playwright/test";
import { ArticlePage } from "../../../src/pages/article-page";
import { LoginPage } from "../../../src/pages/login-page";
import { withApiRequest } from "../../../src/utils/api-request-helper";
import { createArticle } from "../../../src/utils/article-helper";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";

test.describe("Get Article", () => {
  test("E2E_ARTICLE_04: Verify user can view article details successfully", async ({ page }) => {
    const { article, slug, userData } = await test.step("Create a new article by API", async () => {
      return withApiRequest(async (apiRequest) => {
        const { userData } = await registerUser(apiRequest);
        const { token } = await loginUser(apiRequest, userData);
        const { article, slug } = await createArticle(apiRequest, token);

        return {
          article,
          slug,
          userData,
        };
      });
    });

    const articlePage = new ArticlePage(page);
    const loginPage = new LoginPage(page);

    await test.step("Log in with valid credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(userData.username);
    });

    await test.step("Open article details page", async () => {
      await articlePage.openArticle(slug);
    });

    await test.step("Verify article details are displayed", async () => {
      await articlePage.expectArticleCreated(article, userData.username);
    });
  });
});
