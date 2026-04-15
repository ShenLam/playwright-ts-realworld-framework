import { APIRequestContext } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { API_ENDPOINTS } from "../api/endpoints";
import type { UserResponse } from "../models/user";

export const createUserData = () => ({
  username: `${faker.person.firstName().toLowerCase()}${faker.number.int(1000)}`,
  email: faker.internet.email().toLowerCase(),
  password: "Password123!",
});

export const registerUser = async (request: APIRequestContext, userData = createUserData()) => {
  const response = await request.post(API_ENDPOINTS.REGISTER, {
    data: { user: userData },
  });

  if (response.status() !== 201) {
    throw new Error(`Register failed with status ${response.status()}`);
  }

  const body: UserResponse = await response.json();

  return {
    userData,
    user: body.user,
  };
};

export const loginUser = async (request: APIRequestContext, userData: { email: string; password: string }) => {
  const response = await request.post(API_ENDPOINTS.LOGIN, {
    data: {
      user: {
        email: userData.email,
        password: userData.password,
      },
    },
  });

  if (response.status() !== 200) {
    throw new Error(`Login failed with status ${response.status()}`);
  }

  const body: UserResponse = await response.json();

  return {
    user: body.user,
    token: body.user.token,
  };
};
