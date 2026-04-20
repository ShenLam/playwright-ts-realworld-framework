import { APIRequestContext, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { API_ENDPOINTS } from "../api/endpoints";
import type { CommentResponse, CommentsResponse } from "../models/comment";

const createCommentData = () => ({
  body: faker.lorem.sentence(8),
});

export const createComment = async (request: APIRequestContext, token: string, slug: string, commentData = createCommentData()) => {
  const response = await request.post(API_ENDPOINTS.ADD_COMMENT.replace(":slug", slug), {
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      comment: commentData,
    },
  });

  if (response.status() !== 201) {
    throw new Error(`Create failed with status ${response.status()}`);
  }

  const body: CommentResponse = await response.json();

  return {
    comment: body.comment,
    commentData,
  };
};

export const getComments = async (request: APIRequestContext, slug: string, token?: string) => {
  const response = await request.get(API_ENDPOINTS.GET_COMMENTS.replace(":slug", slug), {
    headers: token
      ? {
          Authorization: `Token ${token}`,
        }
      : undefined,
  });

  if (response.status() !== 200) {
    throw new Error(`Get failed with status ${response.status()}`);
  }

  const body: CommentsResponse = await response.json();

  return body.comments;
};
