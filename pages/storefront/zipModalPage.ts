import { Locator, Page } from "@playwright/test";
export default class ZipModalPage{
    readonly zip: Locator;
    readonly updateZipButton: Locator;
    readonly closeZipModalButton: Locator;
    private isMobile: boolean | undefined;
    constructor(public page: Page) {
        this.page = page;
        this.zip = page.locator('input[name="zipCode"]');
        this.updateZipButton = page.getByRole('button', { name: 'Update' });
        // this.closeZipModalButton = page.getByRole('button').first();
        this.closeZipModalButton = page.locator('svg[class="MuiSvgIcon-root"][viewBox="0 0 20 20"] path#Union_2');
        // /html/body/div[3]/div[3]/button
    }
    async updateZip(zip: string){
        await this.zip.waitFor({ state: 'visible' })
        await this.zip.fill(zip);
        await this.updateZipButton.click()
    }
    async closeZipModal() {
        await this.zip.waitFor({ state: 'visible' })
        await this.closeZipModalButton.waitFor({ state: 'visible' })
        await this.closeZipModalButton.click()
    }
}