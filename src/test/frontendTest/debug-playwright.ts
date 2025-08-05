import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false }); // UI visible
  const context = await browser.newContext({
    recordVideo: { dir: 'reports/videos/' }
  });

  const page = await context.newPage();
  await page.goto('https://test-efoncier.andf.bj/');

  // Screenshot
  await page.screenshot({ path: 'screenshot.png' });

  // Pause pour laisser le temps à l'UI de s'afficher dans la vidéo
  await page.waitForTimeout(30000);

  await browser.close();
})();
