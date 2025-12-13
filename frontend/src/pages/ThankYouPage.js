import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import './ThankYouPage.css';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount || 0;

  return (
    <>
      <Helmet>
        <title>Thank You for Your Donation - Donation App</title>
        <meta name="description" content="Thank you for your generous donation. Your contribution makes a real difference." />
      </Helmet>

      <div className="thank-you-page">
        <div className="thank-you-card">
          <div className="success-icon"></div>

          <div className="thank-you-content">
            <h1>Thank You for Your Generosity!</h1>
            <p>Your donation has been successfully processed. Your contribution will make a significant difference in the lives of those we serve.</p>

            {amount > 0 && (
              <div className="donation-details">
                <div className="amount-display">₹{amount}</div>
                <div className="amount-label">Donation Amount</div>
              </div>
            )}

            <p>
              Thanks to donors like you, we can continue our mission to provide meals,
              education, and support to those in need. Every contribution counts and
              brings us closer to making a lasting difference.
            </p>
          </div>

          <div className="actions">
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Make Another Donation
            </button>
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              Return to Home
            </button>
          </div>

          <div className="social-share">
            <h3>Share your good deed</h3>
            <div className="social-buttons">
              <button className="social-button btn-facebook" aria-label="Share on Facebook">f</button>
              <button className="social-button btn-twitter" aria-label="Share on Twitter">𝕏</button>
              <button className="social-button btn-whatsapp" aria-label="Share on WhatsApp">W</button>
              <button className="social-button btn-linkedin" aria-label="Share on LinkedIn">in</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYouPage;
