import { test, expect } from "../../fixtures/api-fixtures";
import { apiRoutes } from "../../../src/api/routes";
import type { CommentsResponse } from "../../../src/models/comment";

test.describe("List Comments", () => {
  test("API_COMMENT_LIST_01: Verify user can get article comments successfully", async ({
    request,
    createdComment,
  }) => {
    const response = await test.step("Send GET article comments request", async () => {
      return request.get(apiRoutes.comments(createdComment.slug), {
        headers: {
          Authorization: `Token ${createdComment.owner.token}`,
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

      const foundComment = body.comments.find((item) => item.id === createdComment.comment.id);

      expect(foundComment).toBeDefined();
      expect(foundComment?.body).toBe(createdComment.commentData.body);
      expect(foundComment?.author.username).toBe(createdComment.owner.userData.username);
    });
  });
});
