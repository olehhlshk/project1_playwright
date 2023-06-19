import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as marketplaceData from '../../../fixtures/data/data-for-receving-access-link.json'
import AccountsAPIRequests from '../../../api-helpers/external-api-helpers/externalAccountsRequest helper';

test('Update seller account', async ({ request }) => {
    const accountsRequest = new AccountsAPIRequests(request)
    const sellerEmail = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`;
    const sellerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const updateFormalName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const response = await accountsRequest.updateSellerAccount(marketplaceData.markeplaceId, sellerName, sellerEmail, updateFormalName);
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    expect(responseData.data[0].contact.formal_name).toBe(updateFormalName);
});