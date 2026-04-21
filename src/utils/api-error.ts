import type { APIResponse } from "@playwright/test";

export const buildApiErrorMessage = async (action: string, response: APIResponse) => {
  const responseBody = await response.text();
  const details = responseBody ? ` Response body: ${responseBody}` : "";

  return `${action} failed with status ${response.status()}.${details}`;
};
