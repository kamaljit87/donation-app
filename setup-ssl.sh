#!/bin/bash

# SSL Certificate Setup Script for Docker Deployment
# This script obtains SSL certificates using Certbot

set -e

echo "=========================================="
echo "  SSL Certificate Setup"
echo "=========================================="
echo ""

# Get domain from user
read -p "Enter your domain name (e.g., example.com): " DOMAIN
read -p "Enter your email address for SSL notifications: " EMAIL

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "❌ Domain and email are required!"
    exit 1
fi

echo ""
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""
read -p "Is this correct? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Setup cancelled"
    exit 0
fi

# Update nginx-proxy.conf with actual domain
echo "📝 Updating nginx configuration with domain..."
sed -i.bak "s/\${DOMAIN}/$DOMAIN/g" nginx-proxy.conf
echo "✅ Configuration updated"

# Create temporary nginx config for initial certificate
echo "📝 Creating temporary nginx config for certificate generation..."
cat > nginx-proxy-temp.conf <<EOF
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 200 'OK';
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Start nginx with temporary config
echo "🚀 Starting nginx with temporary configuration..."
docker-compose up -d nginx-proxy

# Wait for nginx to be ready
echo "⏳ Waiting for nginx to start..."
sleep 5

# Get SSL certificate
echo "🔐 Obtaining SSL certificate from Let's Encrypt..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate obtained successfully!"
    
    # Replace temporary config with production config
    echo "📝 Applying production nginx configuration..."
    mv nginx-proxy-temp.conf nginx-proxy-temp.conf.bak
    
    # Reload nginx with production config
    docker-compose restart nginx-proxy
    
    echo ""
    echo "=========================================="
    echo "  ✅ SSL Setup Complete!"
    echo "=========================================="
    echo ""
    echo "Your application is now accessible at:"
    echo "  https://$DOMAIN"
    echo "  https://www.$DOMAIN"
    echo ""
    echo "Certificate will auto-renew every 12 hours."
else
    echo "❌ Failed to obtain SSL certificate"
    echo "Please check:"
    echo "  1. Domain DNS points to this server"
    echo "  2. Ports 80 and 443 are open"
    echo "  3. No other services are using these ports"
    exit 1
fi
