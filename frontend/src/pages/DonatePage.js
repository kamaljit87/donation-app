import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { donationService, paymentService } from '../services';
import Gallery from '../components/Gallery';
import Header from '../components/Header';
import './DonatePage.css';
import './DonatePageModern.css';

const DonatePageNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    purpose: 'prasadam-meals',
    anonymous: false,
    tax_exemption_certificate: true,
  });

  // Handle scrolling to specific sections
  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  const predefinedAmounts = [1100, 2500, 5000, 10000, 25000];

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
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }

      const orderData = await paymentService.createOrder(donationId, amount);
      if (!orderData.success) {
        toast.error('Failed to create payment order');
        return;
      }

      const options = {
        key: orderData.data.razorpay_key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        order_id: orderData.data.order_id,
        name: 'HopeFoundation',
        description: 'Donation for Mid-Day Meals',
        handler: async (response) => {
          try {
            const verifyData = await paymentService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success) {
              toast.success('Payment successful! Thank you for your donation.');
              navigate('/thank-you', { state: { amount: formData.amount } });
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification error');
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

  return (
    <>
      <Helmet>
        <title>Donate Now - Srila Prabhupada Annakshetra | Feed the Hungry</title>
        <meta name="description" content="Donate by meal only. One meal offered, one soul nourished. Support free prasadam distribution and make your special day divine." />
        <meta property="og:title" content="Donate Now - Srila Prabhupada Annakshetra" />
        <meta property="og:description" content="No one should sleep hungry. Support free prasadam distribution to the needy." />
      </Helmet>

      <Header />

      <div className="donate-page">
        {/* Hero Section */}
        <section className="donate-hero">
          <div className="hero-badge">🙏 Transforming Lives Through Prasadam</div>
          <h1>Every Meal is an Act of <span className="gradient-text">Love</span></h1>
          <p className="hero-subtitle">
            Join us in serving sacred food to those in need. Together, we can end hunger with compassion.
          </p>
          <p className="hero-quote">
            "When you feed the hungry, you're not just giving food—you're offering dignity, hope, and divine grace."
          </p>

          {/* Statistics */}
          <div className="stats-hero">
            <div className="stat-item hover-lift">
              <div className="stat-icon">🍽️</div>
              <div className="stat-number">1M+</div>
              <div className="stat-label">Lives Nourished</div>
            </div>
            <div className="stat-item hover-lift">
              <div className="stat-icon">❤️</div>
              <div className="stat-number">10K+</div>
              <div className="stat-label">Monthly Meals</div>
            </div>
            <div className="stat-item hover-lift">
              <div className="stat-icon">🌟</div>
              <div className="stat-number">100%</div>
              <div className="stat-label">Transparency</div>
            </div>
            <div className="stat-item hover-lift">
              <div className="stat-icon">🙌</div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Distribution</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge glass-card">
              <div className="badge-icon">🍲</div>
              <div className="badge-label">Food, Not Cash</div>
              <div className="badge-sublabel">Direct impact guaranteed</div>
            </div>
            <div className="trust-badge glass-card">
              <div className="badge-icon">📸</div>
              <div className="badge-label">100% Transparent</div>
              <div className="badge-sublabel">Photo proof of every meal</div>
            </div>
            <div className="trust-badge glass-card">
              <div className="badge-icon">🙏</div>
              <div className="badge-label">Sacred Service</div>
              <div className="badge-sublabel">Blessed with devotion</div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <Gallery />

        {/* Donation Form */}
        <div className="donate-container" id="donation-form">
          <h2 className="donation-section-title">Make Your Donation</h2>

          <div className="donate-form-card">
            <form onSubmit={handleSubmit}>
              {/* Donation Type Selection */}
              <div className="donation-type-section">
                <h3 className="section-title">Select Donation Type</h3>
                <div className="donation-type-toggle">
                  <label className={`toggle-option ${formData.donation_type === 'one-time' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="donation_type"
                      value="one-time"
                      checked={formData.donation_type === 'one-time'}
                      onChange={handleInputChange}
                    />
                    <div className="toggle-title">One-Time Donation</div>
                    <div className="toggle-description">Make a single contribution</div>
                  </label>
                  <label className={`toggle-option ${formData.donation_type === 'monthly' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="donation_type"
                      value="monthly"
                      checked={formData.donation_type === 'monthly'}
                      onChange={handleInputChange}
                    />
                    <div className="toggle-title">Monthly Donation</div>
                    <div className="toggle-description">Recurring contribution</div>
                  </label>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="amount-selection">
                <h3 className="section-title">Select Amount (₹)</h3>
                <div className="amount-buttons">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`amount-button ${formData.amount == amt ? 'active' : ''}`}
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
                  placeholder="Enter custom amount"
                  className="custom-amount-input"
                  min="1"
                  required
                />
              </div>

              {/* Personal Information */}
              <div className="donor-info-section">
                <h3 className="section-title">Your Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Your address"
                    />
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="tax-info-section">
                <h3 className="section-title">Tax Information (Optional)</h3>
                <div className="form-group">
                  <label className="form-label">PAN Number (for 80G)</label>
                  <input
                    type="text"
                    name="pan_number"
                    value={formData.pan_number}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="tax_exemption_certificate"
                    checked={formData.tax_exemption_certificate}
                    onChange={handleInputChange}
                  />
                  <span>I would like to receive 80G Tax Exemption Certificate</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleInputChange}
                  />
                  <span>Make this donation anonymous</span>
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Processing...' : 'Proceed to Donate'}
              </button>

              {/* Security Badge */}
              <div className="security-badge">
                <span className="security-icon">🔒</span>
                <span>100% secure payment powered by Razorpay</span>
              </div>
            </form>
          </div>
        </div>

        {/* About Us Section */}
        <section className="about-section" id="about">
          <div className="about-container">
            <div className="about-content">
              <div className="about-text">
                <h2>Feeding Souls, <span className="gradient-text">Transforming Lives</span></h2>
                <p className="about-intro">
                  We're on a mission to end hunger through sacred food distribution—one blessed meal at a time.
                </p>
                <div className="quote-highlight">
                  <div className="quote-mark">"</div>
                  <p className="quote-text">No one within ten miles should go hungry</p>
                  <p className="quote-author">— Srila Prabhupada</p>
                </div>
                <p>
                  Inspired by this timeless vision, we serve nutritious, sanctified prasadam to thousands every day. 
                  Our food isn't just sustenance—it's prepared with devotion, blessed with mantras, and served with 
                  unconditional love.
                </p>
                <p>
                  <strong>Every donation becomes divine action.</strong> You're not just feeding bodies; you're nourishing 
                  souls and restoring faith in humanity.
                </p>
                <div className="about-features">
                  <div className="feature-item glass-card">
                    <span className="feature-icon">🎯</span>
                    <div>
                      <strong>Our Mission</strong>
                      <p>End hunger through compassionate action. Every meal served is a step toward a world where no one sleeps on an empty stomach.</p>
                    </div>
                  </div>
                  <div className="feature-item glass-card">
                    <span className="feature-icon">❤️</span>
                    <div>
                      <strong>Our Values</strong>
                      <p>Unconditional love • Radical transparency • Sacred service • Dignity for all</p>
                    </div>
                  </div>
                  <div className="feature-item glass-card">
                    <span className="feature-icon">👊</span>
                    <div>
                      <strong>Our Impact</strong>
                      <p>10,000+ monthly meals • Year-round support for specially abled children • Special occasion sponsorships</p>
                    </div>
                  </div>
                </div>
                <div className="quote-section glass-card">
                  <div className="quote-icon">✨</div>
                  <p className="divine-quote">
                    "Love God, serve prasadam, transform lives—this is the path to meaningful existence."
                  </p>
                  <p className="quote-author">— Srila Prabhupada 🙏</p>
                </div>
              </div>
              <div className="about-image">
                <div className="image-placeholder">
                  <img src="/images/logo.png" alt="Srila Prabhupada" className="about-logo" />
                  <p>Serving Food as Devotion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Programs Section */}
        <section className="impact-section" id="programs">
          <div className="impact-container">
            <h2>Ways to <span className="gradient-text">Make Impact</span></h2>
            <p className="impact-subtitle">Choose how you want to transform lives through sacred food service</p>

            <div className="impact-grid">
              <div className="impact-card glass-card hover-lift" id="daily-distribution">
                <div className="impact-icon">🍲</div>
                <h3>Daily Food Distribution</h3>
                <div className="impact-number">Ongoing</div>
                <p>Support our daily prasadam service reaching homeless souls, day laborers, elderly without family, and children in need. Every meal served with dignity and devotion.</p>
              </div>

              <div className="impact-card glass-card hover-lift featured-card" id="mental-abled">
                <div className="featured-badge">🌟 Most Popular</div>
                <div className="impact-icon">🧠</div>
                <h3>Mental Abled Child Support</h3>
                <div className="impact-number">₹2,500</div>
                <p>Provide daily nutritious meals to a specially-abled child for an entire year. Give them stability, health, and hope through consistent nourishment.</p>
              </div>

              <div className="impact-card glass-card hover-lift" id="special-day">
                <div className="impact-icon">🌸</div>
                <h3>Make Your Day Special</h3>
                <div className="impact-number">₹1,100</div>
                <p>Turn your special day into divine blessings. Sponsor 100 prasadam meals on birthdays, anniversaries, or memorial days.</p>
              </div>

              <div className="impact-card glass-card hover-lift">
                <div className="impact-icon">🙌</div>
                <h3>Full Day Sponsorship</h3>
                <div className="impact-number">₹10,000+</div>
                <p>Feed hundreds in a single day. Perfect for corporate giving or major celebrations. Includes photo documentation. Call 891-077-7090</p>
              </div>
            </div>

            <div className="impact-stories">
              <h3>Simple. Transparent. <span className="gradient-text">Life-Changing.</span></h3>
              <div className="stories-grid">
                <div className="story-card glass-card">
                  <div className="story-number">1</div>
                  <h4>Choose Your Impact</h4>
                  <p>
                    Select a sponsorship that resonates with your heart and budget
                  </p>
                </div>

                <div className="story-card glass-card">
                  <div className="story-number">2</div>
                  <h4>Make Your Donation</h4>
                  <p>
                    Secure payment through Razorpay. Food only—never cash
                  </p>
                </div>

                <div className="story-card glass-card">
                  <div className="story-number">3</div>
                  <h4>See Your Impact</h4>
                  <p>
                    Receive photos and updates of meals served in your name
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Srila Prabhupada Annakshetra</h3>
              <p>Serving Food as Devotion. Feeding Souls with Love.</p>
              <p className="footer-quote">"Nobody shall go hungry within a ten mile radius" - Srila Prabhupada</p>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p>📞 Call / WhatsApp: 8910777090</p>
              <p>📧 Email: contact@annakshetra.org</p>
              <p>📍 Serving across India with devotion</p>
            </div>
            <div className="footer-section">
              <h4>Transparency & Trust</h4>
              <p>We believe in honest service. Donors receive photos and updates of meal distribution activities.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>©️ 2025 Annakshetra. All rights reserved. | Developed by <a href="https://indraopstech.com" target="_blank" rel="noopener noreferrer">IndraOps Technologies</a></p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DonatePageNew;
