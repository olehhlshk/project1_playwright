import { expect, Locator, Page } from "@playwright/test";
import { faker } from '@faker-js/faker';
export default class SuppliersPage {
    readonly onSupplierPage: Locator;
    readonly brandTab: Locator;
    readonly buttonAddBrand: Locator;
    readonly submitBrand: Locator;
    readonly fieldBrand: Locator;
    readonly productTab: Locator;
    readonly addProductButton: Locator;
    readonly createProductModal: Locator;
    readonly fieldProductName: Locator;
    readonly fieldScuName: Locator;
    readonly fieldPriceName: Locator;
    readonly fieldBrandDropDown: Locator;
    readonly submitProductForm: Locator;
    readonly saveProdactButton: Locator;
    readonly checkImage: Locator;
    readonly submitButtonProductTab: Locator;
    readonly pricingTab: Locator;
    readonly pricingPage: Locator;
    readonly discountField: Locator;
    readonly discountModal: Locator;
    readonly fieldDiscountModal: Locator;
    readonly submitDiscountPriceButton: Locator;
    readonly brandDropdown: Locator;
    readonly saveImageButton: Locator;
    readonly productState: Locator;
    readonly inactiveButton: Locator;
    readonly activeButton: Locator;
    readonly categoriesDropdown: Locator;
    readonly categoryInTheDropdown: Locator;
    readonly categoriesInput: Locator;
    readonly categoriesInputIsFilledIn: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.onSupplierPage = page.getByText('Suppliers List');
        this.brandTab = page.locator('button', { hasText: 'Brands' });
        this.buttonAddBrand = page.locator('button', { hasText: 'Add Brand' });
        this.submitBrand = page.locator('button', { hasText: 'Submit' });
        this.fieldBrand = page.locator('input[name="name"]');
        this.productTab = page.locator('button', { hasText: 'Products' });
        this.addProductButton = page.locator('button', { hasText: 'Add Product' });
        this.createProductModal = page.getByText('Create a Product');
        this.fieldProductName = page.locator('input[name="name"]');
        this.fieldScuName = page.locator('input[name="sku"]');
        this.fieldPriceName = page.locator('input[name="regularPrice"]');
        this.fieldBrandDropDown = page.locator('.css-1jilgpc');
        this.submitProductForm = page.locator('button[type="submit"]');
        this.saveProdactButton = page.getByRole('button', { name: 'Save' });
        this.checkImage = page.locator('img[class="w-34 lg:w-96"]');
        this.submitButtonProductTab = page.locator('button[type="submit"]');
        this.pricingTab = page.locator('button', { hasText: 'pricing' });
        this.pricingPage = page.getByText('Discounted Price');
        this.discountField = page.locator('div[class="relative"]').nth(1);
        this.discountModal = page.getByText('Add Price');
        this.fieldDiscountModal = page.locator('input[name="price"]');
        this.submitDiscountPriceButton = page.locator('button[type="submit"]');
        this.brandDropdown = page.locator('#react-select-2-option-0');
        this.saveImageButton = page.locator('xpath=/html/body/div[4]/div/div/div[2]/div[2]/div');
        this.productState = page.locator('.inline-flex').first();
        this.inactiveButton = page.locator('#react-select-2-option-1 div').first();
        this.activeButton = page.locator('#react-select-2-option-0 div').first();
        this.categoriesDropdown = page.locator('div:nth-child(3) > div > div > div:nth-child(2) > .w-full > .css-1qafuic-control > .css-1jilgpc > .css-1szskrh').first();
        this.categoriesInput = page.locator('#react-select-4-input');
        this.categoryInTheDropdown = page.locator('#react-select-4-option-0');
        this.categoriesInputIsFilledIn = page.locator('div[data-value] input#react-select-4-input');
    }
    async openSupplierPage(nameSupplier: string) {
        await this.page.getByText(nameSupplier).click();
        await this.page.waitForLoadState('load');
    }
    async clickBrandTab() {
        await this.brandTab.click();
    }
    async clickProductTab() {
        await this.productTab.click();
    }
    async clickAddBrandButton() {
        await this.buttonAddBrand.click();
    }
    async fillBrandField(brandName: string) {
        await this.fieldBrand.type(brandName, { delay: 10 });
    }
    async submitAddingBrand() {
        await this.submitBrand.click()
    }
    async addBrand(brandName: string) {
        await this.clickAddBrandButton();
        await this.fillBrandField(brandName);
        await this.submitAddingBrand();
    }
    async goToBrandPage(supplierName: string) {
        await this.page.locator('a', { hasText: supplierName }).click();
    }
    async clickAddProductButton() {
        await this.addProductButton.click();
        await expect(this.createProductModal).toBeVisible();
    }
    async addProduct(productName: string, skuName: string, price: string, brandName: string) {
        await this.clickAddProductButton();
        await this.fieldProductName.type(productName);
        await this.fieldScuName.type(skuName);
        await this.fieldPriceName.type(price);
        await this.selectBrand(brandName);
        await this.submitProductForm.click();
    }
    async uploadProductImage() {
        await this.page.setInputFiles('input[type="file"]', './fixtures/images/34mb.jpeg');
        await this.saveImageButton.click();
    }
    async clickOnSaveButton() {
        await this.saveProdactButton.click();
    }
    async clickSubmitButtonProductTab() {
        await this.submitButtonProductTab.click();
    }
    async clickPricingTab() {
        await this.pricingTab.click();
    }
    async clickOnDiscountField() {
        await this.discountField.click();
    }
    async fillDiscountPrice(discountNumber: number) {
        await this.fieldDiscountModal.clear();
        await this.fieldDiscountModal.type(`${discountNumber}`);
    }
    async clickDiscountPriceButton() {
        await this.submitDiscountPriceButton.click();
    }
    async selectBrand(brandName: string) {
        await this.fieldBrandDropDown.click();
        await this.fieldBrandDropDown.type(brandName);
        await this.brandDropdown.getByText(brandName).click();
    }
    async interceptProductsResponse(){
        return await Promise.all([
          this.page.waitForResponse(
            async (response) => {
              return (await response.body()).includes('"__typename":"ItemsList"');
            },
            { timeout: 10000 }
        ),
        ]);
      }
    async getFirstProductDataFromResponse(){
        const [responseProductList] = await this.interceptProductsResponse();
        const responseBodyProductsList = JSON.parse(
            (await responseProductList.body()).toString()
        );
        return await responseBodyProductsList.data.items.nodes[0];
    }
    async openProductDetailsByText(text: string){
        await this.page.getByText((`${text}`)).scrollIntoViewIfNeeded();
        await this.page.getByText((`${text}`)).click();
    }
    async getProductCurrentStateByTextContent(){
        return await this.page.locator('input#react-select-2-input >> xpath=..').textContent();
    }
    async openProductStateOption(){
        await this.productState.click()
    }
    async selectInactiveOption(){
        await this.inactiveButton.click()
        await this.page.waitForLoadState('load')
    }
    async selectActiveOption(){
        await this.activeButton.click()
        await this.page.waitForLoadState('load')
    }
    async addCategoryToTheProduct(categoryName: string) {
        if (await this.categoriesDropdown.isVisible()){
        await this.categoriesDropdown.click();
        await this.categoriesInput.fill(categoryName);
        await this.categoryInTheDropdown.getByText(categoryName).click();
        await this.page.waitForLoadState('load');
        }
    else {
        await this.categoriesInputIsFilledIn.fill(categoryName);
        await this.categoryInTheDropdown.getByText(categoryName).click();
        await this.page.waitForLoadState('load');
        }
    }
}