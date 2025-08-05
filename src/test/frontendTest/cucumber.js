module.exports = {
  default: {
    // Chemins vers les fichiers .feature
    paths: ['features/**/*.feature'],

    // Step definitions + fichiers de support
    require: ['step-definitions/**/*.ts', 'support/**/*.ts'],

    // Utilise ts-node pour exécuter TypeScript
    requireModule: ['ts-node/register'],

    // Formats de sortie : console + rapport HTML
    format: [
      'progress', // Affichage console simple
      'html:reports/cucumber-report.html' // Génère le rapport HTML
    ],

    // Timeout par scénario (en ms)
    timeout: 10000,

    // Ne pas publier automatiquement sur Cucumber.io
    publishQuiet: true
  }
};
