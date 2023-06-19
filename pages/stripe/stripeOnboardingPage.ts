import { Locator, Page } from "@playwright/test";
export default class StripeOnboardingPage {
    readonly testPhoneNumberLink: Locator;
    readonly continueSubmitButton: Locator;
    readonly useTestCodeButton: Locator;
    readonly employerIdentificationNumberField: Locator;
    readonly companySubmitButton: Locator;
    readonly yourLegalNameField: Locator;
    readonly yourLegalLastNameField: Locator;
    readonly jobTitleField: Locator;
    readonly monthDateBirthField: Locator;
    readonly dayDateBirthField: Locator;
    readonly yearDateBirthField: Locator;
    readonly addressPersonalDetailsField: Locator;
    readonly phoneBusinessNumberField: Locator;
    readonly continueButton: Locator;
    readonly continueWithNoOwnersButton: Locator;
    readonly useTestAccountButton: Locator;
    readonly agreeSubmitButton: Locator;
    readonly submitButton: Locator;
    readonly last4Ssn: Locator;
    readonly manuallyEnterBankDetailsButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.testPhoneNumberLink = page.locator('[data-test="phone-help-text-test-mode"]');
        this.continueSubmitButton = page.locator('button[data-test="phone-entry-submit"]');
        this.useTestCodeButton = page.locator('button[data-test="test-mode-fill-button"]');
        this.employerIdentificationNumberField = page.locator('[id="company[tax_id]"]');
        this.companySubmitButton = page.locator('[data-test="company-submit-button"]');
        // this.yourLegalNameField = page.getByPlaceholder('First name');
        this.yourLegalNameField = page.locator('id=first_name');
        // this.yourLegalLastNameField = page.getByPlaceholder('Last name');
        this.yourLegalLastNameField = page.locator('id=last_name')
        this.jobTitleField = page.locator('[id="relationship[title]"]');
        this.monthDateBirthField = page.locator('input[name="dob-month"]');
        this.dayDateBirthField = page.locator('input[name="dob-day"]');
        this.yearDateBirthField = page.locator('input[name="dob-year"]');
        this.addressPersonalDetailsField = page.locator('input[name="address"]');
        // this.phoneBusinessNumberField = page.locator('#phone');
        this.phoneBusinessNumberField = page.locator('id=phone');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        //this.continueButton = page.locator('[data-test="bizrep-submit-button"]');
        // this.continueWithNoOwnersButton = page.getByRole('button', { name: 'Continue with no owners' });
        this.continueWithNoOwnersButton = page.locator('[data-db-analytics-name="expressUnified_action_ownersContinueWithNoOwners_button"]')
        this.useTestAccountButton = page.locator('[data-test="test-mode-fill-button"]');
        this.agreeSubmitButton = page.locator('[data-test="requirements-index-done-button"]');
        this.submitButton = page.locator('button[tabindex="1"]', { hasText: 'Submit' });
        this.last4Ssn = page.locator('id=ssn_last_4');
        // add ssn = id="ssn_last_4"
        this.manuallyEnterBankDetailsButton = page.locator('[data-test="manualEntryLink"]');
    }
    async clickTestPhoneNumberLink() {
        await this.testPhoneNumberLink.click();
    }
    async clickContinueSubmitButton() {
        await this.continueSubmitButton.click();
    }
    async clickUseTestCodeButton() {
        await this.useTestCodeButton.click();
    }
    async enterEmployerIdentificationNumber(number: string) {
        await this.employerIdentificationNumberField.type(number);
    }
    async clickOnContinueButton() {
        await this.companySubmitButton.click();
    }
    async fillYourLegalNamePersonalDetailsField(name: string) {
        await this.yourLegalNameField.isVisible();
        await this.yourLegalNameField.fill(name);
    }
    async fillYourLegalLastNamePersonalDetailsField(name: string) {
        await this.yourLegalLastNameField.clear();
        await this.yourLegalLastNameField.fill(name);
    }
    async enterJobTitle(title: string) {
        await this.jobTitleField.type(title);
    }
    async fillDateBirthPersonalDetailsField(month: string, day: string, year: string) {
        await this.monthDateBirthField.fill(month);
        await this.dayDateBirthField.fill(day);
        await this.yearDateBirthField.fill(year);
    }
    async fillAddressPersonalDetailsField(shortAddress: string, fullAddress: string) {
        // await this.addressPersonalDetailsField.clear();
        await this.addressPersonalDetailsField.type(shortAddress);
        await this.page.getByText(fullAddress).click();
    }
    async enterPhoneBusinessNumber(phoneNumber: string) {
        await this.phoneBusinessNumberField.scrollIntoViewIfNeeded();
        await this.phoneBusinessNumberField.clear();
        await this.phoneBusinessNumberField.type(phoneNumber);
    }
    async fillTestSocialSecurityNumberField(socialNumber: string) {
        await this.last4Ssn.scrollIntoViewIfNeeded()
        await this.last4Ssn.fill(socialNumber);
        // await this.page.getByPlaceholder(socialNumber).click();
        // await this.page.getByPlaceholder(socialNumber).type(socialNumber);
    }
    async clickContinueButton() {
        await this.continueButton.click();
        await this.page.waitForLoadState();
    }
    async clickContinueWithNoOwnersButton() {
        await this.continueWithNoOwnersButton.waitFor({state: 'visible'});
        await this.continueWithNoOwnersButton.click();
        await this.page.waitForLoadState('load');
        // add awaitforLoad
    }
    async clickUseTestAccountButton() {
        await this.useTestAccountButton.click();
        await this.page.waitForLoadState();
    }
    async clickAgreeSubmitButton() {
        await this.agreeSubmitButton.click();
        if (await this.submitButton.isVisible()){
            await this.submitButton.click();
        }
        await this.page.waitForNavigation();
    }
    async clickOnSubmitButton() {
        await this.submitButton.click();
    }
    async openManuallyEnteringBankDetailsPopup() {
        await this.manuallyEnterBankDetailsButton.click();
        await this.page.waitForLoadState();
    }
}