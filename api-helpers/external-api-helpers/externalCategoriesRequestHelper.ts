import { APIRequestContext } from '@playwright/test';
import { extraHTTPHeaders } from './extraHTTPHeaders';
const { apiURL } = process.env;
export default class CategoriesAPIRequests{
    constructor (public request: APIRequestContext) {
        this.request= request;
    }
    async getAllCategories(tenant: string){
        const _url = `${apiURL}/api/external/v1/categories?tenant_uid=${tenant}&page=1&per_page=3000`;
        const response = await this.request.get(_url, {
            headers: extraHTTPHeaders,
        });
        return response;
    }
}