# Deployment Commands for cPanel

## 🚀 CI/CD Deployment Guide

### Prerequisites on cPanel
- PHP 8.1+ enabled
- Node.js 18+ enabled (for Node.js app)
- MySQL database created
- Git repository access
- SSH access to cPanel

---

## 📦 Backend (Laravel) - Deploy to cPanel

### First Time Setup

```bash
# 1. Clone repository (via SSH to cPanel)
cd ~
git clone https://github.com/yourusername/donation-app.git
cd donation-app/backend

# 2. Create .env from example
cp .env.cpanel.example .env
nano .env  # Edit with your database & API credentials

# 3. Install dependencies (adjust PHP path if needed)
/usr/bin/ea-php81 /opt/cpanel/composer/bin/composer install --optimize-autoloader --no-dev

# 4. Generate app key
/usr/bin/ea-php81 artisan key:generate --force

# 5. Create storage directories
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs bootstrap/cache
chmod -R 755 storage bootstrap/cache

# 6. Run migrations
/usr/bin/ea-php81 artisan migrate --force

# 7. Seed admin user (optional - first time only)
/usr/bin/ea-php81 artisan db:seed --class=AdminSeeder --force

# 8. Optimize for production
/usr/bin/ea-php81 artisan config:cache
/usr/bin/ea-php81 artisan route:cache
/usr/bin/ea-php81 artisan view:cache
```

### Update Deployment (CI/CD)

```bash
# Run these commands each time you deploy updates
cd ~/donation-app

# 1. Pull latest code
git pull origin main

# 2. Update dependencies (if composer.json changed)
cd backend
/usr/bin/ea-php81 /opt/cpanel/composer/bin/composer install --optimize-autoloader --no-dev

# 3. Run new migrations (if any)
/usr/bin/ea-php81 artisan migrate --force

# 4. Clear and rebuild cache
/usr/bin/ea-php81 artisan config:clear
/usr/bin/ea-php81 artisan cache:clear
/usr/bin/ea-php81 artisan config:cache
/usr/bin/ea-php81 artisan route:cache
/usr/bin/ea-php81 artisan view:cache

# 5. Fix permissions
chmod -R 755 storage bootstrap/cache
```

### Backend Setup in cPanel

**Create API Subdomain:**
1. cPanel → Subdomains
2. Subdomain: `api`
3. Document Root: `/home/username/donation-app/backend/public`
4. Create subdomain

**Configure PHP:**
1. cPanel → MultiPHP Manager
2. Select `api.yourdomain.com`
3. Set PHP version: 8.1 or 8.2

---

## 🎨 Frontend (React) - Deploy to cPanel Node.js App

### First Time Setup

```bash
# 1. Already cloned from backend step
cd ~/donation-app/frontend

# 2. Create .env from example
cp .env.example .env
nano .env  # Set your API URL and Razorpay key

# 3. Install dependencies
npm install --legacy-peer-deps

# 4. Build production bundle
npm run build

# Note: Your cPanel Node.js app will run `npm start` or `node server.js`
```

### Update Deployment (CI/CD)

```bash
# Run these commands each time you deploy updates
cd ~/donation-app

# 1. Pull latest code
git pull origin main

# 2. Update frontend
cd frontend

# 3. Install/update dependencies (if package.json changed)
npm install --legacy-peer-deps

# 4. Rebuild production bundle
npm run build

# 5. Restart Node.js app from cPanel
# Go to: cPanel → Setup Node.js App → Click "Restart"
```

### Frontend Setup in cPanel Node.js App

**Create Node.js Application:**
1. cPanel → Setup Node.js App → Create Application
2. Node.js version: 18.x or 20.x
3. Application mode: Production
4. Application root: `donation-app/frontend`
5. Application URL: `yourdomain.com` (or subdomain)
6. Application startup file: `server.js`
7. Click "Create"

**Important Settings:**
- The app will run on a random port assigned by cPanel
- cPanel handles the reverse proxy automatically
- Environment variables can be set in the Node.js App interface

---

## 🔄 Quick Deploy Script (Copy & Paste)

### Laravel Backend Update
```bash
cd ~/donation-app/backend && \
git pull origin main && \
/usr/bin/ea-php81 /opt/cpanel/composer/bin/composer install --optimize-autoloader --no-dev && \
/usr/bin/ea-php81 artisan migrate --force && \
/usr/bin/ea-php81 artisan config:clear && \
/usr/bin/ea-php81 artisan cache:clear && \
/usr/bin/ea-php81 artisan config:cache && \
/usr/bin/ea-php81 artisan route:cache && \
/usr/bin/ea-php81 artisan view:cache && \
chmod -R 755 storage bootstrap/cache && \
echo "✅ Backend deployed!"
```

### React Frontend Update
```bash
cd ~/donation-app/frontend && \
git pull origin main && \
npm install --legacy-peer-deps && \
npm run build && \
echo "✅ Frontend built! Now restart Node.js app in cPanel"
```

**Then:** Go to cPanel → Setup Node.js App → Click "Restart"

---

## 📊 Space Usage (Optimized for Small Hosting)

- **Backend**: ~200-300 MB (with vendor/)
- **Frontend**: 
  - Source: ~100 MB
  - Built: ~2-5 MB
  - node_modules: ~200 MB
- **Total**: ~500-600 MB

To save space, you can delete `node_modules` after build:
```bash
cd ~/donation-app/frontend
npm run build
rm -rf node_modules  # Only if you won't redeploy soon
```

---

## 🔧 Troubleshooting

### Backend Issues

**500 Error:**
```bash
cd ~/donation-app/backend
chmod -R 755 storage bootstrap/cache
/usr/bin/ea-php81 artisan config:clear
tail -50 storage/logs/laravel.log
```

**Database Connection Error:**
- Check `.env` credentials
- Verify database exists in cPanel
- Ensure user has privileges

### Frontend Issues

**Node.js App Won't Start:**
- Check Node.js App logs in cPanel
- Verify `server.js` exists
- Ensure `build/` directory exists
- Check port is not blocked

**Blank Page:**
- Verify API URL in `.env`
- Check browser console (F12)
- Ensure build was successful

**CORS Errors:**
- Check `backend/config/cors.php`
- Verify `FRONTEND_URL` in backend `.env`

---

## 🔐 Security Checklist

- [ ] Set `APP_DEBUG=false` in backend .env
- [ ] Use strong database password
- [ ] Install SSL certificate (AutoSSL in cPanel)
- [ ] Set proper file permissions (755 for directories, 644 for files)
- [ ] Keep `.env` files out of version control
- [ ] Use environment variables for sensitive data

---

## 📝 Git Workflow

```bash
# Local development
git add .
git commit -m "Your changes"
git push origin main

# Deploy to cPanel (run on server)
cd ~/donation-app
git pull origin main
# Then run deploy commands above
```
