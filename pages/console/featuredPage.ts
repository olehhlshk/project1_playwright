import { Locator, Page } from "@playwright/test";
export default class FeaturedPage{
    readonly productsButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.productsButton = page.getByRole('button', { name: 'Products' });
    }
    async interceptFeaturedBrandsResponse(){
      return await Promise.all([
        this.page.waitForResponse(
          async (response) => {
            return (await response.body()).includes('"__typename":"FeaturedBrandsList"');
          },
          { timeout: 10000 }
      ),
      ]);
    }
    async getFirstFeaturedBrandFromResponse(){
      const [responseFeaturedBrandsList] = await this.interceptFeaturedBrandsResponse();
      const responseBodyFeaturedBrandsList = JSON.parse(
        (await responseFeaturedBrandsList.body()).toString()
      );
      return await responseBodyFeaturedBrandsList.data.featuredBrands.nodes[0].brand.name;
    }
    async openProductsTab() {
        await Promise.all([
         this.productsButton.click(),
         this.page.waitForLoadState('load')
        ])
    }
    async interceptFeaturedProductsResponse(){
        return await Promise.all([
          this.page.waitForResponse(
            async (response) => {
              return (await response.body()).includes('"__typename":"FeaturedItemsList"');
            },
            { timeout: 10000 }
        ),
        ]);
      }
      async getFirstFeaturedProductFromResponse(){
        const [responseFeaturedProductsList] = await this.interceptFeaturedProductsResponse();
        const responseBodyFeaturedProductsList = JSON.parse(
          (await responseFeaturedProductsList.body()).toString()
        );
        return await responseBodyFeaturedProductsList.data.featuredItems.nodes[0].item.name;
      }
}