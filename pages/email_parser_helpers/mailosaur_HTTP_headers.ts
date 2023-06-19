import * as mailosaurData from '../../fixtures/mailosaur_data/mailosaur_data.json';
const mailosaurApiKey = mailosaurData.mailosaurAPIKey;
export const mailosaurHTTPHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Basic ${Buffer.from(mailosaurApiKey).toString('base64')}`
  }