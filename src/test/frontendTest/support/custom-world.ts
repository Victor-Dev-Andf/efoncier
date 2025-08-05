// features/support/custom-world.ts
import { BrowserContext, Page } from '@playwright/test';
import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';

export class CustomWorld extends World {
  browser!: any;
  context!: BrowserContext;
  page!: Page;
  page1!: Page; // popup page

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
