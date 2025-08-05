import { Page } from '@playwright/test';
import type { Frame } from 'playwright'; 

export class CopieCECPage {
  constructor(private readonly page: Page) {}

  async goToEServices() {
    const link = this.page.getByRole('link', { name: /e-services/i });
    await link.waitFor({ state: 'visible' });
    await link.click();
  }

  async selectCopieCEC() {
    const service = this.page.getByText('Copie de CECEn cas de perte');
    await service.waitFor({ state: 'visible' });
    await service.click();
  }

  async acceptConditions() {
    const btn = this.page.getByText("j'ai compris");
    await btn.waitFor({ state: 'visible' });
    await btn.click();
  }

  async searchParcelle(code: string) {
    const searchBox = this.page.getByRole('searchbox', { name: /Rechercher une parcelle/i });
    await searchBox.waitFor({ state: 'visible' });
    await searchBox.click();
    await searchBox.fill(code);
    await searchBox.press('Enter');
  }

  async selectNom(nom: string) {
    const nomElement = this.page.getByRole('heading', { name: nom }).first();
    await nomElement.waitFor({ state: 'visible' });
    await nomElement.click();
  }

  async enterEmail(email: string) {
    const emailInput = this.page.getByRole('textbox', { name: /Adresse mail/i });
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(email);
  }

  async enregistrerDemande() {
    const btn = this.page.getByText('Enregistrer la demande');
    await btn.waitFor({ state: 'visible' });
    await btn.click();

    const confirmation = this.page.getByText('Transaction enregistrée avec');
    await confirmation.waitFor({ state: 'visible' });
    await confirmation.click();
  }

  async payer(nom: string, prenom: string, email: string, telephone: string) {
    const iframeLocator = this.page.locator('iframe[name^="tresorpay_iframe_"]').first();
  const frame = await iframeLocator.contentFrame();
if (!frame) throw new Error("Le formulaire de paiement n'est pas disponible.");

    await frame.getByRole('textbox', { name: 'Nom', exact: true }).fill(nom);
    await frame.getByRole('textbox', { name: 'Prénom' }).fill(prenom);
    await frame.getByRole('textbox', { name: /Adresse E-mail/i }).fill(email);
    await frame.getByRole('textbox', { name: /Numéro de téléphone/i }).fill(telephone);
    await frame.getByRole('button', { name: /Payer/ }).click();
  }

  async openListeDemandes() {
    await this.page.goto('https://test-citizen.andf.bj/portail-citoyen/citizens-liste-demandes', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
  }

  async checkStatutPayée() {
    const statut = this.page.getByText(/Référence Payée Statut/i);
    await statut.waitFor({ state: 'visible' });
    await statut.click();
  }
}
