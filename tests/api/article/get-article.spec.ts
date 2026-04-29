import { test, expect } from "../../fixtures/api-fixtures";
import { apiRoutes } from "../../../src/api/routes";
import type { ArticleResponse } from "../../../src/models/article";

test.describe("Get Article", () => {
  test("API_ARTICLE_GET_01: Verify user can get article details successfully", async ({ request, createdArticle }) => {
    const response = await test.step("Send GET article details request", async () => {
      return request.get(apiRoutes.article(createdArticle.slug), {
        headers: {
          Authorization: `Token ${createdArticle.owner.token}`,
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
        slug: createdArticle.article.slug,
        title: createdArticle.article.title,
        description: createdArticle.article.description,
        body: createdArticle.article.body,
      });

      expect(body.article.tagList).toEqual(expect.arrayContaining(createdArticle.article.tagList));
      expect(body.article.author.username).toBe(createdArticle.owner.userData.username);
    });
  });
});
