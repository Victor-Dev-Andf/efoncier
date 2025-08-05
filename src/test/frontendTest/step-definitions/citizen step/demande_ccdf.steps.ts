import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import path from 'path';
import fs from 'fs';

Given('je suis connecté avec une session utilisateur existante', async function (this: CustomWorld) {
  // Afficher les erreurs console navigateur
  this.page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Erreur console navigateur:', msg.text());
    }
  });

  // Afficher les erreurs page
  this.page.on('pageerror', exception => {
    console.error('Erreur page:', exception);
  });

  await this.initWithSpecificStorage('login_citoyen_Connexion_r_ussie_avec_des_identifiants_valides.json');

  // Aller à la page cible et attendre la navigation complète
  const response = await this.page.goto('https://test-citizen.andf.bj/portail-citoyen/citizens-liste-parcel', {
    waitUntil: 'networkidle', // attend que tout soit chargé
    timeout: 15000,
  });

  // Vérifie que la page a répondu correctement
  if (!response || !response.ok()) {
    throw new Error(`La page n'a pas chargé correctement: status ${response?.status()}`);
  }

  // Attendre un élément significatif visible (exemple : main ou header)
  await this.page.waitForSelector('main, header, body', { timeout: 10000 });

  // Pour debug : capture screenshot si page blanche suspectée
  const content = await this.page.content();
  if (content.length < 10000) { // heuristique simple pour page quasi-vide
    await this.page.screenshot({ path: 'debug_page_vierge.png' });
    throw new Error('La page semble blanche (contenu HTML trop court). Screenshot debug_page_vierge.png créé.');
  }
});

When('je clique sur le lien {string}', async function (this: CustomWorld, lien: string) {
  const lienElement = this.page.getByRole('link', { name: lien });
  await lienElement.waitFor({ state: 'visible', timeout: 5000 });
  await lienElement.click();
});

When('je clique sur le service {string}', async function (this: CustomWorld, service: string) {
  const serviceElement = this.page.getByText(service);
  await serviceElement.waitFor({ state: 'visible', timeout: 5000 });
  await serviceElement.click();
});

When('je clique sur le bouton {string}', async function (this: CustomWorld, bouton: string) {
  const btn = this.page.getByText(bouton, { exact: true });
  await btn.waitFor({ state: 'visible', timeout: 5000 });
  await btn.click();
});

When('je saisis le numéro de parcelle partiel {string}', async function (this: CustomWorld, numero: string) {
  const searchbox = this.page.getByRole('searchbox', { name: /rechercher une parcelle/i });
  await searchbox.waitFor({ state: 'visible', timeout: 5000 });
  await searchbox.click();
  await searchbox.fill(numero);

  // Simuler la touche Entrée après la saisie
  await searchbox.press('Enter');

  // ATTENTION : remplace 'selector-liste-resultats' par le vrai sélecteur qui montre les résultats
  
});


When('je sélectionne le propriétaire {string}', async function (this: CustomWorld, nom: string) {
  const heading = this.page.getByRole('heading', { name: nom }).first();
  await heading.waitFor({ state: 'visible', timeout: 10000 });
  await heading.click();
});

When('je renseigne l\'email {string}', async function (this: CustomWorld, email: string) {
  const input = this.page.getByRole('textbox', { name: /adresse mail/i });
  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.click();
  await input.fill(email);
});

When('je renseigne le téléphone {string}', async function (this: CustomWorld, tel: string) {
  const input = this.page.getByRole('textbox', { name: /tel/i });
  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.click();
  await input.fill(tel);
});

When('je téléverse les fichiers suivants:', async function (this: CustomWorld, dataTable) {
  const fichiers = dataTable.raw().flat();

  const inputFile = this.page.locator('input[type="file"]');

  for (const fichier of fichiers) {
    const cheminFichier = path.resolve(__dirname, '../../uploads', fichier);
    if (!fs.existsSync(cheminFichier)) {
      throw new Error(`❌ Le fichier "${cheminFichier}" est introuvable dans uploads/`);
    }
    await inputFile.setInputFiles(cheminFichier);
  }
});


Then('je dois voir la notification {string} s\'affiche', async function (this: CustomWorld, message: string) {
  const notification = this.page.getByText(message, { exact: false });
  await expect(notification).toBeVisible({ timeout: 10000 }); // tu peux augmenter le timeout si nécessaire
});
Then('je dois voir un message d\'erreur "Veuillez téléverser un fichier"', async function (this: CustomWorld) {
  const toast = this.page.locator('#liveToastnewowner div');
  await expect(toast).toBeVisible({ timeout: 5000 });
});
Then('je dois voir un message d\'erreur "Aucun résultat ne correspond à ce nup"', async function () {
  const errorLocator = this.page.locator('div').filter({ hasText: /^Aucun résultat ne correspond à ce nup$/ }).first();
await expect(errorLocator).toBeVisible({ timeout: 5000 });
});
