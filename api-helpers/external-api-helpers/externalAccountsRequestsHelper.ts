import { APIRequestContext } from '@playwright/test';
import { extraHTTPHeaders } from './extraHTTPHeaders';
import {
  createAccountPayload,
  updateAccountPayload,
  deactivateAccountPayload,
  addAccountAliasPayload} from '../../fixtures/externalAPI-payloads/accountsEndpointsPayloads';
const { apiURL } = process.env;
export default class AccountsAPIRequests {
  constructor(public request: APIRequestContext) {
    this.request = request;
  }
  async createAccount(marketplaceID: string, formalName: string, email: string) {
    const createAccountFixture = createAccountPayload(marketplaceID, formalName, email)
    const response = await this.request.post(`${apiURL}/api/external/v1/accounts`, {
      headers: extraHTTPHeaders,
      data: JSON.stringify(createAccountFixture)
    });
    return response;
  }
  async getAuthUid(response: any) {
    const data = await response.json();
    const authUid = data.data[0].auth_uid;
    return authUid;
  }
  async createAccountAndGetAuthUid(marketplaceId: string, formalName: string, email: string) {
    const response = await this.createAccount(marketplaceId, formalName, email);
    const authUid = await this.getAuthUid(response);
    return authUid;
  }
  async getAccountUid(response: any) {
    const data = await response.json();
    const accountUid = data.data[0].uid;
    return accountUid;
  }
  async createAccountAndGetAccountUid(marketplaceId: string, formalName: string, email: string) {
    const response = await this.createAccount(marketplaceId, formalName, email);
    const accountUid = await this.getAccountUid(response);
    return accountUid;
  }
  async updateSellerAccount(marketplaceId: string, formalName: string, email: string, updatedFormalName: string) {
    const accountUid = await this.createAccountAndGetAccountUid(marketplaceId, formalName, email);
    const updateAccountFixture = updateAccountPayload(accountUid, updatedFormalName)
    const response = await this.request.put(`${apiURL}/api/external/v1/accounts`, {
        headers: extraHTTPHeaders,
        data: JSON.stringify(updateAccountFixture)
        });
    return response;
  }
  async getAccountWithFilter(marketplaceId: string, formalName: string, email: string){
    const accountUid = await this.createAccountAndGetAccountUid(marketplaceId, formalName, email);
    const _url = `${apiURL}/api/external/v1/accounts?marketplace_uid=${marketplaceId}&page=1&per_page=3000&filters[uid]=${accountUid}`;
    const response = await this.request.get(_url, {
        headers: extraHTTPHeaders,
    });
    return response;
  }
  async deactivateSellerAccount(marketplaceId: string, formalName: string, email: string) {
    const accountUid = await this.createAccountAndGetAccountUid(marketplaceId, formalName, email);
    const deactivateAccountFixture = deactivateAccountPayload(accountUid)
    const response = await this.request.post(`${apiURL}/api/external/v1/accounts/deactivate`, {
        headers: extraHTTPHeaders,
        data: JSON.stringify(deactivateAccountFixture)
        });
    return response;
  }
  async addSellerAlias(marketplaceId: string, formalName: string, email: string, aliasKey: string, aliasType: string) {
    const accountUid = await this.createAccountAndGetAccountUid(marketplaceId, formalName, email);
    const addAliasFixture = addAccountAliasPayload(accountUid, aliasKey, aliasType)
    const response = await this.request.post(`${apiURL}/api/external/v1/accounts/identity_aliases`, {
        headers: extraHTTPHeaders,
        data: JSON.stringify(addAliasFixture)
        });
    return response;
  }
}