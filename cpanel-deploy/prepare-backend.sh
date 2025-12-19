#!/bin/bash

# Prepare Laravel Backend for cPanel Deployment
# Optimizes backend to fit in 1GB disk space

set -e

echo "=========================================="
echo "  Preparing Laravel Backend for cPanel"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "backend/composer.json" ]; then
    echo "❌ Error: backend/composer.json not found!"
    echo "Please run this script from the donation-app root directory"
    exit 1
fi

# Create deployment directory
DEPLOY_DIR="cpanel-deploy/backend-package"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "📦 Copying backend files..."

# Copy essential files only (exclude development files)
rsync -av --progress backend/ "$DEPLOY_DIR/" \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='node_modules' \
  --exclude='vendor' \
  --exclude='storage/logs/*.log' \
  --exclude='storage/framework/cache/*' \
  --exclude='storage/framework/sessions/*' \
  --exclude='storage/framework/views/*' \
  --exclude='tests' \
  --exclude='.phpunit.result.cache'

echo ""
echo "📝 Creating .env.example for cPanel..."

# Create production .env template
cat > "$DEPLOY_DIR/.env.cpanel" <<'EOF'
APP_NAME="Donation App"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

# Update these with your cPanel MySQL details
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cpanelusername_donation
DB_USERNAME=cpanelusername_donapp
DB_PASSWORD=your_database_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Get from Razorpay Dashboard
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_CURRENCY=INR

# Update with your domain
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
SESSION_DOMAIN=.yourdomain.com
FRONTEND_URL=https://yourdomain.com
EOF

echo "✅ Environment template created"
echo ""

# Create setup script for cPanel
cat > "$DEPLOY_DIR/setup-cpanel.sh" <<'EOF'
#!/bin/bash
# Run this script on cPanel after uploading files

set -e

echo "🚀 Setting up Laravel on cPanel..."

# Install Composer dependencies (production only)
if command -v composer &> /dev/null; then
    echo "📥 Installing Composer dependencies..."
    composer install --optimize-autoloader --no-dev
else
    echo "⚠️  Composer not found in PATH. You may need to use full path."
    echo "Example: /usr/local/bin/ea-php81 /opt/cpanel/composer/bin/composer install --optimize-autoloader --no-dev"
fi

# Copy environment file
if [ ! -f ".env" ]; then
    echo "📝 Setting up .env file..."
    cp .env.cpanel .env
    echo "⚠️  IMPORTANT: Edit .env file with your actual values!"
else
    echo "⚠️  .env already exists, skipping..."
fi

# Generate application key
echo "🔑 Generating application key..."
php artisan key:generate

# Create storage directories
echo "📁 Creating storage directories..."
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Set permissions
echo "🔒 Setting permissions..."
chmod -R 755 storage bootstrap/cache

# Run migrations
read -p "Run database migrations? (y/n): " RUN_MIGRATIONS
if [ "$RUN_MIGRATIONS" = "y" ]; then
    echo "📊 Running migrations..."
    php artisan migrate --force
    
    # Seed admin
    read -p "Create admin user? (y/n): " CREATE_ADMIN
    if [ "$CREATE_ADMIN" = "y" ]; then
        php artisan db:seed --class=AdminSeeder
    fi
fi

# Cache configuration
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your actual values"
echo "2. Configure your domain to point to public/ directory"
echo "3. Enable PHP 8.1+ for your domain"
echo "4. Install SSL certificate"
echo "5. Test API: https://api.yourdomain.com/api/admin/statistics"
EOF

chmod +x "$DEPLOY_DIR/setup-cpanel.sh"

echo "📦 Creating deployment package..."
cd cpanel-deploy
tar -czf backend-package.tar.gz backend-package/
cd ..

PACKAGE_SIZE=$(du -sh cpanel-deploy/backend-package.tar.gz | cut -f1)

echo ""
echo "✅ Backend package created!"
echo ""
echo "📦 Package: cpanel-deploy/backend-package.tar.gz"
echo "📊 Size: $PACKAGE_SIZE"
echo ""
echo "📤 Upload instructions:"
echo "1. Upload backend-package.tar.gz to your cPanel home directory"
echo "2. Extract: tar -xzf backend-package.tar.gz"
echo "3. Move to destination: mv backend-package donation-backend"
echo "4. Run setup: cd donation-backend && bash setup-cpanel.sh"
echo ""
echo "⚠️  Remember: Upload to home directory, NOT public_html!"
echo "   Backend should be in ~/donation-backend/"
echo "   Only the public/ folder will be exposed via subdomain/directory"
