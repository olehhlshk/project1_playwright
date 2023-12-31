import { test, expect } from '@playwright/test';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import * as sellerData from '../../fixtures/data/automation-seller-data.json';
import * as notificationToast from '../../fixtures/toast/toast-messages.json';
import CommonHelperPages from '../../pages/console/commonHelperPages';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';
import BuyersPage from '../../pages/console/buyersPage';
import { faker } from '@faker-js/faker';
test.use({ storageState: './state-storage-files/sellerStorageState.json' });
test('Add buyer from the console', async ({ page, isMobile }) => {
  const { consoleURL } = process.env;
  const marketplacesPage = new MarketplacesPage(page);
  const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
  const commonHelperPages = new CommonHelperPages(page);
  const buyersPage = new BuyersPage(page);
  const buyerEmail = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`;
  const buyerFullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
  await page.goto(`${consoleURL}`, { waitUntil: "load" });
  await expect(page).toHaveURL(`${consoleURL}/home`);
  await sidebarNavigation.goToRecommender();
  await buyersPage.addNewBuyer(buyerFullName, buyerEmail);
  await expect(await commonHelperPages.findElementByText(notificationToast.buyerCreatedToast)).toBeVisible();
  await expect(await commonHelperPages.findElementByText(buyerFullName)).toBeVisible();
  await buyersPage.openBuyerDetailsByText(buyerFullName);
  await expect(buyersPage.emailField).toHaveValue(buyerEmail);
});