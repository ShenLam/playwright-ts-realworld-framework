import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";
import { createArticle } from "../../../src/utils/article-helper";
import { apiRoutes } from "../../../src/api/routes";
import type { ArticleResponse } from "../../../src/models/article";

const updateArticleData = () => ({
  title: faker.lorem.sentence(3),
  description: faker.lorem.sentence(6),
  body: faker.lorem.paragraph(),
});

test.describe("Update Article", () => {
  test("API_ARTICLE_UPDATE_01: Verify authenticated user can update article successfully", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const { token } = await test.step("Login to get authentication token", async () => {
      return loginUser(request, userData);
    });

    const { slug } = await test.step("Create a new article", async () => {
      return createArticle(request, token);
    });

    const updatedData = updateArticleData();

    const response = await test.step("Send PUT request to update article", async () => {
      return request.put(apiRoutes.updateArticle(slug), {
        headers: {
          Authorization: `Token ${token}`,
        },
        data: {
          article: updatedData,
        },
      });
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: ArticleResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify updated article details", async () => {
      expect(body.article).toMatchObject({
        slug: updatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .trim()
          .replace(/\s+/g, "-"),
        title: updatedData.title,
        description: updatedData.description,
        body: updatedData.body,
      });

      expect(body.article.author.username).toBe(userData.username);
    });
  });
});
