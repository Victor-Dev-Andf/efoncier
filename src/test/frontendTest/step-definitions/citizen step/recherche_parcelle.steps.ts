import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/custom-world';
import path from 'path';
import fs from 'fs';

setDefaultTimeout(60 * 1000);

Given("l'utilisateur accède à la page {string}", async function (this: CustomWorld, url: string) {
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  // ⏱️ Démarrage tracing
await this.context.tracing.start({ screenshots: true, snapshots: true });

  const start = Date.now();
  await this.page.goto(url);
  const duration = Date.now() - start;

  console.log(`🚀 Temps de chargement initial de la page : ${duration} ms`);
});

When('il saisit {string} dans le champ "Rechercher par NUP"', async function (this: CustomWorld, nup: string) {
  const input = this.page.getByRole('textbox', { name: 'Rechercher par NUP' });
  await input.click();
  await input.fill(nup);
});

When('il clique sur "Aller sur la carte"', async function (this: CustomWorld) {
  const popupPromise = this.page.waitForEvent('popup');
  await this.page.getByText('Aller sur la carte').click();
  this.page1 = await popupPromise;
});

Then('une nouvelle page contenant la carte s\'ouvre', async function (this: CustomWorld) {
  expect(this.page1).toBeDefined();
});

Then('les informations de la parcelle sont affichées', async function (this: CustomWorld) {
  const infoPanel = this.page1.getByRole('dialog', { name: 'Information sur la parcelle' });
  await infoPanel.waitFor({ state: 'visible', timeout: 10000 });
  expect(await infoPanel.isVisible()).toBeTruthy();
});

Then('il ferme la fenêtre d\'information', async function (this: CustomWorld) {
    await this.page1.waitForTimeout(1000);
  await this.page1.getByRole('button', { name: 'Close' }).click();
});

When('il clique sur une autre parcelle sur la carte', async function (this: CustomWorld) {
  const canvas = this.page1.locator('canvas').nth(1);

  await canvas.waitFor({ state: 'visible', timeout: 10000 });

  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas non visible');

  const clickX = Math.floor(box.width * 0.5);
  const clickY = Math.floor(box.height * 0.5);

  await canvas.click({ position: { x: clickX, y: clickY } });

  const infoPanel = this.page1.locator('div').filter({ hasText: /^Information sur la parcelle$/ });
  await infoPanel.waitFor({ state: 'visible', timeout: 10000 });
  await infoPanel.click();
});

Then('les informations de la nouvelle parcelle sont affichées', async function (this: CustomWorld) {
  const newPanel = this.page1.getByRole('dialog', { name: 'Information sur la parcelle' });
  await newPanel.waitFor({ state: 'visible', timeout: 10000 });
  expect(await newPanel.isVisible()).toBeTruthy();

  // 🛑 Fin du tracing et export
  const traceFile = path.join(process.cwd(), 'traces', `trace-${Date.now()}.zip`);
await fs.promises.mkdir(path.dirname(traceFile), { recursive: true });
await this.context.tracing.stop({ path: traceFile });
console.log(`📦 Trace Playwright sauvegardée dans : ${traceFile}`);
});

When('il effectue une nouvelle recherche avec le NUP {string}', async function (this: CustomWorld, nup: string) {
  const searchBox = this.page1.getByRole('textbox', { name: 'Rechercher par NUP ou la' });
  await searchBox.click();
  await searchBox.fill(nup);
  await searchBox.press('Enter'); // Premier appui sur Entrée
  await searchBox.press('Enter'); // Deuxième appui sur Entrée
});

/*When('il clique deux fois sur le bouton de recherche', async function (this: CustomWorld) {
  const searchButton = this.page.getByRole('button', { name: '', exact: true });

  await searchButton.waitFor({ state: 'visible', timeout: 10000 });
  await expect(searchButton).toBeEnabled();

  // 📸 Capture d'écran avant clic
  const screenshotPath = path.join('screenshots', `search-button-${Date.now()}.png`);
  await fs.promises.mkdir(path.dirname(screenshotPath), { recursive: true });
  await searchButton.screenshot({ path: screenshotPath });
  console.log(`📷 Capture du bouton enregistrée : ${screenshotPath}`);

  // ⏳ Pause avant clic
  console.log('⏳ Attente de 30 secondes avant les clics...');
  await this.page.waitForTimeout(30000);

  // 👆 Double clic successif
  await searchButton.click();
  await this.page.waitForTimeout(500);
  await searchButton.click();
});*/


Then('les informations de la parcelle sont affichées à nouveau', async function (this: CustomWorld) {
  const newPanel = this.page1.getByRole('dialog', { name: 'Information sur la parcelle' });
  await newPanel.waitFor({ state: 'visible', timeout: 10000 });
  expect(await newPanel.isVisible()).toBeTruthy();});
 Then('il ferme la fenêtre d\'information encore', async function (this: CustomWorld) {
  // Attendre 15 secondes
  await this.page1.waitForTimeout(2000);

  // Fermer la fenêtre
  await this.page1.getByRole('button', { name: 'Close' }).click();
});
