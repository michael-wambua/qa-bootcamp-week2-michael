# Toolshop Test Suite

Playwright UI and API tests for [practicesoftwaretesting.com](https://practicesoftwaretesting.com) and its API, plus one Cucumber-js scenario. Includes the Week 2 capstone (C3 and C4) and a flakiness drill.

## Prerequisites

- Node.js (LTS) and npm
- Git
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
   `npm test` leaves out the unfixed flakiness drill, which fails on purpose (see below).

## Other ways to run

```bash
npx playwright test tests/api-cart.spec.ts        # one file
npx playwright test -g "pliers"                   # tests matching a name
npx playwright test --trace on                    # record traces
npx playwright show-trace <path-to>/trace.zip     # open a trace
npx playwright show-report                        # open the HTML report
npm run cucumber                                  # Cucumber scenario
```

Capstone tests only:

```bash
npx playwright test tests/c3-sort-by-price.spec.ts tests/c4-add-to-cart.spec.ts --reporter=list
```

## What's in the suite

| Type | File | Test |
| --- | --- | --- |
| UI | `tests/home-title.spec.ts` | Home page has the expected title |
| UI | `tests/search-pliers.spec.ts` | Search "pliers" returns only pliers products |
| UI | `tests/invalid-login.spec.ts` | Invalid login shows an error message |
| UI | `tests/search-by-name.spec.ts` | MS-6: search by name returns only matching products (uses `pages/HomePage.ts`) |
| API | `tests/api-products.spec.ts` | GET /products returns 200 and a product list |
| API | `tests/api-cart.spec.ts` | Create a cart, add a product, check the response fields |
| API | `tests/api-cart.spec.ts` | Non-existent cart id returns 404 |
| UI (capstone) | `tests/c3-sort-by-price.spec.ts` | C3: sort by "Price (Low - High)" shows cheapest first (uses `pages/ProductsPage.ts`) |
| API (capstone) | `tests/c4-add-to-cart.spec.ts` | C4: create a cart (201), add a product (200), cart contains the product |
| Drill | `tests/drill/flaky-fixed.spec.ts` | Save shows "Saved", waits for the condition |
| Drill | `tests/drill/flaky-unfixed.spec.ts` | Save shows "Saved", fixed wait (flaky on purpose) |

## Week 2 capstone

**Cases chosen:** C3 Sort by price (UI) and C4 Add to a cart (API).

- **C3** meets the UI gate. It reads every price on page 1 and checks the list is in ascending order, so a broken sort would fail it. It checks page 1 only.
- **C4** meets the API gate. It fetches a product id, creates a cart, adds the product, reads the cart back and checks the product is in it. It deletes the cart in a `finally` block, so cleanup runs even if an assertion fails.

**Cases left out:** C1 (already automated on Day 7), C2 (page 1 trap, too risky for the time), C5 (creates no data, so it can't be the API case), C6 (C4 covers more).

**Broken run:** C3 was broken on purpose by choosing "Price (High - Low)" while asserting ascending prices. The trace showed `Expected: true, Received: false` after a 5000ms timeout, the High-Low option in the source, descending prices in the snapshot and a 200 from the products request. Classified as a test problem. The test was then restored and passes.

## Flakiness drill

`tests/drill/index.html` shows "Saved" after a random delay of 0 to 1 second.

| Version | Result (20 runs, retries off) |
| --- | --- |
| `flaky-unfixed.spec.ts` (fixed 500ms wait, plain check) | 9 passed, 11 failed (an earlier run: 12 passed, 8 failed) |
| `flaky-fixed.spec.ts` (`toHaveText` waits for the condition) | 20 passed, 0 failed |

Every failure had the same message: `Expected: "Saved"`, `Received: ""`.

```bash
npx playwright test tests/drill/flaky-unfixed.spec.ts --repeat-each=20 --retries=0 --reporter=list
npx playwright test tests/drill/flaky-fixed.spec.ts --repeat-each=20 --retries=0 --reporter=list
```

The unfixed test is kept as evidence. It is flaky on purpose, so `npm test` skips it:

```json
"test": "playwright test --grep-invert \"Drill \\(unfixed\\)\""
```

## Cucumber scenario

`npm run cucumber` runs one scenario from `features/cart.feature`: "A shopper adds a product and sees it in the cart". Its step definitions are in `features/steps/cart.steps.ts`.

The other two scenarios are tagged `@wip` and have no step definitions yet, so Cucumber skips them. `npm test` runs only the Playwright tests.

## Project structure

```
tests/           Playwright UI and API tests (config.ts holds the shared base URL)
tests/drill/     Flakiness drill: index.html, unfixed and fixed tests
pages/           Page objects (HomePage.ts, ProductsPage.ts)
features/        Gherkin feature file (cart.feature)
features/steps/  Cucumber step definitions (cart.steps.ts)
cucumber.mjs     Cucumber config (skips @wip scenarios)
.env.example     Environment variable template
```

## Test data and cleanup

- Tests create their own data and don't depend on each other.
- Any cart a test creates is deleted afterwards, even if the test fails (`test.afterEach` in `api-cart.spec.ts`, a `finally` block in `c4-add-to-cart.spec.ts`).
- No test uses fixed waits, apart from the unfixed drill, which does so on purpose.

## Troubleshooting

- **Browser not found:** run `npx playwright install chromium`.
- **Tests fail with an undefined URL:** `.env` is missing. Run `cp .env.example .env`.
- **Timeouts or 5xx errors:** the public Toolshop site or API may be down or slow. Rerun later.
- **The unfixed drill fails:** expected. It is flaky on purpose and is not part of `npm test`.
- **A trace is needed:** run with `--trace on`, then open `test-results/<folder>/trace.zip` with `npx playwright show-trace`.