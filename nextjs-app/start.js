#!/usr/bin/env node

/**
 * cPanel Startup Script with Auto-Build
 * This ensures the app is built before starting
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');

console.log('🚀 Starting Next.js Application for cPanel...');
console.log('📁 Working directory:', __dirname);

// Check if build exists
if (!fs.existsSync(buildIdPath)) {
  console.log('⚠️  No build found. Building now...');
  console.log('⏳ This will take 2-3 minutes on first run...\n');
  
  const build = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });
  
  build.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ Build failed with code:', code);
      process.exit(1);
    }
    
    console.log('\n✅ Build completed successfully!');
    console.log('🚀 Starting server...\n');
    startServer();
  });
} else {
  console.log('✅ Build found, starting server...\n');
  startServer();
}

function startServer() {
  // Use the custom server
  require('./server.js');
}
