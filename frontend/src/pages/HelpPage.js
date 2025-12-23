import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HelpPage.css';

const HelpPage = () => {
  return (
    <>
      <Helmet>
        <title>Help - Email Configuration | Prabhupada Annakshetra</title>
        <meta
          name="description"
          content="Learn how to configure email settings for the donation application."
        />
      </Helmet>

      <Header />

      <div className="help-page">
        <div className="help-hero">
          <div className="hero-inner">
            <div className="hero-badge">📧 Configuration Guide</div>
            <h1>Email <span className="gradient-text">Configuration Help</span></h1>
            <p className="hero-subtitle">
              Simple steps to configure email notifications for your donation application
            </p>
          </div>
        </div>

        <div className="help-content">
          <div className="help-section">
            <div className="section-icon">⚙️</div>
            <h2>Environment Configuration</h2>
            <p>
              Email settings are configured using environment variables in your <code>.env</code> file
              located in the backend directory.
            </p>
          </div>

          <div className="help-section">
            <div className="section-icon">📝</div>
            <h2>Required Settings</h2>
            <p>Add the following configuration to your <code>backend/.env</code> file:</p>
            
            <div className="code-block">
              <div className="code-header">backend/.env</div>
              <pre><code>{`MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host.com
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yoursite.com"
MAIL_FROM_NAME="Prabhupada Annakshetra"`}</code></pre>
            </div>
          </div>

          <div className="help-section">
            <div className="section-icon">🔧</div>
            <h2>Common Email Providers</h2>
            
            <div className="provider-list">
              <div className="provider-card">
                <h3>Gmail</h3>
                <div className="provider-details">
                  <p><strong>MAIL_HOST:</strong> smtp.gmail.com</p>
                  <p><strong>MAIL_PORT:</strong> 587</p>
                  <p><strong>MAIL_ENCRYPTION:</strong> tls</p>
                  <p className="note">
                    Note: You'll need to use an App Password instead of your regular Gmail password.
                    Enable 2FA and generate an App Password in your Google Account settings.
                  </p>
                </div>
              </div>

              <div className="provider-card">
                <h3>Outlook/Office 365</h3>
                <div className="provider-details">
                  <p><strong>MAIL_HOST:</strong> smtp.office365.com</p>
                  <p><strong>MAIL_PORT:</strong> 587</p>
                  <p><strong>MAIL_ENCRYPTION:</strong> tls</p>
                </div>
              </div>

              <div className="provider-card">
                <h3>SendGrid</h3>
                <div className="provider-details">
                  <p><strong>MAIL_HOST:</strong> smtp.sendgrid.net</p>
                  <p><strong>MAIL_PORT:</strong> 587</p>
                  <p><strong>MAIL_USERNAME:</strong> apikey</p>
                  <p><strong>MAIL_PASSWORD:</strong> Your SendGrid API Key</p>
                  <p><strong>MAIL_ENCRYPTION:</strong> tls</p>
                </div>
              </div>

              <div className="provider-card">
                <h3>Mailgun</h3>
                <div className="provider-details">
                  <p><strong>MAIL_HOST:</strong> smtp.mailgun.org</p>
                  <p><strong>MAIL_PORT:</strong> 587</p>
                  <p><strong>MAIL_ENCRYPTION:</strong> tls</p>
                </div>
              </div>
            </div>
          </div>

          <div className="help-section">
            <div className="section-icon">✅</div>
            <h2>Testing Your Configuration</h2>
            <p>After configuring your email settings:</p>
            <ol className="step-list">
              <li>Save your <code>.env</code> file</li>
              <li>Restart your backend server</li>
              <li>Test by making a donation to trigger a confirmation email</li>
              <li>Check your inbox for the confirmation message</li>
            </ol>
          </div>

          <div className="help-section">
            <div className="section-icon">🔍</div>
            <h2>Troubleshooting</h2>
            
            <div className="troubleshooting-list">
              <div className="trouble-item">
                <h4>Emails not sending?</h4>
                <ul>
                  <li>Verify your SMTP credentials are correct</li>
                  <li>Check if your email provider requires an App Password</li>
                  <li>Ensure port 587 or 465 is not blocked by your firewall</li>
                  <li>Check backend logs for specific error messages</li>
                </ul>
              </div>

              <div className="trouble-item">
                <h4>Emails going to spam?</h4>
                <ul>
                  <li>Configure SPF and DKIM records for your domain</li>
                  <li>Use a verified email address in MAIL_FROM_ADDRESS</li>
                  <li>Consider using a professional email service like SendGrid or Mailgun</li>
                </ul>
              </div>

              <div className="trouble-item">
                <h4>Authentication errors?</h4>
                <ul>
                  <li>Double-check your username and password</li>
                  <li>For Gmail, ensure you're using an App Password, not your regular password</li>
                  <li>Verify that "Less secure app access" is enabled (if applicable)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="help-section">
            <div className="section-icon">💡</div>
            <h2>Best Practices</h2>
            <ul className="best-practices">
              <li>Use a dedicated email account for sending application emails</li>
              <li>Never commit your <code>.env</code> file to version control</li>
              <li>Use professional email services for production environments</li>
              <li>Monitor your email sending limits to avoid being blocked</li>
              <li>Keep your email credentials secure and rotate them regularly</li>
            </ul>
          </div>

          <div className="help-cta">
            <h2>Need More Help?</h2>
            <p>
              If you're still experiencing issues with email configuration, please contact
              technical support or consult your hosting provider's documentation.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HelpPage;
