import { test as base, expect, type APIRequestContext, type TestInfo } from "@playwright/test";
import type { Article } from "../../src/models/article";
import type { Comment } from "../../src/models/comment";
import type { User } from "../../src/models/user";
import { createArticle } from "../../src/utils/article-helper";
import { createComment, createCommentData } from "../../src/utils/comment-helper";
import { withApiRequest } from "../../src/utils/api-request-helper";
import { createUserData, loginUser, registerUser } from "../../src/utils/auth-helper";

type UserData = ReturnType<typeof createUserData>;
type CommentData = ReturnType<typeof createCommentData>;

type AuthenticatedUser = {
  userData: UserData;
  user: User;
  token: string;
};

type CreatedArticle = {
  article: Article;
  slug: string;
  owner: AuthenticatedUser;
};

type CreatedComment = {
  comment: Comment;
  commentData: CommentData;
  article: Article;
  slug: string;
  owner: AuthenticatedUser;
};

type ApiFixtures = {
  authenticatedUser: AuthenticatedUser;
  createdArticle: CreatedArticle;
  createdComment: CreatedComment;
};

const runApiSetup = async <T>(
  request: APIRequestContext,
  testInfo: TestInfo,
  callback: (apiRequest: APIRequestContext) => Promise<T>,
) => {
  if (testInfo.project.name === "api-tests") {
    return callback(request);
  }

  return withApiRequest(callback);
};

const test = base.extend<ApiFixtures>({
  authenticatedUser: async ({ request }, use, testInfo) => {
    const { userData, user, token } = await runApiSetup(request, testInfo, async (apiRequest) => {
      const { userData, user } = await registerUser(apiRequest);
      const { token } = await loginUser(apiRequest, userData);

      return { userData, user, token };
    });

    await use({ userData, user, token });
  },

  createdArticle: async ({ request, authenticatedUser }, use, testInfo) => {
    const { article, slug } = await runApiSetup(request, testInfo, (apiRequest) =>
      createArticle(apiRequest, authenticatedUser.token),
    );

    await use({ article, slug, owner: authenticatedUser });
  },

  createdComment: async ({ request, createdArticle }, use, testInfo) => {
    const { comment, commentData } = await runApiSetup(request, testInfo, (apiRequest) =>
      createComment(apiRequest, createdArticle.owner.token, createdArticle.slug),
    );

    await use({
      comment,
      commentData,
      article: createdArticle.article,
      slug: createdArticle.slug,
      owner: createdArticle.owner,
    });
  },
});

export { test, expect };
