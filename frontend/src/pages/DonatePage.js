import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { donationService, paymentService } from '../services';
import './DonatePage.css';

const DonatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    pan_number: '',
    amount: '',
    donation_type: 'one-time',
    purpose: 'mid-day-meals',
    anonymous: false,
    tax_exemption_certificate: false,
  });

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAmountClick = (amount) => {
    setFormData((prev) => ({ ...prev, amount }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (donationId, amount) => {
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Please check your connection.');
        return;
      }

      const orderData = await paymentService.createOrder(donationId, amount);
      if (!orderData.success) {
        toast.error('Failed to create payment order');
        return;
      }

      const options = {
        key: orderData.data.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'Donation App',
        description: `Donation for ${formData.purpose}`,
        order_id: orderData.data.order_id,
        handler: async (response) => {
          try {
            const verifyData = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success) {
              toast.success('Donation successful! Thank you for your contribution.');
              navigate('/thank-you', { state: { amount: formData.amount } });
            }
          } catch (error) {
            toast.error('Payment verification failed');
            await paymentService.paymentFailed(response.razorpay_order_id, error);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#ff6b35',
        },
        modal: {
          ondismiss: async () => {
            await paymentService.paymentFailed(orderData.data.order_id, { dismissed: true });
            toast.info('Payment cancelled');
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || formData.amount < 1) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    setLoading(true);
    try {
      const response = await donationService.createDonation(formData);
      if (response.success) {
        await handlePayment(response.data.donation_id, formData.amount);
      } else {
        toast.error('Failed to create donation');
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(error.response?.data?.message || 'Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Donate Now - Make a Difference with Your Contribution</title>
        <meta name="description" content="Support our cause by making a donation. Every contribution helps us provide meals, education, and support to those in need." />
        <meta name="keywords" content="donate, donation, charity, support, contribute, help, meals, education" />
        <meta property="og:title" content="Donate Now - Make a Difference" />
        <meta property="og:description" content="Your donation can change lives. Support our mission today." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="donate-page">
        <header className="donate-header">
          <div className="container">
            <h1>Make a Difference Today</h1>
            <p>Your contribution can bring hope and happiness to those in need</p>
          </div>
        </header>

        <div className="donate-content">
          <div className="container">
            <div className="donate-grid">
              <div className="donate-info">
                <h2>Why Donate?</h2>
                <div className="info-card">
                  <h3>🍽️ Mid-Day Meals</h3>
                  <p>Provide nutritious meals to children and support their education</p>
                </div>
                <div className="info-card">
                  <h3>📚 Education Support</h3>
                  <p>Help children access quality education and build a better future</p>
                </div>
                <div className="info-card">
                  <h3>💝 Community Development</h3>
                  <p>Support community programs that create lasting impact</p>
                </div>
                <div className="impact-stats">
                  <h3>Your Impact</h3>
                  <div className="stat-item">
                    <strong>₹500</strong>
                    <span>Feeds 10 children for a week</span>
                  </div>
                  <div className="stat-item">
                    <strong>₹1000</strong>
                    <span>Provides educational supplies for 5 children</span>
                  </div>
                  <div className="stat-item">
                    <strong>₹5000</strong>
                    <span>Supports a child's education for a month</span>
                  </div>
                </div>
              </div>

              <div className="donate-form-container">
                <form className="donate-form" onSubmit={handleSubmit}>
                  <h2>Donation Details</h2>

                  <div className="form-section">
                    <h3>Choose Amount</h3>
                    <div className="amount-buttons">
                      {predefinedAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          className={`amount-btn ${formData.amount == amt ? 'active' : ''}`}
                          onClick={() => handleAmountClick(amt)}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                    <div className="form-group">
                      <label>Custom Amount (₹)</label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter custom amount"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Donation Type</h3>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="donation_type"
                          value="one-time"
                          checked={formData.donation_type === 'one-time'}
                          onChange={handleInputChange}
                        />
                        <span>One-Time Donation</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="donation_type"
                          value="monthly"
                          checked={formData.donation_type === 'monthly'}
                          onChange={handleInputChange}
                        />
                        <span>Monthly Donation</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Purpose</h3>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="mid-day-meals">Mid-Day Meals</option>
                      <option value="education">Education Support</option>
                      <option value="community">Community Development</option>
                      <option value="general">General Donation</option>
                    </select>
                  </div>

                  <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Age</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          min="1"
                          max="120"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="2"
                      ></textarea>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>PAN Number (for 80G certificate)</label>
                      <input
                        type="text"
                        name="pan_number"
                        value={formData.pan_number}
                        onChange={handleInputChange}
                        placeholder="ABCDE1234F"
                        maxLength="10"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="anonymous"
                          checked={formData.anonymous}
                          onChange={handleInputChange}
                        />
                        <span>Make my donation anonymous</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="tax_exemption_certificate"
                          checked={formData.tax_exemption_certificate}
                          onChange={handleInputChange}
                        />
                        <span>I need an 80G tax exemption certificate</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Donate ₹${formData.amount || 0}`}
                  </button>

                  <p className="secure-text">
                    🔒 Your payment is secure and encrypted
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        <footer className="donate-footer">
          <div className="container">
            <p>&copy; 2024 Donation App. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DonatePage;
