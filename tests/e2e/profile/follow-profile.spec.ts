import { test } from "@playwright/test";
import { TEST_USERS } from "../../../src/constants/test-data";
import { LoginPage } from "../../../src/pages/login-page";
import { ProfilePage } from "../../../src/pages/profile-page";
import { withApiRequest } from "../../../src/utils/api-request-helper";
import { loginUser, registerUser } from "../../../src/utils/auth-helper";
import { followUser } from "../../../src/utils/profile-helper";

const targetUsername = TEST_USERS.PROFILE_TARGET;

test.describe("Follow Profile", () => {
  test("E2E_PROFILE_01: Verify authenticated user can follow another user successfully", async ({ page }) => {
    const { userData } = await test.step("Register current user by API", async () => {
      return withApiRequest(async (apiRequest) => {
        return registerUser(apiRequest);
      });
    });

    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await test.step("Log in with current user credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(userData.username);
    });

    await test.step("Open target user profile", async () => {
      await profilePage.open(targetUsername);
    });

    await test.step("Follow target user", async () => {
      await profilePage.followUser(targetUsername);
    });

    await test.step("Verify target user is followed", async () => {
      await profilePage.expectUserFollowed(targetUsername);
    });
  });

  test("E2E_PROFILE_02: Verify authenticated user can unfollow another user successfully", async ({ page }) => {
    const { userData } = await test.step("Register current user and follow target user by API", async () => {
      return withApiRequest(async (apiRequest) => {
        const { userData } = await registerUser(apiRequest);
        const { token } = await loginUser(apiRequest, userData);
        await followUser(apiRequest, token, targetUsername);

        return {
          userData,
        };
      });
    });

    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await test.step("Log in with current user credentials", async () => {
      await loginPage.open();
      await loginPage.fillLoginForm(userData);
      await loginPage.submit();
      await loginPage.expectUserLoggedIn(userData.username);
    });

    await test.step("Open followed target user profile", async () => {
      await profilePage.open(targetUsername);
    });

    await test.step("Unfollow target user", async () => {
      await profilePage.unfollowUser(targetUsername);
    });

    await test.step("Verify target user is unfollowed", async () => {
      await profilePage.expectUserUnfollowed(targetUsername);
    });
  });
});
