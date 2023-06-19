import { APIRequestContext } from '@playwright/test';
import { extraHTTPHeaders } from './extraHTTPHeaders';
import { createBuyerPayload, updateBuyerPayload } from '../../fixtures/externalAPI-payloads/buyersEndpointsPayload';
const { apiURL } = process.env;
export default class BuyersAPIRequests {
  constructor(public request: APIRequestContext) {
    this.request = request;
  }
  async createBuyer(sellerID: string, formalName: string, email: string) {
    const createBuyerFixture = createBuyerPayload(sellerID, formalName, email)
    const response = await this.request.post(`${apiURL}/api/external/v1/buyers`, {
      headers: extraHTTPHeaders,
      data: JSON.stringify(createBuyerFixture)
    });
    return response;
  }
  async getBuyerUid(response: any) {
    const data = await response.json();
    const buyerUid = data.data[0].uid;
    return buyerUid;
  }
  async createBuyerAndGetUid(sellerID: string, formalName: string, email: string) {
    const response = await this.createBuyer(sellerID, formalName, email);
    const buyerUid = await this.getBuyerUid(response);
    return buyerUid;
  }
  async updateBuyerAccount(marketplaceId: string, formalName: string, email: string, updatedFormalName: string) {
    const buyerUid = await this.createBuyerAndGetUid(marketplaceId, formalName, email);
    const updateBuyerFixture = updateBuyerPayload(buyerUid, updatedFormalName, email)
    const response = await this.request.put(`${apiURL}/api/external/v1/buyers`, {
        headers: extraHTTPHeaders,
        data: JSON.stringify(updateBuyerFixture)
        });
    return response;
  }
  async getBuyerAccountWithFilter(sellerUid: string, formalName: string, email: string){
    const buyerUid = await this.createBuyerAndGetUid(sellerUid, formalName, email);
    const _url = `${apiURL}/api/external/v1/buyers?seller_uid=${sellerUid}&page=1&per_page=3000&filters[uid]=${buyerUid}`;
    const response = await this.request.get(_url, {
        headers: extraHTTPHeaders,
    });
    return response;
  }
}