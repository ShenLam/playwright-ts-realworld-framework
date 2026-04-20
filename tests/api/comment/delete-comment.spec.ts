import { test, expect } from "@playwright/test";
import { registerUser, loginUser } from "../../../src/utils/auth-helper";
import { createArticle } from "../../../src/utils/article-helper";
import { createComment, getComments } from "../../../src/utils/comment-helper";
import { API_ENDPOINTS } from "../../../src/api/endpoints";
import type { CommentsResponse } from "../../../src/models/comment";

test.describe("Delete Comment", () => {
  test("API_COMMENT_DELETE_01: Verify authenticated user can delete comment successfully", async ({ request }) => {
    const { userData } = await test.step("Register a new user", async () => {
      return registerUser(request);
    });

    const { token } = await test.step("Login to get authentication token", async () => {
      return loginUser(request, userData);
    });

    const { slug } = await test.step("Create a new article", async () => {
      return createArticle(request, token);
    });

    const { comment } = await test.step("Create a new comment", async () => {
      return createComment(request, token, slug);
    });

    const deleteResponse = await test.step("Send DELETE comment request", async () => {
      return request.delete(API_ENDPOINTS.DELETE_COMMENT.replace(":slug", slug).replace(":id", String(comment.id)), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    });

    await test.step("Status code should be 204", async () => {
      expect(deleteResponse.status()).toBe(204);
    });

    const comments = await test.step("Get article comments", async () => {
      return getComments(request, slug, token);
    });

    await test.step("Verify deleted comment is not in the list", async () => {
      const found = comments.find((c) => c.id === comment.id);
      expect(found).toBeUndefined();
    });
  });
});
