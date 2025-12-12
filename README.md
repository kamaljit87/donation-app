# Donation Application - Laravel + React.js

A comprehensive single-page donation application built with Laravel backend and React.js frontend, featuring Razorpay payment integration and an admin dashboard.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### Donation Page
- Modern, responsive UI inspired by Akshaya Patra
- Predefined and custom donation amounts
- One-time and monthly donation options
- Comprehensive donor information capture
- Anonymous donation option
- Tax exemption certificate request
- Real-time payment processing with Razorpay
- Payment status feedback (success, pending, failed)

### SEO Optimization
- Meta tags for search engines
- Open Graph tags for social media
- React Helmet for dynamic meta management
- Semantic HTML structure
- Optimized images and assets

### Admin Dashboard
- Secure login system (no signup)
- Dashboard with key statistics
- View all donations with filtering
- Search functionality
- Payment status tracking
- Donor information management
- Pagination support

### Security Features
- Laravel Sanctum authentication
- CORS configuration
- CSRF protection
- SQL injection prevention
- XSS protection
- Secure password hashing
- API rate limiting

## 🛠 Technology Stack

### Backend
- **Framework**: Laravel 10.x
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **Payment Gateway**: Razorpay PHP SDK

### Frontend
- **Framework**: React 18.x
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **SEO**: React Helmet Async
- **Notifications**: React Toastify

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- PHP >= 8.1
- Composer
- Node.js >= 16.x
- npm or yarn
- MySQL >= 5.7
- Git

## 🚀 Installation

### 1. Clone the Repository

\`\`\`bash
cd /Users/kamaljitsingh/Documents/work-gigs/donation\ app
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp ../.env.example .env

# Generate application key
php artisan key:generate
\`\`\`

### 3. Frontend Setup

\`\`\`bash
cd ../frontend

# Install Node dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
\`\`\`

## ⚙️ Configuration

### Backend Configuration (.env)

Edit `backend/.env` file:

\`\`\`env
# Application
APP_NAME="Donation App"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=donation_app
DB_USERNAME=root
DB_PASSWORD=your_password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend
FRONTEND_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@donationapp.com
ADMIN_PASSWORD=Admin@123
\`\`\`

### Frontend Configuration (.env)

Edit `frontend/.env` file:

\`\`\`env
REACT_APP_API_URL=http://localhost:8000/api
\`\`\`

### Razorpay Setup

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings > API Keys
3. Generate API keys for Test/Live mode
4. Copy Key ID and Key Secret to your `.env` file

## 🗄 Database Setup

### 1. Create Database

\`\`\`bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE donation_app;
exit;
\`\`\`

### 2. Run Migrations

\`\`\`bash
cd backend

# Run database migrations
php artisan migrate

# Seed admin user
php artisan db:seed
\`\`\`

The seeder will create an admin user with credentials from your `.env` file:
- Email: admin@donationapp.com
- Password: Admin@123

## 🏃 Running the Application

### Start Backend Server

\`\`\`bash
cd backend
php artisan serve
# Server runs at http://localhost:8000
\`\`\`

### Start Frontend Development Server

\`\`\`bash
cd frontend
npm start
# Application opens at http://localhost:3000
\`\`\`

## 📚 API Documentation

### Public Endpoints

#### Create Donation
\`\`\`
POST /api/donations
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "age": 30,
  "address": "123 Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "pincode": "400001",
  "pan_number": "ABCDE1234F",
  "amount": 1000,
  "donation_type": "one-time",
  "purpose": "mid-day-meals",
  "anonymous": false,
  "tax_exemption_certificate": true
}
\`\`\`

#### Create Payment Order
\`\`\`
POST /api/payment/create-order
Content-Type: application/json

{
  "donation_id": 1,
  "amount": 1000
}
\`\`\`

#### Verify Payment
\`\`\`
POST /api/payment/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
\`\`\`

### Admin Endpoints (Requires Authentication)

#### Admin Login
\`\`\`
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@donationapp.com",
  "password": "Admin@123"
}
\`\`\`

#### Get All Donations
\`\`\`
GET /api/admin/donations?status=success&search=john&page=1&per_page=15
Authorization: Bearer {token}
\`\`\`

#### Get Donation Statistics
\`\`\`
GET /api/admin/statistics
Authorization: Bearer {token}
\`\`\`

#### Logout
\`\`\`
POST /api/auth/logout
Authorization: Bearer {token}
\`\`\`

## 📖 Usage Guide

### For Donors

1. **Visit the Donation Page**: Navigate to http://localhost:3000
2. **Select Amount**: Choose from predefined amounts or enter custom amount
3. **Choose Donation Type**: Select one-time or monthly donation
4. **Select Purpose**: Choose the purpose for your donation
5. **Fill Personal Information**: Provide your details
6. **Submit**: Click "Donate" button
7. **Complete Payment**: Complete payment through Razorpay
8. **Confirmation**: Receive confirmation on success page

### For Administrators

1. **Login**: Navigate to http://localhost:3000/admin/login
2. **View Dashboard**: See statistics and recent donations
3. **Filter Donations**: Use search and status filters
4. **View Details**: Click on any donation to see full details
5. **Export Data**: Use browser tools to export data as needed

## 🔒 Security Features

### Backend Security
- **Sanctum Authentication**: Token-based authentication for API
- **CSRF Protection**: Built-in Laravel CSRF protection
- **SQL Injection Prevention**: Eloquent ORM with prepared statements
- **XSS Protection**: Input sanitization and output escaping
- **Password Hashing**: Bcrypt password hashing
- **Rate Limiting**: API rate limiting to prevent abuse

### Frontend Security
- **HTTPS**: Use HTTPS in production
- **Token Storage**: Secure token storage in localStorage
- **XSS Prevention**: React's built-in XSS protection
- **CORS**: Configured CORS policy
- **Input Validation**: Client-side validation before API calls

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
\`\`\`bash
# Check MySQL is running
sudo systemctl status mysql

# Verify credentials in .env file
# Test connection
php artisan migrate:status
\`\`\`

#### 2. CORS Error
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Clear browser cache
- Check `config/cors.php` configuration

#### 3. Payment Integration Error
- Verify Razorpay API keys are correct
- Check if Razorpay is in Test mode
- Ensure Razorpay script is loading properly

#### 4. Admin Login Not Working
\`\`\`bash
# Re-run seeder
php artisan db:seed --class=AdminSeeder

# Check credentials in .env file
\`\`\`

#### 5. Frontend Build Error
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 📱 Production Deployment

### Backend Deployment

\`\`\`bash
# Set environment to production
APP_ENV=production
APP_DEBUG=false

# Optimize application
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper file permissions
chmod -R 755 storage bootstrap/cache
\`\`\`

### Frontend Deployment

\`\`\`bash
# Build for production
npm run build

# Deploy 'build' folder to your hosting service
\`\`\`

### Environment Variables for Production

- Use strong passwords
- Use production Razorpay keys
- Enable HTTPS
- Set proper CORS origins
- Configure proper database credentials
- Enable error logging

## 🧪 Testing

### Backend Testing
\`\`\`bash
cd backend
php artisan test
\`\`\`

### Frontend Testing
\`\`\`bash
cd frontend
npm test
\`\`\`

## 📝 Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- is_admin (Boolean)
- timestamps

### Donors Table
- id (Primary Key)
- name
- email
- phone
- age
- address
- city
- state
- country
- pincode
- pan_number
- anonymous (Boolean)
- timestamps

### Donations Table
- id (Primary Key)
- donor_id (Foreign Key)
- amount (Decimal)
- currency
- donation_type
- purpose
- payment_method
- status (Enum: pending, success, failed, refunded)
- razorpay_order_id
- razorpay_payment_id
- razorpay_signature
- payment_response (JSON)
- notes
- tax_exemption_certificate (Boolean)
- payment_date
- timestamps

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@donationapp.com or open an issue in the repository.

## 🙏 Acknowledgments

- Design inspired by [Akshaya Patra](https://www.akshayapatra.org)
- Payment processing by [Razorpay](https://razorpay.com)
- Built with [Laravel](https://laravel.com) and [React](https://react.dev)

---

**Note**: Remember to replace all placeholder credentials and API keys with your actual values before deployment.
