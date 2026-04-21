import { test, expect } from "@playwright/test";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";
import { createArticle } from "../../../src/utils/article-helper";
import { apiRoutes } from "../../../src/api/routes";
import type { ArticleResponse } from "../../../src/models/article";

test.describe("Get Article", () => {
  test("API_ARTICLE_GET_01: Verify user can get article details successfully", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const { token } = await test.step("Login to get authentication token", async () => {
      return loginUser(request, userData);
    });

    const { article, slug } = await test.step("Create a new article", async () => {
      return createArticle(request, token);
    });

    const response = await test.step("Send GET article details request", async () => {
      return request.get(apiRoutes.article(slug), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: ArticleResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify article details", async () => {
      expect(body.article).toMatchObject({
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
      });

      expect(body.article.tagList).toEqual(expect.arrayContaining(article.tagList));
      expect(body.article.author.username).toBe(userData.username);
    });
  });
});
