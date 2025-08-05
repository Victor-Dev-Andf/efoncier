const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const featureDir = path.join(__dirname, 'features');
const reportDir = path.join(__dirname, 'reports');
const reportFile = 'cucumber-report.html';
const jsonFile = path.join(reportDir, 'cucumber-report.json');
const historyDir = path.join(reportDir, 'history');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/reports', express.static(reportDir));

let clients = [];

function broadcastLog(message) {
  clients.forEach(res => res.write(`data: ${message}\n\n`));
}

app.get('/progress', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  console.log('✅ Client SSE connecté');
  res.write('data: 🔄 Connexion au serveur de log établie\n\n');
  clients.push(res);

  req.on('close', () => {
    console.log('❌ Client SSE déconnecté');
    clients = clients.filter(c => c !== res);
  });
});

app.get('/sse-test', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  let count = 0;
  const interval = setInterval(() => {
    res.write(`data: Ping ${++count}\n\n`);
    if (count >= 5) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);
});

function extractScenarios(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8').split('\n');
  const scenarios = [];
  let currentTags = [];

  for (let line of content) {
    line = line.trim();
    if (line.startsWith('@')) {
      currentTags = line.split(/\s+/).map(tag => tag.replace('@', ''));
    }
    if (/^(Scenario|Scénario|Scenario Outline|Scénario Exemple):/i.test(line)) {
      const name = line.replace(/^(Scenario|Scénario|Scenario Outline|Scénario Exemple):/i, '').trim();
      scenarios.push({ name, tags: [...currentTags] });
      currentTags = [];
    }
  }

  return scenarios;
}

function parseTestCounts() {
  if (!fs.existsSync(jsonFile)) return { passed: 0, failed: 0 };
  try {
    const data = JSON.parse(fs.readFileSync(jsonFile));
    const elements = data.flatMap(f => f.elements || []);
    const passed = elements.filter(s => s.steps.every(st => st.result.status === 'passed')).length;
    const failed = elements.filter(s => s.steps.some(st => st.result.status === 'failed')).length;
    return { passed, failed };
  } catch {
    return { passed: 0, failed: 0 };
  }
}

function getStatus() {
  if (!fs.existsSync(jsonFile)) return '⏳ En attente';
  let current;
  try {
    current = JSON.parse(fs.readFileSync(jsonFile));
  } catch {
    return '⚠️ JSON invalide';
  }

  const dirs = fs.existsSync(historyDir) ? fs.readdirSync(historyDir).sort() : [];
  const lastDir = dirs.at(-1);
  if (!lastDir || !fs.existsSync(path.join(historyDir, lastDir, 'cucumber-report.json'))) {
    return '⏳ Première exécution';
  }

  const previous = JSON.parse(fs.readFileSync(path.join(historyDir, lastDir, 'cucumber-report.json')));
  const currentFailed = current.flatMap(f => f.elements || []).filter(s => s.steps.some(st => st.result.status === 'failed')).length;
  const prevFailed = previous.flatMap(f => f.elements || []).filter(s => s.steps.some(st => st.result.status === 'failed')).length;

  if (currentFailed > prevFailed) return '❌ Régression';
  if (currentFailed < prevFailed) return '✅ Progression';
  return '✔️ Stable';
}

function runCommand(command) {
  broadcastLog(`▶️ Exécution : ${command}`);
  const child = exec(command);

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', data => {
    process.stdout.write(data);
    broadcastLog(data);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', data => {
    process.stderr.write(data);
    broadcastLog(`ERREUR: ${data}`);
  });

  child.on('close', code => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
    const historyPath = path.join(historyDir, timestamp);
    fs.mkdirSync(historyPath, { recursive: true });

    if (fs.existsSync(jsonFile)) fs.copyFileSync(jsonFile, path.join(historyPath, 'cucumber-report.json'));
    if (fs.existsSync(path.join(reportDir, reportFile))) {
      fs.copyFileSync(path.join(reportDir, reportFile), path.join(historyPath, reportFile));
    }

    fs.writeFileSync(path.join(historyPath, 'meta.json'), JSON.stringify({
      command,
      executedAt: new Date().toISOString()
    }, null, 2));

    broadcastLog(`✅ Tests terminés (code ${code})\nArchivés dans : ${timestamp}`);
  });
}

app.get('/', (req, res) => {
  const featureFiles = fs.readdirSync(featureDir).filter(f => f.endsWith('.feature'));
  const status = getStatus();
  const { passed, failed } = parseTestCounts();

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>🎯 Tests interface Utilisateur</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #f2f2f2; padding: 20px; color: #333; }
    h2 { text-align: center; color: #007bff; }
    .status { text-align: center; font-size: 1.3em; margin-bottom: 10px; }
    .stats { text-align: center; font-size: 1.1em; color: #555; margin-bottom: 20px; }
    .container { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .card { background: #fff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 16px; }
    button { background-color: #007bff; border: none; color: white; padding: 10px 16px; margin-top: 10px; border-radius: 6px; cursor: pointer; font-weight: 500; }
    button:hover { background-color: #0056b3; }
    a { margin-right: 10px; text-decoration: none; color: #007bff; }
    a:hover { text-decoration: underline; }
    pre { background: #1e1e1e; color: #00ff00; padding: 15px; height: 280px; overflow-y: auto; border-radius: 8px; margin-top: 20px; }
    label { display: block; margin-top: 8px; }
    .footer-buttons { text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <h2>🧪 Interface de test Utilisateur (Version 1)</h2>
  <div class="status">🔁 Dernier statut : <strong>${status}</strong></div>
  <div class="stats">✅ Passés : <strong>${passed}</strong> | ❌ Échoués : <strong>${failed}</strong></div>

  <form method="POST">
    <div class="container">
      ${featureFiles.map(f => {
        const scenarios = extractScenarios(path.join(featureDir, f));
        return `
        <div class="card">
          <label><input type="checkbox" name="selectedFeatures" value="${f}"> <strong>${f}</strong></label>
          <div>
            ${scenarios.map(s => `
              <label><input type="checkbox" name="scenarioTags" value="${s.tags.join(',')}">
              ${s.name} (${s.tags.map(t => '@' + t).join(', ')})</label>
            `).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="footer-buttons">
      <button type="submit" formaction="/run-tags">🚀 Lancer les scénarios sélectionnés</button>
      <button type="submit" formaction="/run-features">📂 Lancer les features sélectionnées</button>
      <button type="submit" formaction="/run-all">🌍 Lancer tous les tests</button>
  </form>

  <a href="/reports/${reportFile}" target="_blank">📊 Voir le rapport</a>
  <a href="/download">📥 Télécharger</a>
  <form method="POST" action="/cleanup" style="display:inline">
    <button type="submit">🧹 Nettoyer</button>
  </form>

  <h3>📡 Log en direct</h3>
  <pre id="liveLog"></pre>

  <script>
    const source = new EventSource('/progress');
    const log = document.getElementById('liveLog');

    source.onmessage = event => {
      log.textContent += event.data + "\\n";
      log.scrollTop = log.scrollHeight;
    };

    source.onerror = () => {
      log.textContent += "\\n🚫 Connexion au serveur interrompue.\\n";
      source.close();
    };
  </script>

  <footer style="text-align: center; margin-top: 40px; font-size: 0.95em; color: #777;">
  🛠️ Interface de test conçue avec passion par <strong>QA junior Engineer Houessou Victor</strong> – Tous droits réservés © 2025
  </footer>
</body>
</html>`;

  res.send(html);
});

app.post('/run-all', (req, res) => {
  runCommand(`npx cucumber-js features --format html:${reportDir}/${reportFile} --format json:${jsonFile}`);
  res.send(`<script>setTimeout(() => { window.location.href = "/" }, 3000);</script>Tests en cours...`);
});

app.post('/run-tags', (req, res) => {
  const feature = req.body.feature;
  let selectedTags = req.body.scenarioTags;

  if (!feature && !selectedTags) {
    broadcastLog('❌ Aucun test sélectionné');
    return res.send(`<script>setTimeout(() => { window.location.href = "/" }, 3000);</script>Aucune sélection.`);
  }

  let command = '';
  if (feature && !selectedTags) {
    command = `npx cucumber-js features/${feature} --format html:${reportDir}/${reportFile} --format json:${jsonFile}`;
  } else {
    if (!Array.isArray(selectedTags)) selectedTags = [selectedTags];
    const tagsSet = new Set();
    selectedTags.forEach(tg => tg.split(',').forEach(tag => tagsSet.add(tag)));
    const tagExpr = [...tagsSet].map(t => `@${t}`).join(' or ');
    command = `npx cucumber-js features/${feature || ''} --tags "${tagExpr}" --format html:${reportDir}/${reportFile} --format json:${jsonFile}`;
  }

  runCommand(command);
  res.send(`<script>setTimeout(() => { window.location.href = "/" }, 3000);</script>Tests en cours...`);
});

app.post('/run-features', (req, res) => {
  let selected = req.body.selectedFeatures;
  if (!selected) {
    broadcastLog('❌ Aucune feature sélectionnée');
    return res.send(`<script>setTimeout(() => { window.location.href = "/" }, 3000);</script>Rien à exécuter.`);
  }

  if (!Array.isArray(selected)) selected = [selected];
  const featuresArgs = selected.map(f => `features/${f}`).join(' ');
  const command = `npx cucumber-js ${featuresArgs} --format html:${reportDir}/${reportFile} --format json:${jsonFile}`;

  runCommand(command);
  res.send(`<script>setTimeout(() => { window.location.href = "/" }, 3000);</script>Tests en cours...`);
});

app.post('/cleanup', (req, res) => {
  [path.join(reportDir, reportFile), jsonFile].forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
        broadcastLog(`🧹 Supprimé : ${path.basename(file)}`);
      } catch (err) {
        broadcastLog(`⚠️ Erreur suppression ${file} : ${err.message}`);
      }
    }
  });
  res.send(`<script>setTimeout(() => { window.location.href = "/" }, 2000);</script>Nettoyage terminé.`);
});

app.get('/download', (req, res) => {
  const file = path.join(reportDir, reportFile);
  if (fs.existsSync(file)) {
    res.download(file);
  } else {
    res.status(404).send('❌ Rapport non trouvé.');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Interface de test accessible : http://localhost:${port}`);
});
