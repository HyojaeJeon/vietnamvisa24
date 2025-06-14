const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Vietnam Visa Service Development Environment...');

// Start server
const serverProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Start client  
const clientProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit', 
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  serverProcess.kill('SIGINT');
  clientProcess.kill('SIGINT');
  process.exit(0);
});

serverProcess.on('error', (err) => {
  console.error('❌ Server process error:', err);
});

clientProcess.on('error', (err) => {
  console.error('❌ Client process error:', err);
});

console.log('✅ Development servers starting...');
console.log('📊 Server will be available at: http://localhost:5000');
console.log('🌐 Client will be available at: http://localhost:3002');