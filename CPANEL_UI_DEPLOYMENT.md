# cPanel Node.js Deployment Guide (UI Only)

## Initial Setup (One Time)

### 1. Configure Git Repository in cPanel
- Go to **Git™ Version Control** in cPanel
- Click **"Create"** or **"Clone"**
- Enter your repository URL
- Set deployment path (e.g., `/home/username/repositories/donation-app`)
- Click **"Create"** or **"Update"**

### 2. Configure Node.js Application
- Go to **Setup Node.js App** in cPanel
- Click **"Create Application"**
- Settings:
  - **Node.js version:** 18.x or higher
  - **Application mode:** Production
  - **Application root:** `/home/username/repositories/donation-app/nextjs-app`
  - **Application URL:** prabhupadannakshetra.org
  - **Application startup file:** `start-optimized.js`

### 3. Add Environment Variables
Click **"+ ADD VARIABLE"** for each:

| Variable | Value |
|----------|-------|
| NODE_ENV | production |
| DB_HOST | localhost |
| DB_DATABASE | (your database name) |
| DB_USERNAME | (your database user) |
| DB_PASSWORD | (your database password) |
| JWT_SECRET | (generate random: openssl rand -base64 32) |

Optional (if using Razorpay):
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET  
- NEXT_PUBLIC_RAZORPAY_KEY_ID

### 4. Install & Start
- Click **"Run NPM Install"**
- Wait for completion
- Click **"Restart"** button

---

## Deploying Updates (Every Time You Make Changes)

### Step 1: Push Your Code
On your local machine:
```bash
git push origin main
```

### Step 2: Pull in cPanel
- Go to **Git™ Version Control**
- Find your repository
- Click **"Pull or Deploy"** → **"Update from Remote"**
- Click **"Pull"**

### Step 3: Rebuild & Restart
- Go to **Setup Node.js App**
- Find your application
- Click **"Run NPM Install"** (to install any new dependencies)
- Click **"Restart"**

The `start-optimized.js` will auto-rebuild if needed!

---

## Troubleshooting

### App shows "It works!" page
- Environment variables not set
- App not started properly
- Check application logs in Node.js interface

### Build errors
- Click **"Stop Application"**
- Click **"Run NPM Install"** 
- Wait for completion
- Click **"Restart"**

### Database connection errors
- Verify DB credentials in environment variables
- Ensure database exists
- Check DB user permissions

---

## Quick Reference: Update Workflow

1. `git push` (local)
2. cPanel → Git™ → Pull
3. cPanel → Node.js → Restart

That's it! 🚀
