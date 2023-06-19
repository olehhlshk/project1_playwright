import { APIRequestContext } from '@playwright/test';
import { extraHTTPHeaders } from './extraHTTPHeaders';
import { updateSupplierPayload } from '../../fixtures/externalAPI-payloads/suppliersEndpointsPayload';
const { apiURL } = process.env;
export default class SuppliersAPIRequests{
    constructor (public request: APIRequestContext) {
        this.request= request;
    }
    async getAllSuppliers(){
        const _url = `${apiURL}/api/external/v1/suppliers?page=1&per_page=3000`;
        const response = await this.request.get(_url, {
            headers: extraHTTPHeaders,
        });
        return response;
    }
    async updateSupplier(supplierId: string, updatedSupplierName: string) {
        const updateSupplierFixture = updateSupplierPayload(supplierId, updatedSupplierName)
        const response = await this.request.put(`${apiURL}/api/external/v1/suppliers`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(updateSupplierFixture)
            });
        return response;
    }
}