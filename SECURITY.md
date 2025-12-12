# Security Best Practices

Security guidelines for the Donation Application.

## 🔐 General Security

### Environment Variables

- ✅ Never commit `.env` files to version control
- ✅ Use strong, unique passwords
- ✅ Rotate API keys regularly
- ✅ Use different credentials for development and production

### HTTPS/SSL

- ✅ Always use HTTPS in production
- ✅ Configure SSL certificates (Let's Encrypt recommended)
- ✅ Enable HSTS (HTTP Strict Transport Security)
- ✅ Use secure cookies

---

## 🛡️ Laravel Backend Security

### 1. Authentication & Authorization

\`\`\`php
// Only admin users can access certain routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Admin routes
});
\`\`\`

### 2. CSRF Protection

Laravel automatically protects against CSRF attacks. Ensure tokens are included:

\`\`\`php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost')),
\`\`\`

### 3. SQL Injection Prevention

Always use Eloquent ORM or query builder:

\`\`\`php
// ✅ GOOD - Uses parameter binding
$users = User::where('email', $email)->get();

// ❌ BAD - Vulnerable to SQL injection
$users = DB::select("SELECT * FROM users WHERE email = '$email'");
\`\`\`

### 4. Mass Assignment Protection

Always define fillable or guarded properties:

\`\`\`php
class User extends Model
{
    protected $fillable = ['name', 'email', 'password'];
    // OR
    protected $guarded = ['id', 'is_admin'];
}
\`\`\`

### 5. XSS Prevention

Laravel's Blade automatically escapes output:

\`\`\`php
// ✅ GOOD - Escaped
{{ $user->name }}

// ⚠️ USE WITH CAUTION - Unescaped
{!! $html !!}
\`\`\`

### 6. Rate Limiting

\`\`\`php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'api' => [
        'throttle:60,1', // 60 requests per minute
    ],
];
\`\`\`

### 7. Secure Headers

\`\`\`php
// app/Http/Middleware/SecurityHeaders.php
public function handle($request, Closure $next)
{
    $response = $next($request);
    
    $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('X-XSS-Protection', '1; mode=block');
    $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return $response;
}
\`\`\`

### 8. File Upload Security

\`\`\`php
$request->validate([
    'file' => 'required|mimes:jpg,png,pdf|max:2048',
]);
\`\`\`

---

## ⚛️ React Frontend Security

### 1. Environment Variables

Never expose sensitive data in frontend:

\`\`\`javascript
// ✅ GOOD - Only API URL
REACT_APP_API_URL=https://api.example.com

// ❌ BAD - Never do this
REACT_APP_SECRET_KEY=abc123
\`\`\`

### 2. XSS Prevention

React automatically escapes content, but be careful with:

\`\`\`javascript
// ❌ DANGEROUS - Can execute scripts
<div dangerouslySetInnerHTML={{__html: userInput}} />

// ✅ SAFE - React escapes automatically
<div>{userInput}</div>
\`\`\`

### 3. Token Storage

\`\`\`javascript
// ⚠️ localStorage is vulnerable to XSS
localStorage.setItem('token', token);

// Better: Use httpOnly cookies (requires backend support)
// Or: Use secure token storage libraries
\`\`\`

### 4. API Calls

Always validate and sanitize data:

\`\`\`javascript
// Validate before sending
if (amount > 0 && email.includes('@')) {
    await api.post('/donations', { amount, email });
}
\`\`\`

### 5. Content Security Policy

Add to `public/index.html`:

\`\`\`html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://checkout.razorpay.com;
               style-src 'self' 'unsafe-inline';">
\`\`\`

---

## 💳 Payment Security (Razorpay)

### 1. Never Store Card Details

- ❌ Never store card numbers, CVV, or expiry dates
- ✅ Use Razorpay's secure payment page
- ✅ Only store Razorpay payment IDs

### 2. Verify Payment Signatures

Always verify payment signatures on backend:

\`\`\`php
$razorpay->utility->verifyPaymentSignature([
    'razorpay_order_id' => $orderId,
    'razorpay_payment_id' => $paymentId,
    'razorpay_signature' => $signature
]);
\`\`\`

### 3. Use Webhooks

Implement webhooks for real-time payment updates:

\`\`\`php
// Verify webhook signature
$webhookSignature = $request->header('X-Razorpay-Signature');
$webhookSecret = config('services.razorpay.webhook_secret');

$expectedSignature = hash_hmac('sha256', $request->getContent(), $webhookSecret);

if ($webhookSignature === $expectedSignature) {
    // Process webhook
}
\`\`\`

### 4. PCI Compliance

- ✅ Use Razorpay's hosted checkout (PCI compliant)
- ✅ Never handle raw card data
- ✅ Use HTTPS for all payment flows

---

## 🗄️ Database Security

### 1. Strong Passwords

\`\`\`sql
-- Create user with strong password
CREATE USER 'donation_user'@'localhost' IDENTIFIED BY 'StR0nG!P@ssw0rd#2024';
GRANT ALL PRIVILEGES ON donation_app.* TO 'donation_user'@'localhost';
\`\`\`

### 2. Principle of Least Privilege

Only grant necessary permissions:

\`\`\`sql
-- For application
GRANT SELECT, INSERT, UPDATE ON donation_app.* TO 'app_user'@'localhost';

-- For migrations only
GRANT ALL PRIVILEGES ON donation_app.* TO 'migration_user'@'localhost';
\`\`\`

### 3. Backup Security

\`\`\`bash
# Encrypt backups
mysqldump -u root -p donation_app | gzip | openssl enc -aes-256-cbc -salt -out backup.sql.gz.enc
\`\`\`

### 4. Disable Remote Root Login

\`\`\`sql
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
FLUSH PRIVILEGES;
\`\`\`

---

## 🔍 Security Monitoring

### 1. Logging

\`\`\`php
// Log suspicious activities
Log::warning('Failed login attempt', [
    'email' => $email,
    'ip' => $request->ip(),
    'timestamp' => now()
]);
\`\`\`

### 2. Failed Login Attempts

\`\`\`php
// app/Http/Controllers/Api/AuthController.php
protected function incrementLoginAttempts($email)
{
    Cache::increment("login_attempts_$email");
    
    if (Cache::get("login_attempts_$email") > 5) {
        throw new TooManyAttemptsException();
    }
}
\`\`\`

### 3. Audit Trail

Track important actions:

\`\`\`php
// Create audit log
AuditLog::create([
    'user_id' => auth()->id(),
    'action' => 'donation_created',
    'details' => ['amount' => $donation->amount],
    'ip_address' => request()->ip()
]);
\`\`\`

---

## 🛠️ Security Headers

### Backend (Laravel)

\`\`\`php
// app/Http/Middleware/SecurityHeaders.php
return $next($request)->withHeaders([
    'X-Frame-Options' => 'SAMEORIGIN',
    'X-Content-Type-Options' => 'nosniff',
    'X-XSS-Protection' => '1; mode=block',
    'Referrer-Policy' => 'strict-origin-when-cross-origin',
    'Permissions-Policy' => 'geolocation=(), microphone=(), camera=()',
]);
\`\`\`

### Web Server (Nginx)

\`\`\`nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
\`\`\`

---

## 🔐 Admin Security

### 1. Strong Passwords

- Minimum 12 characters
- Include uppercase, lowercase, numbers, and symbols
- Use password managers
- Enable 2FA if possible

### 2. Limit Admin Access

\`\`\`php
// Only specific IPs can access admin
Route::middleware(['admin', 'ip.whitelist'])->group(function () {
    // Admin routes
});
\`\`\`

### 3. Session Security

\`\`\`php
// config/session.php
'secure' => true, // HTTPS only
'http_only' => true, // Not accessible via JavaScript
'same_site' => 'strict', // CSRF protection
\`\`\`

---

## 📋 Security Checklist

### Before Deployment

- [ ] All environment variables set correctly
- [ ] Debug mode disabled (`APP_DEBUG=false`)
- [ ] HTTPS enabled
- [ ] Strong passwords for all accounts
- [ ] Database user has minimal privileges
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Error reporting disabled in production
- [ ] File permissions set correctly (755/644)
- [ ] Sensitive files not publicly accessible
- [ ] Backup strategy in place
- [ ] Monitoring and logging enabled
- [ ] Dependencies up to date
- [ ] Security patches applied

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Review logs weekly
- [ ] Rotate API keys quarterly
- [ ] Test backup restoration
- [ ] Security audit annually
- [ ] Monitor for vulnerabilities
- [ ] Review user access regularly

---

## 🚨 Security Incident Response

### If Compromised

1. **Immediate Actions**
   - Take the site offline
   - Change all passwords
   - Rotate all API keys
   - Review logs for extent of breach

2. **Investigation**
   - Identify entry point
   - Check for backdoors
   - Review all file changes
   - Examine database for anomalies

3. **Recovery**
   - Restore from clean backup
   - Apply security patches
   - Update all credentials
   - Implement additional security measures

4. **Prevention**
   - Document the incident
   - Improve security practices
   - Train team members
   - Implement monitoring

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security](https://laravel.com/docs/10.x/security)
- [React Security](https://react.dev/learn/security)
- [PCI DSS Compliance](https://www.pcisecuritystandards.org/)
- [Razorpay Security](https://razorpay.com/docs/payments/security/)

---

**Remember**: Security is an ongoing process, not a one-time task. Stay vigilant and keep everything updated!
