import { Locator, Page } from "@playwright/test";
export default class StripeCheckoutPage {
    readonly cardNumber: Locator;
    readonly cardExpiry: Locator;
    readonly cardCvc: Locator;
    readonly billingName: Locator;
    readonly zipCode: Locator;
    readonly country: Locator;
    readonly submitButton: Locator;
    readonly enableStripePass: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.cardNumber = page.locator('id=cardNumber');
        this.cardExpiry = page.locator('id=cardExpiry');
        this.cardCvc = page.locator('id=cardCvc');
        this.billingName = page.locator('id=billingName');
        this.zipCode = page.locator('id=billingPostalCode');
        this.country = page.locator('id=billingCountry');
        this.submitButton = page.locator('[data-testid="hosted-payment-submit-button"]');
        this.enableStripePass = page.locator('id=enableStripePass');
    }
    async makeStripePayment() {
        await this.page.waitForLoadState('load');
        await this.cardNumber.waitFor({ state: 'visible' });
        await this.country.selectOption({ value: 'US' });
        await this.cardExpiry.fill('1225');
        await this.cardCvc.fill('123');
        await this.billingName.fill('Doe');
        await this.zipCode.fill('12345');
        if (await this.enableStripePass.isVisible()) {
            if (await this.enableStripePass.isChecked()){
            await this.enableStripePass.uncheck();
            }
        }
        await this.cardNumber.fill('4111 1111 1111 1111');
        await this.submitButton.click();
        await this.page.waitForNavigation({ waitUntil: 'load' });
    }
}