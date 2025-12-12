# Deployment Guide

Complete guide for deploying the Donation Application to production.

## 🌐 Deployment Options

### Option 1: Traditional Hosting (cPanel/Plesk)
### Option 2: Cloud Platform (AWS/DigitalOcean/Heroku)
### Option 3: Containerized (Docker)

---

## 📋 Pre-Deployment Checklist

- [ ] Update all environment variables for production
- [ ] Use production Razorpay API keys
- [ ] Set strong admin password
- [ ] Configure production database
- [ ] Set APP_ENV=production and APP_DEBUG=false
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up backup strategy
- [ ] Configure error logging
- [ ] Test all features in staging

---

## 🔧 Backend Deployment (Laravel)

### 1. Prepare Application

\`\`\`bash
cd backend

# Set production environment
cp .env .env.production

# Edit .env.production
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Install dependencies (production only)
composer install --optimize-autoloader --no-dev

# Generate key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed admin user
php artisan db:seed --force

# Optimize application
php artisan config:cache
php artisan route:cache
php artisan view:cache
\`\`\`

### 2. File Permissions

\`\`\`bash
# Set proper permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
\`\`\`

### 3. Web Server Configuration

#### Apache (.htaccess)

Create `public/.htaccess`:

\`\`\`apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
\`\`\`

#### Nginx

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/donation-app/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \\.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\\.(?!well-known).* {
        deny all;
    }
}
\`\`\`

---

## ⚛️ Frontend Deployment (React)

### 1. Build Application

\`\`\`bash
cd frontend

# Create production environment file
echo "REACT_APP_API_URL=https://yourdomain.com/api" > .env.production

# Build for production
npm run build
\`\`\`

### 2. Deploy Build Folder

The `build` folder contains the production-ready application.

#### Option A: Static Hosting (Netlify/Vercel)

\`\`\`bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
\`\`\`

#### Option B: Apache/Nginx

\`\`\`bash
# Copy build files
cp -r build/* /var/www/html/

# Create .htaccess for SPA routing
\`\`\`

Create `.htaccess` in build directory:

\`\`\`apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
\`\`\`

#### Nginx Configuration for React

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
\`\`\`

---

## 🔐 SSL/HTTPS Setup

### Using Let's Encrypt (Free SSL)

\`\`\`bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
\`\`\`

---

## 🗄️ Database Setup

### MySQL Production

\`\`\`bash
# Create production database
mysql -u root -p
CREATE DATABASE donation_app_prod;
CREATE USER 'donation_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON donation_app_prod.* TO 'donation_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
php artisan migrate --env=production
\`\`\`

---

## 🔄 Deployment Scripts

### Backend Deployment Script

Create `deploy-backend.sh`:

\`\`\`bash
#!/bin/bash

echo "Deploying Backend..."

# Pull latest changes
git pull origin main

# Install dependencies
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 755 storage bootstrap/cache

echo "Backend deployment complete!"
\`\`\`

### Frontend Deployment Script

Create `deploy-frontend.sh`:

\`\`\`bash
#!/bin/bash

echo "Deploying Frontend..."

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Deploy (adjust for your setup)
cp -r build/* /var/www/html/

echo "Frontend deployment complete!"
\`\`\`

---

## 🐳 Docker Deployment (Optional)

### Backend Dockerfile

\`\`\`dockerfile
FROM php:8.1-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \\
    git curl libpng-dev libonig-dev libxml2-dev zip unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --optimize-autoloader --no-dev

RUN chmod -R 755 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
\`\`\`

### Frontend Dockerfile

\`\`\`dockerfile
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

### Docker Compose

\`\`\`yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "9000:9000"
    volumes:
      - ./backend:/var/www
    environment:
      - DB_HOST=mysql
      - DB_DATABASE=donation_app
      - DB_USERNAME=root
      - DB_PASSWORD=secret

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: donation_app
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
\`\`\`

---

## 📊 Monitoring & Logging

### Laravel Logging

Configure `config/logging.php`:

\`\`\`php
'channels' => [
    'production' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'error',
        'days' => 14,
    ],
],
\`\`\`

### Error Tracking

Consider integrating:
- Sentry (https://sentry.io)
- Bugsnag (https://www.bugsnag.com)
- Rollbar (https://rollbar.com)

---

## 🔄 Backup Strategy

### Database Backup

\`\`\`bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/database"
DB_NAME="donation_app_prod"

mysqldump -u root -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
\`\`\`

### Automated Backups

\`\`\`bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh
\`\`\`

---

## 🚀 Performance Optimization

### Backend Optimization

\`\`\`bash
# Enable OPcache
# Edit php.ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000

# Queue configuration for emails
php artisan queue:work --daemon
\`\`\`

### Frontend Optimization

- Enable gzip compression
- Set up CDN for static assets
- Implement service workers
- Optimize images

---

## 📱 Post-Deployment Testing

### Backend Tests

\`\`\`bash
curl https://yourdomain.com/api/health
curl -X POST https://yourdomain.com/api/auth/login -d '{"email":"admin@donationapp.com","password":"Admin@123"}'
\`\`\`

### Frontend Tests

- Test all routes
- Test donation flow
- Test admin login
- Test payment integration
- Check responsive design
- Test SEO meta tags

---

## 🆘 Troubleshooting

### Common Issues

1. **500 Error**: Check `storage/logs/laravel.log`
2. **Permission Denied**: Fix storage permissions
3. **Database Connection**: Verify .env credentials
4. **CORS Error**: Update CORS configuration
5. **Payment Issues**: Verify Razorpay production keys

---

## 📞 Support

For deployment issues:
- Check logs first
- Verify all environment variables
- Test in staging before production
- Contact hosting support if needed

---

**Remember**: Always test in a staging environment before deploying to production!
