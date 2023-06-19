import * as mailosaurData from '../../fixtures/mailosaur_data/mailosaur_data.json';
import { deleteMessagesByIds } from '../email_parser_helpers/mailosaur_API_calls';
const Mailosaur = require('mailosaur');
const mailosaurApiKey = mailosaurData.mailosaurAPIKey;
const mailosaurServerId = mailosaurData.mailosaurServerId;
const mailosaurClient = new Mailosaur(mailosaurApiKey);
export const emailChecker = {
  async mailContentChecker(userEmail: string, subject: string) {
    const searchCriteria = {
      sentTo: userEmail,
      subject: subject,
    };
    let email;
    // Wait for up to 60 seconds for the email to arrive
    const timeout = 60000;
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < timeout) {
      try {
        email = await mailosaurClient.messages.get(mailosaurServerId, searchCriteria);
        break; // Email found, exit loop
      } catch (err) {
        // Email not found yet, retry after a short delay
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
      return email;
  },
}
export const emailCleaner = {
  async deleteMessagesByEmail(userEmail: string): Promise<void> {
    const result = await mailosaurClient.messages.search(mailosaurServerId, {
      sentTo: userEmail,
    });
    if (result.items.length === 0) {
      console.log(`No messages found for email address ${userEmail}`);
      return;
    }
    const messageIds = result.items.map((message) => message.id);
    await deleteMessagesByIds(messageIds);
  }
};