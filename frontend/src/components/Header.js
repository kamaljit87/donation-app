
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const scrollToDonate = () => {
    navigate('/donate');
  };

  const handleInitiativeClick = (category) => {
    navigate('/initiatives', { state: { category } });
      setDropdownOpen(false);
    setShowDropdown(false);
  };
    // Handle dropdown for both hover (desktop) and click (mobile)
    const handleDropdownToggle = () => setDropdownOpen((open) => !open);
    const handleDropdownClose = () => setDropdownOpen(false);

    // Detect mobile
    const isMobile = window.innerWidth <= 1024;

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Srila Prabhupada Annakshetra - Modern, mobile-friendly food donation platform. Feed the hungry, support sacred service, and join our mission." />
        <title>Srila Prabhupada Annakshetra</title>
      </Helmet>
      {/* Social Media Top Bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="social-links">
            <a href="https://www.facebook.com/profile.php?id=61584742552500" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/annakshetra?igsh=MWRxZGh2M3l4dHo3" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
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
              onMouseEnter={() => { if (window.innerWidth > 1024) setShowDropdown(true); }}
              onMouseLeave={() => { if (window.innerWidth > 1024) setShowDropdown(false); }}
            >
              <button
                className="dropdown-toggle"
                aria-haspopup="true"
                aria-expanded={dropdownOpen || showDropdown}
                onClick={() => setDropdownOpen((v) => !v)}
              >
                Our Feeding Initiatives
                <i className="fas fa-chevron-down"></i>
              </button>
              {(dropdownOpen || showDropdown) && (
                <div
                  className="dropdown-menu"
                  onMouseEnter={() => { if (window.innerWidth > 1024) setShowDropdown(true); }}
                  onMouseLeave={() => { if (window.innerWidth > 1024) setShowDropdown(false); }}
                >
                  <button onClick={() => { navigate('/initiatives/daily-food-distribution'); setDropdownOpen(false); setShowDropdown(false); }}>
                    Daily Food Distribution
                  </button>
                  <button onClick={() => { navigate('/initiatives/make-your-day-special'); setDropdownOpen(false); setShowDropdown(false); }}>
                    Make Your Day Special
                  </button>
                  <button onClick={() => { navigate('/initiatives/mental-abled-child'); setDropdownOpen(false); setShowDropdown(false); }}>
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
