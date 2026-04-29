import { test, expect } from "../../fixtures/api-fixtures";
import { getComments } from "../../../src/utils/comment-helper";
import { apiRoutes } from "../../../src/api/routes";

test.describe("Delete Comment", () => {
  test("API_COMMENT_DELETE_01: Verify authenticated user can delete comment successfully", async ({
    request,
    createdComment,
  }) => {
    const deleteResponse = await test.step("Send DELETE comment request", async () => {
      return request.delete(apiRoutes.deleteComment(createdComment.slug, createdComment.comment.id), {
        headers: {
          Authorization: `Token ${createdComment.owner.token}`,
        },
      });
    });

    await test.step("Status code should be 204", async () => {
      expect(deleteResponse.status()).toBe(204);
    });

    const comments = await test.step("Get article comments", async () => {
      return getComments(request, createdComment.slug, createdComment.owner.token);
    });

    await test.step("Verify deleted comment is not in the list", async () => {
      const found = comments.find((c) => c.id === createdComment.comment.id);
      expect(found).toBeUndefined();
    });
  });
});
