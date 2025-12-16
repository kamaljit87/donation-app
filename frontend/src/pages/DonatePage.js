import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { donationService, paymentService } from '../services';
import ImageGallery from '../components/ImageGallery';
import Gallery from '../components/Gallery';
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
    purpose: 'prasadam-meals',
    anonymous: false,
    tax_exemption_certificate: true,
  });

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

      {/* Header Navigation */}
      <header className="donate-header">
        <nav className="header-nav">
          <div className="logo">
            <img src="/images/logo.png" alt="Srila Prabhupada Annakshetra" className="logo-image" />
            <span>Srila Prabhupada Annakshetra</span>
          </div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#programs">Programs</a>
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
          <h1>No One Should Sleep Hungry</h1>
          <p className="hero-subtitle">
            Free Food Distribution in the Service of Humanity and the Supreme Lord
          </p>
          <p className="hero-quote">
            Serving prasadam with love, dignity, and devotion inspired by the teachings of His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada.
          </p>

          {/* Statistics */}
          <div className="stats-hero">
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Prasadam Meals Served</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Meals in 6 Months</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₹1,100</div>
              <div className="stat-label">Serves 100 prasadam meals</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₹2,500</div>
              <div className="stat-label">Feeds a child for 1 year</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <div className="badge-icon">🍲</div>
              <div className="badge-label">ANNA DAAN</div>
              <div className="badge-sublabel">is Maha Daan</div>
            </div>
            <div className="trust-badge">
              <div className="badge-icon">🙏</div>
              <div className="badge-label">Meals Only</div>
              <div className="badge-sublabel">No cash misuse</div>
            </div>
            <div className="trust-badge">
              <div className="badge-icon">📧</div>
              <div className="badge-label">Photo Updates</div>
              <div className="badge-sublabel">Complete transparency</div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="about-section" id="about">
          <div className="about-container">
            <div className="about-content">
              <div className="about-text">
                <h2>About Srila Prabhupada Annakshetra</h2>
                <p className="about-intro">
                  We are a humble initiative dedicated to serving free food as devotional service.
                </p>
                <p>
                  <strong>"Nobody shall go hungry within a ten mile radius"</strong> - Srila Prabhupada
                </p>
                <p>
                  Inspired by Srila Prabhupada's vision that no one within ten miles of a temple should go hungry, 
                  we serve prasadam with love and humility. At Srila Prabhupada Annakshetra, we believe that annadanam 
                  (offering food) is the highest charity. We serve sanctified, freshly cooked food to the hungry as an 
                  act of devotion and compassion.
                </p>
                <p>
                  Every meal is prepared with care, offered with prayer, and served with dignity.
                </p>
                <div className="about-features">
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <div>
                      <strong>Our Mission</strong>
                      <p>To serve humanity by distributing food sanctified through devotion, restoring dignity, health, and hope to every hungry soul</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🙏</span>
                    <div>
                      <strong>Our Values</strong>
                      <p>Devotion through service • Compassion without discrimination • Transparency and honesty • Respect for every life</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💪</span>
                    <div>
                      <strong>What We Do</strong>
                      <p>Daily free food distribution • Meal support for specially abled children • Meal sponsorship on special occasions</p>
                    </div>
                  </div>
                </div>
                <div className="quote-section">
                  <p className="divine-quote">
                    "If you simply love God, love Krishna, and give people Krishna prasadam, your life will be successful."
                  </p>
                  <p className="quote-author">— His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada 🙏</p>
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

        {/* Gallery Section */}
        <Gallery />

        {/* Image Gallery Section */}
        <ImageGallery />

        {/* Our Programs Section */}
        <section className="impact-section" id="programs">
          <div className="impact-container">
            <h2>Our Programs</h2>
            <p className="impact-subtitle">Every meal is prepared with care, offered with prayer, and served with dignity</p>

            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-icon">🍲</div>
                <h3>Free Food Distribution</h3>
                <div className="impact-number">Daily</div>
                <p>We distribute free, freshly cooked meals to homeless individuals, daily wage workers, elderly without support, and underprivileged children. Food is prepared hygienically and served equally, without discrimination.</p>
              </div>

              <div className="impact-card">
                <div className="impact-icon">🧠</div>
                <h3>Meal Seva for Specially Abled Children</h3>
                <div className="impact-number">₹2,500/year</div>
                <p>Specially abled children require regular nourishment and care. Through meal sponsorship, we ensure daily nutritious food, stability and routine, service with patience and dignity. No money. No materials. Only meals offered with love.</p>
              </div>

              <div className="impact-card">
                <div className="impact-icon">🌸</div>
                <h3>Make Your Special Day Divine</h3>
                <div className="impact-number">₹1,100</div>
                <p>Celebrate birthdays, anniversaries, weddings, or remembrance days by sponsoring 100 prasadam meals. Turn your joy into service. Let the Lord be pleased by feeding His children.</p>
              </div>

              <div className="impact-card">
                <div className="impact-icon">🙌</div>
                <h3>Full Day Sponsorship</h3>
                <div className="impact-number">₹10,000</div>
                <p>Sponsor an entire day of free prasadam distribution. Your one-day sponsorship can feed hundreds of souls and bring divine blessings. Contact us at 8910777090 for special occasions.</p>
              </div>
            </div>

            <div className="impact-stories">
              <h3>How It Works</h3>
              <div className="stories-grid">
                <div className="story-card">
                  <div className="story-quote">1</div>
                  <h4>Choose Your Occasion</h4>
                  <p>
                    Birthday, Anniversary, Wedding, Memorial, or any special day
                  </p>
                </div>

                <div className="story-card">
                  <div className="story-quote">2</div>
                  <h4>Select Sponsorship</h4>
                  <p>
                    Decide the number of meals you wish to offer - from 1 meal to full day sponsorship
                  </p>
                </div>

                <div className="story-card">
                  <div className="story-quote">3</div>
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
            <p>© 2024 Srila Prabhupada Annakshetra. All rights reserved. | Serving with devotion and compassion</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DonatePageNew;
