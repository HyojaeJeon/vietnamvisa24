#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  console.log('Starting Vietnam Visa Service...');
  
  // Kill any existing processes
  try {
    execSync('pkill -f "nodemon" || true', { stdio: 'inherit' });
    execSync('pkill -f "next" || true', { stdio: 'inherit' });
  } catch (err) {
    // Ignore errors when killing processes
  }
  
  // Start server in background
  console.log('Starting server...');
  const serverProcess = require('child_process').spawn('npm', ['run', 'dev'], {
    cwd: './server',
    stdio: 'inherit',
    detached: false
  });
  
  // Wait a moment then start client
  setTimeout(() => {
    console.log('Starting client...');
    const clientProcess = require('child_process').spawn('npm', ['run', 'dev'], {
      cwd: './client', 
      stdio: 'inherit',
      detached: false
    });
    
    clientProcess.on('error', (err) => {
      console.error('Client error:', err);
    });
  }, 2000);
  
  serverProcess.on('error', (err) => {
    console.error('Server error:', err);
  });
  
} catch (error) {
  console.error('Startup error:', error);
  process.exit(1);
}