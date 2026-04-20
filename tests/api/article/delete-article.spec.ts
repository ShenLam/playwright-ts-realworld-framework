import { test, expect } from "@playwright/test";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";
import { createArticle } from "../../../src/utils/article-helper";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import { ArticleResponse } from "../../../src/models/article";

test.describe("Delete Article", () => {
  test("API_ARTICLE_DELETE_01: Verify authenticated user can delete article successfully", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const { token } = await test.step("Login to get authentication token", async () => {
      return loginUser(request, userData);
    });

    const { slug } = await test.step("Create a new article", async () => {
      return createArticle(request, token);
    });

    const deleteResponse = await test.step("Send DELETE article request", async () => {
      return request.delete(API_ENDPOINTS.DELETE_ARTICLE.replace(":slug", slug), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    });

    await test.step("Delete article status code should be 204", async () => {
      expect(deleteResponse.status()).toBe(204);
    });

    const getResponse = await test.step("Send GET article request after deletion", async () => {
      return request.get(API_ENDPOINTS.GET_ARTICLE.replace(":slug", slug), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    });

    await test.step("Verify deleted article is no longer accessible", async () => {
      expect(getResponse.status()).toBe(404);
    });
  });
});
