import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import donationService from '../services/donationService';
import paymentService from '../services/paymentService';
import './DonatePageNew.css';

const DonatePageNew = () => {
  const predefinedAmounts = [1100, 2500, 5000, 10000, 25000];
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const [formData, setFormData] = useState({
    donation_type: 'one-time',
    amount: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    pan_number: '',
    tax_exemption_certificate: false,
    anonymous: false,
  });

  const faqs = [
    {
      question: "How is my donation used?",
      answer: "Every rupee of your donation goes directly toward preparing and distributing nutritious prasadam meals. We maintain 100% transparency and provide photo documentation of all meal distributions. Your donation helps feed the hungry, support specially-abled children, and bring hope to those in need."
    },
    {
      question: "Is my donation tax-deductible?",
      answer: "Yes! We are registered under Section 80G of the Income Tax Act. When you make a donation and provide your PAN number, you will receive an 80G certificate via email within 7 working days. This certificate can be used to claim tax deductions when filing your income tax returns."
    },
    {
      question: "Can I sponsor meals for a special occasion?",
      answer: "Absolutely! You can sponsor meals on birthdays, anniversaries, memorial days, or any special occasion. Choose from our sponsorship options or contact us at +91 89289 91161 to customize your contribution. We'll provide photo documentation of the meals served in your honor."
    },
    {
      question: "How do monthly donations work?",
      answer: "Monthly donations allow you to make a recurring impact. Your chosen amount will be automatically charged each month, ensuring continuous support for our meal distribution programs. You can modify or cancel your monthly donation at any time by contacting us."
    },
    {
      question: "Will I receive updates about my donation?",
      answer: "Yes! We believe in complete transparency. After your donation, you'll receive a thank-you email with your receipt and 80G certificate (if applicable). For larger sponsorships, we also provide photos and updates showing exactly where your donation made a difference."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods through our secure Razorpay gateway including Credit/Debit Cards, UPI, Net Banking, and Wallets. All transactions are encrypted and 100% secure. We only accept donations for food - never cash directly."
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAmountClick = (amount) => {
    setFormData({ ...formData, amount });
  };

  const handlePayment = async (donationId, amount) => {
    try {
      const orderData = await paymentService.createOrder(donationId, amount);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'Srila Prabhupada Annakshetra',
        description: 'Food Donation',
        order_id: orderData.data.order_id,
        handler: async (response) => {
          try {
            const verifyData = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donation_id: donationId,
            });

            if (verifyData.success) {
              toast.success('Payment successful! Thank you for your donation.');
              window.location.href = '/thank-you';
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#FF6B6B',
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

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Donate Now - Support Our Mission | Srila Prabhupada Annakshetra</title>
        <meta name="description" content="Make a difference today. Support our food distribution programs and help feed the hungry with sacred prasadam meals." />
      </Helmet>

      <Header />

      <div className="donate-page-new">
        <div className="donate-page-container">
          {/* Left Column - Content & FAQs */}
          <div className="donate-left-column">
            <div className="donate-hero-content">
              <h1>
                Make a Difference <span className="gradient-text">Today</span>
              </h1>
              <p className="hero-description">
                Your generosity feeds the hungry, brings hope to families, and spreads compassion through sacred prasadam. 
                Every donation creates a ripple of positive change in countless lives.
              </p>

              <div className="impact-highlights">
                <div className="highlight-card">
                  <div className="highlight-icon">🍽️</div>
                  <div className="highlight-content">
                    <h3>Direct Impact</h3>
                    <p>100% of your donation goes to preparing and serving nutritious meals</p>
                  </div>
                </div>
                <div className="highlight-card">
                  <div className="highlight-icon">📸</div>
                  <div className="highlight-content">
                    <h3>Full Transparency</h3>
                    <p>Receive photo documentation of meals served in your name</p>
                  </div>
                </div>
                <div className="highlight-card">
                  <div className="highlight-icon">💝</div>
                  <div className="highlight-content">
                    <h3>Tax Benefits</h3>
                    <p>80G certified - get tax deductions on your donations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Section */}
            <div className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}>
                    <button 
                      className="faq-question"
                      onClick={() => toggleFaq(index)}
                    >
                      <span>{faq.question}</span>
                      <i className={`fas fa-chevron-${expandedFaq === index ? 'up' : 'down'}`}></i>
                    </button>
                    {expandedFaq === index && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Fixed Donation Form */}
          <div className="donate-right-column">
            <div className="fixed-form-wrapper">
              <div className="donation-form-card">
                <h2>Your Contribution</h2>
                
                <form onSubmit={handleSubmit}>
                  {/* Donation Type */}
                  <div className="form-section">
                    <label className="section-label">Donation Type</label>
                    <div className="donation-type-buttons">
                      <label className={`type-button ${formData.donation_type === 'one-time' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="donation_type"
                          value="one-time"
                          checked={formData.donation_type === 'one-time'}
                          onChange={handleInputChange}
                        />
                        <span>One-Time</span>
                      </label>
                      <label className={`type-button ${formData.donation_type === 'monthly' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="donation_type"
                          value="monthly"
                          checked={formData.donation_type === 'monthly'}
                          onChange={handleInputChange}
                        />
                        <span>Monthly</span>
                      </label>
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div className="form-section">
                    <label className="section-label">Select Amount (₹)</label>
                    <div className="amount-grid">
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
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Custom amount"
                      className="custom-amount"
                      min="1"
                      required
                    />
                  </div>

                  {/* Personal Details */}
                  <div className="form-section">
                    <label className="section-label">Your Details</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name *"
                      className="form-input"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address *"
                      className="form-input"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number *"
                      className="form-input"
                      required
                    />
                    <input
                      type="text"
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={handleInputChange}
                      placeholder="PAN Number (for 80G)"
                      className="form-input"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="form-checkboxes">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="tax_exemption_certificate"
                        checked={formData.tax_exemption_certificate}
                        onChange={handleInputChange}
                      />
                      <span>Send me 80G certificate</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleInputChange}
                      />
                      <span>Make donation anonymous</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="submit-btn" disabled={loading}>
                    <i className="fas fa-heart"></i>
                    {loading ? 'Processing...' : 'Donate Securely'}
                  </button>

                  <div className="secure-badge">
                    <i className="fas fa-lock"></i>
                    <span>Secured by Razorpay</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DonatePageNew;
