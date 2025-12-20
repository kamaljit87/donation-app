# Next.js Donation App

Complete Next.js migration from Laravel + React to full-stack Next.js application.

## 🚀 Features

- **Full-Stack Next.js**: Backend API routes + Frontend React components
- **Same Database**: Uses existing MySQL database (donors, donations, users tables)
- **Payment Integration**: Razorpay payment gateway
- **Admin Dashboard**: Protected admin routes with JWT authentication
- **Same UI/UX**: All components and styling preserved from React app

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MySQL with mysql2
- **Authentication**: JWT with bcryptjs
- **Payment**: Razorpay
- **Styling**: Same CSS from React app

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd nextjs-app
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret_key_here

RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id

NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### 3. Database Setup

The app uses the existing database tables:
- `users` - Admin users
- `donors` - Donor information
- `donations` - Donation records

**Create an admin user** (if not exists):

```sql
INSERT INTO users (name, email, password, is_admin, created_at, updated_at)
VALUES ('Admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NOW(), NOW());
```

Default password: `password` (generate new hash with bcryptjs for production)

### 4. Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
nextjs-app/
├── app/
│   ├── api/                    # API Routes (Backend)
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── logout/route.js
│   │   │   └── user/route.js
│   │   ├── donations/route.js
│   │   ├── admin/
│   │   │   ├── donations/
│   │   │   │   ├── route.js
│   │   │   │   └── [id]/route.js
│   │   │   └── statistics/route.js
│   │   └── payment/
│   │       ├── create-order/route.js
│   │       ├── verify/route.js
│   │       └── failed/route.js
│   ├── donate/page.js         # Main donation page
│   ├── admin/
│   │   ├── login/page.js
│   │   └── dashboard/page.js
│   ├── layout.js
│   ├── globals.css
│   └── page.js
├── components/                 # React Components
│   ├── Header.js
│   ├── Footer.js
│   ├── AuthContext.js
│   └── ProtectedRoute.js
├── lib/                        # Utilities
│   ├── db.js                  # Database connection
│   ├── auth.js                # JWT authentication
│   ├── api.js                 # Axios instance
│   └── services.js            # API services
├── public/                     # Static assets
│   └── images/
├── .env.example
├── next.config.js
└── package.json
```

## 🔐 API Endpoints

### Public Routes
- `POST /api/auth/login` - Admin login
- `POST /api/donations` - Create donation
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `POST /api/payment/failed` - Handle payment failure

### Protected Routes (Require JWT Token)
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/admin/donations` - Get all donations (with pagination)
- `GET /api/admin/donations/[id]` - Get single donation
- `GET /api/admin/statistics` - Get statistics

## 🌐 Pages

- `/` - Home (redirects to /donate)
- `/donate` - Main donation page
- `/about` - About us page
- `/inspiration` - Our inspiration
- `/contact` - Contact us
- `/thank-you` - Thank you page after donation
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard (protected)

## 🚀 Deployment

### Option 1: cPanel with Node.js

1. **Upload files via FTP/SSH**:
```bash
scp -r nextjs-app/* user@server:/home/user/donation-app
```

2. **Setup Node.js App in cPanel**:
   - Go to cPanel → Setup Node.js App
   - Node version: 18.x or latest
   - Application root: `/home/user/donation-app`
   - Application startup file: `server.js`

3. **Create server.js** (in app root):
```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

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
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

4. **Install & Build**:
```bash
cd /home/user/donation-app
npm install
npm run build
```

5. **Start via cPanel Node.js App interface**

### Option 2: Vercel (Recommended for Next.js)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add environment variables in Vercel dashboard.

### Option 3: Docker

```bash
docker build -t donation-app .
docker run -p 3000:3000 --env-file .env donation-app
```

## 🔄 Migration from Laravel

The app replaces:
- **Laravel Backend** → Next.js API Routes (`app/api/*`)
- **React Frontend** → Next.js Pages (`app/*`)
- **Sanctum Auth** → JWT Authentication
- **Eloquent ORM** → Direct MySQL queries with mysql2

All database tables remain the same - no migration needed!

## 📊 Database Schema

Uses existing tables:
- `users` - Admin authentication
- `donors` - Donor information
- `donations` - Donation records

No changes required to database structure.

## 🛠️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_DATABASE` | Database name | `donation_db` |
| `DB_USERNAME` | Database user | `root` |
| `DB_PASSWORD` | Database password | `password` |
| `JWT_SECRET` | JWT signing secret | Generate with `openssl rand -base64 32` |
| `RAZORPAY_KEY_ID` | Razorpay key | `rzp_live_xxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | `xxx` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key | `rzp_live_xxx` |
| `NEXT_PUBLIC_APP_URL` | App URL | `https://yourdomain.com` |

## 📝 Notes

- **JWT Token**: 7-day expiration
- **Database Pool**: 10 connections max
- **File Upload**: Not yet implemented (add if needed)
- **Email**: Not yet implemented (add if needed)

## 🆘 Troubleshooting

### Database Connection Error
- Check `.env` credentials
- Ensure MySQL is running
- Test connection: `mysql -h HOST -u USER -p DATABASE`

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
npm run build
# Check for errors in API routes or pages
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Razorpay Integration](https://razorpay.com/docs/)

## 📞 Support

For issues or questions, check:
1. Application logs: `console` in browser / terminal
2. Database logs: MySQL error logs
3. Next.js documentation

---

**Migration Complete!** 🎉

The app now runs entirely on Next.js with the same database, UI, and functionality.
