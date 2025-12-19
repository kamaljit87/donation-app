import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Prabhupada Annakshetra | ISKCON Initiative</title>
        <meta
          name="description"
          content="Learn about Prabhupada Annakshetra, an ISKCON initiative serving society through prasadam distribution and charitable welfare programs."
        />
      </Helmet>

      <Header />

      <div className="about-us-page">
        <div className="about-hero">
          <div className="hero-badge">🙏 About Our Mission</div>
          <h1>Serving Society with <span className="gradient-text">Compassion</span></h1>
          <p className="hero-subtitle">
            An ISKCON initiative dedicated to ending hunger through prasadam distribution
          </p>
        </div>

        <div className="about-content">
          <div className="content-card">
            <div className="card-icon">🌟</div>
            <h2>Welcome to Prabhupada Annakshetra</h2>
            <p>
              Welcome to <strong>Prabhupada Annakshetra</strong>, an ISKCON initiative dedicated to serving 
              society through the distribution of sanctified food (prasadam) and charitable welfare 
              programs inspired by the teachings of His Divine Grace A.C. Bhaktivedanta Swami 
              Srila Prabhupada.
            </p>
            <p>
              By accessing our website, making a donation, or participating in our programs, 
              you agree to the following Terms & Conditions.
            </p>
          </div>

          <div className="content-card featured">
            <div className="card-icon">🕉️</div>
            <h2>Our Vision</h2>
            <p>
              To ensure that no one within our reach goes to bed hungry. We believe that food is not just 
              sustenance for the body, but nourishment for the soul when offered with love and devotion.
            </p>
          </div>

          <div className="content-card">
            <div className="card-icon">❤️</div>
            <h2>What We Do</h2>
            <ul className="feature-list">
              <li>
                <span className="list-icon">🍽️</span>
                <div>
                  <strong>Free Prasadam Distribution</strong>
                  <p>Daily distribution of sanctified vegetarian meals to those in need</p>
                </div>
              </li>
              <li>
                <span className="list-icon">🏫</span>
                <div>
                  <strong>Community Programs</strong>
                  <p>Educational and spiritual programs for holistic development</p>
                </div>
              </li>
              <li>
                <span className="list-icon">🌍</span>
                <div>
                  <strong>Emergency Relief</strong>
                  <p>Rapid response during natural disasters and emergencies</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="cta-section">
            <h2>Inspired by Divine Compassion</h2>
            <p>Learn about the vision of Srila Prabhupada that drives our mission</p>
            <Link to="/inspiration" className="cta-button">
              Discover Our Inspiration →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;
