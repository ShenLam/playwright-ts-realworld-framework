import { test, expect } from "@playwright/test";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";
import { createArticle } from "../../../src/utils/article-helper";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import type { CommentsResponse } from "../../../src/models/comment";
import { createComment } from "../../../src/utils/comment-helper";

test.describe("List Comments", () => {
  test("API_COMMENT_LIST_01: Verify user can get article comments successfully", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const { token } = await test.step("Login to get authentication token", async () => {
      return loginUser(request, userData);
    });

    const { slug } = await test.step("Create a new article", async () => {
      return createArticle(request, token);
    });

    const { comment, commentData } = await test.step("Add a new comment", async () => {
      return createComment(request, token, slug);
    });

    const response = await test.step("Send GET article comments request", async () => {
      return request.get(API_ENDPOINTS.GET_COMMENTS.replace(":slug", slug), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    });

    await test.step("Status code should be 200", async () => {
      expect(response.status()).toBe(200);
    });

    const body: CommentsResponse = await test.step("Parse response body", async () => {
      return response.json();
    });

    await test.step("Verify article comments list contains created comment", async () => {
      expect(Array.isArray(body.comments)).toBe(true);
      expect(body.comments.length).toBeGreaterThan(0);

      const foundComment = body.comments.find((item) => item.id === comment.id);

      expect(foundComment).toBeDefined();
      expect(foundComment?.body).toBe(commentData.body);
      expect(foundComment?.author.username).toBe(userData.username);
    });
  });
});
