const fs = require('fs');
const path = require('path');

const reportDir = './reports';
const originalFile = path.join(reportDir, 'cucumber-report.html');

// Format horodaté : YYYY-MM-DD_HH-MM
const now = new Date();
const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
const newFileName = `cucumber-report_${timestamp}.html`;
const newFilePath = path.join(reportDir, newFileName);
const latestFilePath = path.join(reportDir, 'cucumber-report-latest.html');

// Lire le contenu original
let content = fs.readFileSync(originalFile, 'utf-8');

// Supprimer la section "meta": {...}
content = content.replace(/"meta":\s*\{[^}]+\},?/, '');

// Supprimer le logo SVG dans la balise <link rel="icon" ...>
content = content.replace(/<link rel="icon"[^>]+>/, '');

// Sauvegarder sous nouveau nom avec horodatage
fs.writeFileSync(newFilePath, content);

// Sauvegarder aussi une version simple "latest"
fs.writeFileSync(latestFilePath, content);

console.log(`✅ Rapport nettoyé et sauvegardé :
🕓 ${newFileName}
🕓 ${path.basename(latestFilePath)} (copie rapide)`);
