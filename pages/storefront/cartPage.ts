import { Locator, Page } from "@playwright/test";
export default class CartPage {
  readonly removeItemButton: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly addExtraQty: Locator;
  constructor(public page: Page) {
    this.page = page;
    this.removeItemButton = page.locator("div:nth-child(5) > button");
    this.proceedToCheckoutButton = page.getByRole("button", {
      name: "Proceed to checkout",
    });
    this.addExtraQty = page.locator("button:nth-child(3)").first();
  }
  async removeItem() {
    await this.removeItemButton.click();
  }
  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
  async addNewQty() {
    await this.addExtraQty.click();
  }
}