export function cancelOrderPayload(orderItemUid: string, quantity: number) {
    return {
      data: [
        {
            uid: orderItemUid,
            qty: quantity,
        },
      ],
    };
}
export function updateOrderPayload(orderItemUid: string, trackingNumber: number, shippingNumber: number, orderShippingStatus: string) {
    return {
      data: [
        {
            uid: orderItemUid,
            tracking_number: trackingNumber,
            shipping_number: shippingNumber,
            shipping_status: orderShippingStatus
        },
      ],
    };
}