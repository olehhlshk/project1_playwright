import { Locator, Page } from "@playwright/test";
export default class ProductDetailPage{
    readonly regularPrice: Locator;
    readonly discountedPrice: Locator;
    readonly addToCartButton: Locator;
    readonly cartButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.regularPrice = page.getByText(/^\$/).nth(0);
        this.discountedPrice = page.getByText(/^\$/).nth(1);
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
        this.cartButton = page.locator("xpath=/html/body/div[1]/header/div[2]/div/div/div[3]/a/button")
    }
    async openProductDetails(name: string) {
        await this.page.getByRole('link', { name }).first().click()
        await this.page.waitForLoadState('load')
    }
    async AddToCard(){
        await this.addToCartButton.click()
    }
    async openCart(){
        await this.cartButton.click()
    }
}