import { Page, Locator, expect } from '@playwright/test';

export class DemandeCcdfPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async allerSurEServices() {
    await this.page.getByRole('link', { name: /e-services/i }).click();
  }

  async selectionnerService(serviceName: string) {
    await this.page.getByText(serviceName, { exact: false }).click();
  }

  async confirmerModal() {
    await this.page.getByText("j'ai compris", { exact: true }).click();
  }

  async rechercherParcelle(numeroParcelle: string) {
    const searchBox = this.page.getByRole('searchbox', {
      name: /rechercher une parcelle/i,
    });
    await searchBox.click();
    await searchBox.fill(numeroParcelle);
  }

  async selectionnerProprietaire(nom: string) {
    await this.page.getByRole('heading', { name: nom }).first().click();
  }

  async saisirEmail(email: string) {
    const emailInput = this.page.getByRole('textbox', { name: /adresse mail/i });
    await emailInput.click();
    await emailInput.fill(email);
  }

  async saisirTelephone(tel: string) {
    const telInput = this.page.getByRole('textbox', { name: /tel/i });
    await telInput.click();
    await telInput.fill(tel);
  }

  async televerserFichier(nomFichier: string) {
    await this.page.getByText('ici').click();
    const fichierInput = this.page
      .locator('body')
      .filter({ hasText: /Citoyen Accueil Cadastre/i });
    await fichierInput.setInputFiles(`uploads/${nomFichier}`);
  }

  async cliquerPayer() {
    await this.page.locator('a', { hasText: 'Payer 2000 F CFA' }).click();
  }

  async verifierToastDeConfirmation() {
    const toast = this.page.locator('#liveToastnewowner div');
    await expect(toast).toBeVisible();
  }
}
