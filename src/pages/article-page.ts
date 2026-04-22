import { expect, type Locator, type Page } from "@playwright/test";

type ArticleData = {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
};

export class ArticlePage {
  readonly page: Page;
  readonly newArticleLink: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly bodyInput: Locator;
  readonly tagsInput: Locator;
  readonly publishButton: Locator;
  readonly editArticleLink: Locator;
  readonly deleteArticleButton: Locator;
  readonly commentInput: Locator;
  readonly postCommentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newArticleLink = page.getByRole("link", { name: "New Article" });
    this.titleInput = page.getByPlaceholder("Article Title");
    this.descriptionInput = page.getByPlaceholder("What's this article about?");
    this.bodyInput = page.getByPlaceholder("Write your article (in markdown)");
    this.tagsInput = page.getByPlaceholder("Enter tags");
    this.publishButton = page.getByRole("button", { name: "Publish Article" });
    this.editArticleLink = page.getByRole("link", { name: "Edit Article" }).first();
    this.deleteArticleButton = page.getByRole("button", { name: "Delete Article" }).first();
    this.commentInput = page.getByPlaceholder("Write a comment...");
    this.postCommentButton = page.getByRole("button", { name: "Post Comment" });
  }

  async openEditor() {
    await this.newArticleLink.click();
    await expect(this.page).toHaveURL(/.*\/editor/);
  }

  async openArticle(slug: string) {
    await this.page.goto(`/article/${slug}`);
    await expect(this.page).toHaveURL(new RegExp(`/article/${slug}$`));
  }

  async fillArticleForm(articleData: ArticleData) {
    await this.titleInput.fill(articleData.title);
    await this.descriptionInput.fill(articleData.description);
    await this.bodyInput.fill(articleData.body);

    for (const tag of articleData.tagList ?? []) {
      await this.tagsInput.fill(tag);
      await this.tagsInput.press("Enter");
    }
  }

  async publish() {
    await this.publishButton.click();
  }

  async openEditArticle() {
    await this.editArticleLink.click();
    await expect(this.page).toHaveURL(/.*\/editor\/.+/);
  }

  async deleteArticle() {
    await this.deleteArticleButton.click();
  }

  async addComment(commentBody: string) {
    await this.commentInput.fill(commentBody);
    await this.postCommentButton.click();
  }

  async updateArticleForm(articleData: ArticleData) {
    await this.titleInput.fill(articleData.title);
    await this.descriptionInput.fill(articleData.description);
    await this.bodyInput.fill(articleData.body);
  }

  async expectArticleCreated(articleData: ArticleData, username: string) {
    await expect(this.page).toHaveURL(/.*\/article\/.+/);
    await expect(this.page.getByRole("heading", { name: articleData.title })).toBeVisible();
    await expect(this.page.getByText(articleData.body)).toBeVisible();
    await expect(this.page.getByRole("link", { name: username }).first()).toBeVisible();

    for (const tag of articleData.tagList ?? []) {
      await expect(this.page.getByText(tag, { exact: true })).toBeVisible();
    }
  }

  async expectArticleUpdated(articleData: ArticleData, username: string) {
    await expect(this.page).toHaveURL(/.*\/article\/.+/);
    await expect(this.page.getByRole("heading", { name: articleData.title })).toBeVisible();
    await expect(this.page.getByText(articleData.body)).toBeVisible();
    await expect(this.page.getByRole("link", { name: username }).first()).toBeVisible();
  }

  async expectArticleDeleted(slug: string, title: string) {
    await expect(this.page).toHaveURL(/.*\/$/);
    await this.page.goto(`/article/${slug}`);
    await expect(this.page.getByRole("heading", { name: title })).toBeHidden();
  }

  async expectCommentCreated(commentBody: string, username: string) {
    await expect(this.page.getByText(commentBody)).toBeVisible();
    await expect(this.page.getByRole("link", { name: username }).first()).toBeVisible();
  }
}
