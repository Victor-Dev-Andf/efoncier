// script.codegen.ts
await page.goto("https://test-citizen.andf.bj/");
await page.getByRole('link', { name: 'Citoyen' }).click();
await page.getByLabel('Numéro personnel').fill('1314276106');
await page.getByLabel('Mot de passe').fill('Jesuisleroi1@');
await page.getByRole('button', { name: 'Se connecter' }).click();