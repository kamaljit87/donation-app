import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <Header />
      <Helmet>
        <title>Contact Us | Annakshetra</title>
        <meta name="description" content="Contact ISKCON Annakshetra for donations, volunteering, or inquiries. Reach us via email, phone, or visit our centers across India." />
      </Helmet>
      <div className="contact-page">
        <div className="container">
          <div className="contact-content">
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows="6"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-button" disabled={submitting}>
                  <i className="fas fa-paper-plane"></i>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <h3>Email Us</h3>
                  <p>write2us@annakshetra.org</p>
                  <p>info@annakshetra.org</p>
                </div>
                <div className="info-card">
                  <div className="info-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <h3>Visit Us</h3>
                  <p>Serving across India</p>
                  <p>with devotion and compassion</p>
                </div>
              </div>
            </div>
            <div className="map-section">
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.857964899839!2d88.5239640751956!3d22.58523407948609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0276e2e2e2e2e3%3A0x7b7b7b7b7b7b7b7b!2sISKCON%2C%20Shapoorji%20Bus%20Terminus%2C%20Ekajul%2C%20Action%20Area%20III%2C%20Newtown%2C%20Kolkata%2C%20Hudarait%2C%20West%20Bengal%20700135!5e0!3m2!1sen!2sin!4v1703340000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ISKCON Annakshetra Location Map"
                ></iframe>
                <div className="hours-row">
                  <span>Monday - Saturday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-row">
                  <span>Sunday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>
              <p className="hours-note">
                <i className="fas fa-info-circle"></i>
                Food distribution operates 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
}

export default ContactUs;
