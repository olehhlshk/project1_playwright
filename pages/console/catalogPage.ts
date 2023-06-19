import { Locator, Page, expect } from "@playwright/test";
export default class CatalogPage{
  readonly featuredMarkToSelectItem: Locator;
  readonly featuredMarkToDeselectItem: Locator;
  readonly featuredProductMarkSelectingItem: Locator;
  readonly featuredProductMarkDeselectingItem: Locator;
    constructor(public page: Page) {
        this.page = page;
    }
    async interceptCatalogResponse(){
        return await Promise.all([
          this.page.waitForResponse(
            async (response) => {
              return (await response.body()).includes('"__typename":"SellerBrandsList"');
            },
            { timeout: 10000 }
        ),
        ]);
      }
      async getFirstBrandFromResponse(){
        const [responseBrandsList] = await this.interceptCatalogResponse();
        const responseBodyBrandsList = JSON.parse(
          (await responseBrandsList.body()).toString()
        );
        return await responseBodyBrandsList.data.allowedSellerBrands.nodes[0];
      }
      async findBrandOnThePage(text: string){
        return await this.page.getByText((`${text}`));
      }
      async selectBrandAsFeatured(page: Page, brandName: string, brandId: string){
        const brandData = `${brandName} ${brandId}`;
        const featuredMark = page.getByRole('row', { name: brandData }).locator('svg').nth(1);
        if(await featuredMark.getAttribute('class') == "text-yellow-main"){
          await featuredMark.click();
          await page.waitForLoadState('load');
          await expect(featuredMark).toBeVisible();
          await featuredMark.click();
          await page.waitForLoadState('load');
          await expect(await featuredMark.getAttribute('class')).toBe("text-yellow-main")
        }else {
          await featuredMark.click();
          await page.waitForLoadState('load');
          await expect(await featuredMark.getAttribute('class')).toBe("text-yellow-main")
        }
      }
      async deselectBrandFromFeatured(page: Page, brandName: string){
        const brandData = `${brandName}`;
        const featuredMark = page.getByRole('row', { name: brandData }).locator('path').first();
        await featuredMark.click();
        await this.page.waitForLoadState('load');
        await expect(featuredMark).toBeVisible();
      }
      async openBrandByName(name: string) {
        await this.page.getByText((`${name}`)).click();
        await this.page.waitForLoadState('load');
      }
      async selectProductAsFeatured(page: Page, productName: string, productId: string){
        const productData = `${productName} ${productId}`;
        const featuredMark = page.getByRole('row', { name: productData }).locator('svg').first();
        if(await featuredMark.getAttribute('class') == "text-yellow-main"){
          await featuredMark.click();
          await this.page.waitForLoadState('load');
          await expect(featuredMark).toBeVisible();
          await featuredMark.click();
          await this.page.waitForLoadState('load');
          await expect(await featuredMark.getAttribute('class')).toBe("text-yellow-main")
        }else{
          await featuredMark.click();
          await this.page.waitForLoadState('load');
          await expect(await featuredMark.getAttribute('class')).toBe("text-yellow-main")
        }
      }
      async deselectProductFromFeatured(page: Page, productName: string){
        const productData = `${productName}`;
        const featuredMark = page.getByRole('row', { name: productData }).locator('path').first();
        await featuredMark.click();
        await this.page.waitForLoadState('load');
        await expect(featuredMark).toBeVisible();
      }
}