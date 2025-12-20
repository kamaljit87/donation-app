# Docker Testing Guide for Next.js Donation App

## 🚀 Quick Start

### Development Mode (with hot reload)

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f nextjs-dev

# Stop
docker-compose -f docker-compose.dev.yml down
```

Visit: **http://localhost:3000**

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
- ✅ MySQL 8.0 database (port 3307)
- ✅ Next.js dev server with hot reload
- ✅ Auto-created database tables
- ✅ Sample admin user (email: admin@example.com, password: password)
- ✅ Volume mounting for instant code changes

### Production Setup (`docker-compose.nextjs.yml`)
- ✅ MySQL 8.0 database (port 3306)
- ✅ Optimized Next.js build
- ✅ Multi-stage Docker build
- ✅ Production-ready configuration

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

- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:3000/api/auth/user (should return 401)
- **Admin Login**: http://localhost:3000/admin/login

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

1. **Build locally**:
```bash
cd nextjs-app
npm run build
```

2. **Upload to cPanel** (see CPANEL_DEPLOYMENT.md)

3. **Or deploy Docker to VPS**:
```bash
docker-compose -f docker-compose.nextjs.yml up -d
```

## 🔐 Security Notes

- ✅ Change all default passwords in production
- ✅ Use environment variables for secrets
- ✅ Never commit .env files
- ✅ Use strong JWT_SECRET
- ✅ Use Razorpay live keys in production

## 📚 Files

- `Dockerfile` - Production build
- `Dockerfile.dev` - Development build
- `docker-compose.nextjs.yml` - Production compose
- `docker-compose.dev.yml` - Development compose
- `init-db.sql` - Database initialization
- `DOCKER_TESTING.md` - This file

---

**Happy Testing!** 🎉

For deployment to cPanel, see [CPANEL_DEPLOYMENT.md](nextjs-app/CPANEL_DEPLOYMENT.md)
