import { Locator, Page } from "@playwright/test";
export default class ConsoleOrdersPage{
    readonly orderRow: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.orderRow = page.locator('div:has-text("paid")').first();
    }
    async openOrderDetails(){
        await this.orderRow.click()
    }
    async interceptOrdersResponse(){
        return await Promise.all([
          this.page.waitForResponse(
            async (response) => {
              return (await response.body()).includes('"__typename":"OrdersList"');
            },
            { timeout: 10000 }
        ),
        ]);
      }
      async getFirstOrderFromResponse(){
        const [responseOrdersList] = await this.interceptOrdersResponse();
        const responseBodyOrdersList = JSON.parse(
          (await responseOrdersList.body()).toString()
        );
        return await responseBodyOrdersList.data.orders.nodes[0];
      }
      async findOrderOnThePage(text: string){
        return await this.page.getByText((`${text}`));
      }
}