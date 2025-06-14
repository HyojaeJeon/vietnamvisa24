const fs = require('fs');
const path = require('path');

// Read the current package.json
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add the dev script if it doesn't exist
if (!packageJson.scripts) {
  packageJson.scripts = {};
}

if (!packageJson.scripts.dev) {
  packageJson.scripts.dev = "node run-dev.js";
}

// Write back the updated package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

console.log('Development script added to package.json');
console.log('You can now run: npm run dev');