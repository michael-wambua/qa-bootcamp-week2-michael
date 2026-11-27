import { test, expect } from '@playwright/test';

const API = 'https://api.practicesoftwaretesting.com';

test('C4 Add to a cart', async ({ request }) => {
  // data: a real product id, fetched in the test
  const productsRes = await request.get(`${API}/products`);
  expect(productsRes.status()).toBe(200);
  const productId = (await productsRes.json()).data[0].id;

  // create cart
  const createRes = await request.post(`${API}/carts`);
  expect(createRes.status()).toBe(201);
  const cartId = (await createRes.json()).id;

  try {
    // add product
    const addRes = await request.post(`${API}/carts/${cartId}`, {
      data: { product_id: productId, quantity: 1 },
    });
    expect(addRes.status()).toBe(200);

    // cart contains the product
    const cartRes = await request.get(`${API}/carts/${cartId}`);
    expect(cartRes.status()).toBe(200);
    const cart = await cartRes.json();
    const ids = cart.cart_items.map((i: any) => i.product_id ?? i.product?.id);
    expect(ids).toContain(productId);
  } finally {
    // cleanup always runs
    const delRes = await request.delete(`${API}/carts/${cartId}`);
    expect(delRes.ok()).toBeTruthy();
  }
});