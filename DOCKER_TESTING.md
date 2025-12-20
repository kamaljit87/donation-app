# Docker Testing Guide for Next.js Donation App

## 🚀 Quick Start

### Development Mode (with hot reload)

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f caddy
docker-compose -f docker-compose.dev.yml logs -f nextjs-dev

# Stop
docker-compose -f docker-compose.dev.yml down
```

Visit: **http://localhost** (Caddy proxies to Next.js on port 3000)

### Production Mode

```bash
# Start production environment
docker-compose -f docker-compose.nextjs.yml up -d

# View logs
docker-compose -f docker-compose.nextjs.yml logs -f nextjs-app

# Stop
docker-compose -f docker-compose.nextjs.yml down
```

## 📋 What's Included

### Development Setup (`docker-compose.dev.yml`)
- ✅ Caddy web server (ports 80, 443)
- ✅ MySQL 8.0 database (port 3307)
- ✅ Next.js dev server with hot reload
- ✅ Auto-created database tables
- ✅ Sample admin user (email: admin@example.com, password: password)
- ✅ Volume mounting for instant code changes
- ✅ Reverse proxy with compression and security headers

### Production Setup (`docker-compose.nextjs.yml`)
- ✅ Caddy web server with automatic HTTPS (ports 80, 443)
- ✅ MySQL 8.0 database
- ✅ Optimized Next.js build
- ✅ Multi-stage Docker build
- ✅ Production-ready configuration
- ✅ Let's Encrypt SSL certificates (when using your domain)

## 🔧 Configuration

### Default Credentials

**Admin Login:**
- Email: `admin@example.com`
- Password: `password`

**Database (Dev):**
- Host: `localhost`
- Port: `3307`
- Database: `donation_db`
- User: `donation_user`
- Password: `donation_pass`

**Database (Prod):**
- Host: `localhost`
- Port: `3306`
- Database: `donation_db`
- User: `donation_user`
- Password: `donation_password_change_this`

### Environment Variables

Edit `docker-compose.dev.yml` or `docker-compose.nextjs.yml`:

```yaml
environment:
  # Add your Razorpay test keys
  RAZORPAY_KEY_ID: "rzp_test_your_key"
  RAZORPAY_KEY_SECRET: "your_test_secret"
  NEXT_PUBLIC_RAZORPAY_KEY_ID: "rzp_test_your_key"
  
  # Change JWT secret for production
  JWT_SECRET: "your_secure_random_secret"
```

## 🧪 Testing

### 1. Start Development Environment

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Check Services

```bash
# Check if services are running
docker-compose -f docker-compose.dev.yml ps

# Check logs
docker-compose -f docker-compose.dev.yml logs -f
```

### 3. Access Application

- **Frontend**: http://localhost (via Caddy)
- **Direct Next.js** (dev only): http://localhost:3000
- **API Health**: http://localhost/api/auth/user (should return 401)
- **Admin Login**: http://localhost/admin/login

### 4. Test Database

```bash
# Connect to MySQL
docker exec -it donation-mysql-dev mysql -u donation_user -p donation_db
# Password: donation_pass

# Check tables
SHOW TABLES;

# Check admin user
SELECT * FROM users;
```

### 5. Test Features

- ✅ Homepage loads
- ✅ Donation form works
- ✅ Admin login (admin@example.com / password)
- ✅ Admin dashboard displays
- ✅ API endpoints respond

## 🔄 Rebuilding

### Development

```bash
# Rebuild after package.json changes
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
```

### Production

```bash
# Full rebuild
docker-compose -f docker-compose.nextjs.yml down
docker-compose -f docker-compose.nextjs.yml build --no-cache
docker-compose -f docker-compose.nextjs.yml up -d
```

## 🗄️ Database Management

### Reset Database

```bash
# Stop containers
docker-compose -f docker-compose.dev.yml down

# Remove database volume
docker volume rm donation-app_mysql_dev_data

# Start fresh
docker-compose -f docker-compose.dev.yml up -d
```

### Backup Database

```bash
# Export database
docker exec donation-mysql-dev mysqldump -u donation_user -pdonation_pass donation_db > backup.sql

# Import database
docker exec -i donation-mysql-dev mysql -u donation_user -pdonation_pass donation_db < backup.sql
```

## 📝 Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Caddy only
docker-compose -f docker-compose.dev.yml logs -f caddy

# Next.js only
docker-compose -f docker-compose.dev.yml logs -f nextjs-dev

# MySQL only
docker-compose -f docker-compose.dev.yml logs -f mysql
```

## 🐛 Troubleshooting

### Port already in use

```bash
# Change port in docker-compose.dev.yml
ports:
  - "3001:3000"  # Use 3001 instead of 3000
```

### Database connection error

```bash
# Wait for MySQL to be ready
docker-compose -f docker-compose.dev.yml logs mysql

# Check healthcheck status
docker inspect donation-mysql-dev | grep -A 5 Health
```

### Hot reload not working

```bash
# Ensure volumes are mounted correctly
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

## 🚀 Deploy to Production

After testing in Docker:

### Option 1: Deploy to cPanel
```bash
cd nextjs-app
npm run build
# Upload to cPanel (see nextjs-app/CPANEL_DEPLOYMENT.md)
```

### Option 2: Deploy Docker to VPS with Your Domain

1. **Update Caddyfile for your domain**:
```bash
# Edit docker-compose.nextjs.yml to use Caddyfile.production
# Change: ./Caddyfile:/etc/caddy/Caddyfile:ro
# To: ./Caddyfile.production:/etc/caddy/Caddyfile:ro
```

2. **Edit Caddyfile.production**:
```bash
# Replace yourdomain.com with your actual domain
# Update email address for Let's Encrypt
```

3. **Update environment variables**:
```bash
# Edit docker-compose.nextjs.yml
# Set NEXT_PUBLIC_APP_URL to https://yourdomain.com
# Add production Razorpay keys
# Generate strong JWT_SECRET
```

4. **Deploy**:
```bash
docker-compose -f docker-compose.nextjs.yml up -d
```

Caddy will automatically obtain SSL certificates from Let's Encrypt! 🎉

## 🔐 Security Notes

- ✅ Change all default passwords in production
- ✅ Use environment variables for secrets
- ✅ Never commit .env files
- ✅ Use strong JWT_SECRET
- ✅ Use Razorpay live keys in production

## 📚 Files

- `Dockerfile` - Production build
- `Dockerfile.dev` - Development build
- `docker-compose.nextjs.yml` - Production compose (with Caddy)
- `docker-compose.dev.yml` - Development compose (with Caddy)
- `Caddyfile` - Development Caddy config
- `Caddyfile.production` - Production Caddy config (with HTTPS)
- `init-db.sql` - Database initialization
- `DOCKER_TESTING.md` - This file

## 🔐 SSL Certificates (Production)

Caddy automatically handles SSL certificates:
- ✅ Obtains certificates from Let's Encrypt
- ✅ Automatic renewal before expiration
- ✅ HTTP to HTTPS redirect
- ✅ HTTP/3 support
- ✅ OCSP stapling

**Requirements:**
- Valid domain name pointing to your server
- Ports 80 and 443 open
- Server accessible from the internet

**Testing SSL before production:**
```bash
# Edit Caddyfile.production and uncomment staging CA
# acme_ca https://acme-staging-v02.api.letsencrypt.org/directory
```

---

**Happy Testing!** 🎉

For deployment to cPanel, see [CPANEL_DEPLOYMENT.md](nextjs-app/CPANEL_DEPLOYMENT.md)
