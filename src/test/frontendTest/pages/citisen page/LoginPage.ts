import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private citoyenLink: Locator;
  private npiInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private errorMessage: Locator;

  constructor(public page: Page) {
    this.citoyenLink = page.getByRole('link', { name: /citoyen/i });
    this.npiInput = page.getByLabel(/numéro personnel/i);
    this.passwordInput = page.getByLabel(/mot de passe/i);
    this.loginButton = page.getByRole('button', { name: /se connecter/i });
    this.errorMessage = page.getByText(/Nom d'utilisateur ou mot de/i);
  }

  // Navigation vers la page d'accueil
  async gotoHomePage() {
    await this.page.goto('https://test-citizen.andf.bj/');
  }

  // Clic sur le lien Citoyen (coin supérieur droit)
  async clickCitoyenLink() {
    await this.citoyenLink.click();
  }

  // Accès direct à l'URL de login (utile si on veut bypasser clics UI)
  async gotoLoginPage() {
  await this.page.goto(
    'https://pprodauth.service-public.bj/citizen/login?client_id=andf-efb&redirect_uri=https:%2F%2Ftest-citizen.andf.bj&scope=openid&response_type=code'
  );
}


  // Connexion avec NPI et mot de passe
  async login(npi: string, password: string) {
    await this.npiInput.fill(npi);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Juste clic sur "Se connecter"
  async submitLogin() {
    await this.loginButton.click();
  }

  // Accès à la liste des parcelles
  async goToParcelles() {
    await this.page.getByRole('heading', { name: /liste[s]? des parcelles/i }).click();
  }

  // Attente d’un message d’erreur si connexion échoue
  async waitForLoginErrorMessage(): Promise<Locator> {
    await this.errorMessage.waitFor({ timeout: 15000 });
    return this.errorMessage;
  }

  // Vérifie si le bouton "Se connecter" est désactivé
  async isLoginButtonDisabled(): Promise<boolean> {
    return this.loginButton.isDisabled();
  }
}
