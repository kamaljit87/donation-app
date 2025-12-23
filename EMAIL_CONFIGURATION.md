# Email Configuration Guide

Simple steps to configure email notifications for your donation application.

## ⚙️ Environment Configuration

Email settings are configured using environment variables in your `.env` file located in the backend directory.

## 📝 Required Settings

Add the following configuration to your `backend/.env` file:

```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host.com
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yoursite.com"
MAIL_FROM_NAME="Prabhupada Annakshetra"
```

> ⚠️ **Security Note:** Never commit your actual credentials to version control. Use environment-specific values and keep your `.env` file in `.gitignore`.

## 🔧 Common Email Providers

### Gmail

- **MAIL_HOST:** smtp.gmail.com
- **MAIL_PORT:** 587
- **MAIL_ENCRYPTION:** tls

> **Note:** You'll need to use an App Password instead of your regular Gmail password. Enable 2-Step Verification in your Google Account, then go to Security → App Passwords to generate one specifically for this application.

### Outlook/Office 365

- **MAIL_HOST:** smtp.office365.com
- **MAIL_PORT:** 587
- **MAIL_ENCRYPTION:** tls

### SendGrid

- **MAIL_HOST:** smtp.sendgrid.net
- **MAIL_PORT:** 587
- **MAIL_USERNAME:** apikey
- **MAIL_PASSWORD:** Your SendGrid API Key
- **MAIL_ENCRYPTION:** tls

### Mailgun

- **MAIL_HOST:** smtp.mailgun.org
- **MAIL_PORT:** 587
- **MAIL_ENCRYPTION:** tls

## ✅ Testing Your Configuration

After configuring your email settings:

1. Save your `.env` file
2. Restart your backend server
3. Test by making a donation to trigger a confirmation email
4. Check your inbox for the confirmation message

## 🔍 Troubleshooting

### Emails not sending?

- Verify your SMTP credentials are correct
- Check if your email provider requires an App Password
- Ensure port 587 or 465 is not blocked by your firewall
- Check backend logs for specific error messages

### Emails going to spam?

- Configure SPF and DKIM records for your domain
- Use a verified email address in MAIL_FROM_ADDRESS
- Consider using a professional email service like SendGrid or Mailgun

### Authentication errors?

- Double-check your username and password
- For Gmail, ensure you're using an App Password, not your regular password
- Verify that "Less secure app access" is enabled (if applicable)

## 💡 Best Practices

- ✓ Use a dedicated email account for sending application emails
- ✓ Never commit your `.env` file to version control
- ✓ Use professional email services for production environments
- ✓ Monitor your email sending limits to avoid being blocked
- ✓ Keep your email credentials secure and rotate them regularly

## Need More Help?

If you're still experiencing issues with email configuration, please contact technical support or consult your hosting provider's documentation.
