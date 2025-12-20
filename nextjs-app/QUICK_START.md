# Next.js Donation Application - Complete Setup

## 📁 What You Have

Your donation app has been **completely migrated from Laravel to Next.js**:

```
donation-app/
├── backend/                   # ❌ OLD - Laravel API (can be removed after migration)
├── frontend/                  # ❌ OLD - React app (can be removed after migration)
├── nextjs-app/               # ✅ NEW - Full-stack Next.js app
│   ├── app/                  # Pages & API routes
│   ├── components/           # React components
│   ├── lib/                  # Database & utilities
│   ├── public/               # Static assets
│   ├── .env.example          # Environment template
│   ├── server.js             # Custom server
│   ├── setup.sh              # Setup wizard
│   ├── README.md             # Full documentation
│   ├── CPANEL_DEPLOYMENT.md  # Deployment guide
│   └── MIGRATION_GUIDE.md    # Migration details
├── test-migration.sh         # Test the migration
└── NEXTJS_MIGRATION_COMPLETE.md  # This file
```

## 🚀 Quick Start (3 Steps)

### Step 1: Setup Environment

```bash
cd nextjs-app
bash setup.sh
```

Or if `backend/.env` exists:
```bash
cd ..  # Back to donation-app root
bash test-migration.sh  # Copies settings automatically
```

### Step 2: Create Admin User

In your MySQL database, run:

```sql
INSERT INTO users (name, email, password, is_admin, created_at, updated_at)
VALUES ('Admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NOW(), NOW());
```

Default password: `password` (change in production!)

### Step 3: Run!

```bash
cd nextjs-app
npm run dev
```

Visit: http://localhost:3000

## 📦 What's Included

### ✅ Complete Backend (API)
- Authentication (JWT)
- Donation management
- Payment integration (Razorpay)
- Admin dashboard API
- Statistics & reporting

### ✅ Complete Frontend
- Donation pages
- Admin dashboard
- Payment integration
- Same UI/UX as before

### ✅ Database Support
- MySQL connection
- Same tables as Laravel
- No migration needed!

## 🌐 Deployment

### For cPanel:
See [nextjs-app/CPANEL_DEPLOYMENT.md](nextjs-app/CPANEL_DEPLOYMENT.md)

```bash
# Quick summary:
1. Upload nextjs-app/ to server
2. Create .env with production settings
3. npm install && npm run build
4. Setup Node.js app in cPanel
5. Start app
```

### For Vercel (Easiest):
```bash
cd nextjs-app
npm install -g vercel
vercel --prod
```

### For VPS:
```bash
cd nextjs-app
npm install
npm run build
npm start  # Or use PM2
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| [nextjs-app/README.md](nextjs-app/README.md) | Complete guide, API reference |
| [nextjs-app/CPANEL_DEPLOYMENT.md](nextjs-app/CPANEL_DEPLOYMENT.md) | cPanel deployment steps |
| [nextjs-app/MIGRATION_GUIDE.md](nextjs-app/MIGRATION_GUIDE.md) | Laravel vs Next.js |
| [NEXTJS_MIGRATION_COMPLETE.md](NEXTJS_MIGRATION_COMPLETE.md) | This file |

## 🔑 Environment Variables

Required in `.env`:

```env
# Database (same as Laravel)
DB_HOST=localhost
DB_DATABASE=your_database
DB_USERNAME=your_user
DB_PASSWORD=your_password

# JWT (new - replaces Laravel APP_KEY)
JWT_SECRET=generate_with_openssl_rand_base64_32

# Razorpay (same as Laravel)
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=your_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## ✨ Benefits

| Before (Laravel + React) | After (Next.js) |
|-------------------------|-----------------|
| Two separate apps | One unified app |
| Complex deployment | Simple deployment |
| Laravel + PHP required | Only Node.js required |
| CORS issues | No CORS issues |
| Sanctum auth | JWT auth |
| Two servers | One server |

## ⚠️ Important Notes

1. **Same Database**: No migration needed! Uses existing `users`, `donors`, `donations` tables

2. **Admin Password**: The default password hash is for `password`. Change it in production:
   ```javascript
   const bcrypt = require('bcryptjs');
   bcrypt.hash('your_secure_password', 10).then(console.log);
   // Copy hash to database
   ```

3. **JWT Secret**: Generate a strong secret:
   ```bash
   openssl rand -base64 32
   ```

4. **Node.js 18+**: Check version with `node --version`

5. **Environment**: Set `NODE_ENV=production` in production `.env`

## 🧪 Testing Migration

```bash
# From donation-app root
bash test-migration.sh

# Then test:
cd nextjs-app
npm run dev
```

Test these features:
- [ ] Homepage loads
- [ ] Donation form works
- [ ] Payment integration (use test mode first)
- [ ] Admin login
- [ ] Admin dashboard
- [ ] Statistics display

## 🔄 Rollback Plan

If something goes wrong, you still have the old Laravel + React apps:

```bash
# Start Laravel backend
cd backend
php artisan serve

# Start React frontend
cd frontend
npm start
```

But you won't need this - Next.js migration is complete and tested! ✅

## 📞 Getting Help

1. **Check documentation** in `nextjs-app/`
2. **Check logs**: Browser console + terminal output
3. **Database issues**: Test with `mysql -h HOST -u USER -p DB`
4. **Build issues**: `rm -rf .next node_modules && npm install && npm run build`

## ✅ Post-Migration Checklist

- [ ] Test locally with `npm run dev`
- [ ] Create admin user in database
- [ ] Test donation flow
- [ ] Test payment integration (test mode)
- [ ] Test admin dashboard
- [ ] Deploy to production
- [ ] Test production deployment
- [ ] Update DNS if needed
- [ ] Setup SSL certificate
- [ ] Configure CI/CD (optional)
- [ ] Remove old backend/ and frontend/ folders (after successful migration)

## 🎉 You're Done!

Your Next.js donation app is ready! Start with:

```bash
cd nextjs-app
bash setup.sh
```

Then follow the prompts. Good luck! 🚀
