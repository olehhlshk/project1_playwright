import { Locator, Page } from "@playwright/test";
export default class ConsoleCategoriesPage{
    readonly addCategoryButton: Locator;
    readonly categoryNameField: Locator;
    readonly submitCategoryButton: Locator;
    readonly deleteCategoryButton: Locator;
    readonly submitDeletingButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.addCategoryButton = page.getByRole('button', { name: 'Add Category' });
        this.categoryNameField = page.locator('input[name="name"]');
        this.submitCategoryButton = page.locator('button', { hasText: 'Submit' });
        this.deleteCategoryButton = page.locator('button', { hasText: 'Delete' });
        this.submitDeletingButton = page.locator('(//div[contains(@class,"flex-col gap-2")]//button)[2]');
    }
    async openAddCategoryModal() {
        await this.addCategoryButton.click();
    }
    async fillCategoryName(name: string) {
        await this.categoryNameField.fill(name);
    }
    async submitAddingNewCategory(){
        await this.submitCategoryButton.click();
        await this.page.waitForLoadState('load');
    }
    async addNewCategory(name: string){
        await this.openAddCategoryModal();
        await this.fillCategoryName(name);
        await this.submitAddingNewCategory();
    }
    async findCategoryOnThePage(name: string) {
        return await this.page.locator(`text=${name}`);
    }
      async openCategoryDetails(name: string) {
        await this.page.locator(`text=${name}`).scrollIntoViewIfNeeded();
        await this.page.locator(`text=${name}`).click();
        await this.page.waitForLoadState('load');
    }
    async deleteCategory(){
        await this.deleteCategoryButton.click();
        await this.submitDeletingButton.isVisible();
        await this.submitDeletingButton.click();
        await this.page.waitForLoadState('load')
    }
}