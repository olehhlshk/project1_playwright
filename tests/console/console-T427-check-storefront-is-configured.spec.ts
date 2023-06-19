import { test, expect } from '@playwright/test';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import AccountsPage from '../../pages/console/accountsPage';
import CommonHelperPages from '../../pages/console/commonHelperPages';
import { faker } from '@faker-js/faker';
import WelcomeSellerPage from '../../pages/console/welcomeSellerPage';
import * as welcomePageData from '../../fixtures/onboarding_pages/welcomePageData.json';
import * as pageName from '../../fixtures/page_names/consolePageNames.json';
import * as adminData from '../../fixtures/data/automation-seller-data.json';
import * as emailData from '../../fixtures/email_notifications/emailData.json';
import * as emptyPageState from '../../fixtures/page_names/emptyStates.json';
import * as notificationToast from '../../fixtures/toast/toast-messages.json';
import * as signUpPageData from '../../fixtures/onboarding_pages/signUpPageData.json';
import * as cardData from '../../fixtures/home_page_cards/home_page_cards.json';
import AccountSettingsPage from '../../pages/console/settingsPage';
import SignUpSellerPage from '../../pages/console/signUpPage';
import HomePage from '../../pages/console/homePage';
import LandingPage from '../../pages/storefront/landingPage';
import { emailLinkFollower } from '../../pages/email_parser_helpers/extract_data_from_email.helper';
import { emailSubjectChecker } from '../../pages/email_parser_helpers/extract_data_from_email.helper';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';
test.use({ storageState: './state-storage-files/mpoStorageStage.json' });
test('Check that storefront was created for newly created account that logins with alias', async ({ page, isMobile }) => {
    const commonHelperPages = new CommonHelperPages(page);
    const welcomeSellerPage = new WelcomeSellerPage(page);
    const accountsPage = new AccountsPage(page, isMobile);
    const sideBarNavigation = new ConsoleSidebarNavigation(page, isMobile)
    const signUpPage = new SignUpSellerPage(page);
    const homePage = new HomePage(page, isMobile);
    const accountSettingPage = new AccountSettingsPage(page, isMobile);
    const { consoleURL } = process.env;
    const landingPage = new LandingPage(page, isMobile);
    const nameSeller = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const userEmail = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`;
    const aliasKey = faker.datatype.string(15);
    const aliasType = faker.datatype.string(15);
    await page.goto(`${consoleURL}`, { waitUntil: "load" });
    await sideBarNavigation.goToAccounts();
    await accountsPage.openAddAccountModal();
    await accountsPage.openFormForCreateSeller();
    await accountsPage.fillSellerForm(nameSeller, userEmail);
    await accountsPage.clickSubmitButton();
    await accountsPage.openAliasesTab();
    await expect(await commonHelperPages.findElementByText(emptyPageState.emptyStateOnThePage)).toBeVisible();
    await accountsPage.addAlias(aliasKey, aliasType)
    await expect(await commonHelperPages.getNotification(notificationToast.createdAliasToast)).toBeVisible();
    await page.evaluate(() => window.localStorage.clear());
    await page.evaluate(() => window.sessionStorage.clear());
    await page.goto(`${consoleURL}/landing/cb2`);
    await expect(page).toHaveURL(`${consoleURL}/landing/cb2`);
    await expect(await commonHelperPages.findElementByText(signUpPageData.modalName)).toBeVisible();
    await expect(await commonHelperPages.findElementByText(signUpPageData.signUpText)).toBeVisible();
    await signUpPage.fillIdentifier(aliasKey);
    await signUpPage.sendInviteLink();
    await expect(await commonHelperPages.findElementByText(signUpPageData.invitationSentTextOnModal)).toBeVisible();
    await emailLinkFollower.followLinkAndExtractData(userEmail, emailData.subjectInvitationEmail, emailData.invitationEmailButtonName, page)
    await expect(page).toHaveURL(`${consoleURL}/create-storefront`);
    await expect(await commonHelperPages.findElementByText(welcomePageData.modalName)).toBeVisible();
    await welcomeSellerPage.enterStorefrontName(nameSeller);
    await welcomeSellerPage.openWelcomePage();
    await expect(await commonHelperPages.findElementByText(welcomePageData.welcomeText)).toBeVisible();
    await welcomeSellerPage.openHomePage();
    await expect(await commonHelperPages.checkPageName(pageName.homePage)).toBeVisible();
    await homePage.openCardDetails(cardData.myStorefrontCard);
    await accountSettingPage.clickCopyButton();
    await expect(page.getByText('Copied')).toBeVisible();
    const url = await accountSettingPage.copyButton.getAttribute('data-for');
    await page.goto(`${url}`, { waitUntil: 'load' });
    await landingPage.acceptAllCookies();
    await expect((await landingPage.footerPoweredBy.innerText()).valueOf().toLowerCase()).toContain(nameSeller.toLowerCase());
    await expect(await emailSubjectChecker.checkEmailSubject(userEmail, emailData.subjectWelcomeEmail)).toEqual(emailData.subjectWelcomeEmail);
});