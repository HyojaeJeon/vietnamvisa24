#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Kill existing processes
function killExistingProcesses() {
  try {
    spawn('pkill', ['-f', 'nodemon'], { stdio: 'ignore' });
    spawn('pkill', ['-f', 'next dev'], { stdio: 'ignore' });
  } catch (err) {
    // Ignore errors
  }
}

async function startDevelopment() {
  console.log('Starting Vietnam Visa Service...');
  
  killExistingProcesses();
  
  // Wait a moment for processes to clean up
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Start server
  console.log('Starting server on port 5000...');
  const server = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
    shell: true
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Start client
  console.log('Starting client on port 3002...');
  const client = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true
  });
  
  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\nStopping services...');
    server.kill('SIGINT');
    client.kill('SIGINT');
    process.exit(0);
  });
  
  server.on('error', (err) => console.error('Server error:', err));
  client.on('error', (err) => console.error('Client error:', err));
}

startDevelopment().catch(console.error);