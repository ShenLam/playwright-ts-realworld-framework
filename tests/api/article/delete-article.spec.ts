import { test, expect } from "../../fixtures/api-fixtures";
import { apiRoutes } from "../../../src/api/routes";

test.describe("Delete Article", () => {
  test("API_ARTICLE_DELETE_01: Verify authenticated user can delete article successfully", async ({
    request,
    createdArticle,
  }) => {
    const deleteResponse = await test.step("Send DELETE article request", async () => {
      return request.delete(apiRoutes.deleteArticle(createdArticle.slug), {
        headers: {
          Authorization: `Token ${createdArticle.owner.token}`,
        },
      });
    });

    await test.step("Delete article status code should be 204", async () => {
      expect(deleteResponse.status()).toBe(204);
    });

    const getResponse = await test.step("Send GET article request after deletion", async () => {
      return request.get(apiRoutes.article(createdArticle.slug), {
        headers: {
          Authorization: `Token ${createdArticle.owner.token}`,
        },
      });
    });

    await test.step("Verify deleted article is no longer accessible", async () => {
      expect(getResponse.status()).toBe(404);
    });
  });
});
