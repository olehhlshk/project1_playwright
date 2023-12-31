import { test, expect } from '@playwright/test';
import CommonHelperPages from '../../pages/console/commonHelperPages';
import LandingPage from '../../pages/storefront/landingPage';
import * as RestrictedItem from '../../fixtures/data/storefront-data.json';
import * as BuyerData from '../../fixtures/data/buyer-data.json';
import * as Notification from '../../fixtures/toast/toast-messages.json'
import AllProductsPage from '../../pages/storefront/allProductsPage';
import ZipModalPage from '../../pages/storefront/zipModalPage';
import CartPage from '../../pages/storefront/cartPage';
import CheckoutPage from '../../pages/storefront/checkoutPage';
import AccountDetailsPage from '../../pages/storefront/accountDetailsPage';
import ProductDetailPage from '../../pages/storefront/productDetailsPage';

test.describe("storefront-T410", () => {
    test.use({ storageState: './state-storage-files/registredBuyerStorageState.json' });
    test('check restricted brands and products are not available for the signed in client', async ({ page, isMobile }) => {
        const { storefrontURL } = process.env;
        const landingPage = new LandingPage(page, isMobile);
        const allProductsPage = new AllProductsPage(page);
        const accountDetailsPage = new AccountDetailsPage(page);

        await page.goto(`${storefrontURL}`, { waitUntil: "load" });
        await landingPage.acceptAllCookies();
        await landingPage.searchProduct(RestrictedItem.restrictedBrand);
        await expect(allProductsPage.emptyPage).toBeVisible();
        await page.goto(`${storefrontURL}`);
        await expect(await allProductsPage.findItemOnThePage(RestrictedItem.restrictedProduct)).toBeHidden();
        await expect(await allProductsPage.findItemOnThePage(RestrictedItem.restrictedBrand)).toBeHidden();
        await landingPage.searchProduct(RestrictedItem.restrictedProduct);
        await expect(allProductsPage.emptyPage).toBeVisible();
        await landingPage.openHomePage();
        await landingPage.openAllBrands();
        await expect(await allProductsPage.findItemOnThePage(RestrictedItem.restrictedBrand)).toBeHidden();
        await landingPage.openBrandDetails();
        await expect(await allProductsPage.findItemOnThePage(RestrictedItem.restrictedBrand)).toBeHidden();
        await landingPage.openAccountDetails();
        await accountDetailsPage.openRecommendations();
        await expect(await allProductsPage.findItemOnThePage(RestrictedItem.restrictedProduct)).toBeHidden();
    });
});
test.describe("storefront-T410", () => {
    test('check non-registred buyer doesn`t see restricted products when enters the zip code that matches with rules', async ({ page, isMobile }) => {
        const { storefrontURL } = process.env;
        const landingPage = new LandingPage(page, isMobile);
        const allProductsPage = new AllProductsPage(page);
        const zipModalPage = new ZipModalPage(page);

        await page.goto(`${storefrontURL}`, { waitUntil: "load" });
        await landingPage.acceptAllCookies();
        await zipModalPage.updateZip(BuyerData.zip);
        await landingPage.searchProduct(RestrictedItem.restrictedBrand);
        await expect(allProductsPage.emptyPage).toBeVisible();
        await page.goto(`${storefrontURL}`);
        await expect(await allProductsPage.findItemOnThePage(RestrictedItem.restrictedProduct)).toBeHidden();
        await expect(await allProductsPage.findItemOnThePage(RestrictedItem.restrictedBrand)).toBeHidden();
        await landingPage.searchProduct(RestrictedItem.restrictedProduct);
        await expect(allProductsPage.emptyPage).toBeVisible();
        await landingPage.openHomePage();
        await landingPage.openAllBrands();
        await expect(await allProductsPage.findItemOnThePage(RestrictedItem.restrictedBrand)).toBeHidden();
        await landingPage.openBrandDetails();
        await expect(await allProductsPage.findItemOnThePage(RestrictedItem.brand)).toBeHidden();
    });
});
test.describe("storefront-T410", () => {
    test('check non-registred buyer is not able to buy a product when enter the zip on the checkout page', async ({ page, isMobile }) => {
        const { storefrontURL } = process.env;
        const landingPage = new LandingPage(page, isMobile);
        const allProductsPage = new AllProductsPage(page);
        const zipModalPage = new ZipModalPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const commonHelperPage = new CommonHelperPages(page);
        const productDetails = new ProductDetailPage(page);

        await page.goto(`${storefrontURL}`, { waitUntil: "load" });
        await landingPage.acceptAllCookies();
        await zipModalPage.closeZipModal();
        await allProductsPage.addProductQtyByName(RestrictedItem.restrictedProduct, 1);
        await productDetails.openProductDetails(RestrictedItem.restrictedProduct);
        await landingPage.openCart();
        await expect(page).toHaveURL(`${storefrontURL}/cart`);
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(`${storefrontURL}/cart/checkout`);
        await checkoutPage.enterFullName(BuyerData.name);
        await checkoutPage.enterEmail(BuyerData.email);
        await checkoutPage.enterPhone(BuyerData.phone);
        await checkoutPage.enterAddress(BuyerData.addressLine);
        await checkoutPage.privacyPolicy.check();
        await checkoutPage.proceedToPayment.isEnabled();
        await checkoutPage.proceedToPayment.click();
        await expect(await commonHelperPage.getNotification(Notification.productIsRestricted)).toBeVisible();
        await expect(page).toHaveURL(`${storefrontURL}/cart/checkout`);
    });
});