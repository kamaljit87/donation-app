#!/bin/bash

# Quick Deployment Script for Docker Setup
# Run this after cleanup-and-install-docker.sh

set -e

echo "=========================================="
echo "  Donation App - Docker Deployment"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Run cleanup-and-install-docker.sh first"
    exit 1
fi

# Get configuration from user
read -p "Enter your domain name (or press Enter for localhost): " DOMAIN
DOMAIN=${DOMAIN:-localhost}

read -p "Enter database password: " -s DB_PASSWORD
echo ""

read -p "Enter Razorpay Key ID: " RAZORPAY_KEY_ID
read -sp "Enter Razorpay Key Secret: " RAZORPAY_KEY_SECRET
echo ""

read -p "Enter admin email [admin@donationapp.com]: " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@donationapp.com}

read -sp "Enter admin password [Admin@123]: " ADMIN_PASSWORD
ADMIN_PASSWORD=${ADMIN_PASSWORD:-Admin@123}
echo -e "\n"

# Clone repository if not exists
if [ ! -d "donation-app" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/kamaljit87/donation-app.git
fi

cd donation-app

# Create .env file
echo "📝 Creating .env file..."
cat > .env <<EOF
# Application
APP_NAME=DonationApp
APP_ENV=production
APP_KEY=base64:$(openssl rand -base64 32)
APP_DEBUG=false
APP_URL=https://$DOMAIN

# Database
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=donation_app
DB_USERNAME=donation_user
DB_PASSWORD=$DB_PASSWORD

# Razorpay
RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET

# Frontend
FRONTEND_URL=https://$DOMAIN
REACT_APP_API_URL=https://$DOMAIN/api

# Admin Credentials
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD

# Domain (for nginx proxy)
DOMAIN=$DOMAIN
EOF

echo "✅ Environment configured"

# Create SSL directory
mkdir -p ssl

# Build and start containers
echo ""
echo "🐳 Building and starting Docker containers..."
docker-compose up -d --build

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "=========================================="
echo "  ✅ Deployment Complete!"
echo "=========================================="
echo ""

if [ "$DOMAIN" = "localhost" ]; then
    echo "🌐 Access your application:"
    echo "  Frontend: http://localhost"
    echo "  Admin Panel: http://localhost"
    echo ""
    echo "⚠️  For production with SSL:"
    echo "  1. Point your domain DNS to this server"
    echo "  2. Run: ./setup-ssl.sh"
else
    echo "🌐 Your application is accessible at:"
    echo "  http://$DOMAIN (HTTP)"
    echo ""
    echo "🔐 To enable HTTPS with SSL certificate:"
    echo "  1. Ensure DNS points to this server"
    echo "  2. Run: ./setup-ssl.sh"
fi

echo ""
echo "👤 Admin Login:"
echo "  Email: $ADMIN_EMAIL"
echo "  Password: $ADMIN_PASSWORD"
echo ""
echo "📊 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop: docker-compose down"
echo "  Restart: docker-compose restart"
echo ""
