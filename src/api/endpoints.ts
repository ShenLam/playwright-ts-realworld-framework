export const API_ENDPOINTS = {
  // Auth & User
  REGISTER: "/api/users",
  LOGIN: "/api/users/login",
  CURRENT_USER: "/api/user",
  UPDATE_USER: "/api/user",

  // Profiles
  GET_PROFILE: "/api/profiles/:username",
  FOLLOW_USER: "/api/profiles/:username/follow",
  UNFOLLOW_USER: "/api/profiles/:username/follow",

  // Articles
  LIST_ARTICLES: "/api/articles",
  FEED_ARTICLES: "/api/articles/feed",
  GET_ARTICLE: "/api/articles/:slug",
  CREATE_ARTICLE: "/api/articles",
  UPDATE_ARTICLE: "/api/articles/:slug",
  DELETE_ARTICLE: "/api/articles/:slug",

  // Comments
  ADD_COMMENT: "/api/articles/:slug/comments",
  GET_COMMENTS: "/api/articles/:slug/comments",
  DELETE_COMMENT: "/api/articles/:slug/comments/:id",

  // Favorites
  FAVORITE_ARTICLE: "/api/articles/:slug/favorite",
  UNFAVORITE_ARTICLE: "/api/articles/:slug/favorite",

  // Tags
  GET_TAGS: "/api/tags",
};
