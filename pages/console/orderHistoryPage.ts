import { Locator, Page } from "@playwright/test";
export default class ConsoleOrderHistoryPage{
    readonly orderDetailsButton: Locator;
    readonly subTotalPrice: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.orderDetailsButton = page.getByRole('cell', { name: 'active' }).locator('div:has-text("active")').first();
        this.subTotalPrice = page.getByText(/^\$/).nth(1);
    }
    async getProductName(name: string){
        return await this.page.getByText(`${name}`).nth(0);
    }
    async openOrderDetails(){
        await this.orderDetailsButton.click()
    }
    async openOrderDetailsByOrderUid(url: string, orderUid: string){
        await this.page.goto(`${url}/orders/${orderUid}/general`, {waitUntil: 'load'})
    }
    async openOrderDetailsByOrderUidAsSupervisor(url: string, orderUid: string, marketplaceUid: string){
        await this.page.goto(`${url}/marketplaces/${marketplaceUid}/orders/${orderUid}/general`, {waitUntil: 'load'})
    }
    async openWholesalesOrderDetailsByOrderUid(url: string, orderUid: string) {
        await this.page.goto(`${url}/shop/my-orders/${orderUid}`, { waitUntil: 'load' })
    }
}