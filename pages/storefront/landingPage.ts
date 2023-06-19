import { Locator, Page } from "@playwright/test";
export default class LandingPage {
    readonly acceptAllCookiesButton: Locator;
    readonly storefrontNameButton: Locator;
    readonly brandButton: Locator;
    readonly categoriesButton: Locator;
    readonly logInButton: Locator;
    readonly accountButton: Locator;
    readonly homeButton: Locator;
    readonly search: Locator;
    readonly profileButton: Locator;
    readonly cartButton: Locator;
    readonly recommendationsHeader: Locator;
    readonly carouselButton: Locator;
    readonly cartIcon: Locator;
    //mobile specific
    private isMobile: boolean | undefined;
    readonly logInButtonMobile: Locator;
    readonly hamburgerButton: Locator;
    //footer - move to separate file later
    readonly footerPoweredBy: Locator;
    readonly header: Locator;
    readonly allBrandsButton: Locator;
    readonly homeButtonMobile: Locator;
    constructor(public page: Page, isMobile: boolean | undefined) {
        this.page = page;
        this.acceptAllCookiesButton = page.locator('id=onetrust-accept-btn-handler');
        this.storefrontNameButton = page.getByRole('link', { name: 'Automation Storefront Automation Storefront' });
        this.brandButton = page.getByRole('link', { name: 'Holika Holika Holika Holika' });
        this.categoriesButton = page.getByRole('link', { name: 'Categories' });
        this.logInButton = page.locator('xpath=/html/body/div[1]/header/div[2]/div/div/div[3]/button[2]');
        this.footerPoweredBy = page.locator('xpath=//*[@id="root"]/footer/div/div/div/div/span')
        this.accountButton = page.getByRole('banner').getByRole('button').nth(1);
        this.homeButton = page.locator('//a[@id="nav-home"]//span[1]')
        this.search = page.getByPlaceholder('Search for anything');
        this.cartButton = page.locator('#subnav-cart');
        this.recommendationsHeader = page.getByRole('heading', { name: 'Recommendations' });
        this.carouselButton = page.getByRole('button', { name: 'next' }).nth(2);
        this.cartIcon = page.getByRole('option', { name: '180 comb - cutting 180 comb - cutting Bath & Body $11.00' }).getByRole('button');
        //mobile specific
        this.isMobile = isMobile;
        this.hamburgerButton = page.getByRole('button', { name: 'open drawer' });
        this.logInButtonMobile = page.getByRole('button', { name: 'Login' });
        this.profileButton = page.getByRole('link', { name: 'Profile' });
        this.header = page.locator('div').filter({ hasText: 'HomeDealsSupport' }).nth(1);
        this.allBrandsButton = page.getByRole('link', { name: 'Brands' });
        this.homeButtonMobile = page.getByRole('button', { name: 'Home' });
    }
    async acceptAllCookies() {
        await this.acceptAllCookiesButton.waitFor()
        await this.acceptAllCookiesButton.click()
    }
    async openBrandDetails() {
        await this.brandButton.click({ force: true })
        await this.page.waitForLoadState('load')
        await this.page.waitForURL('**\/brands/*')
    }
    async openCategories() {
        await this.categoriesButton.click({ force: true })
        await this.page.waitForURL('**\/categories');
    }
    async openLogInModal() {
        if (this.isMobile) {
            await this.hamburgerButton.click();
            await this.logInButtonMobile.click();
        }
        else {
            await this.logInButton.click()
        }
    }
    async getNotification(notification: string) {
        return await this.page.locator(`text=${notification}`);
    }
    async openAccountDetails() {
        if (this.isMobile) {
            await this.hamburgerButton.click();
            await this.profileButton.click();
            await this.page.waitForURL('**\/account-details');
        }
        else {
            await this.accountButton.waitFor({ state: 'visible' })
            await this.accountButton.click({ force: true })
            await this.page.waitForURL('**\/account-details');
        }
    }
    async openHomePage() {
        if (this.isMobile) {
            await this.hamburgerButton.click();
            await this.homeButtonMobile.click();
            await this.page.waitForLoadState('load')
        }
        else {
            await this.homeButton.click({ force: true })
            await this.page.waitForLoadState('load')
        }
    }
    async searchProduct(productName: string) {
        await this.search.click({ force: true });
        await this.page.getByPlaceholder('Search for anything').fill(productName)
    }
    async openCart() {
        if (this.isMobile) {
            await this.cartButton.click()
            await this.page.waitForLoadState('load')
            await this.page.waitForURL('**\/cart');
        }
            await this.cartButton.click({ force: true })
            await this.page.waitForLoadState('load')
            await this.page.waitForURL('**\/cart');
    }
    async carousel() {
        await this.carouselButton.click({ force: true })
        //this need to be refactored to make somethint reusable in the future
    }
    async openAllBrands() {
        if (this.isMobile) {
            await this.allBrandsButton.click();
            await this.page.waitForURL('**\/brands');
        }
        else {
            await this.allBrandsButton.click({ force: true })
            await this.page.waitForURL('**\/brands');
        }
    }
    async interceptBrandsResponseOnStorefront(){
        return await Promise.all([
          this.page.waitForResponse(
            async (response) => {
              return (await response.body()).includes('"__typename":"BrandsList"');
            },
            { timeout: 10000 }
        ),
        ]);
      }
    async getFirstBrandNameFromResponse(){
        const [responseFeaturedBrandsList] = await this.interceptBrandsResponseOnStorefront();
        const responseBodyFeaturedBrandsList = JSON.parse(
          (await responseFeaturedBrandsList.body()).toString()
        );
        return await responseBodyFeaturedBrandsList.data.brands.nodes[0].name;
    }
    async interceptProductsResponseOnStorefront(){
        return await Promise.all([
          this.page.waitForResponse(
            async (response) => {
              return (await response.body()).includes('"__typename":"StorefrontItemsList"');
            },
            { timeout: 10000 }
        ),
        ]);
      }
    async getFirstProductNameFromResponse(){
        const [responseProductsList] = await this.interceptProductsResponseOnStorefront();
        const responseBodyProductsList = JSON.parse(
          (await responseProductsList.body()).toString()
        );
        return await responseBodyProductsList.data.items.nodes[0].name;
    }
}