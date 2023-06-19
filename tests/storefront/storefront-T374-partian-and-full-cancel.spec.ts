import { test, expect, Page } from '@playwright/test';
import LandingPage from '../../pages/storefront/landingPage';
import CheckoutPage from '../../pages/storefront/checkoutPage';
import SuccessfulPage from '../../pages/storefront/successfulPage';
import OrdersListAPIRequests from '../../api-helpers/external-api-helpers/externalOrdersListHelper';
import OrderItemsUpdateAPIRequests from '../../api-helpers/external-api-helpers/orderItemsBulkUpdateHelper';
import CartPage from '../../pages/storefront/cartPage';
import StripeCheckoutPage from '../../pages/stripe/stripeCheckoutPage';
import ProductDetailsPage from '../../pages/storefront/productDetailsPage';
import OrderHistoryPage from '../../pages/storefront/orderHistoryPage';
import RequestReturnPage from '../../pages/storefront/requestReturnPage';
import { apiOrderStatusDictionary } from '../../api-helpers/external-api-helpers/orderStatusHelper';
import * as storefrontData from '../../fixtures/data/storefront-data.json';
import { faker } from '@faker-js/faker';

const returnReasonText = 'Product not Ordered'
test.describe('storefront CEP-T374 order returns', () => {
    const { storefrontURL } = process.env;
    test.beforeEach(async ({ page }) => {
        const landingPage = new LandingPage(page, false);
        await page.goto(`${storefrontURL}`, { waitUntil: "load" } );
        await landingPage.acceptAllCookies();
    })

    test.use({ storageState: './state-storage-files/registredBuyerStorageState.json' });
    test('process full returns', async ({ page, request, isMobile }) => {
        const landingPage = new LandingPage(page, isMobile);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const stripe = new StripeCheckoutPage(page);
        const productDetailsPage = new ProductDetailsPage(page);
        const successfulPage = new SuccessfulPage(page);
        const orderHistoryPage = new OrderHistoryPage(page);
        const requestReturnPage = new RequestReturnPage(page);
        const ordersListAPIRequests = new OrdersListAPIRequests(request);
        const orderItemsUpdateAPIRequests = new OrderItemsUpdateAPIRequests(request);
        const trackingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });
        const shippingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });

        await landingPage.searchProduct(storefrontData.product1);
        await productDetailsPage.openProductDetails(storefrontData.product1);
        await productDetailsPage.AddToCard();
        await landingPage.openCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.privacyPolicy.check();
        await checkoutPage.proceedToPayment.click();
        const orderUid = await checkoutPage.proceedToPaymentGetOrderUid();
        await checkoutPage.waitForPaymentMethod();
        await stripe.makeStripePayment();
        await expect(page).toHaveURL(`${storefrontURL}/order-successful`);
        const orderItemUid = (await ordersListAPIRequests.getOrderItemUidByOrderUid(storefrontData.marketplaceUid, orderUid));
        const orderShippingReponse = await orderItemsUpdateAPIRequests.changeOrderShippingStatus(orderItemUid, trackingNumber, shippingNumber, apiOrderStatusDictionary.shipped)
        expect(orderShippingReponse[0].shipping_status).toEqual(apiOrderStatusDictionary.shipped);
        await page.goto(`${storefrontURL}/order-history/${orderUid}`, { waitUntil: 'load' })
        await orderHistoryPage.requestReturnButton.click();
        await requestReturnPage.plusButton.click();
        await requestReturnPage.chooseReturnReason(returnReasonText);
        await requestReturnPage.buttonReturnReason.click();
        await requestReturnPage.buttonModalReturnReason.click();
        const returnedOrder = await ordersListAPIRequests.waitForShippinStatus(storefrontData.marketplaceUid, orderUid, apiOrderStatusDictionary.returned);
        expect(await returnedOrder[0].order_items[0].shipping_status).toEqual(apiOrderStatusDictionary.returned);
        expect(await returnedOrder[0].total_shipping).toEqual(0);
        expect(await returnedOrder[0].total).toEqual(0);
        expect(await returnedOrder[0].subtotal).toEqual(0);
        expect(await returnedOrder[0].total_tax).toEqual(0);
    });

    test('process partial returns', async ({ page, request, isMobile }) => {
        const landingPage = new LandingPage(page, isMobile);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const stripe = new StripeCheckoutPage(page);
        const productDetailsPage = new ProductDetailsPage(page);
        const successfulPage = new SuccessfulPage(page);
        const orderHistoryPage = new OrderHistoryPage(page);
        const requestReturnPage = new RequestReturnPage(page);
        const ordersListAPIRequests = new OrdersListAPIRequests(request);
        const orderItemsUpdateAPIRequests = new OrderItemsUpdateAPIRequests(request);
        const trackingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });
        const shippingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });
        
        await landingPage.searchProduct(storefrontData.product1);
        await productDetailsPage.openProductDetails(storefrontData.product1);
        await productDetailsPage.AddToCard();
        await landingPage.searchProduct(storefrontData.product3);
        await productDetailsPage.openProductDetails(storefrontData.product3);
        await productDetailsPage.AddToCard();
        await landingPage.openCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.privacyPolicy.check();
        await checkoutPage.proceedToPayment.click();
        const orderUid = await checkoutPage.proceedToPaymentGetOrderUid();
        await checkoutPage.waitForPaymentMethod();
        await stripe.makeStripePayment();
        await expect(successfulPage.successfulNotificationText).toBeVisible();
        await expect(page).toHaveURL(`${storefrontURL}/order-successful`);
        const orderItemUid = (await ordersListAPIRequests.getOrderItemUidByOrderUid(storefrontData.marketplaceUid, orderUid));
        const orderShippingReponse = await orderItemsUpdateAPIRequests.changeOrderShippingStatus(orderItemUid, trackingNumber, shippingNumber, apiOrderStatusDictionary.shipped)
        expect(orderShippingReponse[0].shipping_status).toEqual(apiOrderStatusDictionary.shipped);
        await page.goto(`${storefrontURL}/order-history/${orderUid}`, { waitUntil: 'load' })
        await orderHistoryPage.requestReturnButton.click();
        await requestReturnPage.plusButton.click();
        await requestReturnPage.chooseReturnReason(returnReasonText);
        await requestReturnPage.buttonReturnReason.click();
        await requestReturnPage.buttonModalReturnReason.click();
        const returnedOrder = await ordersListAPIRequests.waitForShippinStatus(storefrontData.marketplaceUid, orderUid, apiOrderStatusDictionary.returned);
        const returnedItem = await ordersListAPIRequests.filterOrderItemByStatus(returnedOrder, apiOrderStatusDictionary.returned);
        const paidItem = await ordersListAPIRequests.filterOrderItemByStatus(returnedOrder, apiOrderStatusDictionary.paid);
        expect(await returnedItem.shipping_status).toEqual(apiOrderStatusDictionary.returned);
        expect(await paidItem.shipping_status).toEqual(apiOrderStatusDictionary.paid);
        expect(await returnedOrder[0].total_shipping).toEqual(0);
        expect(await returnedOrder[0].total).toBeGreaterThan(0);
        expect(await returnedOrder[0].subtotal).toBeGreaterThan(0);
        expect(await returnedOrder[0].total_tax).toBeGreaterThan(0);
        await page.goto(`${storefrontURL}/order-history/${orderUid}`, { waitUntil: 'load' })
        await expect( page.locator('div > span', { hasText: apiOrderStatusDictionary.paid })).toBeVisible();
        await expect( page.locator('div > span', { hasText: apiOrderStatusDictionary.returned })).toBeVisible();
    });
});