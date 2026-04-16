import { APIRequestContext } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { ArticleResponse } from "../models/article";

const createArticleData = () => ({
  title: faker.lorem.sentence(3),
  description: faker.lorem.sentence(6),
  body: faker.lorem.paragraph(),
  tagList: [faker.word.noun(), faker.word.noun()],
});

export const createArticle = async (request: APIRequestContext, token: string, articleData = createArticleData()) => {
  const response = await request.post("/api/articles", {
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      article: articleData,
    },
  });

  if (response.status() !== 201) {
    throw new Error(`Create failed with status ${response.status()}`);
  }

  const body: ArticleResponse = await response.json();

  return {
    article: body.article,
    slug: body.article.slug,
  };
};
