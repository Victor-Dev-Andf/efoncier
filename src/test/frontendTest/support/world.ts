import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import fs from 'fs';
import path from 'path';

export class CustomWorld extends World {
  page!: Page;
  context!: BrowserContext;
  browser!: Browser;
  loginPage!: LoginPage;

  storageStatePath = 'storage/storageState.json';

  // Propriétés injectées par Cucumber dans Before hook
  pickle?: { name: string };
  gherkinDocument?: { uri: string };

  constructor(options: IWorldOptions) {
    super(options);
  }

  private getBrowserType() {
    const browserName = process.env.BROWSER || 'chromium';
    const browserType = { chromium, firefox, webkit }[browserName];
    if (!browserType) {
      throw new Error(`Navigateur non supporté : ${browserName}`);
    }
    return browserType;
  }

  async init() {
    const browserType = this.getBrowserType();

    this.browser = await browserType.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  /**
   * Initialise le contexte avec storageState basé sur le feature et scenario injectés dans le World.
   */
  async initWithStorageAuto() {
    const browserType = this.getBrowserType();

    // Extraction feature et scenario pour construire le nom du fichier de session
    const featureUri = this.gherkinDocument?.uri || 'unknown.feature';
    const featureName = featureUri.split(/[\\/]/).pop()?.replace('.feature', '') || 'unknown';

    const scenarioName = this.pickle?.name || 'unknown_scenario';
    const sanitizedScenarioName = scenarioName.replace(/\s+/g, '_');

    this.storageStatePath = path.resolve('storage', `${featureName}_${sanitizedScenarioName}.json`);

    if (!fs.existsSync(this.storageStatePath)) {
      throw new Error(`Fichier de session introuvable : ${this.storageStatePath}`);
    }

    const storageState = JSON.parse(fs.readFileSync(this.storageStatePath, 'utf-8'));

    this.browser = await browserType.launch({ headless: false });
    this.context = await this.browser.newContext({ storageState });
    this.page = await this.context.newPage();
  }

  async initWithStorage() {
    const browserType = this.getBrowserType();

    if (!fs.existsSync(this.storageStatePath)) {
      throw new Error(`Fichier de session introuvable : ${this.storageStatePath}`);
    }

    const storageState = JSON.parse(fs.readFileSync(this.storageStatePath, 'utf-8'));

    this.browser = await browserType.launch({ headless: false });
    this.context = await this.browser.newContext({ storageState });
    this.page = await this.context.newPage();
  }
async initWithSpecificStorage(filename: string) {
  const browserType = this.getBrowserType();

  this.storageStatePath = path.resolve('storage', filename);

  if (!fs.existsSync(this.storageStatePath)) {
    throw new Error(`Fichier de session introuvable : ${this.storageStatePath}`);
  }

  const storageState = JSON.parse(fs.readFileSync(this.storageStatePath, 'utf-8'));

  this.browser = await browserType.launch({ headless: false });
  this.context = await this.browser.newContext({ storageState });
  this.page = await this.context.newPage();
}

  async saveStorageState() {
    if (!this.context) {
      console.warn('Contexte navigateur non initialisé, impossible de sauvegarder la session');
      return;
    }
    const storageState = await this.context.storageState();
    fs.mkdirSync('storage', { recursive: true });
    fs.writeFileSync(this.storageStatePath, JSON.stringify(storageState, null, 2));
  }

  
}

setWorldConstructor(CustomWorld);
