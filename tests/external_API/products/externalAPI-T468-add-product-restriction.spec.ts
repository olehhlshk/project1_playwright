import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as supplierData from '../../../fixtures/data/supplier-data.json';
import ProductsAPIRequests from '../../../api-helpers/external-api-helpers/externalProductsRequestsHelper';
test('Add restriction to product', async ({ request }) => {
    const productsRequest = new ProductsAPIRequests(request)
    const productName = faker.commerce.product();
    const sku = faker.datatype.uuid();
    const zip = faker.address.zipCode('#####');
    const response = await productsRequest.addProductRestriction(supplierData.supplierId, sku, productName, supplierData.brandId, zip);
    console.log(await response.json());
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData.data[0].rule_value).toBe(zip);
});