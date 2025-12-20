const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Configuration for cPanel Node.js hosting
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // Listen on all interfaces for cPanel
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({ 
  dev, 
  hostname, 
  port,
  customServer: true 
});

const handle = app.getRequestHandler();

console.log('Starting Next.js application...');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${port}`);

app.prepare().then(() => {
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
