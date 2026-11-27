import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';

const PAGE_URL = pathToFileURL(path.join(__dirname, 'index.html')).href;

test('Drill (fixed): Save shows "Saved"', async ({ page }) => {
  await page.goto(PAGE_URL);
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.locator('#status')).toHaveText('Saved');
});