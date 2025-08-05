import { test, expect } from '@playwright/test';

test('test_api_post_https___pprodauth_service_public_bj_citizen_login_client_id_andf_efb_redirect_uri_https___test_citizen_andf_bj', async ({ request }) => {
  const response = await request.post('https://pprodauth.service-public.bj/citizen/login?client_id=andf-efb&redirect_uri=https://test-citizen.andf.bj', {
    data: {
  "username": "1314276106",
  "password": "Jesuisleroi1@"
},
    headers: {
  "Content-Type": "application/json",
  "Accept": "application/json"
},
  });

  expect(response.ok()).toBeTruthy();
  const responseBody = await response.json();
  console.log('Response:', responseBody);
});