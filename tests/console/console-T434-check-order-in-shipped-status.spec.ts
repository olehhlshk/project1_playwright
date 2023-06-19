import { test, expect } from '@playwright/test';
import LandingPage from '../../pages/storefront/landingPage';
import * as buyerData from '../../fixtures/data/buyer-data.json';
import * as storefrontData from '../../fixtures/data/storefront-data.json';
import OrdersListAPIRequests from '../../api-helpers/external-api-helpers/externalOrdersListHelper';
import { apiOrderStatusDictionary } from '../../api-helpers/external-api-helpers/orderStatusHelper';
import OrderItemsUpdateAPIRequests from '../../api-helpers/external-api-helpers/orderItemsBulkUpdateHelper';
import StripeCheckoutPage from '../../pages/stripe/stripeCheckoutPage';
import CheckoutPage from '../../pages/storefront/checkoutPage';
import ProductDetailPage from '../../pages/storefront/productDetailsPage';
import CartPage from '../../pages/storefront/cartPage';
import OrderHistoryPage from '../../pages/storefront/orderHistoryPage';
import ZipModalPage from '../../pages/storefront/zipModalPage';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import ConsoleOrderHistoryPage from '../../pages/console/orderHistoryPage';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';
import MarketplaceDetailsPage from '../../pages/console/marketplaceDetailsPage';
import { faker } from '@faker-js/faker';
let orderUid: string;
test.beforeEach(async ({ page, request, isMobile }) => {
    const { storefrontURL } = process.env;
    const landingPage = new LandingPage(page, isMobile);
    const stripe = new StripeCheckoutPage(page);
    const checkoutPage = new CheckoutPage(page);
    const cartPage = new CartPage(page);
    const zipModal = new ZipModalPage(page);
    const productDetailsPage = new ProductDetailPage(page);
    const ordersListAPIRequests = new OrdersListAPIRequests(request);
    const orderItemsUpdateAPIRequests = new OrderItemsUpdateAPIRequests(request);
    const trackingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });
    const shippingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });
    await page.goto(`${storefrontURL}`, { waitUntil: "load" });
    await landingPage.acceptAllCookies();
    await zipModal.updateZip(buyerData.zip);
    await landingPage.searchProduct(storefrontData.product3);
    await productDetailsPage.openProductDetails(storefrontData.product3);
    await productDetailsPage.AddToCard();
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
    const orderItemUid = (await ordersListAPIRequests.getOrderItemUidByOrderUid(storefrontData.marketplaceUid, orderUid));
    const orderShippingResponse = await orderItemsUpdateAPIRequests.changeOrderShippingStatus(orderItemUid, trackingNumber, shippingNumber, apiOrderStatusDictionary.shipped)
    await expect(orderShippingResponse[0].shipping_status).toEqual(apiOrderStatusDictionary.shipped);
})
test.describe('Check order in shipped status', () => {
    test.use({ storageState: './state-storage-files/sellerStorageState.json' });
    test('in console as a seller', async ({ page, isMobile }) => {
        const { consoleURL } = process.env;
        const orderHistoryPage = new OrderHistoryPage(page);
        const marketplacesPage = new MarketplacesPage(page);
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const orderHistoryPageConsole = new ConsoleOrderHistoryPage(page);
        await page.goto(`${consoleURL}`, { waitUntil: 'load' });
        await sidebarNavigation.goToOrders();
        await orderHistoryPageConsole.openOrderDetailsByOrderUid(`${consoleURL}`, orderUid);
        await expect(await orderHistoryPage.checkOrderStatusOnThePage(apiOrderStatusDictionary.shipped)).toBeVisible();
    });
});
test.describe('Check order in shipped status', () => {
    test.use({ storageState: './state-storage-files/mpoStorageStage.json' });
    test('in console as a MPO', async ({ page, isMobile}) => {
        const { consoleURL } = process.env;
        const orderHistoryPage = new OrderHistoryPage(page);
        const marketplacesPage = new MarketplacesPage(page);
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const orderHistoryPageConsole = new ConsoleOrderHistoryPage(page);
        await page.goto(`${consoleURL}`, { waitUntil: 'load' });
        await sidebarNavigation.goToOrders();
        await orderHistoryPageConsole.openOrderDetailsByOrderUid(`${consoleURL}`, orderUid);
        await expect(await orderHistoryPage.checkOrderStatusOnThePage(apiOrderStatusDictionary.shipped)).toBeVisible();
    });
});
test.describe('Check order in shipped status', () => {
    test.use({ storageState: './state-storage-files/supervisorStorageState.json' });
    test('in console as a supervisor', async ({ page, isMobile }) => {
        const { consoleURL } = process.env;
        const orderHistoryPage = new OrderHistoryPage(page);
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const marketplacesPage = new MarketplacesPage(page);
        const marketplaceDetailsPage = new MarketplaceDetailsPage(page);
        const orderHistoryPageConsole = new ConsoleOrderHistoryPage(page);
        await page.goto(`${consoleURL}`, { waitUntil: 'load' });
        await sidebarNavigation.goToMarketplaces();
        await marketplacesPage.selectMarketplaceByName(storefrontData.marketplaceName);
        await marketplaceDetailsPage.openOrders();
        await orderHistoryPageConsole.openOrderDetailsByOrderUidAsSupervisor(`${consoleURL}`, orderUid, `${storefrontData.marketplaceUid}`);
        await expect(await orderHistoryPage.checkOrderStatusOnThePage(apiOrderStatusDictionary.shipped)).toBeVisible();
    });
});