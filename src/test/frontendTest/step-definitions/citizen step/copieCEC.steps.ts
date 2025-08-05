import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import path from 'path';
import fs from 'fs';

Given("l'utilisateur est sur la page d'accueil du portail citoyen", async function (this: CustomWorld) {
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
  if (content.length < 1000) { // heuristique simple pour page quasi-vide
    await this.page.screenshot({ path: 'debug_page_vierge.png' });
    throw new Error('La page semble blanche (contenu HTML trop court). Screenshot debug_page_vierge.png créé.');
  }
});

When('il clique sur le lien {string}', async function (this: CustomWorld, lien: string) {
  const lienElement = this.page.getByRole('link', { name: lien });
  await lienElement.waitFor({ state: 'visible', timeout: 5000 });
  await lienElement.click();
});

When('il va cliquer sur le service {string}', async function (this: CustomWorld, service: string) {
  const serviceElement = this.page.getByText(service);
  await serviceElement.waitFor({ state: 'visible', timeout: 10000 });
  await serviceElement.click();
});

When('il clique sur le bouton {string}', async function (this: CustomWorld, bouton: string) {
  const btn = this.page.getByText(bouton, { exact: true });
  await btn.waitFor({ state: 'visible', timeout: 5000 });
  await btn.click();
});

When('il saisit le numéro de parcelle partiel {string}', async function (this: CustomWorld, numero: string) {
  const searchbox = this.page.getByRole('searchbox', { name: /rechercher une parcelle/i });
  await searchbox.waitFor({ state: 'visible', timeout: 5000 });
  await searchbox.click();
  await searchbox.fill(numero);

  // Simuler la touche Entrée après la saisie
  await searchbox.press('Enter');

  // ATTENTION : remplace 'selector-liste-resultats' par le vrai sélecteur qui montre les résultats
  
});
When('il sélectionne le propriétaire {string}', async function (this: CustomWorld, nom: string) {
  const heading = this.page.getByRole('heading', { name: nom }).first();
  await heading.waitFor({ state: 'visible', timeout: 5000 });
  await heading.click();
  
});

When('il va saisir son adresse email {string}', async function (this: CustomWorld, email: string) {
  const input = this.page.getByRole('textbox', { name: /adresse mail/i });
  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.click();
  await input.fill(email);
});



When('l\'utilisateur a cliqué sur {string}', async function (texte: string) {
  // Attendre quelques secondes avant de cliquer (par exemple 2 secondes)
  await this.page.waitForTimeout(1000);  // Attendre 2000 ms (2 secondes)

  // Cliquer sur l'élément avec le texte exact
  await this.page.getByText(texte, { exact: true }).click();
});

Given('l\'utilisateur voit {string}', async function (texte) {
  await this.page.getByText(texte, { exact: false }).waitFor({ state: 'visible' });
  
});

// 🟩 Nom
When('l\'utilisateur saisit {string} comme nom', { timeout: 60000 }, async function (nom: string) {
  const inputNom = this.page
    .frameLocator('iframe[name^="tresorpay_iframe_"]')
    .getByPlaceholder('Entrez votre nom'); // plus fiable que getByRole

  await inputNom.waitFor({ state: 'visible' });
  await inputNom.fill(nom);
});

// 🟩 Prénom
When('l\'utilisateur saisit {string} comme prénom', async function (prenom: string) {
  const inputPrenom = this.page
    .frameLocator('iframe[name^="tresorpay_iframe_"]')
    .getByPlaceholder('Entrez le prénom');

  await inputPrenom.waitFor({ state: 'visible' });
  await inputPrenom.fill(prenom);
});

// 🟩 Email
When('l\'utilisateur saisit {string} comme adresse e-mail', async function (email: string) {
  const inputEmail = this.page
    .frameLocator('iframe[name^="tresorpay_iframe_"]')
    .getByPlaceholder(/adresse e-mail/i); // tolère variations d'accents

  await inputEmail.waitFor({ state: 'visible' });
  await inputEmail.fill(email);
});

// 🟩 Opérateur
When('l\'utilisateur choisit l\'opérateur {string}', { timeout: 60000 }, async function (operateur: string) {
  const frame = this.page.frameLocator('iframe[name^="tresorpay_iframe_"]');
  const select = frame.locator('select');

  await select.waitFor({ state: 'visible', timeout: 30000 });

  const options = await select.locator('option').allTextContents();
  console.log('📋 Options visibles dans le select :', options);

  // Sélectionner par label ou valeur selon ce que tu vois dans les logs
  await select.selectOption({ label: operateur }).catch(async () => {
    console.warn(`⚠️ Échec avec value="${operateur}", tentative avec value...`);
    await select.selectOption({ value: operateur });
  });
});


When('l\'utilisateur saisit {string} comme numéro de téléphone', { timeout: 60000 }, async function (numero: string) {
  const inputPhone = this.page
    .frameLocator('iframe[name^="tresorpay_iframe_"]') // Sélecteur générique pour iframe dynamique
    .getByPlaceholder(/numéro/i); // Ou adapte selon le placeholder exact

  await inputPhone.waitFor({ state: 'visible' });
  await inputPhone.fill(numero);
});

When('l\'utilisateur clique sur le bouton {string}', { timeout: 60000 }, async function (libelle: string) {
  const bouton = this.page
    .frameLocator('iframe[name^="tresorpay_iframe_"]')
    .getByRole('button', { name: libelle, exact: false });

  await bouton.waitFor({ state: 'visible' });
  await bouton.click();
});


Then('le résumé de la transaction contenant {string} s\'affiche', { timeout: 60000 }, async function (texte: string) {
  const resumeLocator = this.page
    .frameLocator('iframe[name^="tresorpay_iframe_"]')
    .getByText(texte, { exact: false });

  await resumeLocator.waitFor({ state: 'visible' });
});

Then('le reçu contenant {string} s\'affiche', async function (texte: string) {
  try {
    const locator = this.page
      .frameLocator('iframe[name^="tresorpay_iframe_"]')
      .getByText(texte, { exact: false });

    console.log(`⏳ Attente du reçu contenant "${texte}" dans l'iframe...`);
    
    await locator.waitFor({ state: 'visible', timeout: 120000 });
    console.log('✅ Reçu visible !');
  } catch (e) {
    console.error(`❌ Reçu "${texte}" introuvable ou pas visible après 30s.`);
    throw e;
  }
});


