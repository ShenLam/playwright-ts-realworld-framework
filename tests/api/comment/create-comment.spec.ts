import { test, expect } from "../../fixtures/api-fixtures";
import { faker } from "@faker-js/faker";
import { apiRoutes } from "../../../src/api/routes";
import type { CommentResponse } from "../../../src/models/comment";

const createCommentData = () => ({
  body: faker.lorem.sentence(8),
});

test.describe("Create Comment", () => {
  test("API_COMMENT_CREATE_01: Verify authenticated user can add comment successfully", async ({
    request,
    createdArticle,
  }) => {
    const commentData = createCommentData();

    const response = await test.step("Send POST request to add comment", async () => {
      return request.post(apiRoutes.addComment(createdArticle.slug), {
        headers: {
          Authorization: `Token ${createdArticle.owner.token}`,
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
      expect(body.comment.author.username).toBe(createdArticle.owner.userData.username);
    });
  });
});
