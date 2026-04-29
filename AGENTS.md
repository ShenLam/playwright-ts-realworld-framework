# AGENTS.md

## Project Context

This is a Playwright + TypeScript automation framework for testing the RealWorld app.

The framework covers:

- API tests for auth, user, profile, article, comment, and tag flows
- E2E tests for auth, article, comment, profile, and tag flows
- Reusable helpers for API setup
- Page Object Models for UI flows
- Shared Playwright fixtures for test preconditions

## Tech Stack

- Playwright Test
- TypeScript
- Faker
- ESLint
- Prettier
- GitHub Actions

## Project Structure

- `tests/api`: API specs
- `tests/e2e`: E2E specs
- `tests/fixtures`: shared Playwright fixtures
- `src/api`: endpoint constants and route builders
- `src/config`: environment config
- `src/constants`: shared static test data
- `src/models`: TypeScript response models
- `src/pages`: Page Object Models
- `src/utils`: reusable API setup helpers

## Core Testing Conventions

- If a test verifies an endpoint directly, keep the main request and payload in the spec.
- Use helpers and fixtures only for setup/preconditions.
- Do not hide the primary action under test behind a helper or fixture.
- Keep `test.step` blocks so Playwright reports stay readable.
- Prefer dynamic Faker data for isolated test data.
- Keep assertions close to the behavior being verified.

## API Test Conventions

- `tests/api/auth/register.spec.ts` should create its own user payload because register is the subject under test.
- `tests/api/auth/login.spec.ts` may use `registerUser` as setup, but the login request should stay in the spec.
- `tests/api/article/create-article.spec.ts` may use auth helpers as setup, but the create article request should stay in the spec.
- For other API specs, shared fixtures can be used when register/login/create article/create comment are only preconditions.

## E2E Test Conventions

- E2E tests may use API fixtures to create setup state.
- UI actions being verified should remain visible in the spec.
- Do not use API fixtures for `tests/e2e/auth/register.spec.ts`, because register UI is the subject under test.
- Login UI tests may use API setup to create a registered user, but login should still happen through the UI.
- Article/comment/profile E2E tests may create users/articles/comments through API setup when those are preconditions.

## Shared Fixtures

`tests/fixtures/api-fixtures.ts` provides:

- `authenticatedUser`: creates and logs in a user
- `createdArticle`: creates an authenticated user and an article
- `createdComment`: creates an authenticated user, article, and comment

The fixture supports both Playwright projects:

- In `api-tests`, it uses the project `request` fixture directly.
- In `e2e-tests`, it uses `withApiRequest` because the E2E project `request` fixture is configured with the web base URL.

## Environment

Defaults are defined in `src/config/env.ts`:

- `API_BASE_URL`
- `WEB_BASE_URL`
- `API_HTTP_HEADERS`

Use `.env.example` as the reference for local overrides.

## CI

GitHub Actions run sequentially:

1. `quality`
2. `api-tests`
3. `e2e-tests`

The `quality` job runs:

- TypeScript type checking
- ESLint
- Prettier format check

## Before Pushing

Run:

```bash
npm run format:check
npm run typecheck
npm run lint
npm run test:list
```

Run test suites when needed:

```bash
npm run test:api
npm run test:e2e
```

## Notes For Future Changes

- Keep helpers small and explicit.
- Avoid broad refactors unless they improve a repeated pattern.
- Prefer existing project patterns over introducing new abstractions.
- If a setup pattern appears in multiple specs, consider a fixture.
- If a fixture starts mixing API setup and UI behavior, split it into API and E2E-specific fixtures.
