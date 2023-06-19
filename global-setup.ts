import { FullConfig } from '@playwright/test';
async function globalSetup(config: FullConfig) {
  process.env.storefrontURL = 'url';
  process.env.storefrontURLWithFeaturedItemsForSeller = 'url';
  process.env.storefrontURLWithFeaturedItemsForSupervisor = 'url';
  process.env.storefrontURLWithFeaturedItemsForMPO = 'url';
  process.env.consoleURL = 'url';
  process.env.apiURL = 'url';
  process.env.externalAPIToken = 'Token token=ZTFjMzM3ODViMzI5ZWFjNDI3NzgyMTU5MDlmYmVmYWY5MDUwNTkzODFjYWE0MjFjNmRmMjAxZjJkNjYxN2NlM2E2NWM1NTkwOGQ2MjIwMmIyZjEwMzE2ZTE2ZDFjYzA3MGY0MTM3NDkxNmEyMTFiMGI0OWFjMzdiYmVjYzBjYzY=';
  process.env.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhY2xfMDFHVEtWOUNUUVhaRVJWM0RSUUIxNlk1VkciLCJleHAiOjE3NDE4ODg5NDN9.QozgqFxrNzQHVhdMrP0v_h84WaE_lgUQykII3zjZ8B4';
}
export default globalSetup;