import { test, expect } from '@playwright/test';
import LandingPage from '../../pages/storefront/landingPage';
import * as storefrontData from '../../fixtures/data/storefront-data.json';
import OrdersListAPIRequests from '../../api-helpers/external-api-helpers/externalOrdersListHelper';
import { apiOrderStatusDictionary } from '../../api-helpers/external-api-helpers/orderStatusHelper';
import OrderItemsUpdateAPIRequests from '../../api-helpers/external-api-helpers/orderItemsBulkUpdateHelper';
import StripeCheckoutPage from '../../pages/stripe/stripeCheckoutPage';
import CheckoutPage from '../../pages/storefront/checkoutPage';
import ProductDetailPage from '../../pages/storefront/productDetailsPage';
import CartPage from '../../pages/storefront/cartPage';
import SuccessfulPage from '../../pages/storefront/successfulPage';
import OrderHistoryPage from '../../pages/storefront/orderHistoryPage';
import { faker } from '@faker-js/faker';
test.use({ storageState: './state-storage-files/registredBuyerStorageState.json' });
test('Check order shipped status on storefront', async ({ page, request, isMobile }) => {
    const { storefrontURL } = process.env;
    const landingPage = new LandingPage(page, isMobile);
    const stripe = new StripeCheckoutPage(page);
    const checkoutPage = new CheckoutPage(page);
    const productDetailsPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const successfulPage = new SuccessfulPage(page);
    const ordersListAPIRequests = new OrdersListAPIRequests(request);
    const orderItemsUpdateAPIRequests = new OrderItemsUpdateAPIRequests(request);
    const orderHistoryPage = new OrderHistoryPage(page);
    const trackingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });
    const shippingNumber = faker.datatype.number({ min: 1000000, max: 9999999 });
    await page.goto(`${storefrontURL}`, { waitUntil: "load" });
    await landingPage.acceptAllCookies();
    await landingPage.searchProduct(storefrontData.product4);
    await productDetailsPage.openProductDetails(storefrontData.product4);
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
    const orderShippingResponse = await orderItemsUpdateAPIRequests.changeOrderShippingStatus(orderItemUid, trackingNumber, shippingNumber, apiOrderStatusDictionary.shipped)
    await expect(orderShippingResponse[0].shipping_status).toEqual(apiOrderStatusDictionary.shipped);
    await page.goto(`${storefrontURL}/order-history/${orderUid}`, { waitUntil: 'load' })
    await expect(await orderHistoryPage.checkOrderStatusOnThePage(apiOrderStatusDictionary.shipped)).toBeVisible();
})