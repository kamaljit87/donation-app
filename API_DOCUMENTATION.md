# API Documentation

Complete API reference for the Donation Application.

## Base URL

\`\`\`
http://localhost:8000/api
\`\`\`

## Authentication

The API uses Laravel Sanctum for authentication. Protected endpoints require a Bearer token in the Authorization header.

\`\`\`
Authorization: Bearer {your_token_here}
\`\`\`

## Response Format

All API responses follow this structure:

\`\`\`json
{
  "success": true|false,
  "message": "Response message",
  "data": {}
}
\`\`\`

## Endpoints

### Authentication

#### Login (Admin)

\`\`\`http
POST /auth/login
\`\`\`

**Request Body:**
\`\`\`json
{
  "email": "admin@donationapp.com",
  "password": "Admin@123"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@donationapp.com",
      "is_admin": true
    },
    "token": "1|abc123xyz..."
  }
}
\`\`\`

**Errors:**
- 422: Validation error
- 401: Invalid credentials

---

#### Logout (Admin)

\`\`\`http
POST /auth/logout
Authorization: Bearer {token}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Logout successful"
}
\`\`\`

---

#### Get Current User

\`\`\`http
GET /auth/user
Authorization: Bearer {token}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@donationapp.com",
    "is_admin": true
  }
}
\`\`\`

---

### Donations

#### Create Donation

\`\`\`http
POST /donations
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "age": 30,
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "pincode": "400001",
  "pan_number": "ABCDE1234F",
  "anonymous": false,
  "amount": 1000,
  "currency": "INR",
  "donation_type": "one-time",
  "purpose": "mid-day-meals",
  "notes": "Optional notes",
  "tax_exemption_certificate": true
}
\`\`\`

**Required Fields:**
- name
- email
- amount

**Optional Fields:**
- phone, age, address, city, state, country, pincode
- pan_number, anonymous, currency, donation_type
- purpose, notes, tax_exemption_certificate

**Response (201 Created):**
\`\`\`json
{
  "success": true,
  "message": "Donation record created successfully",
  "data": {
    "donation_id": 1,
    "donor_id": 1
  }
}
\`\`\`

**Errors:**
- 422: Validation error
- 500: Server error

---

#### Get All Donations (Admin)

\`\`\`http
GET /admin/donations?status=success&search=john&page=1&per_page=15
Authorization: Bearer {token}
\`\`\`

**Query Parameters:**
- `status` (optional): Filter by status (success, pending, failed, refunded)
- `search` (optional): Search by donor name or email
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 15)

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "donor_id": 1,
        "amount": "1000.00",
        "currency": "INR",
        "donation_type": "one-time",
        "purpose": "mid-day-meals",
        "status": "success",
        "razorpay_order_id": "order_xxx",
        "razorpay_payment_id": "pay_xxx",
        "payment_date": "2024-01-15T10:30:00.000000Z",
        "created_at": "2024-01-15T10:25:00.000000Z",
        "donor": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "9876543210"
        }
      }
    ],
    "first_page_url": "http://localhost:8000/api/admin/donations?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://localhost:8000/api/admin/donations?page=5",
    "next_page_url": "http://localhost:8000/api/admin/donations?page=2",
    "path": "http://localhost:8000/api/admin/donations",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 75
  }
}
\`\`\`

---

#### Get Single Donation (Admin)

\`\`\`http
GET /admin/donations/{id}
Authorization: Bearer {token}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "donor_id": 1,
    "amount": "1000.00",
    "currency": "INR",
    "donation_type": "one-time",
    "purpose": "mid-day-meals",
    "status": "success",
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "payment_method": "upi",
    "payment_date": "2024-01-15T10:30:00.000000Z",
    "created_at": "2024-01-15T10:25:00.000000Z",
    "donor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "address": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "pincode": "400001"
    }
  }
}
\`\`\`

**Errors:**
- 404: Donation not found

---

#### Get Statistics (Admin)

\`\`\`http
GET /admin/statistics
Authorization: Bearer {token}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "total_donations": "125000.00",
    "total_donors": 45,
    "total_transactions": 120,
    "successful_donations": 110,
    "pending_donations": 5,
    "failed_donations": 5,
    "recent_donations": [
      {
        "id": 120,
        "amount": "5000.00",
        "status": "success",
        "created_at": "2024-01-15T10:30:00.000000Z",
        "donor": {
          "name": "Jane Smith",
          "email": "jane@example.com"
        }
      }
    ]
  }
}
\`\`\`

---

### Payment

#### Create Payment Order

\`\`\`http
POST /payment/create-order
\`\`\`

**Request Body:**
\`\`\`json
{
  "donation_id": 1,
  "amount": 1000
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "order_id": "order_xxx",
    "amount": 100000,
    "currency": "INR",
    "key": "rzp_test_xxx"
  }
}
\`\`\`

**Note:** Amount in response is in paise (₹1000 = 100000 paise)

**Errors:**
- 422: Validation error
- 500: Order creation failed

---

#### Verify Payment

\`\`\`http
POST /payment/verify
\`\`\`

**Request Body:**
\`\`\`json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "donation_id": 1,
    "status": "success"
  }
}
\`\`\`

**Errors:**
- 400: Signature verification failed
- 404: Order not found
- 500: Verification error

---

#### Record Payment Failure

\`\`\`http
POST /payment/failed
\`\`\`

**Request Body:**
\`\`\`json
{
  "razorpay_order_id": "order_xxx",
  "error": {
    "code": "BAD_REQUEST_ERROR",
    "description": "Payment failed",
    "source": "customer",
    "step": "payment_authorization",
    "reason": "payment_cancelled"
  }
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Payment failure recorded"
}
\`\`\`

---

## Error Responses

### Validation Error (422)

\`\`\`json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ],
    "amount": [
      "The amount must be at least 1."
    ]
  }
}
\`\`\`

### Unauthorized (401)

\`\`\`json
{
  "message": "Unauthenticated."
}
\`\`\`

### Not Found (404)

\`\`\`json
{
  "message": "No query results for model [App\\Models\\Donation] 999"
}
\`\`\`

### Server Error (500)

\`\`\`json
{
  "success": false,
  "message": "An error occurred",
  "error": "Error details..."
}
\`\`\`

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- Public endpoints: 60 requests per minute
- Admin endpoints: 120 requests per minute

Rate limit headers:
\`\`\`
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1641024000
\`\`\`

---

## Testing with cURL

### Create Donation
\`\`\`bash
curl -X POST http://localhost:8000/api/donations \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "amount": 1000
  }'
\`\`\`

### Admin Login
\`\`\`bash
curl -X POST http://localhost:8000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@donationapp.com",
    "password": "Admin@123"
  }'
\`\`\`

### Get Donations (Admin)
\`\`\`bash
curl -X GET "http://localhost:8000/api/admin/donations?status=success" \\
  -H "Authorization: Bearer {your_token}"
\`\`\`

---

## Postman Collection

Import the API endpoints into Postman for easier testing:

1. Create a new collection
2. Add environment variables:
   - `base_url`: http://localhost:8000/api
   - `token`: (set after login)
3. Add all endpoints from this documentation
4. Use `{{base_url}}` and `{{token}}` variables

---

## Webhooks (Optional)

To implement Razorpay webhooks for automatic payment status updates, add this endpoint:

\`\`\`http
POST /payment/webhook
X-Razorpay-Signature: {signature}
\`\`\`

Configure webhook URL in Razorpay dashboard:
\`\`\`
https://yourdomain.com/api/payment/webhook
\`\`\`

---

For more information, visit the [main documentation](README.md).
