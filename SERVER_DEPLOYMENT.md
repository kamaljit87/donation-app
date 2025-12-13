# Server Deployment Guide

Complete guide to deploy the Donation App on a production server.

## 📋 Prerequisites

- Ubuntu 22.04 LTS server (or similar)
- Root access or sudo privileges
- Domain name pointed to your server IP
- At least 2GB RAM, 20GB storage

## 🚀 Quick Deployment

### Step 1: Initial Server Setup

SSH into your server and run:

\`\`\`bash
# Download the setup script
wget https://raw.githubusercontent.com/kamaljit87/donation-app/main/server-setup.sh

# Make it executable
chmod +x server-setup.sh

# Run the setup
sudo ./server-setup.sh
\`\`\`

This will install:
- Nginx web server
- PHP 8.2 with extensions
- MySQL database
- Node.js 18.x
- Composer
- PM2
- Certbot (for SSL)

### Step 2: Secure MySQL

\`\`\`bash
sudo mysql_secure_installation
\`\`\`

Follow prompts:
- Set root password
- Remove anonymous users
- Disallow root login remotely
- Remove test database
- Reload privilege tables

### Step 3: Configure SSH for GitHub

\`\`\`bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Display public key
cat ~/.ssh/id_ed25519.pub

# Add this key to GitHub:
# Go to https://github.com/settings/keys
# Click "New SSH key" and paste the key
\`\`\`

### Step 4: Deploy Application

\`\`\`bash
# Switch to application user
sudo su - donationapp

# Clone repository
cd /var/www/donation-app
git clone git@github.com:kamaljit87/donation-app.git .

# Exit to root
exit

# Run deployment script
chmod +x deploy-app.sh
sudo ./deploy-app.sh
\`\`\`

You'll be prompted for:
- Database password
- Razorpay credentials
- Admin credentials

### Step 5: Configure Nginx

\`\`\`bash
# Copy Nginx configuration
sudo cp nginx-config.conf /etc/nginx/sites-available/donation-app

# Update domain name in the file
sudo nano /etc/nginx/sites-available/donation-app
# Replace 'yourdomain.com' with your actual domain

# Enable the site
sudo ln -s /etc/nginx/sites-available/donation-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
\`\`\`

### Step 6: Setup SSL Certificate

\`\`\`bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended)

# Test auto-renewal
sudo certbot renew --dry-run
\`\`\`

### Step 7: Configure Laravel Queue Worker (Optional)

\`\`\`bash
# Create supervisor config
sudo nano /etc/supervisor/conf.d/donation-app-worker.conf
\`\`\`

Add:
\`\`\`ini
[program:donation-app-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/donation-app/backend/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=donationapp
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/donation-app/backend/storage/logs/worker.log
\`\`\`

Start the worker:
\`\`\`bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start donation-app-worker:*
\`\`\`

### Step 8: Setup Automated Backups

\`\`\`bash
# Create backup script
sudo nano /usr/local/bin/backup-donation-app.sh
\`\`\`

Add:
\`\`\`bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/donation-app"
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u donation_user -p'YOUR_PASSWORD' donation_app_prod | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/donation-app

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
\`\`\`

Make executable and schedule:
\`\`\`bash
sudo chmod +x /usr/local/bin/backup-donation-app.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-donation-app.sh
\`\`\`

## 🔧 Post-Deployment Configuration

### Update Razorpay to Live Mode

\`\`\`bash
cd /var/www/donation-app/backend
sudo -u donationapp nano .env

# Update Razorpay keys to production keys
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_live_secret

# Clear cache
sudo -u donationapp php artisan config:cache
\`\`\`

### Configure Email Notifications

Edit `.env`:
\`\`\`env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
\`\`\`

Clear cache:
\`\`\`bash
sudo -u donationapp php artisan config:cache
\`\`\`

## 📊 Monitoring & Maintenance

### View Application Logs

\`\`\`bash
# Laravel logs
sudo tail -f /var/www/donation-app/backend/storage/logs/laravel.log

# Nginx access logs
sudo tail -f /var/log/nginx/donation-app-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/donation-app-error.log
\`\`\`

### Check Service Status

\`\`\`bash
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
sudo systemctl status mysql
\`\`\`

### Update Application

\`\`\`bash
cd /var/www/donation-app

# Pull latest changes
sudo -u donationapp git pull origin main

# Update backend
cd backend
sudo -u donationapp composer install --optimize-autoloader --no-dev
sudo -u donationapp php artisan migrate --force
sudo -u donationapp php artisan config:cache
sudo -u donationapp php artisan route:cache
sudo -u donationapp php artisan view:cache

# Update frontend
cd ../frontend
sudo -u donationapp npm install
sudo -u donationapp npm run build
sudo cp -r build/* /var/www/html/

# Restart services
sudo systemctl restart php8.2-fpm
sudo systemctl reload nginx
\`\`\`

## 🔐 Security Checklist

- [ ] SSL certificate installed and auto-renewal configured
- [ ] Firewall enabled (ufw)
- [ ] MySQL secured with strong password
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Regular security updates enabled
- [ ] Application in production mode (APP_DEBUG=false)
- [ ] Strong admin password set
- [ ] File permissions correctly set
- [ ] Backup system configured
- [ ] Monitoring setup

## 🚨 Troubleshooting

### 502 Bad Gateway
\`\`\`bash
# Check PHP-FPM status
sudo systemctl status php8.2-fpm

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm
\`\`\`

### Permission Issues
\`\`\`bash
cd /var/www/donation-app/backend
sudo chown -R donationapp:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
\`\`\`

### Database Connection Error
\`\`\`bash
# Check MySQL is running
sudo systemctl status mysql

# Test database connection
mysql -u donation_user -p donation_app_prod
\`\`\`

### SSL Certificate Issues
\`\`\`bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
\`\`\`

## 📱 Testing Deployment

1. Visit https://yourdomain.com (should load React app)
2. Visit https://yourdomain.com/admin/login (admin login)
3. Test donation flow with Razorpay test mode
4. Check API: https://yourdomain.com/api (should return 404, which is normal)
5. Test admin dashboard functionality

## 🎯 Performance Optimization

### Enable OPcache
\`\`\`bash
sudo nano /etc/php/8.2/fpm/php.ini

# Add/update:
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0

sudo systemctl restart php8.2-fpm
\`\`\`

### Configure Nginx Caching
Already configured in nginx-config.conf

### Database Optimization
\`\`\`bash
# Add indexes if needed
mysql -u donation_user -p donation_app_prod

# Check slow queries
SHOW VARIABLES LIKE 'slow_query%';
\`\`\`

## 📞 Support

For deployment issues:
- Check logs first
- Verify all services are running
- Ensure environment variables are correct
- Test in development mode first

---

**Deployment Time:** ~30-45 minutes  
**Server Requirements:** 2GB RAM minimum, 20GB storage  
**Recommended:** 4GB RAM, 40GB SSD for production
