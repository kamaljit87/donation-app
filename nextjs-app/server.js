const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration for cPanel Node.js hosting
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // Listen on all interfaces for cPanel
const port = parseInt(process.env.PORT || '3000', 10);

// Check if build exists
const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');

async function checkAndBuild() {
  if (!fs.existsSync(buildIdPath)) {
    console.log('⚠️  Production build not found. Building now...');
    console.log('This may take a few minutes on first startup.');
    
    return new Promise((resolve, reject) => {
      const build = spawn('npm', ['run', 'build'], {
        stdio: 'inherit',
        cwd: __dirname
      });
      
      build.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Build failed with code ${code}`));
        } else {
          console.log('✓ Build completed successfully!');
          resolve();
        }
      });
    });
  }
}

console.log('Starting Next.js application...');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${port}`);

// Build if needed, then start
checkAndBuild().then(() => {
  // Initialize Next.js app
  const app = next({ 
    dev, 
    hostname, 
    port,
    customServer: true 
  });

  const handle = app.getRequestHandler();

  return app.prepare().then(() => ({ app, handle }));
}).then(({ app, handle }) => {
  createServer(async (req, res) => {
    try {
      // Parse URL
      const parsedUrl = parse(req.url, true);
      
      // Handle request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  })
  .listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Application is running in ${dev ? 'development' : 'production'} mode`);
  });
}).catch((err) => {
  console.error('Error starting Next.js:', err);
  process.exit(1);
});
