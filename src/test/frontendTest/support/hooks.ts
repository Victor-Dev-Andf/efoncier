import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import path from 'path';

// Augmente le timeout par défaut
setDefaultTimeout(30 * 1000);

// 🧼 Fonction utilitaire pour nettoyer les noms de fichiers
function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_');
}

Before(async function (this: CustomWorld, scenario: any) {
  this.pickle = scenario.pickle;
  this.gherkinDocument = scenario.gherkinDocument;

  if (scenario.pickle.name.includes('avec session existante')) {
    await this.initWithSpecificStorage('login_citoyen_Connexion_r_ussie_avec_des_identifiants_valides.json');
  } else {
    await this.init();
  }
});
After(async function (this: CustomWorld, scenario: any) {
  const scenarioName = sanitizeFileName(scenario.pickle.name);
  const featureName = sanitizeFileName(
    scenario.gherkinDocument.uri?.split(/[\\/]/).pop()?.replace('.feature', '') || 'unknown'
  );

  const filename = `${featureName}_${scenarioName}.json`;
  this.storageStatePath = path.resolve('storage', filename);

  console.log(`💾 Enregistrement de la session dans: ${this.storageStatePath}`);

  await this.saveStorageState();

  // 🔚 Nettoie le navigateur proprement
 
});
