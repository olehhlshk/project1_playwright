import { Locator, Page } from "@playwright/test";
import { RGBToHex } from "../../helpers/rgbToHex";
export default class AccountSettingsPage {
    readonly accountSettings: Locator;
    readonly storefrontConfiguration: Locator;
    readonly storefrontConfigurationPage: Locator;
    readonly binIcon: Locator;
    readonly saveButtonLogo: Locator;
    readonly logoImage: Locator;
    readonly settingSaveButton: Locator;
    readonly storefrontNameField: Locator;
    readonly primaryColorField: Locator;
    readonly copyButton: Locator;
    readonly colorPrimaryPicker: Locator;
    readonly logoLocator: Locator;
    readonly secondaryColorField: Locator;
    readonly colorSecondaryPicker: Locator;
    readonly adminName: Locator;
    readonly adminEmail: Locator;
    readonly stripeLoginButton: Locator;
    readonly connectButton: Locator;
    readonly adminAddress: Locator;
    readonly commissionsPayoutsButton: Locator;
    private isMobile: boolean | undefined;
    constructor(public page: Page, isMobile: boolean | undefined) {
        this.page = page;
        this.accountSettings = page.getByRole('button', { name: 'Account Settings' });
        this.storefrontConfiguration = page.getByRole('button', { name: 'Storefront Configuration' });
        this.storefrontConfigurationPage = page.getByText('General Settings');
        this.binIcon = page.locator('button[class="flex justify-center items-center text-primary hover:text-red-main w-6 h-6 bg-primary rounded-50 text-white-main"]');
        this.saveButtonLogo = page.locator('button[type="button"]', { hasText: 'Save' });
        this.logoImage = page.locator('[class="w-34"]');
        this.settingSaveButton = page.locator('button[type="submit"]', { hasText: 'Save' });
        this.storefrontNameField = page.locator('input[name="storefrontName"]');
        this.primaryColorField = page.getByRole('textbox').nth(1);
        this.copyButton = page.locator('button[data-tip="Copied"]');
        this.colorPrimaryPicker = page.locator('span[class="absolute w-7 h-7 m-1 rounded-sm"]').nth(0);
        this.colorSecondaryPicker = page.locator('span[class="absolute w-7 h-7 m-1 rounded-sm"]').nth(1);
        this.logoLocator = page.locator('input[type="file"]').first();
        this.secondaryColorField = page.getByRole('textbox').nth(2);
        this.adminName = page.locator('input[name="name"]');
        this.adminEmail = page.locator('input[name="email"]');
        this.stripeLoginButton = page.getByRole('button', { name: 'Stripe Log In' });
        this.adminAddress = page.locator('input[name="streetLine1"]');
        this.commissionsPayoutsButton = page.getByRole('button', { name: 'Commission Payouts' });
        //mobile specific
        this.isMobile = isMobile;
    }
    async accountSettingsTab() {
        await this.accountSettings.click();
    }
    async clickStorefrontConfigurationTab() {
        await this.storefrontConfiguration.click();
    }
    async addLogo() {
        await this.binIcon.click();
        await this.logoLocator.setInputFiles('./fixtures/images/14mb.jpeg');
    }
    async clickSaveLogoButton() {
        await this.saveButtonLogo.click();
    }
    async clickSettingSaveButton() {
        await Promise.all([
            this.page.waitForLoadState('load'),
            this.settingSaveButton.click(),
            ]);
    }
    async fillStorefrontNameField(name: string) {
        await this.storefrontNameField.clear();
        await this.storefrontNameField.type(name);
    }
    async setPrimaryColor(randomColor: string) {
        await this.primaryColorField.scrollIntoViewIfNeeded();
        await this.primaryColorField.clear();
        await this.primaryColorField.type(randomColor);
    }
    async setSecondaryColor(randomColor: string) {
        await this.secondaryColorField.scrollIntoViewIfNeeded();
        await this.secondaryColorField.clear();
        await this.secondaryColorField.type(randomColor);
    }
    async clickCopyButton() {
        await this.copyButton.click();
    }
    async getSavedColorForElement(element: Locator) {
        await element.isVisible();
        return RGBToHex(await element.evaluate((el) => {
            return getComputedStyle(el).background;
        }))
    }
    async openStripeConnectingModal() {
        await this.stripeLoginButton.click();
        await this.page.waitForLoadState('load');
    }
    async enterAddress(address: string) {
        await this.adminAddress.isVisible();
        await this.adminAddress.fill(address);
        await this.page.locator(`text=${address}`).nth(0).click();
    }
    async openPayoutMethodsPage(){
        await this.commissionsPayoutsButton.scrollIntoViewIfNeeded();
        await this.commissionsPayoutsButton.click();
        await this.page.waitForLoadState('load')
    }
}