import { test, expect } from '@playwright/test';

test('Authentification et récupération des parcelles citoyen', async ({ request }) => {
  const loginResponse = await request.post(
  'https://pprodauth.service-public.bj/api/citizen/authenticate?prompt=login',
  {
    data: {
      npi: '1314276106',
      passwordData: 'Jesuisleroi1@',
      clientId: 'citizen-portal',
      responseType: 'token',
      scope: 'openid',
      redirectUri: 'https://pprodcitizen.service-public.bj/citizen-portal/login' // ✅ redir autorisée
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
);


  console.log('Status loginResponse:', loginResponse.status());
  const bodyText = await loginResponse.text();
  console.log('Body loginResponse:', bodyText);

  expect(loginResponse.ok()).toBeTruthy();

  const loginData = JSON.parse(bodyText);
  const token = loginData?.accessToken || loginData?.token;

  expect(token).toBeTruthy();
  console.log('✅ Token obtenu:', token);

  // Ensuite, appel des parcelles...
});
