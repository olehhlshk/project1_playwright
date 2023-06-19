import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as supplierData from '../../../fixtures/data/supplier-data.json';
import * as externalApiDada from '../../../fixtures/data/externalAPI-marketplaces-data.json';
import ProductsAPIRequests from '../../../api-helpers/external-api-helpers/externalProductsRequestsHelper';
test('Add price to product', async ({ request }) => {
    const productsRequest = new ProductsAPIRequests(request)
    const productName = faker.commerce.product();
    const sku = faker.datatype.uuid();
    const price = faker.datatype.number(1000);
    const response = await productsRequest.addProductPrice(supplierData.supplierId, sku, productName, supplierData.brandId, externalApiDada.tenantId, price);
    console.log(await response.json());
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData.data[0].value).toBe(price);
});