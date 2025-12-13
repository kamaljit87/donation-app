# Donation Application

A full-stack donation application with Laravel backend and React frontend, featuring Razorpay payment integration and admin dashboard.

## ✨ Features

- **Modern Donation Page** - Predefined amounts, custom amounts, one-time/monthly donations
- **Razorpay Integration** - Secure payment processing with real-time verification
- **Admin Dashboard** - View donations, search, filter, and manage donor information
- **SEO Optimized** - Meta tags, Open Graph, React Helmet
- **Auto SSL** - Caddy reverse proxy with automatic HTTPS
- **Fully Dockerized** - Easy deployment with Docker Compose

## 🚀 Quick Deploy

### Prerequisites
- Server with Ubuntu 22.04 LTS
- Docker & Docker Compose installed
- Domain pointing to your server (e.g., donationapp.ddns.net)

### 1. Clean Server & Install Docker

```bash
# SSH into your server
ssh root@your_server_ip

# Download and run cleanup script
curl -o cleanup.sh https://raw.githubusercontent.com/kamaljit87/donation-app/main/cleanup-and-install-docker.sh
chmod +x cleanup.sh
sudo ./cleanup.sh
```

This script will:
- Backup MySQL databases
- Remove Apache/Nginx/PHP/MySQL
- Install Docker & Docker Compose
- Configure firewall (ports 22, 80, 443)

### 2. Deploy Application

```bash
# Clone repository
git clone https://github.com/kamaljit87/donation-app.git
cd donation-app

# Run deployment script
chmod +x docker-deploy.sh
./docker-deploy.sh
```

Follow the prompts to enter:
- Domain name (e.g., donationapp.ddns.net)
- Database password
- Razorpay Key ID and Secret
- Admin email and password

### 3. Access Your Application

- **Frontend:** https://donationapp.ddns.net
- **Admin Panel:** https://donationapp.ddns.net (login with your admin credentials)

## 📦 Technology Stack

### Backend
- **Laravel 10.x** - PHP framework
- **MySQL 8.0** - Database
- **Laravel Sanctum** - API authentication
- **Razorpay PHP SDK** - Payment processing

### Frontend
- **React 18** - UI library
- **React Router** - SPA routing
- **Axios** - HTTP client
- **React Helmet** - SEO management

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Caddy 2** - Reverse proxy with auto SSL
- **Nginx** - Static file serving

## 🔧 Local Development

### Clone Repository

```bash
git clone https://github.com/kamaljit87/donation-app.git
cd donation-app
```

### Configure Environment

```bash
cp .env.example .env
nano .env
```

Update these values:
```env
DB_PASSWORD=your_secure_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
DOMAIN=donationapp.ddns.net
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourPassword123
```

### Start Services

```bash
docker compose up -d --build
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f caddy
```

## 🎯 Docker Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| MySQL | donation-app-db | 3306 | Database server |
| Laravel | donation-app-backend | - | PHP-FPM backend |
| Backend Nginx | donation-app-backend-nginx | - | API server |
| React | donation-app-frontend | - | Frontend SPA |
| Caddy | donation-app-caddy | 80, 443 | Reverse proxy with SSL |

## 🔐 SSL/HTTPS

Caddy automatically obtains and renews SSL certificates from Let's Encrypt when:
1. Domain DNS points to your server
2. Ports 80 and 443 are accessible
3. Domain is properly configured in `.env`

Check SSL status:
```bash
docker compose logs caddy
```

## 🛠️ Useful Commands

### Container Management

```bash
# Stop all services
docker compose down

# Start services
docker compose up -d

# Restart specific service
docker compose restart caddy

# View service status
docker compose ps

# Remove all containers and volumes
docker compose down -v
```

### Laravel Commands

```bash
# Run migrations
docker compose exec backend php artisan migrate

# Seed database
docker compose exec backend php artisan db:seed

# Clear cache
docker compose exec backend php artisan cache:clear

# Generate app key
docker compose exec backend php artisan key:generate
```

### Database Access

```bash
# MySQL CLI
docker compose exec db mysql -u root -p

# Backup database
docker compose exec db mysqldump -u root -p donation_app > backup.sql

# Restore database
docker compose exec -T db mysql -u root -p donation_app < backup.sql
```

## 📊 Admin Panel

**Default Credentials:**
- Email: admin@donationapp.com
- Password: Admin@123 (change in `.env`)

**Features:**
- Dashboard with statistics (total donations, today's donations, monthly total)
- Donation list with search and filter
- Donor information management
- Payment status tracking
- Pagination

## 💳 Razorpay Configuration

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Get API keys from Settings → API Keys
3. Update `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=your_secret
   ```
4. Configure webhook (optional):
   - URL: `https://donationapp.ddns.net/api/payment/webhook`
   - Events: payment.captured, payment.failed

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose logs

# Rebuild containers
docker compose down
docker compose up -d --build
```

### Database Connection Failed

```bash
# Check database status
docker compose exec db mysqladmin ping -h localhost

# Wait for database to be ready
docker compose ps
```

### SSL Certificate Issues

```bash
# Check Caddy logs
docker compose logs caddy

# Verify DNS points to server
dig donationapp.ddns.net

# Restart Caddy
docker compose restart caddy
```

### Permission Errors

```bash
# Fix Laravel storage permissions
docker compose exec backend chown -R www-data:www-data /var/www/html/storage
docker compose exec backend chmod -R 775 /var/www/html/storage
```

## 📁 Project Structure

```
donation-app/
├── backend/                 # Laravel backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
├── frontend/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── context/
├── docker compose.yml      # Docker orchestration
├── Dockerfile.backend      # Backend container
├── Dockerfile.frontend     # Frontend container
├── Caddyfile              # Caddy configuration
├── nginx-backend.conf     # Backend nginx config
├── nginx.conf             # Frontend nginx config
└── .env.example           # Environment template
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_URL` | Application URL | `https://donationapp.ddns.net` |
| `DB_PASSWORD` | Database password | `secure_password123` |
| `RAZORPAY_KEY_ID` | Razorpay API key | `rzp_live_xxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | `your_secret_key` |
| `DOMAIN` | Domain name | `donationapp.ddns.net` |
| `ADMIN_EMAIL` | Admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin password | `YourPassword123` |

## 🔒 Security Best Practices

- Use strong database passwords
- Change default admin credentials
- Keep Razorpay keys secure (never commit to git)
- Regular security updates: `docker compose pull`
- Enable firewall: `ufw enable`
- Use environment variables for sensitive data
- Regular database backups

## 📄 License

This project is open-source and available under the MIT License.

## 🙋 Support

For issues or questions, check:
- Docker logs: `docker compose logs -f`
- GitHub Issues
- [Docker Documentation](DOCKER_DEPLOYMENT.md)

## 🚀 Quick Reference

```bash
# Deploy from scratch
curl -o cleanup.sh https://raw.githubusercontent.com/kamaljit87/donation-app/main/cleanup-and-install-docker.sh && chmod +x cleanup.sh && sudo ./cleanup.sh

# Clone and deploy
git clone https://github.com/kamaljit87/donation-app.git
cd donation-app
chmod +x docker-deploy.sh
./docker-deploy.sh

# Start/Stop
docker compose up -d
docker compose down

# View logs
docker compose logs -f

# Access database
docker compose exec db mysql -u root -p
```

**Live URL:** https://donationapp.ddns.net
