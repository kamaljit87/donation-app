#!/bin/bash

echo "🐳 Setting up Docker environment for Donation App..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"

# Create backend .env from docker template
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.docker backend/.env
    echo "✅ Backend .env created"
else
    echo "⚠️  Backend .env already exists, skipping..."
fi

# Create frontend .env
if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend .env file..."
    cat > frontend/.env <<EOF
REACT_APP_API_URL=http://localhost/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
REACT_APP_NAME=Donation App
EOF
    echo "✅ Frontend .env created"
else
    echo "⚠️  Frontend .env already exists, skipping..."
fi

echo ""
echo "🚀 Starting Docker containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

echo ""
echo "🔑 Generating Laravel application key..."
docker-compose exec -T backend php artisan key:generate

echo ""
echo "📊 Running database migrations..."
docker-compose exec -T backend php artisan migrate --force

echo ""
echo "👤 Seeding admin user..."
docker-compose exec -T backend php artisan db:seed --class=AdminSeeder --force

echo ""
echo "✅ Docker setup complete!"
echo ""
echo "📋 Access your application:"
echo "   - Frontend: http://localhost"
echo "   - Backend API: http://localhost/api"
echo "   - MySQL: localhost:3306"
echo ""
echo "🛠️  Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop containers: docker-compose down"
echo "   - Restart: docker-compose restart"
echo "   - Shell into backend: docker-compose exec backend sh"
echo "   - Shell into frontend: docker-compose exec frontend sh"
echo ""
