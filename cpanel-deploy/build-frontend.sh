#!/bin/bash

# Build Frontend for cPanel Deployment
# This script builds the React app for production

set -e

echo "=========================================="
echo "  Building React Frontend for cPanel"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: frontend/package.json not found!"
    echo "Please run this script from the donation-app root directory"
    exit 1
fi

cd frontend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ first"
    exit 1
fi

echo "📦 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"
echo ""

# Get configuration
read -p "Enter your API URL (e.g., https://api.yourdomain.com/api): " API_URL
read -p "Enter your Razorpay Key ID: " RAZORPAY_KEY

# Create production environment file
echo "📝 Creating production environment file..."
cat > .env.production <<EOF
REACT_APP_API_URL=$API_URL
REACT_APP_RAZORPAY_KEY_ID=$RAZORPAY_KEY
REACT_APP_NAME=Donation App
EOF

echo "✅ Environment file created"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install

echo ""
echo "🏗️  Building production bundle..."
echo "This may take a few minutes..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo ""
    echo "📦 Build folder created at: frontend/build"
    echo "📊 Build size:"
    du -sh build
    echo ""
    echo "📤 Next steps:"
    echo "1. Create a zip file: cd build && zip -r ../frontend-build.zip *"
    echo "2. Upload frontend-build.zip to your cPanel public_html"
    echo "3. Extract in cPanel File Manager"
    echo ""
    
    # Create zip file
    read -p "Create zip file now? (y/n): " CREATE_ZIP
    if [ "$CREATE_ZIP" = "y" ] || [ "$CREATE_ZIP" = "Y" ]; then
        echo "📦 Creating zip file..."
        cd build
        zip -r ../frontend-build.zip * .[^.]*
        echo "✅ Created frontend-build.zip ($(du -sh ../frontend-build.zip | cut -f1))"
        echo "📍 Location: frontend/frontend-build.zip"
    fi
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi
