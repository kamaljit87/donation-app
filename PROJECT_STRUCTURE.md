# Project Structure

Complete overview of the Donation Application architecture and file structure.

## 📁 Directory Structure

\`\`\`
donation app/
├── backend/                      # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/
│   │   │           ├── AuthController.php      # Admin authentication
│   │   │           ├── DonationController.php  # Donation management
│   │   │           └── PaymentController.php   # Payment processing
│   │   └── Models/
│   │       ├── User.php                        # Admin user model
│   │       ├── Donor.php                       # Donor model
│   │       └── Donation.php                    # Donation model
│   ├── config/
│   │   ├── cors.php                            # CORS configuration
│   │   ├── sanctum.php                         # API authentication
│   │   └── services.php                        # Third-party services
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 2024_01_01_000001_create_users_table.php
│   │   │   ├── 2024_01_01_000002_create_donors_table.php
│   │   │   └── 2024_01_01_000003_create_donations_table.php
│   │   └── seeders/
│   │       ├── DatabaseSeeder.php
│   │       └── AdminSeeder.php                 # Admin user seeder
│   ├── routes/
│   │   └── api.php                             # API routes
│   ├── composer.json                           # PHP dependencies
│   └── .env.example                            # Environment template
│
├── frontend/                     # React Frontend
│   ├── public/
│   │   ├── index.html                          # Main HTML template
│   │   ├── manifest.json                       # PWA manifest
│   │   └── robots.txt                          # SEO robots file
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.js               # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.js                  # Authentication context
│   │   ├── pages/
│   │   │   ├── DonatePage.js                   # Main donation page
│   │   │   ├── DonatePage.css
│   │   │   ├── AdminLogin.js                   # Admin login page
│   │   │   ├── AdminLogin.css
│   │   │   ├── AdminDashboard.js               # Admin dashboard
│   │   │   ├── AdminDashboard.css
│   │   │   ├── ThankYouPage.js                 # Success page
│   │   │   └── ThankYouPage.css
│   │   ├── services/
│   │   │   ├── api.js                          # Axios configuration
│   │   │   └── index.js                        # API service methods
│   │   ├── App.js                              # Main app component
│   │   ├── index.js                            # App entry point
│   │   ├── index.css                           # Global styles
│   │   └── reportWebVitals.js                  # Performance metrics
│   ├── package.json                            # Node dependencies
│   └── .env.example                            # Environment template
│
├── .env.example                  # Root environment template
├── .gitignore                    # Git ignore rules
├── README.md                     # Main documentation
├── QUICKSTART.md                 # Quick setup guide
├── API_DOCUMENTATION.md          # API reference
├── DEPLOYMENT.md                 # Deployment guide
├── SECURITY.md                   # Security guidelines
└── setup.sh                      # Automated setup script
\`\`\`

## 🏗️ Architecture Overview

### Backend Architecture (Laravel)

\`\`\`
┌─────────────────────────────────────────────┐
│              API Endpoints                  │
│  (routes/api.php)                          │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌────────────┐   ┌──────────────┐
│   Auth     │   │   Public     │
│ Protected  │   │   Routes     │
└─────┬──────┘   └───────┬──────┘
      │                  │
      ▼                  ▼
┌──────────────────────────────────┐
│        Controllers               │
│  - AuthController                │
│  - DonationController            │
│  - PaymentController             │
└──────────────┬───────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌────────────┐   ┌──────────────┐
│   Models   │   │   Services   │
│  - User    │   │  - Razorpay  │
│  - Donor   │   │  - Email     │
│  - Donation│   │              │
└─────┬──────┘   └───────┬──────┘
      │                  │
      └────────┬─────────┘
               │
               ▼
      ┌────────────────┐
      │    Database    │
      │    (MySQL)     │
      └────────────────┘
\`\`\`

### Frontend Architecture (React)

\`\`\`
┌─────────────────────────────────────────────┐
│             Browser / User                  │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │   React App    │
       │   (App.js)     │
       └───────┬────────┘
               │
       ┌───────┴────────────────┐
       │                        │
       ▼                        ▼
┌────────────┐          ┌──────────────┐
│   Public   │          │   Protected  │
│   Routes   │          │    Routes    │
│            │          │  (Auth)      │
└─────┬──────┘          └───────┬──────┘
      │                         │
      ▼                         ▼
┌──────────────┐       ┌───────────────┐
│ DonatePage   │       │AdminDashboard │
│ ThankYouPage │       │               │
└──────┬───────┘       └───────┬───────┘
       │                       │
       └───────┬───────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌────────────┐   ┌──────────────┐
│   Context  │   │   Services   │
│  - Auth    │   │  - API       │
│            │   │  - Payment   │
└────────────┘   └───────┬──────┘
                         │
                         ▼
                ┌────────────────┐
                │ Laravel API    │
                │ (Backend)      │
                └────────────────┘
\`\`\`

## 🔄 Data Flow

### Donation Process

\`\`\`
User → DonatePage
       │
       ├─ Fill Form
       │  (name, email, amount, etc.)
       │
       ├─ Submit Form
       │  POST /api/donations
       │
       ▼
   Backend
       │
       ├─ Validate Data
       │
       ├─ Create Donor Record
       │
       ├─ Create Donation Record
       │  (status: pending)
       │
       ├─ Return donation_id
       │
       ▼
   Frontend
       │
       ├─ Create Razorpay Order
       │  POST /api/payment/create-order
       │
       ▼
   Backend
       │
       ├─ Create Razorpay Order
       │
       ├─ Update donation with order_id
       │
       ├─ Return order details
       │
       ▼
   Frontend
       │
       ├─ Open Razorpay Checkout
       │
       ├─ User Completes Payment
       │
       ├─ Receive Payment Response
       │  (order_id, payment_id, signature)
       │
       ├─ Verify Payment
       │  POST /api/payment/verify
       │
       ▼
   Backend
       │
       ├─ Verify Signature
       │
       ├─ Update Donation Status
       │  (status: success)
       │
       ├─ Store Payment Details
       │
       ├─ Return Success
       │
       ▼
   Frontend
       │
       └─ Redirect to ThankYouPage
\`\`\`

### Admin Dashboard Flow

\`\`\`
Admin → AdminLogin
       │
       ├─ Enter Credentials
       │
       ├─ POST /api/auth/login
       │
       ▼
   Backend
       │
       ├─ Validate Credentials
       │
       ├─ Check is_admin
       │
       ├─ Generate Token
       │
       ├─ Return User + Token
       │
       ▼
   Frontend
       │
       ├─ Store Token
       │
       ├─ Redirect to Dashboard
       │
       ▼
   AdminDashboard
       │
       ├─ GET /api/admin/statistics
       │  (Total donations, donors, etc.)
       │
       ├─ GET /api/admin/donations
       │  (List of all donations)
       │
       ├─ Display Data
       │
       └─ Filter/Search Options
\`\`\`

## 📊 Database Schema

### ERD (Entity Relationship Diagram)

\`\`\`
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (UNIQUE)      │
│ password            │
│ is_admin            │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐
│       donors        │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email               │
│ phone               │
│ age                 │
│ address             │
│ city                │
│ state               │
│ country             │
│ pincode             │
│ pan_number          │
│ anonymous           │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1:N
           │
           ▼
┌─────────────────────┐
│     donations       │
├─────────────────────┤
│ id (PK)             │
│ donor_id (FK)       │◄────┐
│ amount              │     │
│ currency            │     │
│ donation_type       │     │
│ purpose             │     │
│ payment_method      │     │
│ status              │     │
│ razorpay_order_id   │     │
│ razorpay_payment_id │     │
│ razorpay_signature  │     │
│ payment_response    │     │
│ notes               │     │
│ tax_exemption_cert  │     │
│ payment_date        │     │
│ created_at          │     │
│ updated_at          │     │
└─────────────────────┘
\`\`\`

## 🔐 Security Layers

\`\`\`
┌──────────────────────────────────────┐
│     Application Security Layers      │
├──────────────────────────────────────┤
│                                      │
│  Layer 1: Network Security           │
│  - HTTPS/SSL                         │
│  - Firewall Rules                    │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Layer 2: Authentication             │
│  - Laravel Sanctum                   │
│  - JWT Tokens                        │
│  - Admin Role Check                  │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Layer 3: Authorization              │
│  - Protected Routes                  │
│  - Middleware Checks                 │
│  - CORS Policy                       │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Layer 4: Data Validation            │
│  - Input Validation                  │
│  - Request Validation                │
│  - SQL Injection Prevention          │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Layer 5: Payment Security           │
│  - Razorpay Integration              │
│  - Signature Verification            │
│  - PCI Compliance                    │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Layer 6: Data Protection            │
│  - Password Hashing                  │
│  - Encrypted Database                │
│  - Secure Backups                    │
│                                      │
└──────────────────────────────────────┘
\`\`\`

## 🎨 Component Hierarchy

### React Components

\`\`\`
App
├── AuthProvider (Context)
│   └── Routes
│       ├── DonatePage
│       │   ├── Donation Form
│       │   ├── Amount Selector
│       │   ├── Personal Info Form
│       │   └── Razorpay Checkout
│       │
│       ├── ThankYouPage
│       │   ├── Success Message
│       │   ├── Impact Stats
│       │   └── Action Buttons
│       │
│       ├── AdminLogin
│       │   └── Login Form
│       │
│       └── AdminDashboard (Protected)
│           ├── Header
│           ├── Statistics Cards
│           ├── Donations Table
│           │   ├── Filters
│           │   ├── Search
│           │   └── Pagination
│           └── Logout Button
│
└── ToastContainer (Notifications)
\`\`\`

## 📦 Dependencies

### Backend (Laravel)

\`\`\`json
{
  "laravel/framework": "^10.10",
  "laravel/sanctum": "^3.2",
  "razorpay/razorpay": "^2.9",
  "guzzlehttp/guzzle": "^7.2"
}
\`\`\`

### Frontend (React)

\`\`\`json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "axios": "^1.6.2",
  "react-helmet-async": "^2.0.4",
  "react-toastify": "^9.1.3"
}
\`\`\`

## 🔌 API Endpoints Summary

### Public Endpoints
- `POST /api/donations` - Create donation
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `POST /api/payment/failed` - Record payment failure

### Admin Endpoints (Protected)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/user` - Get current user
- `GET /api/admin/donations` - Get all donations
- `GET /api/admin/donations/{id}` - Get single donation
- `GET /api/admin/statistics` - Get statistics

## 🌟 Key Features Implementation

### 1. SEO Optimization
- React Helmet for dynamic meta tags
- Semantic HTML structure
- robots.txt configuration
- Open Graph tags

### 2. Responsive Design
- Mobile-first approach
- CSS Grid and Flexbox
- Media queries for all screen sizes
- Touch-friendly interface

### 3. Payment Integration
- Razorpay SDK integration
- Secure payment flow
- Payment verification
- Error handling

### 4. Admin Dashboard
- Authentication with Sanctum
- Real-time statistics
- Search and filter
- Pagination

### 5. User Experience
- Loading states
- Error messages
- Success notifications
- Smooth transitions

## 📝 Code Quality

### Backend Standards
- PSR-12 coding style
- Type declarations
- Doc blocks
- Exception handling

### Frontend Standards
- ES6+ JavaScript
- Functional components
- React Hooks
- CSS BEM methodology

## 🧪 Testing Strategy

### Backend Tests
- Unit tests for models
- Feature tests for API endpoints
- Integration tests for payment flow

### Frontend Tests
- Component unit tests
- Integration tests
- E2E tests with Cypress (optional)

---

For more detailed information, refer to:
- [README.md](README.md) - Complete documentation
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [SECURITY.md](SECURITY.md) - Security guidelines
