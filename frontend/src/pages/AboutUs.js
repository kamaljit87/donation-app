import React from 'react';
import { Helmet } from 'react-helmet-async';
import WelcomeSection from '../components/WelcomeSection';
import InspirationSection from '../components/InspirationSection';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <Helmet>
        <title>About Us - Prabhupada Annakshetra | ISKCON Initiative</title>
        <meta
          name="description"
          content="Learn about Prabhupada Annakshetra, an ISKCON initiative serving society through prasadam distribution and charitable welfare programs."
        />
      </Helmet>

      <div className="about-us-container">
        <WelcomeSection />
        <InspirationSection />
      </div>
    </div>
  );
};

export default AboutUs;
