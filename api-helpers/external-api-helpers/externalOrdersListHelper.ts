import { APIRequestContext, expect } from '@playwright/test';
import { extraHTTPHeaders } from './extraHTTPHeaders';
const { apiURL } = process.env;
export default class OrdersListAPIRequests {
    constructor(public request: APIRequestContext) {
        this.request = request;
    }
    async getOrdersByUid(marketplaceId: string, orderUid: string) {
        const _url = `${apiURL}/api/external/v1/orders?marketplace_uid=${marketplaceId}&page=1&per_page=10&filters[uid]=${orderUid}`;
        const response = await this.request.get(_url, {
            headers: extraHTTPHeaders,
        });
        const data = await response.json().then(r => {
            return r.data
        });
        return data;
    }
    async getOrderItemUidByOrderUid(marketplaceId: string, orderUid: string) {
        const orderItemUid = await this.getOrdersByUid(marketplaceId, orderUid).then(r => {
            return r[0].order_items[0].uid
        });
        return await orderItemUid;
    }
    async filterOrderItemByStatus(response: any, status: string) {
        const data = response[0].order_items.find(o => o.shipping_status === status);
        return data
    }
    async waitForShippinStatus (marketplaceUid: string, orderUid: string, shippingStatusReturned: string)  {
        let response;
        await expect.poll(async () => {
            response = await this.getOrdersByUid(marketplaceUid, orderUid);
            const orderItem = await this.filterOrderItemByStatus(response, shippingStatusReturned);
            return response.length > 0 && typeof orderItem !== 'undefined' ? orderItem.shipping_status : "status not found"
          }, {
            timeout: 90000,
          }).toBe(shippingStatusReturned);
        return response;
    }
}









