import { Locator, Page } from "@playwright/test";
export default class OrderHistoryPage {
    readonly orderDetailsButton: Locator;
    readonly reorderButton: Locator;
    readonly subTotalPrice: Locator;
    readonly requestReturnButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.orderDetailsButton = page.locator('div:has-text("paid")').first();
        this.reorderButton = page.getByRole('button', { name: 'Reorder' });
        this.subTotalPrice = page.getByText(/^\$/).nth(1);
        this.requestReturnButton = page.locator('button > span', { hasText: 'Request Return' });
    }
    async getProductName(name: string) {
        return await this.page.getByRole('heading', { name }).first();
    }
    async openOrderDetails() {
        await this.orderDetailsButton.click()
    }
    async makeReorder() {
        await this.reorderButton.click()
    }
    async openOrderDetailsByOrderUid(url: string, orderUid: string) {
        await this.page.goto(`${url}/order-history/${orderUid}`, { waitUntil: 'load' })
    }
    async checkOrderStatusOnThePage(status: string) {
        return await this.page.locator('span').filter({ hasText: `${status}` });
      }
}