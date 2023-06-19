import { Locator, Page } from "@playwright/test";
export default class ConsoleLoginPage{
    readonly loginEmailField: Locator;
    readonly sendMagicLinkButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.loginEmailField = page.locator('input[name="email"]');
        this.sendMagicLinkButton = page.getByRole('button', { name: 'Send Magic Link' });
    }
    async sendMagicLinkToLoginToConsole(email: string) {
        await this.loginEmailField.fill(email);
        await this.sendMagicLinkButton.click();
        await this.page.waitForLoadState('load')
    }
}