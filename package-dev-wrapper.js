#!/usr/bin/env node

// This script acts as the missing "dev" command for the root package.json
// It properly starts both the server and client with correct port configurations

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if we're being called as "npm run dev"
const isNpmRun = process.argv.some(arg => arg.includes('npm') || arg.includes('dev'));

function log(message) {
  console.log(`[DEV] ${message}`);
}

function killExistingProcesses() {
  try {
    require('child_process').execSync('pkill -f "nodemon index.js" 2>/dev/null || true', { stdio: 'pipe' });
    require('child_process').execSync('pkill -f "next dev" 2>/dev/null || true', { stdio: 'pipe' });
    require('child_process').execSync('pkill -f "node index.js" 2>/dev/null || true', { stdio: 'pipe' });
  } catch (e) {
    // Ignore cleanup errors
  }
}

function startServer() {
  return new Promise((resolve) => {
    log('Starting server on port 5000...');
    const server = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'server'),
      stdio: 'inherit',
      shell: true
    });
    
    server.on('error', (err) => {
      console.error('Server error:', err);
    });
    
    // Give server time to start
    setTimeout(resolve, 4000);
    return server;
  });
}

function startClient() {
  return new Promise((resolve) => {
    log('Starting client on port 3000...');
    const client = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'client'),
      stdio: 'inherit', 
      shell: true
    });
    
    client.on('error', (err) => {
      console.error('Client error:', err);
    });
    
    setTimeout(resolve, 2000);
    return client;
  });
}

async function main() {
  log('Vietnam Visa Service - Development Mode');
  
  // Clean up any existing processes
  killExistingProcesses();
  
  // Wait for cleanup
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Start server first
  await startServer();
  
  // Then start client
  await startClient();
  
  log('Development environment ready!');
  log('Server: http://localhost:5000/graphql');
  log('Client: http://localhost:3000');
  
  // Keep the process alive
  process.on('SIGINT', () => {
    log('Shutting down development environment...');
    killExistingProcesses();
    process.exit(0);
  });
  
  // Keep running
  setInterval(() => {}, 1000);
}

if (require.main === module) {
  main().catch(console.error);
}