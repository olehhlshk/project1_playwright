import { test, expect, Page } from '@playwright/test';
import LandingPage from '../../pages/storefront/landingPage';
import CheckoutPage from '../../pages/storefront/checkoutPage';
import SuccessfulPage from '../../pages/storefront/successfulPage';
import OrdersListAPIRequests from '../../api-helpers/external-api-helpers/externalOrdersListHelper';
import OrderItemsUpdateAPIRequests from '../../api-helpers/external-api-helpers/orderItemsBulkUpdateHelper';
import OrderItemsCancelAPIRequests from '../../api-helpers/external-api-helpers/orderItemsBulkCancelHelper';
import CartPage from '../../pages/storefront/cartPage';
import StripeCheckoutPage from '../../pages/stripe/stripeCheckoutPage';
import ProductDetailsPage from '../../pages/storefront/productDetailsPage';
import { apiOrderStatusDictionary } from '../../api-helpers/external-api-helpers/orderStatusHelper'
import * as storefrontData from '../../fixtures/data/storefront-data.json'
import { faker } from '@faker-js/faker';

test.describe('console-CEP-2062', () => {
    test.use({ storageState: './state-storage-files/registredBuyerStorageState.json' });
    test('Admin-full-cancel', async ({ page, request }) => {
        const landingPage = new LandingPage(page, false);
        const { storefrontURL } = process.env;
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const stripe = new StripeCheckoutPage(page);
        const productDetailsPage = new ProductDetailsPage(page);
        const successfulPage = new SuccessfulPage(page);
        const ordersListAPIRequests = new OrdersListAPIRequests(request);
        const orderItemsUpdateAPIRequests = new OrderItemsUpdateAPIRequests(request);
        const orderItemsCancelAPIRequests = new OrderItemsCancelAPIRequests(request);
        const quantityOrderItemsCancel = 1;
        const trackingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });
        const shippingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });

        await page.goto(`${storefrontURL}`, { waitUntil: "load" });
        await landingPage.acceptAllCookies();
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
        await expect(successfulPage.successfulNotificationText).toBeVisible();
        await expect(page).toHaveURL(`${storefrontURL}/order-successful`);
        const orderItemUid = (await ordersListAPIRequests.getOrderItemUidByOrderUid(storefrontData.marketplaceUid, orderUid));
        const orderShippingReponse = await orderItemsUpdateAPIRequests.changeOrderShippingStatus(orderItemUid, trackingNumber, shippingNumber, apiOrderStatusDictionary.communicated)
        await expect(orderShippingReponse[0].shipping_status).toEqual(apiOrderStatusDictionary.communicated);
        await orderItemsCancelAPIRequests.cancelOrder(orderItemUid, quantityOrderItemsCancel)
        const сanceledOrder = (await ordersListAPIRequests.getOrdersByUid(storefrontData.marketplaceUid, orderUid));
        await expect(await сanceledOrder[0].order_items[0].shipping_status).toEqual(apiOrderStatusDictionary.short_shipped);
        await expect(await сanceledOrder[0].total_shipping).toEqual(0);
    });
    
    test('Admin-partial-cancel', async ({ request, page }) => {
        const landingPage = new LandingPage(page, false);
        const { storefrontURL } = process.env;
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const stripe = new StripeCheckoutPage(page);
        const productDetailsPage = new ProductDetailsPage(page);
        const successfulPage = new SuccessfulPage(page);
        const ordersListAPIRequests = new OrdersListAPIRequests(request);
        const orderItemsUpdateAPIRequests = new OrderItemsUpdateAPIRequests(request);
        const orderItemsCancelAPIRequests = new OrderItemsCancelAPIRequests(request);
        const quantityOrderItemsCancel = 1;
        const trackingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });
        const shippingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });

        await page.goto(`${storefrontURL}`, { waitUntil: "load" });
        await landingPage.acceptAllCookies();
        await landingPage.searchProduct(storefrontData.product1);
        await productDetailsPage.openProductDetails(storefrontData.product1);
        await productDetailsPage.AddToCard();
        await landingPage.searchProduct(storefrontData.product2);
        await productDetailsPage.openProductDetails(storefrontData.product2);
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
        const orderShippingReponse = await orderItemsUpdateAPIRequests.changeOrderShippingStatus(orderItemUid, trackingNumber, shippingNumber, apiOrderStatusDictionary.communicated)
        await expect(orderShippingReponse[0].shipping_status).toEqual(apiOrderStatusDictionary.communicated);
        await orderItemsCancelAPIRequests.cancelOrder(orderItemUid, quantityOrderItemsCancel);
        const сanceledOrder = await ordersListAPIRequests.getOrdersByUid(storefrontData.marketplaceUid, orderUid);
        const shortShippedItem = await ordersListAPIRequests.filterOrderItemByStatus(сanceledOrder, apiOrderStatusDictionary.short_shipped);
        const paidItem = await ordersListAPIRequests.filterOrderItemByStatus(сanceledOrder, apiOrderStatusDictionary.paid);
        await expect(await shortShippedItem.shipping_status).toEqual(apiOrderStatusDictionary.short_shipped);
        await expect(await paidItem.shipping_status).toEqual(apiOrderStatusDictionary.paid);
        await page.goto(`${storefrontURL}/order-history/${orderUid}`, { waitUntil: "domcontentloaded" });
        await expect(successfulPage.paidStatusLocator).toHaveText(apiOrderStatusDictionary.paid);
        await expect(successfulPage.shortShippedStatusLocator).toHaveText('short Shipped');
    });
})