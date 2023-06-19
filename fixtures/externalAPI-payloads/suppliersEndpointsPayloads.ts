export function updateSupplierPayload(supplierId: string, updatedSupplierName: string) {
    return {
      data: [
        {
            uid: supplierId,
            name: updatedSupplierName,
        },
      ],
    };
}