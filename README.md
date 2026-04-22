# Playwright TS RealWorld Framework

[![API Tests](https://github.com/ShenLam/playwright-ts-realworld-framework/actions/workflows/api-tests.yml/badge.svg)](https://github.com/ShenLam/playwright-ts-realworld-framework/actions/workflows/api-tests.yml)

This project is an automation testing framework built with Playwright + TypeScript for testing RealWorld (Conduit) APIs and E2E user flows.

## Scope

- API testing for Auth, User, Profile, Article, Comment, and Tag modules
- E2E testing for Auth, Article, Comment, Profile, and Tag flows
- Positive and negative scenarios based on real QA flows
- Reusable API helpers for common setup actions
- Page Object Model for E2E page interactions
- Centralized endpoint constants, dynamic route builders, and environment config

## Tech Stack

- Playwright
- TypeScript
- Faker (test data generation)
- ESLint and Prettier

## Project Structure

```text
src/
  api/          API endpoint constants and route builders
  config/       Shared environment configuration
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

## Installation

Install dependencies:

```bash
npm ci
```

## Environment Variables

Default API and web URLs are defined in `src/config/env.ts`. To override them locally, create a `.env` file based on `.env.example`:

```env
API_BASE_URL=https://api.realworld.show
WEB_BASE_URL=https://demo.realworld.show
```

## Running Tests

List all tests:

```bash
npm run test:list
```

Run API tests:

```bash
npm run test:api
```

Run E2E tests:

```bash
npm run test:e2e
```

Run all tests:

```bash
npm test
```

Run type checking:

```bash
npm run typecheck
```

Run linting:

```bash
npm run lint
```

Check formatting:

```bash
npm run format:check
```

Open HTML report:

```bash
npm run report
```

## Framework Notes

- `src/api/endpoints.ts` stores raw API endpoint constants.
- `src/api/routes.ts` builds dynamic paths such as article, profile, and comment routes.
- `src/config/env.ts` stores shared API and web base URLs plus default API headers.
- `src/pages/*.ts` contains Page Object Model classes for E2E tests.
- `src/utils/*-helper.ts` contains reusable setup helpers such as register, login, create article, create comment, follow profile, and unfollow profile.
- `src/utils/api-request-helper.ts` creates a temporary API request context for E2E setup data.
- `src/utils/api-error.ts` formats helper error messages with status code and response body.
- `src/constants/test-data.ts` stores shared static test data such as the profile target username.

## Test Design

Test scenarios are documented in Google Sheet:
https://docs.google.com/spreadsheets/d/1UftOZGkik3ZMgpFhk-UAtt7h0bgV1C4odf8rzCHfxEc/edit?usp=sharing

## References

- API Documentation: https://realworld-docs.netlify.app/specifications/backend/endpoints/
- Demo Application: https://demo.realworld.show/
