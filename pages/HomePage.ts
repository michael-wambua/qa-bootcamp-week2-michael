import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.productNames = page.locator('[data-test="product-name"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    const searchResponse = this.page.waitForResponse(
      (r) => r.url().includes('/products/search') && r.ok()
    );
    await this.searchButton.click();
    await searchResponse;
  }

  async expectAllResultsContain(term: string) {
    await expect(this.productNames.first()).toBeVisible();
    const names = await this.productNames.allTextContents();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain(term.toLowerCase());
    }
  }
}