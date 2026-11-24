import { test, expect } from '@playwright/test';

// Sourced from .env (TOOLSHOP_URL); falls back to the live site if unset or empty.
const BASE = process.env.TOOLSHOP_URL || 'https://practicesoftwaretesting.com';

test('home page has the expected title', async ({ page }) => {
  await page.goto(BASE);
  await expect(page).toHaveTitle('Practice Software Testing - Toolshop - v5.0');
});

test('search for "pliers" returns only pliers products', async ({ page }) => {
  const term = 'pliers';

  await page.goto(BASE);
  await page.getByRole('textbox', { name: 'Search' }).fill(term);
  await page.getByRole('button', { name: 'Search' }).click();

  await expect(page.getByText(new RegExp(`products? found for '${term}'`))).toBeVisible();

  // No role-based locator exists for product names, so use the data-test attribute
  const productNames = page.locator('[data-test="product-name"]');

  // Results are shown, and none of them lacks the search term.
  // Both assertions retry, so stale cards from the unfiltered list can't pass.
  await expect(productNames).not.toHaveCount(0);
  await expect(productNames.filter({ hasNotText: new RegExp(term, 'i') })).toHaveCount(0);
});

test('invalid login shows an error message', async ({ page }) => {
  await page.goto(`${BASE}/auth/login`);
  await page.getByRole('textbox', { name: 'Email address' }).fill('pewuxono@mailinator.com');
  // Password inputs have no ARIA role, so getByLabel is used; the label includes the asterisk
  await page.getByLabel('Password *').fill('wrongpass1');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Invalid email or password')).toBeVisible();
});