#!/usr/bin/env node

/**
 * Simple cPanel Startup - No Auto-Build
 * Build must be done separately first
 */

const http = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';
const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');

// Check if build exists
if (!fs.existsSync(buildIdPath)) {
  console.error('❌ ERROR: No build found!');
  console.error('You must run the build script first.');
  console.error('In cPanel: Run "build" script before starting the app.');
  process.exit(1);
}

console.log('✅ Build found, starting server...');

const next = require('next');
const app = next({
  dev: false,
  hostname,
  port,
  customServer: true
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
