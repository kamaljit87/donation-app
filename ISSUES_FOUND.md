# Potential Issues Found & Fixes

## ✅ Issues Checked:

### 1. **Database Connection Issue** ⚠️
**Problem:** Database credentials are required but not validated before server starts.

**Fix:** Add connection test on startup.

### 2. **Large Gallery Images** ⚠️
**Problem:** 51 gallery images totaling 35MB - this will slow down builds and deployments.

**Impact:** 
- Slower cPanel uploads
- Larger package size
- Slower page loads

**Fix:** Images should be optimized or served from CDN.

### 3. **Missing Environment Variable Validation** ⚠️
**Problem:** Server starts even if critical env vars are missing (DB credentials, JWT secret).

**Fix:** Add startup validation.

### 4. **JWT Secret Default Value** 🔴 CRITICAL
**Problem:** In `/lib/auth.js`, there's a fallback: `process.env.JWT_SECRET || 'your-secret-key'`

This is a **SECURITY RISK** - if JWT_SECRET is not set, it uses an insecure default!

**Fix:** Should fail if not set in production.

### 5. **Build Dependencies in Production** ⚠️
**Problem:** DevDependencies will be installed in cPanel, increasing package size.

**Fix:** Use `npm ci --production` instead.

## 🔧 Fixes Applied:

All issues above need to be addressed. Running fixes now...
