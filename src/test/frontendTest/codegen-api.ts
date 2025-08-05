import * as readline from 'readline';
import * as fs from 'fs';

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans);
  }));
}

(async () => {
  const url = await prompt('URL de la requête (ex: https://example.com/api/login) : ');
  const method = (await prompt('Méthode HTTP (GET, POST, PUT, DELETE) : ')).toUpperCase();
  const headersInput = await prompt('Headers JSON (ex: {"Content-Type":"application/json"}) ou vide : ');
  const bodyInput = await prompt('Body JSON (ex: {"username":"user","password":"pass"}) ou vide : ');

  const headers = headersInput ? JSON.parse(headersInput) : {};
  const body = bodyInput ? JSON.parse(bodyInput) : null;

  const testName = `test_api_${method.toLowerCase()}_${url.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;

  const testCode = `
import { test, expect } from '@playwright/test';

test('${testName}', async ({ request }) => {
  const response = await request.${method.toLowerCase()}('${url}', {
    ${body ? 'data: ' + JSON.stringify(body, null, 2) + ',' : ''}
    headers: ${JSON.stringify(headers, null, 2)},
  });

  expect(response.ok()).toBeTruthy();
  const responseBody = await response.json();
  console.log('Response:', responseBody);
});
`;

  const fileName = `generated-api-test.spec.ts`;
  fs.writeFileSync(fileName, testCode.trim());
  console.log(`\n✅ Test généré dans le fichier ${fileName}`);
})();
