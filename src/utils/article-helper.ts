import { APIRequestContext } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { API_ENDPOINTS } from "../api/endpoints";
import type { ArticleResponse } from "../models/article";
import { buildApiErrorMessage } from "./api-error";

const createArticleData = () => ({
  title: faker.lorem.sentence(3),
  description: faker.lorem.sentence(6),
  body: faker.lorem.paragraph(),
  tagList: [faker.word.noun(), faker.word.noun()],
});

export const createArticle = async (request: APIRequestContext, token: string, articleData = createArticleData()) => {
  const response = await request.post(API_ENDPOINTS.CREATE_ARTICLE, {
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      article: articleData,
    },
  });

  if (response.status() !== 201) {
    throw new Error(await buildApiErrorMessage("Create article", response));
  }

  const body: ArticleResponse = await response.json();

  return {
    article: body.article,
    slug: body.article.slug,
  };
};
