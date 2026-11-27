import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';

const PAGE_URL = pathToFileURL(path.join(__dirname, 'index.html')).href;

test('Drill (unfixed): Save shows "Saved" after a fixed wait', async ({ page }) => {
  await page.goto(PAGE_URL);
  await page.getByRole('button', { name: 'Save' }).click();

  await page.waitForTimeout(500); // fixed wait on purpose, this is the flaky version

  const text = await page.locator('#status').textContent(); // read once
  expect(text).toBe('Saved'); // plain check, not retrying
});