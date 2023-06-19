import { Locator, Page } from "@playwright/test";
export default class ReleaseNotesPage{
    constructor(public page: Page) {
        this.page = page;
    }
    async interceptNotesListResponse(){
      return await Promise.all([
        this.page.waitForResponse(
          async (response) => {
            return (await response.body()).includes('"__typename":"ReleaseDocumentsList');
          },
          { timeout: 10000 }
      ),
      ]);
    }
    async getFirstNotesFromResponse(){
      const [responseNotesList] = await this.interceptNotesListResponse();
      const responseBodyNotesList = JSON.parse(
        (await responseNotesList.body()).toString()
      );
      return await responseBodyNotesList.data.releaseDocuments.nodes[0];
    }
    async openOpenFirstNotes(text: string) {
        await Promise.all([
            await this.page.getByText((`${text}`)).scrollIntoViewIfNeeded(),
            await this.page.getByText((`${text}`)).click(),
            this.page.waitForLoadState('load')
        ])
    }
    async interceptNotesDetailsResponse(){
        return await Promise.all([
          this.page.waitForResponse(
            async (response) => {
              return (await response.body()).includes('"__typename":"ReleaseNotesList');
            },
            { timeout: 10000 }
        ),
        ]);
      }
      async getNotesDetailsFromResponse(){
        const [responseNotesDetails] = await this.interceptNotesDetailsResponse();
        const responseBodyNotesDetails = JSON.parse(
          (await responseNotesDetails.body()).toString()
        );
        return await responseBodyNotesDetails.data.releaseNotes.nodes;
      }
      async checkNotesDetails(text: string){
        return await this.page.locator('#scrollable-container div').filter({ hasText: `${text}` }).nth(0);
      }
}