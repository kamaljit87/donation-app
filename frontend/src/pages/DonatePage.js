import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { donationService, paymentService } from '../services';
import './DonatePage.css';

const DonatePageNew = () => {
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
    tax_exemption_certificate: true,
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
        <title>Donate Now - HopeFoundation | Feed a Child, Nurture a Dream</title>
        <meta name="description" content="Your donation provides nutritious mid-day meals to underprivileged children, ensuring they have the energy to learn and grow." />
        <meta property="og:title" content="Donate Now - HopeFoundation" />
        <meta property="og:description" content="Feed a Child, Nurture a Dream. Support mid-day meals for underprivileged children." />
      </Helmet>

      {/* Header Navigation */}
      <header className="donate-header">
        <nav className="header-nav">
          <div className="logo">HopeFoundation</div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#impact">Our Impact</a>
            <a href="/admin/login">Admin</a>
            <button className="donate-button-nav" onClick={() => document.getElementById('donation-form').scrollIntoView({ behavior: 'smooth' })}>
              Donate Now
            </button>
          </div>
        </nav>
      </header>

      <div className="donate-page">
        {/* Hero Section */}
        <section className="donate-hero">
          <h1>Feed a Child, Nurture a Dream</h1>
          <p className="hero-subtitle">
            Your donation provides nutritious mid-day meals to underprivileged children,
            ensuring they have the energy to learn and grow.
          </p>

          {/* Statistics */}
          <div className="stats-hero">
            <div className="stat-item">
              <div className="stat-number">2M+</div>
              <div className="stat-label">Children Fed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Donors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₹950</div>
              <div className="stat-label">Feeds a child for 1 month</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Transparent utilization</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <div className="badge-icon">💯</div>
              <div className="badge-label">100%</div>
              <div className="badge-sublabel">Transparent utilization</div>
            </div>
            <div className="trust-badge">
              <div className="badge-icon">🏆</div>
              <div className="badge-label">80G</div>
              <div className="badge-sublabel">Tax exemption certificate</div>
            </div>
            <div className="trust-badge">
              <div className="badge-icon">📧</div>
              <div className="badge-label">Regular Updates</div>
              <div className="badge-sublabel">On your impact</div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="about-section" id="about">
          <div className="about-container">
            <div className="about-content">
              <div className="about-text">
                <h2>About HopeFoundation</h2>
                <p className="about-intro">
                  We are a dedicated non-profit organization committed to ending child hunger 
                  and ensuring every child has access to nutritious meals and quality education.
                </p>
                <p>
                  Since our inception, we've been working tirelessly to provide mid-day meals 
                  to underprivileged children across India. Our mission is simple yet powerful: 
                  no child should go to bed hungry, and no child should miss school because of hunger.
                </p>
                <p>
                  With the support of generous donors like you, we've been able to expand our reach 
                  and impact millions of lives. Every meal we serve is more than just food – it's 
                  hope, it's education, and it's a brighter future.
                </p>
                <div className="about-features">
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <div>
                      <strong>Our Mission</strong>
                      <p>Eliminate child hunger and promote education through nutritious meal programs</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">👁️</span>
                    <div>
                      <strong>Our Vision</strong>
                      <p>A world where every child has the opportunity to learn, grow, and thrive</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💪</span>
                    <div>
                      <strong>Our Values</strong>
                      <p>Transparency, compassion, integrity, and unwavering commitment to children</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="about-image">
                <div className="image-placeholder">
                  <span className="placeholder-icon">🤝</span>
                  <p>Together We Make a Difference</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact Section */}
        <section className="impact-section" id="impact">
          <div className="impact-container">
            <h2>Our Impact</h2>
            <p className="impact-subtitle">See the difference your donations make in the lives of children</p>

            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-icon">🍽️</div>
                <h3>Nutritious Meals</h3>
                <div className="impact-number">2M+</div>
                <p>Mid-day meals served to children every year, ensuring they have the energy to learn</p>
              </div>

              <div className="impact-card">
                <div className="impact-icon">📚</div>
                <h3>Education Support</h3>
                <div className="impact-number">85%</div>
                <p>Increase in school attendance among children enrolled in our meal program</p>
              </div>

              <div className="impact-card">
                <div className="impact-icon">🏫</div>
                <h3>Schools Reached</h3>
                <div className="impact-number">1,200+</div>
                <p>Schools across India partnering with us to ensure no child goes hungry</p>
              </div>

              <div className="impact-card">
                <div className="impact-icon">👨‍👩‍👧‍👦</div>
                <h3>Communities Served</h3>
                <div className="impact-number">500+</div>
                <p>Villages and communities benefiting from our nutrition and education programs</p>
              </div>

              <div className="impact-card">
                <div className="impact-icon">💚</div>
                <h3>Health Improvement</h3>
                <div className="impact-number">92%</div>
                <p>Children showing improved health and nutrition levels within 6 months</p>
              </div>

              <div className="impact-card">
                <div className="impact-icon">🎓</div>
                <h3>Better Performance</h3>
                <div className="impact-number">78%</div>
                <p>Students showing improved academic performance after joining our program</p>
              </div>
            </div>

            <div className="impact-stories">
              <h3>Success Stories</h3>
              <div className="stories-grid">
                <div className="story-card">
                  <div className="story-quote">"</div>
                  <p>
                    Before the mid-day meal program, I used to skip school because there was 
                    no food at home. Now I never miss a day and I'm top of my class!
                  </p>
                  <div className="story-author">- Priya, 10 years old, Maharashtra</div>
                </div>

                <div className="story-card">
                  <div className="story-quote">"</div>
                  <p>
                    The meal program has been life-changing for our village. Children are healthier, 
                    attendance has doubled, and parents can focus on work knowing their kids are fed.
                  </p>
                  <div className="story-author">- Ramesh Kumar, School Teacher, Bihar</div>
                </div>

                <div className="story-card">
                  <div className="story-quote">"</div>
                  <p>
                    My daughter was malnourished and weak. Thanks to the nutritious meals at school, 
                    she's now healthy, energetic, and dreams of becoming a doctor.
                  </p>
                  <div className="story-author">- Lakshmi Devi, Parent, Uttar Pradesh</div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
              <h3 className="section-title">Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Your age"
                    min="1"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Street address"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="State"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Pincode"
                  />
                </div>
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
      </div>
    </>
  );
};

export default DonatePageNew;
