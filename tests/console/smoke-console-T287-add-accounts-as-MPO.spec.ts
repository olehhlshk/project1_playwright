import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import AccountsPage from '../../pages/console/accountsPage';
import CommonHelperPages from '../../pages/console/commonHelperPages';
import * as notificationToast from '../../fixtures/toast/toast-messages.json';
import * as sellerData from '../../fixtures/data/automation-seller-data.json';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';

test.use({ storageState: './state-storage-files/mpoStorageStage.json' });
test('Smoke Admin add accounts as MPO', async ({ page, isMobile }) => {
    const accountsPage = new AccountsPage(page, isMobile);
    const commonHelperPage = new CommonHelperPages(page);
    const marketplacesPage = new MarketplacesPage(page);
    const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
    const { consoleURL } = process.env;
    const emailSeller = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`;
    const emailMPO = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`;
    const nameSeller = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const nameMPO = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const pendingStatus = "pending";
    const activeStatus = "active";
    
    await page.goto(`${consoleURL}`, { waitUntil: "load" });
    await expect(page).toHaveURL(`${consoleURL}/dashboard`);
    await sidebarNavigation.goToAccounts();
    await expect(page).toHaveURL(`${consoleURL}/accounts`);
    await accountsPage.openAddAccountModal()
    await expect(accountsPage.modalWindowAddAccount).toBeVisible();
    await accountsPage.openFormForCreateSeller()
    await expect(accountsPage.modalFormForCreateSeller).toBeVisible();
    await accountsPage.fillSellerForm(nameSeller, emailSeller);
    await accountsPage.clickSubmitButton();
    await commonHelperPage.getNotification(notificationToast.successfulAccountCreatedNotification);
    await commonHelperPage.closeNotificationToast();
    await expect(await commonHelperPage.checkPageName(nameSeller)).toBeVisible();
    await accountsPage.getUserStatusAfterCreated(pendingStatus);
    await sidebarNavigation.goToAccounts();
    await accountsPage.openAddAccountModal();
    await accountsPage.openFormForCreateMarketplaceOwner();
    await expect(accountsPage.modalWindowForCreateMarketplaceOwner).toBeVisible();
    await accountsPage.fillMarketplaceOwnerForm(nameMPO, emailMPO);
    await accountsPage.clickSubmitButton();
    await commonHelperPage.getNotification(notificationToast.successfulAccountCreatedNotification);
    await expect(await commonHelperPage.checkPageName(nameMPO)).toBeVisible();
    await accountsPage.getUserStatusAfterCreated(activeStatus);
});