import { Locator, Page } from "@playwright/test";
export default class AllProductsPage{
    readonly outOfStockLabel: Locator;
    readonly lowInStockLabel: Locator;
    readonly emptyPage: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.outOfStockLabel = page.getByText('Out of stock');
        this.lowInStockLabel = page.getByText('Low in stock');
        this.emptyPage = page.getByText('No items here')
    }
    async addProductQtyByName(name: string, qty: number) {
      await this.page.getByRole('option', { name: `${name}` }).getByRole('button').last().scrollIntoViewIfNeeded()
      await this.page.getByRole('option', { name: `${name}` }).getByRole('button').last().click();
      for (let i = 1; i < qty; i++) {
        await this.page.getByRole('option', { name: `${name}` }).getByRole('button').last().scrollIntoViewIfNeeded()
        await this.page.getByRole('option', { name: `${name}` }).getByRole('button').last().click();
      }
    }
    async findItemOnThePage(name: string) {
      return await this.page.locator(`text=${name}`);
    }
}