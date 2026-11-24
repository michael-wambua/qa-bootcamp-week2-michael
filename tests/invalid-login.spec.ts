import { test, expect } from '@playwright/test';
import { BASE } from './config';

test('invalid login shows an error message', async ({ page }) => {
  await page.goto(`${BASE}/auth/login`);
  await page.getByRole('textbox', { name: 'Email address' }).fill('pewuxono@mailinator.com');
  // Password inputs have no ARIA role, so getByLabel is used; the label includes the asterisk
  await page.getByLabel('Password *').fill('wrongpass1');
  await page.getByRole('button', { name: 'Login' }).click();

  // What a user sees after a failed login: the error message
  await expect(page.getByText('Invalid email or password')).toBeVisible();
});