import { expect, Locator, Page } from "@playwright/test";
import { faker } from '@faker-js/faker';
export default class AccountsPage {
    readonly addAccountButton: Locator;
    readonly modalWindowAddAccount: Locator;
    readonly buttonFormCreateSeller: Locator;
    readonly modalFormForCreateSeller: Locator;
    readonly modalFormForCreateMarketplaceOwner: Locator;
    readonly modalWindowForCreateMarketplaceOwner: Locator;
    readonly fieldNameCreateSellerAccount: Locator;
    readonly fieldEmailCreateSellerAccount: Locator;
    readonly fieldNameCreateMPOAccount: Locator;
    readonly fieldEmailCreateMPOAccount: Locator;
    readonly buttonSubmitCreateAccount: Locator;
    readonly newUserOnPage: Locator;
    readonly sellersTab: Locator;
    readonly storefrontTabSellerPage: Locator;
    readonly inviteButton: Locator;
    readonly aliasTab: Locator;
    readonly addAliasButton: Locator;
    readonly aliasTypeField: Locator;
    readonly aliasKeyField: Locator;
    readonly allowToOnboardCheckbox: Locator;
    readonly submitAliasButton: Locator;
    readonly accountCatalogButton: Locator;
    readonly featuredBrandButton: Locator;
    readonly featuredProductButton: Locator;
    readonly accountsSearch: Locator;
    private isMobile: boolean | undefined;
    constructor(public page: Page, isMobile: boolean | undefined) {
        this.page = page;
        this.addAccountButton = page.getByRole('button', { name: 'Add Account' });
        this.modalWindowAddAccount = page.locator('text="Choose Account Role"');
        this.buttonFormCreateSeller = page.locator('button >> text=seller');
        this.modalFormForCreateSeller = page.locator('text="Create Seller Account"');
        this.modalFormForCreateMarketplaceOwner = page.locator('button >> text=marketplace owner');
        this.modalWindowForCreateMarketplaceOwner = page.locator('text="Create MPO Account"');
        this.fieldNameCreateSellerAccount = page.locator('input[name="name"]');
        this.fieldEmailCreateSellerAccount = page.locator('input[name="email"]');
        this.fieldNameCreateMPOAccount = page.locator('input[name="name"]');
        this.fieldEmailCreateMPOAccount = page.locator('input[name="email"]');
        this.buttonSubmitCreateAccount = page.locator('button[type="submit"]');
        this.sellersTab = page.getByText('sellers');
        this.storefrontTabSellerPage = page.getByRole('button', { name: 'Storefront' });
        this.aliasTab = page.getByRole('button', { name: 'Identity Aliases' });
        this.inviteButton = page.getByRole('button', { name: 'Send Invite' });
        this.addAliasButton = page.getByRole('button', { name: 'Add Alias' });
        this.aliasKeyField = page.locator('input[name="key"]');
        this.aliasTypeField = page.locator('input[name="type"]');
        this.allowToOnboardCheckbox = page.locator('(//input[@type="checkbox"]/following-sibling::span)[1]');
        this.submitAliasButton = page.locator('//button[contains(@class,"order-first md:order-none")]');
        this.accountCatalogButton = page.getByRole('button', { name: 'Catalog' });
        this.featuredBrandButton = page.getByRole('button', { name: 'Featured Brand' });
        this.featuredProductButton = page.getByRole('button', { name: 'Featured Product' });
        this.accountsSearch = page.getByRole('textbox', { name: 'Search' });
        //mobile specific
        this.isMobile = isMobile;
    }
    async openAddAccountModal() {
        await this.addAccountButton.click();
    }
    async openFormForCreateSeller() {
        await this.buttonFormCreateSeller.click();
    }
    async openFormForCreateMarketplaceOwner() {
        await this.modalFormForCreateMarketplaceOwner.click();
    }
    async fillSellerForm(name: string = faker.name.fullName(), email: string = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`) {
        await this.fieldNameCreateSellerAccount.fill(name);
        await this.fieldEmailCreateSellerAccount.fill(email);
    }
    async fillMarketplaceOwnerForm(name: string = faker.name.fullName(), email: string = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`) {
        await this.fieldNameCreateMPOAccount.fill(name);
        await this.fieldEmailCreateMPOAccount.fill(email);
    }
    async clickSubmitButton() {
        await this.buttonSubmitCreateAccount.click();
        await this.page.waitForLoadState('load');
    }
    async checkNewUserOnPage(name: string) {
        await expect(this.page.locator('span', { hasText: name })).toBeVisible({ visible: true });
    }
    async getUserStatusAfterCreated(status: string) {
        if (this.isMobile){
            await expect(this.page.locator(`span >> text=${status}`)).toBeHidden();
        }
        else {
            await expect(this.page.locator(`span >> text=${status}`)).toBeVisible();
        }
    }
    async clickSellersTab() {
        await this.sellersTab.click();
        await this.page.waitForLoadState('load');
    }
    async clickStorefrontTabOnSellerPage() {
        await this.storefrontTabSellerPage.click();
    }
    async clickSendInviteButton() {
        await this.inviteButton.click();
    }
    async openAliasesTab() {
        await this.aliasTab.click();
        await this.page.waitForLoadState('load');
    }
    async openAddAliasModal() {
        await this.addAliasButton.click();
        await this.page.waitForLoadState('load');
    }
    async fillFieldsInAliasModal(aliasKey: string, aliasType: string) {
        await this.aliasKeyField.fill(aliasKey);
        await this.aliasTypeField.fill(aliasType);
    }
    async allowToOnboard() {
        await this.allowToOnboardCheckbox.check();
        await this.allowToOnboardCheckbox.isChecked();
    }
    async submitAddingAlias() {
        await this.submitAliasButton.click();
        await this.page.waitForLoadState('load');
    }
    async addAlias(aliasKey: string, aliasType: string) {
        await this.openAddAliasModal();
        await this.fillFieldsInAliasModal(aliasKey, aliasType);
        await this.allowToOnboard();
        await this.submitAddingAlias();
    }
    async interceptCreateAccountResponse(){
        return await Promise.all([
          this.page.waitForResponse(
            async (response) => {
              return (await response.body()).includes('"__typename":"Account"');
            },
            { timeout: 10000 }
        ),
        ]);
      }
    async getAccountUidFromCreationResponse(){
        const [responseCreateAccount] = await this.interceptCreateAccountResponse();
        const responseBodyCreateAccount = JSON.parse(
            (await responseCreateAccount.body()).toString()
        );
        return await responseBodyCreateAccount.data.createAccount.uid;
      }
      async openAccountDetailsPage(name: string) {
        await this.page.getByText(name).click();
        await this.page.waitForLoadState('load');
    }
    async openAccountCatalog() {
        await this.accountCatalogButton.click();
        await this.page.waitForLoadState('load');
    }
    async openFeaturedBrandTab() {
        await this.featuredBrandButton.click();
        await this.page.waitForLoadState('load');
    }
    async openFeaturedProductTab() {
        await this.featuredProductButton.click();
        await this.page.waitForLoadState('load');
    }
    async searchAccountByName(name: string){
        await this.accountsSearch.fill(name)
        await this.page.waitForLoadState('load')
      }
}