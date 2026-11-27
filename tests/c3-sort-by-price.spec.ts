import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';

test('C3 Sort by price (Low - High) shows cheapest first', async ({ page }) => {
  const products = new ProductsPage(page);
  await products.goto();

  await products.sortBy('Price (Low - High)');

  await expect
    .poll(async () => {
      const prices = await products.priceValues();
      const ascending = [...prices].sort((a, b) => a - b);
      return prices.length > 1 && JSON.stringify(prices) === JSON.stringify(ascending);
    })
    .toBe(true);
});
