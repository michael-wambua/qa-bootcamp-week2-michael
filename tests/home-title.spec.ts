import { test, expect } from '@playwright/test';
import { BASE } from './config';

// Each test gets its own fresh browser page. Every step is awaited,
// and expect retries (5 s default), so no fixed waits are needed.

test('home page has the expected title', async ({ page }) => {
  await page.goto(BASE);

  await expect(page).toHaveTitle('Practice Software Testing - Toolshop - v5.0');
});