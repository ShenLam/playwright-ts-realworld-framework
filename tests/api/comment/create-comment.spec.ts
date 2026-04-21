import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";
import { createArticle } from "../../../src/utils/article-helper";
import { apiRoutes } from "../../../src/api/routes";
import type { CommentResponse } from "../../../src/models/comment";

const createCommentData = () => ({
  body: faker.lorem.sentence(8),
});

test.describe("Create Comment", () => {
  test("API_COMMENT_CREATE_01: Verify authenticated user can add comment successfully", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const { token } = await test.step("Login to get authentication token", async () => {
      return loginUser(request, userData);
    });

    const { slug } = await test.step("Create a new article", async () => {
      return createArticle(request, token);
    });

    const commentData = createCommentData();

    const response = await test.step("Send POST request to add comment", async () => {
      return request.post(apiRoutes.addComment(slug), {
        headers: {
          Authorization: `Token ${token}`,
        },
        data: {
          comment: commentData,
        },
      });
    });

    await test.step("Status code should be 201", async () => {
      expect(response.status()).toBe(201);
    });

    const body: CommentResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify created comment information", async () => {
      expect(body.comment.id).toEqual(expect.any(Number));
      expect(body.comment.body).toBe(commentData.body);
      expect(body.comment.author.username).toBe(userData.username);
    });
  });
});
