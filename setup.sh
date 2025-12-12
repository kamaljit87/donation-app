#!/bin/bash

# Donation App - Automated Setup Script
# This script automates the installation and configuration process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "=================================================="
echo "  Donation App - Automated Setup"
echo "=================================================="
echo -e "${NC}"

# Check if running from correct directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists php; then
    echo -e "${RED}PHP is not installed. Please install PHP 8.1 or higher.${NC}"
    exit 1
fi

if ! command_exists composer; then
    echo -e "${RED}Composer is not installed. Please install Composer.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi

if ! command_exists mysql; then
    echo -e "${RED}MySQL is not installed. Please install MySQL.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites found${NC}\n"

# Collect configuration
echo -e "${YELLOW}Please provide the following information:${NC}\n"

read -p "Database name [donation_app]: " DB_NAME
DB_NAME=${DB_NAME:-donation_app}

read -p "Database username [root]: " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Database password: " DB_PASS
echo ""

read -p "Admin email [admin@donationapp.com]: " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@donationapp.com}

read -sp "Admin password [Admin@123]: " ADMIN_PASS
ADMIN_PASS=${ADMIN_PASS:-Admin@123}
echo ""

read -p "Razorpay Key ID: " RAZORPAY_KEY
read -sp "Razorpay Key Secret: " RAZORPAY_SECRET
echo -e "\n"

# Setup Backend
echo -e "${YELLOW}Setting up backend...${NC}"

cd backend

# Install dependencies
echo "Installing PHP dependencies..."
composer install --quiet

# Copy environment file
if [ ! -f .env ]; then
    cp ../.env.example .env
    echo -e "${GREEN}✓ Environment file created${NC}"
fi

# Update .env file
echo "Configuring environment..."
sed -i.bak "s/DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env
sed -i.bak "s/DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env
sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/" .env
sed -i.bak "s/ADMIN_EMAIL=.*/ADMIN_EMAIL=$ADMIN_EMAIL/" .env
sed -i.bak "s/ADMIN_PASSWORD=.*/ADMIN_PASSWORD=$ADMIN_PASS/" .env
sed -i.bak "s/RAZORPAY_KEY_ID=.*/RAZORPAY_KEY_ID=$RAZORPAY_KEY/" .env
sed -i.bak "s/RAZORPAY_KEY_SECRET=.*/RAZORPAY_KEY_SECRET=$RAZORPAY_SECRET/" .env
rm .env.bak

# Generate application key
echo "Generating application key..."
php artisan key:generate --quiet

echo -e "${GREEN}✓ Backend configured${NC}\n"

# Setup Database
echo -e "${YELLOW}Setting up database...${NC}"

# Check if database exists
DB_EXISTS=$(mysql -u$DB_USER -p$DB_PASS -e "SHOW DATABASES LIKE '$DB_NAME';" | grep "$DB_NAME" > /dev/null; echo "$?")

if [ $DB_EXISTS -eq 0 ]; then
    read -p "Database '$DB_NAME' already exists. Drop and recreate? (y/N): " DROP_DB
    if [ "$DROP_DB" = "y" ] || [ "$DROP_DB" = "Y" ]; then
        mysql -u$DB_USER -p$DB_PASS -e "DROP DATABASE $DB_NAME;"
        mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE $DB_NAME;"
        echo -e "${GREEN}✓ Database recreated${NC}"
    fi
else
    mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE $DB_NAME;"
    echo -e "${GREEN}✓ Database created${NC}"
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --quiet

# Seed admin user
echo "Seeding admin user..."
php artisan db:seed --quiet

echo -e "${GREEN}✓ Database setup complete${NC}\n"

cd ..

# Setup Frontend
echo -e "${YELLOW}Setting up frontend...${NC}"

cd frontend

# Install dependencies
echo "Installing Node dependencies..."
npm install --silent

# Create environment file
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

echo -e "${GREEN}✓ Frontend configured${NC}\n"

cd ..

# Final instructions
echo -e "${GREEN}"
echo "=================================================="
echo "  Setup Complete!"
echo "=================================================="
echo -e "${NC}"

echo -e "${YELLOW}Configuration Summary:${NC}"
echo "  Database: $DB_NAME"
echo "  Admin Email: $ADMIN_EMAIL"
echo "  Admin Password: $ADMIN_PASS"
echo ""

echo -e "${YELLOW}To start the application:${NC}"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend"
echo "    php artisan serve"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend"
echo "    npm start"
echo ""

echo -e "${YELLOW}Access URLs:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Admin Login: http://localhost:3000/admin/login"
echo "  Backend API: http://localhost:8000/api"
echo ""

echo -e "${GREEN}Happy coding! 🚀${NC}"
