import { APIRequestContext } from '@playwright/test';
import { extraHTTPHeaders } from './extraHTTPHeaders';
import { updateMarketplacePayload } from '../../fixtures/externalAPI-payloads/marketplacesEndpointsPayloads';
const { apiURL } = process.env;
export default class MarketplacesAPIRequests{
    constructor (public request: APIRequestContext) {
        this.request= request;
    }
    async getAllMarketplaces(){
        const _url = `${apiURL}/api/external/v1/marketplaces?page=1&per_page=3000`;
        const response = await this.request.get(_url, {
            headers: extraHTTPHeaders,
        });
        return response;
    }
    async updateMarketplace(marketplaceId: string, updatedMarketplaceName: string) {
        const updateMarketplaceFixture = updateMarketplacePayload(marketplaceId, updatedMarketplaceName)
        const response = await this.request.put(`${apiURL}/api/external/v1/marketplaces`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(updateMarketplaceFixture)
            });
        return response;
    }
}




