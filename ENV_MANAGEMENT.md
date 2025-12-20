# Environment Variables Management Guide

This guide explains how to manage environment variables for both cPanel deployment and CI/CD automation.

## 📁 File Structure

```
donation-app/
├── .env.deployment.example      # CI/CD deployment configuration template
├── .gitignore                   # Ensures .env files are never committed
├── backend/
│   ├── .env.example            # Backend environment template
│   └── .env                    # Local development (git ignored)
└── frontend/
    ├── .env.production.example # Frontend build-time variables template
    └── .env.production         # Local production build (git ignored)
```

## 🔐 Security Best Practices

### ❌ NEVER DO THIS:
- ❌ Commit `.env` files to Git
- ❌ Store sensitive credentials in code
- ❌ Share `.env` files via email or chat
- ❌ Use same credentials for dev and production

### ✅ ALWAYS DO THIS:
- ✅ Use `.env.example` as templates
- ✅ Store secrets in CI/CD platform (GitHub Secrets, GitLab Variables, etc.)
- ✅ Use different credentials for each environment
- ✅ Set proper file permissions: `chmod 600 .env`

## 🚀 Setup Instructions

### 1. Local Development

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your local database credentials
php artisan key:generate

# Frontend
cd frontend
cp .env.production.example .env.local
# Edit .env.local with your local API URL
```

### 2. cPanel Production Server

**Manual Deployment:**

```bash
# SSH into your cPanel server
ssh your_username@yourserver.com

# Create backend .env
cd ~/donation-backend
nano .env
# Paste your production values from .env.example template
# Press Ctrl+X, then Y to save

# Secure the file
chmod 600 .env
```

**What to put in production `.env`:**
- Database credentials from cPanel MySQL section
- Production domain URL
- Live Razorpay keys (not test keys)
- Generate new `APP_KEY` with: `php artisan key:generate`

### 3. CI/CD Setup (GitHub Actions)

**Step 1: Add secrets to GitHub**
1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:

| Secret Name | Example Value | Where to get it |
|------------|---------------|-----------------|
| `CPANEL_HOST` | `yourserver.com` | Your hosting provider |
| `CPANEL_USERNAME` | `cpaneluser` | cPanel login |
| `SSH_PRIVATE_KEY` | `-----BEGIN...` | Generate SSH key pair |
| `APP_NAME` | `Donation App` | Your app name |
| `APP_KEY` | `base64:...` | Run `php artisan key:generate --show` |
| `APP_URL` | `https://yourdomain.com` | Your domain |
| `DB_DATABASE` | `cpuser_donation` | cPanel database name |
| `DB_USERNAME` | `cpuser_donapp` | Database user |
| `DB_PASSWORD` | `your_db_pass` | Database password |
| `RAZORPAY_KEY_ID` | `rzp_live_...` | Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | `your_secret` | Razorpay dashboard |
| `SANCTUM_STATEFUL_DOMAINS` | `yourdomain.com,www.yourdomain.com` | Your domains |
| `SESSION_DOMAIN` | `.yourdomain.com` | Add leading dot |
| `FRONTEND_URL` | `https://yourdomain.com` | Your domain |
| `REACT_APP_API_URL` | `https://yourdomain.com/api` | Your API URL |

**Step 2: Enable GitHub Actions**
```bash
# Rename the example workflow
mv .github/workflows/cpanel-deploy.yml.example .github/workflows/cpanel-deploy.yml

# Commit and push
git add .github/workflows/cpanel-deploy.yml
git commit -m "Add CI/CD deployment workflow"
git push
```

**Step 3: Setup SSH Key for Deployment**
```bash
# On your local machine, generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_deploy

# Copy public key to cPanel server
ssh-copy-id -i ~/.ssh/github_deploy.pub your_username@yourserver.com

# Add private key to GitHub Secrets as SSH_PRIVATE_KEY
cat ~/.ssh/github_deploy
# Copy the entire output including "-----BEGIN..." and "-----END..."
```

## 📋 Environment Variables Reference

### Backend (.env)

**Required:**
- `APP_KEY` - Laravel encryption key (generate with `php artisan key:generate`)
- `APP_URL` - Your production domain
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` - Database credentials
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` - Payment gateway credentials

**Important for cPanel:**
- `DB_HOST=localhost` - Database is on the same server
- `APP_ENV=production` - Sets production mode
- `APP_DEBUG=false` - Never debug in production
- `LOG_LEVEL=error` - Reduce log verbosity

### Frontend (.env.production)

**Build-time variables:**
- `REACT_APP_API_URL` - Backend API endpoint
- `REACT_APP_RAZORPAY_KEY_ID` - Public Razorpay key (safe to expose)

**Note:** These are embedded into the build. Change requires rebuild.

## 🔄 CI/CD Workflow

When you push to `main` branch:

1. ✅ GitHub Actions triggers
2. ✅ Builds frontend with environment variables from secrets
3. ✅ Generates backend `.env` from secrets
4. ✅ Deploys via SSH to cPanel
5. ✅ Runs migrations and optimizations
6. ✅ Sets proper permissions

## 🛠️ Troubleshooting

### Environment variable not working?

**Frontend:**
```bash
# Must start with REACT_APP_
# Rebuild after changing
cd frontend
npm run build
```

**Backend:**
```bash
# Clear config cache
php artisan config:clear
php artisan config:cache
```

### Permission denied on .env?

```bash
chmod 600 .env
chown your_username:your_username .env
```

### CI/CD deployment fails?

1. Check GitHub Secrets are set correctly
2. Verify SSH key is added to cPanel server
3. Check cPanel paths match workflow file
4. View workflow logs in GitHub Actions tab

## 📚 Additional Resources

- [Laravel Environment Configuration](https://laravel.com/docs/10.x/configuration)
- [Create React App Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## 🆘 Quick Commands

```bash
# Generate new Laravel app key
php artisan key:generate

# Check current environment
php artisan env

# Clear all caches
php artisan optimize:clear

# Cache for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Test database connection
php artisan migrate:status
```
