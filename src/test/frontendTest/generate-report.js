const fs = require('fs');
const path = require('path');

const htmlReportPath = path.join(__dirname, 'reports/cucumber-report.html');
const cssPath = path.join(__dirname, 'custom-theme.css');

if (!fs.existsSync(htmlReportPath)) {
  console.error('❌ Rapport HTML introuvable :', htmlReportPath);
  process.exit(1);
}

if (!fs.existsSync(cssPath)) {
  console.error('❌ Fichier CSS introuvable :', cssPath);
  process.exit(1);
}

// Lire le HTML et le CSS
let htmlContent = fs.readFileSync(htmlReportPath, 'utf8');
const customCss = fs.readFileSync(cssPath, 'utf8');

// Injecter le CSS dans le <head>
htmlContent = htmlContent.replace(
  '</head>',
  `<style>\n${customCss}\n</style>\n</head>`
);

// Sauvegarder le fichier modifié
fs.writeFileSync(htmlReportPath, htmlContent, 'utf8');
console.log('✅ CSS personnalisé injecté dans le rapport HTML.');
