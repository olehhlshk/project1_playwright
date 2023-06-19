import { Locator, Page } from "@playwright/test";
export default class ConsoleCheckoutPage{
    readonly fullName: Locator;
    readonly email: Locator;
    readonly phoneNumber: Locator;
    readonly addressLine1: Locator;
    readonly city: Locator;
    readonly zip: Locator;
    readonly state: Locator;
    readonly country: Locator;
    readonly proceedToPaymentButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.fullName = this.page.locator('input[name="fullName"]');
        this.email = this.page.locator('input[name="email"]');
        this.phoneNumber = this.page.locator('input[name="phone"]');
        this.addressLine1 = this.page.locator('input[name="streetLine1"]');
        this.city = this.page.locator('input[name="city"]');
        this.zip = this.page.locator('input[name="postalCode"]');
        this.state = this.page.locator('input[name="stateCode"]');
        this.country = this.page.locator('input[name="countryCode"]');
        this.proceedToPaymentButton = page.locator('button:has-text("Proceed to payment")');
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
    async proceedToPayment(){
        await this.proceedToPaymentButton.click();
    }
    async proceedToPaymentGetOrderUid() {
        const [responseReorder] = await Promise.all([
          this.page.waitForResponse(
            async (response) => {
              return (await response.body()).includes('"__typename":"Order"') && response.body().then((b) => b.includes("createOrder"));
            },
            { timeout: 10000 }
          ),
          //this.proceedToPayment.click({timeout: 1000})
        ]);
        const responseBodyReorder = JSON.parse(
          (await responseReorder.body()).toString()
        );
        return responseBodyReorder.data.createOrder.uid;
      }
}