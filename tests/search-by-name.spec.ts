import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('MS-6: search by name returns only matching products', async ({ page }) => {
  const home = new HomePage(page);

  await home.goto();
  await home.searchFor('pliers');

  await home.expectAllResultsContain('pliers');
});