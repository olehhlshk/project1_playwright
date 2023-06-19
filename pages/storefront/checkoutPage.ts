import { Locator, Page } from "@playwright/test";
export default class CheckoutPage {
  readonly fullName: Locator;
  readonly email: Locator;
  readonly addressLine1: Locator;
  readonly city: Locator;
  readonly zipCode: Locator;
  readonly state: Locator;
  readonly privacyPolicy: Locator;
  readonly phone: Locator;
  readonly proceedToPayment: Locator;
  readonly paymentMethod: Locator;
  constructor(public page: Page) {
    this.page = page;
    this.fullName = page.locator('input[name="fullName"]');
    this.email = page.locator('input[name="email"]');
    this.addressLine1 = page.locator('input[name="addressLine1"]');
    this.city = page.locator('input[name="city"]');
    this.zipCode = page.locator('input[name="zipCode"]');
    this.state = page.locator('input[name="state"]');
    this.privacyPolicy = page.locator('input[name="privacyPolicy"]');
    this.phone = page.locator('input[name="phone"]');
    this.proceedToPayment = page.locator('button:has-text("Proceed to payment")');
    this.paymentMethod = page.getByText('Payment method');
  }
  async enterFullName(name: string) {
    await this.fullName.waitFor({ state: 'visible' });
    await this.fullName.fill(name);
  }
  async enterEmail(email: string) {
    await this.email.isVisible();
    await this.email.fill(email);
  }
  async enterAddress(address: string) {
    await this.addressLine1.isVisible();
    await this.addressLine1.fill(address);
    await this.page.locator(`text=${address}`).nth(0).click();
  }
  async enterPhone(phone: string) {
    await this.phone.isVisible();
    await this.phone.clear();
    await this.phone.fill(phone);
  }
  async enterZip(zipCode: string) {
    await this.zipCode.isVisible();
    await this.zipCode.fill(zipCode);
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
  async waitForPaymentMethod() {
    this.paymentMethod.first().waitFor({ state: "visible" });
  }
}