import { chromium, Browser, Page } from 'playwright-core';

export class WebAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: true });
      this.page = await this.browser.newPage();
    }
  }

  async navigate(url: string): Promise<void> {
    await this.ensureInitialized();
    await this.page!.goto(url);
  }

  async click(selector: string): Promise<void> {
    await this.ensureInitialized();
    await this.page!.click(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    await this.ensureInitialized();
    await this.page!.fill(selector, text);
  }

  async extract(selector: string): Promise<string> {
    await this.ensureInitialized();
    return this.page!.textContent(selector) || '';
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.browser || !this.page) {
      await this.initialize();
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}