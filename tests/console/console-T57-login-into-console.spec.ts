import { test, expect } from '@playwright/test';
import CommonHelperPages from '../../pages/console/commonHelperPages';
import * as emailData from '../../fixtures/email_notifications/emailData.json';
import * as loginModalData from '../../fixtures/login_modals_names/login_modals_name.json';
import * as accountEmail from '../../fixtures/mailosaur_data/mailosar_test_accounts.json';
import * as pageName from '../../fixtures/page_names/consolePageNames.json';
import { emailLinkFollower } from '../../pages/email_parser_helpers/extract_data_from_email.helper';
import ConsoleLoginPage from '../../pages/console/loginPage';
import { emailCleaner } from '../../pages/email_parser_helpers/mailosaur_email_checker.helper';

test('Login into console', async ({ page }) => {
    const commonHelperPages = new CommonHelperPages(page);
    const loginPage = new ConsoleLoginPage(page)
    const { consoleURL } = process.env;

    await emailCleaner.deleteMessagesByEmail(accountEmail.supervisorEmail);
    await page.goto(`${consoleURL}/login`, { waitUntil: "load" });
    await expect(await commonHelperPages.findElementByText(loginModalData.consoleLoginModalText)).toBeVisible();
    await loginPage.sendMagicLinkToLoginToConsole(accountEmail.supervisorEmail);
    await expect(await commonHelperPages.findElementByText(loginModalData.consoleMagicLinkSentModalText)).toBeVisible();
    await emailLinkFollower.followLinkAndExtractData(accountEmail.supervisorEmail, emailData.subjectLoginEmail, emailData.loginButtonName, page)
    await expect(await commonHelperPages.checkPageName(pageName.dashboardPage)).toBeVisible();
});