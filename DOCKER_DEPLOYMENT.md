# Docker Deployment Guide

This guide explains how to deploy the Donation App using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone git@github.com:kamaljit87/donation-app.git
cd donation-app
```

### 2. Configure Environment

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `APP_KEY` - Generate with: `php artisan key:generate` or use any 32-character string
- `RAZORPAY_KEY_ID` - Your Razorpay Key ID
- `RAZORPAY_KEY_SECRET` - Your Razorpay Key Secret
- `DB_PASSWORD` - Strong database password
- `ADMIN_EMAIL` - Admin email for login
- `ADMIN_PASSWORD` - Admin password for login

### 3. Build and Start Services

```bash
docker compose up -d --build
```

This will:
- Build the backend and frontend containers
- Start MySQL database
- Run Laravel migrations and seeders
- Start all services

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Login**: Use credentials from `.env` (default: admin@donationapp.com / Admin@123)

## Services

### Database (MySQL 8.0)
- **Container**: donation-app-db
- **Port**: 3306
- **Data**: Persisted in `db_data` volume

### Backend (Laravel + PHP-FPM)
- **Container**: donation-app-backend
- **Port**: 9000 (internal)
- **API**: http://localhost:8000/api

### Nginx (Backend Proxy)
- **Container**: donation-app-nginx
- **Port**: 8000
- **Purpose**: Proxies requests to PHP-FPM

### Frontend (React + Nginx)
- **Container**: donation-app-frontend
- **Port**: 3000
- **Purpose**: Serves React SPA

## Docker Commands

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Stop Services
```bash
docker compose stop
```

### Start Services
```bash
docker compose start
```

### Restart Services
```bash
docker compose restart
```

### Rebuild Containers
```bash
docker compose up -d --build
```

### Remove All Containers and Volumes
```bash
docker compose down -v
```

## Laravel Artisan Commands

Run artisan commands inside the backend container:

```bash
# General format
docker compose exec backend php artisan <command>

# Examples
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear
```

## Database Access

Access MySQL directly:

```bash
docker compose exec db mysql -u root -p
# Enter password from .env (DB_PASSWORD)
```

## Production Deployment

### 1. Update Environment Variables

For production, update `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
REACT_APP_API_URL=https://yourdomain.com/api
```

### 2. Use Production Docker Compose

Create `docker compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    environment:
      APP_ENV: production
      APP_DEBUG: false
  
  frontend:
    ports:
      - "80:80"
      - "443:80"
```

Run with:
```bash
docker compose -f docker compose.yml -f docker compose.prod.yml up -d --build
```

### 3. SSL/HTTPS Setup

For production with SSL, use a reverse proxy like Nginx or Traefik:

**Option A: Nginx Reverse Proxy**

Create `nginx-proxy.conf`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Option B: Traefik (Recommended)**

Add to `docker compose.yml`:
```yaml
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=your-email@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    networks:
      - donation-network

  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=myresolver"
```

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker compose logs backend
```

### Database Connection Failed

1. Ensure database is healthy:
```bash
docker compose ps
```

2. Wait for MySQL to be ready:
```bash
docker compose exec db mysqladmin ping -h localhost
```

### Permission Errors

Fix Laravel storage permissions:
```bash
docker compose exec backend chown -R www-data:www-data /var/www/html/storage
docker compose exec backend chmod -R 775 /var/www/html/storage
```

### Clear All Caches

```bash
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear
docker compose exec backend php artisan route:clear
docker compose exec backend php artisan view:clear
```

### Reset Database

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

## Backup and Restore

### Backup Database

```bash
docker compose exec db mysqldump -u root -p donation_app > backup.sql
```

### Restore Database

```bash
docker compose exec -T db mysql -u root -p donation_app < backup.sql
```

## Performance Optimization

### Production Optimizations

```bash
# Optimize autoloader
docker compose exec backend composer install --optimize-autoloader --no-dev

# Cache everything
docker compose exec backend php artisan config:cache
docker compose exec backend php artisan route:cache
docker compose exec backend php artisan view:cache

# Optimize Laravel
docker compose exec backend php artisan optimize
```

### Resource Limits

Add to `docker compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Monitoring

### Health Checks

View service health:
```bash
docker compose ps
```

### Resource Usage

```bash
docker stats
```

## Security Best Practices

1. **Never commit `.env` file**
2. **Use strong passwords** for database and admin
3. **Limit exposed ports** in production
4. **Regular updates**: `docker compose pull && docker compose up -d`
5. **Use secrets** for sensitive data in production
6. **Run as non-root** user inside containers
7. **Enable firewall** on host machine

## Support

For issues or questions:
- Check logs: `docker compose logs -f`
- Review documentation in `/docs` directory
- Check GitHub issues
