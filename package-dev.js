const { execSync } = require('child_process');

console.log('Vietnam Visa Service - Starting Development Mode');

try {
  // Clean up any existing processes
  try {
    execSync('pkill -f "nodemon index.js" || true', { stdio: 'pipe' });
    execSync('pkill -f "next dev" || true', { stdio: 'pipe' });
  } catch (e) {
    // Ignore cleanup errors
  }
  
  console.log('Starting server and client...');
  
  // Use the concurrently package that's already installed
  execSync('npx concurrently "cd server && npm run dev" "cd client && npm run dev"', {
    stdio: 'inherit',
    cwd: __dirname
  });
  
} catch (error) {
  console.error('Development startup failed:', error.message);
  process.exit(1);
}