import { emailChecker } from './mailosaur_email_checker.helper';
import cheerio from 'cheerio';
export const emailLinkFollower = {
  async followLinkAndExtractData(userEmail: string, subject: string, buttonName: string, page: any) {
    const email = await emailChecker.mailContentChecker(userEmail, subject);
    const $ = cheerio.load(email.html.body);
    const button = $(`a:contains("${buttonName}")`);
    if (button.length === 0) {
      throw new Error(`Button "${buttonName}" not found in email with subject "${subject}"`);
    }
    const link = button.attr('href');
    console.log(`Found link for button "${buttonName}" in email: ${link}`);
    await page.goto(link, { waitUntil: 'domcontentloaded' });
  },
};
// export const emailLinkFollower = {
//   async followLinkAndExtractData(userEmail: string, subject: string, buttonName: string, page: any) {
//     const email = await emailChecker.mailContentChecker(userEmail, subject);
//     const buttonRegex = new RegExp(`<a.*?>\\s*${buttonName}\\s*</a>`, 'i');
//     const buttonMatch = email.html.body.match(buttonRegex);
//     if (!buttonMatch) {
//       throw new Error(`Button "${buttonName}" not found in email with subject "${subject}"`);
//     }
//     const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/i;
//     const linkMatch = buttonMatch[0].match(linkRegex);
//     const link = linkMatch[2];
//     console.log(`Found link for button "${buttonName}" in email: ${link}`);
//     await page.goto(link, { waitUntil: "domcontentloaded" });
//   },
// }
export const emailSubjectChecker = {
  async checkEmailSubject(userEmail: string, expectedSubject: string) {
    const response = await emailChecker.mailContentChecker(userEmail, expectedSubject);
    const subject = response.subject;
    return subject;
  },
}