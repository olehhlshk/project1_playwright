import { test, expect } from '@playwright/test';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import LandingPage from '../../pages/storefront/landingPage';
import * as buyerData from '../../fixtures/data/buyer-data.json'
import ZipModalPage from '../../pages/storefront/zipModalPage';
import * as storefrontData from '../../fixtures/data/storefront-data.json';
import * as notificationToast from '../../fixtures/toast/toast-messages.json';
import LoginModalPage from '../../pages/storefront/loginModalPage';
import { faker } from '@faker-js/faker';
import BuyersPage from '../../pages/console/buyersPage';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';

const buyerEmail = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`;
const buyerName = `${faker.name.firstName()} ${faker.name.lastName()}`;

    test.beforeEach(async ({ page, isMobile }) => {
        const { storefrontURL } = process.env;
        const landingPage = new LandingPage(page, isMobile);
        const zipModal = new ZipModalPage(page);
        const loginModal = new LoginModalPage(page);
        await page.goto(`${storefrontURL}`, { waitUntil: "load" });
        await landingPage.acceptAllCookies();
        await zipModal.updateZip(buyerData.zip);
        await landingPage.openLogInModal();
        await loginModal.openSignUpModal();
        await loginModal.fillBuyerSignUpModal(buyerName,buyerEmail);
        await loginModal.createAccount();
        await expect(await landingPage.getNotification(notificationToast.createdAccountToast)).toBeVisible();
        await loginModal.getMagicLink();
        await expect(await landingPage.getNotification(notificationToast.sentLoginLinkToast)).toBeVisible();
    })
    test.describe('Create buyer without purchase and check them in buyers list',() => {
        test.use({ storageState: './state-storage-files/sellerStorageState.json' });
        test('as seller', async ({ page, isMobile }) => {
            const { consoleURL } = process.env;
            const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
            const marketplacesPage = new MarketplacesPage(page);
            const buyersPage = new BuyersPage(page);
            await page.goto(`${consoleURL}`, { waitUntil: 'load' });
            await sidebarNavigation.goToRecommender();
            await expect(await buyersPage.findBuyerOnThePage(buyerName)).toBeVisible();
            await buyersPage.openBuyerDetailsByText(buyerName);
            await expect(buyersPage.emailField).toHaveValue(buyerEmail);
            await expect(buyersPage.formalName).toHaveValue(buyerName);
        });
    });
    test.describe('Create buyer without purchase and check them in buyers list', () => {
        test.use({ storageState: './state-storage-files/mpoStorageStage.json'  });
        test('as MPO', async ({ page, isMobile }) => {
            const { consoleURL } = process.env;
            const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
            const marketplacesPage = new MarketplacesPage(page);
            const buyersPage = new BuyersPage(page);
            await page.goto(`${consoleURL}`, { waitUntil: 'load' });
            await sidebarNavigation.goToRecommender();
            await expect(await buyersPage.findBuyerOnThePage(buyerName)).toBeVisible();
            await buyersPage.openBuyerDetailsByText(buyerName);
            await expect(buyersPage.emailField).toHaveValue(buyerEmail);
            await expect(buyersPage.formalName).toHaveValue(buyerName);
        });
    });
    test.describe('Create buyer without purchase and check them in buyers list', () => {
        test.use({ storageState: './state-storage-files/supervisorStorageState.json' });
        test('as supervisor', async ({ page, isMobile }) => {
            const { consoleURL } = process.env;
            const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
            const buyersPage = new BuyersPage(page);
            await page.goto(`${consoleURL}`, { waitUntil: 'load' });
            await sidebarNavigation.goToRecommender();
            await expect(await buyersPage.findBuyerOnThePage(buyerName)).toBeVisible();
            await buyersPage.openBuyerDetailsByText(buyerName);
            await expect(buyersPage.emailField).toHaveValue(buyerEmail);
            await expect(buyersPage.formalName).toHaveValue(buyerName);
        });
    });