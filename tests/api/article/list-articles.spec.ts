import { test, expect } from "@playwright/test";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";
import { createArticle } from "../../../src/utils/article-helper";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import type { ArticlesResponse } from "../../../src/models/article";

test.describe("List Articles", () => {
  test("API_ARTICLE_LIST_01: Verify user can get article list successfully", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const { token } = await test.step("Login to get authentication token", async () => {
      return loginUser(request, userData);
    });

    const { article, slug } = await test.step("Create a new article", async () => {
      return createArticle(request, token);
    });

    const response = await test.step("Send GET articles list request", async () => {
      return request.get(API_ENDPOINTS.LIST_ARTICLES, {
        headers: {
          Authorization: `Token ${token}`,
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

      const foundArticle = body.articles.find((item) => item.slug === slug);

      expect(foundArticle).toBeDefined();
      expect(foundArticle).toMatchObject({
        slug: article.slug,
        title: article.title,
        description: article.description,
      });
    });
  });
});
