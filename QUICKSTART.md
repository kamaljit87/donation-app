# Quick Start Guide

Get the Donation Application up and running in minutes!

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install Dependencies

\`\`\`bash
# Backend
cd backend
composer install

# Frontend
cd ../frontend
npm install
\`\`\`

### Step 2: Configure Environment

\`\`\`bash
# Copy environment file
cp .env.example backend/.env

# Edit backend/.env and update:
# - DB_DATABASE, DB_USERNAME, DB_PASSWORD
# - RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
# - ADMIN_EMAIL, ADMIN_PASSWORD

# Generate Laravel key
cd backend
php artisan key:generate
\`\`\`

### Step 3: Setup Database

\`\`\`bash
# Create database
mysql -u root -p -e "CREATE DATABASE donation_app;"

# Run migrations and seed admin user
cd backend
php artisan migrate
php artisan db:seed
\`\`\`

### Step 4: Start Servers

\`\`\`bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend
cd frontend
npm start
\`\`\`

## 🎯 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Login**: http://localhost:3000/admin/login
  - Email: admin@donationapp.com
  - Password: Admin@123

## 📋 Quick Commands

\`\`\`bash
# Reset database
php artisan migrate:fresh --seed

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# View logs
tail -f backend/storage/logs/laravel.log
\`\`\`

## 🔑 Getting Razorpay Keys

1. Visit https://dashboard.razorpay.com/signup
2. Complete registration
3. Go to Settings > API Keys
4. Generate Test/Live Keys
5. Add to `.env` file

## ✅ Verify Installation

Test these URLs to verify everything works:

1. **Backend Health**: http://localhost:8000
2. **Frontend**: http://localhost:3000
3. **Admin Login**: http://localhost:3000/admin/login
4. **API Test**: http://localhost:8000/api (should return 404, which is normal)

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Check MySQL is running and credentials in `.env` |
| Port already in use | Change port: `php artisan serve --port=8001` |
| CORS error | Verify `FRONTEND_URL` in backend `.env` |
| Admin login fails | Run `php artisan db:seed` again |
| Payment error | Check Razorpay keys are correct |

## 📚 Next Steps

- Read [README.md](README.md) for detailed documentation
- Configure production environment
- Customize UI colors and branding
- Set up email notifications
- Configure SSL certificate

## 💡 Tips

- Use **Test Mode** for Razorpay during development
- Check `storage/logs/laravel.log` for backend errors
- Use browser console for frontend debugging
- Keep both servers running simultaneously

---

Need help? Check the main README.md or open an issue!
