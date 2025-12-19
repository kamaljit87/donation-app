#!/bin/bash

# Complete cPanel Deployment Automation Script
# This script guides you through the entire deployment process

set -e

echo "=========================================="
echo "  Donation App - cPanel Deployment"
echo "  Complete Deployment Automation"
echo "=========================================="
echo ""

# Color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "🔍 Checking prerequisites..."

if [ ! -f "backend/composer.json" ] || [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ Error: Not in donation-app directory${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Install Node.js 18+ first"
    exit 1
fi

if ! command -v zip &> /dev/null; then
    echo -e "${YELLOW}⚠️  zip not found, installing...${NC}"
    if command -v apt-get &> /dev/null; then
        sudo apt-get install -y zip
    else
        echo "Please install zip manually"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"
echo ""

# Collect information
echo "📋 Please provide your cPanel details:"
echo ""

read -p "Your domain name (e.g., yourdomain.com): " DOMAIN
read -p "cPanel username: " CPANEL_USER
read -p "Database name (e.g., ${CPANEL_USER}_donation): " DB_NAME
read -p "Database username (e.g., ${CPANEL_USER}_donapp): " DB_USER
read -sp "Database password: " DB_PASSWORD
echo ""
read -p "Razorpay Key ID: " RAZORPAY_KEY
read -sp "Razorpay Key Secret: " RAZORPAY_SECRET
echo ""
read -p "Admin email: " ADMIN_EMAIL
read -sp "Admin password: " ADMIN_PASSWORD
echo ""
echo ""

# API URL
API_URL="https://api.${DOMAIN}/api"

echo "📊 Configuration Summary:"
echo "  Domain: ${DOMAIN}"
echo "  API URL: ${API_URL}"
echo "  Database: ${DB_NAME}"
echo "  DB User: ${DB_USER}"
echo ""
read -p "Continue? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Aborted"
    exit 0
fi
echo ""

# Create deployment directory
DEPLOY_DIR="cpanel-deploy"
mkdir -p "$DEPLOY_DIR"

# Step 1: Build Frontend
echo "=========================================="
echo "STEP 1: Building React Frontend"
echo "=========================================="
cd frontend

echo "📝 Creating production environment..."
cat > .env.production <<EOF
REACT_APP_API_URL=${API_URL}
REACT_APP_RAZORPAY_KEY_ID=${RAZORPAY_KEY}
REACT_APP_NAME=Donation App
EOF

echo "📥 Installing frontend dependencies..."
npm install --legacy-peer-deps

echo "🏗️  Building production bundle..."
npm run build

echo "📦 Creating frontend zip..."
cd build
zip -r ../../"$DEPLOY_DIR"/frontend-build.zip * .[^.]* 2>/dev/null || true
cd ../..

FRONTEND_SIZE=$(du -sh "$DEPLOY_DIR/frontend-build.zip" | cut -f1)
echo -e "${GREEN}✅ Frontend built: ${FRONTEND_SIZE}${NC}"
echo ""

# Step 2: Prepare Backend
echo "=========================================="
echo "STEP 2: Preparing Laravel Backend"
echo "=========================================="

BACKEND_DIR="$DEPLOY_DIR/backend-package"
rm -rf "$BACKEND_DIR"
mkdir -p "$BACKEND_DIR"

echo "📦 Copying backend files (excluding vendor)..."
rsync -a backend/ "$BACKEND_DIR/" \
  --exclude='vendor' \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='.git' \
  --exclude='storage/logs/*.log' \
  --exclude='storage/framework/cache/*' \
  --exclude='storage/framework/sessions/*' \
  --exclude='storage/framework/views/*' \
  --exclude='tests'

# Create .env file
echo "📝 Creating .env file..."
cat > "$BACKEND_DIR/.env" <<EOF
APP_NAME="Donation App"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://${DOMAIN}

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=${DB_NAME}
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

RAZORPAY_KEY_ID=${RAZORPAY_KEY}
RAZORPAY_KEY_SECRET=${RAZORPAY_SECRET}
RAZORPAY_CURRENCY=INR

SANCTUM_STATEFUL_DOMAINS=${DOMAIN},www.${DOMAIN}
SESSION_DOMAIN=.${DOMAIN}
FRONTEND_URL=https://${DOMAIN}

ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
EOF

# Create .htaccess for React Router
echo "📝 Creating .htaccess for frontend..."
cat > "$DEPLOY_DIR/frontend.htaccess" <<'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API requests
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
EOF

# Create setup script
cat > "$BACKEND_DIR/SETUP.sh" <<'SETUPEOF'
#!/bin/bash
set -e
echo "🚀 Setting up Laravel on cPanel..."

# Find PHP and Composer
PHP_BIN=$(which php 2>/dev/null || echo "/usr/bin/ea-php81")
COMPOSER=$(which composer 2>/dev/null || echo "/opt/cpanel/composer/bin/composer")

echo "Using PHP: $PHP_BIN"

# Install dependencies
echo "📥 Installing Composer dependencies..."
$PHP_BIN $COMPOSER install --optimize-autoloader --no-dev --no-interaction

# Generate key
echo "🔑 Generating app key..."
$PHP_BIN artisan key:generate --force

# Create directories
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs bootstrap/cache

# Set permissions
chmod -R 755 storage bootstrap/cache

# Run migrations
echo "📊 Running migrations..."
$PHP_BIN artisan migrate --force

# Seed admin
echo "👤 Creating admin user..."
$PHP_BIN artisan db:seed --class=AdminSeeder --force

# Cache
echo "⚡ Caching configuration..."
$PHP_BIN artisan config:cache
$PHP_BIN artisan route:cache
$PHP_BIN artisan view:cache

echo "✅ Setup complete!"
SETUPEOF

chmod +x "$BACKEND_DIR/SETUP.sh"

echo "📦 Creating backend tarball..."
cd "$DEPLOY_DIR"
tar -czf backend-package.tar.gz backend-package/
cd ..

BACKEND_SIZE=$(du -sh "$DEPLOY_DIR/backend-package.tar.gz" | cut -f1)
echo -e "${GREEN}✅ Backend prepared: ${BACKEND_SIZE}${NC}"
echo ""

# Create deployment instructions
echo "=========================================="
echo "STEP 3: Creating Deployment Instructions"
echo "=========================================="

cat > "$DEPLOY_DIR/DEPLOY-INSTRUCTIONS.md" <<INSTEOF
# 🚀 cPanel Deployment Instructions

## Files Ready for Upload

- **frontend-build.zip** (${FRONTEND_SIZE}) - React app
- **backend-package.tar.gz** (${BACKEND_SIZE}) - Laravel app
- **frontend.htaccess** - Apache config for React Router

## Deployment Steps

### 1️⃣ Create MySQL Database

1. Login to cPanel
2. Go to **MySQL Databases**
3. Create database: \`${DB_NAME}\`
4. Create user: \`${DB_USER}\`
5. Set password: (the one you provided)
6. Add user to database with **ALL PRIVILEGES**

### 2️⃣ Upload Backend

1. Go to **File Manager**
2. Navigate to your home directory (NOT public_html)
3. Upload \`backend-package.tar.gz\`
4. Right-click → **Extract**
5. Rename \`backend-package\` to \`donation-backend\`

### 3️⃣ Setup Backend

**Via Terminal:**
\`\`\`bash
cd ~/donation-backend
bash SETUP.sh
\`\`\`

**Via cPanel (if no SSH):**
- Go to **Terminal** in cPanel
- Run the commands above

### 4️⃣ Create API Subdomain

1. Go to **Subdomains**
2. Create subdomain: \`api\`
3. Document Root: \`/home/${CPANEL_USER}/donation-backend/public\`
4. Click **Create**

### 5️⃣ Configure PHP for API Subdomain

1. Go to **MultiPHP Manager**
2. Select \`api.${DOMAIN}\`
3. Set PHP version to **8.1** or **8.2**
4. Enable extensions:
   - mysqli
   - pdo_mysql
   - mbstring
   - xml
   - curl
   - openssl

### 6️⃣ Upload Frontend

1. Go to **File Manager**
2. Navigate to \`public_html\`
3. Delete existing files (or backup first)
4. Upload \`frontend-build.zip\`
5. Right-click → **Extract**
6. Upload \`frontend.htaccess\`
7. Rename it to \`.htaccess\`

### 7️⃣ Install SSL Certificate

1. Go to **SSL/TLS Status**
2. Click **Run AutoSSL** for:
   - ${DOMAIN}
   - api.${DOMAIN}
3. Wait for completion

### 8️⃣ Test Your Application

1. **Frontend**: https://${DOMAIN}
2. **Test donation form**
3. **Admin login**: https://${DOMAIN}/admin
   - Email: ${ADMIN_EMAIL}
   - Password: (the one you set)
4. **Test API**: https://api.${DOMAIN}/api/admin/statistics

## 🔧 Troubleshooting

### 500 Error on API
\`\`\`bash
cd ~/donation-backend
chmod -R 755 storage bootstrap/cache
php artisan config:clear
php artisan cache:clear
\`\`\`

### CORS Errors
Check \`backend/config/cors.php\` - ensure frontend URL is in allowed origins

### Database Connection Error
- Verify database name, username, password in \`.env\`
- Check if database user has privileges

### React Shows Blank Page
- Check browser console for errors
- Verify API URL in frontend
- Check .htaccess is in place

## 📊 Your Configuration

- **Domain**: ${DOMAIN}
- **API**: api.${DOMAIN}
- **Database**: ${DB_NAME}
- **DB User**: ${DB_USER}
- **Admin Email**: ${ADMIN_EMAIL}

## 🎉 Done!

Your donation app should now be live at https://${DOMAIN}
INSTEOF

echo -e "${GREEN}✅ Instructions created${NC}"
echo ""

# Final summary
echo "=========================================="
echo "🎉 DEPLOYMENT PACKAGE READY!"
echo "=========================================="
echo ""
echo "📁 Location: ${DEPLOY_DIR}/"
echo ""
echo "📦 Files created:"
echo "  ✓ frontend-build.zip (${FRONTEND_SIZE})"
echo "  ✓ backend-package.tar.gz (${BACKEND_SIZE})"
echo "  ✓ frontend.htaccess"
echo "  ✓ DEPLOY-INSTRUCTIONS.md"
echo ""
echo "📖 Next step: Read ${DEPLOY_DIR}/DEPLOY-INSTRUCTIONS.md"
echo ""
echo -e "${GREEN}✅ All done! Ready to upload to cPanel${NC}"
