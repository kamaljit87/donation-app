#!/bin/bash

# Server Setup Script for Donation App
# Ubuntu 22.04 LTS

set -e

echo "=========================================="
echo "  Donation App - Server Setup"
echo "=========================================="
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install basic tools
echo "🔧 Installing basic tools..."
sudo apt-get install -y curl wget git unzip software-properties-common

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Install PHP 8.2
echo "🐘 Installing PHP 8.2..."
sudo add-apt-repository ppa:ondrej/php -y
sudo apt-get update
sudo apt-get install -y php8.2-fpm php8.2-cli php8.2-common php8.2-mysql \
    php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath

# Install Composer
echo "📦 Installing Composer..."
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Install MySQL
echo "🗄️  Installing MySQL..."
sudo apt-get install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql

# Install Node.js 18.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "⚙️  Installing PM2..."
sudo npm install -g pm2

# Install Certbot for SSL
echo "🔐 Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

# Create application user
echo "👤 Creating application user..."
sudo useradd -m -s /bin/bash donationapp || echo "User already exists"

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/donation-app
sudo chown -R donationapp:donationapp /var/www/donation-app

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo ""
echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure MySQL: sudo mysql_secure_installation"
echo "2. Clone repository: cd /var/www/donation-app && git clone <repo>"
echo "3. Run application setup: ./deploy-app.sh"
echo ""
