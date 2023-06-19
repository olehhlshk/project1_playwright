import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as sellerData from '../../../fixtures/data/automation-seller-data.json'
import BuyersAPIRequests from '../../../api-helpers/external-api-helpers/externalBuyersRequestHelper';
test('Update buyer account', async ({ request }) => {
    const buyersRequest = new BuyersAPIRequests(request)
    const buyerEmail = `${faker.name.firstName()}_${faker.name.lastName()}+${faker.random.alphaNumeric(9)}@2ixhgmcj.mailosaur.net`;
    const buyerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const updateFormalName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const response = await buyersRequest.updateBuyerAccount(sellerData.sellerId, buyerName, buyerEmail, updateFormalName);
    console.log(await response.json());
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    expect(responseData.data[0].contact.formal_name).toBe(updateFormalName);
});