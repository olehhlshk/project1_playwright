import AccountsAPIRequests from "../../api-helpers/external-api-helpers/externalAccountsRequest helper";
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import MarketplacesPage from "../../pages/console/marketplacesPage";
import CommonHelperPages from "../../pages/console/commonHelperPages";
import WelcomeSellerPage from "../../pages/console/welcomeSellerPage";
import * as welcomePageData from '../../fixtures/onboarding_pages/welcomePageData.json'
import * as marketplaceData from '../../fixtures/data/data-for-receving-access-link.json'
const getLinkHelper = require('../../api-helpers/external-api-helpers/giveAccessLinkHelper.ts');
test('Login into the account using access link', async ({ request, page }) => {
    const { consoleURL } = process.env;
    const accountsRequest = new AccountsAPIRequests(request);
    const commonHelperPages = new CommonHelperPages(page);
    const welcomeSellerPage = new WelcomeSellerPage(page);
    const sellerEmail = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`;
    const sellerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const authUid = await accountsRequest.createAccountAndGetAuthUid(marketplaceData.markeplaceId, sellerName, sellerEmail);
    const link = await getLinkHelper.makeApiCallToGetALink(authUid);
    await expect(link.url).toMatch(`${consoleURL}`);
    await page.goto(link.url);
    await expect(page).toHaveURL(`${consoleURL}/create-storefront`);
    await expect(await commonHelperPages.findElementByText(welcomePageData.modalName)).toBeVisible();
    await welcomeSellerPage.enterStorefrontName(sellerName);
    await welcomeSellerPage.openWelcomePage();
    await expect(await commonHelperPages.findElementByText(welcomePageData.welcomeText)).toBeVisible();
    await welcomeSellerPage.openHomePage();
    await expect(await commonHelperPages.findElementByText(sellerName)).toBeVisible();
});