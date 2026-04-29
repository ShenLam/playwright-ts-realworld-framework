import { test, expect } from "../../fixtures/api-fixtures";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import type { ArticlesResponse } from "../../../src/models/article";

test.describe("List Articles", () => {
  test("API_ARTICLE_LIST_01: Verify user can get article list successfully", async ({ request, createdArticle }) => {
    const response = await test.step("Send GET articles list request", async () => {
      return request.get(API_ENDPOINTS.LIST_ARTICLES, {
        headers: {
          Authorization: `Token ${createdArticle.owner.token}`,
        },
      });
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: ArticlesResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify articles list contains created article", async () => {
      expect(Array.isArray(body.articles)).toBe(true);
      expect(body.articlesCount).toBeGreaterThan(0);

      const foundArticle = body.articles.find((item) => item.slug === createdArticle.slug);

      expect(foundArticle).toBeDefined();
      expect(foundArticle).toMatchObject({
        slug: createdArticle.article.slug,
        title: createdArticle.article.title,
        description: createdArticle.article.description,
      });
    });
  });
});
