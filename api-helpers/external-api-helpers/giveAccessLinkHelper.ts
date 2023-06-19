const request = require('request-promise');
import { accessHTTPHeaders } from "./extraHTTPHeaders";
async function makeApiCallToGetALink(authUid) {
    const apiUrl = `https://external.dev.salonhq.co/api/external/auth/v1/sellers/${authUid}/access`;
    const headers = accessHTTPHeaders
    console.log(`Making API call to ${apiUrl}`);
    const response = await request({
      method: 'POST',
      uri: apiUrl,
      headers: headers,
      json: true
    });
    return response;
  }
  module.exports = {
    makeApiCallToGetALink
  };