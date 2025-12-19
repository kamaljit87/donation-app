import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const scrollToDonate = () => {
    navigate('/donate');
  };

  const handleInitiativeClick = (section) => {
    navigate('/', { state: { scrollTo: section } });
    setShowDropdown(false);
  };

  return (
    <>
      {/* Social Media Top Bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
          <div className="contact-info">
            <a href="mailto:write2us@annakshetra.org">
              <i className="fas fa-envelope"></i>
              <span>write2us@annakshetra.org</span>
            </a>
            <a href="tel:+918928991161">
              <i className="fas fa-phone"></i>
              <span>+91 89289 91161</span>
            </a>
          </div>
        </div>
      </div>

      <header className="donate-header">
        <nav className="header-nav">
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Srila Prabhupada Annakshetra" className="logo-image" />
            <span>Srila Prabhupada Annakshetra</span>
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/inspiration">Our Inspiration</Link>
            <div 
              className="dropdown"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="dropdown-toggle">
                Our Feeding Initiatives
                <i className="fas fa-chevron-down"></i>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={() => handleInitiativeClick('daily-distribution')}>
                    Daily Food Distribution
                  </button>
                  <button onClick={() => handleInitiativeClick('special-day')}>
                    Make Your Day Special
                  </button>
                  <button onClick={() => handleInitiativeClick('mental-abled')}>
                    Mental Abled Child
                  </button>
                </div>
              )}
            </div>
            <Link to="/contact">Contact Us</Link>
            <button className="donate-button-nav" onClick={scrollToDonate}>
              <i className="fas fa-heart heart-icon"></i>
              Donate Now
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
