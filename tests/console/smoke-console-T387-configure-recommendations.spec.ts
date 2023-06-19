import { test, expect } from '@playwright/test';
import BuyersPage from '../../pages/console/buyersPage';
import CommonHelperPages from '../../pages/console/commonHelperPages';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import RecommendationsPage from '../../pages/console/recommendationsPage';
import * as buyerData from '../../fixtures/data/buyer-data.json';
import * as product from '../../fixtures/data/storefront-data.json';
import * as adminData from '../../fixtures/data/automation-seller-data.json';
import * as notificationToast from '../../fixtures/toast/toast-messages.json';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';

test.describe("console-T387-smoke", () => {
    test.use({ storageState: './state-storage-files/supervisorStorageState.json' });
    test('configure recommendations as a Supervisor', async ({ page, isMobile}) => {
        const { consoleURL } = process.env;
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const buyersPage = new BuyersPage(page);
        const recommendationsPage = new RecommendationsPage(page);
        const commonHelperPages = new CommonHelperPages(page);
        const marketplacesPage = new MarketplacesPage(page);

        await page.goto(`${consoleURL}`, { waitUntil: "load" });
        await sidebarNavigation.goToRecommender();
        await page.goto(`${consoleURL}/buyers/${buyerData.recommendationsBuyer1}/general`);
        await buyersPage.openRecommendationsTab();
        if (isMobile){
            await page.close();
        }
        else{
        if(await recommendationsPage.emptyRecommendationsState.isVisible()){
            console.log('no recommendations')
        } else {
            await recommendationsPage.openRecommendations(adminData.sellerName);
            await recommendationsPage.configureRecommendations();
            //await recommendationsPage.checkAndRemoveRecommendations();
        };
        //await expect(await recommendationsPage.emptyRecommendationsState).toBeVisible();
        //await recommendationsPage.addRecommendation();
        //await marketplacesPage.selectMarketplaceByName(adminData.marketplaceName);
        //await recommendationsPage.goNext();
        //await recommendationsPage.searchText(adminData.sellerName);
        //await recommendationsPage.openRecommendations(adminData.sellerName);
        //await recommendationsPage.goNext();
        await recommendationsPage.searchText(product.product4);
        await recommendationsPage.addProductToRecommendations();
        await recommendationsPage.closeSearchResults();
        await recommendationsPage.searchText(product.product1);
        await recommendationsPage.addProductToRecommendations();
        await recommendationsPage.closeSearchResults();
        await recommendationsPage.submitRecommendation()
        await expect(await commonHelperPages.getNotification(notificationToast.successfulRecommendationCreatedNotification)).toBeVisible();
        //await recommendationsPage.openRecommendations(adminData.sellerName);
        await expect(await recommendationsPage.getProductName(product.product4)).toBeVisible();
        await expect(await recommendationsPage.getProductName(product.product1)).toBeVisible();
        }
    });
});

test.describe("console-T387-smoke", () => {
    test.use({ storageState: './state-storage-files/mpoStorageStage.json' });
    test('configure recommendations as MPO', async ({ page, isMobile }) => {
        const { consoleURL } = process.env;
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const buyersPage = new BuyersPage(page);
        const recommendationsPage = new RecommendationsPage(page);
        const commonHelperPages = new CommonHelperPages(page);
        const marketplacesPage = new MarketplacesPage(page);

        await page.goto(`${consoleURL}`, { waitUntil: "load" });
        await sidebarNavigation.goToRecommender();
        await page.goto(`${consoleURL}/buyers/${buyerData.recommendationsBuyer2}/general`);
        await buyersPage.openRecommendationsTab();
        if (isMobile){
            await page.close();
        }
        else{
        if(await recommendationsPage.emptyRecommendationsState.isVisible()){
            console.log('no recommendations')
        } else {
            await recommendationsPage.openRecommendations(adminData.sellerName);
            await recommendationsPage.configureRecommendations();
            //await recommendationsPage.checkAndRemoveRecommendations();
        };
       // await expect(await recommendationsPage.emptyRecommendationsState).toBeVisible();
        //await recommendationsPage.addRecommendation();
        //await recommendationsPage.searchText(adminData.sellerName);
        //await recommendationsPage.openRecommendations(adminData.sellerName);
        //await recommendationsPage.goNext();
        await recommendationsPage.searchText(product.product4);
        await recommendationsPage.addProductToRecommendations();
        await recommendationsPage.closeSearchResults();
        await recommendationsPage.searchText(product.product1);
        await recommendationsPage.addProductToRecommendations();
        await recommendationsPage.submitRecommendation()
        await expect(await commonHelperPages.getNotification(notificationToast.successfulRecommendationCreatedNotification)).toBeVisible();
        //await recommendationsPage.openRecommendations(adminData.email);
        await expect(await recommendationsPage.getProductName(product.product4)).toBeVisible();
        await expect(await recommendationsPage.getProductName(product.product1)).toBeVisible();
        }
    });
});

test.describe("console-T387-smoke", () => {
    test.use({ storageState: './state-storage-files/sellerStorageState.json' });
    test('configure recommendations as Seller', async ({ page, isMobile }) => {
        const { consoleURL } = process.env;
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const buyersPage = new BuyersPage(page);
        const recommendationsPage = new RecommendationsPage(page);
        const commonHelperPages = new CommonHelperPages(page);
        const marketplacesPage = new MarketplacesPage(page);
        
        await page.goto(`${consoleURL}`, { waitUntil: "load" });
        await sidebarNavigation.goToRecommender();
        await page.goto(`${consoleURL}/buyers/${buyerData.recommendationsBuyer3}/general`);
        await buyersPage.openRecommendationsTab();
        if (isMobile){
            await page.close();
        }
        else {
        if(await recommendationsPage.emptyRecommendedList.isVisible()){
            console.log('no recommendations')
        } else {
            await recommendationsPage.configureRecommendations();
            //await recommendationsPage.checkAndRemoveRecommendations();
        };
        //await expect(await recommendationsPage.emptyRecommendedList).toBeVisible()
        //await recommendationsPage.addRecommendation();
        await recommendationsPage.searchText(product.product4);
        await recommendationsPage.addProductToRecommendations();
        await recommendationsPage.closeSearchResults();
        await recommendationsPage.searchText(product.product1);
        await recommendationsPage.addProductToRecommendations();
        await recommendationsPage.submitRecommendation()
        await expect(await commonHelperPages.getNotification(notificationToast.successfulRecommendationCreatedNotification)).toBeVisible();
        await expect(await recommendationsPage.getProductName(product.product4)).toBeVisible();
        await expect(await recommendationsPage.getProductName(product.product1)).toBeVisible();
    }
    });
});