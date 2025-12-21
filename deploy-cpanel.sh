#!/bin/bash

# cPanel Git Deployment Script
# Run this on cPanel after git pull

set -e

echo "🚀 Deploying to cPanel..."

# Navigate to app directory
cd ~/nextjs-app

# Install dependencies (production only)
echo "📦 Installing dependencies..."
npm ci --production --no-audit --no-fund

# Build the application
echo "🔨 Building application..."
NODE_ENV=production npm run build

# Restart the application
echo "🔄 Restarting application..."
# cPanel will auto-restart when files change, or you can:
# touch tmp/restart.txt  # for Passenger
# Or restart from cPanel Node.js interface

echo "✅ Deployment complete!"
echo ""
echo "If app doesn't restart automatically:"
echo "1. Go to cPanel Node.js interface"
echo "2. Click 'Restart' button"
echo ""
