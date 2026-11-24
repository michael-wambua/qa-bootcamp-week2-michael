import { test, expect } from '@playwright/test';

// Sourced from .env (TOOLSHOP_URL); falls back to the live site if unset.
// playwright.config.ts loads .env via dotenv/config, so process.env is populated.
const BASE = process.env.TOOLSHOP_URL ?? 'https://practicesoftwaretesting.com';

test('home page has the expected title', async ({ page }) => {
  await page.goto(BASE);
  await expect(page).toHaveTitle('Practice Software Testing - Toolshop - v5.0');
});

test('search for "pliers" returns only pliers products', async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole('textbox', { name: 'Search' }).fill('pliers');
  await page.getByRole('button', { name: 'Search' }).click();

  await expect(page.getByText(/products? found for 'pliers'/)).toBeVisible();

  // No role-based locator exists for product names, so i will use the data-test attribute
  const productNames = page.locator('[data-test="product-name"]');

  // Retries until the list has filtered, so it never reads stale cards
  await expect
    .poll(async () => {
      const names = await productNames.allTextContents();
      return names.length > 0 && names.every(n => n.toLowerCase().includes('pliers'));
    })
    .toBe(true);
});

test('invalid login shows an error message', async ({ page }) => {
  await page.goto(`${BASE}/auth/login`);
  await page.getByRole('textbox', { name: 'Email address' }).fill('pewuxono@mailinator.com');
  // Password inputs have no ARIA role, so getByLabel is used; the label includes the asterisk
  await page.getByLabel('Password *').fill('wrongpass1');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Invalid email or password')).toBeVisible();
});