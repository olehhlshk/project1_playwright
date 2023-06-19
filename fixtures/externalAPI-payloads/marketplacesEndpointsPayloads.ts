export function updateMarketplacePayload(marketplaceId: string, updatedMarketplaceName: string) {
    return {
      data: [
        {
            uid: marketplaceId,
            name: updatedMarketplaceName,
        },
      ],
    };
}