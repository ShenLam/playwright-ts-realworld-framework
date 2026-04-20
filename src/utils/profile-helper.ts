import { APIRequestContext, expect } from "@playwright/test";
import { API_ENDPOINTS } from "../api/endpoints";
import type { ProfileResponse } from "../models/profile";

export const followUser = async (request: APIRequestContext, token: string, username: string) => {
  const response = await request.post(API_ENDPOINTS.FOLLOW_USER.replace(":username", username), {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (response.status() !== 200) {
    throw new Error(`Follow failed with status ${response.status()}`);
  }

  const body: ProfileResponse = await response.json();

  return body.profile;
};

export const unfollowUser = async (request: APIRequestContext, token: string, username: string) => {
  const response = await request.delete(API_ENDPOINTS.UNFOLLOW_USER.replace(":username", username), {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (response.status() !== 200) {
    throw new Error(`Unfollow failed with status ${response.status()}`);
  }
  const body: ProfileResponse = await response.json();

  return body.profile;
};
