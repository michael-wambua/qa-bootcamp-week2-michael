import { test, expect } from '@playwright/test';

const API = 'https://api.practicesoftwaretesting.com';

test.describe('Cart API', () => {
  let cartId: string | undefined;

  // Runs after every test, pass or fail. Deletes the cart only if the test created one.
  test.afterEach(async ({ request }) => {
    if (cartId) {
      const res = await request.delete(`${API}/carts/${cartId}`);
      expect([200, 204]).toContain(res.status());
      cartId = undefined;
    }
  });

  test('create a cart, add a product, check the response fields', async ({ request }) => {
    // Own data: pick a product instead of hardcoding an id
    const productsRes = await request.get(`${API}/products`);
    expect(productsRes.status()).toBe(200);
    const productId = (await productsRes.json()).data[0].id;

    // Create cart
    const createRes = await request.post(`${API}/carts`);
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    cartId = created.id; // set immediately so cleanup runs even if a later check fails
    expect(cartId).toBeTruthy();

    // Add product
    const addRes = await request.post(`${API}/carts/${cartId}`, {
      data: { product_id: productId, quantity: 1 },
    });
    expect(addRes.status()).toBe(200);

    // Check the cart contents
    const cartRes = await request.get(`${API}/carts/${cartId}`);
    expect(cartRes.status()).toBe(200);
    const cart = await cartRes.json();
    expect(cart.id).toBe(cartId);
    expect(cart.cart_items).toHaveLength(1);
    expect(cart.cart_items[0].product_id).toBe(productId);
    expect(cart.cart_items[0].quantity).toBe(1);
  });

  test('non-existent cart id returns 404', async ({ request }) => {
    const res = await request.get(`${API}/carts/does-not-exist-000`);
    expect(res.status()).toBe(404);
  });
});