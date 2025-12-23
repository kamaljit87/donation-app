import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Srila Prabhupada Annakshetra</h3>
          <p>Serving Food as Devotion. Feeding Souls with Love.</p>
          <p className="footer-quote">"Nobody shall go hungry within a ten mile radius" - Srila Prabhupada</p>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>📞 Call / WhatsApp: +91 89289 91161</p>
          <p>📞 Support: +91 89107 77090</p>
          <p>📧 Email: write2us@annakshetra.org</p>
          <p>📍 Serving across India with devotion</p>
        </div>
        <div className="footer-section">
          <h4>Transparency & Trust</h4>
          <p>We believe in honest service. Donors receive photos and updates of meal distribution activities.</p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>©️2025 Anna Ksehtra. Developed by <a href="https://indraopstech.com" target="_blank" rel="noopener noreferrer">IndraOpsTech&lt;indraopstech.com&gt;</a></p>
      </div>
    </footer>
  );
};

export default Footer;
