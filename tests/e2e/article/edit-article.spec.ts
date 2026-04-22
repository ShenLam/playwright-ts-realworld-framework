import { test } from "@playwright/test";
import { ArticlePage } from "../../../src/pages/article-page";
import { LoginPage } from "../../../src/pages/login-page";
import { withApiRequest } from "../../../src/utils/api-request-helper";
import { createArticle, updateArticleData } from "../../../src/utils/article-helper";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";

test.describe("Edit Article", () => {
  test("E2E_ARTICLE_02: Verify authenticated user can edit article successfully", async ({ page }) => {
    const { userData, slug } = await test.step("Create a new article by API", async () => {
      return withApiRequest(async (apiRequest) => {
        const { userData } = await registerUser(apiRequest);
        const { token } = await loginUser(apiRequest, userData);
        const { slug } = await createArticle(apiRequest, token);

        return {
          userData,
          slug,
        };
      });
    });

    const loginPage = new LoginPage(page);
    const articlePage = new ArticlePage(page);
    const updatedArticleData = updateArticleData();

    await test.step("Log in with valid credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(userData.username);
    });

    await test.step("Open created article", async () => {
      await articlePage.openArticle(slug);
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
      await articlePage.expectArticleUpdated(updatedArticleData, userData.username);
    });
  });
});
