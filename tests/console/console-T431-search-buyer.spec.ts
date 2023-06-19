import { test, expect } from '@playwright/test';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import * as buyerData from '../../fixtures/data/buyer-data.json'
import * as storefrontData from '../../fixtures/data/storefront-data.json';
import * as emptyPageData from '../../fixtures/page_names/emptyStates.json';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';
import BuyersPage from '../../pages/console/buyersPage';
import CommonHelperPages from '../../pages/console/commonHelperPages';

const buyerFromAnotherMarketplace = "Milanesa Viktare"

    test.describe('Search buyer', () => {
        test.use({ storageState: './state-storage-files/sellerStorageState.json' });
        test('as a seller', async ({ page, isMobile }) => {
            const { consoleURL } = process.env;
            const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
            const marketplacesPage = new MarketplacesPage(page);
            const buyersPage = new BuyersPage(page);
            const commonHelperPage = new CommonHelperPages(page);
            await page.goto(`${consoleURL}`, { waitUntil: 'load' });
            await sidebarNavigation.goToRecommender();
            await buyersPage.searchBuyerByText(buyerFromAnotherMarketplace);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerFromAnotherMarketplace);
            await expect(await commonHelperPage.findElementByText(emptyPageData.emptyStateOnThePage)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.name);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.name);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.email);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.email);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.shortPhone);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.shortPhone);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.buyerId);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.buyerId);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.addressLine);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.addressLine);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.openBuyerDetailsByText(buyerData.name);
            await expect(buyersPage.emailField).toHaveValue(buyerData.email);
        });
    });
    test.describe('Search buyer',() => {
        test.use({ storageState: './state-storage-files/mpoStorageStage.json' });
        test('as a MPO', async ({ page, isMobile }) => {
            const { consoleURL } = process.env;
            const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
            const marketplacesPage = new MarketplacesPage(page);
            const buyersPage = new BuyersPage(page);
            const commonHelperPage = new CommonHelperPages(page);
            await page.goto(`${consoleURL}`, { waitUntil: 'load' });
            await sidebarNavigation.goToRecommender();
            await buyersPage.searchBuyerByText(buyerFromAnotherMarketplace);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerFromAnotherMarketplace);
            await expect(await commonHelperPage.findElementByText(emptyPageData.emptyStateOnThePage)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.name);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.name);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.email);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.email);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.shortPhone);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.shortPhone);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.buyerId);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.buyerId);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.addressLine);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.addressLine);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.openBuyerDetailsByText(buyerData.name);
            await expect(buyersPage.emailField).toHaveValue(buyerData.email);
        });
    });
    test.describe('Search buyer',() => {
        test.use({ storageState: './state-storage-files/supervisorStorageState.json' });
        test('as a Supervisor', async ({ page, isMobile }) => {
            const { consoleURL } = process.env;
            const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
            const buyersPage = new BuyersPage(page);
            const commonHelperPage = new CommonHelperPages(page);
            await page.goto(`${consoleURL}`, { waitUntil: 'load' });
            await sidebarNavigation.goToRecommender();
            await buyersPage.searchBuyerByText(buyerFromAnotherMarketplace);
            await expect(await commonHelperPage.findElementByText(buyerFromAnotherMarketplace)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.name);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.name);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.email);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.email);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.shortPhone);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.shortPhone);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.buyerId);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.buyerId);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.clearBuyerSearchField();
            await buyersPage.searchBuyerByText(buyerData.addressLine);
            await expect(buyersPage.buyersSearch).toHaveValue(buyerData.addressLine);
            await expect(await commonHelperPage.findElementByText(buyerData.name)).toBeVisible();
            await buyersPage.openBuyerDetailsByText(buyerData.name);
            await expect(buyersPage.emailField).toHaveValue(buyerData.email);
        });
    });