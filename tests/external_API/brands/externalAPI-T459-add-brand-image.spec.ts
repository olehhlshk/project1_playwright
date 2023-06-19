import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import BrandsAPIRequests from '../../../api-helpers/external-api-helpers/externalBrandsRequestsHelper';
import * as supplierData from '../../../fixtures/data/supplier-data.json';
import * as imageURL from '../../../fixtures/images/imageURL.json'
test('Upload brand image', async ({ request }) => {
    const brandsRequest = new BrandsAPIRequests(request)
    const brandName = `${faker.commerce.department()} ${faker.commerce.productAdjective}_${faker.commerce.productMaterial()}_${faker.company.bsAdjective()}`;
    const response = await brandsRequest.addBrandImage(supplierData.supplierId, brandName, imageURL.imageURL);
    console.log(await response.json());
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData.data.status).toBe('processing');
});