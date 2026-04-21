import { API_ENDPOINTS } from "./endpoints";

export const apiRoutes = {
  profile: (username: string) => API_ENDPOINTS.GET_PROFILE.replace(":username", username),
  followProfile: (username: string) => API_ENDPOINTS.FOLLOW_USER.replace(":username", username),
  unfollowProfile: (username: string) => API_ENDPOINTS.UNFOLLOW_USER.replace(":username", username),

  article: (slug: string) => API_ENDPOINTS.GET_ARTICLE.replace(":slug", slug),
  updateArticle: (slug: string) => API_ENDPOINTS.UPDATE_ARTICLE.replace(":slug", slug),
  deleteArticle: (slug: string) => API_ENDPOINTS.DELETE_ARTICLE.replace(":slug", slug),

  comments: (slug: string) => API_ENDPOINTS.GET_COMMENTS.replace(":slug", slug),
  addComment: (slug: string) => API_ENDPOINTS.ADD_COMMENT.replace(":slug", slug),
  deleteComment: (slug: string, id: number | string) =>
    API_ENDPOINTS.DELETE_COMMENT.replace(":slug", slug).replace(":id", String(id)),
};
