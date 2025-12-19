# cPanel Deployment Guide for Donation Application

This guide covers deploying the Laravel + React donation application on cPanel hosting.

## 🎯 Important Notes

**Your application has two parts:**
1. **Backend (Laravel/PHP)** - Requires PHP 8.1+ and MySQL
2. **Frontend (React)** - Can be deployed as static files OR using Node.js hosting

**cPanel Setup Required:**
- PHP hosting (for Laravel backend)
- MySQL database
- Node.js hosting (optional, for serving React) OR static file hosting
- SSL certificate

## 📋 Prerequisites

✅ cPanel account with:
- PHP 8.1 or higher
- MySQL/MariaDB database
- SSH access (recommended)
- Git (optional, for easier deployment)
- Node.js support (if using Node.js app feature)

## 🚀 Deployment Steps

### Option 1: Static Frontend (Recommended for cPanel)

This is the simplest approach - build React app locally and deploy static files.

#### Step 1: Prepare Laravel Backend

**1.1. Create MySQL Database in cPanel**
- Go to cPanel → MySQL Databases
- Create database: `yourusername_donation`
- Create user: `yourusername_donapp`
- Set strong password
- Add user to database with ALL PRIVILEGES

**1.2. Upload Backend Files**

Via SSH:
```bash
# SSH into your cPanel account
ssh yourusername@yourserver.com

# Navigate to a directory outside public_html (for security)
cd ~/
mkdir donation-backend
cd donation-backend

# Upload backend files here (using SCP, SFTP, or Git)
# Or use File Manager in cPanel to upload backend.zip
```

Via cPanel File Manager:
- Create folder: `donation-backend` in home directory
- Upload all `backend/*` files to this folder

**1.3. Configure Environment**

Create `.env` file in `donation-backend` directory:

```env
APP_NAME="Donation App"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=yourusername_donation
DB_USERNAME=yourusername_donapp
DB_PASSWORD=your_database_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_CURRENCY=INR

# CORS Settings
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
SESSION_DOMAIN=.yourdomain.com

FRONTEND_URL=https://yourdomain.com
```

**1.4. Install Dependencies and Setup**

```bash
cd ~/donation-backend

# Install Composer dependencies
composer install --optimize-autoloader --no-dev

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Create admin user
php artisan db:seed --class=AdminSeeder

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 755 storage bootstrap/cache
```

**1.5. Create API Subdomain or Subdirectory**

**Option A: Subdomain (Recommended)**
- Go to cPanel → Subdomains
- Create subdomain: `api.yourdomain.com`
- Document Root: `/home/yourusername/donation-backend/public`

**Option B: Subdirectory**
- Go to cPanel → File Manager
- Navigate to `public_html`
- Create symlink or copy:
```bash
cd ~/public_html
ln -s ~/donation-backend/public api
```

**1.6. Configure .htaccess for Laravel**

Ensure `donation-backend/public/.htaccess` exists:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

**1.7. Set PHP Version**

- Go to cPanel → Select PHP Version (or MultiPHP Manager)
- Select PHP 8.1 or 8.2 for the API domain/directory
- Enable required extensions:
  - mysqli
  - pdo_mysql
  - mbstring
  - xml
  - curl
  - openssl
  - tokenizer
  - json
  - bcmath

#### Step 2: Build and Deploy React Frontend

**2.1. Build Frontend Locally**

On your local machine:

```bash
cd frontend

# Create production environment file
cat > .env.production <<EOF
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
EOF

# Install dependencies
npm install

# Build for production
npm run build
```

This creates an optimized `build` folder.

**2.2. Upload to cPanel**

Via SSH/SFTP:
```bash
# Upload build folder contents to public_html
scp -r build/* yourusername@yourserver.com:~/public_html/
```

Via cPanel File Manager:
- Navigate to `public_html`
- Upload all files from `build` folder
- Ensure `index.html` is in the root of `public_html`

**2.3. Configure .htaccess for React Router**

Create/edit `public_html/.htaccess`:

```apache
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

# Enable CORS for API requests
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
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
    ExpiresByType application/json "access plus 1 week"
</IfModule>
```

#### Step 3: SSL Certificate

- Go to cPanel → SSL/TLS Status
- Run AutoSSL for your domain and api subdomain
- Or install Let's Encrypt certificate

#### Step 4: Test Your Application

1. Visit: `https://yourdomain.com` (React frontend)
2. Test donation form
3. Login to admin: `https://yourdomain.com/admin`
4. Test API: `https://api.yourdomain.com/api/admin/statistics` (should require auth)

---

### Option 2: Using cPanel Node.js App (Alternative)

If your cPanel has Node.js App feature, you can serve React through Node.js.

**2.1. Create Node.js Application**

- Go to cPanel → Setup Node.js App
- Click "Create Application"
  - Node.js version: 18.x or latest
  - Application mode: Production
  - Application root: `donation-frontend`
  - Application URL: `yourdomain.com`
  - Application startup file: `server.js`

**2.2. Upload Frontend Files**

Upload all `frontend/*` files to `~/donation-frontend/`

**2.3. Create Server File**

Create `~/donation-frontend/server.js`:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

**2.4. Update package.json**

Add to `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "react-scripts build"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**2.5. Install and Build**

```bash
cd ~/donation-frontend

# Install dependencies
npm install

# Build React app
npm run build

# Start via cPanel interface
```

**2.6. Start Application**

- Go back to cPanel → Node.js App
- Click "Start" on your application

---

## 🔒 Security Checklist

- [ ] Backend `.env` file is outside `public_html` (not web accessible)
- [ ] `APP_DEBUG=false` in production
- [ ] Strong database passwords
- [ ] SSL certificate installed
- [ ] Proper file permissions (755 for directories, 644 for files)
- [ ] Regular backups enabled
- [ ] Keep Laravel and dependencies updated

## 🔧 Common Issues & Solutions

### Issue: 500 Internal Server Error

**Solution:**
```bash
# Check permissions
chmod -R 755 ~/donation-backend/storage
chmod -R 755 ~/donation-backend/bootstrap/cache

# Check .htaccess
# Ensure mod_rewrite is enabled (usually enabled by default in cPanel)

# Check error logs
tail -f ~/donation-backend/storage/logs/laravel.log
```

### Issue: CORS Errors

**Solution:** Update `backend/config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('FRONTEND_URL', 'https://yourdomain.com')],
'allowed_origins_patterns' => [],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### Issue: API Routes Not Working

**Solution:**
- Ensure `.htaccess` exists in backend public directory
- Check PHP version is 8.1+
- Verify mod_rewrite is enabled
- Check error logs in cPanel

### Issue: React App Shows Blank Page

**Solution:**
- Check browser console for errors
- Verify API URL in frontend `.env.production`
- Check that all static files were uploaded correctly
- Ensure `.htaccess` is configured for React Router

## 📱 Deployment Scripts

### Quick Update Script

Create `~/update-app.sh`:

```bash
#!/bin/bash
set -e

echo "🔄 Updating Donation App..."

# Update backend
cd ~/donation-backend
git pull
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Update frontend (if using Node.js app)
# cd ~/donation-frontend
# git pull
# npm install
# npm run build
# cPanel Node.js app restart command (via API or manual)

echo "✅ Update complete!"
```

### Backup Script

Create `~/backup-app.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=~/backups/$DATE

echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u yourusername_donapp -p yourusername_donation > $BACKUP_DIR/database.sql

# Backup backend
tar -czf $BACKUP_DIR/backend.tar.gz ~/donation-backend

# Backup frontend
tar -czf $BACKUP_DIR/frontend.tar.gz ~/public_html

echo "✅ Backup saved to: $BACKUP_DIR"
```

## 🎓 Additional Resources

- [Laravel Deployment Documentation](https://laravel.com/docs/10.x/deployment)
- [cPanel Documentation](https://docs.cpanel.net/)
- [React Production Build](https://create-react-app.dev/docs/production-build/)

## 💡 Tips for Better Performance

1. **Enable OPcache** - Contact hosting provider to enable PHP OPcache
2. **Use CDN** - Consider using Cloudflare for static assets
3. **Database Optimization** - Add indexes to frequently queried columns
4. **Caching** - Configure Redis/Memcached if available
5. **Optimize Images** - Compress images before uploading

## 📞 Support

If you encounter issues:
1. Check Laravel logs: `~/donation-backend/storage/logs/laravel.log`
2. Check cPanel error logs
3. Review this guide's troubleshooting section
4. Contact your hosting provider for server-specific issues

---

**Last Updated:** December 2025
