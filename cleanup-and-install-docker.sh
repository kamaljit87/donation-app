#!/bin/bash

# Server Cleanup and Docker Installation Script
# This script removes LAMP stack and installs Docker & Docker Compose

set -e

echo "=========================================="
echo "  Server Cleanup & Docker Installation"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

echo "⚠️  WARNING: This script will:"
echo "   - Remove Apache/Nginx web servers"
echo "   - Remove PHP and related packages"
echo "   - Remove MySQL/MariaDB (databases will be backed up)"
echo "   - Install Docker and Docker Compose"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Installation cancelled"
    exit 0
fi

# Backup MySQL databases
echo ""
echo "📦 Backing up MySQL databases..."
BACKUP_DIR="/root/mysql_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

if command -v mysql &> /dev/null; then
    echo "Enter MySQL root password for backup (press Enter if no password):"
    read -s MYSQL_ROOT_PASSWORD
    
    if [ -z "$MYSQL_ROOT_PASSWORD" ]; then
        mysql -u root -e "SHOW DATABASES;" 2>/dev/null | grep -Ev "(Database|information_schema|performance_schema|mysql|sys)" | while read dbname; do
            echo "Backing up database: $dbname"
            mysqldump -u root "$dbname" > "$BACKUP_DIR/$dbname.sql" 2>/dev/null || echo "⚠️  Could not backup $dbname"
        done
    else
        mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SHOW DATABASES;" 2>/dev/null | grep -Ev "(Database|information_schema|performance_schema|mysql|sys)" | while read dbname; do
            echo "Backing up database: $dbname"
            mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" "$dbname" > "$BACKUP_DIR/$dbname.sql" 2>/dev/null || echo "⚠️  Could not backup $dbname"
        done
    fi
    echo "✅ Databases backed up to: $BACKUP_DIR"
else
    echo "ℹ️  MySQL not found, skipping backup"
fi

# Stop services
echo ""
echo "🛑 Stopping services..."
systemctl stop apache2 2>/dev/null || echo "ℹ️  Apache not running"
systemctl stop nginx 2>/dev/null || echo "ℹ️  Nginx not running"
systemctl stop mysql 2>/dev/null || echo "ℹ️  MySQL not running"
systemctl stop mariadb 2>/dev/null || echo "ℹ️  MariaDB not running"
systemctl stop php*-fpm 2>/dev/null || echo "ℹ️  PHP-FPM not running"

# Disable services
echo ""
echo "🚫 Disabling services..."
systemctl disable apache2 2>/dev/null || true
systemctl disable nginx 2>/dev/null || true
systemctl disable mysql 2>/dev/null || true
systemctl disable mariadb 2>/dev/null || true

# Remove Apache
echo ""
echo "🗑️  Removing Apache..."
apt-get remove --purge -y apache2 apache2-utils apache2-bin apache2.2-common 2>/dev/null || true
apt-get autoremove -y 2>/dev/null || true

# Remove Nginx
echo ""
echo "🗑️  Removing Nginx..."
apt-get remove --purge -y nginx nginx-common nginx-core 2>/dev/null || true
apt-get autoremove -y 2>/dev/null || true

# Remove PHP
echo ""
echo "🗑️  Removing PHP..."
apt-get remove --purge -y php* 2>/dev/null || true
apt-get autoremove -y 2>/dev/null || true

# Remove MySQL/MariaDB
echo ""
echo "🗑️  Removing MySQL/MariaDB..."
apt-get remove --purge -y mysql-server mysql-client mysql-common mariadb-server mariadb-client 2>/dev/null || true
apt-get autoremove -y 2>/dev/null || true
rm -rf /etc/mysql /var/lib/mysql 2>/dev/null || true

# Clean up configuration files
echo ""
echo "🧹 Cleaning up configuration files..."
rm -rf /etc/apache2 2>/dev/null || true
rm -rf /etc/nginx 2>/dev/null || true
rm -rf /etc/php 2>/dev/null || true
rm -rf /var/www/html/* 2>/dev/null || true

# Update system
echo ""
echo "📦 Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install prerequisites
echo ""
echo "📦 Installing prerequisites..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common

# Remove old Docker versions
echo ""
echo "🗑️  Removing old Docker versions..."
apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Add Docker's official GPG key
echo ""
echo "🔑 Adding Docker GPG key..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo ""
echo "📦 Adding Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index
apt-get update -y

# Install Docker Engine
echo ""
echo "🐳 Installing Docker Engine..."
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
echo ""
echo "🚀 Starting Docker service..."
systemctl start docker
systemctl enable docker

# Verify Docker installation
echo ""
echo "✅ Verifying Docker installation..."
docker --version
docker compose version

# Add current user to docker group (if not root)
if [ -n "$SUDO_USER" ]; then
    echo ""
    echo "👤 Adding $SUDO_USER to docker group..."
    usermod -aG docker $SUDO_USER
    echo "ℹ️  Log out and back in for group changes to take effect"
fi

# Configure Docker daemon
echo ""
echo "⚙️  Configuring Docker daemon..."
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

systemctl restart docker

# Configure firewall for Docker
echo ""
echo "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw --force enable
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 2375/tcp  # Docker API (optional, for remote access)
    ufw allow 2376/tcp  # Docker API SSL (optional, for remote access)
    ufw reload
    echo "✅ Firewall configured"
else
    echo "ℹ️  UFW not installed, skipping firewall configuration"
fi

# Test Docker
echo ""
echo "🧪 Testing Docker installation..."
docker run --rm hello-world

# Clean up
echo ""
echo "🧹 Final cleanup..."
apt-get autoremove -y
apt-get autoclean -y

echo ""
echo "=========================================="
echo "  ✅ Installation Complete!"
echo "=========================================="
echo ""
echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker compose version)"
echo ""
echo "📁 MySQL backups saved to: $BACKUP_DIR"
echo ""
echo "🎯 Next steps:"
echo "1. Clone your repository:"
echo "   git clone git@github.com:kamaljit87/donation-app.git"
echo ""
echo "2. Configure environment:"
echo "   cd donation-app"
echo "   cp .env.example .env"
echo "   nano .env"
echo ""
echo "3. Start the application:"
echo "   docker-compose up -d --build"
echo ""
echo "4. Access your app:"
echo "   Frontend: http://your-server-ip:3000"
echo "   Backend API: http://your-server-ip:8000/api"
echo ""
if [ -n "$SUDO_USER" ]; then
    echo "⚠️  IMPORTANT: Log out and back in for docker group changes to take effect!"
fi
echo ""
