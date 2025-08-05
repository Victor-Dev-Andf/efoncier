const { exec } = require('child_process');

exec('npx cucumber-js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erreur : ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`stderr : ${stderr}`);
  }
  console.log(`stdout :\n${stdout}`);
});
