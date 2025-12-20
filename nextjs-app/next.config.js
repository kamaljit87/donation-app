/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  // Image optimization
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: ['localhost', 'prabhupadannakshetra.org'],
  },
  
  // For cPanel Node.js hosting
  compress: true,
  poweredByHeader: false,
  
  // TypeScript and ESLint (for Docker builds)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
