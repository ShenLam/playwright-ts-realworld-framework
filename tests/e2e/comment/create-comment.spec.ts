import { test } from "../../fixtures/api-fixtures";
import { ArticlePage } from "../../../src/pages/article-page";
import { LoginPage } from "../../../src/pages/login-page";
import { createCommentData } from "../../../src/utils/comment-helper";

test.describe("Create Comment", () => {
  test("E2E_COMMENT_01: Verify authenticated user can add comment successfully", async ({ page, createdArticle }) => {
    const loginPage = new LoginPage(page);
    const articlePage = new ArticlePage(page);
    const commentData = createCommentData();

    await test.step("Log in with valid credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(createdArticle.owner.userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(createdArticle.owner.userData.username);
    });

    await test.step("Open article details page", async () => {
      await articlePage.openArticle(createdArticle.slug);
    });

    await test.step("Add a new comment", async () => {
      await articlePage.addComment(commentData.body);
    });

    await test.step("Verify comment is added successfully", async () => {
      await articlePage.expectCommentCreated(commentData.body, createdArticle.owner.userData.username);
    });
  });
});
