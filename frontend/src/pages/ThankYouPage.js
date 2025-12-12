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
        <div className="thank-you-container">
          <div className="success-animation">
            <div className="checkmark">✓</div>
          </div>

          <h1>Thank You for Your Generosity!</h1>
          <p className="subtitle">Your donation has been successfully processed</p>

          {amount > 0 && (
            <div className="donation-amount">
              <span className="amount-label">Donation Amount:</span>
              <span className="amount-value">₹{amount}</span>
            </div>
          )}

          <div className="message-box">
            <p>
              Your contribution will make a significant difference in the lives of those we serve.
              We will send you a confirmation email shortly with your donation receipt.
            </p>
          </div>

          <div className="impact-message">
            <h3>Your Impact</h3>
            <p>
              Thanks to donors like you, we can continue our mission to provide meals,
              education, and support to those in need. Every contribution counts and
              brings us closer to making a lasting difference.
            </p>
          </div>

          <div className="action-buttons">
            <button onClick={() => navigate('/')} className="primary-btn">
              Make Another Donation
            </button>
            <button onClick={() => navigate('/')} className="secondary-btn">
              Return to Home
            </button>
          </div>

          <div className="social-share">
            <p>Share your good deed:</p>
            <div className="share-buttons">
              <button className="share-btn facebook">Facebook</button>
              <button className="share-btn twitter">Twitter</button>
              <button className="share-btn linkedin">LinkedIn</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYouPage;
