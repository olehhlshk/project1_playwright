import * as mailosaurData from '../../fixtures/mailosaur_data/mailosaur_data.json';
import fetch from 'node-fetch';
import { mailosaurHTTPHeaders } from './mailosaur_HTTP_headers';
const Mailosaur = require('mailosaur');
const mailosaurApiKey = mailosaurData.mailosaurAPIKey;
const mailosaurServerId = mailosaurData.mailosaurServerId;
const mailosaurClient = new Mailosaur(mailosaurApiKey);
export async function deleteMessagesByIds(messageIds: string[]): Promise<void> {
    const ids = messageIds.join(',');
    const response = await fetch(`https://mailosaur.com/api/messages?server=${mailosaurServerId}&ids=${ids}`, {
      method: 'DELETE',
      headers: mailosaurHTTPHeaders
    });
    if (!response.ok) {
      console.log(`Error deleting messages with ids ${messageIds}: ${response.status} ${response.statusText}`);
      return;
    }
    console.log(`Deleted ${messageIds.length} messages with ids ${messageIds}`);
  }