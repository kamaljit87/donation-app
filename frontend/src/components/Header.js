import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const scrollToDonate = () => {
    if (location.pathname === '/') {
      document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#donation-form';
    }
  };

  return (
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
          <Link to="/admin/login">Admin</Link>
          <button className="donate-button-nav" onClick={scrollToDonate}>
            Donate Now
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
