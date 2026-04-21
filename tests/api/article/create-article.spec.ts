import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";
import type { ArticleResponse } from "../../../src/models/article";

const createArticleData = () => ({
  title: faker.lorem.sentence(3),
  description: faker.lorem.sentence(6),
  body: faker.lorem.paragraph(),
  tagList: [faker.word.noun(), faker.word.noun()],
});

test.describe("Create Article", () => {
  test("API_ARTICLE_CREATE_01: Verify authenticated user can create article successfully", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const { token } = await test.step("Login to get authentication token", async () => {
      return loginUser(request, userData);
    });

    const articleData = createArticleData();

    const response = await test.step("Send POST request to create a new article", async () => {
      return request.post(API_ENDPOINTS.CREATE_ARTICLE, {
        headers: {
          Authorization: `Token ${token}`,
        },
        data: {
          article: articleData,
        },
      });
    });

    await test.step("Status code should be 201", async () => {
      expect(response.status()).toBe(201);
    });

    const body: ArticleResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify created article information", async () => {
      expect(body.article).toMatchObject({
        title: articleData.title,
        description: articleData.description,
        body: articleData.body,
      });

      expect(body.article.tagList).toEqual(expect.arrayContaining(articleData.tagList));
      expect(body.article.slug).toEqual(expect.any(String));
      expect(body.article.slug.length).toBeGreaterThan(0);
      expect(body.article.author.username).toBe(userData.username);
    });
  });

  test("API_ARTICLE_CREATE_02: Verify create article fails without authentication token", async ({ request }) => {
    const articleData = createArticleData();

    const response = await test.step("Send POST request without authentication token", async () => {
      return request.post(API_ENDPOINTS.CREATE_ARTICLE, {
        data: {
          article: articleData,
        },
      });
    });

    await test.step("Status code should be 401", async () => {
      expect(response.status()).toBe(401);
    });

    const body = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify unauthorized error response", async () => {
      expect(body.errors).toHaveProperty("token");
      expect(body.errors.token[0]).toContain("is missing");
    });
  });
});
