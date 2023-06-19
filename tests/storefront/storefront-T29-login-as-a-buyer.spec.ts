import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import LandingPage from '../../pages/storefront/landingPage';
import ZipModalPage from '../../pages/storefront/zipModalPage';
import LoginModalPage from '../../pages/storefront/loginModalPage';
import * as buyerData from '../../fixtures/data/buyer-data.json';
import * as emailData from '../../fixtures/email_notifications/emailData.json';
import * as loginModalData from '../../fixtures/login_modals_names/login_modals_name.json';
import * as accountEmail from '../../fixtures/mailosaur_data/mailosar_test_accounts.json';
import * as notificationToast from '../../fixtures/toast/toast-messages.json'
import CommonHelperPages from '../../pages/console/commonHelperPages';
import { emailLinkFollower } from '../../pages/email_parser_helpers/extract_data_from_email.helper';
import { emailCleaner } from '../../pages/email_parser_helpers/mailosaur_email_checker.helper';
import AccountDetailsPage from '../../pages/storefront/accountDetailsPage';

test('Login as a buyer', async ({ page,  isMobile }) => {
    const { storefrontURL } = process.env;
    const landingPage = new LandingPage(page, isMobile);
    const zipModal = new ZipModalPage(page);
    const loginModal = new LoginModalPage(page);
    const commonHelperPage = new CommonHelperPages(page);
    const accountDetailsPage = new AccountDetailsPage(page)
    
    await emailCleaner.deleteMessagesByEmail(accountEmail.buyerEmail);
    await page.goto(`${storefrontURL}`, { waitUntil: "load" });
    await landingPage.acceptAllCookies();
    await expect(zipModal.zip).toBeVisible();
    await zipModal.updateZip(buyerData.zip);
    await landingPage.openLogInModal();
    await expect(await commonHelperPage.findElementByText(loginModalData.storefrontLoginModalText)).toBeVisible();
    await loginModal.sendMagicLinkToLoginToStorefront(accountEmail.buyerEmail);
    await expect(await landingPage.getNotification(notificationToast.sentLoginLinkToast)).toBeVisible();
    await expect(await commonHelperPage.findElementByText(loginModalData.storefrontMagicLinkSentModalText)).toBeVisible();
    await emailLinkFollower.followLinkAndExtractData(accountEmail.buyerEmail, emailData.subjectLoginEmail, emailData.loginButtonName, page)
    await expect(page).toHaveURL(`${storefrontURL}`);
    await landingPage.openAccountDetails();
    await expect(await accountDetailsPage.getEmail()).toBe(accountEmail.buyerEmail);
});