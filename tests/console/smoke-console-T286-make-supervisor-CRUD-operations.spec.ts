import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import SuppliersPage from '../../pages/console/suppliersPage'
import BrandsAPIRequests from '../../api-helpers/external-api-helpers/externalBrandsRequestsHelper';
import ProductsAPIRequests from '../../api-helpers/external-api-helpers/externalProductsRequestsHelper';
import { extraHTTPHeaders } from '../../api-helpers/external-api-helpers/extraHTTPHeaders';
import * as supplierData from '../../fixtures/data/supplier-data.json';
import * as notificationToast from '../../fixtures/toast/toast-messages.json';
import CommonHelperPages from '../../pages/console/commonHelperPages';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';

test.use({
    storageState: './state-storage-files/supervisorStorageState.json',
    extraHTTPHeaders: extraHTTPHeaders
});

test('Smoke Admin make supervisor CRUD action', async ({ page, request, isMobile }) => {
    const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
    const suppliersPage = new SuppliersPage(page);
    const commonHelperPages = new CommonHelperPages(page);
    const externalBrandsRequestsHelper = new BrandsAPIRequests(request)
    const externalProductsRequestHelper = new ProductsAPIRequests(request)
    const { consoleURL } = process.env;
    const brandName = faker.company.name() + ' ' + faker.random.numeric(4);
    const price = faker.random.numeric(3);
    const discountNumber = faker.datatype.number({ min: 1, max: 100, precision: 1 });
    const skuName = faker.random.alphaNumeric(8);
    const productName = faker.commerce.productName() + faker.random.numeric(4);
    //---- hardcode until devs fix bug with brands pagination ----const brandName = faker.company.name();
    const hardcodedBrandName = 'Funk Inc 1949';
    
    await page.goto(`${consoleURL}`, { waitUntil: "load" });
    await sidebarNavigation.goToSuppliers();
    await expect(suppliersPage.onSupplierPage).toBeVisible();
    await suppliersPage.openSupplierPage(supplierData.supplierForGeneratingTestData);
    await suppliersPage.clickBrandTab();
    await suppliersPage.addBrand(brandName);
    await expect(await commonHelperPages.getNotification(notificationToast.successfulBrandCreatedNotification)).toBeVisible();
    const _brandsResponse = await externalBrandsRequestsHelper.getBrandWithFilter(supplierData.supplierId, brandName);
    expect(_brandsResponse.status()).toBe(200);
    const brandResponseJSON = await _brandsResponse.json()
    expect(brandResponseJSON.data[0].name).toBe(brandName);
    await page.goBack({waitUntil: "load"})
    await expect(await commonHelperPages.checkPageName(supplierData.supplierForGeneratingTestData)).toBeVisible();
    await suppliersPage.clickProductTab();
    await suppliersPage.addProduct(productName, skuName, price, hardcodedBrandName)
    await expect(await commonHelperPages.getNotification(notificationToast.successfulProductCreatedNotification)).toBeVisible();
    const _productsResponse = await externalProductsRequestHelper.getProductFromTheListWithFilter(supplierData.supplierId, skuName);
    expect(_productsResponse.status()).toBe(200);
    const productResponseJSON = await _productsResponse.json()
    expect(productResponseJSON.data[0].sku).toBe(skuName);
    await suppliersPage.uploadProductImage();
    await suppliersPage.clickOnSaveButton();
    await expect(suppliersPage.checkImage).toBeVisible();
    await suppliersPage.clickSubmitButtonProductTab();
    await suppliersPage.clickPricingTab();
    await expect(suppliersPage.pricingPage).toBeVisible();
    await suppliersPage.clickOnDiscountField();
    await expect(suppliersPage.discountModal).toBeVisible();
    await suppliersPage.fillDiscountPrice(discountNumber);
    await suppliersPage.clickDiscountPriceButton();
    await expect(await commonHelperPages.getNotification(notificationToast.successfulDiscountedPriceCreatedNotification)).toBeVisible();
});