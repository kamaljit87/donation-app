# 📋 Step-by-Step cPanel Deployment Checklist

Use this checklist to deploy your donation app to cPanel hosting.

## ✅ Pre-Deployment (On Your Local Machine)

- [ ] **Install Node.js 18+**
  ```bash
  node --version  # Should show v18 or higher
  ```

- [ ] **Navigate to project directory**
  ```bash
  cd /var/www/donation-app
  ```

- [ ] **Make deployment script executable**
  ```bash
  chmod +x cpanel-deploy/deploy-all.sh
  ```

- [ ] **Run deployment script**
  ```bash
  ./cpanel-deploy/deploy-all.sh
  ```
  
  You'll be asked for:
  - Domain name (e.g., yourdomain.com)
  - cPanel username
  - Database details
  - Razorpay credentials
  - Admin credentials

- [ ] **Wait for build to complete** (may take 2-5 minutes)

- [ ] **Verify files created**
  ```bash
  ls -lh cpanel-deploy/
  # Should see:
  # - frontend-build.zip
  # - backend-package.tar.gz
  # - frontend.htaccess
  # - DEPLOY-INSTRUCTIONS.md
  ```

## ✅ cPanel Setup (In Your Browser)

### Database Setup

- [ ] **Login to cPanel**
  - URL: https://yourdomain.com:2083
  - Or: https://yourserver.com:2083

- [ ] **Go to MySQL® Databases**

- [ ] **Create New Database**
  - Database name: `donation` (will become: cpanelusername_donation)
  - Click "Create Database"

- [ ] **Create Database User**
  - Username: `donapp` (will become: cpanelusername_donapp)
  - Password: Use strong password generator
  - Click "Create User"
  - **SAVE PASSWORD SECURELY!**

- [ ] **Add User to Database**
  - Select user: cpanelusername_donapp
  - Select database: cpanelusername_donation
  - Click "Add"
  - Check "ALL PRIVILEGES"
  - Click "Make Changes"

### Backend Upload & Setup

- [ ] **Go to File Manager**

- [ ] **Navigate to Home Directory**
  - Click "Home" button (NOT public_html)

- [ ] **Upload backend-package.tar.gz**
  - Click "Upload" button
  - Select backend-package.tar.gz from cpanel-deploy folder
  - Wait for upload (progress bar shows 100%)

- [ ] **Extract Backend Package**
  - Right-click on backend-package.tar.gz
  - Click "Extract"
  - Click "Extract Files"
  - Wait for completion

- [ ] **Rename Folder**
  - Right-click on "backend-package" folder
  - Click "Rename"
  - New name: `donation-backend`

- [ ] **Verify .env file exists**
  - Navigate into donation-backend folder
  - Verify .env file is present
  - (Optional) Edit if you need to change any settings

### Create API Subdomain

- [ ] **Go to Subdomains**

- [ ] **Create Subdomain**
  - Subdomain: `api`
  - Domain: (select your main domain)
  - Document Root: `/home/YOURUSERNAME/donation-backend/public`
    - Replace YOURUSERNAME with your actual cPanel username
  - Click "Create"

- [ ] **Verify Subdomain Created**
  - Should see: api.yourdomain.com in the list

### Configure PHP for Backend

- [ ] **Go to MultiPHP Manager**

- [ ] **Select API Domain**
  - Check the box next to: api.yourdomain.com

- [ ] **Set PHP Version**
  - Select "PHP 8.1" or "PHP 8.2" from dropdown
  - Click "Apply"

- [ ] **Go to Select PHP Version** (alternative: PHP Selector)

- [ ] **Enable PHP Extensions**
  - Check these extensions:
    - [x] mysqli
    - [x] pdo_mysql
    - [x] mbstring
    - [x] xml
    - [x] curl
    - [x] openssl
    - [x] tokenizer
    - [x] json
    - [x] bcmath
  - Click "Save"

### Run Backend Setup

- [ ] **Go to Terminal** (in cPanel)

- [ ] **Navigate to backend directory**
  ```bash
  cd ~/donation-backend
  ```

- [ ] **Check if setup script exists**
  ```bash
  ls -la SETUP.sh
  ```

- [ ] **Run setup script**
  ```bash
  bash SETUP.sh
  ```
  
  This will:
  - Install Composer dependencies (may take 2-3 minutes)
  - Generate application key
  - Run database migrations
  - Create admin user
  - Cache configurations

- [ ] **Verify setup completed successfully**
  - Should see "✅ Setup complete!" message

### Frontend Upload

- [ ] **Go to File Manager**

- [ ] **Navigate to public_html**
  - This is your website's root directory

- [ ] **Backup existing files (if any)**
  - Select all existing files
  - Right-click → Compress
  - Name it: backup-YYYYMMDD.zip

- [ ] **Clear public_html**
  - Delete all existing files (or move to backup folder)
  - Keep only .htaccess if you have custom rules

- [ ] **Upload frontend-build.zip**
  - Click "Upload"
  - Select frontend-build.zip
  - Wait for 100% upload

- [ ] **Extract Frontend**
  - Right-click on frontend-build.zip
  - Click "Extract"
  - Extract to: /public_html
  - Click "Extract Files"

- [ ] **Upload .htaccess for React Router**
  - Upload frontend.htaccess from cpanel-deploy folder
  - Rename it to `.htaccess`
  - If asked to overwrite, click "Yes"

- [ ] **Verify frontend files**
  - Should see: index.html in public_html
  - Should see: static/ folder with js, css, media

### SSL Certificate Setup

- [ ] **Go to SSL/TLS Status**

- [ ] **Check domains**
  - Look for:
    - yourdomain.com
    - www.yourdomain.com  
    - api.yourdomain.com

- [ ] **Run AutoSSL**
  - Click "Run AutoSSL" button
  - Wait for all domains to get certificates
  - Status should show "AutoSSL certificate installed"

- [ ] **Force HTTPS (Optional but Recommended)**
  - Edit public_html/.htaccess
  - Add at the top:
    ```apache
    # Force HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    ```

## ✅ Testing & Verification

### Test Frontend

- [ ] **Open website**
  - URL: https://yourdomain.com
  - Should load without errors

- [ ] **Check homepage loads**
  - Should see donation page/landing page

- [ ] **Check browser console**
  - Press F12
  - Go to Console tab
  - Should be no errors (or only minor warnings)

- [ ] **Test navigation**
  - Click different menu items
  - Pages should load without errors

### Test Backend API

- [ ] **Test API health**
  - Open: https://api.yourdomain.com
  - Should see Laravel welcome or 404 (both are OK)

- [ ] **Test API endpoint**
  - Open: https://api.yourdomain.com/api/admin/statistics
  - Should see: "Unauthenticated" message (this is correct!)

- [ ] **Check terminal for errors**
  ```bash
  cd ~/donation-backend
  tail -f storage/logs/laravel.log
  ```
  - Press Ctrl+C to stop

### Test Donation Flow

- [ ] **Fill donation form**
  - Go to: https://yourdomain.com
  - Select or enter amount
  - Fill donor details

- [ ] **Test Razorpay (Test Mode)**
  - Click "Donate Now"
  - Razorpay popup should appear
  - Use test card: 4111 1111 1111 1111
  - CVV: Any 3 digits
  - Expiry: Any future date

- [ ] **Verify donation recorded**
  - Should redirect to Thank You page
  - Check database or admin panel

### Test Admin Panel

- [ ] **Navigate to admin**
  - URL: https://yourdomain.com/admin

- [ ] **Login with admin credentials**
  - Use email and password you set during deployment

- [ ] **Verify admin dashboard loads**
  - Should see statistics
  - Should see donations list

- [ ] **Test admin functions**
  - View donations
  - Search donations
  - Filter by status

## ✅ Post-Deployment

### Security

- [ ] **Change admin password**
  - Go to admin panel
  - Change to a new secure password

- [ ] **Secure .env file**
  ```bash
  cd ~/donation-backend
  chmod 600 .env
  ```

- [ ] **Remove setup files (optional)**
  ```bash
  rm ~/backend-package.tar.gz
  rm ~/donation-backend/SETUP.sh
  ```

### Performance

- [ ] **Enable OPcache**
  - Contact hosting support to enable PHP OPcache

- [ ] **Enable Cloudflare** (Optional)
  - Setup Cloudflare for CDN and DDoS protection

- [ ] **Setup backups**
  - Go to cPanel → Backup
  - Enable automatic backups

### Monitoring

- [ ] **Setup monitoring**
  - Use cPanel Awstats for traffic
  - Monitor error logs regularly

- [ ] **Setup email notifications**
  - Configure email for donation notifications
  - Test email sending

- [ ] **Document credentials**
  - Database username/password
  - Admin credentials
  - Razorpay keys
  - **Store securely (use password manager)**

## 🔧 Troubleshooting Guide

### Issue: 500 Internal Server Error (Backend)

**Fix:**
```bash
cd ~/donation-backend
chmod -R 755 storage bootstrap/cache
php artisan config:clear
php artisan cache:clear
tail -f storage/logs/laravel.log  # Check for errors
```

### Issue: Frontend shows blank page

**Fix:**
- Check browser console (F12)
- Verify .htaccess exists in public_html
- Check API URL in frontend .env.production before building

### Issue: CORS errors in console

**Fix:**
- Check backend/config/cors.php
- Verify SANCTUM_STATEFUL_DOMAINS in .env
- Clear cache: `php artisan config:clear`

### Issue: Database connection error

**Fix:**
- Verify database credentials in ~/donation-backend/.env
- Test database connection in cPanel → phpMyAdmin
- Check database user has privileges

### Issue: Razorpay not working

**Fix:**
- Verify Razorpay keys in both:
  - Backend .env (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
  - Frontend was built with correct RAZORPAY_KEY_ID
- Test mode vs Live mode keys

## 📞 Get Help

If stuck:
1. Check error logs: ~/donation-backend/storage/logs/laravel.log
2. Check cPanel error logs
3. Review CPANEL_DEPLOYMENT.md for detailed info
4. Contact hosting support for server issues

## ✨ Success!

Once all checkboxes are complete, your donation app is live! 🎉

- **Website**: https://yourdomain.com
- **Admin**: https://yourdomain.com/admin
- **API**: https://api.yourdomain.com

---

**Time Estimate**: 30-45 minutes for first deployment
**Disk Usage**: ~300-500 MB (well within 1GB limit)
