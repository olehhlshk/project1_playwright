export function createProductPayload(supplierID: string, sku: string, productName: string, brandUid: string) {
    return {
        supplier_uid: supplierID,
      data: [
        {
            sku: sku,
            name: productName,
            active: true,
            availability: {
                availability_control: true,
                available_quantity: 1111
            },
            brand_uid: brandUid
          },
      ],
    };
}
export function updateProductPayload(productUid: string, updatedProductName: string) {
    return {
      data: [
        {
            uid: productUid,
            name: updatedProductName
          },
      ],
    };
}
export function addProductImagePayload(productUid: string, imageURL: string) {
    return {
      data: [
        {
            product_uid: productUid,
            image_url: imageURL,
            primary: true
          },
      ],
    };
}
export function addProductPricePayload(tenant: string, productUid: string, price: number) {
    return {
        tenant_uid: tenant,
      data: [
        {
            product_uid: productUid,
            type: "regular",
            value: price
          },
      ],
    };
}
export function addProductRestrictionPayload( productUid: string, zip: string) {
    return {
      data: [
        {
            product_uid: productUid,
            rule_type: "zip_code",
            rule_value: zip
          },
      ],
    };
}
export function addProductCategoryPayload( productUid: string, categoryUid: string) {
    return {
      data: [
        {
            product_uid: productUid,
            category_uid: categoryUid
          },
      ],
    };
}