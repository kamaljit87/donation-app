#!/usr/bin/env node

/**
 * Optimized cPanel Startup Script
 * Minimal overhead, fast startup
 */

const http = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';
const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');

// Quick environment check
const requiredEnvVars = ['DB_HOST', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD', 'JWT_SECRET'];
const missing = requiredEnvVars.filter(key => !process.env[key]);

if (missing.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('❌ Missing environment variables:', missing.join(', '));
  process.exit(1);
}

// Build if needed
if (!fs.existsSync(buildIdPath)) {
  console.log('🔨 Building application (first run)...');
  const build = spawn('npm', ['run', 'build'], { stdio: 'inherit', cwd: __dirname });
  
  build.on('close', (code) => {
    if (code !== 0) process.exit(1);
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  const next = require('next');
  const app = next({
    dev: false,
    hostname,
    port,
    customServer: true,
    conf: {
      compress: true,
      poweredByHeader: false,
    }
  });

  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    http.createServer((req, res) => {
      handle(req, res, parse(req.url, true));
    }).listen(port, hostname, () => {
      console.log(`✅ Server ready at http://${hostname}:${port}`);
    });
  }).catch(err => {
    console.error('❌ Server error:', err);
    process.exit(1);
  });
}
