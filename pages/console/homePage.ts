import { Locator, Page } from "@playwright/test";
export default class HomePage{
    readonly copyButton: Locator;
    readonly QRCodeButton: Locator;
    readonly closeQRModalButton: Locator;
    private isMobile: boolean | undefined;
    constructor(public page: Page, isMobile: boolean | undefined) {
        this.page = page;
        this.copyButton = page.locator('.flex > .pr-2').first();
        this.QRCodeButton = page.locator('button[class="h-10 w-10 lg:w-40 border border-primary bg-primary text-white-main text-xs hover:bg-blue-hover py-2 text-center font-bold rounded-full lg:rounded-md"]');
        this.closeQRModalButton = page.getByRole('dialog').locator('svg');
        //mobile specific
        this.isMobile = isMobile;
    }
    async findCardBoxOnThePage(text: string) {
        return await this.page.getByRole('link',  { name: `${text}` });
    }
    async openCardDetails(text: string) {
        await this.page.getByRole('link',  { name: `${text}` }).click();
        await this.page.waitForLoadState('load');
    }
    async copyStorefrontLink(){
        if (this.isMobile){
            await this.copyButton.isHidden();
        }
        else {
        await this.copyButton.click();
        await this.page.waitForLoadState('load');
        }
    }
    async openQRCode(){
        await this.QRCodeButton.click();
        await this.page.waitForLoadState('load');
    }
    async closeQRModal(){
        await this.closeQRModalButton.click();
        await this.page.waitForLoadState('load');
    }
    async findTextOnModal(text: string) {
        return await this.page.locator(`text=${text}`);
    }
    async followTheStorefrontLink(text: string) {
         await this.page.getByRole('link',  { name: `${text}` }).click();
    }
}