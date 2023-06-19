import { test, expect } from '@playwright/test';
import SuppliersPage from '../../pages/console/suppliersPage';
import * as supplierData from '../../fixtures/data/supplier-data.json';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';

test.use({
    storageState: './state-storage-files/supervisorStorageState.json',
});
test('check the save button doesn`t override the changed product state', async ({ page, isMobile }) => {
    const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
    const suppliersPage = new SuppliersPage(page);
    const { consoleURL } = process.env;
    
    await page.goto(`${consoleURL}`, { waitUntil: "load" });
    await sidebarNavigation.goToSuppliers();
    await suppliersPage.openSupplierPage(supplierData.supplierForGeneratingTestData);
    await suppliersPage.clickProductTab();
    const productListData = await suppliersPage.getFirstProductDataFromResponse();
    await suppliersPage.openProductDetailsByText(productListData.name);
    const currentProductStateOnUI = await suppliersPage.getProductCurrentStateByTextContent()
    await suppliersPage.openProductStateOption();
    if (currentProductStateOnUI === 'Active') {
        await suppliersPage.selectInactiveOption();
    } else if (currentProductStateOnUI === 'Inactive') {
        await suppliersPage.selectActiveOption();
    }
    const updatedProductStateOnUi = await suppliersPage.getProductCurrentStateByTextContent();
    await expect(await suppliersPage.getProductCurrentStateByTextContent()).toBe(updatedProductStateOnUi);
    const productUpdatedStateInResponse = await suppliersPage.getFirstProductDataFromResponse();
    await suppliersPage.clickOnSaveButton();
    const productStateInResponseAfterSave = await suppliersPage.getFirstProductDataFromResponse();
    await expect(productUpdatedStateInResponse).toEqual(productStateInResponseAfterSave);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(await suppliersPage.getProductCurrentStateByTextContent()).toBe(updatedProductStateOnUi);
});