# Toolshop Test Suite

Playwright UI and API tests for [practicesoftwaretesting.com](https://practicesoftwaretesting.com) and its API, plus one Cucumber-js scenario and TypeScript practice files. Built during Week 2 of the QA bootcamp.

## Prerequisites

- [Node.js](https://nodejs.org/) (current LTS) and npm
- [Git](https://git-scm.com/)
- Internet access (the tests run against the public Toolshop site and API)

## Setup and run

1. **Clone and install:**
   ```bash
   git clone https://github.com/michael-wambua/qa-bootcamp-week2-michael.git
   cd qa-bootcamp-week2-michael
   npm install
   npx playwright install chromium
   ```
2. **Configure:**
   ```bash
   cp .env.example .env
   ```
   The defaults in `.env.example` work as they are:
   - `TOOLSHOP_URL`: base URL of the Toolshop website (used by the UI tests)
   - `TOOLSHOP_API_URL`: base URL of the Toolshop API
3. **Run:**
   ```bash
   npm test
   ```

> **Warning:** never commit `.env`. It is listed in `.gitignore`. Do not remove it from there.

## Other ways to run

```bash
npm run check                                     # checks .env and that the Toolshop API is reachable (prints PASS)
npm run cucumber                                  # Cucumber scenario
npx playwright test tests/api-cart.spec.ts        # one file
npx playwright test -g "pliers"                   # tests matching a name
npx playwright test --trace on                    # record traces
npx playwright show-trace <path-to>/trace.zip     # open a trace
npx playwright show-report                        # open the HTML report
npx tsx <path>                                    # run a TypeScript practice file
```

## What's in the suite (7 Playwright tests)

| Type | File | Test |
| --- | --- | --- |
| UI | `tests/home-title.spec.ts` | Home page has the expected title |
| UI | `tests/search-pliers.spec.ts` | Search "pliers" returns only pliers products |
| UI | `tests/invalid-login.spec.ts` | Invalid login shows an error message |
| UI | `tests/search-by-name.spec.ts` | MS-6: search by name returns only matching products (uses `pages/HomePage.ts`) |
| API | `tests/api-products.spec.ts` | GET /products returns 200 and a product list |
| API | `tests/api-cart.spec.ts` | Create a cart, add a product, check the response fields |
| API | `tests/api-cart.spec.ts` | Non-existent cart id returns 404 |

`npm test` runs all seven.

## Cucumber scenario

`npm run cucumber` runs one scenario from `features/cart.feature`: "A shopper adds a product and sees it in the cart". Its step definitions are in `features/steps/cart.steps.ts`.

The other two scenarios are tagged `@wip` and have no step definitions yet, so Cucumber skips them. `npm test` runs only the Playwright tests.

## TypeScript basics (Day 6)

- `src/ts-basics/functions.ts`: typed function with a default parameter.
- `src/ts-basics/optional-chaining.ts`: optional property and optional chaining on a possibly-null value.
- `src/profile-validator.ts`: typed user profile with optional settings. `isNotified(user)` returns `false` when `settings` or `notifications` is missing.

Run any file with `npx tsx <path>`, for example `npx tsx src/profile-validator.ts`.

## Project structure

```
tests/           Playwright UI and API tests (config.ts holds the shared base URL)
pages/           Page objects (HomePage.ts)
features/        Gherkin feature file (cart.feature)
features/steps/  Cucumber step definitions (cart.steps.ts)
src/             TypeScript practice files (ts-basics/, profile-validator.ts)
scripts/         Helper scripts (check.ts, run by npm run check)
cucumber.mjs     Cucumber config (skips @wip scenarios)
.env.example     Environment variable template
```

## Test data and cleanup

- Tests create their own data and don't depend on each other.
- Any cart a test creates is deleted afterwards (`test.afterEach`), even if the test fails.

## Troubleshooting

- **Browser not found:** run `npx playwright install chromium`.
- **Tests fail with an undefined URL:** `.env` is missing. Run `cp .env.example .env`.
- **Timeouts or 5xx errors:** the public Toolshop site or API may be down or slow. Rerun later.
