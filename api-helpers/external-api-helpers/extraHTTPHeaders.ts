const { externalAPIToken } = process.env;
const { accessToken } = process.env;
export const extraHTTPHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `${externalAPIToken}`,
}
export const accessHTTPHeaders = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
}