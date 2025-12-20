# cPanel Deployment Guide for Next.js Donation Application

Complete guide for deploying the Next.js full-stack donation application on cPanel hosting.

## 🎯 Important Notes

**Your application is now a single Next.js app:**
- **Frontend + Backend** - All-in-one Next.js application
- **Database** - Same MySQL database (no changes needed)
- **Authentication** - JWT-based (no Laravel Sanctum)

**cPanel Requirements:**
- Node.js 18+ support
- MySQL/MariaDB database (existing database works!)
- SSL certificate
- SSH access (recommended)

## 📋 Prerequisites

✅ cPanel account with:
- Node.js App feature enabled
- MySQL/MariaDB database (existing one)
- SSH access (recommended)
- Git (optional, for easier deployment)

## 🚀 Deployment Steps

### Step 1: Prepare MySQL Database

**Good News**: Use your existing database! No changes needed.

**Database tables required:**
- `users` - Admin users
- `donors` - Donor information
- `donations` - Donation records

If starting fresh, run the existing migrations from the old Laravel app, OR create an admin user manually:

```sql
-- Create admin user (password: 'password' - change hash in production!)
INSERT INTO users (name, email, password, is_admin, created_at, updated_at)
VALUES (
  'Admin',
  'admin@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  1,
  NOW(),
  NOW()
);
```

### Step 2: Upload Next.js App Files

**Via SSH:**

```bash
# SSH into your cPanel account
ssh yourusername@yourserver.com

# Create directory for the app
cd ~/
mkdir donation-nextjs
cd donation-nextjs

# Upload files (using SCP from your local machine)
# On your local machine:
scp -r nextjs-app/* yourusername@yourserver.com:~/donation-nextjs/
```

**Via cPanel File Manager:**
1. Compress `nextjs-app` folder into `nextjs-app.zip`
2. Upload to cPanel File Manager
3. Extract to `~/donation-nextjs/`

### Step 3: Configure Environment Variables

Create `.env` file in `~/donation-nextjs/`:

```bash
cd ~/donation-nextjs
nano .env
```

Add your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=yourusername_donation
DB_USERNAME=yourusername_donapp
DB_PASSWORD=your_database_password

# Application
NEXT_PUBLIC_APP_NAME="Donation App"
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_generated_secret_key_here

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id

# Environment
NODE_ENV=production
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

### Step 4: Set Up Node.js Application in cPanel

1. **Go to cPanel → Setup Node.js App**

2. **Click "Create Application"**:
   - **Node.js version**: 18.x or latest LTS
   - **Application mode**: Production
   - **Application root**: `donation-nextjs`
   - **Application URL**: `yourdomain.com` (or subdomain)
   - **Application startup file**: `server.js`
   - **Passenger log file**: Leave default

3. **Click "Create"**

### Step 5: Create Custom Server File

Create `~/donation-nextjs/server.js`:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  })
  .listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

### Step 6: Install Dependencies and Build

**Via SSH** (recommended):

```bash
cd ~/donation-nextjs

# Install dependencies
npm install

# Build for production
npm run build

# Test the build
npm start
```

**Or use cPanel Node.js App interface:**
- Click "Run NPM Install"
- Then run: `npm run build` in terminal

### Step 7: Start the Application

**In cPanel → Node.js App:**
- Click "Start App" or "Restart App"
- Check "Application is running" status

**Or via SSH:**
```bash
cd ~/donation-nextjs
npm start
```

### Step 8: Configure SSL Certificate

1. Go to cPanel → SSL/TLS Status
2. Run AutoSSL for your domain
3. Or install Let's Encrypt certificate manually

### Step 9: Test Your Application

Visit your domain:
- **Homepage**: `https://yourdomain.com`
- **Donate Page**: `https://yourdomain.com/donate`
- **Admin Login**: `https://yourdomain.com/admin/login`
- **API Test**: `https://yourdomain.com/api/auth/user` (should return 401)

## 🔧 Post-Deployment Configuration

### Set Correct File Permissions

```bash
cd ~/donation-nextjs
chmod 755 .
chmod 644 .env
chmod -R 755 .next
```

### Configure .htaccess (if needed)

If using subdirectory, create `.htaccess` in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

## 🔒 Security Checklist

- [ ] `.env` file has correct permissions (644)
- [ ] `JWT_SECRET` is strong and unique
- [ ] `NODE_ENV=production` in .env
- [ ] Database passwords are strong
- [ ] SSL certificate is installed and active
- [ ] Admin user has strong password
- [ ] Razorpay live keys (not test keys)
- [ ] Regular backups enabled

## 🔧 Common Issues & Solutions

### Issue: Application won't start

**Solution:**
```bash
cd ~/donation-nextjs

# Check Node version
node --version  # Should be 18+

# Rebuild
rm -rf .next node_modules
npm install
npm run build

# Check logs
tail -f logs/passenger.log
```

### Issue: Database connection error

**Solution:**
- Verify `.env` database credentials
- Test database connection:
```bash
mysql -h localhost -u yourusername_donapp -p yourusername_donation
```

### Issue: 502 Bad Gateway

**Solution:**
- Check if app is running in cPanel
- Verify `server.js` exists
- Check port in server.js matches cPanel assigned port
- Restart the application

### Issue: API routes return 404

**Solution:**
- Ensure build completed successfully
- Check `next.config.js` rewrites
- Verify API route files exist in `app/api/`

## 📱 Update/Deployment Scripts

### Quick Update Script

Create `~/update-app.sh`:

```bash
#!/bin/bash
set -e

echo "🔄 Updating Donation App..."

cd ~/donation-nextjs

# Pull latest code (if using git)
# git pull origin main

# Install dependencies
npm install

# Rebuild
npm run build

# Restart via cPanel or PM2
echo "✅ Build complete! Restart app in cPanel"
```

Make executable:
```bash
chmod +x ~/update-app.sh
```

### Backup Script

Create `~/backup-app.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=~/backups/$DATE

echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u yourusername_donapp -p yourusername_donation > $BACKUP_DIR/database.sql

# Backup app
tar -czf $BACKUP_DIR/app.tar.gz ~/donation-nextjs --exclude=node_modules --exclude=.next

echo "✅ Backup saved to: $BACKUP_DIR"
```

## 🎓 Monitoring & Logs

### Check Application Logs

```bash
# cPanel logs
tail -f ~/donation-nextjs/logs/passenger.log

# Or if using PM2
pm2 logs
```

### Check Application Status

```bash
cd ~/donation-nextjs
npm run build  # Should complete without errors
```

### Database Query Test

```bash
mysql -u yourusername_donapp -p yourusername_donation -e "SELECT COUNT(*) FROM donations;"
```

## 💡 Performance Optimization

### 1. Enable Node.js Production Mode

Ensure `.env` has:
```env
NODE_ENV=production
```

### 2. Use PM2 for Process Management (Optional)

```bash
npm install -g pm2

# Start with PM2
pm2 start npm --name "donation-app" -- start

# Auto-restart on server reboot
pm2 startup
pm2 save
```

### 3. Enable gzip Compression

Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

## 🔄 CI/CD Integration

See [.github/workflows/nextjs-cpanel-deploy.yml](.github/workflows/nextjs-cpanel-deploy.yml) for automated deployment.

## 📞 Support & Troubleshooting

If you encounter issues:
1. Check application logs: `tail -f ~/donation-nextjs/logs/passenger.log`
2. Verify database connectivity
3. Ensure Node.js version is 18+
4. Check `.env` configuration
5. Rebuild: `npm run build`

## 🎉 Benefits of Next.js Migration

✅ **Simpler Architecture**: One app instead of separate frontend/backend  
✅ **Better Performance**: Built-in optimizations and caching  
✅ **Easier Deployment**: Single deployment instead of two  
✅ **Same Database**: No migration needed!  
✅ **Modern Stack**: Latest React and Node.js features  
✅ **Better SEO**: Server-side rendering support  

---

**Last Updated:** December 2025

**Need Help?** Check the [README.md](README.md) for more details.
