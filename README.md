# Playwright TS RealWorld Framework

This project is an automation testing framework built with Playwright + TypeScript for testing RealWorld (Conduit) APIs and E2E user flows.

## Scope

* API testing for Auth, User, Profile, Article, Comment, and Tag modules
* E2E testing for Auth, Article, Comment, Profile, and Tag flows
* Positive and negative scenarios based on real QA flows
* Reusable API helpers for common setup actions
* Page Object Model for E2E page interactions
* Centralized endpoint constants, dynamic route builders, and API config

## Tech Stack

* Playwright
* TypeScript
* Faker (test data generation)

## Project Structure

```text
src/
  api/          API endpoint constants, route builders, and API config
  constants/    Shared static test data
  models/       TypeScript response models
  pages/        E2E page objects
  utils/        Reusable API helper functions

tests/api/
  auth/         Register and login tests
  user/         Current user and update user tests
  profile/      Get, follow, and unfollow profile tests
  article/      Create, get, list, update, and delete article tests
  comment/      Create, list, and delete comment tests
  tag/          Get tags tests

tests/e2e/
  auth/         Register and login E2E tests
  profile/      Follow and unfollow profile E2E tests
  article/      Create, get, edit, and delete article E2E tests
  comment/      Add comment E2E tests
  tag/          View tags E2E tests
```

## Running Tests

List API tests:

```bash
npx playwright test --list --project=api-tests
```

Run API tests:

```bash
npx playwright test --project=api-tests
```

List E2E tests:

```bash
npx playwright test --list --project=e2e-tests
```

Run E2E tests:

```bash
npx playwright test --project=e2e-tests
```

Run a specific E2E spec:

```bash
npx playwright test tests/e2e/article/create-article.spec.ts --project=e2e-tests
```

Open HTML report:

```bash
npx playwright show-report
```

## Framework Notes

* `src/api/endpoints.ts` stores raw API endpoint constants.
* `src/api/routes.ts` builds dynamic paths such as article, profile, and comment routes.
* `src/api/api-config.ts` stores shared API base URL and default API headers.
* `src/pages/*.ts` contains Page Object Model classes for E2E tests.
* `src/utils/*-helper.ts` contains reusable setup helpers such as register, login, create article, create comment, follow profile, and unfollow profile.
* `src/utils/api-request-helper.ts` creates a temporary API request context for E2E setup data.
* `src/utils/api-error.ts` formats helper error messages with status code and response body.
* `src/constants/test-data.ts` stores shared static test data such as the profile target username.

## Test Design

Test scenarios are documented in Google Sheet:
https://docs.google.com/spreadsheets/d/1UftOZGkik3ZMgpFhk-UAtt7h0bgV1C4odf8rzCHfxEc/edit?usp=sharing

## References

* API Documentation: https://realworld-docs.netlify.app/specifications/backend/endpoints/
* Demo Application: https://demo.realworld.show/
