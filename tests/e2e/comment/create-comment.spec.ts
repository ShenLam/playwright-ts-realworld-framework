import { test } from "@playwright/test";
import { ArticlePage } from "../../../src/pages/article-page";
import { LoginPage } from "../../../src/pages/login-page";
import { withApiRequest } from "../../../src/utils/api-request-helper";
import { createArticle } from "../../../src/utils/article-helper";
import { createCommentData } from "../../../src/utils/comment-helper";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";

test.describe("Create Comment", () => {
  test("E2E_COMMENT_01: Verify authenticated user can add comment successfully", async ({ page }) => {
    const { slug, userData } = await test.step("Create a new article by API", async () => {
      return withApiRequest(async (apiRequest) => {
        const { userData } = await registerUser(apiRequest);
        const { token } = await loginUser(apiRequest, userData);
        const { slug } = await createArticle(apiRequest, token);

        return {
          slug,
          userData,
        };
      });
    });

    const loginPage = new LoginPage(page);
    const articlePage = new ArticlePage(page);
    const commentData = createCommentData();

    await test.step("Log in with valid credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(userData.username);
    });

    await test.step("Open article details page", async () => {
      await articlePage.openArticle(slug);
    });

    await test.step("Add a new comment", async () => {
      await articlePage.addComment(commentData.body);
    });

    await test.step("Verify comment is added successfully", async () => {
      await articlePage.expectCommentCreated(commentData.body, userData.username);
    });
  });
});
