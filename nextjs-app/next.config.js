/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize for production
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    unoptimized: true, // cPanel doesn't support Next.js image optimization
    domains: ['localhost', 'prabhupadannakshetra.org'],
  },
  
  // Output optimization for cPanel
  output: 'standalone',
  
  // Disable development features in production
  productionBrowserSourceMaps: false,
  
  // TypeScript and ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimize runtime
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
