import { Locator, Page } from "@playwright/test";
export default class CommonHelperPages {
    readonly notificationToast: Locator;
    readonly elements: Locator;
    readonly chatBotCloseButton: Locator;
    readonly howToButton: Locator;
    readonly gotItButton: Locator;
    readonly nextButton: Locator;
    readonly greyScreenDuringTheGuide: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.notificationToast = page.locator('button[aria-label="close"]');
        this.chatBotCloseButton = page.locator('button[aria-label="Close message"]');
        this.howToButton = page.getByRole('button', { name: 'How To' });
        this.gotItButton = page.getByRole('button', { name: 'Got It!' });
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.greyScreenDuringTheGuide = page.locator('#react-joyride-portal div').first();
    }
    async getNotification(notification: string) {
        return await this.page.locator(`text=${notification}`);
    }
    async closeNotificationToast() {
        await this.notificationToast.click();
    }
    async checkPageName(text: string) {
        return await this.page.getByRole('heading', { name: `${text}` });
    }
    async findElementByText(text: string) {
        await this.page.locator(`text=${text}`).first();
        return await this.page.locator(`text=${text}`);
    }
    async goToNextHowToStep() {
        await this.nextButton.click();
        await this.page.waitForLoadState('load');
      }
      async startHowToGuide() {
        await this.howToButton.click();
        await this.page.waitForLoadState('load');
      }
      async finishHowToGuide() {
        await this.gotItButton.click();
        await this.page.waitForLoadState('load');
      }
}