#!/bin/bash

# Application Deployment Script
# Run this after server-setup.sh

set -e

echo "=========================================="
echo "  Donation App - Deployment"
echo "=========================================="
echo ""

# Configuration
APP_DIR="/var/www/donation-app"
DOMAIN="yourdomain.com"  # Change this to your domain
DB_NAME="donation_app_prod"
DB_USER="donation_user"

# Prompt for sensitive information
read -p "Enter database password: " -s DB_PASSWORD
echo ""
read -p "Enter Razorpay Key ID: " RAZORPAY_KEY
read -sp "Enter Razorpay Key Secret: " RAZORPAY_SECRET
echo ""
read -p "Enter admin email: " ADMIN_EMAIL
read -sp "Enter admin password: " ADMIN_PASSWORD
echo -e "\n"

# Clone or update repository
echo "📥 Cloning/updating repository..."
cd $APP_DIR
if [ ! -d ".git" ]; then
    sudo -u donationapp git clone git@github.com:kamaljit87/donation-app.git .
else
    sudo -u donationapp git pull origin main
fi

# Setup backend
echo "🔧 Setting up Laravel backend..."
cd $APP_DIR/backend

# Install dependencies
sudo -u donationapp composer install --optimize-autoloader --no-dev

# Configure environment
sudo -u donationapp cp ../.env.example .env
sudo -u donationapp sed -i "s/APP_ENV=.*/APP_ENV=production/" .env
sudo -u donationapp sed -i "s/APP_DEBUG=.*/APP_DEBUG=false/" .env
sudo -u donationapp sed -i "s/APP_URL=.*/APP_URL=https:\/\/$DOMAIN/" .env
sudo -u donationapp sed -i "s/DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env
sudo -u donationapp sed -i "s/DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env
sudo -u donationapp sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
sudo -u donationapp sed -i "s/RAZORPAY_KEY_ID=.*/RAZORPAY_KEY_ID=$RAZORPAY_KEY/" .env
sudo -u donationapp sed -i "s/RAZORPAY_KEY_SECRET=.*/RAZORPAY_KEY_SECRET=$RAZORPAY_SECRET/" .env
sudo -u donationapp sed -i "s/ADMIN_EMAIL=.*/ADMIN_EMAIL=$ADMIN_EMAIL/" .env
sudo -u donationapp sed -i "s/ADMIN_PASSWORD=.*/ADMIN_PASSWORD=$ADMIN_PASSWORD/" .env
sudo -u donationapp sed -i "s/FRONTEND_URL=.*/FRONTEND_URL=https:\/\/$DOMAIN/" .env

# Generate application key
sudo -u donationapp php artisan key:generate

# Setup database
echo "🗄️  Setting up database..."
mysql -u root -p <<MYSQL_SCRIPT
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT

# Run migrations
sudo -u donationapp php artisan migrate --force

# Seed admin user
sudo -u donationapp php artisan db:seed --force

# Optimize Laravel
sudo -u donationapp php artisan config:cache
sudo -u donationapp php artisan route:cache
sudo -u donationapp php artisan view:cache

# Set permissions
sudo chown -R donationapp:www-data $APP_DIR/backend/storage
sudo chown -R donationapp:www-data $APP_DIR/backend/bootstrap/cache
sudo chmod -R 775 $APP_DIR/backend/storage
sudo chmod -R 775 $APP_DIR/backend/bootstrap/cache

# Setup frontend
echo "⚛️  Setting up React frontend..."
cd $APP_DIR/frontend

# Install dependencies
sudo -u donationapp npm install

# Build for production
sudo -u donationapp REACT_APP_API_URL=https://$DOMAIN/api npm run build

# Copy build to web directory
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html

echo ""
echo "✅ Application deployment complete!"
echo ""
echo "Next steps:"
echo "1. Configure Nginx: sudo nano /etc/nginx/sites-available/donation-app"
echo "2. Setup SSL: sudo certbot --nginx -d $DOMAIN"
echo "3. Restart services: sudo systemctl restart nginx php8.2-fpm"
echo ""
