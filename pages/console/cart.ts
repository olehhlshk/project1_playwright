import { Locator, Page } from "@playwright/test";
export default class ConsoleCartPage{
    readonly proceedToCheckoutButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });
    }
    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click()
    }
}