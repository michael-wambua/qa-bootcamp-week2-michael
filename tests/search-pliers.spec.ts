import { test, expect } from '@playwright/test';
import { BASE } from './config';

test('search for "pliers" returns only pliers products', async ({ page }) => {
  const term = 'pliers';

  await page.goto(BASE);
  await page.getByRole('textbox', { name: 'Search' }).fill(term);
  await page.getByRole('button', { name: 'Search' }).click();

  // What a user sees first: the results message for this search
  await expect(page.getByText(new RegExp(`products? found for '${term}'`))).toBeVisible();

  // No role-based locator exists for product names, so use the data-test attribute
  const productNames = page.locator('[data-test="product-name"]');

  // Both assertions retry, so stale cards from the unfiltered list can't pass
  await expect(productNames).not.toHaveCount(0);
  await expect(productNames.filter({ hasNotText: new RegExp(term, 'i') })).toHaveCount(0);
});