import { test, expect } from '@playwright/test';
import BuyersPage from '../../pages/console/buyersPage';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import * as adminData from '../../fixtures/data/automation-seller-data.json';
import ConsoleCheckoutPage from '../../pages/console/checkoutPage';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';

test.describe("console-T110-buyer-details", () => {
    test.use({ storageState: './state-storage-files/supervisorStorageState.json' });
    test('open buyer details as Supervisor', async ({ page, isMobile }) => {
        const { consoleURL } = process.env;
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const buyersPage = new BuyersPage(page);
        const checkoutPage = new ConsoleCheckoutPage (page);

        await page.goto(`${consoleURL}`, { waitUntil: "load" });
        await sidebarNavigation.goToRecommender();
        const buyerData = await buyersPage.getFirstBuyerFromResponse();
        await buyersPage.openBuyerDetailsByText(buyerData.contact.formalName);
        await expect(buyersPage.emailField).toHaveValue(buyerData.contact.email);
        await expect(buyersPage.formalName).toHaveValue(buyerData.contact.formalName);
        await expect(checkoutPage.city).toHaveValue(buyerData.addresses[0]?.city ?? "");
        await expect(checkoutPage.addressLine1).toHaveValue(buyerData.addresses[0]?.streetLine1 ?? "");
    });
});

test.describe("console-T110-buyer-details", () => {
    test.use({ storageState: './state-storage-files/mpoStorageStage.json' });
    test('open buyer details as MPO', async ({ page, isMobile }) => {
        const { consoleURL } = process.env;
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const buyersPage = new BuyersPage(page);
        const marketplacesPage = new MarketplacesPage(page);
        const checkoutPage = new ConsoleCheckoutPage (page);

        await page.goto(`${consoleURL}`, { waitUntil: "load" });
        await sidebarNavigation.goToRecommender();
        const buyerData = await buyersPage.getFirstBuyerFromResponse();
        await buyersPage.openBuyerDetailsByText(buyerData.contact.formalName);
        await expect(buyersPage.emailField).toHaveValue(buyerData.contact.email);
        await expect(buyersPage.formalName).toHaveValue(buyerData.contact.formalName);
        await expect(checkoutPage.city).toHaveValue(buyerData.addresses[0]?.city ?? "");
        await expect(checkoutPage.addressLine1).toHaveValue(buyerData.addresses[0]?.streetLine1 ?? "");
    });
});

test.describe("console-T110-buyer-details", () => {
    test.use({ storageState: './state-storage-files/sellerStorageState.json' });
    test('open buyer details as Seller', async ({ page, isMobile }) => {
        const { consoleURL } = process.env;
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const buyersPage = new BuyersPage(page);
        const marketplacesPage = new MarketplacesPage(page);
        const checkoutPage = new ConsoleCheckoutPage (page);
        
        await page.goto(`${consoleURL}`, { waitUntil: "load" });
        await sidebarNavigation.goToRecommender();
        const buyerData = await buyersPage.getFirstBuyerFromResponse();
        await buyersPage.openBuyerDetailsByText(buyerData.contact.formalName);
        await expect(buyersPage.emailField).toHaveValue(buyerData.contact.email);
        await expect(buyersPage.formalName).toHaveValue(buyerData.contact.formalName);
        await expect(checkoutPage.city).toHaveValue(buyerData.addresses[0]?.city ?? "");
        await expect(checkoutPage.addressLine1).toHaveValue(buyerData.addresses[0]?.streetLine1 ?? "");
    });
});