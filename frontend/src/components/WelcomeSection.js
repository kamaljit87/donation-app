import React from 'react';
import './WelcomeSection.css';

const WelcomeSection = () => {
  return (
    <section className="welcome-section">
      <div className="welcome-content">
        <h1 className="welcome-title">About Us</h1>
        <div className="welcome-text">
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
      </div>
    </section>
  );
};

export default WelcomeSection;
