import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CustomWorld } from '../../support/world';

let loginPage: LoginPage;

/**
 * Étape : Accès à la page d'accueil du portail Citoyen
 */
Given('je suis sur la page d\'accueil du portail Citoyen', async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.gotoHomePage();
});

/**
 * Étape : Clic sur le bouton "Citoyen" en haut à droite
 */
When('je clique sur le bouton "Citoyen" situé dans le coin supérieur droit', async function (this: CustomWorld) {
  await loginPage.clickCitoyenLink();
});

/**
 * Étape : Connexion avec NPI et mot de passe
 */
When('je saisis le NPI {string} et le mot de passe {string}', async function (this: CustomWorld, npi: string, password: string) {
  await loginPage.login(npi, password);

});

/**
 * Étape : Connexion réussie
 */
Then('je vois la liste des parcelles', async function (this: CustomWorld) {
  await expect(this.page.getByRole('heading', { name: /liste[s]? des parcelles/i })).toBeVisible({ timeout: 15000 });
  
});


/**
 * Étape : Message d’erreur pour identifiants incorrects
 */
Then('un message d’erreur s’affiche indiquant que le nom d\'utilisateur ou le mot de passe est incorrect', async function () {
  const message = await loginPage.waitForLoginErrorMessage();
  expect(await message.isVisible()).toBeTruthy();
});

/**
 * Étape : Bouton "Se connecter" désactivé
 */
Then('le bouton "Se connecter" est désactivé', async function () {
  const isDisabled = await loginPage.isLoginButtonDisabled();
  expect(isDisabled).toBeTruthy();
});
