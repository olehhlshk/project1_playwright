import { Locator, Page } from "@playwright/test";
export default class ConsoleSidebarNavigation {
    readonly marketplacesSection: Locator;
    readonly dashboardSection: Locator;
    readonly suppliersSection: Locator;
    readonly ordersSection: Locator;
    readonly catalogSection: Locator;
    readonly accountSection: Locator;
    readonly buyersSection: Locator;
    readonly settingsSection: Locator;
    readonly releaseNotesSection: Locator;
    readonly logOutSection: Locator;
    readonly wholesalesSection: Locator;
    readonly homeSection: Locator;
    readonly categoriesSection: Locator;
    //mobile specific
    private isMobile: boolean | undefined;
    readonly consoleHamburgerButton: Locator;
    readonly recommenderSection: Locator;
    readonly featuredSection: Locator;
    constructor(public page: Page,  isMobile: boolean | undefined)  {
        this.page = page;
        this.marketplacesSection = page.locator('"Marketplaces"');
        this.dashboardSection = page.locator('"Dashboard"');
        this.suppliersSection = page.locator('"Suppliers"');
        this.ordersSection = page.locator('"Orders"').first();
        this.homeSection = page.locator('"Home"');
        this.catalogSection = page.locator('//span[text()="Catalog"]');
        this.accountSection = page.locator('"Accounts"');
        this.buyersSection = page.locator('"Buyers"');
        this.settingsSection = page.locator('"Settings"');
        this.releaseNotesSection = page.locator('"Release Notes"');
        this.logOutSection = page.locator('"Log out"');
        this.wholesalesSection = page.locator('"Wholesale Shop"');
        this.categoriesSection = page.locator('"Categories"');
        //mobile specific
        this.isMobile = isMobile;
        this.consoleHamburgerButton = page.locator('path[d="M17.5 1H14.1667H1.5M17.5 13H14.1667H1.5M17.5 7H7.5H1.5"][stroke="currentColor"][stroke-width="2"][stroke-linecap="round"][stroke-linejoin="round"]');
        this.recommenderSection = page.locator('//span[text()="Recommender"]');
        this.featuredSection = page.locator('//span[text()="Featured"]');
    }
    async goToDashboard() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.dashboardSection.click();
            await this.page.waitForURL('**\/dashboard');
        }
        else {
            await this.dashboardSection.click();
            await this.page.waitForURL('**\/dashboard');
        }
    }
    async goToMarketplaces() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.marketplacesSection.click();
            await this.page.waitForURL('**\/marketplaces');
        }
        else {
            await this.marketplacesSection.click();
            await this.page.waitForURL('**\/marketplaces');
        }
    }
    async goToSuppliers() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.suppliersSection.click();
            await this.page.waitForURL('**\/suppliers');
        }
        else {
            await this.suppliersSection.click();
            await this.page.waitForURL('**\/suppliers');
        }
    }
    async goToOrders() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.ordersSection.click();
            await this.page.waitForURL('**\/orders');
        }
        else {
            await this.ordersSection.click();
            await this.page.waitForURL('**\/orders');
        }
    }
    async goToCatalog() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.catalogSection.click();
            await this.page.waitForLoadState('load');
        }
        else {
            await this.catalogSection.click();
            await this.page.waitForLoadState('load');
        }
    }
    async goToAccounts() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.accountSection.click();
            await this.page.waitForURL('**\/accounts');
        }
        else {
            await this.accountSection.click();
            await this.page.waitForURL('**\/accounts');
        }
    }
    async goToSettings() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.settingsSection.click();
            await this.page.waitForURL('**\/settings/account');
        }
        else {
            await this.settingsSection.click();
            await this.page.waitForURL('**\/settings/account');
        }
    }
    async goToReleaseNotes() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.releaseNotesSection.click();
            await this.page.waitForURL('**\/release-notes');
        }
        else {
            await this.releaseNotesSection.click();
            await this.page.waitForURL('**\/release-notes');
        }
    }
    async goToLogOut() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.logOutSection.click();
        }
        else {
            await this.logOutSection.click();
        }
    }
    async goToWholasales() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.wholesalesSection.click();
            await this.page.waitForURL('**\/shop');
        }
        else {
            await this.wholesalesSection.click();
            await this.page.waitForURL('**\/shop');
        }
    }
    async goToHome() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.homeSection.click();
            await this.page.waitForURL('**\/home');
        }
        else {
            await this.homeSection.click();
            await this.page.waitForURL('**\/home');
        }
    }
    async goToCategories() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.categoriesSection.click();
            await this.page.waitForURL('**\/categories');
        }
        else {
            await this.categoriesSection.click();
            await this.page.waitForURL('**\/categories');
        }
    }
    async goToRecommender() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.recommenderSection.click();
            await this.page.waitForURL('**\/buyers');
        }
        else {
            await this.recommenderSection.click();
            await this.page.waitForURL('**\/buyers');
        }
    }
    async goToFeaturedAsSeller() {
        if (this.isMobile) {
            await this.consoleHamburgerButton.click();
            await this.recommenderSection.click();
            await this.page.waitForURL('**\/featured');
        }
        else {
            await this.featuredSection.click();
            await this.page.waitForURL('**\/featured');
        }
    }
}