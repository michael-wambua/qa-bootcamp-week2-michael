import { test, expect } from '@playwright/test';

const API = 'https://api.practicesoftwaretesting.com';

test('GET /products returns 200 and a product list', async ({ request }) => {
  const response = await request.get(`${API}/products`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);
  expect(body.data[0]).toHaveProperty('name');
});