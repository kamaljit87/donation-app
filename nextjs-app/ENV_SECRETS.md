## 📋 Environment Variables for cPanel Deployment

Store these as secrets in your CI/CD platform (GitHub Actions, GitLab CI, etc.)

### Required Secrets

Add these in: **Repository Settings → Secrets and variables → Actions**

| Secret Name | Example Value | Where to Get |
|------------|---------------|--------------|
| **SSH & Server** | | |
| `CPANEL_HOST` | `yourserver.com` | Your hosting provider |
| `CPANEL_USERNAME` | `cpaneluser` | cPanel login username |
| `SSH_PRIVATE_KEY` | `-----BEGIN RSA...` | Generate SSH key pair (see below) |
| **Database** | | |
| `DB_HOST` | `localhost` | Usually localhost on cPanel |
| `DB_PORT` | `3306` | Default MySQL port |
| `DB_DATABASE` | `cpuser_donation` | cPanel MySQL database name |
| `DB_USERNAME` | `cpuser_donapp` | cPanel MySQL user |
| `DB_PASSWORD` | `your_db_password` | Database password from cPanel |
| **Application** | | |
| `APP_NAME` | `Donation App` | Your app name |
| `APP_URL` | `https://yourdomain.com` | Your domain |
| `JWT_SECRET` | `base64:long_random_string` | Generate: `openssl rand -base64 32` |
| **Razorpay** | | |
| `RAZORPAY_KEY_ID` | `rzp_live_ABC123` | Razorpay Dashboard → API Keys |
| `RAZORPAY_KEY_SECRET` | `secret_XYZ789` | Razorpay Dashboard → API Keys |

### Generate SSH Key for Deployment

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_deploy

# View public key to add to cPanel
cat ~/.ssh/github_deploy.pub

# Add public key to cPanel server
ssh-copy-id -i ~/.ssh/github_deploy.pub your_username@yourserver.com

# View private key to add to GitHub Secrets
cat ~/.ssh/github_deploy
# Copy entire output including "-----BEGIN..." and "-----END..."
```

### Add to GitHub

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret from table above

### Generate JWT Secret

```bash
openssl rand -base64 32
```

Copy output and add as `JWT_SECRET` in GitHub Secrets.

### Environment File Template

For manual deployment, create `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_cpanel_username_donation
DB_USERNAME=your_cpanel_username_donapp
DB_PASSWORD=your_database_password

# Application
NEXT_PUBLIC_APP_NAME="Donation App"
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# JWT Secret
JWT_SECRET=your_generated_jwt_secret_here

# Razorpay
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id

# Environment
NODE_ENV=production
```

### Security Notes

⚠️ **NEVER commit `.env` files to Git!**

✅ **DO:**
- Use `.env.example` as templates
- Store real values in CI/CD secrets
- Use different credentials for dev/production
- Rotate secrets regularly

❌ **DON'T:**
- Commit `.env` to repository
- Share `.env` via email/chat
- Use same passwords everywhere
- Use test keys in production
