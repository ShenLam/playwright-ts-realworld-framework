# Playwright TS RealWorld Framework

This project is an automation testing framework built with Playwright + TypeScript for testing RealWorld (Conduit) APIs.

## Scope

* API testing for Auth, User, Profile, Article, Comment, and Tag modules
* Positive and negative API scenarios based on real QA flows
* Reusable API helpers for common setup actions
* Centralized endpoint constants and dynamic route builders

## Tech Stack

* Playwright
* TypeScript
* Faker (test data generation)

## Project Structure

```text
src/
  api/          API endpoint constants and route builders
  constants/    Shared static test data
  models/       TypeScript response models
  utils/        Reusable API helper functions

tests/api/
  auth/         Register and login tests
  user/         Current user and update user tests
  profile/      Get, follow, and unfollow profile tests
  article/      Create, get, list, update, and delete article tests
  comment/      Create, list, and delete comment tests
  tag/          Get tags tests
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

Open HTML report:

```bash
npx playwright show-report
```

## Framework Notes

* `src/api/endpoints.ts` stores raw API endpoint constants.
* `src/api/routes.ts` builds dynamic paths such as article, profile, and comment routes.
* `src/utils/*-helper.ts` contains reusable setup helpers such as register, login, create article, create comment, follow profile, and unfollow profile.
* `src/utils/api-error.ts` formats helper error messages with status code and response body.
* `src/constants/test-data.ts` stores shared static test data such as the profile target username.

## Test Design

Test scenarios are documented in Google Sheet:
https://docs.google.com/spreadsheets/d/1UftOZGkik3ZMgpFhk-UAtt7h0bgV1C4odf8rzCHfxEc/edit?usp=sharing

## References

* API Documentation: https://realworld-docs.netlify.app/specifications/backend/endpoints/
* Demo Application: https://demo.realworld.show/
