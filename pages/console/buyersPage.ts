import { Locator, Page } from "@playwright/test";
export default class BuyersPage{
    readonly recommendationsButton: Locator;
    readonly emailField: Locator;
    readonly formalName: Locator;
    readonly buyersSearch: Locator;
    readonly howToButton: Locator;
    readonly gotItButton: Locator;
    readonly nextButton: Locator;
    readonly addBuyerButton: Locator;
    readonly submitButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.recommendationsButton = page.getByRole('button', { name: 'Recommendations' });
        this.emailField = page.locator('input[name="email"]');
        this.formalName = page.locator('input[name="name"]');
        this.buyersSearch = page.getByRole('textbox', { name: 'Search' });
        this.howToButton = page.getByRole('button', { name: 'How To' });
        this.gotItButton = page.getByRole('button', { name: 'Got It!' });
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.addBuyerButton = page.getByRole('button', { name: 'Add Buyer' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
    }
    async interceptBuyersResponse(){
      return await Promise.all([
        this.page.waitForResponse(
          async (response) => {
            return (await response.body()).includes('"__typename":"Buyer"');
          },
          { timeout: 10000 }
      ),
      ]);
    }
    async getFirstBuyerFromResponse(){
      const [responseBuyerList] = await this.interceptBuyersResponse();
      const responseBodyBuyersList = JSON.parse(
        (await responseBuyerList.body()).toString()
      );
      return await responseBodyBuyersList.data.buyers.nodes[0];
    }
    async openRecommendationsTab() {
        await Promise.all([
         this.recommendationsButton.click(),
         this.page.waitForLoadState('load')
        ])
    }
    async openBuyerDetailsByText(text: string){
         await this.page.getByText((`${text}`)).first();
         await this.page.getByText((`${text}`)).click();
    }
    async findBuyerOnThePage(name: string) {
      await this.page.locator(`text=${name}`).scrollIntoViewIfNeeded();
      return await this.page.locator(`text=${name}`);
    }
    async searchBuyerByText(text: string){
      await this.buyersSearch.fill(text)
      await this.page.waitForLoadState('domcontentloaded')
    }
    async clearBuyerSearchField(){
      await this.buyersSearch.clear(),
      await this.page.waitForLoadState('load')
    }
    async goNext() {
      await this.nextButton.click();
      await this.page.waitForLoadState('load');
    }
    async startRecommedationsGuide() {
      await this.howToButton.click();
      await this.page.waitForLoadState('load');
    }
  async finishRecommendationsGuide() {
      await this.gotItButton.click();
      await this.page.waitForLoadState('load');
    }
    async openAddBuyerModal() {
      await this.addBuyerButton.click();
      await this.page.waitForLoadState('load');
    }
    async fillNewBuyerData(name: string, email: string) {
      await this.formalName.fill(name);
      await this.emailField.fill(email);
    }
    async addNewBuyer(name: string, email: string) {
      await this.openAddBuyerModal();
      await this.fillNewBuyerData(name, email);
      await this.submitButton.click();
    }
}