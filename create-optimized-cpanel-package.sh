#!/bin/bash

# Optimized cPanel Deployment Package Creator
# Creates minimal production package

set -e

echo "========================================="
echo "Creating Optimized cPanel Package"
echo "========================================="

cd "$(dirname "$0")/nextjs-app"

# Clean old build
echo "🧹 Cleaning old builds..."
rm -rf .next node_modules

# Install production dependencies only
echo "📦 Installing production dependencies..."
npm ci --production --no-audit --no-fund

# Build optimized production bundle
echo "🔨 Building optimized production bundle..."
NODE_ENV=production npm run build

# Create deployment package
DEPLOY_DIR="../cpanel-optimized"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "📋 Copying essential files..."

# Copy only what's needed
cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/"
cp -r app "$DEPLOY_DIR/"
cp -r components "$DEPLOY_DIR/"
cp -r context "$DEPLOY_DIR/"
cp -r data "$DEPLOY_DIR/"
cp -r lib "$DEPLOY_DIR/"
cp -r services "$DEPLOY_DIR/"

# Copy configuration files
cp package.json "$DEPLOY_DIR/"
cp package-lock.json "$DEPLOY_DIR/"
cp start-optimized.js "$DEPLOY_DIR/"
cp next.config.js "$DEPLOY_DIR/"
cp jsconfig.json "$DEPLOY_DIR/" 2>/dev/null || true

# Copy CSS files (skip large ones)
find . -maxdepth 1 -name "*.css" -size -100k -exec cp {} "$DEPLOY_DIR/" \;

# Create minimal .env template
cat > "$DEPLOY_DIR/.env.production" << 'EOF'
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
EOF

# Create deployment instructions
cat > "$DEPLOY_DIR/DEPLOY.txt" << 'EOF'
OPTIMIZED CPANEL DEPLOYMENT
===========================

1. Upload this entire folder to cPanel
2. In cPanel Node.js interface:
   - Application URL: your domain
   - Application startup file: start-optimized.js
   - Set environment variables (see .env.production)
   - Click "Run NPM Install"
   - Start application

3. That's it! The app will auto-build on first run if needed.

Package optimized for:
- Fast upload (no node_modules, no dev dependencies)
- Quick startup
- Minimal memory footprint
- Production performance
EOF

# Get sizes
ORIGINAL_SIZE=$(du -sh ../nextjs-app 2>/dev/null | cut -f1)
OPTIMIZED_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)

echo ""
echo "✅ Optimized package created!"
echo "========================================="
echo "Original size:  $ORIGINAL_SIZE"
echo "Optimized size: $OPTIMIZED_SIZE"
echo "Location:       $DEPLOY_DIR"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. cd .. && zip -r cpanel-optimized.zip cpanel-optimized/"
echo "2. Upload cpanel-optimized.zip to cPanel"
echo "3. Extract and configure (see DEPLOY.txt)"
echo ""
