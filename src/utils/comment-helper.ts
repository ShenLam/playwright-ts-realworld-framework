import { APIRequestContext } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { apiRoutes } from "../api/routes";
import type { CommentResponse, CommentsResponse } from "../models/comment";
import { buildApiErrorMessage } from "./api-error";

export const createCommentData = () => ({
  body: faker.lorem.sentence(8),
});

export const createComment = async (request: APIRequestContext, token: string, slug: string, commentData = createCommentData()) => {
  const response = await request.post(apiRoutes.addComment(slug), {
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      comment: commentData,
    },
  });

  if (response.status() !== 201) {
    throw new Error(await buildApiErrorMessage("Create comment", response));
  }

  const body: CommentResponse = await response.json();

  return {
    comment: body.comment,
    commentData,
  };
};

export const getComments = async (request: APIRequestContext, slug: string, token?: string) => {
  const response = await request.get(apiRoutes.comments(slug), {
    headers: token
      ? {
          Authorization: `Token ${token}`,
        }
      : undefined,
  });

  if (response.status() !== 200) {
    throw new Error(await buildApiErrorMessage("Get comments", response));
  }

  const body: CommentsResponse = await response.json();

  return body.comments;
};
