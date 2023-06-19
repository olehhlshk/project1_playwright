import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import BrandsAPIRequests from '../../../api-helpers/external-api-helpers/externalBrandsRequestsHelper';
import * as supplierData from '../../../fixtures/data/supplier-data.json';
test('Get specific brand from the list', async ({ request }) => {
    const brandsRequest = new BrandsAPIRequests(request)
    const brandName = `${faker.commerce.department()} ${faker.commerce.productAdjective}_${faker.commerce.productMaterial()}_${faker.company.bsAdjective()}_${faker.finance.account(5)}`;
    const response = await brandsRequest.createBrand(supplierData.supplierId, brandName);
    const _brandsResponse = await brandsRequest.getBrandWithFilter(supplierData.supplierId, brandName);
    expect(_brandsResponse.status()).toBe(200);
    const responseData = await response.json();
    expect(responseData.data[0].name).toBe(brandName);
});