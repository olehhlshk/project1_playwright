import { APIRequestContext } from '@playwright/test';
import { extraHTTPHeaders } from './extraHTTPHeaders';
import { addProductCategoryPayload,
    createProductPayload,
    updateProductPayload,
    addProductImagePayload,
    addProductPricePayload,
    addProductRestrictionPayload} from '../../fixtures/externalAPI-payloads/productsEndpopintsPayloads';
const { apiURL } = process.env;
export default class ProductsAPIRequests{
    constructor (public request: APIRequestContext) {
        this.request= request;
    }
    async createProduct(supplierID: string, sku: string, productName: string, brandUid: string) {
        const createProductFixture = createProductPayload(supplierID, sku, productName, brandUid)
        const response = await this.request.post(`${apiURL}/api/external/v1/products`, {
          headers: extraHTTPHeaders,
          data: JSON.stringify(createProductFixture)
        });
        return response;
      }
      async getProductUid(response: any) {
        const data = await response.json();
        const productUid = data.data[0].uid;
        return productUid;
      }
      async createProductAndGetProductUid(supplierID: string, sku: string, productName: string, brandUid: string) {
        const response = await this.createProduct(supplierID, sku, productName, brandUid);
        const productUid = await this.getProductUid(response);
        return productUid;
      }
      async updateProduct(supplierID: string, sku: string, productName: string, brandUid: string, updatedProductName: string) {
        const productUid = await this.createProductAndGetProductUid(supplierID, sku, productName, brandUid);
        const updateProductFixture = updateProductPayload(productUid, updatedProductName)
        const response = await this.request.put(`${apiURL}/api/external/v1/products`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(updateProductFixture)
            });
        return response;
      }
      async getProductFromTheListWithFilter(supplierID: string, sku: string){
        const _url = `${apiURL}/api/external/v1/products?supplier_uid=${supplierID}&page=1&per_page=3000&filters[sku]=${sku}`;
        const response = await this.request.get(_url, {
            headers: extraHTTPHeaders,
        });
        return response;
    }
    async addProductImage(supplierID: string, sku: string, productName: string, brandUid: string, imageURL: string) {
        const productUid = await this.createProductAndGetProductUid(supplierID, sku, productName, brandUid);
        const addProductImageFixture = addProductImagePayload(productUid, imageURL)
        const response = await this.request.post(`${apiURL}/api/external/v1/products/images`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(addProductImageFixture)
            });
        return response;
    }
    async addProductPrice(supplierID: string, sku: string, productName: string, brandUid: string, tenant: string, price: number) {
        const productUid = await this.createProductAndGetProductUid(supplierID, sku, productName, brandUid);
        const addProductPriceFixture = addProductPricePayload(tenant, productUid, price)
        const response = await this.request.post(`${apiURL}/api/external/v1/products/prices`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(addProductPriceFixture)
                });
        return response;
      }
      async addProductRestriction(supplierID: string, sku: string, productName: string, brandUid: string, zip: string) {
        const productUid = await this.createProductAndGetProductUid(supplierID, sku, productName, brandUid);
        const addProductRestrictionFixture = addProductRestrictionPayload(productUid, zip)
        const response = await this.request.post(`${apiURL}/api/external/v1/products/restrictions`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(addProductRestrictionFixture)
                });
        return response;
      }
      async addProductCategory(productUid: string, categoryUid: string) {
        const addProductCategoryFixture = addProductCategoryPayload(productUid, categoryUid)
        const response = await this.request.post(`${apiURL}/api/external/v1/products/categories`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(addProductCategoryFixture)
                });
        return response;
      }
}