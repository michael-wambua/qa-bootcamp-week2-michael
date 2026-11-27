import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';
import { BASE } from '../../tests/config';

setDefaultTimeout(30_000);

let browser: Browser;
let page: Page;
let productPrice = '';

Before(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
});

After(async () => {
  await browser.close();
});

Given('the shopper is on the Toolshop home page', async () => {
  await page.goto(BASE);
});

When('the shopper opens the {string} product', async (name: string) => {
  await page.getByText(name, { exact: true }).first().click();
  await expect(page.locator('[data-test="product-name"]')).toHaveText(name);
  productPrice = (await page.locator('[data-test="unit-price"]').innerText()).trim();
});

When('the shopper adds {int} of it to the cart', async (qty: number) => {
  await page.locator('[data-test="quantity"]').fill(String(qty));
  await page.locator('[data-test="add-to-cart"]').click();
});

When('the shopper opens the cart', async () => {
  await page.locator('[data-test="nav-cart"]').click();
});

Then('the cart lists {string} with quantity {int}', async (name: string, qty: number) => {
  const row = page.locator('tbody tr', { hasText: name });
  await expect(row).toBeVisible();
  await expect(row.locator('[data-test="product-quantity"]')).toHaveValue(String(qty));
});

Then('the cart total equals the product price', async () => {
  await expect(page.locator('[data-test="cart-total"]')).toContainText(productPrice);
});