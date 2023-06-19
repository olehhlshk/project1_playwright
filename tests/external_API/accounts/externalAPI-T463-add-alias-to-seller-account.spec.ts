import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as marketplaceData from '../../../fixtures/data/data-for-receving-access-link.json'
import AccountsAPIRequests from '../../../api-helpers/external-api-helpers/externalAccountsRequest helper';
test('Add alias to seller account', async ({ request }) => {
    const accountsRequest = new AccountsAPIRequests(request)
    const sellerEmail = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`;
    const sellerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const aliasKey = faker.datatype.uuid();
    const aliasType = faker.datatype.uuid();
    const response = await accountsRequest.addSellerAlias(marketplaceData.markeplaceId, sellerName, sellerEmail, aliasKey, aliasType) ;
    console.log(await response.json());
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData.data[0].key).toBe(aliasKey);
});