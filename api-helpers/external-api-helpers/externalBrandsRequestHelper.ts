import { APIRequestContext } from '@playwright/test';
import { extraHTTPHeaders } from './extraHTTPHeaders';
import { createBrandPayload,
    updateBrandPayload,
    addBrandImagePayload } from '../../fixtures/externalAPI-payloads/brandsEndpointsPayloads';
const { apiURL } = process.env;
export default class BrandsAPIRequests{
    constructor (public request: APIRequestContext) {
        this.request= request;
    }
    async createBrand(supplierID: string, brandName: string) {
        const createBrandFixture = createBrandPayload(supplierID, brandName)
        const response = await this.request.post(`${apiURL}/api/external/v1/brands`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(createBrandFixture)
            });
        return response;
    }
    async getBrandID(response: any) {
        try {
          const data = await response.json();
          if (data && data.data && data.data.length > 0) {
            const brandUid = data.data[0].uid;
            return brandUid;
          } else {
            console.error('Invalid response data:', data);
            throw new Error('Failed to get brand ID from response data');
          }
        } catch (error) {
          console.error('Failed to parse response data:', error);
          throw new Error('Failed to parse response data');
        }
    }
    async createBrandAndGetBrandUid(supplierID: string, brandName: string) {
        const response = await this.createBrand(supplierID, brandName);
        const brandUid = await this.getBrandID(response);
        return brandUid;
    }
    async getBrandWithFilter(supplierID: string, brandName: string){
        const _url = `${apiURL}/api/external/v1/brands?supplier_uid=${supplierID}&page=1&per_page=3000&filters[name]=${brandName}`;
        const response = await this.request.get(_url, {
            headers: extraHTTPHeaders,
        });
        return response;
    }
    async updateBrand(supplierID: string, brandName: string, updatedBrandName: string) {
        const brandUid = await this.createBrandAndGetBrandUid(supplierID, brandName);
        const updateBrandFixture = updateBrandPayload(brandUid, updatedBrandName)
        const response = await this.request.put(`${apiURL}/api/external/v1/brands`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(updateBrandFixture)
            });
        return response;
    }
    async addBrandImage(supplierID: string, brandName: string, imageUrl: string) {
        const brandUid = await this.createBrandAndGetBrandUid(supplierID, brandName);
        const addBrandImageFixture = addBrandImagePayload(brandUid, imageUrl)
        const response = await this.request.post(`${apiURL}/api/external/v1/brands/images`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(addBrandImageFixture)
            });
        return response;
    }
}