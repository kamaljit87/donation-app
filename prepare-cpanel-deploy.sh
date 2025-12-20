#!/bin/bash

# cPanel Deployment Preparation Script
# This script prepares your Next.js app for cPanel deployment

set -e

echo "========================================="
echo "cPanel Deployment Preparation"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to nextjs-app directory
cd "$(dirname "$0")/nextjs-app"

echo ""
echo "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

echo ""
echo "${YELLOW}Step 2: Building production bundle...${NC}"
NODE_ENV=production npm run build

echo ""
echo "${YELLOW}Step 3: Creating deployment package...${NC}"

# Create deployment directory
DEPLOY_DIR="../cpanel-deploy-package"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
echo "Copying files..."
cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/"
cp -r app "$DEPLOY_DIR/"
cp -r components "$DEPLOY_DIR/"
cp -r context "$DEPLOY_DIR/"
cp -r data "$DEPLOY_DIR/"
cp -r lib "$DEPLOY_DIR/"
cp -r pages "$DEPLOY_DIR/" 2>/dev/null || true
cp -r services "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp package-lock.json "$DEPLOY_DIR/"
cp server.js "$DEPLOY_DIR/"
cp jsconfig.json "$DEPLOY_DIR/" 2>/dev/null || true
cp next.config.js "$DEPLOY_DIR/"

# Copy CSS files
echo "Copying CSS files..."
cp *.css "$DEPLOY_DIR/" 2>/dev/null || true

# Create .env.example
cat > "$DEPLOY_DIR/.env.example" << 'EOF'
NODE_ENV=production
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# JWT Secret
JWT_SECRET=change_this_to_a_secure_random_string

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
EOF

# Create README for deployment
cat > "$DEPLOY_DIR/README.txt" << 'EOF'
cPanel Deployment Package
=========================

This folder contains all files needed for cPanel deployment.

UPLOAD INSTRUCTIONS:
1. Compress this entire folder as a ZIP file
2. Upload to your cPanel File Manager
3. Extract in your application directory (e.g., public_html or subdomain folder)
4. In cPanel Node.js Selector:
   - Set Application URL to your domain
   - Set Application startup file to: server.js
   - Add environment variables from .env.example
   - Click "Run NPM Install"
   - Start the application

IMPORTANT:
- Rename .env.example to .env and fill in your actual values
- Or better: Add environment variables directly in cPanel interface
- Make sure Node.js version is 18 or higher in cPanel

For detailed instructions, see CPANEL_DEPLOYMENT_INSTRUCTIONS.md
EOF

echo ""
echo "${GREEN}=========================================${NC}"
echo "${GREEN}Deployment package created successfully!${NC}"
echo "${GREEN}=========================================${NC}"
echo ""
echo "Location: ${YELLOW}$DEPLOY_DIR${NC}"
echo ""
echo "Next steps:"
echo "1. Create a ZIP file: ${YELLOW}cd .. && zip -r cpanel-deploy.zip cpanel-deploy-package/${NC}"
echo "2. Upload cpanel-deploy.zip to your cPanel"
echo "3. Extract it in your application directory"
echo "4. Configure Node.js app in cPanel (see CPANEL_DEPLOYMENT_INSTRUCTIONS.md)"
echo ""
echo "${YELLOW}Note: The package is about $(du -sh $DEPLOY_DIR | cut -f1) in size${NC}"
echo ""
