import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import BrandsAPIRequests from '../../../api-helpers/external-api-helpers/externalBrandsRequestsHelper';
import * as supplierData from '../../../fixtures/data/supplier-data.json';
test('Create brand', async ({ request }) => {
    const brandsRequest = new BrandsAPIRequests(request)
    const brandName = `${faker.commerce.department()} ${faker.commerce.productAdjective}_${faker.commerce.productMaterial()}_${faker.company.bsAdjective()}`;
    const response = await brandsRequest.createBrand(supplierData.supplierId, brandName);
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData.data[0].name).toBe(brandName);
});