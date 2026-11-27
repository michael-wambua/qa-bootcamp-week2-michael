import { Page, Locator, expect } from '@playwright/test';
import { BASE } from '../tests/config';

export class ProductsPage {
  readonly page: Page;
  readonly sort: Locator;
  readonly prices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sort = page.getByLabel('sort');
    this.prices = page.locator('[data-test="product-price"]');
  }

  async goto() {
    await this.page.goto(BASE);
    await expect(this.prices.first()).toBeVisible();
  }

  async sortBy(label: string) {
    await this.sort.selectOption({ label });
  }

  async priceValues(): Promise<number[]> {
    const texts = await this.prices.allTextContents();
    return texts.map((t) => parseFloat(t.replace(/[^0-9.]/g, '')));
  }
}
