import { Locator, Page } from "@playwright/test";
export default class AccountDetailsPage{
    readonly orderHistoryButton: Locator;
    readonly recommendationsButton: Locator;
    readonly fullName: Locator;
    readonly email: Locator;
    readonly phoneNumber: Locator;
    readonly addressLine1: Locator;
    readonly city: Locator;
    readonly zip: Locator;
    readonly state: Locator;
    readonly country: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.orderHistoryButton = page.getByRole('link', { name: 'Order History' });
        this.recommendationsButton = page.getByRole('link', { name: 'Recommendations' });
        this.fullName = this.page.locator('input[name="fullName"]');
        this.email = this.page.locator('input[name="email"]');
        this.phoneNumber = this.page.locator('input[name="phone"]');
        this.addressLine1 = this.page.locator('input[name="addressLine1"]');
        this.city = this.page.locator('input[name="city"]');
        this.zip = this.page.locator('input[name="zipCode"]');
        this.state = this.page.locator('input[name="state"]');
        this.country = this.page.locator('input[name="country"]');
    }
    async getFullName(){
        return await this.fullName.inputValue();
    }
    async getEmail(){
        return await this.email.inputValue();
    }
    async getPhoneNumber(){
        return await this.phoneNumber.inputValue();
    }
    async getAddressLine1(){
        return await this.addressLine1.inputValue();
    }
    async getCity(){
        return await this.city.inputValue();
    }
    async getZip(){
        return await this.zip.inputValue();
    }
    async getState(){
        return await this.state.inputValue();
    }
    async getCountry(){
        return await this.country.inputValue();
    }
    async openOrderHistory(){
        await this.orderHistoryButton.waitFor({state:'visible'});
        await this.orderHistoryButton.click()
        await this.page.waitForLoadState('load')
    }
    async openRecommendations(){
        await this.recommendationsButton.click()
    }
}