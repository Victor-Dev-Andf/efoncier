import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    screenshot: 'on', // Capture à chaque étape
    video: 'off',      // Vidéo pour chaque test
      trace: 'on', 
  },
  reporter: [['html', { outputFolder: 'reports/html-report', open: 'never' }]],

  // Exécution multi-navigateurs
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
