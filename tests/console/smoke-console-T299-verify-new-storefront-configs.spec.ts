import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import MarketplacesPage from '../../pages/console/marketplacesPage';
import LandingPage from '../../pages/storefront/landingPage';
import CommonHelperPages from '../../pages/console/commonHelperPages'
import AccountSettingPage from '../../pages/console/settingsPage'
import ZipModalPage from '../../pages/storefront/zipModalPage';
import * as sellerData from '../../fixtures/data/storefront-data.json';
import * as notificationToast from '../../fixtures/toast/toast-messages.json';
import * as buyerData from '../../fixtures/data/buyer-data.json';
import ConsoleSidebarNavigation from '../../pages/console/sidebarNavigation';

test.use({ storageState: './state-storage-files/sellerStorageState.json' });
test('Verify that new storefront config applied on the storefront', async ({ page, isMobile }) => {
    const { consoleURL } = process.env;
    const sidebarNavigation = new ConsoleSidebarNavigation(page, isMobile);
    const landingPage = new LandingPage(page, isMobile);
    const commonHelperPages = new CommonHelperPages(page);
    const marketplacesPage = new MarketplacesPage(page);
    const accountSettingPage = new AccountSettingPage(page, isMobile);
    const zipModal = new ZipModalPage(page);
    const storefrontName = faker.company.name();
    const randomPrimaryColor = faker.color.rgb({ prefix: '', casing: 'upper' });
    const randomSecondaryColor = faker.color.rgb({ prefix: '', casing: 'upper' });
    const storefrontNameHeader = `@ 2023 ${storefrontName}. Powered by SalonHQ`;
    
    await page.goto(`${consoleURL}`, { waitUntil: "load" });
    await sidebarNavigation.goToSettings();
    await accountSettingPage.clickStorefrontConfigurationTab();
    await expect(accountSettingPage.storefrontConfigurationPage).toBeVisible();
    await accountSettingPage.addLogo();
    await accountSettingPage.clickSaveLogoButton();
    await expect(accountSettingPage.logoImage).toBeVisible();
    await accountSettingPage.fillStorefrontNameField(storefrontName);
    await commonHelperPages.getNotification(notificationToast.successfulStorefrontConfigUpdatedNotification);
    await expect(accountSettingPage.storefrontNameField).toHaveValue(storefrontName);
    await accountSettingPage.setPrimaryColor(randomPrimaryColor);
    await accountSettingPage.setSecondaryColor(randomSecondaryColor);
    await accountSettingPage.addLogo();
    await accountSettingPage.clickSaveLogoButton();
    await expect(accountSettingPage.logoImage).toBeVisible();
    if(isMobile){
        await page.isClosed();
    }
    else{
    await accountSettingPage.clickSettingSaveButton();
    await commonHelperPages.getNotification(notificationToast.successfulStorefrontConfigUpdatedNotification);
    const getPrimaryColor = await accountSettingPage.getSavedColorForElement(accountSettingPage.colorPrimaryPicker);
    const getSecondaryColor = await accountSettingPage.getSavedColorForElement(accountSettingPage.colorSecondaryPicker);
    await expect(getPrimaryColor).toBe(randomPrimaryColor);
    await expect(getSecondaryColor).toBe(randomSecondaryColor);
    await accountSettingPage.clickCopyButton();
    await expect(page.getByText('Copied')).toBeVisible();
    const url = await accountSettingPage.copyButton.getAttribute('data-for');
    await page.goto(`${url}`, { waitUntil: 'load' });
    await landingPage.acceptAllCookies();
    await zipModal.updateZip(buyerData.zip);
    await expect((await landingPage.footerPoweredBy.innerText()).valueOf().toLowerCase()).toContain(storefrontNameHeader.toLowerCase());
    const storefrontPrimaryColor = await accountSettingPage.getSavedColorForElement(landingPage.cartIcon);
    const storefrontSecondaryColor = await accountSettingPage.getSavedColorForElement(landingPage.header);
    await expect(storefrontPrimaryColor).toBe(randomPrimaryColor);
    await expect(storefrontSecondaryColor).toBe(randomSecondaryColor);
    }
});