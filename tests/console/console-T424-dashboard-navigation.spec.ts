import { test, expect } from '@playwright/test';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import * as sellerData from '../../fixtures/data/automation-seller-data.json';
import * as pageName from '../../fixtures/page_names/consolePageNames.json';
import * as cardData from '../../fixtures/home_page_cards/home_page_cards.json';
import CommonHelperPages from '../../pages/console/commonHelperPages';
import HomePage from '../../pages/console/homePage';
import BuyersPage from '../../pages/console/buyersPage';
import CatalogPage from '../../pages/console/catalogPage';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';
test.use({ storageState: './state-storage-files/sellerStorageState.json' });
test('check navigation on seller dashboard', async ({ page, context, isMobile }) => {
  const { consoleURL } = process.env;
  const { storefrontURL } = process.env;
  const marketplacesPage = new MarketplacesPage(page);
  const homePage = new HomePage(page, isMobile);
  const buyersPage = new BuyersPage(page);
  const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
  const commonHelperPages = new CommonHelperPages(page);
  const catalogPage = new CatalogPage(page);
  await page.goto(`${consoleURL}`, { waitUntil: "load" });
  await expect(page).toHaveURL(`${consoleURL}/home`);
  await expect(await commonHelperPages.checkPageName(pageName.homePage)).toBeVisible();
  await expect(await homePage.findCardBoxOnThePage(cardData.myStorefrontCard)).toBeVisible();
  await expect(await homePage.findCardBoxOnThePage(cardData.dashboardCard)).toBeVisible();
  await expect(await homePage.findCardBoxOnThePage(cardData.recommenderCard)).toBeVisible();
  await expect(await homePage.findCardBoxOnThePage(cardData.ordersCard)).toBeVisible();
  await expect(await homePage.findCardBoxOnThePage(cardData.catalogCard)).toBeVisible();
  await homePage.openCardDetails(cardData.recommenderCard);
  const buyerData = await buyersPage.getFirstBuyerFromResponse();
  await expect(await buyersPage.findBuyerOnThePage(buyerData.contact.formalName)).toBeVisible();
  await expect(await commonHelperPages.checkPageName(pageName.recommenderPage)).toBeVisible();
  await sidebarNavigation.goToHome();
  await expect(await commonHelperPages.checkPageName(pageName.homePage)).toBeVisible();
  await homePage.openCardDetails(cardData.catalogCard);
  const brandData = await catalogPage.getFirstBrandFromResponse();
  await expect(await catalogPage.findBrandOnThePage(brandData.brand.name)).toBeVisible();
  await expect(await commonHelperPages.checkPageName(pageName.catalogPage)).toBeVisible();
  await sidebarNavigation.goToHome();
  await homePage.openCardDetails(cardData.ordersCard);
  await expect(await commonHelperPages.checkPageName(pageName.ordersPage)).toBeVisible();
  await sidebarNavigation.goToHome();
  await homePage.openCardDetails(cardData.myStorefrontCard);
  await expect(await homePage.findCardBoxOnThePage(cardData.storefrontURLCard)).toBeVisible();
  await sidebarNavigation.goToHome();
  await homePage.openCardDetails(cardData.dashboardCard);
  await expect(await commonHelperPages.checkPageName(pageName.dashboardPage)).toBeVisible();
  await sidebarNavigation.goToHome();
  const copiedLink = await homePage.copyStorefrontLink();
  // if (isMobile){
  //   await expect(page.getByText('Copied')).toBeHidden();
  // }
  // else{
  //   await expect(page.getByText('Copied')).toBeVisible();
  // }
  await expect(await homePage.findTextOnModal(cardData.QRCodeCard)).toBeVisible();
  // const pagePromise = context.waitForEvent('page');
  // await page.goto(`${copiedLink}`, { waitUntil: 'load' });
  // const newPage = await pagePromise;
  // await newPage.waitForLoadState();
  // await expect(page).toHaveURL(`${storefrontURL}`);
});