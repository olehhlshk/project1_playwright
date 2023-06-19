import { APIRequestContext } from '@playwright/test';
import { extraHTTPHeaders } from './extraHTTPHeaders';
import { cancelOrderPayload } from '../../fixtures/externalAPI-payloads/ordersEndpointPayload';
const { apiURL } = process.env;
export default class OrderItemsCancelAPIRequests {
    constructor(public request: APIRequestContext) {
        this.request = request;
    }
    async cancelOrder(orderItemUid: string, quantity: number) {
        const orderCancelFixture = cancelOrderPayload(orderItemUid, quantity)
        await this.request.put(`${apiURL}/api/external/v1/orders/items/cancel`, {
            headers: extraHTTPHeaders,
            data: JSON.stringify(orderCancelFixture)
        });
    }
}