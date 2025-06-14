#!/usr/bin/env node

// Simple development runner that mimics npm run dev
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Vietnam Visa Service Development Environment...');

// Function to start a process
function startProcess(command, args, cwd, name) {
  const process = spawn(command, args, {
    cwd: cwd,
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: true
  });
  
  process.on('error', (err) => {
    console.error(`${name} process error:`, err);
  });
  
  return process;
}

// Clean up any existing processes first
try {
  require('child_process').execSync('pkill -f "nodemon index.js" || true', { stdio: 'pipe' });
  require('child_process').execSync('pkill -f "next dev" || true', { stdio: 'pipe' });
} catch (e) {
  // Ignore cleanup errors
}

setTimeout(() => {
  // Start server
  console.log('Starting server on port 5000...');
  const serverProcess = startProcess('npm', ['run', 'dev'], path.join(__dirname, 'server'), 'Server');
  
  // Wait a bit for server to start, then start client
  setTimeout(() => {
    console.log('Starting client on port 3000...');
    const clientProcess = startProcess('npm', ['run', 'dev'], path.join(__dirname, 'client'), 'Client');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down...');
      serverProcess.kill('SIGINT');
      clientProcess.kill('SIGINT');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      serverProcess.kill('SIGTERM');
      clientProcess.kill('SIGTERM');
      process.exit(0);
    });
    
  }, 3000);
  
}, 1000);