// install-browsers.js
const { installBrowsersForNpmInstall } = require('@playwright/test/lib/utils/browsers');

(async () => {
  try {
    console.log('📦 Installation des navigateurs Playwright...');
    await installBrowsersForNpmInstall();
    console.log('✅ Navigateurs installés avec succès !');
  } catch (err) {
    console.error('❌ Échec de l’installation des navigateurs :', err);
    process.exit(1);
  }
})();
