import { APIRequestContext } from "@playwright/test";
import { apiRoutes } from "../api/routes";
import type { ProfileResponse } from "../models/profile";
import { buildApiErrorMessage } from "./api-error";

export const followUser = async (request: APIRequestContext, token: string, username: string) => {
  const response = await request.post(apiRoutes.followProfile(username), {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (response.status() !== 200) {
    throw new Error(await buildApiErrorMessage("Follow user", response));
  }

  const body: ProfileResponse = await response.json();

  return body.profile;
};

export const unfollowUser = async (request: APIRequestContext, token: string, username: string) => {
  const response = await request.delete(apiRoutes.unfollowProfile(username), {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (response.status() !== 200) {
    throw new Error(await buildApiErrorMessage("Unfollow user", response));
  }
  const body: ProfileResponse = await response.json();

  return body.profile;
};
