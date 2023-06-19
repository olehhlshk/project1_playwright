export function createBrandPayload(supplierID: string, brandName: string) {
    return {
        supplier_uid: supplierID,
      data: [
        {
            name: brandName,
        },
      ],
    };
}
export function updateBrandPayload(brandUid: string, updatedBrandName: string) {
    return {
      data: [
        {
            uid: brandUid,
            name: updatedBrandName,
        },
      ],
    };
}
export function addBrandImagePayload(brandUid: string, imageUrl: string) {
    return {
      data: [
        {
            brand_uid: brandUid,
            image_url: imageUrl,
        },
      ],
    };
}