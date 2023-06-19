import { test, expect } from '@playwright/test';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import ConsoleOrderHistoryPage from '../../pages/console/orderHistoryPage';
import LandingPage from '../../pages/storefront/landingPage';
import StripeCheckoutPage from '../../pages/stripe/stripeCheckoutPage';
import CheckoutPage from '../../pages/storefront/checkoutPage';
import CartPage from '../../pages/storefront/cartPage';
import * as buyerData from '../../fixtures/data/buyer-data.json'
import MarketplaceDetailsPage from '../../pages/console/marketplaceDetailsPage';
import ZipModalPage from '../../pages/storefront/zipModalPage';
import ProductDetailsPage from '../../pages/storefront/productDetailsPage';
import * as storefrontData from '../../fixtures/data/storefront-data.json';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';
import AllProductsPage from '../../pages/storefront/allProductsPage';

    let orderUid: string;
    test.beforeEach(async ({ page, isMobile }) => {
        const { storefrontURL } = process.env;
        const landingPage = new LandingPage(page, isMobile);
        const stripe = new StripeCheckoutPage(page);
        const checkoutPage = new CheckoutPage(page);
        const cartPage = new CartPage(page);
        const zipModal = new ZipModalPage(page);
        const productDetailsPage = new ProductDetailsPage(page);
        const allProductsPage = new AllProductsPage(page);

        await page.goto(`${storefrontURL}`, { waitUntil: "load" });
        await landingPage.acceptAllCookies();
        await zipModal.updateZip(buyerData.zip);
        await landingPage.searchProduct(storefrontData.product3);
        await productDetailsPage.openProductDetails(storefrontData.product3);
        await productDetailsPage.AddToCard();
        await page.goto(`${storefrontURL}`);
        await allProductsPage.addProductQtyByName(storefrontData.product1, 1);
        await landingPage.openBrandDetails();
        await landingPage.openCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.enterFullName(buyerData.name);
        await checkoutPage.enterEmail(buyerData.email);
        await checkoutPage.enterPhone(buyerData.phone);
        await checkoutPage.enterAddress(buyerData.addressLine);
        await checkoutPage.privacyPolicy.check();
        await checkoutPage.proceedToPayment.isEnabled();
        await checkoutPage.proceedToPayment.click();
        orderUid = await checkoutPage.proceedToPaymentGetOrderUid();
        await stripe.makeStripePayment();
        await expect(page).toHaveURL(`${storefrontURL}/order-successful`);
    })

    test.describe('Create order and check order list', () => {
        test.use({ storageState: './state-storage-files/sellerStorageState.json' });
        test('as a seller', async ({ page, isMobile }) => {
            const { consoleURL } = process.env;
            const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
            const marketplacesPage = new MarketplacesPage(page);
            const orderHistoryPageConsole = new ConsoleOrderHistoryPage(page);

            await page.goto(`${consoleURL}`, { waitUntil: 'load' });
            await sidebarNavigation.goToOrders();
            await orderHistoryPageConsole.openOrderDetailsByOrderUid(`${consoleURL}`, orderUid);
            await expect(orderHistoryPageConsole.subTotalPrice).toBeVisible();
            await expect(await orderHistoryPageConsole.getProductName(storefrontData.product1)).toBeVisible();
            await expect(await orderHistoryPageConsole.getProductName(storefrontData.product3)).toBeVisible();
        });
    });

    test.describe('Create order and check order list',() => {
        test.use({ storageState: './state-storage-files/mpoStorageStage.json' });
        test('as a MPO', async ({ page, isMobile }) => {
            const { consoleURL } = process.env;
            const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
            const marketplacesPage = new MarketplacesPage(page);
            const orderHistoryPageConsole = new ConsoleOrderHistoryPage(page);

            await page.goto(`${consoleURL}`, { waitUntil: 'load' });
            await sidebarNavigation.goToOrders();
            await orderHistoryPageConsole.openOrderDetailsByOrderUid(`${consoleURL}`, orderUid);
            await expect(orderHistoryPageConsole.subTotalPrice).toBeVisible();
            await expect(await orderHistoryPageConsole.getProductName(storefrontData.product1)).toBeVisible();
            await expect(await orderHistoryPageConsole.getProductName(storefrontData.product3)).toBeVisible();
        });
    });

    test.describe('Create order and check order list',() => {
        test.use({ storageState: './state-storage-files/supervisorStorageState.json' });
        test('as a Supervisor', async ({ page, isMobile }) => {
            const { consoleURL } = process.env;
            const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
            const marketplacesPage = new MarketplacesPage(page);
            const marketplaceDetailsPage = new MarketplaceDetailsPage(page);
            const orderHistoryPageConsole = new ConsoleOrderHistoryPage(page);
            
            await page.goto(`${consoleURL}`, { waitUntil: 'load' });
            await sidebarNavigation.goToMarketplaces();
            await marketplacesPage.selectMarketplaceByName(storefrontData.marketplaceName);
            await marketplaceDetailsPage.openOrders();
            await orderHistoryPageConsole.openOrderDetailsByOrderUidAsSupervisor(`${consoleURL}`, orderUid, `${storefrontData.marketplaceUid}`);
            await expect(orderHistoryPageConsole.subTotalPrice).toBeVisible();
            await expect(await orderHistoryPageConsole.getProductName(storefrontData.product1)).toBeVisible();
            await expect(await orderHistoryPageConsole.getProductName(storefrontData.product3)).toBeVisible();
        });
    });