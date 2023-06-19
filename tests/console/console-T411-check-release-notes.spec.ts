import { test, expect } from '@playwright/test';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import * as adminData from '../../fixtures/data/automation-seller-data.json'
import * as pageName from '../../fixtures/page_names/consolePageNames.json';
import CommonHelperPages from '../../pages/console/commonHelperPages';
import ReleaseNotesPage from '../../pages/console/releaseNotesPage';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';

test.describe("console-T411-check-release-notes", () => {
    test.use({ storageState: './state-storage-files/supervisorStorageState.json' });
    test('open release notes  as Supervisor', async ({ page, isMobile }) => {
        const { consoleURL } = process.env;
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const commonHelperPages = new CommonHelperPages(page);
        const releaseNotesPage = new ReleaseNotesPage(page);

        await page.goto(`${consoleURL}`, { waitUntil: "load" });
        await sidebarNavigation.goToReleaseNotes();
        await expect(await commonHelperPages.checkPageName(pageName.releaseNotes)).toBeVisible();
        const releaseNotesList = await releaseNotesPage.getFirstNotesFromResponse();
        await releaseNotesPage.openOpenFirstNotes(releaseNotesList.name);
        const releaseNotesDetails = await releaseNotesPage.getNotesDetailsFromResponse();
        await expect(await releaseNotesPage.checkNotesDetails(releaseNotesDetails.nodes?.name ?? "")).toBeVisible();
    });
});

test.describe("console-T411-check-release-notes", () => {
    test.use({ storageState: './state-storage-files/mpoStorageStage.json' });
    test('open release notes as MPO', async ({ page, isMobile }) => {
        const { consoleURL } = process.env;
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const commonHelperPages = new CommonHelperPages(page);
        const releaseNotesPage = new ReleaseNotesPage(page);
        const marketplacesPage = new MarketplacesPage(page);

        await page.goto(`${consoleURL}`, { waitUntil: "load" });
        await sidebarNavigation.goToReleaseNotes();
        await expect(await commonHelperPages.checkPageName(pageName.releaseNotes)).toBeVisible();
        const releaseNotesList = await releaseNotesPage.getFirstNotesFromResponse();
        await releaseNotesPage.openOpenFirstNotes(releaseNotesList.name);
        const releaseNotesDetails = await releaseNotesPage.getNotesDetailsFromResponse();
        await expect(await releaseNotesPage.checkNotesDetails(releaseNotesDetails.nodes?.name ?? "")).toBeVisible();
    });
});

test.describe("console-T411-check-release-notes", () => {
    test.use({ storageState: './state-storage-files/sellerStorageState.json' });
    test('open release notes as Seller', async ({ page, isMobile }) => {
        const { consoleURL } = process.env;
        const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
        const commonHelperPages = new CommonHelperPages(page);
        const releaseNotesPage = new ReleaseNotesPage(page);
        const marketplacesPage = new MarketplacesPage(page);
        
        await page.goto(`${consoleURL}`, { waitUntil: "load" });
        await sidebarNavigation.goToReleaseNotes();
        await expect(await commonHelperPages.checkPageName(pageName.releaseNotes)).toBeVisible();
        const releaseNotesList = await releaseNotesPage.getFirstNotesFromResponse();
        await releaseNotesPage.openOpenFirstNotes(releaseNotesList.name);
        const releaseNotesDetails = await releaseNotesPage.getNotesDetailsFromResponse();
        await expect(await releaseNotesPage.checkNotesDetails(releaseNotesDetails.nodes?.name ?? "")).toBeVisible();
    });
});