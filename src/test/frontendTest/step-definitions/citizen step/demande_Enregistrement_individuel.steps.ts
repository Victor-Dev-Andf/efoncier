import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { DataTable } from '@cucumber/cucumber';
import path from 'path';
import fs from 'fs';

Given('Le citoyen est connecté avec une session utilisateur existante', async function (this: CustomWorld) {
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

When('Le citoyen clique sur le lien {string}', async function (this: CustomWorld, lien: string) {
  const lienElement = this.page.getByRole('link', { name: lien });
  await lienElement.waitFor({ state: 'visible', timeout: 5000 });
  await lienElement.click();
});

When('Le citoyen clique sur le service {string}', async function (this: CustomWorld, service: string) {
  const serviceElement = this.page.getByText(service).first();
  await serviceElement.waitFor({ state: 'visible', timeout: 5000 });
  await serviceElement.click();
});

When('Le citoyen clique sur le bouton {string}', async function (this: CustomWorld, bouton: string) {
  const btn = this.page.getByText(bouton, { exact: true });
  await btn.waitFor({ state: 'visible', timeout: 5000 });
  await btn.click();
});

When('Le citoyen saisit le nom partiel du géomètre {string}', async function (nomPartiel: string) {
  // Essayer avec le rôle textbox
  let searchbox = this.page.getByRole('textbox', { name: /rechercher le géomètre/i });
  
  // Si timeout, essayer par placeholder
  try {
    await searchbox.waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    searchbox = this.page.getByPlaceholder(/rechercher le géomètre/i);
    await searchbox.waitFor({ state: 'visible', timeout: 5000 });
  }

  await searchbox.click();
  await searchbox.fill(nomPartiel);
  await searchbox.press('Enter');

  // Ajouter ici le code pour cliquer sur un résultat, si besoin
});



//When('Le citoyen sélectionne le geometre {string}', async function (this: CustomWorld, nom: string) {
  //const heading = this.page.getByRole('heading', { name: nom }).first();
  //await heading.waitFor({ state: 'visible', timeout: 10000 });
  //await heading.click();
//});

When('Le citoyen les téléverse les fichiers suivants:', async function (this: CustomWorld, dataTable) {
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
When('Le citoyen doit cliquer sur le bouton {string}', async function (this: CustomWorld, libelle: string) {
  const bouton = this.page.getByRole('button', { name: libelle, exact: false });
  await bouton.waitFor({ state: 'visible', timeout: 10000 }); // timeout augmenté
  await bouton.click();
});
Then('la notification {string} s\'affiche', async function (this: CustomWorld, message: string) {
  const notification = this.page.getByText(message, { exact: false });
  await expect(notification).toBeVisible({ timeout: 10000 }); // tu peux augmenter le timeout si nécessaire
});