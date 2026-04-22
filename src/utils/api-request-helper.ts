import { request as playwrightRequest, type APIRequestContext } from "@playwright/test";
import { API_BASE_URL, API_HTTP_HEADERS } from "../config/env";

export const withApiRequest = async <T>(callback: (request: APIRequestContext) => Promise<T>) => {
  const apiRequest = await playwrightRequest.newContext({
    baseURL: API_BASE_URL,
    extraHTTPHeaders: API_HTTP_HEADERS,
  });

  try {
    return await callback(apiRequest);
  } finally {
    await apiRequest.dispose();
  }
};
