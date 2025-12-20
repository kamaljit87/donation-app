# cPanel Node.js Deployment Guide

## Quick Setup Steps

### 1. Build the Application Locally
```bash
cd /var/www/donation-app/nextjs-app
npm run build
```

### 2. Upload to cPanel
Upload these files/folders to your cPanel public_html or application directory:
- `.next/` (entire folder after build)
- `public/` folder
- `node_modules/` (or run npm install on server)
- `package.json`
- `package-lock.json`
- `server.js`
- `jsconfig.json`
- All CSS files from root directory

### 3. cPanel Configuration

**Application URL:** prabhupadannakshetra.org

**Application startup file:** server.js

**Application root:** (path to your uploaded files, e.g., `/home/username/prabhupadannakshetra.org`)

### 4. Environment Variables (Click "ADD VARIABLE" for each)

Add these variables in the cPanel interface:

| Variable Name | Value |
|--------------|-------|
| NODE_ENV | production |
| PORT | (leave empty, cPanel sets this automatically) |
| DB_HOST | localhost |
| DB_PORT | 3306 |
| DB_DATABASE | your_database_name |
| DB_USERNAME | your_database_user |
| DB_PASSWORD | your_database_password |
| JWT_SECRET | your_jwt_secret_key_here |
| RAZORPAY_KEY_ID | your_razorpay_key_id |
| RAZORPAY_KEY_SECRET | your_razorpay_secret |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | your_razorpay_key_id |

### 5. Install Dependencies

Click "Run NPM Install" button in cPanel interface.

### 6. Start Application

After environment variables are set and dependencies installed, restart the application.

## Troubleshooting Lock Errors

If you see "Can't acquire lock for app" errors:

1. Stop the application in cPanel
2. Wait 30 seconds
3. Start it again

Or use SSH:
```bash
cd ~/prabhupadannakshetra.org
killall node
rm -f .cpanel/node/app.pid
```

Then restart from cPanel interface.

## Database Setup

Create a MySQL database in cPanel and import the schema:
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_method VARCHAR(50),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  donation_type VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE SET NULL
);
```

## Post-Deployment Checklist

- [ ] Build completed successfully
- [ ] All files uploaded to cPanel
- [ ] NPM dependencies installed
- [ ] Environment variables configured
- [ ] Database created and schema imported
- [ ] Application started without errors
- [ ] Website accessible at prabhupadannakshetra.org
- [ ] Test donation flow
- [ ] Test admin login

## Performance Tips

1. Keep `.next/` folder updated when you make changes
2. Run `npm run build` locally before uploading
3. Use cPanel's Node.js version selector to use Node 18+
4. Enable gzip compression (already configured in server.js)
