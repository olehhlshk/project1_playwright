import { expect, Locator, Page, test } from "@playwright/test";
export default class RecommendationsPage{
    readonly removeRecommendationsButton: Locator;
    readonly submitNewRecommendationButton: Locator;
    readonly recommendButton: Locator;
    readonly nextButton: Locator;
    readonly recommendedProduct: Locator;
    readonly search: Locator;
    readonly searchedProductCheckbox: Locator;
    readonly emptyRecommendationsState : Locator;
    readonly emptyRecommendedList: Locator;
    readonly closeSearchResultsButton: Locator;
    readonly howToButton: Locator;
    readonly gotItButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.removeRecommendationsButton = page.locator('svg[class="text-gray-dark cursor-pointer"]').nth(0);
        this.submitNewRecommendationButton = page.getByRole('button', { name: 'Submit' });
        this.recommendButton = page.getByRole('button', { name: 'Recommend' }).first();
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.recommendedProduct = page.locator('div:nth-child(2) > .cursor-pointer > .text-primary');
        this.search = page.getByRole('textbox', { name: 'Search' });
        this.searchedProductCheckbox = page.locator('(//input[@type="checkbox"]/following-sibling::span)[1]').first();
        this.emptyRecommendationsState = this.page.getByText('This account does not own any Recommendations');
        this.emptyRecommendedList = this.page.getByText('There are no items to display');
        this.closeSearchResultsButton = page.locator('(//input[@id="search-list-input"]/following-sibling::div)[1]');
        this.howToButton = page.getByRole('button', { name: 'How To' });
        this.gotItButton = page.getByRole('button', { name: 'Got It!' });
    }
    async openRecommendations(name: string) {
            await this.page.getByText((`${name}`)).click(),
            await this.page.waitForLoadState('load')
    }
    async openRecommendationsForSeller(name: string) {
        await this.page.getByRole('cell', { name: `${name}` }).getByText(`${name}`).click()
        await this.page.waitForLoadState('load')
    }
    async getProductName(name: string){
        return await this.page.getByText(`${name}`).nth(0);
    }
    async checkAndRemoveRecommendations(){
        if(await this.emptyRecommendedList.isVisible()){
            console.log('no products to remove')
        } else {
            while(await this.emptyRecommendedList.isHidden()){
                await this.removeRecommendationsButton.click()
            };
            await this.submitRecommendation();
            await this.emptyRecommendationsState.isVisible();
         }
    }
    async removeRecommendedProduct() {
        await this.removeRecommendationsButton.waitFor();
        await this.removeRecommendationsButton.click();
        await this.page.waitForLoadState('load')
    }
    async submitRecommendation() {
        await this.submitNewRecommendationButton.click();
    }
    async configureRecommendations() {
        await this.recommendButton.click();
        await this.emptyRecommendedList.waitFor({state: "hidden"});
    }
    async addRecommendation() {
        await this.recommendButton.isVisible()
        await this.recommendButton.click();
    }
    async goNext() {
        await this.nextButton.click();
        await this.page.waitForLoadState('load');
    }
    async getProduct() {
        await this.recommendedProduct.click();
    }
    async searchText(text: string){
        await this.search.click();
        await this.search.fill(text)
        await this.page.waitForTimeout(2000);
    }
    async addProductToRecommendations() {
        await this.searchedProductCheckbox.isVisible();
        await this.searchedProductCheckbox.check();
        await this.page.waitForLoadState('load');
        await this.searchedProductCheckbox.isChecked();
    }
    async closeSearchResults() {
        await this.closeSearchResultsButton.click();
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
}