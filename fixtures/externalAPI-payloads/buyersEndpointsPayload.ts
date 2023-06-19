export function createBuyerPayload(sellerID: string, formalName: string, email: string) {
    return {
      seller_uid: sellerID,
      data: [
        {
          contact: {
            formal_name: formalName,
            email: email,
          },
        },
      ],
    };
}
export function updateBuyerPayload(buyerUid: string, updatedFormalName: string, email: string) {
    return {
      data: [
        {
            uid: buyerUid,
          contact: {
            formal_name: updatedFormalName,
            email: email,
          },
        },
      ],
    };
}