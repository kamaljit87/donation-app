# Quick Start - cPanel Deployment

## 🚀 Deploy in 3 Steps

### Step 1: Run Deployment Script (On Your Computer)

```bash
cd /var/www/donation-app
chmod +x cpanel-deploy/deploy-all.sh
./cpanel-deploy/deploy-all.sh
```

**You'll be asked for:**
- Domain name
- Database details  
- Razorpay credentials
- Admin credentials

**Result:** Creates deployment package in `cpanel-deploy/` folder

---

### Step 2: Upload to cPanel

**Backend:**
1. Upload `backend-package.tar.gz` to home directory
2. Extract it
3. Rename to `donation-backend`
4. Run: `cd donation-backend && bash SETUP.sh`

**Frontend:**
1. Upload `frontend-build.zip` to `public_html`
2. Extract it
3. Upload `frontend.htaccess` and rename to `.htaccess`

**Database:**
1. Create MySQL database in cPanel
2. Create user and grant privileges

**API Subdomain:**
1. Create subdomain: `api.yourdomain.com`
2. Point to: `/home/username/donation-backend/public`
3. Set PHP 8.1+

---

### Step 3: Install SSL & Test

1. Go to SSL/TLS Status → Run AutoSSL
2. Visit: https://yourdomain.com
3. Login admin: https://yourdomain.com/admin
4. Test donation flow

---

## 📚 Full Guides Available

- **[DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)** - Complete checklist with every step
- **[CPANEL_DEPLOYMENT.md](../CPANEL_DEPLOYMENT.md)** - Detailed guide with troubleshooting
- **[DEPLOY-INSTRUCTIONS.md](DEPLOY-INSTRUCTIONS.md)** - Generated after running deploy-all.sh

---

## 📁 Deployment Files

After running `deploy-all.sh`, you'll get:

- `frontend-build.zip` - React app ready to upload
- `backend-package.tar.gz` - Laravel app with .env configured
- `frontend.htaccess` - Apache config for React Router
- `DEPLOY-INSTRUCTIONS.md` - Custom instructions with your details

---

## 💾 Disk Space (1GB Limit)

Your app will use approximately:
- Backend: ~200-300 MB (with vendor/)
- Frontend: ~10-20 MB (optimized build)
- Database: ~10-50 MB (grows with donations)
- **Total: ~300-400 MB** ✅ Fits easily!

---

## 🆘 Quick Troubleshooting

**500 Error:**
```bash
cd ~/donation-backend
chmod -R 755 storage bootstrap/cache
php artisan config:clear
```

**CORS Error:**
- Check backend/config/cors.php
- Verify .env FRONTEND_URL and SANCTUM_STATEFUL_DOMAINS

**Blank Page:**
- Check browser console (F12)
- Verify .htaccess in public_html
- Check static files extracted correctly

---

## ⏱️ Time Estimate

- **Build locally**: 5 minutes
- **Upload to cPanel**: 10 minutes
- **Configure & test**: 15 minutes
- **Total**: ~30 minutes

---

Need help? Read the detailed guides above! 📖
